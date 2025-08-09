import React from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline'
type Size = 'sm' | 'md' | 'lg'

type Props = HTMLMotionProps<'button'> & {
  variant?: Variant
  size?: Size
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-brand-primary text-white hover:opacity-90 focus:ring-brand-primary',
  secondary: 'bg-brand-secondary text-white hover:opacity-90 focus:ring-brand-secondary',
  ghost: 'bg-transparent text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 focus:ring-gray-300',
  outline: 'bg-transparent border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/10 focus:ring-gray-300',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-3 text-base',
}

export const Button: React.FC<Props> = ({ variant = 'primary', size = 'md', className = '', children, ...rest }) => {
  const base = 'inline-flex items-center justify-center rounded-xl font-medium transition focus:outline-none focus:ring-2 shadow'
  return (
    <motion.button whileTap={{ scale: 0.98 }} className={`${base} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`} {...rest}>
      {children}
    </motion.button>
  )
}