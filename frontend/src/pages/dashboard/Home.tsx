import React, { useEffect, useMemo, useState } from 'react'
import { useApp } from '@/context/AppContext'
import { Link } from 'react-router-dom'
import { AnimatedContainer } from '@/components/common/AnimatedContainer'
import axios from 'axios'

type Category = { id: string; name: string }

type Product = {
  id: string
  name: string
  description: string
  price: number
  image: string
  categoryId: string
}

const categoryIcon = (name: string) => {
  const map: Record<string, string> = {
    Electronics: '🔌',
    Home: '🏠',
    Apparel: '👕',
    Accessories: '🎒',
  }
  return map[name] || '🛍️'
}

const Home: React.FC = () => {
  const { tenant } = useApp()
  const [activeBanner, setActiveBanner] = useState(0)
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const id = setInterval(() => {
      setActiveBanner((i) => (i + 1) % tenant.banners.length)
    }, 5000)
    return () => clearInterval(id)
  }, [tenant.banners.length])

  useEffect(() => {
    axios.get(`${tenant.apiBaseUrl}/categories`).then(r=>setCategories(r.data.categories))
    axios.get(`${tenant.apiBaseUrl}/products`).then(r=>setProducts(r.data.products))
  }, [tenant.apiBaseUrl])

  const newProducts = useMemo(() => products.slice(0, 6), [products])

  return (
    <AnimatedContainer>
      {/* Banners */}
      <section className="relative h-56 sm:h-72 md:h-96 overflow-hidden rounded-none">
        {tenant.banners.map((src, idx) => (
          <img
            key={src}
            src={src}
            alt="banner"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${idx === activeBanner ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {tenant.banners.map((_, i) => (
            <button
              key={i}
              className={`h-2 w-8 rounded-full ${i === activeBanner ? 'bg-white' : 'bg-white/50'}`}
              onClick={() => setActiveBanner(i)}
              aria-label={`Go to banner ${i+1}`}
            />
          ))}
        </div>
        <div className="absolute inset-x-0 top-10 text-center text-white">
          <h1 className="text-3xl sm:text-5xl font-extrabold drop-shadow">{tenant.strings.appTitle}</h1>
          <p className="mt-2 text-sm sm:text-base drop-shadow">{tenant.strings.tagline}</p>
          <div className="mt-4 flex gap-3 justify-center">
            <Link className="btn-primary" to="/products">Shop Now</Link>
            <Link className="btn-primary bg-brand-secondary" to="/categories">Browse Categories</Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-page py-10">
        <h2 className="text-xl font-semibold mb-4">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map(c => (
            <Link key={c.id} to={`/categories/${c.id}`} className="group card flex flex-col items-center gap-2 hover:shadow-lg transition">
              <div className="text-3xl">{categoryIcon(c.name)}</div>
              <div className="font-medium group-hover:text-brand-primary">{c.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* New Products */}
      <section className="container-page pb-14">
        <h2 className="text-xl font-semibold mb-4">New Arrivals</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {newProducts.map(p => (
            <div key={p.id} className="card">
              <img src={p.image} alt={p.name} className="w-full h-40 object-cover rounded-md" />
              <h3 className="mt-3 text-lg font-semibold">{p.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{p.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-semibold">${p.price.toFixed(2)}</span>
                <Link to="/products" className="text-brand-primary">Details</Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AnimatedContainer>
  )
}

export default Home