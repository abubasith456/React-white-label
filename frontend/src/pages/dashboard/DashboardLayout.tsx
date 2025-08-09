import React from 'react'
import { Outlet } from 'react-router-dom'
import { NavBar } from '@/components/common/NavBar'

const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t bg-white">
        <div className="container-page py-6 text-sm text-gray-600">© {new Date().getFullYear()} White-Label Demo</div>
      </footer>
    </div>
  )
}

export default DashboardLayout