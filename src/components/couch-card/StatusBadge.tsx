import type { CouchStatus } from '#/lib/types'

const STATUS_LABEL: Record<CouchStatus, string> = {
  available: 'Verfügbar',
  reserved: 'Reserviert',
  sold: 'Verkauft',
}

const STATUS_CLASS: Record<CouchStatus, string> = {
  available: 'bg-deep-sage text-bone',
  reserved: 'bg-mist text-ink',
  sold: 'bg-ink/80 text-bone',
}

export function StatusBadge({ status }: { status: CouchStatus }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase ${STATUS_CLASS[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  )
}
