import React, { useEffect, useState } from 'react'
import { useApp } from '@/context/AppContext'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  AnimatedText, 
  AnimatedPrice, 
  AnimatedButton,
  StaggeredList,
  ProgressBar,
  GlowEffect,
  FloatingElement
} from '@/components/animated'
import { 
  fadeInUp, 
  fadeInDown, 
  scaleIn,
  slideUp 
} from '@/utils/animations'

const Cart: React.FC = () => {
  const { tenant, cart, refreshCart, removeFromCart } = useApp()
  const [products, setProducts] = useState<Record<string, { name: string; price: number; image?: string }>>({})
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set())

  useEffect(() => {
    axios.get(`${tenant.apiBaseUrl}/products`).then(r=>{
      const map: Record<string, { name: string; price: number; image?: string }> = {}
      for (const p of r.data.products) map[p.id] = { name: p.name, price: p.price, image: p.image }
      setProducts(map)
    })
    refreshCart()
  }, [tenant.apiBaseUrl])

  const total = cart.reduce((sum, item) => sum + (products[item.productId]?.price || 0) * item.quantity, 0)
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const handleRemoveItem = async (productId: string) => {
    setRemovingItems(prev => new Set(prev).add(productId))
    
    // Add delay for animation
    setTimeout(() => {
      removeFromCart(productId)
      setRemovingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
    }, 300)
  }

  const EmptyCart = () => (
    <motion.div 
      className="text-center py-16"
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
    >
      <FloatingElement intensity={20} speed={3}>
        <div className="text-8xl mb-6">🛒</div>
      </FloatingElement>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        <AnimatedText variant="typewriter" speed={80}>
          Your Cart is Empty
        </AnimatedText>
      </h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        <AnimatedText variant="fade" delay={1}>
          Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
        </AnimatedText>
      </p>
      <Link to="/products">
        <AnimatedButton variant="primary" size="lg" className="shadow-xl">
          <span className="mr-2">🛍️</span>
          Start Shopping
        </AnimatedButton>
      </Link>
    </motion.div>
  )

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="container-page py-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          variants={fadeInDown}
          initial="hidden"
          animate="visible"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            <AnimatedText variant="letter">🛒 Shopping Cart</AnimatedText>
          </h1>
          {cart.length > 0 && (
            <motion.p 
              className="text-gray-600"
              variants={fadeInUp}
            >
              <AnimatedText variant="fade" delay={0.3}>
                You have {itemCount} item{itemCount !== 1 ? 's' : ''} in your cart
              </AnimatedText>
            </motion.p>
          )}
        </motion.div>

        {cart.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <motion.div 
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                  <AnimatedText variant="slide">Cart Items</AnimatedText>
                </h2>
                
                <AnimatePresence mode="popLayout">
                  {cart.map((item, index) => (
                    <motion.div
                      key={item.productId}
                      className="border-b border-gray-200/50 py-6 last:border-b-0"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ 
                        opacity: removingItems.has(item.productId) ? 0 : 1,
                        x: removingItems.has(item.productId) ? -100 : 0,
                        scale: removingItems.has(item.productId) ? 0.8 : 1
                      }}
                      exit={{ opacity: 0, x: -100, scale: 0.8 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      layout
                    >
                      <div className="flex items-center gap-4">
                        {/* Product Image */}
                        <motion.div 
                          className="relative overflow-hidden rounded-xl"
                          whileHover={{ scale: 1.05 }}
                        >
                          <img 
                            src={products[item.productId]?.image} 
                            alt={products[item.productId]?.name} 
                            className="w-20 h-20 object-cover"
                          />
                          <motion.div 
                            className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors"
                          />
                        </motion.div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {products[item.productId]?.name || 'Product'}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2">
                            Quantity: {item.quantity}
                          </p>
                          <AnimatedPrice 
                            price={(products[item.productId]?.price || 0) * item.quantity}
                            className="text-sm"
                          />
                        </div>

                        {/* Remove Button */}
                        <AnimatedButton
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveItem(item.productId)}
                          disabled={removingItems.has(item.productId)}
                          className="ml-4"
                        >
                          {removingItems.has(item.productId) ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              ⏳
                            </motion.div>
                          ) : (
                            <>🗑️ Remove</>
                          )}
                        </AnimatedButton>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div 
                className="sticky top-8"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.4 }}
              >
                <GlowEffect glowColor="#3b82f6" intensity={15}>
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 p-6">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">
                      <AnimatedText variant="slide">Order Summary</AnimatedText>
                    </h2>

                    {/* Progress to Free Shipping */}
                    <div className="mb-6">
                      <ProgressBar
                        current={total}
                        target={100}
                        label="🚚 Free Shipping Progress"
                        showConfetti={true}
                      />
                    </div>

                    {/* Price Breakdown */}
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal ({itemCount} items)</span>
                        <AnimatedPrice price={total} showDiscount={false} />
                      </div>
                      
                      <div className="flex justify-between text-gray-600">
                        <span>Shipping</span>
                        <span className={total >= 100 ? 'text-green-600 font-semibold' : ''}>
                          {total >= 100 ? 'FREE! 🎉' : '$9.99'}
                        </span>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex justify-between text-xl font-bold">
                          <span>Total</span>
                          <AnimatedPrice 
                            price={total + (total >= 100 ? 0 : 9.99)} 
                            showDiscount={false}
                            className="text-xl"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <Link to="/checkout" className="block">
                      <AnimatedButton 
                        variant="primary" 
                        size="lg" 
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl"
                        disabled={cart.length === 0}
                      >
                        <span className="mr-2">💳</span>
                        Proceed to Checkout
                      </AnimatedButton>
                    </Link>

                    {/* Continue Shopping */}
                    <Link to="/products" className="block mt-4">
                      <AnimatedButton 
                        variant="ghost" 
                        className="w-full text-gray-600 hover:text-gray-800"
                      >
                        <span className="mr-2">🛍️</span>
                        Continue Shopping
                      </AnimatedButton>
                    </Link>

                    {/* Security Badge */}
                    <motion.div 
                      className="mt-6 text-center text-sm text-gray-500"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                    >
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span>🔒</span>
                        <span>Secure Checkout</span>
                      </div>
                      <p className="text-xs">
                        Your payment information is encrypted and secure
                      </p>
                    </motion.div>
                  </div>
                </GlowEffect>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart