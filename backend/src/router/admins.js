import { Router } from 'express'
import { USE_MONGO } from '../config/env.js'
import { TenantModel, UserModel } from '../db/mongo.js'
import { getTenantLocal } from '../config/tenants.js'
import { requireAdmin } from '../middleware/auth.js'

export const adminsRouter = Router({ mergeParams: true })

adminsRouter.get('/', requireAdmin, async (req, res) => {
  const { tenant } = req.params
  if (USE_MONGO) {
    const ten = await TenantModel.findOne({ id: tenant })
    return res.json({ admins: ten?.adminEmails || [] })
  }
  const ten = getTenantLocal(tenant)
  res.json({ admins: ten?.adminEmails || [] })
})

adminsRouter.post('/', requireAdmin, async (req, res) => {
  const { tenant } = req.params
  const { email } = req.body
  if (!email) return res.status(400).json({ error: 'Missing email' })
  if (USE_MONGO) {
    const ten = await TenantModel.findOne({ id: tenant })
    if (!ten.adminEmails.includes(email)) { ten.adminEmails.push(email); await ten.save() }
    return res.json({ admins: ten.adminEmails })
  }
  const ten = getTenantLocal(tenant)
  if (!ten.adminEmails.includes(email)) ten.adminEmails.push(email)
  res.json({ admins: ten.adminEmails })
})

adminsRouter.delete('/', requireAdmin, async (req, res) => {
  const { tenant } = req.params
  const { email } = req.body
  if (!email) return res.status(400).json({ error: 'Missing email' })
  if (USE_MONGO) {
    const ten = await TenantModel.findOne({ id: tenant })
    ten.adminEmails = ten.adminEmails.filter(e => e !== email)
    await ten.save()
    return res.json({ admins: ten.adminEmails })
  }
  const ten = getTenantLocal(tenant)
  ten.adminEmails = ten.adminEmails.filter(e => e !== email)
  res.json({ admins: ten.adminEmails })
})