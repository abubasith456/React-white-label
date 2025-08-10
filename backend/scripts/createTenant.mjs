import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { nanoid } from 'nanoid'
import { TenantModel, CategoryModel, ProductModel } from '../src/db/mongo.js'
import { MONGODB_URI } from '../src/config/env.js'

dotenv.config()

function parseArgs(argv) {
  const args = {}
  for (const arg of argv) {
    if (arg.startsWith('--')) {
      const [key, value] = arg.includes('=') ? arg.slice(2).split(/=(.*)/) : [arg.slice(2), true]
      args[key] = value
    }
  }
  return args
}

function toArray(val) {
  if (!val) return []
  if (Array.isArray(val)) return val
  return String(val).split(',').map(s => s.trim()).filter(Boolean)
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const tenantId = args.id || args.tenant || args.t
  const name = args.name || 'Demo Shop'
  const adminEmails = toArray(args.admin)
  const withSample = Boolean(args['with-sample'] || args.sample)
  const updateExisting = Boolean(args.update)

  if (!tenantId) {
    console.error('Missing required --id argument. Example: --id demo --name "Demo Shop" --admin admin@demo.test')
    process.exit(1)
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(tenantId)) {
    console.error('Invalid tenant id. Use letters, numbers, dash or underscore only.')
    process.exit(1)
  }
  if (!MONGODB_URI) {
    console.error('MONGODB_URI is not set. Export it in env or provide via .env file.')
    process.exit(1)
  }

  console.log(`Connecting to MongoDB...`)
  await mongoose.connect(MONGODB_URI)

  try {
    let tenant = await TenantModel.findOne({ id: tenantId })
    if (tenant) {
      if (!updateExisting) {
        console.error(`Tenant '${tenantId}' already exists. Re-run with --update to modify it.`)
        process.exit(1)
      }
      console.log(`Updating existing tenant '${tenantId}'...`)
      tenant.name = name
      tenant.branding = {
        primary: args.primary || tenant.branding?.primary || '59 130 246',
        secondary: args.secondary || tenant.branding?.secondary || '99 102 241',
        accent: args.accent || tenant.branding?.accent || '16 185 129',
        logoUrl: args.logo || tenant.branding?.logoUrl || 'https://dummyimage.com/120x40/3b82f6/ffffff&text=Demo'
      }
      tenant.strings = {
        appTitle: args.appTitle || tenant.strings?.appTitle || name,
        tagline: args.tagline || tenant.strings?.tagline || 'Powered by WLA'
      }
      const adminSet = new Set([...(tenant.adminEmails || []), ...adminEmails])
      tenant.adminEmails = Array.from(adminSet)
      await tenant.save()
    } else {
      console.log(`Creating tenant '${tenantId}'...`)
      tenant = await TenantModel.create({
        id: tenantId,
        name,
        branding: {
          primary: args.primary || '59 130 246',
          secondary: args.secondary || '99 102 241',
          accent: args.accent || '16 185 129',
          logoUrl: args.logo || 'https://dummyimage.com/120x40/3b82f6/ffffff&text=Demo'
        },
        strings: {
          appTitle: args.appTitle || name,
          tagline: args.tagline || 'Powered by WLA'
        },
        adminEmails: adminEmails.length ? adminEmails : ['admin@' + tenantId + '.test']
      })
    }

    if (withSample) {
      console.log('Seeding sample categories and products...')
      const categories = [
        { id: `c-${tenantId}-1`, name: 'Electronics' },
        { id: `c-${tenantId}-2`, name: 'Home' },
      ]
      for (const c of categories) {
        const exists = await CategoryModel.findOne({ tenantId: tenantId, id: c.id })
        if (!exists) await CategoryModel.create({ tenantId: tenantId, id: c.id, name: c.name })
      }

      const sampleProducts = [
        { id: `p-${tenantId}-1`, name: 'Demo Headphones', description: 'Crisp, clear sound.', price: 99.99, image: 'https://images.unsplash.com/photo-1518449958364-1751f105424f?q=80&w=800&auto=format&fit=crop', categoryId: categories[0].id },
        { id: `p-${tenantId}-2`, name: 'Demo Lamp', description: 'Light up your home.', price: 29.99, image: 'https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=800&auto=format&fit=crop', categoryId: categories[1].id },
      ]
      for (const p of sampleProducts) {
        const exists = await ProductModel.findOne({ tenantId: tenantId, id: p.id })
        if (!exists) await ProductModel.create({ tenantId: tenantId, id: p.id, name: p.name, description: p.description, price: p.price, image: p.image, categoryId: p.categoryId })
      }
    }

    console.log('Done.')
    console.log(JSON.stringify({
      id: tenantId,
      name,
      apiBaseUrlPath: `/api/${tenantId}`,
      adminEmails: adminEmails
    }, null, 2))
  } finally {
    await mongoose.disconnect()
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})