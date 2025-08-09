export type TenantConfig = {
  id: string
  name: string
  logoUrl: string
  theme: {
    primary: string // rgb string e.g., "59 130 246"
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
}

export const tenants: Record<string, TenantConfig> = {
  brandA: {
    id: 'brandA',
    name: 'Aurora Market',
    logoUrl: 'https://dummyimage.com/120x40/3b82f6/ffffff&text=Aurora',
    theme: {
      primary: '59 130 246',
      secondary: '99 102 241',
      accent: '16 185 129',
    },
    strings: {
      appTitle: 'Aurora Market',
      tagline: 'Shine with every purchase',
      loginTitle: 'Welcome back to Aurora',
      registerTitle: 'Create your Aurora account',
      forgotTitle: 'Recover your Aurora account',
    },
    apiBaseUrl: 'http://localhost:4000/api/brandA',
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