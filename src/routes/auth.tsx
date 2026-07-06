import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { useAuth } from '#/hooks/useAuth'
import { setGuestIdentity } from '#/lib/guest'
import { getSupabase, isSupabaseConfigured } from '#/lib/supabase'

const searchSchema = z.object({
  redirect: z.string().optional().catch(undefined),
})

export const Route = createFileRoute('/auth')({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: 'Anmelden – Couchgut' },
      {
        name: 'description',
        content: 'Login, Registrierung oder Gast-Kauf bei Couchgut.',
      },
      { property: 'og:title', content: 'Anmelden – Couchgut' },
      { property: 'og:description', content: 'Login, Registrierung oder Gast-Kauf.' },
    ],
  }),
  component: AuthPage,
})

type AuthTab = 'login' | 'register' | 'guest'

const TABS: { id: AuthTab; label: string }[] = [
  { id: 'login', label: 'Login' },
  { id: 'register', label: 'Registrieren' },
  { id: 'guest', label: 'Als Gast' },
]

function AuthPage() {
  const { redirect } = Route.useSearch()
  const router = useRouter()
  const auth = useAuth()
  const [tab, setTab] = useState<AuthTab>(isSupabaseConfigured ? 'login' : 'guest')
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // redirect stems from our own links (/checkout/…); guard against open redirects.
  const safeRedirect =
    redirect && redirect.startsWith('/') && !redirect.startsWith('//')
      ? redirect
      : '/konto'

  const goNext = () => {
    router.history.push(safeRedirect)
  }

  const handleAuthSubmit = async (form: FormData, mode: 'login' | 'register') => {
    const supabase = getSupabase()
    if (!supabase) {
      setError(
        'Login ist noch nicht verbunden (Supabase fehlt). Nutze den Gast-Kauf.',
      )
      return
    }
    const email = String(form.get('email') ?? '').trim()
    const password = String(form.get('password') ?? '')
    if (!email || password.length < 8) {
      setError('E-Mail und Passwort (mind. 8 Zeichen) angeben.')
      return
    }

    setIsSubmitting(true)
    setError(null)
    try {
      if (mode === 'login') {
        const { error: err } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (err) throw err
        goNext()
      } else {
        const displayName = String(form.get('name') ?? '').trim()
        const { data, error: err } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { display_name: displayName } },
        })
        if (err) throw err
        if (data.session) {
          goNext()
        } else {
          setNotice('Fast geschafft – bitte bestätige deine E-Mail-Adresse.')
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Anmeldung fehlgeschlagen.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogle = async () => {
    const supabase = getSupabase()
    if (!supabase) {
      setError(
        'Google-Login ist noch nicht verbunden (Supabase fehlt). Nutze den Gast-Kauf.',
      )
      return
    }
    setError(null)
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}${safeRedirect}`,
      },
    })
    if (err) setError(err.message)
  }

  const handleGuest = (form: FormData) => {
    const name = String(form.get('name') ?? '').trim()
    const email = String(form.get('email') ?? '').trim()
    const parsed = z
      .object({ name: z.string().min(2), email: z.string().email() })
      .safeParse({ name, email })
    if (!parsed.success) {
      setError('Bitte Name und gültige E-Mail angeben.')
      return
    }
    setGuestIdentity(parsed.data)
    goNext()
  }

  useEffect(() => {
    if (auth.isReady && auth.session) {
      router.history.push(safeRedirect)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.isReady, auth.session])

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <h1 className="text-section text-deep-sage">Willkommen</h1>
      <p className="mt-2 text-muted">
        {redirect?.startsWith('/checkout')
          ? 'Kurz identifizieren, dann geht es direkt zur Bestellung.'
          : 'Melde dich an oder kauf einfach als Gast.'}
      </p>

      <div
        role="tablist"
        aria-label="Anmeldeart"
        className="mt-8 grid grid-cols-3 rounded-full border border-line bg-surface-raised p-1"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={tab === t.id}
            onClick={() => {
              setTab(t.id)
              setError(null)
              setNotice(null)
            }}
            className={`rounded-full px-3 py-2 text-sm font-medium transition-colors ${
              tab === t.id
                ? 'bg-deep-sage text-bone'
                : 'text-ink hover:bg-sage/20'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {!isSupabaseConfigured && tab !== 'guest' ? (
        <p className="mt-6 rounded-xl bg-mist/40 px-4 py-3 text-sm">
          Login/Registrierung werden aktiviert, sobald das Cloud-Backend
          verbunden ist. Bis dahin funktioniert der <strong>Gast-Kauf</strong>.
        </p>
      ) : null}

      {error ? (
        <p role="alert" className="mt-6 rounded-xl bg-ember/15 px-4 py-3 text-sm text-ember">
          {error}
        </p>
      ) : null}
      {notice ? (
        <p role="status" className="mt-6 rounded-xl bg-sage/20 px-4 py-3 text-sm text-deep-sage">
          {notice}
        </p>
      ) : null}

      {tab === 'login' ? (
        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            handleAuthSubmit(new FormData(e.currentTarget), 'login')
          }}
        >
          <label className="block text-sm font-medium">
            E-Mail
            <input name="email" type="email" autoComplete="email" required className="field mt-1.5" />
          </label>
          <label className="block text-sm font-medium">
            Passwort
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              minLength={8}
              className="field mt-1.5"
            />
          </label>
          <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full justify-center">
            {isSubmitting ? 'Einen Moment …' : 'Einloggen'}
          </button>
          <button type="button" onClick={handleGoogle} className="btn btn-ghost w-full justify-center">
            Mit Google anmelden
          </button>
        </form>
      ) : null}

      {tab === 'register' ? (
        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            handleAuthSubmit(new FormData(e.currentTarget), 'register')
          }}
        >
          <label className="block text-sm font-medium">
            Name
            <input name="name" type="text" autoComplete="name" required className="field mt-1.5" />
          </label>
          <label className="block text-sm font-medium">
            E-Mail
            <input name="email" type="email" autoComplete="email" required className="field mt-1.5" />
          </label>
          <label className="block text-sm font-medium">
            Passwort
            <input
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              className="field mt-1.5"
            />
          </label>
          <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full justify-center">
            {isSubmitting ? 'Einen Moment …' : 'Konto anlegen'}
          </button>
        </form>
      ) : null}

      {tab === 'guest' ? (
        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            handleGuest(new FormData(e.currentTarget))
          }}
        >
          <p className="text-sm text-muted">
            Kein Passwort nötig – nur Name und E-Mail für die Bestellung.
          </p>
          <label className="block text-sm font-medium">
            Name
            <input name="name" type="text" autoComplete="name" required className="field mt-1.5" />
          </label>
          <label className="block text-sm font-medium">
            E-Mail
            <input name="email" type="email" autoComplete="email" required className="field mt-1.5" />
          </label>
          <button type="submit" className="btn btn-ember w-full justify-center">
            Als Gast fortfahren
          </button>
        </form>
      ) : null}
    </div>
  )
}
