import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for database tables
export interface Cliente {
  id: number
  nome: string
  cognome?: string
  ragione_sociale?: string
  email?: string
  telefono?: string
  cellulare?: string
  indirizzo?: string
  citta?: string
  cap?: string
  provincia?: string
  codice_fiscale?: string
  partita_iva?: string
  note?: string
  created_at: string
  updated_at: string
}

export interface Prodotto {
  id: number
  codice: string
  nome: string
  descrizione?: string
  categoria?: string
  unita_misura: string
  prezzo_acquisto: number
  prezzo_vendita: number
  iva_percentuale: number
  quantita_disponibile: number
  quantita_minima: number
  fornitore?: string
  created_at: string
  updated_at: string
}

export interface MovimentoMagazzino {
  id: number
  prodotto_id: number
  tipo: 'carico' | 'scarico' | 'reso' | 'inventario'
  quantita: number
  note?: string
  data_movimento: string
  created_at: string
}

export interface Fattura {
  id: number
  numero: string
  cliente_id?: number
  data_fattura: string
  data_scadenza?: string
  stato: 'bozza' | 'emessa' | 'pagata' | 'annullata'
  imponibile: number
  iva: number
  totale: number
  note?: string
  created_at: string
  updated_at: string
}

export interface RigaFattura {
  id: number
  fattura_id: number
  prodotto_id?: number
  descrizione: string
  quantita: number
  prezzo_unitario: number
  iva_percentuale: number
  totale_riga: number
  created_at: string
}

export interface Appuntamento {
  id: number
  cliente_id?: number
  titolo: string
  descrizione?: string
  data_inizio: string
  data_fine?: string
  luogo?: string
  stato: 'programmato' | 'completato' | 'annullato'
  promemoria: boolean
  created_at: string
  updated_at: string
}
