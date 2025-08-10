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
import Checkout from '@/pages/checkout/Checkout'
import Payment from '@/pages/checkout/Payment'
import CheckoutWizard from '@/pages/checkout/CheckoutWizard'
import OrderHistory from '@/pages/orders/OrderHistory'
import OrderConfirmation from '@/pages/orders/OrderConfirmation'
import NotFound from '@/pages/misc/NotFound'

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
      { path: 'checkout', element: <Checkout /> },
      { path: 'checkout-wizard', element: <CheckoutWizard /> },
      { path: 'payment', element: <Payment /> },
      { path: 'orders', element: <OrderHistory /> },
      { path: 'orders/:id', element: <OrderConfirmation /> },
      { path: 'addresses', element: <Addresses /> },
      { path: 'admin', element: <Admin /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/forgot', element: <ForgotPassword /> },
  { path: '*', element: <NotFound /> },
], { basename: '/React-white-label' })