import { app } from './index.js'
import { authRouter } from './auth.js'
import { productsRouter, categoriesRouter } from './products.js'
import { cartRouter, addressesRouter } from './cart.js'
import { ordersRouter, adminOrdersRouter } from './orders.js'
import { adminsRouter } from './admins.js'
import { tenantRouter } from './tenant.js'
import { bindSession } from '../middleware/auth.js'

app.use(bindSession)

app.use('/api/:tenant', tenantRouter)
app.use('/api/:tenant/auth', authRouter)
app.use('/api/:tenant/products', productsRouter)
app.use('/api/:tenant/categories', categoriesRouter)
app.use('/api/:tenant/cart', cartRouter)
app.use('/api/:tenant/addresses', addressesRouter)
app.use('/api/:tenant/orders', ordersRouter)
app.use('/api/:tenant/orders/admin', adminOrdersRouter)
app.use('/api/:tenant/admins', adminsRouter)