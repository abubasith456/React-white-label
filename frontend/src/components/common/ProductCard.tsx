import React, { useState } from 'react'
import { Button } from './Button'
import { StarRating } from './StarRating'

type Props = {
  id: string
  name: string
  description: string
  price: number
  image: string
  onAddToCart: (productId: string) => void
}

export const ProductCard: React.FC<Props> = ({ id, name, description, price, image, onAddToCart }) => {
  const [wish, setWish] = useState(false)
  const toggleWish = () => setWish(v => !v)

  return (
    <div className="card hover:shadow-xl transition group">
      <div className="relative">
        <img src={image} alt={name} className="w-full h-48 object-cover rounded-md" />
        <button aria-label="wishlist" onClick={toggleWish} className="absolute top-2 right-2 text-xl drop-shadow">
          <span className={wish ? 'text-red-500' : 'text-white'}>♥</span>
        </button>
      </div>
      <h3 className="mt-3 text-lg font-semibold line-clamp-1">{name}</h3>
      <StarRating value={4} />
      <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="font-semibold">${price.toFixed(2)}</span>
        <Button onClick={() => onAddToCart(id)}>Add to cart</Button>
      </div>
    </div>
  )
}