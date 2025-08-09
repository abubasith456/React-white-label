import React from 'react'

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
}

export const Input: React.FC<Props> = ({ label, error, className = '', ...rest }) => {
  return (
    <label className="block space-y-1">
      {label && <span className="text-sm text-gray-700">{label}</span>}
      <input className={`input ${error ? 'border-red-500' : ''} ${className}`} {...rest} />
      {error && <span className="text-xs text-red-600">{error}</span>}
    </label>
  )
}