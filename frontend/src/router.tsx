import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import DashboardLayout from '@/pages/dashboard/DashboardLayout'
import Home from '@/pages/dashboard/Home'
import Products from '@/pages/dashboard/Products'
import Categories from '@/pages/dashboard/Categories'
import CategoryProducts from '@/pages/dashboard/CategoryProducts'
import ProductDetails from '@/pages/dashboard/ProductDetails'
import Cart from '@/pages/dashboard/Cart'
import Addresses from '@/pages/dashboard/Addresses'
import Admin from '@/pages/dashboard/Admin'
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import ForgotPassword from '@/pages/auth/ForgotPassword'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'products', element: <Products /> },
      { path: 'products/:id', element: <ProductDetails /> },
      { path: 'categories', element: <Categories /> },
      { path: 'categories/:id', element: <CategoryProducts /> },
      { path: 'cart', element: <Cart /> },
      { path: 'addresses', element: <Addresses /> },
      { path: 'admin', element: <Admin /> },
    ],
  },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/forgot', element: <ForgotPassword /> },
])