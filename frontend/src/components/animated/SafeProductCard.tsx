import React from 'react'
import { motion } from 'framer-motion'

interface SafeProductCardProps {
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

export const SafeProductCard: React.FC<SafeProductCardProps> = ({
  product,
  onAddToCart,
  onToggleWishlist,
  isInWishlist = false,
  className,
}) => {
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300 ${className}`}>
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {/* Sale Badge */}
        {(product.badge || discount) && (
          <div className="absolute top-3 left-3 z-10">
            <div className={`px-2 py-1 text-xs font-bold text-white rounded-md shadow-lg ${
              discount ? 'bg-red-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'
            }`}>
              {product.badge || `${discount}% OFF`}
            </div>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          className="absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 transition-transform"
          onClick={() => onToggleWishlist?.(product.id)}
        >
          <span className="text-lg">
            {isInWishlist ? '❤️' : '🤍'}
          </span>
        </button>

        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-gray-900 line-clamp-2">
          {product.name}
        </h3>

        {product.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Price Section */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>

          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}

          {discount && (
            <span className="text-sm font-medium text-red-600 bg-red-50 px-2 py-1 rounded">
              Save ${(product.originalPrice! - product.price).toFixed(2)}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            product.inStock ? 'bg-green-500' : 'bg-red-500'
          }`} />
          <span className="text-xs text-gray-600">
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart?.(product.id)}
          disabled={!product.inStock}
          className={`w-full mt-4 py-2 px-4 rounded-lg font-medium transition-colors ${
            product.inStock
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {product.inStock ? '🛒 Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  )
}