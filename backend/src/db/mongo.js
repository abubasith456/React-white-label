import mongoose from 'mongoose'
import { MONGODB_URI, USE_MONGO } from '../config/env.js'

export async function connectMongo() {
  if (!USE_MONGO) return
  await mongoose.connect(MONGODB_URI)
}

const tenantSchema = new mongoose.Schema({ id: String, name: String, branding: Object, strings: Object, adminEmails: [String] })
const userSchema = new mongoose.Schema({ tenantId: String, id: String, name: String, email: String, password: String })
const categorySchema = new mongoose.Schema({ tenantId: String, id: String, name: String })
const productSchema = new mongoose.Schema({ tenantId: String, id: String, name: String, description: String, price: Number, image: String, categoryId: String })
const addressSchema = new mongoose.Schema({ tenantId: String, userId: String, id: String, line1: String, line2: String, city: String, state: String, postalCode: String, country: String })
const cartSchema = new mongoose.Schema({ tenantId: String, userId: String, items: [{ productId: String, quantity: Number }] })
const orderSchema = new mongoose.Schema({
  tenantId: String,
  userId: String,
  id: String,
  addressId: String,
  address: { id: String, line1: String, line2: String, city: String, state: String, postalCode: String, country: String },
  items: [{ productId: String, quantity: Number, price: Number, name: String }],
  total: Number,
  status: { type: String, default: 'created' },
  createdAt: { type: Date, default: Date.now }
})

export const TenantModel = mongoose.model('Tenant', tenantSchema)
export const UserModel = mongoose.model('User', userSchema)
export const CategoryModel = mongoose.model('Category', categorySchema)
export const ProductModel = mongoose.model('Product', productSchema)
export const AddressModel = mongoose.model('Address', addressSchema)
export const CartModel = mongoose.model('Cart', cartSchema)
export const OrderModel = mongoose.model('Order', orderSchema)