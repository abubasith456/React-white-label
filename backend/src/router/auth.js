import { Router } from 'express'
import { nanoid } from 'nanoid'
import { USE_MONGO } from '../config/env.js'
import { TenantModel, UserModel } from '../db/mongo.js'
import { getTenantLocal } from '../config/tenants.js'
import { sessions } from '../repository/inMemory.js'

export const authRouter = Router({ mergeParams: true })

function isAdminTenant(tenant, user) {
  return tenant.adminEmails.includes(user.email)
}

authRouter.post('/register', async (req, res) => {
  const { tenant } = req.params
  const { name, email, password } = req.body
  if (USE_MONGO) {
    const existing = await UserModel.findOne({ tenantId: tenant, email })
    if (existing) return res.status(400).json({ error: 'Email already exists' })
    const user = await UserModel.create({ tenantId: tenant, id: nanoid(), name, email, password })
    const token = nanoid(); sessions.set(token, { tenantId: tenant, userId: user.id })
    const tenantDoc = await TenantModel.findOne({ id: tenant })
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: tenantDoc?.adminEmails.includes(user.email) ? 'admin' : 'user' } })
  }
  const ten = getTenantLocal(tenant); if (!ten) return res.status(404).json({ error: 'Unknown tenant' })
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' })
  if (ten.users.find(u => u.email === email)) return res.status(400).json({ error: 'Email already exists' })
  const user = { id: nanoid(), name, email, password }
  ten.users.push(user)
  const token = nanoid(); sessions.set(token, { tenantId: ten.id, userId: user.id })
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: isAdminTenant(ten, user) ? 'admin' : 'user' } })
})

authRouter.post('/login', async (req, res) => {
  const { tenant } = req.params
  const { email, password } = req.body
  if (USE_MONGO) {
    const user = await UserModel.findOne({ tenantId: tenant, email, password })
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })
    const token = nanoid(); sessions.set(token, { tenantId: tenant, userId: user.id })
    const tenantDoc = await TenantModel.findOne({ id: tenant })
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: tenantDoc?.adminEmails.includes(user.email) ? 'admin' : 'user' } })
  }
  const ten = getTenantLocal(tenant); if (!ten) return res.status(404).json({ error: 'Unknown tenant' })
  const user = ten.users.find(u => u.email === email && u.password === password)
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })
  const token = nanoid(); sessions.set(token, { tenantId: ten.id, userId: user.id })
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: isAdminTenant(ten, user) ? 'admin' : 'user' } })
})

authRouter.post('/forgot', (req, res) => {
  res.json({ ok: true })
})

authRouter.get('/me', async (req, res) => {
  const { tenant } = req.params
  const session = req.session
  if (USE_MONGO) {
    const user = await UserModel.findOne({ tenantId: tenant, id: session.userId })
    if (!user) return res.status(404).json({ error: 'Not found' })
    const t = await TenantModel.findOne({ id: tenant })
    const role = t?.adminEmails.includes(user.email) ? 'admin' : 'user'
    return res.json({ user: { id: user.id, name: user.name, email: user.email, role } })
  }
  const t = getTenantLocal(tenant)
  const user = t?.users.find(u => u.id === session.userId)
  if (!t || !user) return res.status(404).json({ error: 'Not found' })
  const role = t.adminEmails.includes(user.email) ? 'admin' : 'user'
  res.json({ user: { id: user.id, name: user.name, email: user.email, role } })
})