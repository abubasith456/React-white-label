import React, { useRef } from 'react'

export const HorizontalScroller: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null)
  const scrollBy = (px: number) => ref.current?.scrollBy({ left: px, behavior: 'smooth' })
  return (
    <div className={`relative ${className}`}>
      <button aria-label="scroll left" onClick={() => scrollBy(-300)} className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-white shadow hover:shadow-md">‹</button>
      <div ref={ref} className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 [scrollbar-width:none] [-ms-overflow-style:none]">
        <style>{`.no-scrollbar::-webkit-scrollbar{display:none}`}</style>
        {children}
      </div>
      <button aria-label="scroll right" onClick={() => scrollBy(300)} className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-white shadow hover:shadow-md">›</button>
    </div>
  )
}