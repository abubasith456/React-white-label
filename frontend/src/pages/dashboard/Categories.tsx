import React, { useEffect, useState } from 'react'
import { useApp } from '@/context/AppContext'
import { AnimatedContainer } from '@/components/common/AnimatedContainer'
import axios from 'axios'

type Category = { id: string; name: string }

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
          <div key={c.id} className="card">
            <h3 className="text-lg font-semibold">{c.name}</h3>
          </div>
        ))}
      </div>
    </AnimatedContainer>
  )
}

export default Categories