import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { Toaster } from 'react-hot-toast'
import { LoadingOverlay } from './components/common/LoadingOverlay'
import { useApp } from './context/AppContext'
import { MotionProvider } from './utils/motionConfig'

const AppInner: React.FC = () => {
  const { isLoading } = useApp()
  return (
    <MotionProvider>
      <RouterProvider router={router} />
      <LoadingOverlay show={isLoading} />
      <Toaster 
        position="top-right" 
        toastOptions={{ 
          className: 'text-sm backdrop-blur-sm bg-white/90 border border-gray-200 shadow-xl',
          style: {
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
          }
        }} 
      />
    </MotionProvider>
  )
}

const App: React.FC = () => {
  return <AppInner />
}

export default App