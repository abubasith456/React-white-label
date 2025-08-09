import React, { useEffect, useState } from 'react'
import { useApp } from '@/context/AppContext'
import { AnimatedContainer } from '@/components/common/AnimatedContainer'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'

const Addresses: React.FC = () => {
  const { addresses, refreshAddresses, addAddress } = useApp()
  const [form, setForm] = useState({ line1: '', line2: '', city: '', state: '', postalCode: '', country: '' })

  useEffect(() => { refreshAddresses() }, [])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { line1, city, state, postalCode, country } = form
    if (!line1 || !city || !state || !postalCode || !country) return
    await addAddress({ line1, line2: form.line2, city, state, postalCode, country })
    setForm({ line1: '', line2: '', city: '', state: '', postalCode: '', country: '' })
  }

  return (
    <AnimatedContainer>
      <div className="container-page py-8 grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Saved Addresses</h2>
          <ul className="space-y-3">
            {addresses.map(a => (
              <li key={a.id} className="border rounded-lg p-3">
                <div>{a.line1}{a.line2 ? `, ${a.line2}` : ''}</div>
                <div className="text-sm text-gray-600">{a.city}, {a.state} {a.postalCode}, {a.country}</div>
              </li>
            ))}
          </ul>
        </div>
        <form onSubmit={onSubmit} className="card space-y-3">
          <h2 className="text-xl font-semibold">Add Address</h2>
          <Input label="Address line 1" value={form.line1} onChange={e=>setForm({...form, line1: e.target.value})} required />
          <Input label="Address line 2" value={form.line2} onChange={e=>setForm({...form, line2: e.target.value})} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="City" value={form.city} onChange={e=>setForm({...form, city: e.target.value})} required />
            <Input label="State" value={form.state} onChange={e=>setForm({...form, state: e.target.value})} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Postal Code" value={form.postalCode} onChange={e=>setForm({...form, postalCode: e.target.value})} required />
            <Input label="Country" value={form.country} onChange={e=>setForm({...form, country: e.target.value})} required />
          </div>
          <Button type="submit">Save</Button>
        </form>
      </div>
    </AnimatedContainer>
  )
}

export default Addresses