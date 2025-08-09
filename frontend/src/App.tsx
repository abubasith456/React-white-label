import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { Toaster } from 'react-hot-toast'
import { LoadingOverlay } from './components/common/LoadingOverlay'
import { useApp } from './context/AppContext'

const AppInner: React.FC = () => {
  const { isLoading } = useApp()
  return (
    <>
      <RouterProvider router={router} />
      <LoadingOverlay show={isLoading} />
      <Toaster position="top-right" toastOptions={{ className: 'text-sm' }} />
    </>
  )
}

const App: React.FC = () => {
  return <AppInner />
}

export default App