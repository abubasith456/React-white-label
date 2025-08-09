import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { detectTenantId, tenants, type TenantConfig } from '@/config/AppConfig'
import axios from 'axios'

export type User = {
  id: string
  name: string
  email: string
  role?: 'user' | 'admin'
}

export type CartItem = {
  productId: string
  quantity: number
}

export type Address = {
  id: string
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
}

export type AppContextType = {
  tenant: TenantConfig
  token: string | null
  currentUser: User | null
  cart: CartItem[]
  addresses: Address[]
  isLoading: boolean
  setTenantId: (tenantId: string) => void
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  addToCart: (productId: string, quantity?: number) => Promise<void>
  removeFromCart: (productId: string) => Promise<void>
  refreshCart: () => Promise<void>
  refreshAddresses: () => Promise<void>
  addAddress: (address: Omit<Address, 'id'>) => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenantId, setTenantIdState] = useState<string>(detectTenantId())
  const tenant = tenants[tenantId]
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const api = useMemo(() => {
    const instance = axios.create({ baseURL: tenant.apiBaseUrl })
    instance.interceptors.request.use((config) => {
      if (token) config.headers.Authorization = `Bearer ${token}`
      return config
    })
    return instance
  }, [tenant.apiBaseUrl, token])

  useEffect(() => {
    document.documentElement.style.setProperty('--brand-primary', tenant.theme.primary)
    document.documentElement.style.setProperty('--brand-secondary', tenant.theme.secondary)
    document.documentElement.style.setProperty('--brand-accent', tenant.theme.accent)
    document.title = tenant.strings.appTitle
  }, [tenant])

  const setTenantId = (id: string) => {
    localStorage.setItem('tenantId', id)
    setTenantIdState(id)
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      setToken(data.token)
      localStorage.setItem('token', data.token)
      setCurrentUser(data.user)
      await Promise.all([refreshCart(), refreshAddresses()])
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      const { data } = await api.post('/auth/register', { name, email, password })
      setToken(data.token)
      localStorage.setItem('token', data.token)
      setCurrentUser(data.user)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setToken(null)
    localStorage.removeItem('token')
    setCurrentUser(null)
    setCart([])
  }

  const refreshCart = async () => {
    if (!token) return
    const { data } = await api.get('/cart')
    setCart(data.items)
  }

  const refreshAddresses = async () => {
    if (!token) return
    const { data } = await api.get('/addresses')
    setAddresses(data.addresses)
  }

  const addToCart = async (productId: string, quantity: number = 1) => {
    await api.post('/cart', { productId, quantity })
    await refreshCart()
  }

  const removeFromCart = async (productId: string) => {
    await api.delete(`/cart/${productId}`)
    await refreshCart()
  }

  const addAddress = async (address: Omit<Address, 'id'>) => {
    await api.post('/addresses', address)
    await refreshAddresses()
  }

  const value: AppContextType = {
    tenant,
    token,
    currentUser,
    cart,
    addresses,
    isLoading,
    setTenantId,
    login,
    register,
    logout,
    addToCart,
    removeFromCart,
    refreshCart,
    refreshAddresses,
    addAddress,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}