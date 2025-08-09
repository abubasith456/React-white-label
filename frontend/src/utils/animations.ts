import { Variants, Transition } from 'framer-motion'

// Check if user prefers reduced motion
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Common easing functions
export const easings = {
  easeOutCubic: [0.33, 1, 0.68, 1],
  easeInOutCubic: [0.65, 0, 0.35, 1],
  spring: { type: 'spring', damping: 25, stiffness: 300 },
  springBouncy: { type: 'spring', damping: 15, stiffness: 400 },
} as const

// Common transitions
export const transitions: Record<string, Transition> = {
  fast: { duration: 0.2, ease: easings.easeOutCubic },
  medium: { duration: 0.3, ease: easings.easeOutCubic },
  slow: { duration: 0.5, ease: easings.easeOutCubic },
  spring: easings.spring,
  springBouncy: easings.springBouncy,
}

// Animation variants
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.medium,
  },
}

export const fadeInDown: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.medium,
  },
}

export const fadeInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.medium,
  },
}

export const fadeInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.medium,
  },
}

export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.spring,
  },
}

export const slideUp: Variants = {
  hidden: {
    y: '100%',
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: transitions.medium,
  },
  exit: {
    y: '100%',
    opacity: 0,
    transition: transitions.fast,
  },
}

// Stagger animations
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

export const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.medium,
  },
}

// Hover and tap effects
export const hoverScale = {
  scale: 1.02,
  transition: transitions.fast,
}

export const tapScale = {
  scale: 0.98,
  transition: transitions.fast,
}

export const hoverLift = {
  y: -2,
  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  transition: transitions.medium,
}

// Page transitions
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    x: 20,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: transitions.medium,
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: transitions.fast,
  },
}

// Text animations
export const typewriter = {
  hidden: { width: 0 },
  visible: {
    width: '100%',
    transition: {
      duration: 2,
      ease: 'easeInOut',
    },
  },
}

export const letterByLetter: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.02,
    },
  },
}

export const letter: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.fast,
  },
}

// Utility function to create responsive animations
export const createResponsiveVariants = (
  mobileVariant: any,
  desktopVariant: any
) => {
  return window.innerWidth < 768 ? mobileVariant : desktopVariant
}