import express from 'express'
import cors from 'cors'
import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { nanoid } from 'nanoid'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const __dirname = dirname(fileURLToPath(import.meta.url))
const configPath = join(__dirname, 'config', 'tenants.json')
const raw = readFileSync(configPath, 'utf-8')
const config = JSON.parse(raw)

const useMongo = !!process.env.MONGODB_URI

// Mongo models
let TenantModel, UserModel, CategoryModel, ProductModel, AddressModel, CartModel, OrderModel

async function connectMongo() {
  if (!useMongo) return
  await mongoose.connect(process.env.MONGODB_URI)
  const tenantSchema = new mongoose.Schema({ id: String, name: String, branding: Object, strings: Object, adminEmails: [String] })
  const userSchema = new mongoose.Schema({ tenantId: String, id: String, name: String, email: String, password: String })
  const categorySchema = new mongoose.Schema({ tenantId: String, id: String, name: String })
  const productSchema = new mongoose.Schema({ tenantId: String, id: String, name: String, description: String, price: Number, image: String, categoryId: String })
  const addressSchema = new mongoose.Schema({ tenantId: String, userId: String, id: String, line1: String, line2: String, city: String, state: String, postalCode: String, country: String })
  const cartSchema = new mongoose.Schema({ tenantId: String, userId: String, items: [{ productId: String, quantity: Number }] })
  const orderSchema = new mongoose.Schema({
    tenantId: String,
    userId: String,
    id: String,
    addressId: String,
    items: [{ productId: String, quantity: Number, price: Number, name: String }],
    total: Number,
    status: { type: String, default: 'created' },
    createdAt: { type: Date, default: Date.now }
  })

  TenantModel = mongoose.model('Tenant', tenantSchema)
  UserModel = mongoose.model('User', userSchema)
  CategoryModel = mongoose.model('Category', categorySchema)
  ProductModel = mongoose.model('Product', productSchema)
  AddressModel = mongoose.model('Address', addressSchema)
  CartModel = mongoose.model('Cart', cartSchema)
  OrderModel = mongoose.model('Order', orderSchema)
}

async function seedFromConfig() {
  if (!useMongo) return
  await TenantModel.deleteMany({})
  await UserModel.deleteMany({})
  await CategoryModel.deleteMany({})
  await ProductModel.deleteMany({})

  for (const tenantId of Object.keys(config.tenants)) {
    const t = config.tenants[tenantId]
    await TenantModel.create({ id: t.id, name: t.name, branding: t.branding, strings: t.strings, adminEmails: t.adminEmails })
    for (const u of t.users) await UserModel.create({ tenantId: t.id, ...u })
    for (const c of t.categories) await CategoryModel.create({ tenantId: t.id, ...c })
    for (const p of t.products) await ProductModel.create({ tenantId: t.id, ...p })
  }
}

const sessions = new Map()

function getTenantLocal(tenantId) {
  return config.tenants[tenantId] || null
}

function isAdminTenant(tenant, user) {
  return tenant.adminEmails.includes(user.email)
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  const session = token && sessions.get(token)
  if (!session) return res.status(401).json({ error: 'Unauthorized' })
  req.session = session
  next()
}

app.get('/api/:tenant/config', async (req, res) => {
  const { tenant } = req.params
  if (useMongo) {
    const t = await TenantModel.findOne({ id: tenant })
    if (!t) return res.status(404).json({ error: 'Unknown tenant' })
    return res.json({ id: t.id, name: t.name, branding: t.branding, strings: t.strings })
  }
  const t = getTenantLocal(tenant)
  if (!t) return res.status(404).json({ error: 'Unknown tenant' })
  const { name, branding, strings } = t
  res.json({ id: t.id, name, branding, strings })
})

app.post('/api/:tenant/auth/register', async (req, res) => {
  const { tenant } = req.params
  const { name, email, password } = req.body
  if (useMongo) {
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

app.post('/api/:tenant/auth/login', async (req, res) => {
  const { tenant } = req.params
  const { email, password } = req.body
  if (useMongo) {
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

app.post('/api/:tenant/auth/forgot', (req, res) => {
  res.json({ ok: true })
})

app.get('/api/:tenant/products', async (req, res) => {
  const { tenant } = req.params
  if (useMongo) {
    const list = await ProductModel.find({ tenantId: tenant })
    return res.json({ products: list })
  }
  const t = getTenantLocal(tenant); if (!t) return res.status(404).json({ error: 'Unknown tenant' })
  res.json({ products: t.products })
})

app.post('/api/:tenant/products', authMiddleware, async (req, res) => {
  const { tenant } = req.params
  const { name, description, price, image, categoryId } = req.body
  if (useMongo) {
    const product = await ProductModel.create({ tenantId: tenant, id: nanoid(), name, description: description || '', price: Number(price) || 0, image: image || '', categoryId })
    return res.json({ product })
  }
  const t = getTenantLocal(tenant); if (!t) return res.status(404).json({ error: 'Unknown tenant' })
  const session = req.session
  const user = t.users.find(u => u.id === session.userId)
  if (!isAdminTenant(t, user)) return res.status(403).json({ error: 'Forbidden' })
  const product = { id: nanoid(), name, description: description || '', price: Number(price) || 0, image: image || '', categoryId }
  t.products.push(product)
  res.json({ product })
})

app.delete('/api/:tenant/products/:id', authMiddleware, async (req, res) => {
  const { tenant, id } = req.params
  if (useMongo) {
    await ProductModel.deleteOne({ tenantId: tenant, id })
    return res.json({ ok: true })
  }
  const t = getTenantLocal(tenant); if (!t) return res.status(404).json({ error: 'Unknown tenant' })
  const session = req.session
  const user = t.users.find(u => u.id === session.userId)
  if (!isAdminTenant(t, user)) return res.status(403).json({ error: 'Forbidden' })
  t.products = t.products.filter(p => p.id !== id)
  res.json({ ok: true })
})

app.get('/api/:tenant/categories', async (req, res) => {
  const { tenant } = req.params
  if (useMongo) {
    const list = await CategoryModel.find({ tenantId: tenant })
    return res.json({ categories: list })
  }
  const t = getTenantLocal(tenant); if (!t) return res.status(404).json({ error: 'Unknown tenant' })
  res.json({ categories: t.categories })
})

app.post('/api/:tenant/categories', authMiddleware, async (req, res) => {
  const { tenant } = req.params
  const { name } = req.body
  if (useMongo) {
    const category = await CategoryModel.create({ tenantId: tenant, id: nanoid(), name })
    return res.json({ category })
  }
  const t = getTenantLocal(tenant); if (!t) return res.status(404).json({ error: 'Unknown tenant' })
  const session = req.session
  const user = t.users.find(u => u.id === session.userId)
  if (!isAdminTenant(t, user)) return res.status(403).json({ error: 'Forbidden' })
  const category = { id: nanoid(), name }
  t.categories.push(category)
  res.json({ category })
})

app.get('/api/:tenant/users', authMiddleware, async (req, res) => {
  const { tenant } = req.params
  if (useMongo) {
    const list = await UserModel.find({ tenantId: tenant }).select('id name email')
    return res.json({ users: list })
  }
  const t = getTenantLocal(tenant); if (!t) return res.status(404).json({ error: 'Unknown tenant' })
  const session = req.session
  const user = t.users.find(u => u.id === session.userId)
  if (!isAdminTenant(t, user)) return res.status(403).json({ error: 'Forbidden' })
  res.json({ users: t.users.map(u => ({ id: u.id, name: u.name, email: u.email })) })
})

app.get('/api/:tenant/cart', authMiddleware, async (req, res) => {
  const { tenant } = req.params
  const { userId } = req.session
  if (useMongo) {
    const doc = await CartModel.findOne({ tenantId: tenant, userId })
    return res.json({ items: doc?.items || [] })
  }
  const key = `${tenant}:${userId}`
  const items = memGetCart(key)
  res.json({ items })
})

app.post('/api/:tenant/cart', authMiddleware, async (req, res) => {
  const { tenant } = req.params
  const { userId } = req.session
  const { productId, quantity } = req.body
  if (useMongo) {
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

app.delete('/api/:tenant/cart/:productId', authMiddleware, async (req, res) => {
  const { tenant } = req.params
  const { userId } = req.session
  const { productId } = req.params
  if (useMongo) {
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

app.delete('/api/:tenant/cart', authMiddleware, async (req, res) => {
  const { tenant } = req.params
  const { userId } = req.session
  if (useMongo) {
    await CartModel.deleteOne({ tenantId: tenant, userId })
    return res.json({ ok: true })
  }
  const key = `${tenant}:${userId}`
  memSetCart(key, [])
  res.json({ ok: true })
})

// Orders
app.post('/api/:tenant/orders', authMiddleware, async (req, res) => {
  const { tenant } = req.params
  const { userId } = req.session
  const { addressId } = req.body

  // gather cart
  let items = []
  if (useMongo) {
    const cart = await CartModel.findOne({ tenantId: tenant, userId })
    const prods = await ProductModel.find({ tenantId: tenant })
    const idToProd = new Map(prods.map(p => [p.id, p]))
    items = (cart?.items || []).map(i => ({ productId: i.productId, quantity: i.quantity, price: idToProd.get(i.productId)?.price || 0, name: idToProd.get(i.productId)?.name || 'Product' }))
    const total = items.reduce((s, it) => s + it.price * it.quantity, 0)
    const order = await OrderModel.create({ tenantId: tenant, userId, id: nanoid(), addressId, items, total, status: 'created' })
    await CartModel.deleteOne({ tenantId: tenant, userId })
    return res.json({ order })
  }
  // in-memory
  const t = getTenantLocal(tenant); if (!t) return res.status(404).json({ error: 'Unknown tenant' })
  const key = `${tenant}:${userId}`
  const memItems = memGetCart(key)
  const idToProd = new Map(t.products.map(p => [p.id, p]))
  items = memItems.map(i => ({ productId: i.productId, quantity: i.quantity, price: idToProd.get(i.productId)?.price || 0, name: idToProd.get(i.productId)?.name || 'Product' }))
  const total = items.reduce((s, it) => s + it.price * it.quantity, 0)
  const order = { tenantId: tenant, userId, id: nanoid(), addressId, items, total, status: 'created', createdAt: new Date() }
  memSaveOrder(order)
  memSetCart(key, [])
  res.json({ order })
})

app.get('/api/:tenant/orders', authMiddleware, async (req, res) => {
  const { tenant } = req.params
  const { userId } = req.session
  if (useMongo) {
    const orders = await OrderModel.find({ tenantId: tenant, userId }).sort({ createdAt: -1 })
    return res.json({ orders })
  }
  res.json({ orders: memListOrders(tenant, userId) })
})

app.get('/api/:tenant/orders/:id', authMiddleware, async (req, res) => {
  const { tenant, id } = req.params
  const { userId } = req.session
  if (useMongo) {
    const order = await OrderModel.findOne({ tenantId: tenant, userId, id })
    if (!order) return res.status(404).json({ error: 'Not found' })
    return res.json({ order })
  }
  const order = memGetOrder(tenant, userId, id)
  if (!order) return res.status(404).json({ error: 'Not found' })
  res.json({ order })
})

app.get('/api/:tenant/addresses', authMiddleware, async (req, res) => {
  const { tenant } = req.params
  const { userId } = req.session
  if (useMongo) {
    const list = await AddressModel.find({ tenantId: tenant, userId })
    return res.json({ addresses: list })
  }
  const key = `${tenant}:${userId}`
  res.json({ addresses: memGetAddresses(key) })
})

app.post('/api/:tenant/addresses', authMiddleware, async (req, res) => {
  const { tenant } = req.params
  const { userId } = req.session
  if (useMongo) {
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

app.put('/api/:tenant/addresses/:id', authMiddleware, async (req, res) => {
  const { tenant, id } = req.params
  const { userId } = req.session
  if (useMongo) {
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

app.delete('/api/:tenant/addresses/:id', authMiddleware, async (req, res) => {
  const { tenant, id } = req.params
  const { userId } = req.session
  if (useMongo) {
    await AddressModel.deleteOne({ tenantId: tenant, userId, id })
    return res.json({ ok: true })
  }
  const key = `${tenant}:${userId}`
  const list = memGetAddresses(key).filter(a => a.id !== id)
  memSetAddresses(key, list)
  res.json({ ok: true })
})

// In-memory helpers
const carts = new Map()
const addressesMem = new Map()
function memGetCart(key) { return carts.get(key) || [] }
function memSetCart(key, value) { carts.set(key, value) }
function memGetAddresses(key) { return addressesMem.get(key) || [] }
function memSetAddresses(key, value) { addressesMem.set(key, value) }

// In-memory order store
const memOrders = []
function memSaveOrder(order) { memOrders.push(order) }
function memListOrders(tenantId, userId) { return memOrders.filter(o => o.tenantId === tenantId && o.userId === userId).sort((a,b)=>b.createdAt - a.createdAt) }
function memGetOrder(tenantId, userId, id) { return memOrders.find(o => o.tenantId === tenantId && o.userId === userId && o.id === id) }

const PORT = process.env.PORT || 4000

;(async () => {
  if (useMongo) {
    await connectMongo()
    if (process.argv.includes('--seed')) {
      await seedFromConfig()
      console.log('Seed completed')
      process.exit(0)
    }
  }
  app.listen(PORT, () => {
    console.log(`Backend listening on http://localhost:${PORT} ${useMongo ? '(MongoDB mode)' : '(in-memory mode)'}`)
  })
})()