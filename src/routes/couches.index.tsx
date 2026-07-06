import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { CouchCard } from '#/components/couch-card/CouchCard'
import { Reveal } from '#/components/reveal/Reveal'
import { listCouches } from '#/lib/couches.functions'

const MAX_PRICE_STEPS = [500, 750, 1000, 1500] as const

const searchSchema = z.object({
  maxPrice: z.number().optional().catch(undefined),
  style: z.string().optional().catch(undefined),
  color: z.string().optional().catch(undefined),
})

export const Route = createFileRoute('/couches/')({
  validateSearch: searchSchema,
  loader: () => listCouches(),
  head: () => ({
    meta: [
      { title: 'Kollektion – Couchgut' },
      {
        name: 'description',
        content:
          'Alle verfügbaren Second-Hand-Sofas: nach Preis, Stil und Farbe filterbar.',
      },
      { property: 'og:title', content: 'Kollektion – Couchgut' },
      {
        property: 'og:description',
        content: 'Alle verfügbaren Second-Hand-Sofas im Überblick.',
      },
    ],
  }),
  component: CollectionPage,
})

function CollectionPage() {
  const couches = Route.useLoaderData()
  const search = Route.useSearch()
  const navigate = Route.useNavigate()

  const styles = [...new Set(couches.map((c) => c.style))].sort()
  const colors = [...new Set(couches.map((c) => c.color))].sort()

  const filtered = couches.filter((c) => {
    if (search.maxPrice && c.priceCents > search.maxPrice * 100) return false
    if (search.style && c.style !== search.style) return false
    if (search.color && c.color !== search.color) return false
    return true
  })

  const setFilter = (patch: Partial<typeof search>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true })

  const hasFilters = Boolean(search.maxPrice ?? search.style ?? search.color)

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <header className="mb-10">
        <h1 className="text-section text-deep-sage">Alle Couches</h1>
        <p className="mt-2 text-muted">
          {filtered.length} von {couches.length} Stücken · jedes ein Unikat
        </p>
      </header>

      <form
        aria-label="Filter"
        className="mb-10 flex flex-wrap items-end gap-4 rounded-2xl border border-line bg-surface-raised p-5"
        onSubmit={(e) => e.preventDefault()}
      >
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Preis bis
          <select
            className="field min-w-36"
            value={search.maxPrice ?? ''}
            onChange={(e) =>
              setFilter({
                maxPrice: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          >
            <option value="">Alle Preise</option>
            {MAX_PRICE_STEPS.map((p) => (
              <option key={p} value={p}>
                bis {p} €
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Stil
          <select
            className="field min-w-44"
            value={search.style ?? ''}
            onChange={(e) =>
              setFilter({ style: e.target.value || undefined })
            }
          >
            <option value="">Alle Stile</option>
            {styles.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Farbe
          <select
            className="field min-w-40"
            value={search.color ?? ''}
            onChange={(e) =>
              setFilter({ color: e.target.value || undefined })
            }
          >
            <option value="">Alle Farben</option>
            {colors.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        {hasFilters ? (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() =>
              setFilter({ maxPrice: undefined, style: undefined, color: undefined })
            }
          >
            Zurücksetzen
          </button>
        ) : null}
      </form>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-line bg-surface-raised p-10 text-center text-muted">
          Keine Couch passt zu diesen Filtern – probier es mit weniger
          Einschränkungen.
        </p>
      ) : (
        <ul className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((couch, i) => (
            <Reveal as="li" key={couch.id} delay={(i % 3) * 80}>
              <CouchCard couch={couch} />
            </Reveal>
          ))}
        </ul>
      )}
    </div>
  )
}
