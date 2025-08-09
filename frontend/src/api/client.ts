import axios from 'axios'
import { tenants, detectTenantId } from '@/config/AppConfig'

export const createApi = () => {
  const tenantId = detectTenantId()
  const baseURL = tenants[tenantId].apiBaseUrl
  return axios.create({ baseURL })
}

export type Product = {
  id: string
  name: string
  description: string
  price: number
  image: string
  categoryId: string
}

export type Category = {
  id: string
  name: string
}