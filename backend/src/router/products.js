import { Router } from 'express'
import { productService, categoryService } from '../services/productService.js'
import { requireAdmin } from '../middleware/auth.js'

export const productsRouter = Router({ mergeParams: true })
export const categoriesRouter = Router({ mergeParams: true })

productsRouter.get('/', async (req, res) => {
  try {
    const { tenant } = req.params
    const result = await productService.getProducts(tenant)
    res.json(result)
  } catch (error) {
    const statusCode = error.message === 'Unknown tenant' ? 404 : 400
    res.status(statusCode).json({ error: error.message })
  }
})

productsRouter.post('/', requireAdmin, async (req, res) => {
  try {
    const { tenant } = req.params
    const { name, description, price, image, categoryId } = req.body
    const result = await productService.createProduct(tenant, { name, description, price, image, categoryId })
    res.json(result)
  } catch (error) {
    const statusCode = error.message === 'Unknown tenant' ? 404 : 400
    res.status(statusCode).json({ error: error.message })
  }
})

productsRouter.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { tenant, id } = req.params
    const result = await productService.deleteProduct(tenant, id)
    res.json(result)
  } catch (error) {
    const statusCode = error.message === 'Unknown tenant' ? 404 : 400
    res.status(statusCode).json({ error: error.message })
  }
})

categoriesRouter.get('/', async (req, res) => {
  try {
    const { tenant } = req.params
    const result = await categoryService.getCategories(tenant)
    res.json(result)
  } catch (error) {
    const statusCode = error.message === 'Unknown tenant' ? 404 : 400
    res.status(statusCode).json({ error: error.message })
  }
})

categoriesRouter.post('/', requireAdmin, async (req, res) => {
  try {
    const { tenant } = req.params
    const { name } = req.body
    const result = await categoryService.createCategory(tenant, { name })
    res.json(result)
  } catch (error) {
    const statusCode = error.message === 'Unknown tenant' ? 404 : 400
    res.status(statusCode).json({ error: error.message })
  }
})