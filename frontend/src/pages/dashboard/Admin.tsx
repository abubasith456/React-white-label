import React, { useEffect, useState } from 'react'
import { useApp } from '@/context/AppContext'
import axios from 'axios'
import { Button } from '@/components/common/Button'
import { AnimatedContainer } from '@/components/common/AnimatedContainer'
import { useNavigate } from 'react-router-dom'

const Admin: React.FC = () => {
  const { tenant, token, currentUser } = useApp()
  const navigate = useNavigate()
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: 0, image: '', categoryId: '' })
  const [newCategory, setNewCategory] = useState({ name: '' })
  const [admins, setAdmins] = useState<string[]>([])
  const [newAdminEmail, setNewAdminEmail] = useState('')

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/login')
    }
  }, [currentUser, navigate])

  const auth = token ? { headers: { Authorization: `Bearer ${token}` } } : {}

  const refresh = () => {
    axios.get(`${tenant.apiBaseUrl}/products`).then(r=>setProducts(r.data.products))
    axios.get(`${tenant.apiBaseUrl}/categories`).then(r=>setCategories(r.data.categories))
    axios.get(`${tenant.apiBaseUrl}/admins`, auth).then(r=>setAdmins(r.data.admins)).catch(()=>{})
  }

  useEffect(() => { refresh() }, [tenant.apiBaseUrl])

  const createCategory = async () => {
    if (!newCategory.name.trim()) return
    await axios.post(`${tenant.apiBaseUrl}/categories`, newCategory, auth)
    setNewCategory({ name: '' })
    refresh()
  }

  const createProduct = async () => {
    const { name, description, price, image, categoryId } = newProduct
    if (!name.trim() || !categoryId) return
    await axios.post(`${tenant.apiBaseUrl}/products`, { name, description, price: Number(price), image, categoryId }, auth)
    setNewProduct({ name: '', description: '', price: 0, image: '', categoryId: '' })
    refresh()
  }

  const deleteProduct = async (id: string) => {
    await axios.delete(`${tenant.apiBaseUrl}/products/${id}`, auth)
    refresh()
  }

  const addAdmin = async () => {
    if (!newAdminEmail.trim()) return
    await axios.post(`${tenant.apiBaseUrl}/admins`, { email: newAdminEmail }, auth)
    setNewAdminEmail('')
    refresh()
  }

  const removeAdmin = async (email: string) => {
    await axios.delete(`${tenant.apiBaseUrl}/admins`, { ...auth, data: { email } })
    refresh()
  }

  return (
    <AnimatedContainer>
      <div className="container-page py-8 space-y-8">
        <div className="card space-y-3">
          <h2 className="text-xl font-semibold">Admins</h2>
          <div className="flex gap-3">
            <input className="input" placeholder="admin@example.com" value={newAdminEmail} onChange={e=>setNewAdminEmail(e.target.value)} />
            <Button onClick={addAdmin}>Add Admin</Button>
          </div>
          <ul className="flex flex-wrap gap-2">
            {admins.map(email => (
              <li key={email} className="px-3 py-1 rounded-full bg-gray-100 flex items-center gap-2">
                <span>{email}</span>
                <button className="text-red-600" onClick={() => removeAdmin(email)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>

        <div className="card space-y-3">
          <h2 className="text-xl font-semibold">Categories</h2>
          <div className="flex gap-3">
            <input className="input" placeholder="New category name" value={newCategory.name} onChange={e=>setNewCategory({ name: e.target.value })} />
            <Button onClick={createCategory}>Add</Button>
          </div>
          <ul className="flex flex-wrap gap-2">
            {categories.map((c:any) => (
              <li key={c.id} className="px-3 py-1 rounded-full bg-gray-100">{c.name}</li>
            ))}
          </ul>
        </div>

        <div className="card space-y-3">
          <h2 className="text-xl font-semibold">Products</h2>
          <div className="grid md:grid-cols-2 gap-3">
            <input className="input" placeholder="Name" value={newProduct.name} onChange={e=>setNewProduct({...newProduct, name: e.target.value})} />
            <input className="input" placeholder="Image URL" value={newProduct.image} onChange={e=>setNewProduct({...newProduct, image: e.target.value})} />
            <input className="input" placeholder="Description" value={newProduct.description} onChange={e=>setNewProduct({...newProduct, description: e.target.value})} />
            <input className="input" placeholder="Price" min="0" step="0.01" type="number" value={newProduct.price} onChange={e=>setNewProduct({...newProduct, price: Number(e.target.value)})} />
            <select className="input" value={newProduct.categoryId} onChange={e=>setNewProduct({...newProduct, categoryId: e.target.value})}>
              <option value="">Select Category</option>
              {categories.map((c:any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <Button onClick={createProduct}>Create</Button>
          </div>
          <ul className="divide-y">
            {products.map((p:any) => (
              <li key={p.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-sm text-gray-600">${p.price}</div>
                </div>
                <button className="text-red-600" onClick={() => deleteProduct(p.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AnimatedContainer>
  )
}

export default Admin