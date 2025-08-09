import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { hoverLift, staggerItem, transitions } from '@/utils/animations'
import { cn } from '@/utils/cn'
import { AnimatedButton } from './AnimatedButton'

interface ProductCardProps {
  product: {
    id: string
    name: string
    price: number
    originalPrice?: number
    image: string
    description?: string
    badge?: string
    inStock?: boolean
  }
  onAddToCart?: (productId: string) => void
  onToggleWishlist?: (productId: string) => void
  isInWishlist?: boolean
  className?: string
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onToggleWishlist,
  isInWishlist = false,
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  return (
    <motion.div
      ref={ref}
      className={cn(
        'group relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden',
        className
      )}
      variants={staggerItem}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      whileHover={hoverLift}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {/* Sale Badge */}
        <AnimatePresence>
          {(product.badge || discount) && (
            <motion.div
              className="absolute top-3 left-3 z-10"
              initial={{ scale: 0, rotate: -12 }}
              animate={{ scale: 1, rotate: -12 }}
              exit={{ scale: 0 }}
              transition={transitions.springBouncy}
            >
              <motion.div
                className={cn(
                  'px-2 py-1 text-xs font-bold text-white rounded-md shadow-lg',
                  discount ? 'bg-red-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'
                )}
                animate={{
                  rotate: isHovered ? [-12, -15, -12] : -12,
                }}
                transition={{
                  duration: 0.5,
                  repeat: isHovered ? Infinity : 0,
                  repeatType: 'loop',
                }}
              >
                {product.badge || `${discount}% OFF`}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wishlist Button */}
        <motion.button
          className="absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg"
          onClick={() => onToggleWishlist?.(product.id)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.svg
            className="w-5 h-5"
            fill={isInWishlist ? '#ef4444' : 'none'}
            stroke={isInWishlist ? '#ef4444' : '#6b7280'}
            viewBox="0 0 24 24"
            animate={{
              scale: isInWishlist ? [1, 1.2, 1] : 1,
            }}
            transition={transitions.springBouncy}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </motion.svg>
        </motion.button>

        {/* Product Image */}
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          onLoad={() => setImageLoaded(true)}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ 
            scale: imageLoaded ? (isHovered ? 1.05 : 1) : 1.1,
            opacity: imageLoaded ? 1 : 0
          }}
          transition={transitions.medium}
        />

        {/* Image Loading Skeleton */}
        {!imageLoaded && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        )}

        {/* Quick Actions Overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute inset-0 bg-black/20 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={transitions.fast}
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ delay: 0.1 }}
              >
                <AnimatedButton
                  size="sm"
                  onClick={() => onAddToCart?.(product.id)}
                  disabled={!product.inStock}
                  className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg"
                >
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </AnimatedButton>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-2">
        <motion.h3
          className="font-semibold text-gray-900 line-clamp-2"
          layoutId={`product-title-${product.id}`}
        >
          {product.name}
        </motion.h3>

        {product.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Price Section */}
        <div className="flex items-center gap-2">
          <motion.span
            className="text-lg font-bold text-gray-900"
            layoutId={`product-price-${product.id}`}
          >
            ${product.price.toFixed(2)}
          </motion.span>

          {product.originalPrice && (
            <motion.span
              className="text-sm text-gray-500 line-through"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              ${product.originalPrice.toFixed(2)}
            </motion.span>
          )}

          {discount && (
            <motion.span
              className="text-sm font-medium text-red-600 bg-red-50 px-2 py-1 rounded"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, ...transitions.springBouncy }}
            >
              Save ${(product.originalPrice! - product.price).toFixed(2)}
            </motion.span>
          )}
        </div>

        {/* Stock Status */}
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className={cn(
            'w-2 h-2 rounded-full',
            product.inStock ? 'bg-green-500' : 'bg-red-500'
          )} />
          <span className="text-xs text-gray-600">
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </motion.div>
      </div>
    </motion.div>
  )
}