import React, { useEffect, useMemo, useState } from 'react'
import { useApp } from '@/context/AppContext'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Carousel } from '@/components/common/Carousel'
import { Skeleton } from '@/components/common/Skeleton'
import { HorizontalScroller } from '@/components/common/HorizontalScroller'
import { motion } from 'framer-motion'
import { 
  AnimatedText, 
  CountingNumber, 
  AnimatedButton,
  StaggeredList,
  ProductCard as AnimatedProductCard,
  ProgressBar,
  FloatingElement,
  ShimmerEffect,
  GlowEffect
} from '@/components/animated'
import { 
  staggerContainer, 
  fadeInUp, 
  fadeInDown, 
  scaleIn 
} from '@/utils/animations'

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
  const { tenant, addToCart, cart, toggleWishlist, wishlist } = useApp()
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
  
  // Calculate cart total for progress bar
  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => {
      const product = products.find(p => p.id === item.productId)
      return total + (product?.price || 0) * item.quantity
    }, 0)
  }, [cart, products])

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
    <div className="relative">
      {/* Hero Section with enhanced animations */}
      <section className="relative overflow-hidden">
        <Carousel images={tenant.banners} />
        
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
        
        <motion.div 
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-white px-4"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold mb-4"
            variants={fadeInDown}
          >
            <AnimatedText variant="typewriter" speed={80} cursor>
              {tenant.strings.appTitle}
            </AnimatedText>
          </motion.h1>
          
          <motion.p 
            className="mt-4 text-lg sm:text-xl lg:text-2xl font-light drop-shadow-lg max-w-2xl mx-auto"
            variants={fadeInUp}
          >
            <AnimatedText variant="slide" delay={2}>
              {tenant.strings.tagline}
            </AnimatedText>
          </motion.p>
          
          <motion.div 
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center"
            variants={fadeInUp}
          >
            <Link to="/products">
              <AnimatedButton variant="primary" size="lg" className="bg-white text-gray-900 hover:bg-gray-100 shadow-xl">
                <span className="mr-2">🛍️</span>
                Shop Now
              </AnimatedButton>
            </Link>
            <Link to="/categories">
              <AnimatedButton variant="secondary" size="lg" className="bg-blue-600/80 backdrop-blur-sm text-white border-white/20 hover:bg-blue-700/80">
                Browse Categories
              </AnimatedButton>
            </Link>
          </motion.div>
        </motion.div>
        
        {/* Floating decorative elements */}
        <FloatingElement className="absolute top-20 left-10 text-4xl opacity-30" intensity={15} speed={3}>
          ✨
        </FloatingElement>
        <FloatingElement className="absolute bottom-20 right-10 text-3xl opacity-30" intensity={20} speed={2.5}>
          🎉
        </FloatingElement>
      </section>

      {/* Stats Section */}
      <motion.section 
        className="container-page py-16"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.3 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50"
            variants={scaleIn}
          >
            <div className="text-4xl font-bold text-blue-600 mb-2">
              <CountingNumber to={products.length} suffix="+" />
            </div>
            <p className="text-gray-600 font-medium">Amazing Products</p>
          </motion.div>
          
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50"
            variants={scaleIn}
          >
            <div className="text-4xl font-bold text-green-600 mb-2">
              <CountingNumber to={categories.length} suffix="+" />
            </div>
            <p className="text-gray-600 font-medium">Categories</p>
          </motion.div>
          
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50"
            variants={scaleIn}
          >
            <div className="text-4xl font-bold text-purple-600 mb-2">
              <CountingNumber to={99} suffix="%" />
            </div>
            <p className="text-gray-600 font-medium">Satisfaction Rate</p>
          </motion.div>
        </div>
      </motion.section>

      {/* Free Shipping Progress */}
      {cartTotal > 0 && (
        <motion.section
          className="container-page pb-8"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
        >
          <div className="max-w-md mx-auto">
            <ProgressBar
              current={cartTotal}
              target={100}
              label="🚚 Free Shipping Progress"
              showConfetti={true}
            />
          </div>
        </motion.section>
      )}

      {/* Categories Section */}
      <section className="container-page py-16">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            <AnimatedText variant="slide">Shop by Category</AnimatedText>
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            <AnimatedText variant="fade" delay={0.2}>
              Discover our carefully curated collections designed to meet all your needs
            </AnimatedText>
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ShimmerEffect key={i}>
                <Skeleton className="h-32 rounded-xl" />
              </ShimmerEffect>
            ))}
          </div>
        ) : (
          <StaggeredList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {categories.map(c => (
              <Link key={c.id} to={`/categories/${c.id}`}>
                <GlowEffect glowColor="#3b82f6" intensity={10}>
                  <motion.div 
                    className="group bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300"
                    whileHover={{ y: -5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div 
                      className="text-4xl mb-3"
                      animate={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                      {categoryIcon(c.name)}
                    </motion.div>
                    <div className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {c.name}
                    </div>
                  </motion.div>
                </GlowEffect>
              </Link>
            ))}
          </StaggeredList>
        )}
      </section>

      {/* Top Deals Section */}
      <section className="container-page pb-16">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            <AnimatedText variant="letter">🔥 Top Deals</AnimatedText>
          </h2>
          <p className="text-gray-600 text-center mb-12">
            <AnimatedText variant="fade" delay={0.3}>
              Don't miss out on these incredible savings!
            </AnimatedText>
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ShimmerEffect key={i}>
                <Skeleton className="h-80 rounded-xl" />
              </ShimmerEffect>
            ))}
          </div>
        ) : (
          <StaggeredList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {topDeals.map(p => (
              <AnimatedProductCard
                key={p.id}
                product={{
                  id: p.id,
                  name: p.name,
                  price: p.price,
                  originalPrice: p.price * 1.3, // Add fake original price for deal effect
                  image: p.image,
                  description: p.description,
                  badge: "Hot Deal",
                  inStock: true,
                }}
                onAddToCart={addToCart}
                onToggleWishlist={toggleWishlist}
                isInWishlist={wishlist?.includes(p.id) || false}
              />
            ))}
          </StaggeredList>
        )}
      </section>

      {/* Trending Section */}
      <section className="container-page pb-20">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            <AnimatedText variant="typewriter" speed={60}>📈 Trending Now</AnimatedText>
          </h2>
          <p className="text-gray-600 text-center mb-12">
            <AnimatedText variant="slide" delay={1}>
              What everyone's talking about
            </AnimatedText>
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ShimmerEffect key={i}>
                <Skeleton className="h-80 rounded-xl" />
              </ShimmerEffect>
            ))}
          </div>
        ) : (
          <StaggeredList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {trending.map(p => (
              <AnimatedProductCard
                key={p.id}
                product={{
                  id: p.id,
                  name: p.name,
                  price: p.price,
                  image: p.image,
                  description: p.description,
                  badge: "Trending",
                  inStock: true,
                }}
                onAddToCart={addToCart}
                onToggleWishlist={toggleWishlist}
                isInWishlist={wishlist?.includes(p.id) || false}
              />
            ))}
          </StaggeredList>
        )}
      </section>

      {/* Newsletter Section */}
      <motion.section 
        className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-20"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 1 }}
      >
        <div className="container-page text-center text-white">
          <motion.h2 
            className="text-3xl sm:text-4xl font-bold mb-4"
            variants={scaleIn}
          >
            <AnimatedText variant="letter">Stay in the Loop! 📧</AnimatedText>
          </motion.h2>
          <motion.p 
            className="text-xl mb-8 opacity-90"
            variants={fadeInUp}
          >
            <AnimatedText variant="fade" delay={0.5}>
              Get the latest deals, trends, and exclusive offers delivered to your inbox
            </AnimatedText>
          </motion.p>
          
          <motion.div 
            className="max-w-md mx-auto flex flex-col sm:flex-row gap-4"
            variants={fadeInUp}
          >
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-6 py-3 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm bg-white/90"
            />
            <AnimatedButton 
              variant="secondary" 
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 rounded-full font-semibold shadow-xl"
            >
              Subscribe ✨
            </AnimatedButton>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}

export default Home