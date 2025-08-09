import { LazyMotion, domAnimation, domMax } from 'framer-motion'

// Optimized motion features for better performance
export const motionFeatures = domAnimation

// Advanced motion features (load only when needed)
export const advancedMotionFeatures = domMax

// Global animation settings that respect user preferences
export const getGlobalAnimationSettings = () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  
  return {
    // Disable animations if user prefers reduced motion
    animate: !prefersReducedMotion,
    // Reduce animation duration if user prefers reduced motion
    transitionDuration: prefersReducedMotion ? 0.1 : 0.3,
    // Reduce spring stiffness for reduced motion
    springConfig: {
      type: 'spring',
      damping: prefersReducedMotion ? 30 : 25,
      stiffness: prefersReducedMotion ? 200 : 300,
    }
  }
}

// Performance optimized animation presets
export const performancePresets = {
  // GPU-accelerated properties only
  gpuOptimized: {
    transform: true,
    opacity: true,
    filter: false,
    layout: false,
  },
  
  // Layout animations (use sparingly)
  layoutOptimized: {
    layout: true,
    layoutId: true,
  },
  
  // Reduced motion alternatives
  reducedMotion: {
    opacity: { duration: 0.1 },
    scale: { duration: 0.1 },
    transform: { duration: 0.1 },
  }
}

// Intersection Observer settings for scroll-triggered animations
export const scrollAnimationConfig = {
  triggerOnce: true,
  threshold: 0.1,
  rootMargin: '-50px 0px',
}

// Common transition presets optimized for performance
export const optimizedTransitions = {
  fast: {
    duration: 0.15,
    ease: [0.4, 0, 0.2, 1], // Custom easing
  },
  medium: {
    duration: 0.25,
    ease: [0.4, 0, 0.2, 1],
  },
  slow: {
    duration: 0.4,
    ease: [0.4, 0, 0.2, 1],
  },
  spring: {
    type: 'spring',
    damping: 25,
    stiffness: 300,
    mass: 0.8,
  },
  bouncy: {
    type: 'spring',
    damping: 15,
    stiffness: 400,
    mass: 0.6,
  }
} as const