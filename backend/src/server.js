import { app } from './router/index.js'
import { PORT, USE_MONGO } from './config/env.js'
import { connectMongo } from './db/mongo.js'
import './router/bindRoutes.js'
import '../server.js' // reuse remaining legacy routes

;(async () => {
  if (USE_MONGO) await connectMongo()
  app.listen(PORT, () => {
    console.log(`Backend listening on http://localhost:${PORT} ${USE_MONGO ? '(MongoDB mode)' : '(in-memory mode)'}`)
  })
})()