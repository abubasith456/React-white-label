import { app } from './router/index.js'
import { PORT, USE_MONGO } from './config/env.js'
import { connectMongo } from './db/mongo.js'
import '../server.js' // reuse existing routes for now; future: split into route modules

;(async () => {
  if (USE_MONGO) await connectMongo()
  app.listen(PORT, () => {
    console.log(`Backend listening on http://localhost:${PORT} ${USE_MONGO ? '(MongoDB mode)' : '(in-memory mode)'}`)
  })
})()