import express from 'express'
import cors from 'cors'
import { requestLogger } from '../middleware/logger.js'

export const app = express()
app.use(cors())
app.use(express.json())
app.use(requestLogger)

// TODO: Move routes into separate modules, e.g. ./auth.js, ./products.js, etc.