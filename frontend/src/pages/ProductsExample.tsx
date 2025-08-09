import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { PageTransition, StaggeredList } from '@/components/animated/PageTransition'
import { ProductCard } from '@/components/animated/ProductCard'
import { AnimatedButton } from '@/components/animated/AnimatedButton'
import { AnimatedText, CountingNumber, AnimatedPrice } from '@/components/animated/AnimatedText'
import { ProgressBar } from '@/components/animated/ProgressBar'
import { staggerContainer, fadeInUp, fadeInDown } from '@/utils/animations'

// Example product data
const exampleProducts = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    price: 199.99,
    originalPrice: 299.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
    description: 'High-quality wireless headphones with noise cancellation',
    badge: 'Best Seller',
    inStock: true,
  },
  {
    id: '2',
    name: 'Smart Watch Series X',
    price: 399.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
    description: 'Advanced fitness tracking and health monitoring',
    inStock: true,
  },
  {
    id: '3',
    name: 'Gaming Mechanical Keyboard',
    price: 149.99,
    originalPrice: 199.99,
    image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&h=500&fit=crop',
    description: 'RGB backlit mechanical keyboard for gaming',
    inStock: false,
  },
  {
    id: '4',
    name: 'Professional Camera Lens',
    price: 899.99,
    image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=500&h=500&fit=crop',
    description: 'Professional grade 85mm f/1.4 portrait lens',
    badge: 'Pro',
    inStock: true,
  },
]

export const ProductsExample: React.FC = () => {
  const [cartTotal, setCartTotal] = useState(45.99)
  const [wishlist, setWishlist] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const handleAddToCart = async (productId: string) => {
    setLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const product = exampleProducts.find(p => p.id === productId)
    if (product) {
      setCartTotal(prev => prev + product.price)
    }
    
    setLoading(false)
  }

  const handleToggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  return (
    <PageTransition className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-12"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-5xl font-bold text-gray-900 mb-4"
            variants={fadeInDown}
          >
            <AnimatedText variant="typewriter" speed={100} cursor>
              Premium Electronics Store
            </AnimatedText>
          </motion.h1>
          
          <motion.p
            className="text-xl text-gray-600 mb-8"
            variants={fadeInUp}
          >
            <AnimatedText variant="slide" delay={2}>
              Discover our collection of cutting-edge technology
            </AnimatedText>
          </motion.p>

          {/* Stats Section */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto mb-12"
            variants={fadeInUp}
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                <CountingNumber to={10000} suffix="+" formatter={(v) => v.toLocaleString()} />
              </div>
              <p className="text-gray-600">Happy Customers</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                <CountingNumber to={500} suffix="+" />
              </div>
              <p className="text-gray-600">Products</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                <CountingNumber to={99} suffix="%" />
              </div>
              <p className="text-gray-600">Satisfaction Rate</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Free Shipping Progress */}
        <motion.div
          className="max-w-md mx-auto mb-12"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
        >
          <ProgressBar
            current={cartTotal}
            target={100}
            label="Free Shipping Progress"
            showConfetti={true}
          />
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          className="flex flex-wrap gap-4 justify-center mb-8"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
        >
          <AnimatedButton variant="primary">
            All Products
          </AnimatedButton>
          <AnimatedButton variant="secondary">
            Electronics
          </AnimatedButton>
          <AnimatedButton variant="secondary">
            Gaming
          </AnimatedButton>
          <AnimatedButton variant="secondary">
            Photography
          </AnimatedButton>
        </motion.div>

        {/* Products Grid */}
        <StaggeredList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {exampleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              isInWishlist={wishlist.includes(product.id)}
            />
          ))}
        </StaggeredList>

        {/* Feature Highlight */}
        <motion.div
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-4">
            <AnimatedText variant="letter">
              Special Launch Offer
            </AnimatedText>
          </h2>
          <p className="text-xl mb-6 opacity-90">
            <AnimatedText variant="fade" delay={1}>
              Get 30% off on all premium products this week only!
            </AnimatedText>
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-6">
            <AnimatedPrice
              price={199.99}
              originalPrice={299.99}
              currency="$"
              className="text-white"
            />
          </div>
          
          <AnimatedButton
            variant="secondary"
            size="lg"
            loading={loading}
            onClick={() => handleAddToCart('featured')}
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            Shop Now
          </AnimatedButton>
        </motion.div>

        {/* Newsletter Section */}
        <motion.div
          className="text-center mt-16"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1 }}
        >
          <h3 className="text-2xl font-bold mb-4">
            <AnimatedText variant="slide">
              Stay Updated with Latest Offers
            </AnimatedText>
          </h3>
          <div className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <AnimatedButton variant="primary">
              Subscribe
            </AnimatedButton>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  )
}