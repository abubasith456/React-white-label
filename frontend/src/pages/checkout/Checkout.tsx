import React, { useEffect, useMemo, useState } from 'react'
import { useApp } from '@/context/AppContext'
import axios from 'axios'
import { AnimatedContainer } from '@/components/common/AnimatedContainer'
import { Button } from '@/components/common/Button'
import { Link, useNavigate } from 'react-router-dom'

const Checkout: React.FC = () => {
  const { tenant, addresses, refreshAddresses, cart, removeFromCart, token } = useApp()
  const [products, setProducts] = useState<any[]>([])
  const [addressId, setAddressId] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    axios.get(`${tenant.apiBaseUrl}/products`).then(r=>setProducts(r.data.products))
    refreshAddresses()
  }, [tenant.apiBaseUrl])

  useEffect(() => {
    if (!token) navigate('/login')
  }, [token])

  const total = useMemo(() => cart.reduce((sum, item) => {
    const p = products.find((pp:any)=>pp.id===item.productId)
    return sum + (p?.price || 0) * item.quantity
  }, 0), [cart, products])

  return (
    <AnimatedContainer>
      <div className="container-page py-8 grid lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 space-y-4">
          <div className="card">
            <h2 className="text-lg font-semibold mb-3">Select Delivery Address</h2>
            <div className="space-y-2">
              {addresses.length === 0 && <div className="text-sm text-gray-600">No addresses. Add one under Addresses page.</div>}
              {addresses.map(a => (
                <label key={a.id} className="flex items-center gap-3 border rounded-lg p-3">
                  <input type="radio" name="address" checked={addressId===a.id} onChange={() => setAddressId(a.id)} />
                  <div>
                    <div className="font-medium">{a.line1}{a.line2 ? `, ${a.line2}` : ''}</div>
                    <div className="text-sm text-gray-600">{a.city}, {a.state} {a.postalCode}, {a.country}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold mb-3">Order Items</h2>
            <ul className="divide-y">
              {cart.map(item => {
                const p = products.find((pp:any)=>pp.id===item.productId)
                return (
                  <li key={item.productId} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={p?.image} alt={p?.name} className="h-12 w-12 object-cover rounded" />
                      <div>
                        <div className="font-medium">{p?.name}</div>
                        <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24 text-right">${((p?.price||0)*item.quantity).toFixed(2)}</div>
                      <button className="text-red-600" onClick={() => removeFromCart(item.productId)}>Remove</button>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>

        <aside className="card h-fit space-y-3">
          <div className="flex justify-between"><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
          <div className="flex justify-between text-sm text-gray-600"><span>Shipping</span><span>Free</span></div>
          <div className="flex justify-between font-semibold"><span>Total</span><span>${total.toFixed(2)}</span></div>
          <Button disabled={!addressId || cart.length===0} onClick={() => navigate(`/payment?addressId=${addressId}`)}>Proceed to payment</Button>
          <Link className="text-brand-primary underline text-sm" to="/cart">Back to cart</Link>
        </aside>
      </div>
    </AnimatedContainer>
  )
}

export default Checkout