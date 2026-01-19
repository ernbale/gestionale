'use client'

import Link from "next/link"
import { useEffect, useState } from "react"
import { supabase, Appuntamento, Cliente } from "@/lib/supabase"

export default function AppuntamentiPage() {
  const [appuntamenti, setAppuntamenti] = useState<(Appuntamento & { cliente?: Cliente })[]>([])
  const [clienti, setClienti] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    titolo: '', descrizione: '', cliente_id: '', data_inizio: '', data_fine: '',
    luogo: '', stato: 'programmato', promemoria: false
  })

  useEffect(() => {
    loadAppuntamenti()
    loadClienti()
  }, [])

  async function loadAppuntamenti() {
    const { data } = await supabase.from('appuntamenti').select('*, cliente:clienti(*)').order('data_inizio', { ascending: true })
    if (data) setAppuntamenti(data)
    setLoading(false)
  }

  async function loadClienti() {
    const { data } = await supabase.from('clienti').select('*').order('nome')
    if (data) setClienti(data)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const dataToSave = {
      ...formData,
      cliente_id: formData.cliente_id ? Number(formData.cliente_id) : null,
      data_fine: formData.data_fine || null
    }
    await supabase.from('appuntamenti').insert([dataToSave])
    setShowForm(false)
    setFormData({ titolo: '', descrizione: '', cliente_id: '', data_inizio: '', data_fine: '', luogo: '', stato: 'programmato', promemoria: false })
    loadAppuntamenti()
  }

  async function handleDelete(id: number) {
    if (confirm('Sei sicuro di voler eliminare questo appuntamento?')) {
      await supabase.from('appuntamenti').delete().eq('id', id)
      loadAppuntamenti()
    }
  }

  async function handleChangeStato(id: number, stato: string) {
    await supabase.from('appuntamenti').update({ stato }).eq('id', id)
    loadAppuntamenti()
  }

  const getStatoColor = (stato: string) => {
    switch (stato) {
      case 'programmato': return 'bg-blue-200 text-blue-800'
      case 'completato': return 'bg-green-200 text-green-800'
      case 'annullato': return 'bg-red-200 text-red-800'
      default: return 'bg-gray-200'
    }
  }

  const isOggi = (data: string) => {
    const oggi = new Date().toDateString()
    return new Date(data).toDateString() === oggi
  }

  const isPast = (data: string) => {
    return new Date(data) < new Date()
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <Link href="/" className="text-purple-100 hover:text-white text-sm">&larr; Torna alla Dashboard</Link>
            <h1 className="text-3xl font-bold">Gestione Appuntamenti</h1>
          </div>
          <button onClick={() => setShowForm(true)} className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50">
            + Nuovo Appuntamento
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {showForm && (
          <div className="bg-white rounded-lg shadow mb-8 p-6">
            <h2 className="text-xl font-bold mb-4">Nuovo Appuntamento</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Titolo *" required value={formData.titolo} onChange={(e) => setFormData({...formData, titolo: e.target.value})} className="border rounded px-3 py-2" />
              <select value={formData.cliente_id} onChange={(e) => setFormData({...formData, cliente_id: e.target.value})} className="border rounded px-3 py-2">
                <option value="">Seleziona Cliente (opzionale)</option>
                {clienti.map(c => <option key={c.id} value={c.id}>{c.nome} {c.cognome}</option>)}
              </select>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Data e Ora Inizio *</label>
                <input type="datetime-local" required value={formData.data_inizio} onChange={(e) => setFormData({...formData, data_inizio: e.target.value})} className="border rounded px-3 py-2 w-full" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Data e Ora Fine</label>
                <input type="datetime-local" value={formData.data_fine} onChange={(e) => setFormData({...formData, data_fine: e.target.value})} className="border rounded px-3 py-2 w-full" />
              </div>
              <input type="text" placeholder="Luogo" value={formData.luogo} onChange={(e) => setFormData({...formData, luogo: e.target.value})} className="border rounded px-3 py-2" />
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={formData.promemoria} onChange={(e) => setFormData({...formData, promemoria: e.target.checked})} className="w-5 h-5" />
                <span>Promemoria</span>
              </label>
              <textarea placeholder="Descrizione" value={formData.descrizione} onChange={(e) => setFormData({...formData, descrizione: e.target.value})} className="border rounded px-3 py-2 md:col-span-2" rows={2} />
              <div className="md:col-span-2 flex gap-4">
                <button type="submit" className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700">Salva</button>
                <button type="button" onClick={() => setShowForm(false)} className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400">Annulla</button>
              </div>
            </form>
          </div>
        )}

        <div className="grid gap-4">
          {loading ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">Caricamento...</div>
          ) : appuntamenti.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">Nessun appuntamento. Clicca su "Nuovo Appuntamento" per aggiungerne uno.</div>
          ) : (
            appuntamenti.map((app) => (
              <div key={app.id} className={`bg-white rounded-lg shadow p-4 border-l-4 ${isOggi(app.data_inizio) ? 'border-purple-500 bg-purple-50' : isPast(app.data_inizio) && app.stato === 'programmato' ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-gray-800">{app.titolo}</h3>
                      <span className={`px-2 py-0.5 rounded text-xs ${getStatoColor(app.stato)}`}>{app.stato}</span>
                      {isOggi(app.data_inizio) && <span className="px-2 py-0.5 rounded text-xs bg-purple-500 text-white">OGGI</span>}
                    </div>
                    <p className="text-purple-600 font-semibold">
                      {new Date(app.data_inizio).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                      {' alle '}
                      {new Date(app.data_inizio).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                      {app.data_fine && ` - ${new Date(app.data_fine).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}`}
                    </p>
                    {app.cliente && <p className="text-gray-600">Cliente: {app.cliente.nome} {app.cliente.cognome || ''}</p>}
                    {app.luogo && <p className="text-gray-500">Luogo: {app.luogo}</p>}
                    {app.descrizione && <p className="text-gray-500 mt-2">{app.descrizione}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <select value={app.stato} onChange={(e) => handleChangeStato(app.id, e.target.value)} className="border rounded px-2 py-1 text-sm">
                      <option value="programmato">Programmato</option>
                      <option value="completato">Completato</option>
                      <option value="annullato">Annullato</option>
                    </select>
                    <button onClick={() => handleDelete(app.id)} className="text-red-600 hover:text-red-800 text-sm">Elimina</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
