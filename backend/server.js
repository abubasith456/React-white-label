import express from 'express'
import cors from 'cors'
import { readFileSync } from 'fs'
import { join } from 'path'
import { nanoid } from 'nanoid'

const app = express()
app.use(cors())
app.use(express.json())

const configPath = join(process.cwd(), 'backend', 'config', 'tenants.json')
const raw = readFileSync(configPath, 'utf-8')
const config = JSON.parse(raw)

// In-memory state for demo purposes
const sessions = new Map() // token -> { tenantId, userId }
const carts = new Map() // key `${tenantId}:${userId}` -> [ { productId, quantity } ]
const addresses = new Map() // key `${tenantId}:${userId}` -> [ { id, ... } ]

function getTenant(req) {
  const { tenant } = req.params
  const t = config.tenants[tenant]
  if (!t) return null
  return t
}

function isAdmin(tenant, user) {
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

app.get('/api/:tenant/config', (req, res) => {
  const tenant = getTenant(req)
  if (!tenant) return res.status(404).json({ error: 'Unknown tenant' })
  const { name, branding, strings } = tenant
  res.json({ id: tenant.id, name, branding, strings })
})

// Auth
app.post('/api/:tenant/auth/register', (req, res) => {
  const tenant = getTenant(req)
  if (!tenant) return res.status(404).json({ error: 'Unknown tenant' })
  const { name, email, password } = req.body
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' })
  if (tenant.users.find(u => u.email === email)) return res.status(400).json({ error: 'Email already exists' })
  const user = { id: nanoid(), name, email, password }
  tenant.users.push(user)
  const token = nanoid()
  sessions.set(token, { tenantId: tenant.id, userId: user.id })
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: isAdmin(tenant, user) ? 'admin' : 'user' } })
})

app.post('/api/:tenant/auth/login', (req, res) => {
  const tenant = getTenant(req)
  if (!tenant) return res.status(404).json({ error: 'Unknown tenant' })
  const { email, password } = req.body
  const user = tenant.users.find(u => u.email === email && u.password === password)
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })
  const token = nanoid()
  sessions.set(token, { tenantId: tenant.id, userId: user.id })
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: isAdmin(tenant, user) ? 'admin' : 'user' } })
})

app.post('/api/:tenant/auth/forgot', (req, res) => {
  // No-op in demo
  res.json({ ok: true })
})

// Products
app.get('/api/:tenant/products', (req, res) => {
  const tenant = getTenant(req)
  if (!tenant) return res.status(404).json({ error: 'Unknown tenant' })
  res.json({ products: tenant.products })
})

app.post('/api/:tenant/products', authMiddleware, (req, res) => {
  const tenant = getTenant(req)
  if (!tenant) return res.status(404).json({ error: 'Unknown tenant' })
  const session = req.session
  const user = tenant.users.find(u => u.id === session.userId)
  if (!isAdmin(tenant, user)) return res.status(403).json({ error: 'Forbidden' })
  const { name, description, price, image, categoryId } = req.body
  const product = { id: nanoid(), name, description: description || '', price: Number(price) || 0, image: image || '', categoryId }
  tenant.products.push(product)
  res.json({ product })
})

app.delete('/api/:tenant/products/:id', authMiddleware, (req, res) => {
  const tenant = getTenant(req)
  if (!tenant) return res.status(404).json({ error: 'Unknown tenant' })
  const session = req.session
  const user = tenant.users.find(u => u.id === session.userId)
  if (!isAdmin(tenant, user)) return res.status(403).json({ error: 'Forbidden' })
  const { id } = req.params
  tenant.products = tenant.products.filter(p => p.id !== id)
  res.json({ ok: true })
})

// Categories
app.get('/api/:tenant/categories', (req, res) => {
  const tenant = getTenant(req)
  if (!tenant) return res.status(404).json({ error: 'Unknown tenant' })
  res.json({ categories: tenant.categories })
})

app.post('/api/:tenant/categories', authMiddleware, (req, res) => {
  const tenant = getTenant(req)
  if (!tenant) return res.status(404).json({ error: 'Unknown tenant' })
  const session = req.session
  const user = tenant.users.find(u => u.id === session.userId)
  if (!isAdmin(tenant, user)) return res.status(403).json({ error: 'Forbidden' })
  const { name } = req.body
  const category = { id: nanoid(), name }
  tenant.categories.push(category)
  res.json({ category })
})

// Users (admin)
app.get('/api/:tenant/users', authMiddleware, (req, res) => {
  const tenant = getTenant(req)
  if (!tenant) return res.status(404).json({ error: 'Unknown tenant' })
  const session = req.session
  const user = tenant.users.find(u => u.id === session.userId)
  if (!isAdmin(tenant, user)) return res.status(403).json({ error: 'Forbidden' })
  res.json({ users: tenant.users.map(u => ({ id: u.id, name: u.name, email: u.email })) })
})

// Cart
app.get('/api/:tenant/cart', authMiddleware, (req, res) => {
  const tenant = getTenant(req)
  if (!tenant) return res.status(404).json({ error: 'Unknown tenant' })
  const key = `${tenant.id}:${req.session.userId}`
  const items = carts.get(key) || []
  res.json({ items })
})

app.post('/api/:tenant/cart', authMiddleware, (req, res) => {
  const tenant = getTenant(req)
  if (!tenant) return res.status(404).json({ error: 'Unknown tenant' })
  const { productId, quantity } = req.body
  const key = `${tenant.id}:${req.session.userId}`
  const items = carts.get(key) || []
  const existing = items.find(i => i.productId === productId)
  if (existing) existing.quantity += Number(quantity) || 1
  else items.push({ productId, quantity: Number(quantity) || 1 })
  carts.set(key, items)
  res.json({ items })
})

app.delete('/api/:tenant/cart/:productId', authMiddleware, (req, res) => {
  const tenant = getTenant(req)
  if (!tenant) return res.status(404).json({ error: 'Unknown tenant' })
  const key = `${tenant.id}:${req.session.userId}`
  const items = (carts.get(key) || []).filter(i => i.productId !== req.params.productId)
  carts.set(key, items)
  res.json({ items })
})

// Addresses
app.get('/api/:tenant/addresses', authMiddleware, (req, res) => {
  const tenant = getTenant(req)
  if (!tenant) return res.status(404).json({ error: 'Unknown tenant' })
  const key = `${tenant.id}:${req.session.userId}`
  const list = addresses.get(key) || []
  res.json({ addresses: list })
})

app.post('/api/:tenant/addresses', authMiddleware, (req, res) => {
  const tenant = getTenant(req)
  if (!tenant) return res.status(404).json({ error: 'Unknown tenant' })
  const key = `${tenant.id}:${req.session.userId}`
  const list = addresses.get(key) || []
  const address = { id: nanoid(), ...req.body }
  list.push(address)
  addresses.set(key, list)
  res.json({ address })
})

app.put('/api/:tenant/addresses/:id', authMiddleware, (req, res) => {
  const tenant = getTenant(req)
  if (!tenant) return res.status(404).json({ error: 'Unknown tenant' })
  const key = `${tenant.id}:${req.session.userId}`
  const list = addresses.get(key) || []
  const idx = list.findIndex(a => a.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  list[idx] = { ...list[idx], ...req.body }
  addresses.set(key, list)
  res.json({ address: list[idx] })
})

app.delete('/api/:tenant/addresses/:id', authMiddleware, (req, res) => {
  const tenant = getTenant(req)
  if (!tenant) return res.status(404).json({ error: 'Unknown tenant' })
  const key = `${tenant.id}:${req.session.userId}`
  const list = (addresses.get(key) || []).filter(a => a.id !== req.params.id)
  addresses.set(key, list)
  res.json({ ok: true })
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`)
})