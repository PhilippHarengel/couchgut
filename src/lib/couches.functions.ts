import { createServerFn } from '@tanstack/react-start'
import { notFound } from '@tanstack/react-router'
import { z } from 'zod'
import { seedCouches } from '#/data/couches'
import { mapCouchRow } from '#/lib/couch-mapper'
import type { Couch } from '#/lib/types'

async function loadCouches(): Promise<Couch[]> {
  const { getSupabaseServer } = await import('#/lib/supabase.server')
  const supabase = getSupabaseServer()

  if (supabase) {
    const { data, error } = await supabase
      .from('couches')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      throw new Error(`Couches konnten nicht geladen werden: ${error.message}`)
    }
    return (data ?? []).map(mapCouchRow)
  }

  const { readDemoStore } = await import('#/lib/demo-store.server')
  const { statusOverrides } = readDemoStore()
  return seedCouches.map((couch) =>
    statusOverrides[couch.id]
      ? { ...couch, status: statusOverrides[couch.id] }
      : couch,
  )
}

export const listCouches = createServerFn({ method: 'GET' }).handler(
  async () => loadCouches(),
)

export const getCouchBySlug = createServerFn({ method: 'GET' })
  .validator(z.object({ slug: z.string().min(1) }))
  .handler(async ({ data }) => {
    const couches = await loadCouches()
    const couch = couches.find(
      (c) => c.slug === data.slug || c.id === data.slug,
    )
    if (!couch) throw notFound()
    return couch
  })
