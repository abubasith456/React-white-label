import React, { useState, useRef, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { cn } from '@/utils/cn'

interface FloatingElementProps {
  children: React.ReactNode
  className?: string
  intensity?: number
  speed?: number
}

export const FloatingElement: React.FC<FloatingElementProps> = ({
  children,
  className,
  intensity = 10,
  speed = 2,
}) => {
  return (
    <motion.div
      className={className}
      animate={{
        y: [-intensity, intensity, -intensity],
        x: [-intensity/2, intensity/2, -intensity/2],
      }}
      transition={{
        duration: speed,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  )
}

interface PulsingElementProps {
  children: React.ReactNode
  className?: string
  scale?: [number, number]
  duration?: number
  delay?: number
}

export const PulsingElement: React.FC<PulsingElementProps> = ({
  children,
  className,
  scale = [1, 1.05],
  duration = 2,
  delay = 0,
}) => {
  return (
    <motion.div
      className={className}
      animate={{
        scale: scale,
      }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
        delay,
      }}
    >
      {children}
    </motion.div>
  )
}

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  strength?: number
  onHover?: () => void
  onLeave?: () => void
  onClick?: () => void
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className,
  strength = 0.3,
  onHover,
  onLeave,
  onClick,
}) => {
  const ref = useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const springX = useSpring(x, { damping: 20, stiffness: 300 })
  const springY = useSpring(y, { damping: 20, stiffness: 300 })

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return
    
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const deltaX = (e.clientX - centerX) * strength
    const deltaY = (e.clientY - centerY) * strength
    
    x.set(deltaX)
    y.set(deltaY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    onLeave?.()
  }

  return (
    <motion.button
      ref={ref}
      className={cn('relative overflow-hidden', className)}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={onHover}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  )
}

interface ShimmerEffectProps {
  children: React.ReactNode
  className?: string
  color?: string
  duration?: number
  angle?: number
}

export const ShimmerEffect: React.FC<ShimmerEffectProps> = ({
  children,
  className,
  color = 'rgba(255, 255, 255, 0.6)',
  duration = 1.5,
  angle = 45,
}) => {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      {children}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(${angle}deg, transparent 30%, ${color} 50%, transparent 70%)`,
        }}
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'linear',
          repeatDelay: 2,
        }}
      />
    </div>
  )
}

interface GlowEffectProps {
  children: React.ReactNode
  className?: string
  glowColor?: string
  intensity?: number
  pulse?: boolean
}

export const GlowEffect: React.FC<GlowEffectProps> = ({
  children,
  className,
  glowColor = '#3b82f6',
  intensity = 20,
  pulse = false,
}) => {
  return (
    <motion.div
      className={cn('relative', className)}
      style={{
        filter: `drop-shadow(0 0 ${intensity}px ${glowColor})`,
      }}
      animate={pulse ? {
        filter: [
          `drop-shadow(0 0 ${intensity}px ${glowColor})`,
          `drop-shadow(0 0 ${intensity * 1.5}px ${glowColor})`,
          `drop-shadow(0 0 ${intensity}px ${glowColor})`,
        ],
      } : undefined}
      transition={pulse ? {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      } : undefined}
    >
      {children}
    </motion.div>
  )
}

interface ParallaxElementProps {
  children: React.ReactNode
  className?: string
  speed?: number
  direction?: 'up' | 'down'
}

export const ParallaxElement: React.FC<ParallaxElementProps> = ({
  children,
  className,
  speed = 0.5,
  direction = 'up',
}) => {
  const [offsetY, setOffsetY] = useState(0)
  
  useEffect(() => {
    const handleScroll = () => {
      const multiplier = direction === 'up' ? -speed : speed
      setOffsetY(window.pageYOffset * multiplier)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed, direction])

  return (
    <motion.div
      className={className}
      style={{
        y: offsetY,
      }}
    >
      {children}
    </motion.div>
  )
}

interface StaggeredRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  stagger?: number
}

export const StaggeredReveal: React.FC<StaggeredRevealProps> = ({
  children,
  className,
  delay = 0,
  stagger = 0.1,
}) => {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  }

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300,
      },
    },
  }

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

interface TypewriterCursorProps {
  blinkSpeed?: number
  color?: string
  className?: string
}

export const TypewriterCursor: React.FC<TypewriterCursorProps> = ({
  blinkSpeed = 0.8,
  color = 'currentColor',
  className,
}) => {
  return (
    <motion.span
      className={cn('inline-block w-0.5 h-[1em] ml-0.5', className)}
      style={{ backgroundColor: color }}
      animate={{ opacity: [1, 0] }}
      transition={{
        duration: blinkSpeed,
        repeat: Infinity,
        repeatType: 'reverse',
      }}
    />
  )
}