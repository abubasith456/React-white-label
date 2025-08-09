import React, { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { useApp } from '@/context/AppContext'
import { Button } from '@/components/common/Button'
import { ProductCard } from '@/components/common/ProductCard'
import { StarRating } from '@/components/common/StarRating'

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { tenant, addToCart } = useApp()
  const [products, setProducts] = useState<any[]>([])
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    axios.get(`${tenant.apiBaseUrl}/products`).then(r=>setProducts(r.data.products))
  }, [tenant.apiBaseUrl])

  const product = useMemo(() => products.find(p => p.id === id), [products, id])
  const gallery = useMemo(() => product ? [product.image, product.image, product.image] : [], [product])
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
          <div className="aspect-[4/3] w-full overflow-hidden rounded-lg shadow">
            <img src={gallery[activeIdx]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="mt-3 flex gap-3">
            {gallery.map((img, i) => (
              <button key={i} onClick={() => setActiveIdx(i)} className={`h-16 w-20 rounded overflow-hidden border ${i===activeIdx?'border-brand-primary':'border-transparent'}`}>
                <img src={img} alt={`${product.name} ${i+1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          <div className="flex items-center gap-2"><StarRating value={4} /><span className="text-sm text-gray-600">(123 reviews)</span></div>
          <div className="text-emerald-700 font-semibold text-xl">${product.price.toFixed(2)}</div>
          <p className="text-gray-700">{product.description}</p>
          <div className="flex gap-3">
            <Button onClick={() => addToCart(product.id)}>Add to cart</Button>
            <Link to="/products" className="btn-primary bg-brand-secondary">Back to products</Link>
          </div>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Customer reviews</h2>
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="border rounded-lg p-3">
              <div className="flex items-center gap-2"><StarRating value={5-i} /><span className="text-sm text-gray-600">User {i}</span></div>
              <p className="text-sm text-gray-700 mt-1">Great product! Lorem ipsum dolor sit amet.</p>
            </div>
          ))}
        </div>
      </section>

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