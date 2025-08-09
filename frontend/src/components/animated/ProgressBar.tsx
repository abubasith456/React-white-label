import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Lottie from 'lottie-react'
import { transitions } from '@/utils/animations'
import { cn } from '@/utils/cn'

// Simple confetti animation data (you can replace with a real Lottie file)
const confettiAnimation = {
  v: "5.7.4",
  fr: 60,
  ip: 0,
  op: 60,
  w: 400,
  h: 400,
  nm: "Confetti",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "confetti",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 1, k: [
          { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 0, s: [0] },
          { t: 60, s: [360] }
        ]},
        p: { a: 0, k: [200, 200, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "rc",
              d: 1,
              s: { a: 0, k: [10, 10] },
              p: { a: 0, k: [0, 0] },
              r: { a: 0, k: 0 }
            },
            {
              ty: "fl",
              c: { a: 0, k: [1, 0.8, 0, 1] },
              o: { a: 0, k: 100 }
            }
          ]
        }
      ],
      ip: 0,
      op: 60,
      st: 0
    }
  ]
}

interface ProgressBarProps {
  current: number
  target: number
  threshold?: number
  label?: string
  showConfetti?: boolean
  className?: string
  formatValue?: (value: number) => string
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  target,
  threshold = target,
  label = "Progress",
  showConfetti = true,
  className,
  formatValue = (value) => `$${value.toFixed(2)}`
}) => {
  const [isComplete, setIsComplete] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  
  const progress = Math.min((current / target) * 100, 100)
  const isThresholdReached = current >= threshold
  const remaining = Math.max(target - current, 0)

  useEffect(() => {
    const wasComplete = isComplete
    const nowComplete = current >= threshold
    
    setIsComplete(nowComplete)
    
    // Show celebration when threshold is reached for the first time
    if (!wasComplete && nowComplete && showConfetti) {
      setShowCelebration(true)
      const timer = setTimeout(() => setShowCelebration(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [current, threshold, isComplete, showConfetti])

  return (
    <div className={cn('relative w-full', className)}>
      {/* Progress Label */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          {label}
        </span>
        <motion.span
          className="text-sm font-semibold"
          key={current}
          initial={{ scale: 1.2, color: '#10b981' }}
          animate={{ scale: 1, color: '#374151' }}
          transition={transitions.medium}
        >
          {formatValue(current)} / {formatValue(target)}
        </motion.span>
      </div>

      {/* Progress Bar Container */}
      <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
        {/* Background Glow Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-20"
          animate={{
            opacity: isThresholdReached ? [0.2, 0.4, 0.2] : 0.2,
          }}
          transition={{
            duration: 2,
            repeat: isThresholdReached ? Infinity : 0,
            repeatType: 'loop',
          }}
        />
        
        {/* Progress Fill */}
        <motion.div
          className={cn(
            'h-full bg-gradient-to-r transition-colors duration-300',
            isThresholdReached 
              ? 'from-green-400 to-green-600' 
              : 'from-blue-500 to-purple-600'
          )}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={transitions.medium}
        />

        {/* Shimmer Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Completion Sparkles */}
        <AnimatePresence>
          {isThresholdReached && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 h-1 bg-white rounded-full"
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Status Message */}
      <motion.div
        className="mt-2 text-center"
        layout
      >
        <AnimatePresence mode="wait">
          {isThresholdReached ? (
            <motion.div
              key="complete"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-center gap-2"
            >
              <motion.span
                className="text-green-600 font-semibold"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                }}
              >
                🎉 Free Shipping Unlocked!
              </motion.span>
            </motion.div>
          ) : (
            <motion.div
              key="incomplete"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-gray-600"
            >
              Add {formatValue(remaining)} more for free shipping
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Confetti Celebration */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            className="absolute inset-0 pointer-events-none flex items-center justify-center"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={transitions.springBouncy}
          >
            <div className="w-24 h-24">
              <Lottie
                animationData={confettiAnimation}
                loop={false}
                autoplay={true}
              />
            </div>
            
            {/* Fallback sparkles if Lottie doesn't work */}
            <div className="absolute inset-0">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                  animate={{
                    x: [0, (Math.random() - 0.5) * 200],
                    y: [0, (Math.random() - 0.5) * 200],
                    opacity: [1, 0],
                    scale: [1, 0],
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.1,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}