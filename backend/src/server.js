import { app } from './router/index.js'
import { PORT, USE_MONGO } from './config/env.js'
import { connectMongo } from './db/mongo.js'
import { seedService } from './services/seedService.js'
import './router/bindRoutes.js'

;(async () => {
  if (USE_MONGO) {
    await connectMongo()
    if (process.argv.includes('--seed')) {
      await seedService.seedFromConfig()
      process.exit(0)
    }
  }
  app.listen(PORT, () => {
    console.log(`Backend listening on http://localhost:${PORT} ${USE_MONGO ? '(MongoDB mode)' : '(in-memory mode)'}`)
  })
})()