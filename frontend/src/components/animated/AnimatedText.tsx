import React, { useEffect, useState } from 'react'
import { motion, Variants } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { letterByLetter, letter, transitions, prefersReducedMotion } from '@/utils/animations'
import { cn } from '@/utils/cn'

interface AnimatedTextProps {
  children: string
  variant?: 'typewriter' | 'fade' | 'slide' | 'letter'
  className?: string
  delay?: number
  speed?: number
  cursor?: boolean
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  children,
  variant = 'fade',
  className,
  delay = 0,
  speed = 50,
  cursor = false,
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const shouldAnimate = !prefersReducedMotion()

  if (variant === 'typewriter') {
    return (
      <TypewriterText
        text={children}
        className={className}
        delay={delay}
        speed={speed}
        showCursor={cursor}
        shouldAnimate={shouldAnimate && inView}
      />
    )
  }

  if (variant === 'letter') {
    return (
      <motion.span
        ref={ref}
        className={cn('inline-block', className)}
        variants={shouldAnimate ? letterByLetter : undefined}
        initial={shouldAnimate ? 'hidden' : 'visible'}
        animate={inView ? 'visible' : 'hidden'}
        transition={{ delay }}
      >
        {children.split('').map((char, index) => (
          <motion.span
            key={index}
            className="inline-block"
            variants={shouldAnimate ? letter : undefined}
            style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
          >
            {char}
          </motion.span>
        ))}
      </motion.span>
    )
  }

  const variants: Variants = {
    hidden: {
      opacity: 0,
      y: variant === 'slide' ? 20 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        ...transitions.medium,
        delay,
      },
    },
  }

  return (
    <motion.span
      ref={ref}
      className={className}
      variants={shouldAnimate ? variants : undefined}
      initial={shouldAnimate ? 'hidden' : 'visible'}
      animate={inView ? 'visible' : 'hidden'}
    >
      {children}
    </motion.span>
  )
}

interface TypewriterTextProps {
  text: string
  className?: string
  delay?: number
  speed?: number
  showCursor?: boolean
  shouldAnimate?: boolean
}

const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  className,
  delay = 0,
  speed = 50,
  showCursor = false,
  shouldAnimate = true,
}) => {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showTypingCursor, setShowTypingCursor] = useState(true)

  useEffect(() => {
    if (!shouldAnimate) {
      setDisplayText(text)
      setShowTypingCursor(false)
      return
    }

    const timer = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayText(text.slice(0, currentIndex + 1))
        setCurrentIndex(currentIndex + 1)
      } else {
        if (!showCursor) {
          setShowTypingCursor(false)
        }
      }
    }, currentIndex === 0 ? delay : speed)

    return () => clearTimeout(timer)
  }, [currentIndex, text, delay, speed, showCursor, shouldAnimate])

  return (
    <span className={cn('relative', className)}>
      {displayText}
      {showTypingCursor && (
        <motion.span
          className="inline-block w-0.5 h-[1em] bg-current ml-0.5"
          animate={{ opacity: [1, 0] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      )}
    </span>
  )
}

interface CountingNumberProps {
  from?: number
  to: number
  duration?: number
  delay?: number
  className?: string
  prefix?: string
  suffix?: string
  formatter?: (value: number) => string
}

export const CountingNumber: React.FC<CountingNumberProps> = ({
  from = 0,
  to,
  duration = 2,
  delay = 0,
  className,
  prefix = '',
  suffix = '',
  formatter = (value) => Math.round(value).toString(),
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const shouldAnimate = !prefersReducedMotion()

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ delay }}
    >
      {prefix}
      {shouldAnimate && inView ? (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay }}
        >
          <motion.span
            key={`${from}-${to}`}
            initial={from}
            animate={to}
            transition={{
              duration,
              delay,
              ease: 'easeOut',
            }}
            onUpdate={(value) => {
              const element = document.getElementById(`counter-${from}-${to}`)
              if (element) {
                element.textContent = formatter(value as number)
              }
            }}
          >
            <span id={`counter-${from}-${to}`}>{formatter(from)}</span>
          </motion.span>
        </motion.span>
      ) : (
        formatter(to)
      )}
      {suffix}
    </motion.span>
  )
}

interface AnimatedPriceProps {
  price: number
  originalPrice?: number
  currency?: string
  showDiscount?: boolean
  className?: string
}

export const AnimatedPrice: React.FC<AnimatedPriceProps> = ({
  price,
  originalPrice,
  currency = '$',
  showDiscount = true,
  className,
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const discount = originalPrice 
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null

  return (
    <motion.div
      ref={ref}
      className={cn('flex items-center gap-2', className)}
      initial={{ opacity: 0, y: 10 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={transitions.medium}
    >
      {/* Current Price */}
      <motion.span
        className="text-lg font-bold text-gray-900"
        layoutId={`price-${price}`}
      >
        <CountingNumber
          to={price}
          formatter={(value) => `${currency}${value.toFixed(2)}`}
          duration={1}
        />
      </motion.span>

      {/* Original Price */}
      {originalPrice && (
        <motion.span
          className="text-sm text-gray-500 line-through"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ delay: 0.3 }}
        >
          {currency}{originalPrice.toFixed(2)}
        </motion.span>
      )}

      {/* Discount Badge */}
      {discount && showDiscount && (
        <motion.span
          className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-full"
          initial={{ opacity: 0, scale: 0 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ delay: 0.5, type: 'spring', damping: 15, stiffness: 300 }}
        >
          -{discount}%
        </motion.span>
      )}
    </motion.div>
  )
}