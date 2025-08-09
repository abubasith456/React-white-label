import React, { useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  AnimatedText, 
  AnimatedButton,
  FloatingElement,
  GlowEffect
} from '@/components/animated'
import { 
  fadeInUp, 
  fadeInDown, 
  staggerContainer 
} from '@/utils/animations'

const emailValid = (email: string) => /.+@.+\..+/.test(email)

const Register: React.FC = () => {
  const { tenant, register, isLoading } = useApp()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const isFormValid = useMemo(() => name.trim().length > 0 && emailValid(email) && password.length >= 6, [name, email, password])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!isFormValid) {
      setError('Fill all fields. Password must be at least 6 characters.')
      return
    }
    try {
      await register(name, email, password)
      navigate('/')
    } catch (err) {
      setError('Registration failed')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <FloatingElement intensity={25} speed={3} className="absolute top-20 left-20">
          <div className="w-32 h-32 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-xl" />
        </FloatingElement>
        <FloatingElement intensity={30} speed={4} className="absolute top-1/3 right-10">
          <div className="w-24 h-24 bg-gradient-to-br from-teal-400/20 to-cyan-400/20 rounded-full blur-xl" />
        </FloatingElement>
        <FloatingElement intensity={20} speed={5} className="absolute bottom-1/4 left-1/3">
          <div className="w-40 h-40 bg-gradient-to-br from-blue-400/20 to-green-400/20 rounded-full blur-xl" />
        </FloatingElement>
      </div>

      {/* Decorative Icons */}
      <motion.div 
        className="absolute top-20 right-1/4 text-4xl opacity-30"
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity,
          ease: "linear"
        }}
      >
        🚀
      </motion.div>
      
      <motion.div 
        className="absolute bottom-1/4 right-20 text-3xl opacity-30"
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 10, -10, 0]
        }}
        transition={{ 
          duration: 5, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        ✨
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
              whileHover={{ scale: 1.05, rotate: -5 }}
              transition={{ duration: 0.2 }}
            >
              <img 
                src={tenant.logoUrl} 
                alt={tenant.name} 
                className="h-16 w-16 mx-auto rounded-2xl shadow-lg"
              />
            </motion.div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
              <AnimatedText variant="letter">
                Join {tenant.name}! 🎉
              </AnimatedText>
            </h1>
            <p className="text-gray-600">
              <AnimatedText variant="fade" delay={0.5}>
                Create your account and start your journey with us
              </AnimatedText>
            </p>
          </motion.div>

          {/* Register Form */}
          <motion.div variants={fadeInUp}>
            <GlowEffect glowColor="#10b981" intensity={15}>
              <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8">
                <form onSubmit={onSubmit} className="space-y-5">
                  {/* Name Input */}
                  <motion.div variants={fadeInUp}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      👤 Full Name
                    </label>
                    <motion.input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-white/50 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:bg-white transition-all duration-300 focus:outline-none"
                      placeholder="Enter your full name"
                      required
                      whileFocus={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    />
                    {name.trim().length > 0 && (
                      <motion.div
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                      >
                        ✅
                      </motion.div>
                    )}
                  </motion.div>

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
                        className="w-full px-4 py-3 bg-white/50 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:bg-white transition-all duration-300 focus:outline-none"
                        placeholder="Enter your email"
                        required
                        whileFocus={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      />
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
                        className="w-full px-4 py-3 pr-12 bg-white/50 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:bg-white transition-all duration-300 focus:outline-none"
                        placeholder="Create a strong password"
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
                      {password.length >= 6 && (
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
                    {/* Password Strength Indicator */}
                    <div className="mt-2 space-y-1">
                      <div className="flex gap-1">
                        {[1,2,3,4].map((i) => (
                          <motion.div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-colors ${
                              password.length >= i * 2 ? 'bg-green-500' : 'bg-gray-200'
                            }`}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: password.length >= i * 2 ? 1 : 0 }}
                            transition={{ duration: 0.3, delay: i * 0.1 }}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">
                        Password strength: {password.length < 4 ? 'Weak' : password.length < 8 ? 'Good' : 'Strong'}
                      </p>
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
                      className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white py-3 text-lg font-medium shadow-xl"
                    >
                      {isLoading ? (
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          🔄
                        </motion.span>
                      ) : (
                        <>🚀 Create Account</>
                      )}
                    </AnimatedButton>
                  </motion.div>
                </form>

                {/* Footer Link */}
                <motion.div 
                  className="mt-6 text-center"
                  variants={fadeInUp}
                >
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link 
                      to="/login" 
                      className="text-green-600 hover:text-green-700 transition-colors font-medium flex items-center justify-center gap-1"
                    >
                      <motion.span whileHover={{ x: -2 }}>🔑</motion.span>
                      Sign in here
                    </Link>
                  </p>
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
                <span>Secure Registration</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <span>⚡</span>
                <span>Instant Setup</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <span>🎉</span>
                <span>Free to Join</span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Register