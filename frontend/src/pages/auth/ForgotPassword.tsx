import React, { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  AnimatedText, 
  FloatingElement,
  GlowEffect
} from '@/components/animated'
import { 
  fadeInUp, 
  fadeInDown, 
  staggerContainer 
} from '@/utils/animations'
import axios from 'axios'

const ForgotPassword: React.FC = () => {
  const { tenant } = useApp()
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await axios.post(`${tenant.apiBaseUrl}/auth/forgot`, { email })
      setDone(true)
    } catch (error) {
      console.error('Forgot password error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <FloatingElement intensity={25} speed={3} className="absolute top-20 left-20">
          <div className="w-32 h-32 rounded-full blur-xl opacity-30" style={{ background: `rgb(var(--brand-accent) / 0.2)` }} />
        </FloatingElement>
        <FloatingElement intensity={30} speed={4} className="absolute top-1/3 right-10">
          <div className="w-24 h-24 rounded-full blur-xl opacity-30" style={{ background: `rgb(var(--brand-secondary) / 0.2)` }} />
        </FloatingElement>
        <FloatingElement intensity={20} speed={5} className="absolute bottom-1/4 left-1/3">
          <div className="w-40 h-40 rounded-full blur-xl opacity-30" style={{ background: `rgb(var(--brand-primary) / 0.2)` }} />
        </FloatingElement>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          className="w-full max-w-md"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Logo and Brand */}
          <motion.div 
            className="text-center mb-8"
            variants={fadeInDown}
          >
            <motion.div 
              className="inline-block mb-4"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <img 
                src={tenant.logoUrl} 
                alt={tenant.name} 
                className="h-16 w-16 mx-auto rounded-2xl shadow-lg"
              />
            </motion.div>
            <h1 className="text-4xl font-bold mb-2" style={{ color: `rgb(var(--brand-primary))` }}>
              <AnimatedText variant="letter">
                Reset Password
              </AnimatedText>
            </h1>
            <p className="text-gray-600">
              <AnimatedText variant="fade" delay={0.5}>
                Enter your email to receive a reset link
              </AnimatedText>
            </p>
          </motion.div>

          {/* Reset Form */}
          <motion.div variants={fadeInUp}>
            <GlowEffect glowColor={`rgb(var(--brand-primary))`} intensity={15}>
              <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8">
                <AnimatePresence mode="wait">
                  {done ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="text-center space-y-4"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', delay: 0.2 }}
                        className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto"
                      >
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-gray-900">Check your email</h3>
                        <p className="text-gray-600 text-sm">
                          If an account with that email exists, we've sent you a password reset link.
                        </p>
                      </div>
                                              <Link 
                          to="/login"
                          className="inline-block mt-4 transition-colors hover:opacity-70 font-medium"
                          style={{ color: `rgb(var(--brand-primary))` }}
                        >
                          Back to Sign In
                        </Link>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      onSubmit={onSubmit}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <motion.div variants={fadeInUp}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <motion.input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-3 bg-white/50 border-2 border-gray-200 rounded-xl focus:bg-white transition-all duration-300 focus:outline-none"
                          onFocus={(e) => e.target.style.borderColor = 'rgb(var(--brand-primary))'}
                          onBlur={(e) => e.target.style.borderColor = 'rgb(229 231 235)'}
                          placeholder="Enter your email address"
                          required
                          whileFocus={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        />
                      </motion.div>

                      <motion.div variants={fadeInUp}>
                        <motion.button
                          type="submit"
                          disabled={isLoading || !email}
                          className="w-full py-3 text-lg font-medium shadow-xl rounded-xl text-white transition-all duration-300 disabled:opacity-50"
                          style={{ 
                            backgroundColor: `rgb(var(--brand-primary))`,
                            boxShadow: `0 10px 25px -5px rgb(var(--brand-primary) / 0.3)`
                          }}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {isLoading ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mx-auto"
                            />
                          ) : (
                            <>Send Reset Link</>
                          )}
                        </motion.button>
                      </motion.div>

                      <motion.div 
                        className="text-center"
                        variants={fadeInUp}
                      >
                        <Link 
                          to="/login"
                          className="text-sm transition-colors hover:opacity-70"
                          style={{ color: `rgb(var(--brand-primary))` }}
                        >
                          Remember your password? Sign in
                        </Link>
                      </motion.div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </GlowEffect>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div 
            className="mt-8 text-center"
            variants={fadeInUp}
          >
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <span>Secure Process</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <span>Quick Recovery</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <span>Email Protected</span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default ForgotPassword