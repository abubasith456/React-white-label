import express from 'express'
import cors from 'cors'

export const app = express()
app.use(cors())
app.use(express.json())

// TODO: Move routes into separate modules, e.g. ./auth.js, ./products.js, etc.