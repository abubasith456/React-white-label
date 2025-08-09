import { Router } from 'express'
import { USE_MONGO } from '../config/env.js'
import { CategoryModel, ProductModel, TenantModel, UserModel } from '../db/mongo.js'
import { getTenantLocal } from '../config/tenants.js'
import { requireAdmin } from '../middleware/auth.js'
import { nanoid } from 'nanoid'

export const productsRouter = Router({ mergeParams: true })
export const categoriesRouter = Router({ mergeParams: true })

productsRouter.get('/', async (req, res) => {
  const { tenant } = req.params
  if (USE_MONGO) {
    const list = await ProductModel.find({ tenantId: tenant })
    return res.json({ products: list })
  }
  const t = getTenantLocal(tenant); if (!t) return res.status(404).json({ error: 'Unknown tenant' })
  res.json({ products: t.products })
})

productsRouter.post('/', requireAdmin, async (req, res) => {
  const { tenant } = req.params
  const { name, description, price, image, categoryId } = req.body
  if (USE_MONGO) {
    const product = await ProductModel.create({ tenantId: tenant, id: nanoid(), name, description: description || '', price: Number(price) || 0, image: image || '', categoryId })
    return res.json({ product })
  }
  const t = getTenantLocal(tenant); if (!t) return res.status(404).json({ error: 'Unknown tenant' })
  const product = { id: nanoid(), name, description: description || '', price: Number(price) || 0, image: image || '', categoryId }
  t.products.push(product)
  res.json({ product })
})

productsRouter.delete('/:id', requireAdmin, async (req, res) => {
  const { tenant, id } = req.params
  if (USE_MONGO) {
    await ProductModel.deleteOne({ tenantId: tenant, id })
    return res.json({ ok: true })
  }
  const t = getTenantLocal(tenant); if (!t) return res.status(404).json({ error: 'Unknown tenant' })
  t.products = t.products.filter(p => p.id !== id)
  res.json({ ok: true })
})

categoriesRouter.get('/', async (req, res) => {
  const { tenant } = req.params
  if (USE_MONGO) {
    const list = await CategoryModel.find({ tenantId: tenant })
    return res.json({ categories: list })
  }
  const t = getTenantLocal(tenant); if (!t) return res.status(404).json({ error: 'Unknown tenant' })
  res.json({ categories: t.categories })
})

categoriesRouter.post('/', requireAdmin, async (req, res) => {
  const { tenant } = req.params
  const { name } = req.body
  if (USE_MONGO) {
    const category = await CategoryModel.create({ tenantId: tenant, id: nanoid(), name })
    return res.json({ category })
  }
  const t = getTenantLocal(tenant); if (!t) return res.status(404).json({ error: 'Unknown tenant' })
  const category = { id: nanoid(), name }
  t.categories.push(category)
  res.json({ category })
})