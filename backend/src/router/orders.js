import { Router } from 'express'
import { USE_MONGO } from '../config/env.js'
import { AddressModel, CartModel, OrderModel, ProductModel, TenantModel, UserModel } from '../db/mongo.js'
import { requireAdmin, requireAuth } from '../middleware/auth.js'
import { getTenantLocal } from '../config/tenants.js'
import { memGetCart, memSetCart, memSaveOrder, memListOrders, memGetOrder, memGetOrderAny, memListAllOrders, memUpdateOrderStatus } from '../repository/inMemory.js'
import { nanoid } from 'nanoid'
import PDFDocument from 'pdfkit'

export const ordersRouter = Router({ mergeParams: true })
export const adminOrdersRouter = Router({ mergeParams: true })

ordersRouter.get('/', requireAuth, async (req, res) => {
  const { tenant } = req.params
  const { userId } = req.session
  if (USE_MONGO) {
    const orders = await OrderModel.find({ tenantId: tenant, userId }).sort({ createdAt: -1 })
    return res.json({ orders })
  }
  res.json({ orders: memListOrders(tenant, userId) })
})

ordersRouter.get('/:id', requireAuth, async (req, res) => {
  const { tenant, id } = req.params
  const { userId } = req.session
  if (USE_MONGO) {
    const order = await OrderModel.findOne({ tenantId: tenant, userId, id })
    if (!order) return res.status(404).json({ error: 'Not found' })
    return res.json({ order })
  }
  const order = memGetOrder(tenant, userId, id)
  if (!order) return res.status(404).json({ error: 'Not found' })
  res.json({ order })
})

ordersRouter.post('/', requireAuth, async (req, res) => {
  const { tenant } = req.params
  const { userId } = req.session
  const { addressId } = req.body
  // gather cart
  let items = []
  if (USE_MONGO) {
    const cart = await CartModel.findOne({ tenantId: tenant, userId })
    const prods = await ProductModel.find({ tenantId: tenant })
    const idToProd = new Map(prods.map(p => [p.id, p]))
    items = (cart?.items || []).map(i => ({ productId: i.productId, quantity: i.quantity, price: idToProd.get(i.productId)?.price || 0, name: idToProd.get(i.productId)?.name || 'Product' }))
    const total = items.reduce((s, it) => s + it.price * it.quantity, 0)
    const addr = await AddressModel.findOne({ tenantId: tenant, userId, id: addressId })
    const order = await OrderModel.create({ tenantId: tenant, userId, id: nanoid(), addressId, address: addr ? { id: addr.id, line1: addr.line1, line2: addr.line2, city: addr.city, state: addr.state, postalCode: addr.postalCode, country: addr.country } : undefined, items, total, status: 'created' })
    await CartModel.deleteOne({ tenantId: tenant, userId })
    return res.json({ order })
  }
  const t = getTenantLocal(tenant); if (!t) return res.status(404).json({ error: 'Unknown tenant' })
  const key = `${tenant}:${userId}`
  const memItems = memGetCart(key)
  const idToProd = new Map(t.products.map(p => [p.id, p]))
  items = memItems.map(i => ({ productId: i.productId, quantity: i.quantity, price: idToProd.get(i.productId)?.price || 0, name: idToProd.get(i.productId)?.name || 'Product' }))
  const total = items.reduce((s, it) => s + it.price * it.quantity, 0)
  const addrList = memGetAddresses(key)
  const addr = addrList.find(a => a.id === addressId)
  const order = { tenantId: tenant, userId, id: nanoid(), addressId, address: addr ? { id: addr.id, line1: addr.line1, line2: addr.line2, city: addr.city, state: addr.state, postalCode: addr.postalCode, country: addr.country } : undefined, items, total, status: 'created', createdAt: new Date() }
  memSaveOrder(order)
  memSetCart(key, [])
  res.json({ order })
})

adminOrdersRouter.get('/', requireAdmin, async (req, res) => {
  const { tenant } = req.params
  if (USE_MONGO) {
    const tenantDoc = await TenantModel.findOne({ id: tenant })
    if (!tenantDoc) return res.status(404).json({ error: 'Unknown tenant' })
    const orders = await OrderModel.find({ tenantId: tenant }).sort({ createdAt: -1 })
    return res.json({ orders })
  }
  const t = getTenantLocal(tenant)
  if (!t) return res.status(404).json({ error: 'Unknown tenant' })
  return res.json({ orders: memListAllOrders(tenant) })
})

adminOrdersRouter.put('/:id/status', requireAdmin, async (req, res) => {
  const { tenant, id } = req.params
  const { status } = req.body
  const allowed = ['created','packed','shipped','delivered']
  if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' })
  if (USE_MONGO) {
    const order = await OrderModel.findOneAndUpdate({ tenantId: tenant, id }, { status }, { new: true })
    if (!order) return res.status(404).json({ error: 'Not found' })
    return res.json({ order })
  }
  const order = memUpdateOrderStatus(tenant, id, status)
  if (!order) return res.status(404).json({ error: 'Not found' })
  res.json({ order })
})

ordersRouter.get('/:id/invoice', requireAuth, async (req, res) => {
  const { tenant, id } = req.params
  const { userId } = req.session
  let order
  if (USE_MONGO) {
    order = await OrderModel.findOne({ tenantId: tenant, id })
    const t = await TenantModel.findOne({ id: tenant })
    const user = await UserModel.findOne({ tenantId: tenant, id: userId })
    const isAdmin = !!(t && user && t.adminEmails.includes(user.email))
    if (!order) return res.status(404).json({ error: 'Not found' })
    if (!isAdmin && order.userId !== userId) return res.status(403).json({ error: 'Forbidden' })
  } else {
    order = memGetOrder(tenant, userId, id) || memGetOrderAny(tenant, id)
    if (!order) return res.status(404).json({ error: 'Not found' })
  }

  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', `inline; filename=invoice-${order.id}.pdf`)
  const doc = new PDFDocument({ size: 'A4', margin: 50 })
  doc.pipe(res)
  doc.fontSize(20).text(`Invoice #${order.id}`)
  doc.moveDown()
  doc.fontSize(12).text(`Date: ${new Date(order.createdAt).toLocaleString()}`)
  doc.text(`Tenant: ${tenant}`)
  if (order.address) {
    doc.text('Ship To:')
    doc.text(`${order.address.line1}${order.address.line2 ? ', ' + order.address.line2 : ''}`)
    doc.text(`${order.address.city}, ${order.address.state} ${order.address.postalCode}`)
    doc.text(`${order.address.country}`)
  }
  doc.moveDown()
  doc.text('Items:')
  order.items.forEach((it) => {
    doc.text(`${it.name} x${it.quantity} - $${(it.price * it.quantity).toFixed(2)}`)
  })
  doc.moveDown()
  doc.fontSize(14).text(`Total: $${order.total.toFixed ? order.total.toFixed(2) : order.total}`)
  doc.end()
})