import React, { useEffect, useMemo, useState } from 'react'
import { useApp } from '@/context/AppContext'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Carousel } from '@/components/common/Carousel'
import { ProductCard } from '@/components/common/ProductCard'
import { Skeleton } from '@/components/common/Skeleton'
import { HorizontalScroller } from '@/components/common/HorizontalScroller'

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
  const map: Record<string, string> = { Electronics: '🔌', Home: '🏠', Apparel: '👕', Accessories: '🎒' }
  return map[name] || '🛍️'
}

const Home: React.FC = () => {
  const { tenant, addToCart } = useApp()
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      axios.get(`${tenant.apiBaseUrl}/categories`).then(r=>setCategories(r.data.categories)),
      axios.get(`${tenant.apiBaseUrl}/products`).then(r=>setProducts(r.data.products)),
    ]).finally(() => setLoading(false))
  }, [tenant.apiBaseUrl])

  const newProducts = useMemo(() => products.slice(0, 6), [products])
  const topDeals = useMemo(() => [...products].sort((a,b)=>a.price-b.price).slice(0, 10), [products])
  const trending = useMemo(() => [...products].reverse().slice(0, 10), [products])

  return (
    <div>
      <section className="relative">
        <Carousel images={tenant.banners} />
        <div className="absolute inset-x-0 top-10 text-center text-white">
          <h1 className="text-3xl sm:text-5xl font-extrabold drop-shadow">{tenant.strings.appTitle}</h1>
          <p className="mt-2 text-sm sm:text-base drop-shadow">{tenant.strings.tagline}</p>
          <div className="mt-4 flex gap-3 justify-center">
            <Link className="btn-primary" to="/products">Shop Now</Link>
            <Link className="btn-primary bg-brand-secondary" to="/categories">Browse Categories</Link>
          </div>
        </div>
      </section>

      <section className="container-page py-10">
        <h2 className="text-xl font-semibold mb-4">Shop by Category</h2>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map(c => (
              <Link key={c.id} to={`/categories/${c.id}`} className="group card flex flex-col items-center gap-2 hover:shadow-lg transition">
                <div className="text-3xl">{categoryIcon(c.name)}</div>
                <div className="font-medium group-hover:text-brand-primary">{c.name}</div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="container-page pb-8">
        <h2 className="text-xl font-semibold mb-3">Top Deals</h2>
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-64" />)}
          </div>
        ) : (
          topDeals.length <= 3 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {topDeals.map(p => (
                <ProductCard key={p.id} id={p.id} name={p.name} description={p.description} price={p.price} image={p.image} onAddToCart={addToCart} />
              ))}
            </div>
          ) : (
            <HorizontalScroller>
              {topDeals.map(p => (
                <div key={p.id} className="min-w-[240px] snap-start">
                  <ProductCard id={p.id} name={p.name} description={p.description} price={p.price} image={p.image} onAddToCart={addToCart} />
                </div>
              ))}
            </HorizontalScroller>
          )
        )}
      </section>

      <section className="container-page pb-14">
        <h2 className="text-xl font-semibold mb-3">Trending Now</h2>
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-64" />)}
          </div>
        ) : (
          trending.length <= 3 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {trending.map(p => (
                <ProductCard key={p.id} id={p.id} name={p.name} description={p.description} price={p.price} image={p.image} onAddToCart={addToCart} />
              ))}
            </div>
          ) : (
            <HorizontalScroller>
              {trending.map(p => (
                <div key={p.id} className="min-w-[240px] snap-start">
                  <ProductCard id={p.id} name={p.name} description={p.description} price={p.price} image={p.image} onAddToCart={addToCart} />
                </div>
              ))}
            </HorizontalScroller>
          )
        )}
      </section>
    </div>
  )
}

export default Home