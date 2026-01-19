'use client'

import Link from "next/link"
import { useEffect, useState } from "react"
import { supabase, Fattura, Cliente } from "@/lib/supabase"

export default function FatturePage() {
  const [fatture, setFatture] = useState<(Fattura & { cliente?: Cliente })[]>([])
  const [clienti, setClienti] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [printFattura, setPrintFattura] = useState<(Fattura & { cliente?: Cliente }) | null>(null)
  const [formData, setFormData] = useState({
    numero: '', cliente_id: '', data_fattura: new Date().toISOString().split('T')[0],
    data_scadenza: '', imponibile: 0, iva: 0, totale: 0, note: '', stato: 'bozza'
  })

  useEffect(() => {
    loadFatture()
    loadClienti()
  }, [])

  async function loadFatture() {
    const { data } = await supabase.from('fatture').select('*, cliente:clienti(*)').order('created_at', { ascending: false })
    if (data) setFatture(data)
    setLoading(false)
  }

  async function loadClienti() {
    const { data } = await supabase.from('clienti').select('*').order('nome')
    if (data) setClienti(data)
  }

  function calcolaTotali(imponibile: number) {
    const iva = imponibile * 0.22
    const totale = imponibile + iva
    setFormData(prev => ({ ...prev, imponibile, iva, totale }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const dataToSave = {
      ...formData,
      cliente_id: formData.cliente_id ? Number(formData.cliente_id) : null
    }
    await supabase.from('fatture').insert([dataToSave])
    setShowForm(false)
    setFormData({ numero: '', cliente_id: '', data_fattura: new Date().toISOString().split('T')[0], data_scadenza: '', imponibile: 0, iva: 0, totale: 0, note: '', stato: 'bozza' })
    loadFatture()
  }

  async function handleDelete(id: number) {
    if (confirm('Sei sicuro di voler eliminare questa fattura?')) {
      await supabase.from('fatture').delete().eq('id', id)
      loadFatture()
    }
  }

  async function handleChangeStato(id: number, stato: string) {
    await supabase.from('fatture').update({ stato }).eq('id', id)
    loadFatture()
  }

  const getStatoColor = (stato: string) => {
    switch (stato) {
      case 'bozza': return 'bg-gray-200 text-gray-800'
      case 'emessa': return 'bg-blue-200 text-blue-800'
      case 'pagata': return 'bg-green-200 text-green-800'
      case 'annullata': return 'bg-red-200 text-red-800'
      default: return 'bg-gray-200'
    }
  }

  function handlePrint(fattura: Fattura & { cliente?: Cliente }) {
    setPrintFattura(fattura)
    setTimeout(() => window.print(), 100)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-yellow-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <Link href="/" className="text-yellow-100 hover:text-white text-sm">&larr; Torna alla Dashboard</Link>
            <h1 className="text-3xl font-bold">Gestione Fatture</h1>
          </div>
          <button onClick={() => setShowForm(true)} className="bg-white text-yellow-600 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-50">
            + Nuova Fattura
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {showForm && (
          <div className="bg-white rounded-lg shadow mb-8 p-6">
            <h2 className="text-xl font-bold mb-4">Nuova Fattura</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input type="text" placeholder="Numero Fattura *" required value={formData.numero} onChange={(e) => setFormData({...formData, numero: e.target.value})} className="border rounded px-3 py-2" />
              <select value={formData.cliente_id} onChange={(e) => setFormData({...formData, cliente_id: e.target.value})} className="border rounded px-3 py-2">
                <option value="">Seleziona Cliente</option>
                {clienti.map(c => <option key={c.id} value={c.id}>{c.nome} {c.cognome}</option>)}
              </select>
              <input type="date" value={formData.data_fattura} onChange={(e) => setFormData({...formData, data_fattura: e.target.value})} className="border rounded px-3 py-2" />
              <input type="date" placeholder="Data Scadenza" value={formData.data_scadenza} onChange={(e) => setFormData({...formData, data_scadenza: e.target.value})} className="border rounded px-3 py-2" />
              <input type="number" step="0.01" placeholder="Imponibile" value={formData.imponibile} onChange={(e) => calcolaTotali(Number(e.target.value))} className="border rounded px-3 py-2" />
              <div className="flex gap-2">
                <input type="number" step="0.01" placeholder="IVA" value={formData.iva.toFixed(2)} readOnly className="border rounded px-3 py-2 bg-gray-50 flex-1" />
                <input type="number" step="0.01" placeholder="Totale" value={formData.totale.toFixed(2)} readOnly className="border rounded px-3 py-2 bg-gray-50 font-bold flex-1" />
              </div>
              <textarea placeholder="Note" value={formData.note} onChange={(e) => setFormData({...formData, note: e.target.value})} className="border rounded px-3 py-2 md:col-span-3" rows={2} />
              <div className="md:col-span-3 flex gap-4">
                <button type="submit" className="bg-yellow-600 text-white px-6 py-2 rounded hover:bg-yellow-700">Salva</button>
                <button type="button" onClick={() => setShowForm(false)} className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400">Annulla</button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Numero</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Totale</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Stato</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-4 text-center">Caricamento...</td></tr>
              ) : fatture.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-4 text-center text-gray-500">Nessuna fattura. Clicca su "Nuova Fattura" per crearne una.</td></tr>
              ) : (
                fatture.map((fattura) => (
                  <tr key={fattura.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 font-mono font-bold">{fattura.numero}</td>
                    <td className="px-4 py-4">{fattura.cliente ? `${fattura.cliente.nome} ${fattura.cliente.cognome || ''}` : '-'}</td>
                    <td className="px-4 py-4">{new Date(fattura.data_fattura).toLocaleDateString('it-IT')}</td>
                    <td className="px-4 py-4 text-right font-bold">€ {fattura.totale.toFixed(2)}</td>
                    <td className="px-4 py-4 text-center">
                      <select value={fattura.stato} onChange={(e) => handleChangeStato(fattura.id, e.target.value)} className={`px-2 py-1 rounded text-sm ${getStatoColor(fattura.stato)}`}>
                        <option value="bozza">Bozza</option>
                        <option value="emessa">Emessa</option>
                        <option value="pagata">Pagata</option>
                        <option value="annullata">Annullata</option>
                      </select>
                    </td>
                    <td className="px-4 py-4">
                      <button onClick={() => handlePrint(fattura)} className="text-blue-600 hover:text-blue-800 mr-3">Stampa</button>
                      <button onClick={() => handleDelete(fattura.id)} className="text-red-600 hover:text-red-800">Elimina</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Vista Stampa */}
      {printFattura && (
        <div className="hidden print:block print:absolute print:inset-0 print:bg-white print:z-50 p-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold">FATTURA</h1>
              <p className="text-gray-600">N. {printFattura.numero}</p>
            </div>

            <div className="flex justify-between mb-8">
              <div>
                <h3 className="font-bold text-gray-700">Da:</h3>
                <p className="font-bold">La Tua Azienda</p>
                <p>Via Example 1</p>
                <p>00100 Roma (RM)</p>
                <p>P.IVA: 00000000000</p>
              </div>
              <div className="text-right">
                <h3 className="font-bold text-gray-700">A:</h3>
                {printFattura.cliente ? (
                  <>
                    <p className="font-bold">{printFattura.cliente.nome} {printFattura.cliente.cognome || ''}</p>
                    {printFattura.cliente.ragione_sociale && <p>{printFattura.cliente.ragione_sociale}</p>}
                    {printFattura.cliente.indirizzo && <p>{printFattura.cliente.indirizzo}</p>}
                    {(printFattura.cliente.cap || printFattura.cliente.citta) && (
                      <p>{printFattura.cliente.cap} {printFattura.cliente.citta} {printFattura.cliente.provincia && `(${printFattura.cliente.provincia})`}</p>
                    )}
                    {printFattura.cliente.partita_iva && <p>P.IVA: {printFattura.cliente.partita_iva}</p>}
                    {printFattura.cliente.codice_fiscale && <p>C.F.: {printFattura.cliente.codice_fiscale}</p>}
                  </>
                ) : <p>-</p>}
              </div>
            </div>

            <div className="mb-4">
              <p><strong>Data:</strong> {new Date(printFattura.data_fattura).toLocaleDateString('it-IT')}</p>
              {printFattura.data_scadenza && <p><strong>Scadenza:</strong> {new Date(printFattura.data_scadenza).toLocaleDateString('it-IT')}</p>}
            </div>

            <table className="w-full mb-8 border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-800">
                  <th className="text-left py-2">Descrizione</th>
                  <th className="text-right py-2">Importo</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">Servizi/Prodotti</td>
                  <td className="text-right py-2">€ {printFattura.imponibile.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>

            <div className="flex justify-end">
              <div className="w-64">
                <div className="flex justify-between py-1">
                  <span>Imponibile:</span>
                  <span>€ {printFattura.imponibile.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>IVA (22%):</span>
                  <span>€ {printFattura.iva.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 border-t-2 border-gray-800 font-bold text-lg">
                  <span>TOTALE:</span>
                  <span>€ {printFattura.totale.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {printFattura.note && (
              <div className="mt-8 pt-4 border-t">
                <p className="text-gray-600"><strong>Note:</strong> {printFattura.note}</p>
              </div>
            )}

            <div className="mt-16 text-center text-gray-500 text-sm">
              <p>Grazie per la fiducia!</p>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:block, .print\\:block * {
            visibility: visible;
          }
          .print\\:block {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white;
          }
        }
      `}</style>
    </div>
  )
}
