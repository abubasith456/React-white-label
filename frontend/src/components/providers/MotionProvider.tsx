import React from 'react'
import { LazyMotion } from 'framer-motion'
import { motionFeatures } from '@/utils/motionConfig'

interface MotionProviderProps {
  children: React.ReactNode
  features?: any
  strict?: boolean
}

export const MotionProvider: React.FC<MotionProviderProps> = ({
  children,
  features = motionFeatures,
  strict = true
}) => {
  return (
    <LazyMotion features={features} strict={strict}>
      {children}
    </LazyMotion>
  )
}