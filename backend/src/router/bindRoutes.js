import { app } from './index.js'
import { authRouter } from './auth.js'

// Session middleware (reused from legacy): attach req.session if token present
import { sessions } from '../repository/inMemory.js'

app.use('/api/:tenant/auth', (req, res, next) => {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  const session = token && sessions.get(token)
  if (session) req.session = session
  next()
}, authRouter)

// For brevity, other route groups still live in legacy server.js and are already attached when importing ../server.js from src/server.js.