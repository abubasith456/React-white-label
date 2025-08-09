import React, { useState } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { AnimatedContainer } from '@/components/common/AnimatedContainer'
import { Button } from '@/components/common/Button'
import toast from 'react-hot-toast'
import { useApp } from '@/context/AppContext'
import axios from 'axios'

const Payment: React.FC = () => {
  const [params] = useSearchParams()
  const addressId = params.get('addressId')
  const { tenant, token } = useApp()
  const navigate = useNavigate()
  const [card, setCard] = useState({ number: '', expiry: '', cvc: '' })

  const maskCard = (n: string) => n.replace(/\D/g, '').slice(0,16).replace(/(.{4})/g, '$1 ').trim()
  const maskExpiry = (e: string) => e.replace(/\D/g,'').slice(0,4).replace(/(.{2})/, '$1/').trim()
  const maskCvc = (c: string) => c.replace(/\D/g,'').slice(0,4)

  const pay = async () => {
    if (card.number.replace(/\s/g,'').length < 16 || card.expiry.length < 5 || card.cvc.length < 3) {
      toast.error('Invalid card details')
      return
    }
    try {
      const { data } = await axios.post(`${tenant.apiBaseUrl}/orders`, { addressId }, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      toast.success('Order placed successfully!')
      navigate(`/orders/${data.order.id}`)
    } catch {
      toast.error('Payment failed')
    }
  }

  return (
    <AnimatedContainer>
      <div className="container-page py-10 max-w-lg">
        <div className="card space-y-4">
          <h1 className="text-2xl font-semibold">Payment</h1>
          <p className="text-sm text-gray-600">Address ID: {addressId}</p>
          <div className="space-y-2">
            <label className="block"><span className="text-sm text-gray-700">Card Number</span><input className="input" value={card.number} onChange={e=>setCard({...card, number: maskCard(e.target.value)})} placeholder="4242 4242 4242 4242" /></label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block"><span className="text-sm text-gray-700">Expiry</span><input className="input" value={card.expiry} onChange={e=>setCard({...card, expiry: maskExpiry(e.target.value)})} placeholder="MM/YY" /></label>
              <label className="block"><span className="text-sm text-gray-700">CVC</span><input className="input" value={card.cvc} onChange={e=>setCard({...card, cvc: maskCvc(e.target.value)})} placeholder="123" /></label>
            </div>
          </div>
          <Button onClick={pay}>Pay now</Button>
          <Link to="/" className="text-brand-primary underline text-sm">Back to home</Link>
        </div>
      </div>
    </AnimatedContainer>
  )
}

export default Payment