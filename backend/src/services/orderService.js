import { nanoid } from 'nanoid'
import PDFDocument from 'pdfkit'
import { USE_MONGO } from '../config/env.js'
import { AddressModel, CartModel, OrderModel, ProductModel, TenantModel, UserModel } from '../db/mongo.js'
import { getTenantLocal } from '../config/tenants.js'
import { memGetCart, memSetCart, memSaveOrder, memListOrders, memGetOrder, memGetOrderAny, memListAllOrders, memUpdateOrderStatus, memGetAddresses } from '../repository/inMemory.js'

export const orderService = {
  async getOrders(tenantId, userId) {
    if (USE_MONGO) {
      const orders = await OrderModel.find({ tenantId, userId }).sort({ createdAt: -1 })
      return { orders }
    }
    
    return { orders: memListOrders(tenantId, userId) }
  },

  async getOrder(tenantId, userId, orderId) {
    if (USE_MONGO) {
      const order = await OrderModel.findOne({ tenantId, userId, id: orderId })
      if (!order) {
        throw new Error('Order not found')
      }
      return { order }
    }
    
    const order = memGetOrder(tenantId, userId, orderId)
    if (!order) {
      throw new Error('Order not found')
    }
    return { order }
  },

  async createOrder(tenantId, userId, addressId) {
    const orderId = nanoid()
    let order

    if (USE_MONGO) {
      const cart = await CartModel.findOne({ tenantId, userId })
      if (!cart || !cart.items.length) {
        throw new Error('Cart is empty')
      }

      const address = await AddressModel.findOne({ tenantId, userId, id: addressId })
      if (!address) {
        throw new Error('Address not found')
      }

      const orderItems = []
      let total = 0

      for (const item of cart.items) {
        const product = await ProductModel.findOne({ tenantId, id: item.productId })
        if (product) {
          const orderItem = {
            productId: item.productId,
            quantity: item.quantity,
            price: product.price,
            name: product.name
          }
          orderItems.push(orderItem)
          total += orderItem.price * orderItem.quantity
        }
      }

      order = await OrderModel.create({
        tenantId,
        userId,
        id: orderId,
        addressId,
        address: {
          id: address.id,
          line1: address.line1,
          line2: address.line2,
          city: address.city,
          state: address.state,
          postalCode: address.postalCode,
          country: address.country
        },
        items: orderItems,
        total,
        status: 'created',
        createdAt: new Date()
      })

      // Clear cart
      await CartModel.findOneAndUpdate({ tenantId, userId }, { items: [] })
    } else {
      const tenant = getTenantLocal(tenantId)
      if (!tenant) {
        throw new Error('Unknown tenant')
      }

      const cartKey = `${tenantId}:${userId}`
      const cart = memGetCart(cartKey)
      if (!cart.length) {
        throw new Error('Cart is empty')
      }

      const addressKey = `${tenantId}:${userId}`
      const addresses = memGetAddresses(addressKey)
      const address = addresses.find(a => a.id === addressId)
      if (!address) {
        throw new Error('Address not found')
      }

      const orderItems = []
      let total = 0

      for (const item of cart) {
        const product = tenant.products.find(p => p.id === item.productId)
        if (product) {
          const orderItem = {
            productId: item.productId,
            quantity: item.quantity,
            price: product.price,
            name: product.name
          }
          orderItems.push(orderItem)
          total += orderItem.price * orderItem.quantity
        }
      }

      order = {
        tenantId,
        userId,
        id: orderId,
        addressId,
        address,
        items: orderItems,
        total,
        status: 'created',
        createdAt: new Date()
      }

      memSaveOrder(order)
      memSetCart(cartKey, [])
    }

    return { order }
  },

  async generateOrderPDF(tenantId, userId, orderId) {
    const { order } = await this.getOrder(tenantId, userId, orderId)
    
    const doc = new PDFDocument()
    const chunks = []
    
    doc.on('data', chunk => chunks.push(chunk))
    doc.on('end', () => {})
    
    // PDF Header
    doc.fontSize(20).text('Order Receipt', 50, 50)
    doc.fontSize(12).text(`Order ID: ${order.id}`, 50, 100)
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 50, 120)
    
    // Address
    doc.text('Shipping Address:', 50, 160)
    doc.text(`${order.address.line1}`, 50, 180)
    if (order.address.line2) {
      doc.text(`${order.address.line2}`, 50, 200)
    }
    doc.text(`${order.address.city}, ${order.address.state} ${order.address.postalCode}`, 50, 220)
    doc.text(`${order.address.country}`, 50, 240)
    
    // Items
    doc.text('Items:', 50, 280)
    let y = 300
    
    for (const item of order.items) {
      doc.text(`${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`, 50, y)
      y += 20
    }
    
    // Total
    doc.fontSize(14).text(`Total: $${order.total.toFixed(2)}`, 50, y + 20)
    
    doc.end()
    
    return new Promise((resolve) => {
      doc.on('end', () => {
        resolve(Buffer.concat(chunks))
      })
    })
  }
}

export const adminOrderService = {
  async getAllOrders(tenantId, userId) {
    // Verify admin access
    if (USE_MONGO) {
      const tenant = await TenantModel.findOne({ id: tenantId })
      const user = await UserModel.findOne({ tenantId, id: userId })
      if (!tenant || !user || !tenant.adminEmails.includes(user.email)) {
        throw new Error('Forbidden')
      }
      
      const orders = await OrderModel.find({ tenantId }).sort({ createdAt: -1 })
      return { orders }
    }
    
    const tenant = getTenantLocal(tenantId)
    const user = tenant?.users.find(u => u.id === userId)
    if (!tenant || !user || !tenant.adminEmails.includes(user.email)) {
      throw new Error('Forbidden')
    }
    
    return { orders: memListAllOrders(tenantId) }
  },

  async getOrderById(tenantId, userId, orderId) {
    // Verify admin access
    if (USE_MONGO) {
      const tenant = await TenantModel.findOne({ id: tenantId })
      const user = await UserModel.findOne({ tenantId, id: userId })
      if (!tenant || !user || !tenant.adminEmails.includes(user.email)) {
        throw new Error('Forbidden')
      }
      
      const order = await OrderModel.findOne({ tenantId, id: orderId })
      if (!order) {
        throw new Error('Order not found')
      }
      return { order }
    }
    
    const tenant = getTenantLocal(tenantId)
    const user = tenant?.users.find(u => u.id === userId)
    if (!tenant || !user || !tenant.adminEmails.includes(user.email)) {
      throw new Error('Forbidden')
    }
    
    const order = memGetOrderAny(tenantId, orderId)
    if (!order) {
      throw new Error('Order not found')
    }
    return { order }
  },

  async updateOrderStatus(tenantId, userId, orderId, status) {
    // Verify admin access
    if (USE_MONGO) {
      const tenant = await TenantModel.findOne({ id: tenantId })
      const user = await UserModel.findOne({ tenantId, id: userId })
      if (!tenant || !user || !tenant.adminEmails.includes(user.email)) {
        throw new Error('Forbidden')
      }
      
      const order = await OrderModel.findOneAndUpdate(
        { tenantId, id: orderId },
        { status },
        { new: true }
      )
      
      if (!order) {
        throw new Error('Order not found')
      }
      return { order }
    }
    
    const tenant = getTenantLocal(tenantId)
    const user = tenant?.users.find(u => u.id === userId)
    if (!tenant || !user || !tenant.adminEmails.includes(user.email)) {
      throw new Error('Forbidden')
    }
    
    const order = memUpdateOrderStatus(tenantId, orderId, status)
    if (!order) {
      throw new Error('Order not found')
    }
    return { order }
  }
}