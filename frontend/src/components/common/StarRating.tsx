import React from 'react'

type Props = { value: number, outOf?: number }

export const StarRating: React.FC<Props> = ({ value, outOf = 5 }) => {
  const full = Math.round(Math.min(Math.max(value, 0), outOf))
  return (
    <div aria-label={`Rating ${value} of ${outOf}`} className="text-amber-500 text-sm">
      {Array.from({ length: outOf }).map((_, i) => (
        <span key={i}>{i < full ? '★' : '☆'}</span>
      ))}
    </div>
  )}