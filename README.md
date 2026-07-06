# Couchgut – Vintage Sofas mit Geschichte

Persönlicher Second-Hand-Couch-Shop (ein Verkäufer). TanStack Start + Tailwind v4 + Supabase.

## Starten

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # Produktions-Build
npx tsc --noEmit   # Typecheck
```

## Modi

**Demo-Modus (Standard, ohne Backend):**
- Couches kommen aus `src/data/couches.ts` (Seed-Daten, 9 Stücke)
- Bestellungen + Status-Overrides landen in `.data/demo-store.json`
- Login/Registrierung sind deaktiviert, **Gast-Kauf funktioniert komplett**

**Cloud-Modus (Supabase / Lovable Cloud):**
1. `.env` nach Vorlage `.env.example` anlegen
2. Migration `supabase/migrations/0001_init.sql` im SQL-Editor ausführen
3. Nach eigenem Signup Admin-Rolle setzen (Snippet am Ende der Migration)
4. Bilder in den Storage-Bucket `couch-images` laden, `images`-URLs in `couches` setzen

Gast-Bestellungen laufen über eine Server-Function mit Service-Role-Key
(bewusst keine anon-INSERT-Policy auf `orders`).

## Struktur

```
src/
├── routes/
│   ├── __root.tsx                    # Fonts, Header, Footer, Meta
│   ├── index.tsx                     # Home (Hero, Featured, Grid, Werte)
│   ├── couches.index.tsx             # Kollektion + Filter (URL-State)
│   ├── couches.$id.tsx               # Detail (Galerie, Maße, Story, Kauf)
│   ├── ueber.tsx / kontakt.tsx       # Statisch
│   ├── auth.tsx                      # Login / Registrieren / Gast
│   └── _authenticated/
│       ├── route.tsx                 # Client-Guard (Session ODER Gast)
│       ├── konto.tsx                 # Meine Bestellungen
│       └── checkout.$id.tsx          # Lieferadresse → Bestellung
├── lib/
│   ├── couches.functions.ts          # Server-Fn: Liste/Detail
│   ├── orders.functions.ts           # Server-Fn: Bestellung, Meine Bestellungen
│   ├── supabase.ts / supabase.server.ts
│   └── demo-store.server.ts          # File-Store für Demo-Modus
├── data/couches.ts                   # Seed-Kollektion
└── styles.css                        # oklch-Tokens, Motion, Buttons

public/images/couches/                # Produktfotos (Unsplash-Lizenz, lokal)
supabase/migrations/0001_init.sql     # Schema, RLS, has_role, Storage
```

## Design

- Farben: Sage `#8FA88C`, Deep Sage `#3F5A46`, Nebelblau `#B6C7D1`,
  Bone `#F4F1EA`, Terracotta `#C67A5A` (Kauf-CTA), Ink `#1F2421` — als oklch-Tokens
- Typo: Patua One (Display) + Inter (Body), via Google Fonts in `__root.tsx`
- Motion: IntersectionObserver-Reveal, Hover-Zoom, `prefers-reduced-motion` respektiert

## Bewusst nicht drin (diese Iteration)

Online-Zahlung (Stripe), mehrere Verkäufer, Reviews, Admin-UI
(Couches via Cloud-UI pflegen; Admin-Route als Follow-up).
