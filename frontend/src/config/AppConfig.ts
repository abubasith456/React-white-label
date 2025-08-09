export type TenantConfig = {
  id: string
  name: string
  logoUrl: string
  theme: {
    primary: string
    secondary: string
    accent: string
  }
  strings: {
    appTitle: string
    tagline: string
    loginTitle: string
    registerTitle: string
    forgotTitle: string
  }
  apiBaseUrl: string
  banners: string[]
}

export const tenants: Record<string, TenantConfig> = {
  brandA: {
    id: 'brandA',
    name: 'WLA',
    logoUrl: 'https://dummyimage.com/120x40/3b82f6/ffffff&text=WLA',
    theme: {
      primary: '59 130 246',
      secondary: '99 102 241',
      accent: '16 185 129',
    },
    strings: {
      appTitle: 'WLA',
      tagline: 'Your white-label commerce accelerator',
      loginTitle: 'Welcome to WLA',
      registerTitle: 'Create your WLA account',
      forgotTitle: 'Recover your WLA account',
    },
    apiBaseUrl: 'http://localhost:4000/api/brandA',
    banners: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512499617640-c2f999098c4b?q=80&w=1600&auto=format&fit=crop',
    ],
  },
  brandB: {
    id: 'brandB',
    name: 'Nimbus Shop',
    logoUrl: 'https://dummyimage.com/120x40/10b981/ffffff&text=Nimbus',
    theme: {
      primary: '16 185 129',
      secondary: '2 132 199',
      accent: '245 158 11',
    },
    strings: {
      appTitle: 'Nimbus Shop',
      tagline: 'Everything you need, above the clouds',
      loginTitle: 'Sign in to Nimbus',
      registerTitle: 'Join Nimbus',
      forgotTitle: 'Password help for Nimbus',
    },
    apiBaseUrl: 'http://localhost:4000/api/brandB',
    banners: [
      'https://images.unsplash.com/photo-1512499617640-c2f999098c4b?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1520975922203-b6c29e41e98e?q=80&w=1600&auto=format&fit=crop',
    ],
  },
}

export function detectTenantId(): string {
  const url = new URL(window.location.href)
  const paramTenant = url.searchParams.get('tenant')
  const stored = localStorage.getItem('tenantId')
  const candidate = paramTenant || stored || 'brandA'
  if (paramTenant) localStorage.setItem('tenantId', paramTenant)
  return tenants[candidate] ? candidate : 'brandA'
}