import { Router } from 'express'
import { tenantService } from '../services/tenantService.js'

export const tenantRouter = Router({ mergeParams: true })

tenantRouter.get('/config', async (req, res) => {
  try {
    const { tenant } = req.params
    const result = await tenantService.getTenantConfig(tenant)
    res.json(result)
  } catch (error) {
    const statusCode = error.message === 'Unknown tenant' ? 404 : 400
    res.status(statusCode).json({ error: error.message })
  }
})