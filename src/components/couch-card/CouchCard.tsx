import { Link } from '@tanstack/react-router'
import { StatusBadge } from './StatusBadge'
import { formatPrice } from '#/lib/format'
import type { Couch } from '#/lib/types'

export function CouchCard({ couch }: { couch: Couch }) {
  return (
    <Link
      to="/couches/$id"
      params={{ id: couch.slug }}
      className="card group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember"
      aria-label={`${couch.title} – ${formatPrice(couch.priceCents, couch.currency)}`}
    >
      <div className="img-zoom relative aspect-[4/3]">
        <img
          src={couch.images[0]}
          alt={`${couch.title} – ${couch.style} Sofa in ${couch.color}`}
          width={1200}
          height={900}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <div className="absolute top-4 left-4">
          <StatusBadge status={couch.status} />
        </div>
      </div>
      <div className="flex items-start justify-between gap-4 p-5">
        <div>
          <h3 className="text-xl">{couch.title}</h3>
          <p className="text-muted mt-1 text-sm">
            {couch.style} · {couch.year} · {couch.color}
          </p>
        </div>
        <p className="font-display text-xl whitespace-nowrap text-deep-sage">
          {formatPrice(couch.priceCents, couch.currency)}
        </p>
      </div>
    </Link>
  )
}
