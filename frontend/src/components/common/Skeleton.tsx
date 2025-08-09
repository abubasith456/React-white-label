import React from 'react'

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-800 rounded ${className}`} />
)

export const SkeletonRow: React.FC = () => (
  <div className="flex items-center gap-3 py-2">
    <Skeleton className="h-4 w-24" />
    <Skeleton className="h-4 w-16" />
    <Skeleton className="h-4 w-20" />
    <Skeleton className="h-4 w-32" />
  </div>
)

export const SkeletonCard: React.FC = () => (
  <div className="card space-y-3">
    <Skeleton className="h-40 w-full rounded-xl" />
    <Skeleton className="h-4 w-2/3" />
    <Skeleton className="h-4 w-1/2" />
  </div>
)