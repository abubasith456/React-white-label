import React, { useEffect, useMemo, useState } from 'react'
import { useApp } from '@/context/AppContext'
import { Product } from '@/api/client'
import axios from 'axios'
import { Skeleton } from '@/components/common/Skeleton'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  AnimatedText, 
  AnimatedButton,
  StaggeredList,
  ProductCard as AnimatedProductCard,
  ShimmerEffect,
  MagneticButton,
  GlowEffect
} from '@/components/animated'
import { 
  fadeInUp, 
  fadeInDown, 
  staggerContainer 
} from '@/utils/animations'

const Products: React.FC = () => {
  const { tenant, addToCart, toggleWishlist, wishlist } = useApp()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState('')
  const [sort, setSort] = useState('name-asc')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30">
      <div className="container-page py-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          variants={fadeInDown}
          initial="hidden"
          animate="visible"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            <AnimatedText variant="typewriter" speed={80}>
              🛍️ Our Products
            </AnimatedText>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            <AnimatedText variant="fade" delay={1}>
              Discover amazing products crafted with care and designed for your lifestyle
            </AnimatedText>
          </p>
        </motion.div>

        {/* Filters Section */}
        <motion.div 
          className="mb-8"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
        >
          <GlowEffect glowColor="#8b5cf6" intensity={10}>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Search */}
                <div className="lg:col-span-2 relative">
                  <motion.input
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/90 backdrop-blur-sm"
                    placeholder="🔍 Search products..."
                    value={query}
                    onChange={e=>setQuery(e.target.value)}
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  />
                  <AnimatePresence>
                    {query && (
                      <motion.button
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setQuery('')}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                      >
                        ❌
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>

                {/* Category Filter */}
                <motion.select
                  className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/90 backdrop-blur-sm"
                  value={cat}
                  onChange={e=>setCat(e.target.value)}
                  whileFocus={{ scale: 1.02 }}
                >
                  <option value="">📂 All Categories</option>
                  {categories.map((c:any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </motion.select>

                {/* Sort */}
                <motion.select
                  className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/90 backdrop-blur-sm"
                  value={sort}
                  onChange={e=>setSort(e.target.value)}
                  whileFocus={{ scale: 1.02 }}
                >
                  <option value="name-asc">📝 Name (A-Z)</option>
                  <option value="name-desc">📝 Name (Z-A)</option>
                  <option value="price-asc">💰 Price (Low to High)</option>
                  <option value="price-desc">💰 Price (High to Low)</option>
                </motion.select>

                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 rounded-xl p-1">
                  <motion.button
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-white text-purple-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => setViewMode('grid')}
                    whileTap={{ scale: 0.95 }}
                  >
                    ⚏ Grid
                  </motion.button>
                  <motion.button
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-white text-purple-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => setViewMode('list')}
                    whileTap={{ scale: 0.95 }}
                  >
                    ☰ List
                  </motion.button>
                </div>
              </div>
            </div>
          </GlowEffect>
        </motion.div>

        {/* Results Count */}
        <motion.div 
          className="mb-6 text-center"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
        >
          <p className="text-gray-600">
            <AnimatedText variant="fade" delay={0.6}>
              {loading ? 'Loading...' : `Found ${filtered.length} product${filtered.length !== 1 ? 's' : ''}`}
              {cat && ` in ${getCategoryName(cat)}`}
              {query && ` matching "${query}"`}
            </AnimatedText>
          </p>
        </motion.div>

        {/* Products Grid/List */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <ShimmerEffect key={i}>
                  <Skeleton className="h-80 rounded-xl" />
                </ShimmerEffect>
              ))}
            </motion.div>
          ) : filtered.length === 0 ? (
            <motion.div 
              key="empty"
              className="text-center py-16"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="text-8xl mb-6">😔</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                <AnimatedText variant="typewriter">
                  No Products Found
                </AnimatedText>
              </h3>
              <p className="text-gray-600 mb-8">
                <AnimatedText variant="fade" delay={0.5}>
                  Try adjusting your search criteria or browse all categories
                </AnimatedText>
              </p>
              <AnimatedButton 
                variant="primary" 
                onClick={() => {
                  setQuery('')
                  setCat('')
                  setSort('name-asc')
                }}
              >
                🔄 Reset Filters
              </AnimatedButton>
            </motion.div>
          ) : (
            <motion.div
              key={`${viewMode}-${filtered.length}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <StaggeredList 
                className={
                  viewMode === 'grid' 
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }
                staggerDelay={0.05}
              >
                {filtered.map(p => (
                  <div key={p.id}>
                    {viewMode === 'grid' ? (
                                             <AnimatedProductCard
                         product={{
                           id: p.id,
                           name: p.name,
                           price: p.price,
                           image: p.image,
                           description: p.description,
                           inStock: true,
                         }}
                         onAddToCart={() => addToCart(p.id, 1)}
                         onToggleWishlist={toggleWishlist}
                         isInWishlist={wishlist?.includes(p.id) || false}
                       />
                    ) : (
                      /* List View */
                      <motion.div 
                        className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-4 hover:shadow-xl transition-all duration-300"
                        whileHover={{ y: -2 }}
                      >
                        <div className="flex items-center gap-4">
                          <motion.img 
                            src={p.image} 
                            alt={p.name}
                            className="w-20 h-20 object-cover rounded-lg"
                            whileHover={{ scale: 1.1 }}
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{p.name}</h3>
                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{p.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-bold text-gray-900">
                                ${p.price.toFixed(2)}
                              </span>
                              <div className="flex items-center gap-2">
                                                                 <MagneticButton
                                   className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
                                   onClick={() => toggleWishlist?.(p.id)}
                                 >
                                   {wishlist?.includes(p.id) ? '❤️' : '🤍'}
                                 </MagneticButton>
                                <AnimatedButton 
                                  variant="primary" 
                                  size="sm"
                                  onClick={() => addToCart(p.id, 1)}
                                >
                                  🛒 Add to Cart
                                </AnimatedButton>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                ))}
              </StaggeredList>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Products