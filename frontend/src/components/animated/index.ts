// Core animated components
export { AnimatedButton } from './AnimatedButton'
export { ProductCard } from './ProductCard'
export { SafeProductCard } from './SafeProductCard'
export { ProgressBar } from './ProgressBar'
export { PageTransition, StaggeredList } from './PageTransition'

// Text animations
export { 
  AnimatedText, 
  CountingNumber, 
  AnimatedPrice 
} from './AnimatedText'

// Micro-interactions
export {
  FloatingElement,
  PulsingElement,
  MagneticButton,
  ShimmerEffect,
  GlowEffect,
  ParallaxElement,
  StaggeredReveal,
  TypewriterCursor
} from './MicroInteractions'

// Animation utilities
export * from '../../utils/animations'
export * from '../../utils/motionConfig'
export { MotionProvider } from '../providers/MotionProvider'