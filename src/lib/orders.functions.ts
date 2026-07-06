import { createServerFn } from '@tanstack/react-start'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { seedCouches } from '#/data/couches'
import type { Order } from '#/lib/types'

const shippingAddressSchema = z.object({
  name: z.string().min(2, 'Name fehlt'),
  street: z.string().min(3, 'Straße fehlt'),
  zip: z.string().min(4, 'PLZ fehlt'),
  city: z.string().min(2, 'Ort fehlt'),
  phone: z.string().optional(),
})

const createOrderSchema = z.object({
  couchId: z.string().min(1),
  accessToken: z.string().nullable(),
  guest: z
    .object({
      name: z.string().min(2, 'Name fehlt'),
      email: z.string().email('Ungültige E-Mail'),
    })
    .nullable(),
  shippingAddress: shippingAddressSchema,
  message: z.string().max(2000).nullable(),
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>

const listOrdersSchema = z.object({
  accessToken: z.string().nullable(),
  guestEmail: z.string().email().nullable(),
})

async function createOrderSupabase(
  input: CreateOrderInput,
): Promise<{ orderId: string }> {
  const { getSupabaseServer } = await import('#/lib/supabase.server')
  const supabase = getSupabaseServer()
  if (!supabase) throw new Error('Supabase nicht konfiguriert')

  let buyerUserId: string | null = null
  if (input.accessToken) {
    const { data, error } = await supabase.auth.getUser(input.accessToken)
    if (error || !data.user) {
      throw new Error('Sitzung abgelaufen – bitte erneut anmelden.')
    }
    buyerUserId = data.user.id
  }
  if (!buyerUserId && !input.guest) {
    throw new Error('Bitte anmelden oder als Gast fortfahren.')
  }

  const { data: couch, error: couchError } = await supabase
    .from('couches')
    .select('id,status')
    .eq('id', input.couchId)
    .single()
  if (couchError || !couch) throw new Error('Couch nicht gefunden.')
  if (couch.status !== 'available') {
    throw new Error('Diese Couch ist leider nicht mehr verfügbar.')
  }

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      couch_id: input.couchId,
      buyer_user_id: buyerUserId,
      guest_email: buyerUserId ? null : input.guest?.email,
      guest_name: buyerUserId ? null : input.guest?.name,
      shipping_address: input.shippingAddress,
      message: input.message,
      status: 'pending',
    })
    .select('id')
    .single()
  if (orderError || !order) {
    throw new Error(`Bestellung fehlgeschlagen: ${orderError?.message}`)
  }

  const { error: statusError } = await supabase
    .from('couches')
    .update({ status: 'reserved' })
    .eq('id', input.couchId)
  if (statusError) {
    throw new Error(`Status-Update fehlgeschlagen: ${statusError.message}`)
  }

  return { orderId: order.id }
}

async function createOrderDemo(
  input: CreateOrderInput,
): Promise<{ orderId: string }> {
  const { readDemoStore, writeDemoStore } = await import(
    '#/lib/demo-store.server'
  )
  if (!input.guest) {
    throw new Error('Bitte als Gast fortfahren (Demo-Modus ohne Login).')
  }

  const store = readDemoStore()
  const couch = seedCouches.find((c) => c.id === input.couchId)
  if (!couch) throw new Error('Couch nicht gefunden.')

  const effectiveStatus = store.statusOverrides[couch.id] ?? couch.status
  if (effectiveStatus !== 'available') {
    throw new Error('Diese Couch ist leider nicht mehr verfügbar.')
  }

  const order: Order = {
    id: randomUUID(),
    couchId: input.couchId,
    buyerUserId: null,
    guestEmail: input.guest.email,
    guestName: input.guest.name,
    shippingAddress: input.shippingAddress,
    message: input.message,
    status: 'pending',
    createdAt: new Date().toISOString(),
  }

  writeDemoStore({
    orders: [...store.orders, order],
    statusOverrides: { ...store.statusOverrides, [input.couchId]: 'reserved' },
  })

  return { orderId: order.id }
}

export const createOrder = createServerFn({ method: 'POST' })
  .validator(createOrderSchema)
  .handler(async ({ data }) => {
    const { getSupabaseServer } = await import('#/lib/supabase.server')
    return getSupabaseServer()
      ? createOrderSupabase(data)
      : createOrderDemo(data)
  })

export const listMyOrders = createServerFn({ method: 'POST' })
  .validator(listOrdersSchema)
  .handler(async ({ data }): Promise<Order[]> => {
    const { getSupabaseServer } = await import('#/lib/supabase.server')
    const supabase = getSupabaseServer()

    if (supabase) {
      if (!data.accessToken) return []
      const { data: userData, error } = await supabase.auth.getUser(
        data.accessToken,
      )
      if (error || !userData.user) return []
      const { data: rows, error: listError } = await supabase
        .from('orders')
        .select('*')
        .eq('buyer_user_id', userData.user.id)
        .order('created_at', { ascending: false })
      if (listError) {
        throw new Error(`Bestellungen konnten nicht geladen werden: ${listError.message}`)
      }
      return (rows ?? []).map((row) => ({
        id: row.id,
        couchId: row.couch_id,
        buyerUserId: row.buyer_user_id,
        guestEmail: row.guest_email,
        guestName: row.guest_name,
        shippingAddress: row.shipping_address,
        message: row.message,
        status: row.status,
        createdAt: row.created_at,
      }))
    }

    if (!data.guestEmail) return []
    const { readDemoStore } = await import('#/lib/demo-store.server')
    return readDemoStore()
      .orders.filter((o) => o.guestEmail === data.guestEmail)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  })
