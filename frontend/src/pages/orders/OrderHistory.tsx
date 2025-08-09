import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useApp } from '@/context/AppContext'
import { AnimatedContainer } from '@/components/common/AnimatedContainer'

const OrderHistory: React.FC = () => {
  const { tenant, token } = useApp()
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    axios.get(`${tenant.apiBaseUrl}/orders`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      .then(r=>setOrders(r.data.orders))
      .catch(()=>setOrders([]))
  }, [tenant.apiBaseUrl, token])

  return (
    <AnimatedContainer>
      <div className="container-page py-8">
        <div className="card">
          <h1 className="text-xl font-semibold mb-3">Your Orders</h1>
          <ul className="divide-y">
            {orders.map(o => (
              <li key={o.id} className="py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Order #{o.id}</div>
                    <div className="text-sm text-gray-600">Items: {o.items?.length || 0} • Total: ${o.total?.toFixed?.(2) || o.total}</div>
                  </div>
                  <div className="text-sm">{new Date(o.createdAt).toLocaleString()}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AnimatedContainer>
  )
}

export default OrderHistory