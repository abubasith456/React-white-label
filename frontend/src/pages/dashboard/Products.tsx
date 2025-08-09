import React, { useEffect, useMemo, useState } from 'react'
import { useApp } from '@/context/AppContext'
import { AnimatedContainer } from '@/components/common/AnimatedContainer'
import { Product } from '@/api/client'
import axios from 'axios'
import { ProductCard } from '@/components/common/ProductCard'
import { Skeleton } from '@/components/common/Skeleton'

const Products: React.FC = () => {
  const { tenant, addToCart } = useApp()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState('')
  const [sort, setSort] = useState('name-asc')

  useEffect(() => {
    setLoading(true)
    Promise.all([
      axios.get(`${tenant.apiBaseUrl}/products`).then(r=>setProducts(r.data.products)),
      axios.get(`${tenant.apiBaseUrl}/categories`).then(r=>setCategories(r.data.categories))
    ]).finally(() => setLoading(false))
  }, [tenant.apiBaseUrl])

  const filtered = useMemo(() => {
    let list = [...products]
    if (query.trim()) list = list.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
    if (cat) list = list.filter(p => p.categoryId === cat)
    switch (sort) {
      case 'price-asc': list.sort((a,b)=>a.price-b.price); break
      case 'price-desc': list.sort((a,b)=>b.price-a.price); break
      case 'name-desc': list.sort((a,b)=>b.name.localeCompare(a.name)); break
      default: list.sort((a,b)=>a.name.localeCompare(b.name))
    }
    return list
  }, [products, query, cat, sort])

  return (
    <AnimatedContainer>
      <div className="container-page py-8 space-y-4">
        <div className="card grid md:grid-cols-4 gap-3">
          <input className="input md:col-span-2" placeholder="Search products" value={query} onChange={e=>setQuery(e.target.value)} />
          <select className="input" value={cat} onChange={e=>setCat(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((c:any) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select className="input" value={sort} onChange={e=>setSort(e.target.value)}>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
          </select>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-64" />)}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(p => (
              <ProductCard key={p.id} id={p.id} name={p.name} description={p.description} price={p.price} image={p.image} onAddToCart={addToCart} />
            ))}
          </div>
        )}
      </div>
    </AnimatedContainer>
  )
}

export default Products