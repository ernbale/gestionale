'use client'

import Link from "next/link"
import { useEffect, useState } from "react"
import { supabase, Cliente } from "@/lib/supabase"

export default function ClientiPage() {
  const [clienti, setClienti] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null)
  const [formData, setFormData] = useState({
    nome: '', cognome: '', ragione_sociale: '', email: '', telefono: '',
    cellulare: '', indirizzo: '', citta: '', cap: '', provincia: '',
    codice_fiscale: '', partita_iva: '', note: ''
  })

  useEffect(() => {
    loadClienti()
  }, [])

  async function loadClienti() {
    const { data, error } = await supabase
      .from('clienti')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setClienti(data)
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (editingCliente) {
      await supabase.from('clienti').update(formData).eq('id', editingCliente.id)
    } else {
      await supabase.from('clienti').insert([formData])
    }
    setShowForm(false)
    setEditingCliente(null)
    setFormData({ nome: '', cognome: '', ragione_sociale: '', email: '', telefono: '', cellulare: '', indirizzo: '', citta: '', cap: '', provincia: '', codice_fiscale: '', partita_iva: '', note: '' })
    loadClienti()
  }

  async function handleDelete(id: number) {
    if (confirm('Sei sicuro di voler eliminare questo cliente?')) {
      await supabase.from('clienti').delete().eq('id', id)
      loadClienti()
    }
  }

  function handleEdit(cliente: Cliente) {
    setEditingCliente(cliente)
    setFormData({
      nome: cliente.nome || '', cognome: cliente.cognome || '', ragione_sociale: cliente.ragione_sociale || '',
      email: cliente.email || '', telefono: cliente.telefono || '', cellulare: cliente.cellulare || '',
      indirizzo: cliente.indirizzo || '', citta: cliente.citta || '', cap: cliente.cap || '',
      provincia: cliente.provincia || '', codice_fiscale: cliente.codice_fiscale || '',
      partita_iva: cliente.partita_iva || '', note: cliente.note || ''
    })
    setShowForm(true)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <Link href="/" className="text-blue-100 hover:text-white text-sm">&larr; Torna alla Dashboard</Link>
            <h1 className="text-3xl font-bold">Gestione Clienti</h1>
          </div>
          <button onClick={() => { setShowForm(true); setEditingCliente(null); setFormData({ nome: '', cognome: '', ragione_sociale: '', email: '', telefono: '', cellulare: '', indirizzo: '', citta: '', cap: '', provincia: '', codice_fiscale: '', partita_iva: '', note: '' }); }} className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50">
            + Nuovo Cliente
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {showForm && (
          <div className="bg-white rounded-lg shadow mb-8 p-6">
            <h2 className="text-xl font-bold mb-4">{editingCliente ? 'Modifica Cliente' : 'Nuovo Cliente'}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input type="text" placeholder="Nome *" required value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} className="border rounded px-3 py-2" />
              <input type="text" placeholder="Cognome" value={formData.cognome} onChange={(e) => setFormData({...formData, cognome: e.target.value})} className="border rounded px-3 py-2" />
              <input type="text" placeholder="Ragione Sociale" value={formData.ragione_sociale} onChange={(e) => setFormData({...formData, ragione_sociale: e.target.value})} className="border rounded px-3 py-2" />
              <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="border rounded px-3 py-2" />
              <input type="tel" placeholder="Telefono" value={formData.telefono} onChange={(e) => setFormData({...formData, telefono: e.target.value})} className="border rounded px-3 py-2" />
              <input type="tel" placeholder="Cellulare" value={formData.cellulare} onChange={(e) => setFormData({...formData, cellulare: e.target.value})} className="border rounded px-3 py-2" />
              <input type="text" placeholder="Indirizzo" value={formData.indirizzo} onChange={(e) => setFormData({...formData, indirizzo: e.target.value})} className="border rounded px-3 py-2" />
              <input type="text" placeholder="Citta" value={formData.citta} onChange={(e) => setFormData({...formData, citta: e.target.value})} className="border rounded px-3 py-2" />
              <input type="text" placeholder="CAP" value={formData.cap} onChange={(e) => setFormData({...formData, cap: e.target.value})} className="border rounded px-3 py-2" />
              <input type="text" placeholder="Provincia" value={formData.provincia} onChange={(e) => setFormData({...formData, provincia: e.target.value})} className="border rounded px-3 py-2" />
              <input type="text" placeholder="Codice Fiscale" value={formData.codice_fiscale} onChange={(e) => setFormData({...formData, codice_fiscale: e.target.value})} className="border rounded px-3 py-2" />
              <input type="text" placeholder="Partita IVA" value={formData.partita_iva} onChange={(e) => setFormData({...formData, partita_iva: e.target.value})} className="border rounded px-3 py-2" />
              <textarea placeholder="Note" value={formData.note} onChange={(e) => setFormData({...formData, note: e.target.value})} className="border rounded px-3 py-2 md:col-span-3" rows={3} />
              <div className="md:col-span-3 flex gap-4">
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Salva</button>
                <button type="button" onClick={() => setShowForm(false)} className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400">Annulla</button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefono</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Citta</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-4 text-center">Caricamento...</td></tr>
              ) : clienti.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">Nessun cliente trovato. Clicca su "Nuovo Cliente" per aggiungerne uno.</td></tr>
              ) : (
                clienti.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{cliente.nome} {cliente.cognome}</td>
                    <td className="px-6 py-4">{cliente.email || '-'}</td>
                    <td className="px-6 py-4">{cliente.telefono || cliente.cellulare || '-'}</td>
                    <td className="px-6 py-4">{cliente.citta || '-'}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleEdit(cliente)} className="text-blue-600 hover:text-blue-800 mr-3">Modifica</button>
                      <button onClick={() => handleDelete(cliente.id)} className="text-red-600 hover:text-red-800">Elimina</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
