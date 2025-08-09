import { Router } from 'express'
import { authService } from '../services/authService.js'
import { userService } from '../services/userService.js'

export const authRouter = Router({ mergeParams: true })

authRouter.post('/register', async (req, res) => {
  try {
    const { tenant } = req.params
    const { name, email, password } = req.body
    
    const result = await authService.register(tenant, { name, email, password })
    res.json(result)
  } catch (error) {
    const statusCode = error.message === 'Unknown tenant' ? 404 : 400
    res.status(statusCode).json({ error: error.message })
  }
})

authRouter.post('/login', async (req, res) => {
  try {
    const { tenant } = req.params
    const { email, password } = req.body
    
    const result = await authService.login(tenant, { email, password })
    res.json(result)
  } catch (error) {
    const statusCode = error.message === 'Unknown tenant' ? 404 : 401
    res.status(statusCode).json({ error: error.message })
  }
})

authRouter.post('/forgot', (req, res) => {
  try {
    const result = authService.forgotPassword()
    res.json(result)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

authRouter.get('/me', async (req, res) => {
  try {
    const { tenant } = req.params
    const session = req.session
    
    const result = await userService.getUserProfile(tenant, session.userId)
    res.json(result)
  } catch (error) {
    const statusCode = error.message === 'User not found' ? 404 : 400
    res.status(statusCode).json({ error: error.message })
  }
})