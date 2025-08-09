import React, { useEffect, useState } from 'react'
import { useApp } from '@/context/AppContext'
import { AnimatedContainer } from '@/components/common/AnimatedContainer'
import { Button } from '@/components/common/Button'
import { Product } from '@/api/client'
import axios from 'axios'

const Products: React.FC = () => {
  const { tenant, addToCart } = useApp()
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    axios.get(`${tenant.apiBaseUrl}/products`).then(r=>setProducts(r.data.products))
  }, [tenant.apiBaseUrl])

  return (
    <AnimatedContainer>
      <div className="container-page py-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(p => (
          <div key={p.id} className="card">
            <img src={p.image} alt={p.name} className="w-full h-40 object-cover rounded-md" />
            <h3 className="mt-3 text-lg font-semibold">{p.name}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{p.description}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="font-semibold">${p.price.toFixed(2)}</span>
              <Button onClick={() => addToCart(p.id)}>Add to cart</Button>
            </div>
          </div>
        ))}
      </div>
    </AnimatedContainer>
  )
}

export default Products