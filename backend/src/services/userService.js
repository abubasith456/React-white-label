import { USE_MONGO } from '../config/env.js'
import { TenantModel, UserModel } from '../db/mongo.js'
import { getTenantLocal } from '../config/tenants.js'

function isAdminTenant(tenant, user) {
  return tenant.adminEmails.includes(user.email)
}

export const userService = {
  async getUserProfile(tenantId, userId) {
    if (USE_MONGO) {
      const user = await UserModel.findOne({ tenantId, id: userId })
      if (!user) {
        throw new Error('User not found')
      }
      
      const tenant = await TenantModel.findOne({ id: tenantId })
      const role = tenant?.adminEmails.includes(user.email) ? 'admin' : 'user'
      
      return {
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
    
    const user = tenant.users.find(u => u.id === userId)
    if (!user) {
      throw new Error('User not found')
    }
    
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: isAdminTenant(tenant, user) ? 'admin' : 'user'
      }
    }
  }
}