import React, { useEffect, useState } from 'react'
import { useApp } from '@/context/AppContext'
import { AnimatedContainer } from '@/components/common/AnimatedContainer'
import axios from 'axios'
import { Link } from 'react-router-dom'

type Category = { id: string; name: string }

const iconFor = (name: string) => {
  const map: Record<string, string> = { Electronics: '🔌', Home: '🏠', Apparel: '👕', Accessories: '🎒' }
  return map[name] || '🛍️'
}

const Categories: React.FC = () => {
  const { tenant } = useApp()
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    axios.get(`${tenant.apiBaseUrl}/categories`).then(r=>setCategories(r.data.categories))
  }, [tenant.apiBaseUrl])

  return (
    <AnimatedContainer>
      <div className="container-page py-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(c => (
          <Link key={c.id} to={`/categories/${c.id}`} className="card flex items-center gap-3 hover:shadow-lg transition">
            <span className="text-3xl">{iconFor(c.name)}</span>
            <h3 className="text-lg font-semibold">{c.name}</h3>
          </Link>
        ))}
      </div>
    </AnimatedContainer>
  )
}

export default Categories