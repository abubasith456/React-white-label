import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export const LoadingOverlay: React.FC<{ show: boolean }> = ({ show }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            className="rounded-2xl bg-white dark:bg-gray-900/90 px-6 py-4 shadow-soft border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <span className="h-4 w-4 rounded-full border-2 border-brand-primary border-t-transparent animate-spin inline-block" />
              <span className="text-sm">Loading...</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}