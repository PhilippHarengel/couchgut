import { Link, createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useServerFn } from '@tanstack/react-start'
import { StatusBadge } from '#/components/couch-card/StatusBadge'
import { useAuth } from '#/hooks/useAuth'
import { getCouchBySlug } from '#/lib/couches.functions'
import { createOrder } from '#/lib/orders.functions'
import { formatDimensions, formatPrice } from '#/lib/format'

export const Route = createFileRoute('/_authenticated/checkout/$id')({
  loader: ({ params }) => getCouchBySlug({ data: { slug: params.id } }),
  head: ({ loaderData }) => ({
    meta: [
      { title: `Kauf bestätigen: ${loaderData?.title ?? 'Couch'} – Couchgut` },
      { name: 'description', content: 'Bestellung abschließen bei Couchgut.' },
      { property: 'og:title', content: 'Kauf bestätigen – Couchgut' },
      { property: 'og:description', content: 'Bestellung abschließen bei Couchgut.' },
    ],
  }),
  component: CheckoutPage,
})

function CheckoutPage() {
  const couch = Route.useLoaderData()
  const auth = useAuth()
  const submitOrder = useServerFn(createOrder)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)

  const isAvailable = couch.status === 'available'

  const handleSubmit = async (form: FormData) => {
    setIsSubmitting(true)
    setError(null)
    try {
      const result = await submitOrder({
        data: {
          couchId: couch.id,
          accessToken: auth.session?.access_token ?? null,
          guest: auth.guest,
          shippingAddress: {
            name: String(form.get('name') ?? ''),
            street: String(form.get('street') ?? ''),
            zip: String(form.get('zip') ?? ''),
            city: String(form.get('city') ?? ''),
            phone: String(form.get('phone') ?? '') || undefined,
          },
          message: String(form.get('message') ?? '') || null,
        },
      })
      setOrderId(result.orderId)
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Bestellung fehlgeschlagen.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (orderId) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <p className="font-display text-5xl text-deep-sage">Danke!</p>
        <h1 className="mt-4 text-xl font-semibold">
          Deine Bestellung für „{couch.title}“ ist eingegangen.
        </h1>
        <p className="mt-4 text-muted">
          Die Couch ist jetzt für dich reserviert. Ich melde mich innerhalb von
          24 Stunden per E-Mail, um Bezahlung und Übergabe zu klären.
        </p>
        <p className="mt-2 text-xs text-muted">Bestellnummer: {orderId}</p>
        <div className="mt-8 flex justify-center gap-4">
          <Link to="/konto" className="btn btn-primary">
            Meine Bestellungen
          </Link>
          <Link to="/couches" className="btn btn-ghost">
            Weiterstöbern
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <h1 className="text-section text-deep-sage">Kauf bestätigen</h1>
      <p className="mt-2 text-muted">
        Verbindliche Bestellung – Bezahlung &amp; Übergabe klären wir danach
        persönlich. Keine Online-Zahlung nötig.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        {/* Summary */}
        <aside className="h-fit rounded-2xl border border-line bg-surface-raised p-6">
          <div className="img-zoom overflow-hidden rounded-xl">
            <img
              src={couch.images[0]}
              alt={couch.title}
              width={1200}
              height={900}
              loading="eager"
              className="w-full object-cover"
            />
          </div>
          <div className="mt-5 flex items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-xl">{couch.title}</h2>
              <p className="mt-1 text-sm text-muted">
                {formatDimensions(couch.dimensions)}
              </p>
            </div>
            <StatusBadge status={couch.status} />
          </div>
          <p className="font-display mt-4 text-3xl text-deep-sage">
            {formatPrice(couch.priceCents, couch.currency)}
          </p>
        </aside>

        {/* Form */}
        {isAvailable ? (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit(new FormData(e.currentTarget))
            }}
          >
            <p className="text-sm text-muted">
              Bestellt als <strong>{auth.displayName}</strong> ({auth.email})
            </p>

            {error ? (
              <p role="alert" className="rounded-xl bg-ember/15 px-4 py-3 text-sm text-ember">
                {error}
              </p>
            ) : null}

            <label className="block text-sm font-medium">
              Name für die Lieferung
              <input
                name="name"
                type="text"
                required
                defaultValue={auth.displayName ?? ''}
                autoComplete="name"
                className="field mt-1.5"
              />
            </label>
            <label className="block text-sm font-medium">
              Straße &amp; Hausnummer
              <input name="street" type="text" required autoComplete="street-address" className="field mt-1.5" />
            </label>
            <div className="grid grid-cols-[1fr_2fr] gap-4">
              <label className="block text-sm font-medium">
                PLZ
                <input name="zip" type="text" required autoComplete="postal-code" className="field mt-1.5" />
              </label>
              <label className="block text-sm font-medium">
                Ort
                <input name="city" type="text" required autoComplete="address-level2" className="field mt-1.5" />
              </label>
            </div>
            <label className="block text-sm font-medium">
              Telefon (optional, für die Übergabe)
              <input name="phone" type="tel" autoComplete="tel" className="field mt-1.5" />
            </label>
            <label className="block text-sm font-medium">
              Nachricht (optional)
              <textarea
                name="message"
                rows={3}
                maxLength={2000}
                placeholder="Wunschtermin, Etage, Fragen …"
                className="field mt-1.5 resize-y"
              />
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-ember w-full justify-center text-base"
            >
              {isSubmitting ? 'Wird gesendet …' : 'Verbindlich bestellen'}
            </button>
            <p className="text-xs text-muted">
              Mit der Bestellung wird die Couch für dich reserviert. Es
              entstehen keine Zahlungspflichten, bevor wir Preis und Übergabe
              persönlich bestätigt haben.
            </p>
          </form>
        ) : (
          <div className="rounded-2xl border border-line bg-surface-raised p-8">
            <p>
              Dieses Stück ist gerade{' '}
              {couch.status === 'reserved' ? 'reserviert' : 'verkauft'} – die
              Bestellung ist nicht mehr möglich.
            </p>
            <Link to="/couches" className="btn btn-primary mt-6">
              Zur Kollektion
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
