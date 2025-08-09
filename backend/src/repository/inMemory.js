export const sessions = new Map()
export const carts = new Map()
export const addresses = new Map()
export const orders = []

export function memGetCart(key) { return carts.get(key) || [] }
export function memSetCart(key, value) { carts.set(key, value) }
export function memGetAddresses(key) { return addresses.get(key) || [] }
export function memSetAddresses(key, value) { addresses.set(key, value) }
export function memSaveOrder(order) { orders.push(order) }
export function memListOrders(tenantId, userId) { return orders.filter(o => o.tenantId === tenantId && o.userId === userId).sort((a,b)=>b.createdAt - a.createdAt) }
export function memGetOrder(tenantId, userId, id) { return orders.find(o => o.tenantId === tenantId && o.userId === userId && o.id === id) }
export function memGetOrderAny(tenantId, id) { return orders.find(o => o.tenantId === tenantId && o.id === id) }
export function memListAllOrders(tenantId) { return orders.filter(o => o.tenantId === tenantId).sort((a,b)=>b.createdAt - a.createdAt) }
export function memUpdateOrderStatus(tenantId, id, status) { const o = orders.find(x=>x.tenantId===tenantId && x.id===id); if (o) o.status = status; return o }