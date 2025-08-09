import { nanoid } from 'nanoid'
import { USE_MONGO } from '../config/env.js'
import { CartModel, AddressModel } from '../db/mongo.js'
import { memGetCart, memSetCart, memGetAddresses, memSetAddresses } from '../repository/inMemory.js'

export const cartService = {
  async getCart(tenantId, userId) {
    const key = `${tenantId}:${userId}`
    
    if (USE_MONGO) {
      const cart = await CartModel.findOne({ tenantId, userId })
      return { items: cart?.items || [] }
    }
    
    return { items: memGetCart(key) }
  },

  async addToCart(tenantId, userId, productId, quantity) {
    const key = `${tenantId}:${userId}`
    const quantityToAdd = Number(quantity) || 1
    
    if (USE_MONGO) {
      const doc = (await CartModel.findOne({ tenantId, userId })) || 
                  await CartModel.create({ tenantId, userId, items: [] })
      
      const existing = doc.items.find(i => i.productId === productId)
      if (existing) {
        existing.quantity += quantityToAdd
      } else {
        doc.items.push({ productId, quantity: quantityToAdd })
      }
      
      await doc.save()
      return { items: doc.items }
    }
    
    const items = memGetCart(key)
    const existing = items.find(i => i.productId === productId)
    
    if (existing) {
      existing.quantity += quantityToAdd
    } else {
      items.push({ productId, quantity: quantityToAdd })
    }
    
    memSetCart(key, items)
    return { items }
  },

  async removeFromCart(tenantId, userId, productId) {
    const key = `${tenantId}:${userId}`
    
    if (USE_MONGO) {
      const doc = (await CartModel.findOne({ tenantId, userId })) || 
                  await CartModel.create({ tenantId, userId, items: [] })
      
      doc.items = doc.items.filter(i => i.productId !== productId)
      await doc.save()
      return { items: doc.items }
    }
    
    const items = memGetCart(key)
    const filtered = items.filter(i => i.productId !== productId)
    memSetCart(key, filtered)
    return { items: filtered }
  },

  async updateCart(tenantId, userId, items) {
    const key = `${tenantId}:${userId}`
    
    if (USE_MONGO) {
      await CartModel.findOneAndUpdate(
        { tenantId, userId },
        { items },
        { upsert: true }
      )
      return { items }
    }
    
    memSetCart(key, items)
    return { items }
  }
}

export const addressService = {
  async getAddresses(tenantId, userId) {
    const key = `${tenantId}:${userId}`
    
    if (USE_MONGO) {
      const addresses = await AddressModel.find({ tenantId, userId })
      return addresses.map(a => ({
        id: a.id,
        line1: a.line1,
        line2: a.line2,
        city: a.city,
        state: a.state,
        postalCode: a.postalCode,
        country: a.country
      }))
    }
    
    return memGetAddresses(key)
  },

  async addAddress(tenantId, userId, addressData) {
    const key = `${tenantId}:${userId}`
    const address = {
      id: nanoid(),
      ...addressData
    }
    
    if (USE_MONGO) {
      await AddressModel.create({
        tenantId,
        userId,
        ...address
      })
    } else {
      const addresses = memGetAddresses(key)
      addresses.push(address)
      memSetAddresses(key, addresses)
    }
    
    return address
  },

  async updateAddress(tenantId, userId, addressId, addressData) {
    const key = `${tenantId}:${userId}`
    
    if (USE_MONGO) {
      const updated = await AddressModel.findOneAndUpdate(
        { tenantId, userId, id: addressId },
        addressData,
        { new: true }
      )
      
      if (!updated) {
        throw new Error('Address not found')
      }
      
      return {
        id: updated.id,
        line1: updated.line1,
        line2: updated.line2,
        city: updated.city,
        state: updated.state,
        postalCode: updated.postalCode,
        country: updated.country
      }
    }
    
    const addresses = memGetAddresses(key)
    const index = addresses.findIndex(a => a.id === addressId)
    
    if (index === -1) {
      throw new Error('Address not found')
    }
    
    addresses[index] = { ...addresses[index], ...addressData }
    memSetAddresses(key, addresses)
    
    return addresses[index]
  },

  async deleteAddress(tenantId, userId, addressId) {
    const key = `${tenantId}:${userId}`
    
    if (USE_MONGO) {
      const deleted = await AddressModel.findOneAndDelete({
        tenantId,
        userId,
        id: addressId
      })
      
      if (!deleted) {
        throw new Error('Address not found')
      }
      
      return true
    }
    
    const addresses = memGetAddresses(key)
    const index = addresses.findIndex(a => a.id === addressId)
    
    if (index === -1) {
      throw new Error('Address not found')
    }
    
    addresses.splice(index, 1)
    memSetAddresses(key, addresses)
    
    return true
  }
}