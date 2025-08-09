import React, { useEffect, useState } from 'react'
import { useApp } from '@/context/AppContext'
import { AnimatedContainer } from '@/components/common/AnimatedContainer'
import axios from 'axios'

const Cart: React.FC = () => {
  const { tenant, cart, refreshCart, removeFromCart } = useApp()
  const [products, setProducts] = useState<Record<string, { name: string; price: number }>>({})

  useEffect(() => {
    axios.get(`${tenant.apiBaseUrl}/products`).then(r=>{
      const map: Record<string, { name: string; price: number }> = {}
      for (const p of r.data.products) map[p.id] = { name: p.name, price: p.price }
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
                <div>
                  <div className="font-medium">{products[item.productId]?.name || 'Product'}</div>
                  <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 text-right">${((products[item.productId]?.price || 0) * item.quantity).toFixed(2)}</div>
                  <button className="text-red-600" onClick={() => removeFromCart(item.productId)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 text-right font-semibold">Total: ${total.toFixed(2)}</div>
        </div>
      </div>
    </AnimatedContainer>
  )
}

export default Cart