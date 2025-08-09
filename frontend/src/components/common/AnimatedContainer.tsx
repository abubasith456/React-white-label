import React from 'react'
import { motion } from 'framer-motion'

export const AnimatedContainer: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className={className}>
    {children}
  </motion.div>
)