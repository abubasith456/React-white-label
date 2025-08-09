import React, { useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  AnimatedText, 
  AnimatedButton,
  FloatingElement,
  GlowEffect,
  ShimmerEffect
} from '@/components/animated'
import { 
  fadeInUp, 
  fadeInDown, 
  scaleIn,
  staggerContainer 
} from '@/utils/animations'

const emailValid = (email: string) => /.+@.+\..+/.test(email)

const Login: React.FC = () => {
  const { tenant, login, isLoading } = useApp()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isEmailFocused, setIsEmailFocused] = useState(false)
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)
  const navigate = useNavigate()

  const isFormValid = useMemo(() => emailValid(email) && password.length >= 4, [email, password])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!isFormValid) {
      setError('Please enter a valid email and password (min 4 chars).')
      return
    }
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <FloatingElement intensity={30} speed={4} className="absolute top-10 left-10">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl" />
        </FloatingElement>
        <FloatingElement intensity={25} speed={3} className="absolute top-1/4 right-20">
          <div className="w-24 h-24 bg-gradient-to-br from-pink-400/20 to-yellow-400/20 rounded-full blur-xl" />
        </FloatingElement>
        <FloatingElement intensity={20} speed={5} className="absolute bottom-20 left-1/4">
          <div className="w-40 h-40 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-xl" />
        </FloatingElement>
        <FloatingElement intensity={35} speed={2.5} className="absolute bottom-10 right-10">
          <div className="w-28 h-28 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl" />
        </FloatingElement>
      </div>

      {/* Decorative Icons */}
      <motion.div 
        className="absolute top-20 left-1/4 text-4xl opacity-30"
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity,
          ease: "linear"
        }}
      >
        🔐
      </motion.div>
      
      <motion.div 
        className="absolute top-1/3 right-1/4 text-3xl opacity-30"
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, -10, 10, 0]
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        ✨
      </motion.div>

      <motion.div 
        className="absolute bottom-1/3 left-20 text-5xl opacity-30"
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        🚀
      </motion.div>

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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              <AnimatedText variant="letter">
                Welcome Back! 👋
              </AnimatedText>
            </h1>
            <p className="text-gray-600">
              <AnimatedText variant="fade" delay={0.5}>
                Sign in to {tenant.name} and continue your journey
              </AnimatedText>
            </p>
          </motion.div>

          {/* Login Form */}
          <motion.div variants={fadeInUp}>
            <GlowEffect glowColor="#6366f1" intensity={15}>
              <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8">
                <form onSubmit={onSubmit} className="space-y-6">
                  {/* Email Input */}
                  <motion.div variants={fadeInUp}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📧 Email Address
                    </label>
                    <div className="relative">
                      <motion.input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setIsEmailFocused(true)}
                        onBlur={() => setIsEmailFocused(false)}
                        className="w-full px-4 py-3 bg-white/50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white transition-all duration-300 focus:outline-none"
                        placeholder="Enter your email"
                        required
                        whileFocus={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      />
                      <AnimatePresence>
                        {isEmailFocused && (
                          <motion.div
                            className="absolute inset-0 border-2 border-blue-500 rounded-xl pointer-events-none"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </AnimatePresence>
                      {emailValid(email) && (
                        <motion.div
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                        >
                          ✅
                        </motion.div>
                      )}
                    </div>
                  </motion.div>

                  {/* Password Input */}
                  <motion.div variants={fadeInUp}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🔒 Password
                    </label>
                    <div className="relative">
                      <motion.input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setIsPasswordFocused(true)}
                        onBlur={() => setIsPasswordFocused(false)}
                        className="w-full px-4 py-3 pr-12 bg-white/50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white transition-all duration-300 focus:outline-none"
                        placeholder="Enter your password"
                        required
                        whileFocus={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        <motion.span
                          animate={{ rotate: showPassword ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {showPassword ? '🙈' : '👁️'}
                        </motion.span>
                      </button>
                      <AnimatePresence>
                        {isPasswordFocused && (
                          <motion.div
                            className="absolute inset-0 border-2 border-blue-500 rounded-xl pointer-events-none"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </AnimatePresence>
                      {password.length >= 4 && (
                        <motion.div
                          className="absolute right-10 top-1/2 -translate-y-1/2 text-green-500"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                        >
                          ✅
                        </motion.div>
                      )}
                    </div>
                  </motion.div>

                  {/* Error Message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span className="flex items-center gap-2">
                          ⚠️ {error}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit Button */}
                  <motion.div variants={fadeInUp}>
                    <AnimatedButton
                      type="submit"
                      disabled={isLoading || !isFormValid}
                      loading={isLoading}
                      className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white py-3 text-lg font-medium shadow-xl"
                    >
                      {isLoading ? (
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          🔄
                        </motion.span>
                      ) : (
                        <>✨ Sign In</>
                      )}
                    </AnimatedButton>
                  </motion.div>
                </form>

                {/* Divider */}
                <motion.div 
                  className="my-6 flex items-center"
                  variants={fadeInUp}
                >
                  <div className="flex-1 border-t border-gray-200"></div>
                  <span className="px-4 text-sm text-gray-500 bg-white rounded-full">or</span>
                  <div className="flex-1 border-t border-gray-200"></div>
                </motion.div>

                {/* Social Login Buttons */}
                <motion.div 
                  className="space-y-3"
                  variants={fadeInUp}
                >
                  <motion.button
                    className="w-full bg-white/70 hover:bg-white border border-gray-200 rounded-xl py-3 px-4 text-gray-700 font-medium transition-all duration-300 flex items-center justify-center gap-3"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-xl">🔐</span>
                    Continue with Demo Account
                  </motion.button>
                </motion.div>

                {/* Footer Links */}
                <motion.div 
                  className="mt-6 flex justify-between items-center"
                  variants={fadeInUp}
                >
                  <Link 
                    to="/forgot" 
                    className="text-sm text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
                  >
                    <motion.span whileHover={{ x: -2 }}>🔑</motion.span>
                    Forgot password?
                  </Link>
                  <Link 
                    to="/register" 
                    className="text-sm text-purple-600 hover:text-purple-700 transition-colors flex items-center gap-1"
                  >
                    Create account
                    <motion.span whileHover={{ x: 2 }}>🚀</motion.span>
                  </Link>
                </motion.div>
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
                <span>🔒</span>
                <span>Secure Login</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <span>🚀</span>
                <span>Fast Access</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <span>💫</span>
                <span>Modern UI</span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Login