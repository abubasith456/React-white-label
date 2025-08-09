import React from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { AnimatedContainer } from '@/components/common/AnimatedContainer'
import { Button } from '@/components/common/Button'
import toast from 'react-hot-toast'

const Payment: React.FC = () => {
  const [params] = useSearchParams()
  const addressId = params.get('addressId')

  const pay = () => {
    toast.success('Payment successful!')
  }

  return (
    <AnimatedContainer>
      <div className="container-page py-10 max-w-lg">
        <div className="card space-y-4">
          <h1 className="text-2xl font-semibold">Payment</h1>
          <p className="text-sm text-gray-600">Address ID: {addressId}</p>
          <div className="space-y-2">
            <label className="block"><span className="text-sm text-gray-700">Card Number</span><input className="input" placeholder="4242 4242 4242 4242" /></label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block"><span className="text-sm text-gray-700">Expiry</span><input className="input" placeholder="MM/YY" /></label>
              <label className="block"><span className="text-sm text-gray-700">CVC</span><input className="input" placeholder="123" /></label>
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