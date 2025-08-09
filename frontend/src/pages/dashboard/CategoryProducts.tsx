import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useApp } from '@/context/AppContext'
import { AnimatedContainer } from '@/components/common/AnimatedContainer'
import { Button } from '@/components/common/Button'

const CategoryProducts: React.FC = () => {
  const { tenant, addToCart } = useApp()
  const { id } = useParams<{ id: string }>()
  const [categories, setCategories] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    axios.get(`${tenant.apiBaseUrl}/categories`).then(r=>setCategories(r.data.categories))
    axios.get(`${tenant.apiBaseUrl}/products`).then(r=>setProducts(r.data.products))
  }, [tenant.apiBaseUrl])

  const category = useMemo(() => categories.find(c => c.id === id), [categories, id])
  const filtered = useMemo(() => products.filter((p:any) => p.categoryId === id), [products, id])

  return (
    <AnimatedContainer>
      <div className="container-page py-8">
        <h1 className="text-2xl font-semibold mb-4">{category?.name || 'Category'}</h1>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p:any) => (
            <div key={p.id} className="card hover:shadow-lg transition">
              <img src={p.image} alt={p.name} className="w-full h-44 object-cover rounded-md" />
              <h3 className="mt-3 text-lg font-semibold">{p.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{p.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-semibold">${p.price.toFixed(2)}</span>
                <Button onClick={() => addToCart(p.id)}>Add to cart</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AnimatedContainer>
  )
}

export default CategoryProducts