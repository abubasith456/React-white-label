import { USE_MONGO } from '../config/env.js'
import { TenantModel, UserModel, CategoryModel, ProductModel } from '../db/mongo.js'
import { tenantsConfig } from '../config/tenants.js'

export const seedService = {
  async seedFromConfig() {
    if (!USE_MONGO) return
    
    // Clear existing data
    await TenantModel.deleteMany({})
    await UserModel.deleteMany({})
    await CategoryModel.deleteMany({})
    await ProductModel.deleteMany({})

    // Seed new data
    for (const tenantId of Object.keys(tenantsConfig.tenants)) {
      const tenant = tenantsConfig.tenants[tenantId]
      
      // Create tenant
      await TenantModel.create({
        id: tenant.id,
        name: tenant.name,
        branding: tenant.branding,
        strings: tenant.strings,
        adminEmails: tenant.adminEmails
      })
      
      // Create users
      for (const user of tenant.users) {
        await UserModel.create({ tenantId: tenant.id, ...user })
      }
      
      // Create categories
      for (const category of tenant.categories) {
        await CategoryModel.create({ tenantId: tenant.id, ...category })
      }
      
      // Create products
      for (const product of tenant.products) {
        await ProductModel.create({ tenantId: tenant.id, ...product })
      }
    }
    
    console.log('Seed completed')
  }
}