'use client'

import Link from "next/link"
import { useEffect, useState } from "react"
import { supabase, Prodotto } from "@/lib/supabase"

export default function MagazzinoPage() {
  const [prodotti, setProdotti] = useState<Prodotto[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProdotto, setEditingProdotto] = useState<Prodotto | null>(null)
  const [formData, setFormData] = useState({
    codice: '', nome: '', descrizione: '', categoria: '', unita_misura: 'pz',
    prezzo_acquisto: 0, prezzo_vendita: 0, iva_percentuale: 22,
    quantita_disponibile: 0, quantita_minima: 0, fornitore: ''
  })

  useEffect(() => {
    loadProdotti()
  }, [])

  async function loadProdotti() {
    const { data } = await supabase.from('prodotti').select('*').order('nome')
    if (data) setProdotti(data)
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (editingProdotto) {
      await supabase.from('prodotti').update(formData).eq('id', editingProdotto.id)
    } else {
      await supabase.from('prodotti').insert([formData])
    }
    setShowForm(false)
    setEditingProdotto(null)
    resetForm()
    loadProdotti()
  }

  function resetForm() {
    setFormData({ codice: '', nome: '', descrizione: '', categoria: '', unita_misura: 'pz', prezzo_acquisto: 0, prezzo_vendita: 0, iva_percentuale: 22, quantita_disponibile: 0, quantita_minima: 0, fornitore: '' })
  }

  async function handleDelete(id: number) {
    if (confirm('Sei sicuro di voler eliminare questo prodotto?')) {
      await supabase.from('prodotti').delete().eq('id', id)
      loadProdotti()
    }
  }

  function handleEdit(prodotto: Prodotto) {
    setEditingProdotto(prodotto)
    setFormData({
      codice: prodotto.codice, nome: prodotto.nome, descrizione: prodotto.descrizione || '',
      categoria: prodotto.categoria || '', unita_misura: prodotto.unita_misura,
      prezzo_acquisto: prodotto.prezzo_acquisto, prezzo_vendita: prodotto.prezzo_vendita,
      iva_percentuale: prodotto.iva_percentuale, quantita_disponibile: prodotto.quantita_disponibile,
      quantita_minima: prodotto.quantita_minima, fornitore: prodotto.fornitore || ''
    })
    setShowForm(true)
  }

  async function handleMovimento(prodottoId: number, tipo: 'carico' | 'scarico') {
    const quantita = prompt(`Inserisci la quantita da ${tipo === 'carico' ? 'caricare' : 'scaricare'}:`)
    if (quantita && !isNaN(Number(quantita))) {
      const prodotto = prodotti.find(p => p.id === prodottoId)
      if (!prodotto) return

      const nuovaQuantita = tipo === 'carico'
        ? prodotto.quantita_disponibile + Number(quantita)
        : prodotto.quantita_disponibile - Number(quantita)

      await supabase.from('movimenti_magazzino').insert([{
        prodotto_id: prodottoId, tipo, quantita: Number(quantita)
      }])
      await supabase.from('prodotti').update({ quantita_disponibile: nuovaQuantita }).eq('id', prodottoId)
      loadProdotti()
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-green-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <Link href="/" className="text-green-100 hover:text-white text-sm">&larr; Torna alla Dashboard</Link>
            <h1 className="text-3xl font-bold">Gestione Magazzino</h1>
          </div>
          <button onClick={() => { setShowForm(true); setEditingProdotto(null); resetForm(); }} className="bg-white text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-green-50">
            + Nuovo Prodotto
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {showForm && (
          <div className="bg-white rounded-lg shadow mb-8 p-6">
            <h2 className="text-xl font-bold mb-4">{editingProdotto ? 'Modifica Prodotto' : 'Nuovo Prodotto'}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input type="text" placeholder="Codice *" required value={formData.codice} onChange={(e) => setFormData({...formData, codice: e.target.value})} className="border rounded px-3 py-2" />
              <input type="text" placeholder="Nome *" required value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} className="border rounded px-3 py-2" />
              <input type="text" placeholder="Categoria" value={formData.categoria} onChange={(e) => setFormData({...formData, categoria: e.target.value})} className="border rounded px-3 py-2" />
              <input type="number" step="0.01" placeholder="Prezzo Acquisto" value={formData.prezzo_acquisto} onChange={(e) => setFormData({...formData, prezzo_acquisto: Number(e.target.value)})} className="border rounded px-3 py-2" />
              <input type="number" step="0.01" placeholder="Prezzo Vendita" value={formData.prezzo_vendita} onChange={(e) => setFormData({...formData, prezzo_vendita: Number(e.target.value)})} className="border rounded px-3 py-2" />
              <input type="number" step="0.01" placeholder="IVA %" value={formData.iva_percentuale} onChange={(e) => setFormData({...formData, iva_percentuale: Number(e.target.value)})} className="border rounded px-3 py-2" />
              <input type="number" step="0.01" placeholder="Quantita Disponibile" value={formData.quantita_disponibile} onChange={(e) => setFormData({...formData, quantita_disponibile: Number(e.target.value)})} className="border rounded px-3 py-2" />
              <input type="number" step="0.01" placeholder="Quantita Minima" value={formData.quantita_minima} onChange={(e) => setFormData({...formData, quantita_minima: Number(e.target.value)})} className="border rounded px-3 py-2" />
              <input type="text" placeholder="Fornitore" value={formData.fornitore} onChange={(e) => setFormData({...formData, fornitore: e.target.value})} className="border rounded px-3 py-2" />
              <select value={formData.unita_misura} onChange={(e) => setFormData({...formData, unita_misura: e.target.value})} className="border rounded px-3 py-2">
                <option value="pz">Pezzi</option>
                <option value="kg">Kg</option>
                <option value="lt">Litri</option>
                <option value="mt">Metri</option>
              </select>
              <textarea placeholder="Descrizione" value={formData.descrizione} onChange={(e) => setFormData({...formData, descrizione: e.target.value})} className="border rounded px-3 py-2 md:col-span-2" rows={2} />
              <div className="md:col-span-3 flex gap-4">
                <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">Salva</button>
                <button type="button" onClick={() => setShowForm(false)} className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400">Annulla</button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Codice</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Prezzo</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Quantita</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-4 text-center">Caricamento...</td></tr>
              ) : prodotti.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-4 text-center text-gray-500">Nessun prodotto. Clicca su "Nuovo Prodotto" per aggiungerne uno.</td></tr>
              ) : (
                prodotti.map((prodotto) => (
                  <tr key={prodotto.id} className={`hover:bg-gray-50 ${prodotto.quantita_disponibile <= prodotto.quantita_minima ? 'bg-red-50' : ''}`}>
                    <td className="px-4 py-4 font-mono">{prodotto.codice}</td>
                    <td className="px-4 py-4">{prodotto.nome}</td>
                    <td className="px-4 py-4">{prodotto.categoria || '-'}</td>
                    <td className="px-4 py-4 text-right">€ {prodotto.prezzo_vendita.toFixed(2)}</td>
                    <td className="px-4 py-4 text-right">
                      <span className={prodotto.quantita_disponibile <= prodotto.quantita_minima ? 'text-red-600 font-bold' : ''}>
                        {prodotto.quantita_disponibile} {prodotto.unita_misura}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button onClick={() => handleMovimento(prodotto.id, 'carico')} className="text-green-600 hover:text-green-800 mr-2">+Carico</button>
                      <button onClick={() => handleMovimento(prodotto.id, 'scarico')} className="text-orange-600 hover:text-orange-800 mr-2">-Scarico</button>
                      <button onClick={() => handleEdit(prodotto)} className="text-blue-600 hover:text-blue-800 mr-2">Modifica</button>
                      <button onClick={() => handleDelete(prodotto.id)} className="text-red-600 hover:text-red-800">Elimina</button>
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
