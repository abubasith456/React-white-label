import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { ThemeToggle } from './ThemeToggle'
import { motion, AnimatePresence } from 'framer-motion'
import { AnimatedButton, CountingNumber, FloatingElement } from '@/components/animated'

export const NavBar: React.FC = () => {
  const { tenant, currentUser, logout, cart } = useApp()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isAdmin = currentUser?.role === 'admin'
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const navItems = [
    { to: '/products', label: '🛍️ Products', icon: '🛍️' },
    { to: '/categories', label: '📂 Categories', icon: '📂' },
    { to: '/cart', label: `🛒 Cart`, icon: '🛒', badge: cartItemCount },
    { to: '/addresses', label: '📍 Addresses', icon: '📍' },
  ]

  if (currentUser) {
    navItems.push({ to: '/orders', label: '📋 Orders', icon: '📋' })
  }

  if (isAdmin) {
    navItems.push({ to: '/admin', label: '⚙️ Admin', icon: '⚙️' })
  }

  return (
    <>
      <motion.header 
        className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/20 dark:border-gray-800/20 sticky top-0 z-50 shadow-lg"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container-page flex items-center justify-between py-4">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="flex items-center gap-3 group">
              <motion.img 
                src={tenant.logoUrl} 
                alt={tenant.name} 
                className="h-10 w-10 rounded-xl shadow-lg"
                whileHover={{ rotate: 5 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span 
                className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                whileHover={{ scale: 1.02 }}
              >
                {tenant.name}
              </motion.span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            {navItems.map((item, index) => (
              <motion.div
                key={item.to}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <NavLink 
                  to={item.to} 
                  className={({isActive}) => 
                    `relative px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                      isActive 
                        ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg' 
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`
                  }
                >
                  {({isActive}) => (
                    <>
                      <motion.span
                        animate={isActive ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {item.icon}
                      </motion.span>
                      <span className="hidden xl:inline">{item.label.replace(/^[^\s]+\s/, '')}</span>
                      {item.badge && item.badge > 0 && (
                        <motion.span
                          className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                        >
                          <CountingNumber to={item.badge} />
                        </motion.span>
                      )}
                    </>
                  )}
                </NavLink>
              </motion.div>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <ThemeToggle />
            </motion.div>

            {currentUser ? (
              <motion.div 
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 px-4 py-2 rounded-xl">
                  <span className="text-sm font-medium">👋 Hi, {currentUser.name}</span>
                  {isAdmin && (
                    <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-1 rounded-full">
                      Admin
                    </span>
                  )}
                </div>
                <AnimatedButton variant="destructive" size="sm" onClick={logout}>
                  🚪 Logout
                </AnimatedButton>
              </motion.div>
            ) : (
              <motion.div 
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link to="/login">
                  <AnimatedButton variant="ghost" size="sm">
                    🔑 Login
                  </AnimatedButton>
                </Link>
                <Link to="/register" className="hidden sm:block">
                  <AnimatedButton variant="primary" size="sm">
                    ✨ Register
                  </AnimatedButton>
                </Link>
              </motion.div>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              className="lg:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: isMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isMenuOpen ? '❌' : '☰'}
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="lg:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200/20 dark:border-gray-800/20 shadow-xl"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="container-page py-4 space-y-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <NavLink 
                      to={item.to}
                      onClick={() => setIsMenuOpen(false)}
                      className={({isActive}) => 
                        `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                          isActive 
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`
                      }
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span>{item.label.replace(/^[^\s]+\s/, '')}</span>
                      {item.badge && item.badge > 0 && (
                        <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile Bottom Navigation */}
      <motion.nav 
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200/20 dark:border-gray-800/20 shadow-2xl"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <div className="grid grid-cols-4 px-2 py-2">
          {[
            { to: '/', icon: '🏠', label: 'Home' },
            { to: '/products', icon: '🛍️', label: 'Shop' },
            { to: '/cart', icon: '🛒', label: 'Cart', badge: cartItemCount },
            { to: '/orders', icon: '📋', label: 'Orders' }
          ].map((item, index) => (
            <motion.div
              key={item.to}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <NavLink 
                to={item.to} 
                className={({isActive}) => 
                  `relative flex flex-col items-center gap-1 py-2 px-1 transition-all duration-300 ${
                    isActive ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'
                  }`
                }
              >
                {({isActive}) => (
                  <>
                    <motion.div
                      className="relative"
                      animate={isActive ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="text-xl">{item.icon}</span>
                      {item.badge && item.badge > 0 && (
                        <motion.span
                          className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                        >
                          {item.badge}
                        </motion.span>
                      )}
                    </motion.div>
                    <span className="text-xs font-medium">{item.label}</span>
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-1/2 w-6 h-0.5 bg-blue-600 rounded-full"
                        layoutId="activeTab"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        style={{ x: '-50%' }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            </motion.div>
          ))}
        </div>
      </motion.nav>
    </>
  )
}