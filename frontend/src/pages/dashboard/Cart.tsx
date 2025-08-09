import React, { useEffect, useState } from 'react'
import { useApp } from '@/context/AppContext'
import { AnimatedContainer } from '@/components/common/AnimatedContainer'
import axios from 'axios'
import { Link } from 'react-router-dom'

const Cart: React.FC = () => {
  const { tenant, cart, refreshCart, removeFromCart } = useApp()
  const [products, setProducts] = useState<Record<string, { name: string; price: number; image?: string }>>({})

  useEffect(() => {
    axios.get(`${tenant.apiBaseUrl}/products`).then(r=>{
      const map: Record<string, { name: string; price: number; image?: string }> = {}
      for (const p of r.data.products) map[p.id] = { name: p.name, price: p.price, image: p.image }
      setProducts(map)
    })
    refreshCart()
  }, [tenant.apiBaseUrl])

  const total = cart.reduce((sum, item) => sum + (products[item.productId]?.price || 0) * item.quantity, 0)

  return (
    <AnimatedContainer>
      <div className="container-page py-8">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
          <ul className="divide-y">
            {cart.map(item => (
              <li key={item.productId} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={products[item.productId]?.image} alt={products[item.productId]?.name} className="h-10 w-10 object-cover rounded" />
                  <div>
                    <div className="font-medium">{products[item.productId]?.name || 'Product'}</div>
                    <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 text-right">${((products[item.productId]?.price || 0) * item.quantity).toFixed(2)}</div>
                  <button className="text-red-600" onClick={() => removeFromCart(item.productId)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between">
            <div className="font-semibold">Total: ${total.toFixed(2)}</div>
            <Link to="/checkout" className={`btn-primary ${cart.length===0 ? 'pointer-events-none opacity-60' : ''}`}>Checkout</Link>
          </div>
        </div>
      </div>
    </AnimatedContainer>
  )
}

export default Cart