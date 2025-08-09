import React from 'react'
import { Outlet } from 'react-router-dom'
import { NavBar } from '@/components/common/NavBar'

const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 pb-16">
        <Outlet />
      </main>
      <footer className="border-t bg-white dark:bg-gray-900 dark:text-gray-200">
        <div className="container-page py-6 text-sm text-gray-600 dark:text-gray-300">© {new Date().getFullYear()} White-Label Demo</div>
      </footer>
    </div>
  )
}

export default DashboardLayout