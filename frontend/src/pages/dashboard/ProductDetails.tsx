import React, { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { useApp } from '@/context/AppContext'
import { Button } from '@/components/common/Button'
import { ProductCard } from '@/components/common/ProductCard'

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { tenant, addToCart } = useApp()
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    axios.get(`${tenant.apiBaseUrl}/products`).then(r=>setProducts(r.data.products))
  }, [tenant.apiBaseUrl])

  const product = useMemo(() => products.find(p => p.id === id), [products, id])
  const related = useMemo(() => products.filter(p => p.categoryId === product?.categoryId && p.id !== product?.id).slice(0, 4), [products, product])

  if (!product) return (
    <div className="container-page py-8">
      <div className="text-sm text-gray-600">Loading...</div>
    </div>
  )

  return (
    <div className="container-page py-8 space-y-10">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <img src={product.image} alt={product.name} className="w-full h-80 object-cover rounded-lg shadow" />
        </div>
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          <div className="text-emerald-700 font-semibold text-xl">${product.price.toFixed(2)}</div>
          <p className="text-gray-700">{product.description}</p>
          <div className="flex gap-3">
            <Button onClick={() => addToCart(product.id)}>Add to cart</Button>
            <Link to="/products" className="btn-primary bg-brand-secondary">Back to products</Link>
          </div>
        </div>
      </div>

      <section>
        <h2 className="text-lg font-semibold mb-3">Related Products</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {related.map((p:any) => (
            <ProductCard key={p.id} id={p.id} name={p.name} description={p.description} price={p.price} image={p.image} onAddToCart={addToCart} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default ProductDetails