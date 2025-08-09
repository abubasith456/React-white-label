import React, { useEffect, useMemo, useState } from 'react'
import { useApp } from '@/context/AppContext'
import axios from 'axios'
import { AnimatedContainer } from '@/components/common/AnimatedContainer'
import { Button } from '@/components/common/Button'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const Steps = ['Cart', 'Address', 'Payment', 'Review', 'Confirmation'] as const

type Step = typeof Steps[number]

const CheckoutWizard: React.FC = () => {
  const { tenant, cart, removeFromCart, addresses, refreshAddresses, token } = useApp()
  const [products, setProducts] = useState<any[]>([])
  const [addressId, setAddressId] = useState('')
  const [card, setCard] = useState({ number: '', expiry: '', cvc: '' })
  const [stepIdx, setStepIdx] = useState(0)
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

  const next = () => setStepIdx(i => Math.min(Steps.length - 1, i + 1))
  const prev = () => setStepIdx(i => Math.max(0, i - 1))

  const payAndPlaceOrder = async () => {
    try {
      const { data } = await axios.post(`${tenant.apiBaseUrl}/orders`, { addressId }, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      next()
      toast((t) => (
        <div className="flex items-center gap-3">
          <span>Order placed!</span>
          <a className="text-brand-primary underline" href={`/orders/${data.order.id}`} onClick={() => toast.dismiss(t.id)}>View order</a>
        </div>
      ))
      navigate(`/orders/${data.order.id}`)
    } catch {
      toast.error('Payment failed')
    }
  }

  return (
    <AnimatedContainer>
      <div className="container-page py-8 space-y-6">
        <div className="flex items-center gap-2 text-sm">
          {Steps.map((s, i) => (
            <React.Fragment key={s}>
              <div className={`px-2 py-1 rounded ${i<=stepIdx ? 'bg-brand-primary text-white' : 'bg-gray-200'}`}>{s}</div>
              {i < Steps.length - 1 && <span className="text-gray-400">→</span>}
            </React.Fragment>
          ))}
        </div>

        {stepIdx === 0 && (
          <div className="card">
            <h2 className="text-lg font-semibold mb-3">Cart</h2>
            <ul className="divide-y">
              {cart.map(item => {
                const p = products.find((pp:any)=>pp.id===item.productId)
                return (
                  <li key={item.productId} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={p?.image} alt={p?.name} className="h-10 w-10 object-cover rounded" />
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
            <div className="mt-3 flex items-center justify-between">
              <div className="font-semibold">Total: ${total.toFixed(2)}</div>
              <Button onClick={next} disabled={cart.length===0}>Next</Button>
            </div>
          </div>
        )}

        {stepIdx === 1 && (
          <div className="card space-y-3">
            <h2 className="text-lg font-semibold">Address</h2>
            {addresses.map(a => (
              <label key={a.id} className="flex items-center gap-3 border rounded-lg p-3">
                <input type="radio" name="address" checked={addressId===a.id} onChange={() => setAddressId(a.id)} />
                <div>
                  <div className="font-medium">{a.line1}{a.line2 ? `, ${a.line2}` : ''}</div>
                  <div className="text-sm text-gray-600">{a.city}, {a.state} {a.postalCode}, {a.country}</div>
                </div>
              </label>
            ))}
            <div className="flex justify-between">
              <Button variant="ghost" onClick={prev}>Prev</Button>
              <Button onClick={next} disabled={!addressId}>Next</Button>
            </div>
          </div>
        )}

        {stepIdx === 2 && (
          <div className="card space-y-3">
            <h2 className="text-lg font-semibold">Payment</h2>
            <label className="block"><span className="text-sm text-gray-700">Card Number</span><input className="input" value={card.number} onChange={e=>setCard({...card, number: e.target.value})} placeholder="4242 4242 4242 4242" /></label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block"><span className="text-sm text-gray-700">Expiry</span><input className="input" value={card.expiry} onChange={e=>setCard({...card, expiry: e.target.value})} placeholder="MM/YY" /></label>
              <label className="block"><span className="text-sm text-gray-700">CVC</span><input className="input" value={card.cvc} onChange={e=>setCard({...card, cvc: e.target.value})} placeholder="123" /></label>
            </div>
            <div className="flex justify-between">
              <Button variant="ghost" onClick={prev}>Prev</Button>
              <Button onClick={next} disabled={!card.number || !card.expiry || !card.cvc}>Next</Button>
            </div>
          </div>
        )}

        {stepIdx === 3 && (
          <div className="card space-y-3">
            <h2 className="text-lg font-semibold">Review</h2>
            <div className="text-sm text-gray-700">Address ID: {addressId}</div>
            <ul className="divide-y">
              {cart.map(item => {
                const p = products.find((pp:any)=>pp.id===item.productId)
                return (
                  <li key={item.productId} className="py-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={p?.image} alt={p?.name} className="h-10 w-10 object-cover rounded" />
                      <div>
                        <div className="font-medium">{p?.name}</div>
                        <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                      </div>
                    </div>
                    <div className="w-24 text-right">${((p?.price||0)*item.quantity).toFixed(2)}</div>
                  </li>
                )
              })}
            </ul>
            <div className="font-semibold">Total: ${total.toFixed(2)}</div>
            <div className="flex justify-between">
              <Button variant="ghost" onClick={prev}>Prev</Button>
              <Button onClick={payAndPlaceOrder}>Place Order</Button>
            </div>
          </div>
        )}

        {stepIdx === 4 && (
          <div className="card space-y-3 text-center">
            <h2 className="text-lg font-semibold">Confirmation</h2>
            <p className="text-sm text-gray-600">Thank you! Your order has been placed.</p>
            <Button onClick={() => navigate('/')}>Go to Home</Button>
          </div>
        )}
      </div>
    </AnimatedContainer>
  )
}

export default CheckoutWizard