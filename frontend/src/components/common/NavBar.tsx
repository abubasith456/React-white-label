import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useApp } from '@/context/AppContext'

export const NavBar: React.FC = () => {
  const { tenant, currentUser, logout } = useApp()
  const isAdmin = currentUser?.role === 'admin'
  return (
    <header className="bg-white shadow-sm">
      <div className="container-page flex items-center justify-between py-3">
        <Link to="/" className="flex items-center gap-3">
          <img src={tenant.logoUrl} alt={tenant.name} className="h-8" />
          <span className="font-semibold text-xl">{tenant.name}</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/products" className={({isActive}) => isActive ? 'text-brand-primary font-medium' : 'text-gray-700 hover:text-brand-primary'}>Products</NavLink>
          <NavLink to="/categories" className={({isActive}) => isActive ? 'text-brand-primary font-medium' : 'text-gray-700 hover:text-brand-primary'}>Categories</NavLink>
          <NavLink to="/cart" className={({isActive}) => isActive ? 'text-brand-primary font-medium' : 'text-gray-700 hover:text-brand-primary'}>Cart</NavLink>
          <NavLink to="/addresses" className={({isActive}) => isActive ? 'text-brand-primary font-medium' : 'text-gray-700 hover:text-brand-primary'}>Addresses</NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={({isActive}) => isActive ? 'text-brand-primary font-medium' : 'text-gray-700 hover:text-brand-primary'}>Admin</NavLink>
          )}
        </nav>
        <div className="flex items-center gap-3">
          {currentUser ? (
            <>
              <span className="text-sm">Hi, {currentUser.name}</span>
              <button className="btn-primary" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link className="btn-primary" to="/login">Login</Link>
              <Link className="hidden md:inline-flex btn-primary bg-brand-secondary" to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}