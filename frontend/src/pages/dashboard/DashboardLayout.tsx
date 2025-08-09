import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { NavBar } from '@/components/common/NavBar'
import { AnimatePresence, motion } from 'framer-motion'

const DashboardLayout: React.FC = () => {
  const location = useLocation()
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 pb-16">
        <AnimatePresence mode="wait">
          <motion.div key={location.pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <footer className="border-t bg-white dark:bg-gray-900 dark:text-gray-200">
        <div className="container-page py-6 text-sm text-gray-600 dark:text-gray-300">© {new Date().getFullYear()} White-Label Demo</div>
      </footer>
    </div>
  )
}

export default DashboardLayout