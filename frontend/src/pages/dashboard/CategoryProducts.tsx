import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useApp } from '@/context/AppContext'
import { AnimatedContainer } from '@/components/common/AnimatedContainer'
import { Button } from '@/components/common/Button'
import { ProductCard } from '@/components/common/ProductCard'
import { Skeleton } from '@/components/common/Skeleton'

const CategoryProducts: React.FC = () => {
  const { tenant, addToCart } = useApp()
  const { id } = useParams<{ id: string }>()
  const [categories, setCategories] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Filters
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(1000)
  const [rating, setRating] = useState(0)
  const [page, setPage] = useState(1)
  const pageSize = 6

  useEffect(() => {
    setLoading(true)
    Promise.all([
      axios.get(`${tenant.apiBaseUrl}/categories`).then(r=>setCategories(r.data.categories)),
      axios.get(`${tenant.apiBaseUrl}/products`).then(r=>setProducts(r.data.products))
    ]).finally(()=>setLoading(false))
  }, [tenant.apiBaseUrl])

  useEffect(() => { setPage(1) }, [id, minPrice, maxPrice, rating])

  const category = useMemo(() => categories.find(c => c.id === id), [categories, id])
  const filtered = useMemo(() => {
    let list = products.filter((p:any) => p.categoryId === id)
    list = list.filter((p:any) => p.price >= minPrice && p.price <= maxPrice)
    // rating filter is mock for now
    return list
  }, [products, id, minPrice, maxPrice, rating])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paged = filtered.slice((page-1)*pageSize, page*pageSize)

  return (
    <AnimatedContainer>
      <div className="container-page py-8 space-y-6">
        <h1 className="text-2xl font-semibold">{category?.name || 'Category'}</h1>

        <div className="card grid gap-3 md:grid-cols-4 items-center">
          <div className="md:col-span-2">
            <label className="text-sm text-gray-700">Price range: ${minPrice} - ${maxPrice}</label>
            <div className="flex items-center gap-3 mt-1">
              <input type="range" min={0} max={1000} value={minPrice} onChange={e=>setMinPrice(Number(e.target.value))} className="w-full" />
              <input type="range" min={0} max={1000} value={maxPrice} onChange={e=>setMaxPrice(Number(e.target.value))} className="w-full" />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-700">Rating</label>
            <select className="input" value={rating} onChange={e=>setRating(Number(e.target.value))}>
              <option value={0}>All</option>
              <option value={4}>4★ & up</option>
              <option value={3}>3★ & up</option>
              <option value={2}>2★ & up</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-64" />)}
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paged.map((p:any) => (
                <ProductCard key={p.id} id={p.id} name={p.name} description={p.description} price={p.price} image={p.image} onAddToCart={addToCart} />
              ))}
            </div>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Button variant="ghost" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}>Prev</Button>
              <span className="text-sm">Page {page} of {totalPages}</span>
              <Button variant="ghost" onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages}>Next</Button>
            </div>
          </>
        )}
      </div>
    </AnimatedContainer>
  )
}

export default CategoryProducts