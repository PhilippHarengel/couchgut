import { Link } from '@tanstack/react-router'
import { useAuth } from '#/hooks/useAuth'

const NAV_ITEMS = [
  { to: '/couches', label: 'Kollektion' },
  { to: '/ueber', label: 'Über' },
  { to: '/kontakt', label: 'Kontakt' },
] as const

export function Header() {
  const auth = useAuth()

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bone/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-5 py-3 sm:py-4">
        <Link
          to="/"
          className="font-display text-2xl text-deep-sage transition-colors hover:text-ember"
        >
          Couchgut
        </Link>

        <nav aria-label="Hauptnavigation" className="flex flex-wrap items-center gap-1 sm:gap-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-full px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-sage/20 [&.active]:bg-sage/25 [&.active]:text-deep-sage"
            >
              {item.label}
            </Link>
          ))}

          {auth.isIdentified ? (
            <Link
              to="/konto"
              className="ml-1 rounded-full border border-deep-sage px-3 py-2 text-sm font-medium text-deep-sage transition-colors hover:bg-deep-sage hover:text-bone"
            >
              {auth.displayName ?? 'Konto'}
            </Link>
          ) : (
            <Link
              to="/auth"
              className="ml-1 rounded-full border border-deep-sage px-3 py-2 text-sm font-medium text-deep-sage transition-colors hover:bg-deep-sage hover:text-bone"
            >
              Anmelden
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
