import React from 'react'
import { Button } from './Button'
import { StarRating } from './StarRating'
import { useApp } from '@/context/AppContext'
import { motion } from 'framer-motion'

type Props = {
  id: string
  name: string
  description: string
  price: number
  image: string
  onAddToCart: (productId: string) => void
}

export const ProductCard: React.FC<Props> = ({ id, name, description, price, image, onAddToCart }) => {
  const { wishlist, toggleWishlist } = useApp()
  const wished = wishlist.includes(id)

  return (
    <motion.div whileHover={{ y: -2 }} className="card group">
      <div className="relative">
        <img src={image} alt={name} className="w-full h-52 object-cover rounded-xl" />
        <button aria-label="wishlist" onClick={() => toggleWishlist(id)} className="absolute top-2 right-2 text-xl drop-shadow">
          <span className={wished ? 'text-red-500' : 'text-white'}>♥</span>
        </button>
      </div>
      <h3 className="mt-3 text-lg font-semibold line-clamp-1">{name}</h3>
      <StarRating value={4} />
      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{description}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="font-semibold">${price.toFixed(2)}</span>
        <Button onClick={() => onAddToCart(id)} size="sm">Add to cart</Button>
      </div>
    </motion.div>
  )
}