import { USE_MONGO } from '../config/env.js'
import { sessions } from '../repository/inMemory.js'
import { TenantModel, UserModel } from '../db/mongo.js'
import { getTenantLocal } from '../config/tenants.js'

export function bindSession(req, _res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  const session = token && sessions.get(token)
  if (session) req.session = session
  next()
}

export async function requireAuth(req, res, next) {
  if (!req.session) return res.status(401).json({ error: 'Unauthorized' })
  next()
}

export async function requireAdmin(req, res, next) {
  if (!req.session) return res.status(401).json({ error: 'Unauthorized' })
  const tenantId = req.params.tenant
  const userId = req.session.userId
  if (USE_MONGO) {
    const t = await TenantModel.findOne({ id: tenantId })
    const user = await UserModel.findOne({ tenantId, id: userId })
    if (!t || !user || !t.adminEmails.includes(user.email)) return res.status(403).json({ error: 'Forbidden' })
    return next()
  }
  const ten = getTenantLocal(tenantId)
  const user = ten?.users.find(u => u.id === userId)
  if (!ten || !user || !ten.adminEmails.includes(user.email)) return res.status(403).json({ error: 'Forbidden' })
  next()
}