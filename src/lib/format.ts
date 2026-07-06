export function formatPrice(cents: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100)
}

export function formatDimensions(d: {
  w: number
  d: number
  h: number
  seatH: number
}): string {
  return `B ${d.w} × T ${d.d} × H ${d.h} cm · Sitzhöhe ${d.seatH} cm`
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium' }).format(
    new Date(iso),
  )
}
