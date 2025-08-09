import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { useApp } from '@/context/AppContext'
import { AnimatedContainer } from '@/components/common/AnimatedContainer'
import { Skeleton } from '@/components/common/Skeleton'

const OrderConfirmation: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { tenant, token } = useApp()
  const [order, setOrder] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    axios.get(`${tenant.apiBaseUrl}/orders/${id}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      .then(r=>setOrder(r.data.order))
      .catch(()=>setOrder(null))
      .finally(()=>setLoading(false))
  }, [tenant.apiBaseUrl, token, id])

  if (loading) {
    return (
      <AnimatedContainer>
        <div className="container-page py-10 space-y-4">
          <div className="card space-y-2">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="card space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
          </div>
          <div className="card space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </AnimatedContainer>
    )
  }

  if (!order) {
    return (
      <AnimatedContainer>
        <div className="container-page py-10">
          <div className="card">Loading order...</div>
        </div>
      </AnimatedContainer>
    )
  }

  return (
    <AnimatedContainer>
      <div className="container-page py-10 space-y-6">
        <div className="card">
          <h1 className="text-2xl font-semibold">Order Confirmed</h1>
          <p className="text-sm text-gray-600">Order ID: <span className="font-mono">{order.id}</span></p>
          <p className="text-sm text-gray-600">Placed at: {new Date(order.createdAt).toLocaleString()}</p>
        </div>

        {order.address && (
          <div className="card">
            <h2 className="text-lg font-semibold mb-2">Delivery Address</h2>
            <div>{order.address.line1}{order.address.line2 ? `, ${order.address.line2}` : ''}</div>
            <div className="text-sm text-gray-600">{order.address.city}, {order.address.state} {order.address.postalCode}, {order.address.country}</div>
          </div>
        )}

        <div className="card">
          <h2 className="text-lg font-semibold mb-2">Status</h2>
          <ol className="text-sm space-y-1">
            <li className={`before:content-['']`}>● {order.status === 'created' ? 'Created' : 'Created'}</li>
            <li className={order.status === 'packed' || order.status === 'shipped' || order.status === 'delivered' ? 'text-brand-primary' : 'text-gray-400'}>• Packed</li>
            <li className={order.status === 'shipped' || order.status === 'delivered' ? 'text-brand-primary' : 'text-gray-400'}>• Shipped</li>
            <li className={order.status === 'delivered' ? 'text-brand-primary' : 'text-gray-400'}>• Delivered</li>
          </ol>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-2">Items</h2>
          <ul className="divide-y">
            {order.items?.map((it:any) => (
              <li key={it.productId} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">{it.name}</div>
                  <div className="text-sm text-gray-600">Qty: {it.quantity}</div>
                </div>
                <div>${(it.price * it.quantity).toFixed(2)}</div>
              </li>
            ))}
          </ul>
          <div className="mt-3 text-right font-semibold">Total: ${order.total?.toFixed?.(2) || order.total}</div>
        </div>

        <div className="flex gap-3">
          <a href={`${tenant.apiBaseUrl}/orders/${order.id}/invoice`} target="_blank" rel="noreferrer" className="btn-primary">Download invoice</a>
          <Link to="/orders" className="btn-primary bg-brand-secondary">View all orders</Link>
          <Link to="/products" className="btn-primary bg-brand-secondary">Continue shopping</Link>
        </div>
      </div>
    </AnimatedContainer>
  )
}

export default OrderConfirmation