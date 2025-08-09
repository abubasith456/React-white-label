import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { detectTenantId, tenants, type TenantConfig } from '@/config/AppConfig'
import axios from 'axios'
import toast from 'react-hot-toast'

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
  wishlist: string[]
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
  toggleWishlist: (productId: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenantId, setTenantIdState] = useState<string>(detectTenantId())
  const tenant = tenants[tenantId]
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [addresses, setAddresses] = useState<Address[]>([])
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(`wishlist:${tenantId}`) || '[]') } catch { return [] }
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const guestCartKey = `guestCart:${tenantId}`

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

  useEffect(() => {
    localStorage.setItem(`wishlist:${tenantId}`, JSON.stringify(wishlist))
  }, [wishlist, tenantId])

  useEffect(() => {
    // Initialize cart from backend or guest storage
    if (token) {
      void refreshCart()
      // fetch current user with role
      api.get('/auth/me').then(({ data }) => setCurrentUser(data.user)).catch(()=>{})
    } else {
      try {
        const stored = JSON.parse(localStorage.getItem(guestCartKey) || '[]') as CartItem[]
        setCart(stored)
      } catch { /* noop */ }
    }
  }, [token, tenantId])

  const setTenantId = (id: string) => {
    localStorage.setItem('tenantId', id)
    setTenantIdState(id)
  }

  async function mergeGuestCartToBackend() {
    try {
      const stored = JSON.parse(localStorage.getItem(guestCartKey) || '[]') as CartItem[]
      if (stored?.length) {
        for (const item of stored) {
          await api.post('/cart', { productId: item.productId, quantity: item.quantity })
        }
        localStorage.removeItem(guestCartKey)
      }
    } catch { /* ignore */ }
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      setToken(data.token)
      localStorage.setItem('token', data.token)
      setCurrentUser(data.user)
      await mergeGuestCartToBackend()
      await Promise.all([refreshCart(), refreshAddresses()])
      toast.success(`Welcome back, ${data.user.name}!`)
    } catch (err: any) {
      toast.error('Login failed')
      throw err
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
      await mergeGuestCartToBackend()
      toast.success('Account created!')
    } catch (err: any) {
      toast.error('Registration failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setToken(null)
    localStorage.removeItem('token')
    setCurrentUser(null)
    setCart([])
    toast('Logged out', { icon: '👋' })
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

  const showCartToast = (message: string) => {
    toast((t) => (
      <div className="flex items-center gap-3">
        <span>{message}</span>
        <button className="text-brand-primary underline" onClick={() => { window.location.href = '/cart'; toast.dismiss(t.id) }}>View cart</button>
      </div>
    ))
  }

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (token) {
      await api.post('/cart', { productId, quantity })
      await refreshCart()
    } else {
      setCart(prev => {
        const existing = prev.find(i => i.productId === productId)
        if (existing) existing.quantity += quantity
        else prev.push({ productId, quantity })
        const next = [...prev]
        localStorage.setItem(guestCartKey, JSON.stringify(next))
        return next
      })
    }
    showCartToast('Added to cart')
  }

  const removeFromCart = async (productId: string) => {
    if (token) {
      await api.delete(`/cart/${productId}`)
      await refreshCart()
    } else {
      setCart(prev => {
        const next = prev.filter(i => i.productId !== productId)
        localStorage.setItem(guestCartKey, JSON.stringify(next))
        return next
      })
    }
    toast('Removed from cart')
  }

  const addAddress = async (address: Omit<Address, 'id'>) => {
    await api.post('/addresses', address)
    await refreshAddresses()
    toast.success('Address saved')
  }

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId)
      const next = exists ? prev.filter(id => id !== productId) : [...prev, productId]
      toast(exists ? 'Removed from wishlist' : 'Added to wishlist', { icon: exists ? '💔' : '💖' })
      return next
    })
  }

  const value: AppContextType = {
    tenant,
    token,
    currentUser,
    cart,
    addresses,
    wishlist,
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
    toggleWishlist,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}