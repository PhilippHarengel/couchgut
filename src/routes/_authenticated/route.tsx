import { Outlet, createFileRoute, useLocation, useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAuth } from '#/hooks/useAuth'

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
})

/**
 * Client-side guard: identity lives in the browser (Supabase session or
 * guest identity in localStorage), so the check happens after hydration.
 * Data access is enforced server-side in the server functions / RLS.
 */
function AuthenticatedLayout() {
  const auth = useAuth()
  const router = useRouter()
  const location = useLocation()

  useEffect(() => {
    if (auth.isReady && !auth.isIdentified) {
      router.navigate({
        to: '/auth',
        search: { redirect: location.pathname },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.isReady, auth.isIdentified])

  if (!auth.isReady) {
    return (
      <div className="mx-auto max-w-md px-5 py-24 text-center text-muted">
        Einen Moment …
      </div>
    )
  }

  if (!auth.isIdentified) return null

  return <Outlet />
}
