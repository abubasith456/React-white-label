import React, { useEffect, useState } from 'react'

export const ThemeToggle: React.FC = () => {
  const [dark, setDark] = useState<boolean>(() => document.documentElement.classList.contains('dark'))
  useEffect(() => {
    if (dark) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [dark])
  return (
    <button aria-label="Toggle theme" className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-white/10" onClick={() => setDark(d => !d)}>
      <span className="hidden dark:inline">🌙</span>
      <span className="dark:hidden">☀️</span>
    </button>
  )
}