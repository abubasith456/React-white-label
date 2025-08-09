import React, { useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { AnimatedContainer } from '@/components/common/AnimatedContainer'

const emailValid = (email: string) => /.+@.+\..+/.test(email)

const Login: React.FC = () => {
  const { tenant, login, isLoading } = useApp()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const isFormValid = useMemo(() => emailValid(email) && password.length >= 4, [email, password])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!isFormValid) {
      setError('Please enter a valid email and password (min 4 chars).')
      return
    }
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError('Invalid credentials')
    }
  }

  return (
    <AnimatedContainer>
      <div className="container-page py-10">
        <div className="max-w-md mx-auto card animate-fade-in-up">
          <h1 className="text-2xl font-semibold mb-2">{tenant.strings.loginTitle}</h1>
          <p className="text-sm text-gray-600 mb-6">{tenant.strings.tagline}</p>
          <form onSubmit={onSubmit} className="space-y-4">
            <Input label="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
            <Input label="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
            {error && <div className="text-sm text-red-600">{error}</div>}
            <Button disabled={isLoading || !isFormValid} type="submit" className="w-full">Login</Button>
          </form>
          <div className="flex justify-between mt-4 text-sm">
            <Link to="/forgot" className="text-brand-primary">Forgot password?</Link>
            <Link to="/register" className="text-brand-secondary">Create account</Link>
          </div>
        </div>
      </div>
    </AnimatedContainer>
  )
}

export default Login