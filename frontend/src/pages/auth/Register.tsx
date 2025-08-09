import React, { useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { AnimatedContainer } from '@/components/common/AnimatedContainer'

const emailValid = (email: string) => /.+@.+\..+/.test(email)

const Register: React.FC = () => {
  const { tenant, register, isLoading } = useApp()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const isFormValid = useMemo(() => name.trim().length > 0 && emailValid(email) && password.length >= 6, [name, email, password])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!isFormValid) {
      setError('Fill all fields. Password must be at least 6 characters.')
      return
    }
    try {
      await register(name, email, password)
      navigate('/')
    } catch (err) {
      setError('Registration failed')
    }
  }

  return (
    <AnimatedContainer>
      <div className="container-page py-10">
        <div className="max-w-md mx-auto card animate-fade-in-up">
          <h1 className="text-2xl font-semibold mb-2">{tenant.strings.registerTitle}</h1>
          <p className="text-sm text-gray-600 mb-6">{tenant.strings.tagline}</p>
          <form onSubmit={onSubmit} className="space-y-4">
            <Input label="Name" value={name} onChange={e=>setName(e.target.value)} required />
            <Input label="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
            <Input label="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
            {error && <div className="text-sm text-red-600">{error}</div>}
            <Button disabled={isLoading || !isFormValid} type="submit" className="w-full">Register</Button>
          </form>
          <div className="flex justify-between mt-4 text-sm">
            <span />
            <Link to="/login" className="text-brand-secondary">Already have an account?</Link>
          </div>
        </div>
      </div>
    </AnimatedContainer>
  )
}

export default Register