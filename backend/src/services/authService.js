import { nanoid } from 'nanoid'
import { USE_MONGO } from '../config/env.js'
import { TenantModel, UserModel } from '../db/mongo.js'
import { getTenantLocal } from '../config/tenants.js'
import { sessions } from '../repository/inMemory.js'

function isAdminTenant(tenant, user) {
  return tenant.adminEmails.includes(user.email)
}

export const authService = {
  async register(tenantId, { name, email, password }) {
    if (USE_MONGO) {
      const existing = await UserModel.findOne({ tenantId, email })
      if (existing) {
        throw new Error('Email already exists')
      }
      
      const user = await UserModel.create({ 
        tenantId, 
        id: nanoid(), 
        name, 
        email, 
        password 
      })
      
      const token = nanoid()
      sessions.set(token, { tenantId, userId: user.id })
      
      const tenantDoc = await TenantModel.findOne({ id: tenantId })
      const role = tenantDoc?.adminEmails.includes(user.email) ? 'admin' : 'user'
      
      return {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role
        }
      }
    }
    
    const tenant = getTenantLocal(tenantId)
    if (!tenant) {
      throw new Error('Unknown tenant')
    }
    
    if (!name || !email || !password) {
      throw new Error('Missing fields')
    }
    
    if (tenant.users.find(u => u.email === email)) {
      throw new Error('Email already exists')
    }
    
    const user = { id: nanoid(), name, email, password }
    tenant.users.push(user)
    
    const token = nanoid()
    sessions.set(token, { tenantId: tenant.id, userId: user.id })
    
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: isAdminTenant(tenant, user) ? 'admin' : 'user'
      }
    }
  },

  async login(tenantId, { email, password }) {
    if (USE_MONGO) {
      const user = await UserModel.findOne({ tenantId, email, password })
      if (!user) {
        throw new Error('Invalid credentials')
      }
      
      const token = nanoid()
      sessions.set(token, { tenantId, userId: user.id })
      
      const tenantDoc = await TenantModel.findOne({ id: tenantId })
      const role = tenantDoc?.adminEmails.includes(user.email) ? 'admin' : 'user'
      
      return {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role
        }
      }
    }
    
    const tenant = getTenantLocal(tenantId)
    if (!tenant) {
      throw new Error('Unknown tenant')
    }
    
    const user = tenant.users.find(u => u.email === email && u.password === password)
    if (!user) {
      throw new Error('Invalid credentials')
    }
    
    const token = nanoid()
    sessions.set(token, { tenantId: tenant.id, userId: user.id })
    
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: isAdminTenant(tenant, user) ? 'admin' : 'user'
      }
    }
  },

  forgotPassword() {
    // Placeholder for forgot password functionality
    return { message: 'Password reset request received. Check your email for instructions.' }
  }
}