import { Link, createFileRoute, useRouter } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useServerFn } from '@tanstack/react-start'
import { useAuth } from '#/hooks/useAuth'
import { listMyOrders } from '#/lib/orders.functions'
import { listCouches } from '#/lib/couches.functions'
import { formatDate, formatPrice } from '#/lib/format'
import type { Couch, Order } from '#/lib/types'

export const Route = createFileRoute('/_authenticated/konto')({
  loader: () => listCouches(),
  head: () => ({
    meta: [
      { title: 'Mein Konto – Couchgut' },
      { name: 'description', content: 'Deine Bestellungen im Überblick.' },
      { property: 'og:title', content: 'Mein Konto – Couchgut' },
      { property: 'og:description', content: 'Deine Bestellungen im Überblick.' },
    ],
  }),
  component: KontoPage,
})

const ORDER_STATUS_LABEL: Record<Order['status'], string> = {
  pending: 'Angefragt',
  confirmed: 'Bestätigt',
  cancelled: 'Storniert',
}

function KontoPage() {
  const couches = Route.useLoaderData()
  const auth = useAuth()
  const router = useRouter()
  const fetchOrders = useServerFn(listMyOrders)
  const [orders, setOrders] = useState<Order[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!auth.isReady) return
    let cancelled = false
    fetchOrders({
      data: {
        accessToken: auth.session?.access_token ?? null,
        guestEmail: auth.guest?.email ?? null,
      },
    })
      .then((result) => {
        if (!cancelled) setOrders(result)
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Bestellungen nicht ladbar.',
          )
        }
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.isReady, auth.session?.access_token, auth.guest?.email])

  const couchById = new Map<string, Couch>(couches.map((c) => [c.id, c]))

  const handleSignOut = async () => {
    await auth.signOut()
    router.navigate({ to: '/' })
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-section text-deep-sage">Mein Konto</h1>
          <p className="mt-2 text-muted">
            {auth.displayName}
            {auth.guest ? ' (Gast)' : ''} · {auth.email}
          </p>
        </div>
        <button type="button" onClick={handleSignOut} className="btn btn-ghost">
          Abmelden
        </button>
      </div>

      <h2 className="font-display mt-12 text-2xl text-deep-sage">
        Meine Bestellungen
      </h2>

      {error ? (
        <p role="alert" className="mt-6 rounded-xl bg-ember/15 px-4 py-3 text-sm text-ember">
          {error}
        </p>
      ) : null}

      {orders === null && !error ? (
        <p className="mt-6 text-muted">Lade Bestellungen …</p>
      ) : null}

      {orders !== null && orders.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-line bg-surface-raised p-10 text-center">
          <p className="text-muted">Noch keine Bestellungen.</p>
          <Link to="/couches" className="btn btn-primary mt-6">
            Kollektion ansehen
          </Link>
        </div>
      ) : null}

      <ul className="mt-6 space-y-4">
        {(orders ?? []).map((order) => {
          const couch = couchById.get(order.couchId)
          return (
            <li
              key={order.id}
              className="flex flex-wrap items-center gap-5 rounded-2xl border border-line bg-surface-raised p-5"
            >
              {couch ? (
                <img
                  src={couch.images[0]}
                  alt={couch.title}
                  width={120}
                  height={90}
                  loading="lazy"
                  className="h-20 w-28 rounded-xl object-cover"
                />
              ) : null}
              <div className="min-w-0 flex-1">
                <p className="font-display text-lg">
                  {couch?.title ?? 'Couch'}
                </p>
                <p className="text-sm text-muted">
                  Bestellt am {formatDate(order.createdAt)} · Lieferung an{' '}
                  {order.shippingAddress.city}
                </p>
              </div>
              <div className="text-right">
                {couch ? (
                  <p className="font-display text-lg text-deep-sage">
                    {formatPrice(couch.priceCents, couch.currency)}
                  </p>
                ) : null}
                <span className="mt-1 inline-block rounded-full bg-mist/60 px-3 py-1 text-xs font-semibold">
                  {ORDER_STATUS_LABEL[order.status]}
                </span>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
