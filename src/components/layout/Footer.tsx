import { Link } from '@tanstack/react-router'

export function Footer() {
  return (
    <footer className="mt-24 bg-ink text-bone">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-3">
        <div>
          <p className="font-display text-2xl">Couchgut</p>
          <p className="mt-3 max-w-xs text-sm text-bone/70">
            Kuratierte Second-Hand-Sofas mit Geschichte. Ein Verkäufer, ein
            Standard: Stücke, die ich selbst ins Wohnzimmer stellen würde.
          </p>
        </div>
        <nav aria-label="Footer" className="text-sm">
          <p className="mb-3 font-semibold tracking-wide text-bone/60 uppercase">
            Seiten
          </p>
          <ul className="space-y-2">
            <li>
              <Link to="/couches" className="hover:text-sage">
                Kollektion
              </Link>
            </li>
            <li>
              <Link to="/ueber" className="hover:text-sage">
                Über &amp; Nachhaltigkeit
              </Link>
            </li>
            <li>
              <Link to="/kontakt" className="hover:text-sage">
                Kontakt &amp; FAQ
              </Link>
            </li>
            <li>
              <Link to="/kontakt" hash="impressum" className="hover:text-sage">
                Impressum
              </Link>
            </li>
          </ul>
        </nav>
        <div className="text-sm">
          <p className="mb-3 font-semibold tracking-wide text-bone/60 uppercase">
            Kontakt
          </p>
          <ul className="space-y-2 text-bone/80">
            <li>
              <a href="mailto:hallo@couchgut.de" className="hover:text-sage">
                hallo@couchgut.de
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com"
                rel="noreferrer noopener"
                target="_blank"
                className="hover:text-sage"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-bone/10 py-5 text-center text-xs text-bone/50">
        © {new Date().getFullYear()} Couchgut · Second-Hand mit Geschichte
      </div>
    </footer>
  )
}
