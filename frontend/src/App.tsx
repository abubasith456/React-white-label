import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { Toaster } from 'react-hot-toast'

const App: React.FC = () => {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" toastOptions={{ className: 'text-sm' }} />
    </>
  )
}

export default App