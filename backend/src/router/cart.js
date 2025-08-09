import { Router } from 'express'
import { cartService, addressService } from '../services/cartService.js'
import { requireAuth } from '../middleware/auth.js'

export const cartRouter = Router({ mergeParams: true })
export const addressesRouter = Router({ mergeParams: true })

cartRouter.get('/', requireAuth, async (req, res) => {
  try {
    const { tenant } = req.params
    const { userId } = req.session
    const result = await cartService.getCart(tenant, userId)
    res.json(result)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

cartRouter.post('/', requireAuth, async (req, res) => {
  try {
    const { tenant } = req.params
    const { userId } = req.session
    const { productId, quantity } = req.body
    const result = await cartService.addToCart(tenant, userId, productId, quantity)
    res.json(result)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

cartRouter.delete('/:productId', requireAuth, async (req, res) => {
  try {
    const { tenant, productId } = req.params
    const { userId } = req.session
    const result = await cartService.removeFromCart(tenant, userId, productId)
    res.json(result)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

addressesRouter.get('/', requireAuth, async (req, res) => {
  try {
    const { tenant } = req.params
    const { userId } = req.session
    const addresses = await addressService.getAddresses(tenant, userId)
    res.json({ addresses })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

addressesRouter.post('/', requireAuth, async (req, res) => {
  try {
    const { tenant } = req.params
    const { userId } = req.session
    const address = await addressService.addAddress(tenant, userId, req.body)
    res.json({ address })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

addressesRouter.put('/:id', requireAuth, async (req, res) => {
  try {
    const { tenant, id } = req.params
    const { userId } = req.session
    const address = await addressService.updateAddress(tenant, userId, id, req.body)
    res.json({ address })
  } catch (error) {
    const statusCode = error.message === 'Address not found' ? 404 : 400
    res.status(statusCode).json({ error: error.message })
  }
})

addressesRouter.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { tenant, id } = req.params
    const { userId } = req.session
    await addressService.deleteAddress(tenant, userId, id)
    res.json({ ok: true })
  } catch (error) {
    const statusCode = error.message === 'Address not found' ? 404 : 400
    res.status(statusCode).json({ error: error.message })
  }
})