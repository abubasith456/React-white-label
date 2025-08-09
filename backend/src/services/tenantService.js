import { USE_MONGO } from '../config/env.js'
import { TenantModel } from '../db/mongo.js'
import { getTenantLocal } from '../config/tenants.js'

export const tenantService = {
  async getTenantConfig(tenantId) {
    if (USE_MONGO) {
      const tenant = await TenantModel.findOne({ id: tenantId })
      if (!tenant) {
        throw new Error('Unknown tenant')
      }
      
      return {
        id: tenant.id,
        name: tenant.name,
        branding: tenant.branding,
        strings: tenant.strings
      }
    }
    
    const tenant = getTenantLocal(tenantId)
    if (!tenant) {
      throw new Error('Unknown tenant')
    }
    
    const { name, branding, strings } = tenant
    return {
      id: tenant.id,
      name,
      branding,
      strings
    }
  }
}