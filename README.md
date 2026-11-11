# Uni-Casa

App personale per imparare l'AI (e poi vibecoding + sicurezza): lezioni a schede, quiz, esercizi, verifiche con voto, ripasso a intervalli.
Sito statico (nessuna build): si pubblica com'è su GitHub Pages.

## Avvio in locale
```bash
python3 -m http.server 8000   # poi apri http://localhost:8000
```
Senza Supabase i progressi restano nel browser (localStorage).

## Login e salvataggio online (Supabase)
1. Crea un progetto su supabase.com.
2. SQL Editor → esegui `supabase/schema.sql` (crea la tabella e le policy RLS).
3. Project Settings → API: copia **Project URL** e **anon public key** in `js/config.js`.
   Mai la `service_role` key: bypassa la RLS e non deve stare nel frontend.
4. Authentication → URL Configuration: aggiungi l'URL di GitHub Pages in *Site URL*/*Redirect URLs*.
5. (Opzionale, solo uso personale) Authentication → Providers → Email: disattiva le registrazioni dopo aver creato il tuo utente.

## Pubblicazione su GitHub Pages
Settings → Pages → Source: **GitHub Actions**. Il workflow in `.github/workflows/pages.yml` pubblica a ogni push su `main`.

## Aggiungere contenuti
Ogni modulo è un file in `content/` (lezioni a blocchi + quiz + verifica) registrato in `js/catalog.js` con la proprietà `file`.
Formule in LaTeX con `\( ... \)` e `\[ ... \]` (usare `String.raw`).

## Graphify (mappa del codice per Claude)
`graphify-out/` contiene un grafo di conoscenza del progetto (nodi, relazioni, community): Claude lo interroga con
`graphify query/path/explain` invece di rileggere tutti i file. Si aggiorna da solo dopo ogni commit (git hook locali)
e a ogni push su `main` (workflow `graphify.yml`). Manuale: `pip install graphifyy && graphify update .`.
Vista interattiva: `graphify-out/graph.html`.
