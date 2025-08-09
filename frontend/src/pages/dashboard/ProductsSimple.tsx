import React, { useEffect, useMemo, useState } from 'react'
import { useApp } from '@/context/AppContext'
import { Product } from '@/api/client'
import axios from 'axios'
import { Skeleton } from '@/components/common/Skeleton'
import { SimpleButton } from '@/components/common/SimpleButton'

const ProductsSimple: React.FC = () => {
  const { tenant, addToCart, toggleWishlist, wishlist } = useApp()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState('')
  const [sort, setSort] = useState('name-asc')

  useEffect(() => {
    if (!tenant) return
    
    setLoading(true)
    Promise.all([
      axios.get(`${tenant.apiBaseUrl}/products`).then(r=>setProducts(r.data.products)),
      axios.get(`${tenant.apiBaseUrl}/categories`).then(r=>setCategories(r.data.categories))
    ]).finally(() => setLoading(false))
  }, [tenant?.apiBaseUrl])

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

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || 'Unknown'
  }

  // Early return if context is not ready
  if (!tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-page py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🛍️ Our Products
          </h1>
          <p className="text-gray-600">
            Discover amazing products crafted with care and designed for your lifestyle
          </p>
        </div>

        {/* Filters Section */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <input
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="🔍 Search products..."
                  value={query}
                  onChange={e=>setQuery(e.target.value)}
                />
              </div>

              {/* Category Filter */}
              <select
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={cat}
                onChange={e=>setCat(e.target.value)}
              >
                <option value="">📂 All Categories</option>
                {categories.map((c:any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              {/* Sort */}
              <select
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sort}
                onChange={e=>setSort(e.target.value)}
              >
                <option value="name-asc">📝 Name (A-Z)</option>
                <option value="name-desc">📝 Name (Z-A)</option>
                <option value="price-asc">💰 Price (Low to High)</option>
                <option value="price-desc">💰 Price (High to Low)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-center">
          <p className="text-gray-600">
            {loading ? 'Loading...' : `Found ${filtered.length} product${filtered.length !== 1 ? 's' : ''}`}
            {cat && ` in ${getCategoryName(cat)}`}
            {query && ` matching "${query}"`}
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">😔</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              No Products Found
            </h3>
            <p className="text-gray-600 mb-8">
              Try adjusting your search criteria or browse all categories
            </p>
            <SimpleButton 
              variant="primary" 
              onClick={() => {
                setQuery('')
                setCat('')
                setSort('name-asc')
              }}
            >
              🔄 Reset Filters
            </SimpleButton>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(p => (
              <div key={p.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Wishlist Button */}
                  <button
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg hover:scale-110 transition-transform"
                    onClick={() => toggleWishlist?.(p.id)}
                  >
                    <span className="text-lg">
                      {wishlist?.includes(p.id) ? '❤️' : '🤍'}
                    </span>
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-gray-900 line-clamp-2">
                    {p.name}
                  </h3>

                  <p className="text-sm text-gray-600 line-clamp-2">
                    {p.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">
                      ${p.price.toFixed(2)}
                    </span>
                  </div>

                  <SimpleButton
                    variant="primary"
                    className="w-full"
                    onClick={() => addToCart(p.id, 1)}
                  >
                    🛒 Add to Cart
                  </SimpleButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductsSimple