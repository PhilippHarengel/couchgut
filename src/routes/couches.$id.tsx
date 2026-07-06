import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { StatusBadge } from '#/components/couch-card/StatusBadge'
import { Reveal } from '#/components/reveal/Reveal'
import { useAuth } from '#/hooks/useAuth'
import { getCouchBySlug } from '#/lib/couches.functions'
import { formatDimensions, formatPrice } from '#/lib/format'

export const Route = createFileRoute('/couches/$id')({
  loader: ({ params }) => getCouchBySlug({ data: { slug: params.id } }),
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? 'Couch'} – Couchgut` },
      {
        name: 'description',
        content: loaderData?.description ?? 'Second-Hand-Sofa mit Geschichte.',
      },
      { property: 'og:title', content: `${loaderData?.title ?? 'Couch'} – Couchgut` },
      {
        property: 'og:description',
        content: loaderData?.description ?? 'Second-Hand-Sofa mit Geschichte.',
      },
      { property: 'og:image', content: loaderData?.images[0] ?? '' },
    ],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-5 py-24 text-center">
      <h1 className="text-section text-deep-sage">Couch nicht gefunden</h1>
      <p className="mt-4 text-muted">
        Dieses Stück gibt es nicht – oder es hat schon ein neues Zuhause.
      </p>
      <Link to="/couches" className="btn btn-primary mt-8">
        Zur Kollektion
      </Link>
    </div>
  ),
  component: CouchDetailPage,
})

function CouchDetailPage() {
  const couch = Route.useLoaderData()
  const auth = useAuth()
  const navigate = useNavigate()
  const [activeImage, setActiveImage] = useState(0)

  const isAvailable = couch.status === 'available'

  const handleBuy = () => {
    const target = `/checkout/${couch.slug}`
    if (auth.isIdentified) {
      navigate({ to: '/checkout/$id', params: { id: couch.slug } })
    } else {
      navigate({ to: '/auth', search: { redirect: target } })
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <nav aria-label="Brotkrumen" className="mb-8 text-sm text-muted">
        <Link to="/couches" className="hover:text-deep-sage">
          Kollektion
        </Link>
        <span aria-hidden="true"> / </span>
        <span className="text-ink">{couch.title}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
        {/* Gallery */}
        <section aria-label="Galerie">
          <div className="img-zoom overflow-hidden rounded-3xl border border-line">
            <img
              src={couch.images[activeImage] ?? couch.images[0]}
              alt={`${couch.title} – Ansicht ${activeImage + 1}`}
              width={1200}
              height={900}
              loading="eager"
              fetchPriority="high"
              className="h-full w-full object-cover"
            />
          </div>
          {couch.images.length > 1 ? (
            <div className="mt-4 flex gap-3" role="tablist" aria-label="Bildauswahl">
              {couch.images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  role="tab"
                  aria-selected={i === activeImage}
                  aria-label={`Bild ${i + 1} anzeigen`}
                  onClick={() => setActiveImage(i)}
                  className={`overflow-hidden rounded-xl border-2 transition-colors ${
                    i === activeImage
                      ? 'border-ember'
                      : 'border-transparent hover:border-sage'
                  }`}
                >
                  <img
                    src={src}
                    alt=""
                    width={120}
                    height={90}
                    loading="lazy"
                    className="h-20 w-28 object-cover"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </section>

        {/* Facts + buy */}
        <section aria-labelledby="couch-title">
          <div className="flex items-start justify-between gap-4">
            <h1 id="couch-title" className="text-section text-deep-sage">
              {couch.title}
            </h1>
            <StatusBadge status={couch.status} />
          </div>
          <p className="mt-3 text-muted">{couch.description}</p>

          <p className="font-display mt-6 text-5xl text-ink">
            {formatPrice(couch.priceCents, couch.currency)}
          </p>

          <dl className="mt-8 grid grid-cols-[max-content_1fr] gap-x-6 gap-y-3 rounded-2xl border border-line bg-surface-raised p-6 text-sm">
            <dt className="font-semibold">Maße</dt>
            <dd className="text-muted">{formatDimensions(couch.dimensions)}</dd>
            <dt className="font-semibold">Material</dt>
            <dd className="text-muted">{couch.material}</dd>
            <dt className="font-semibold">Farbe</dt>
            <dd className="text-muted">{couch.color}</dd>
            <dt className="font-semibold">Stil</dt>
            <dd className="text-muted">{couch.style}</dd>
            <dt className="font-semibold">Baujahr</dt>
            <dd className="text-muted">{couch.year}</dd>
            <dt className="font-semibold">Zustand</dt>
            <dd className="text-muted">{couch.condition}</dd>
          </dl>

          <div className="mt-8">
            {isAvailable ? (
              <button type="button" onClick={handleBuy} className="btn btn-ember text-base">
                Jetzt kaufen
              </button>
            ) : (
              <p className="rounded-xl bg-mist/40 px-5 py-4 text-sm">
                {couch.status === 'reserved'
                  ? 'Dieses Stück ist aktuell reserviert. Melde dich, falls du auf die Warteliste möchtest.'
                  : 'Dieses Stück hat bereits ein neues Zuhause gefunden.'}
              </p>
            )}
            <p className="mt-3 text-xs text-muted">
              Keine Online-Zahlung: Du bestellst verbindlich, Bezahlung &amp;
              Übergabe klären wir persönlich. Abholung oder Lieferung nach
              Absprache.
            </p>
          </div>
        </section>
      </div>

      {/* Story */}
      <Reveal className="mt-16 max-w-3xl">
        <h2 className="font-display text-2xl text-deep-sage">Die Geschichte</h2>
        <p className="mt-4 text-lg leading-relaxed text-ink/85">{couch.story}</p>
      </Reveal>
    </div>
  )
}
