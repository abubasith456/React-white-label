import React from 'react'
import { useApp } from '@/context/AppContext'
import { Link } from 'react-router-dom'
import { AnimatedContainer } from '@/components/common/AnimatedContainer'

const Home: React.FC = () => {
  const { tenant } = useApp()
  return (
    <AnimatedContainer>
      <section className="bg-gradient-to-br from-brand-primary/10 via-white to-brand-secondary/10">
        <div className="container-page py-16">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">{tenant.strings.appTitle}</h1>
          <p className="mt-3 text-gray-700 max-w-2xl">{tenant.strings.tagline}</p>
          <div className="mt-6 flex gap-3">
            <Link className="btn-primary" to="/products">Shop Products</Link>
            <Link className="btn-primary bg-brand-secondary" to="/categories">Browse Categories</Link>
          </div>
        </div>
      </section>
    </AnimatedContainer>
  )
}

export default Home