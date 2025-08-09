import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const configPath = join(__dirname, '..', '..', 'config', 'tenants.json')
const raw = readFileSync(configPath, 'utf-8')
export const tenantsConfig = JSON.parse(raw)

export function getTenantLocal(tenantId) {
  return tenantsConfig.tenants[tenantId] || null
}