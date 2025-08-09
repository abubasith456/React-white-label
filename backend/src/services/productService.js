import { USE_MONGO } from '../config/env.js'
import { CategoryModel, ProductModel } from '../db/mongo.js'
import { getTenantLocal } from '../config/tenants.js'

export const productService = {
  async getProducts(tenantId) {
    if (USE_MONGO) {
      const products = await ProductModel.find({ tenantId })
      return { products }
    }
    
    const tenant = getTenantLocal(tenantId)
    if (!tenant) {
      throw new Error('Unknown tenant')
    }
    
    return { products: tenant.products || [] }
  },

  async createProduct(tenantId, productData) {
    const { nanoid } = await import('nanoid')
    const product = {
      id: nanoid(),
      name: productData.name,
      description: productData.description || '',
      price: Number(productData.price) || 0,
      image: productData.image || '',
      categoryId: productData.categoryId
    }
    
    if (USE_MONGO) {
      const created = await ProductModel.create({ tenantId, ...product })
      return { product: created }
    }
    
    const tenant = getTenantLocal(tenantId)
    if (!tenant) {
      throw new Error('Unknown tenant')
    }
    
    tenant.products.push(product)
    return { product }
  },

  async deleteProduct(tenantId, productId) {
    if (USE_MONGO) {
      await ProductModel.deleteOne({ tenantId, id: productId })
      return { ok: true }
    }
    
    const tenant = getTenantLocal(tenantId)
    if (!tenant) {
      throw new Error('Unknown tenant')
    }
    
    tenant.products = tenant.products.filter(p => p.id !== productId)
    return { ok: true }
  },

  async getProductById(tenantId, productId) {
    if (USE_MONGO) {
      const product = await ProductModel.findOne({ tenantId, id: productId })
      if (!product) {
        throw new Error('Product not found')
      }
      
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        categoryId: product.categoryId
      }
    }
    
    const tenant = getTenantLocal(tenantId)
    if (!tenant) {
      throw new Error('Unknown tenant')
    }
    
    const product = tenant.products?.find(p => p.id === productId)
    if (!product) {
      throw new Error('Product not found')
    }
    
    return product
  }
}

export const categoryService = {
  async getCategories(tenantId) {
    if (USE_MONGO) {
      const categories = await CategoryModel.find({ tenantId })
      return { categories }
    }
    
    const tenant = getTenantLocal(tenantId)
    if (!tenant) {
      throw new Error('Unknown tenant')
    }
    
    return { categories: tenant.categories || [] }
  },

  async createCategory(tenantId, categoryData) {
    const { nanoid } = await import('nanoid')
    const category = {
      id: nanoid(),
      name: categoryData.name
    }
    
    if (USE_MONGO) {
      const created = await CategoryModel.create({ tenantId, ...category })
      return { category: created }
    }
    
    const tenant = getTenantLocal(tenantId)
    if (!tenant) {
      throw new Error('Unknown tenant')
    }
    
    tenant.categories.push(category)
    return { category }
  }
}