import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { getSupabase } from '#/lib/supabase'
import { clearGuestIdentity, getGuestIdentity } from '#/lib/guest'
import type { GuestIdentity } from '#/lib/types'

export interface AuthState {
  /** Supabase session, when real auth is configured and logged in. */
  session: Session | null
  /** Guest identity (name + email), when the user chose guest checkout. */
  guest: GuestIdentity | null
  /** True once the client has resolved the initial auth state. */
  isReady: boolean
  /** Session or guest present. */
  isIdentified: boolean
  displayName: string | null
  email: string | null
  signOut: () => Promise<void>
}

export function useAuth(): AuthState {
  const [session, setSession] = useState<Session | null>(null)
  const [guest, setGuest] = useState<GuestIdentity | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const supabase = getSupabase()
    setGuest(getGuestIdentity())

    const onGuestChange = () => setGuest(getGuestIdentity())
    window.addEventListener('couchgut:auth-changed', onGuestChange)

    if (!supabase) {
      setIsReady(true)
      return () => {
        window.removeEventListener('couchgut:auth-changed', onGuestChange)
      }
    }

    supabase.auth
      .getSession()
      .then(({ data }) => {
        setSession(data.session)
      })
      .finally(() => setIsReady(true))

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next)
    })

    return () => {
      sub.subscription.unsubscribe()
      window.removeEventListener('couchgut:auth-changed', onGuestChange)
    }
  }, [])

  const signOut = async () => {
    const supabase = getSupabase()
    if (supabase) await supabase.auth.signOut()
    clearGuestIdentity()
  }

  return {
    session,
    guest,
    isReady,
    isIdentified: Boolean(session ?? guest),
    displayName:
      session?.user.user_metadata?.display_name ??
      session?.user.email ??
      guest?.name ??
      null,
    email: session?.user.email ?? guest?.email ?? null,
    signOut,
  }
}
