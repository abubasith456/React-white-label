import React from 'react'
import { Link } from 'react-router-dom'

const NotFound: React.FC = () => {
  return (
    <div className="container-page py-20 text-center">
      <h1 className="text-3xl font-bold mb-2">404</h1>
      <p className="text-gray-600 mb-4">The page you are looking for does not exist.</p>
      <Link to="/" className="btn-primary">Go home</Link>
    </div>
  )
}

export default NotFound