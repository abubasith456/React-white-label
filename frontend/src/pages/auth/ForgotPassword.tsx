import React, { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { AnimatedContainer } from '@/components/common/AnimatedContainer'
import axios from 'axios'

const ForgotPassword: React.FC = () => {
  const { tenant } = useApp()
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await axios.post(`${tenant.apiBaseUrl}/auth/forgot`, { email })
    setDone(true)
  }

  return (
    <AnimatedContainer>
      <div className="container-page py-10">
        <div className="max-w-md mx-auto card animate-fade-in-up">
          <h1 className="text-2xl font-semibold mb-2">{tenant.strings.forgotTitle}</h1>
          <p className="text-sm text-gray-600 mb-6">{tenant.strings.tagline}</p>
          {done ? (
            <p className="text-green-700">If the email exists, we sent a reset link.</p>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <Input label="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
              <Button type="submit" className="w-full">Send reset link</Button>
            </form>
          )}
        </div>
      </div>
    </AnimatedContainer>
  )
}

export default ForgotPassword