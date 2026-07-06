import type { Couch, CouchDimensions, CouchStatus } from '#/lib/types'

interface CouchRow {
  id: string
  title: string
  slug: string
  price_cents: number
  currency: string
  status: CouchStatus
  description: string
  dimensions: CouchDimensions
  material: string
  color: string
  style: string
  year: number
  condition: string
  story: string
  images: string[]
  created_at: string
}

export function mapCouchRow(row: CouchRow): Couch {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    priceCents: row.price_cents,
    currency: row.currency,
    status: row.status,
    description: row.description,
    dimensions: row.dimensions,
    material: row.material,
    color: row.color,
    style: row.style,
    year: row.year,
    condition: row.condition,
    story: row.story,
    images: row.images ?? [],
    createdAt: row.created_at,
  }
}
