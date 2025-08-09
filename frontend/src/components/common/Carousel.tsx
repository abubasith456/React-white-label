import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Props = { images: string[], intervalMs?: number }

export const Carousel: React.FC<Props> = ({ images, intervalMs = 5000 }) => {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setIndex(i => (i + 1) % images.length), intervalMs)
    return () => clearInterval(id)
  }, [images.length, intervalMs])

  return (
    <div className="relative h-56 sm:h-72 md:h-96 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.img
          key={index}
          src={images[index]}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <button key={i} className={`h-2 w-8 rounded-full ${i === index ? 'bg-white' : 'bg-white/50'}`} onClick={() => setIndex(i)} />
        ))}
      </div>
    </div>
  )
}