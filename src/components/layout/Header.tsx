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
    <header className="sticky top-0 z-40 bg-deep-sage/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-5 py-3 sm:py-4">
        <Link
          to="/"
          className="font-display text-2xl text-bone transition-colors hover:text-ember"
        >
          Couchgut
        </Link>

        <nav aria-label="Hauptnavigation" className="flex flex-wrap items-center gap-1 sm:gap-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-full px-3 py-2 text-sm font-medium text-bone/85 transition-colors hover:bg-bone/10 hover:text-bone [&.active]:bg-bone/20 [&.active]:text-bone"
            >
              {item.label}
            </Link>
          ))}

          {auth.isIdentified ? (
            <Link
              to="/konto"
              className="ml-1 rounded-full border border-bone/50 px-3 py-2 text-sm font-medium text-bone transition-colors hover:bg-bone hover:text-deep-sage"
            >
              {auth.displayName ?? 'Konto'}
            </Link>
          ) : (
            <Link
              to="/auth"
              className="ml-1 rounded-full border border-bone/50 px-3 py-2 text-sm font-medium text-bone transition-colors hover:bg-bone hover:text-deep-sage"
            >
              Anmelden
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
