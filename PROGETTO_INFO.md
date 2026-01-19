# GESTIONALE - Informazioni Complete del Progetto

## URLs Importanti
- **Sito Live**: https://gestionale-ernbale.vercel.app
- **Dashboard Vercel**: https://vercel.com/ernbale/gestionale-ernbale
- **GitHub Repo**: https://github.com/ernbale/gestionale-ernbale
- **Supabase Dashboard**: https://supabase.com/dashboard/project/fapfdxodfyickddfchjv

## Credenziali Supabase (in .env.local)
```
NEXT_PUBLIC_SUPABASE_URL=https://fapfdxodfyickddfchjv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhcGZkeG9kZnlpY2tkZGZjaGp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczMTU1MDEsImV4cCI6MjA1Mjg5MTUwMX0.qlNtrP12x9TnXHB7V4fKL0KAHEkjOGkLpHrNiXB3Bl4
```

## Struttura del Progetto
```
C:\progetti\gestionale\
├── src/
│   ├── app/
│   │   ├── page.tsx          # Dashboard principale
│   │   ├── clienti/
│   │   │   └── page.tsx      # Gestione Clienti (CRM)
│   │   ├── magazzino/
│   │   │   └── page.tsx      # Gestione Magazzino/Inventario
│   │   ├── fatture/
│   │   │   └── page.tsx      # Gestione Fatture (con stampa)
│   │   └── appuntamenti/
│   │       └── page.tsx      # Gestione Appuntamenti
│   └── lib/
│       └── supabase.ts       # Client Supabase e tipi TypeScript
├── .env.local                # Variabili ambiente (credenziali Supabase)
├── package.json
└── next.config.ts
```

## Tecnologie Utilizzate
- **Frontend**: Next.js 16 con TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Vercel (piano gratuito Hobby)
- **Repository**: GitHub

## Moduli Implementati
1. **Clienti (CRM)** - Colore: Verde
   - Aggiungi/Modifica/Elimina clienti
   - Campi: nome, cognome, email, telefono, ragione sociale, P.IVA, CF, indirizzo completo, note

2. **Magazzino** - Colore: Blu
   - Gestione prodotti/articoli
   - Campi: codice, nome, descrizione, categoria, prezzo, quantità, unità misura, scorta minima

3. **Fatture** - Colore: Giallo
   - Creazione fatture con calcolo automatico IVA 22%
   - Stati: bozza, emessa, pagata, annullata
   - Funzione stampa (DA SISTEMARE - problema CSS)

4. **Appuntamenti** - Colore: Viola
   - Calendario appuntamenti
   - Stati: programmato, completato, annullato
   - Evidenziazione appuntamenti di oggi

## Tabelle Database Supabase
- `clienti` - Anagrafica clienti
- `prodotti` - Articoli magazzino
- `fatture` - Fatture emesse
- `appuntamenti` - Calendario appuntamenti

## Comandi Utili
```bash
# Avviare il server di sviluppo
cd C:\progetti\gestionale
npm run dev

# Deployare su Vercel (automatico con push su GitHub)
git add .
git commit -m "descrizione modifiche"
git push vercel main
```

## Problemi Noti da Risolvere
1. **Stampa Fatture**: L'anteprima di stampa mostra pagina quasi vuota - il CSS per la stampa non funziona correttamente

## Git Remotes Configurati
- `origin`: https://github.com/ernbale/gestionale.git
- `vercel`: https://github.com/ernbale/gestionale-ernbale.git (collegato a Vercel)

## Account GitHub
- Username: ernbale
