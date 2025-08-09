import { Router } from 'express'
import { USE_MONGO } from '../config/env.js'
import { AddressModel, CartModel } from '../db/mongo.js'
import { getTenantLocal } from '../config/tenants.js'
import { requireAuth } from '../middleware/auth.js'
import { nanoid } from 'nanoid'
import { memGetCart, memSetCart, memGetAddresses, memSetAddresses } from '../repository/inMemory.js'

export const cartRouter = Router({ mergeParams: true })
export const addressesRouter = Router({ mergeParams: true })

cartRouter.get('/', requireAuth, async (req, res) => {
  const { tenant } = req.params
  const { userId } = req.session
  if (USE_MONGO) {
    const doc = await CartModel.findOne({ tenantId: tenant, userId })
    return res.json({ items: doc?.items || [] })
  }
  const key = `${tenant}:${userId}`
  const items = memGetCart(key)
  res.json({ items })
})

cartRouter.post('/', requireAuth, async (req, res) => {
  const { tenant } = req.params
  const { userId } = req.session
  const { productId, quantity } = req.body
  if (USE_MONGO) {
    const doc = (await CartModel.findOne({ tenantId: tenant, userId })) || await CartModel.create({ tenantId: tenant, userId, items: [] })
    const existing = doc.items.find(i => i.productId === productId)
    if (existing) existing.quantity += Number(quantity) || 1
    else doc.items.push({ productId, quantity: Number(quantity) || 1 })
    await doc.save()
    return res.json({ items: doc.items })
  }
  const key = `${tenant}:${userId}`
  const items = memGetCart(key)
  const existing = items.find(i => i.productId === productId)
  if (existing) existing.quantity += Number(quantity) || 1
  else items.push({ productId, quantity: Number(quantity) || 1 })
  memSetCart(key, items)
  res.json({ items })
})

cartRouter.delete('/:productId', requireAuth, async (req, res) => {
  const { tenant } = req.params
  const { userId } = req.session
  const { productId } = req.params
  if (USE_MONGO) {
    const doc = (await CartModel.findOne({ tenantId: tenant, userId })) || await CartModel.create({ tenantId: tenant, userId, items: [] })
    doc.items = doc.items.filter(i => i.productId !== productId)
    await doc.save()
    return res.json({ items: doc.items })
  }
  const key = `${tenant}:${userId}`
  const items = memGetCart(key).filter(i => i.productId !== productId)
  memSetCart(key, items)
  res.json({ items })
})

addressesRouter.get('/', requireAuth, async (req, res) => {
  const { tenant } = req.params
  const { userId } = req.session
  if (USE_MONGO) {
    const list = await AddressModel.find({ tenantId: tenant, userId })
    return res.json({ addresses: list })
  }
  const key = `${tenant}:${userId}`
  res.json({ addresses: memGetAddresses(key) })
})

addressesRouter.post('/', requireAuth, async (req, res) => {
  const { tenant } = req.params
  const { userId } = req.session
  if (USE_MONGO) {
    const address = await AddressModel.create({ tenantId: tenant, userId, id: nanoid(), ...req.body })
    return res.json({ address })
  }
  const key = `${tenant}:${userId}`
  const list = memGetAddresses(key)
  const address = { id: nanoid(), ...req.body }
  list.push(address)
  memSetAddresses(key, list)
  res.json({ address })
})

addressesRouter.put('/:id', requireAuth, async (req, res) => {
  const { tenant, id } = req.params
  const { userId } = req.session
  if (USE_MONGO) {
    const updated = await AddressModel.findOneAndUpdate({ tenantId: tenant, userId, id }, req.body, { new: true })
    if (!updated) return res.status(404).json({ error: 'Not found' })
    return res.json({ address: updated })
  }
  const key = `${tenant}:${userId}`
  const list = memGetAddresses(key)
  const idx = list.findIndex(a => a.id === id)
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  list[idx] = { ...list[idx], ...req.body }
  memSetAddresses(key, list)
  res.json({ address: list[idx] })
})

addressesRouter.delete('/:id', requireAuth, async (req, res) => {
  const { tenant, id } = req.params
  const { userId } = req.session
  if (USE_MONGO) {
    await AddressModel.deleteOne({ tenantId: tenant, userId, id })
    return res.json({ ok: true })
  }
  const key = `${tenant}:${userId}`
  const list = memGetAddresses(key).filter(a => a.id !== id)
  memSetAddresses(key, list)
  res.json({ ok: true })
})