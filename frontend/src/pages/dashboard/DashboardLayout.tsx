import React from 'react'
import { Outlet } from 'react-router-dom'
import { NavBar } from '@/components/common/NavBar'
import { PageTransition } from '@/components/animated/PageTransition'
import { motion } from 'framer-motion'
import { fadeInUp } from '@/utils/animations'

const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <NavBar />
      <main className="flex-1 pb-16 relative">
        {/* Background decorative elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 -right-48 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 -left-48 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"
            animate={{
              x: [0, -30, 0],
              y: [0, 20, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
        
        <PageTransition className="relative z-10">
          <Outlet />
        </PageTransition>
      </main>
      
      <motion.footer 
        className="border-t bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 dark:text-gray-200 shadow-lg"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.5 }}
      >
        <div className="container-page py-6 text-sm text-gray-600 dark:text-gray-300 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            © {new Date().getFullYear()} White-Label Demo • Built with ❤️ and modern animations
          </motion.p>
        </div>
      </motion.footer>
    </div>
  )
}

export default DashboardLayout