import { Link, createFileRoute } from '@tanstack/react-router'
import { CouchCard } from '#/components/couch-card/CouchCard'
import { StatusBadge } from '#/components/couch-card/StatusBadge'
import { Reveal } from '#/components/reveal/Reveal'
import { featuredSlug } from '#/data/couches'
import { listCouches } from '#/lib/couches.functions'
import { formatPrice } from '#/lib/format'

export const Route = createFileRoute('/')({
  loader: () => listCouches(),
  head: () => ({
    meta: [
      { title: 'Couchgut – Vintage Sofas mit Geschichte' },
      {
        name: 'description',
        content:
          'Kuratierte Second-Hand-Sofas mit Geschichte: restauriert, nachhaltig, sofort kaufbar.',
      },
      { property: 'og:title', content: 'Couchgut – Vintage Sofas mit Geschichte' },
      {
        property: 'og:description',
        content: 'Kuratierte Second-Hand-Sofas: restauriert, nachhaltig, mit Geschichte.',
      },
    ],
  }),
  component: Home,
})

const VALUES = [
  {
    title: 'Kuratiert',
    text: 'Jedes Sofa ist eine bewusste Entscheidung. Keine Masse, kein Lager – nur Stücke, hinter denen ich stehe.',
  },
  {
    title: 'Restauriert',
    text: 'Gereinigt, aufgearbeitet, ehrlich beschrieben. Was repariert wurde, steht in der Story – was Patina ist, bleibt Patina.',
  },
  {
    title: 'Nachhaltig',
    text: 'Ein gerettetes Sofa spart im Schnitt über 90 % der Emissionen eines Neukaufs. Gutes Design hält länger als ein Trend.',
  },
]

function Home() {
  const couches = Route.useLoaderData()
  const heroCouch = couches.find((c) => c.slug === featuredSlug) ?? couches[0]
  const featured =
    couches.find((c) => c.status === 'available' && c.slug !== heroCouch?.slug) ??
    couches[1]
  const gridCouches = couches
    .filter((c) => c.slug !== featured?.slug)
    .slice(0, 9)

  return (
    <>
      {/* Hero */}
      <section
        aria-labelledby="hero-heading"
        className="mx-auto max-w-6xl px-5 pt-8 pb-16 lg:pt-12"
      >
        <div className="relative overflow-hidden rounded-3xl shadow-[0_30px_60px_-30px_rgba(31,36,33,0.4)]">
          {heroCouch ? (
            <img
              src={heroCouch.images[0]}
              alt={`${heroCouch.title} – ${heroCouch.style} Sofa in ${heroCouch.color}`}
              width={1600}
              height={900}
              loading="eager"
              fetchPriority="high"
              className="aspect-[16/10] w-full object-cover sm:aspect-[16/9]"
            />
          ) : (
            <div className="aspect-[16/9] w-full bg-sage/30" />
          )}
          <div className="absolute inset-0 flex items-center bg-gradient-to-r from-ink/60 via-ink/25 to-transparent p-5 sm:p-8 lg:p-12">
            <div className="max-w-md rounded-3xl bg-deep-sage/95 p-7 text-bone shadow-[0_20px_50px_-20px_rgba(31,36,33,0.6)] backdrop-blur-sm sm:p-9">
              <p className="mb-4 inline-block rounded-full bg-mist/25 px-4 py-1.5 text-xs font-medium text-mist sm:text-sm">
                Second-Hand · Persönlich kuratiert
              </p>
              <h1 id="hero-heading" className="font-display text-3xl leading-[1.1] sm:text-4xl lg:text-5xl">
                Vintage Sofas mit&nbsp;Geschichte.
              </h1>
              <p className="mt-4 max-w-sm text-sm text-bone/80 sm:text-base">
                Handverlesene Second-Hand-Couches – restauriert, ehrlich
                beschrieben und bereit für ihr zweites Wohnzimmer.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/couches" className="btn btn-ember">
                  Kollektion ansehen
                </Link>
                <Link
                  to="/ueber"
                  className="btn border-bone/50 text-bone hover:bg-bone hover:text-deep-sage"
                >
                  Warum Second-Hand?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured piece */}
      {featured ? (
        <section
          aria-labelledby="featured-heading"
          className="bg-deep-sage py-20 text-bone"
        >
          <Reveal className="mx-auto grid max-w-6xl items-center gap-10 px-5 lg:grid-cols-[1.15fr_1fr]">
            <div className="img-zoom overflow-hidden rounded-3xl">
              <img
                src={featured.images[1] ?? featured.images[0]}
                alt={`${featured.title} – ${featured.style} Sofa in ${featured.color}`}
                width={1200}
                height={900}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="mb-3 text-sm font-semibold tracking-widest text-mist uppercase">
                Aktuelles Highlight
              </p>
              <h2 id="featured-heading" className="text-section">
                {featured.title}
              </h2>
              <p className="mt-4 max-w-md text-bone/80">{featured.description}</p>
              <p className="font-display mt-6 text-4xl">
                {formatPrice(featured.priceCents, featured.currency)}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to="/couches/$id"
                  params={{ id: featured.slug }}
                  className="btn btn-ember"
                >
                  Stück ansehen
                </Link>
                <StatusBadge status={featured.status} />
              </div>
            </div>
          </Reveal>
        </section>
      ) : null}

      {/* Collection grid */}
      <section
        aria-labelledby="collection-heading"
        className="mx-auto max-w-6xl px-5 py-20"
      >
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="collection-heading" className="text-section text-deep-sage">
              Die Kollektion
            </h2>
            <p className="mt-2 text-muted">
              Jedes Stück einmalig. Wenn es weg ist, ist es weg.
            </p>
          </div>
          <Link to="/couches" className="btn btn-ghost">
            Alle Couches
          </Link>
        </Reveal>
        <ul className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {gridCouches.map((couch, i) => (
            <Reveal as="li" key={couch.id} delay={(i % 3) * 90}>
              <CouchCard couch={couch} />
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-12 grid items-center gap-6 rounded-2xl bg-deep-sage px-7 py-8 text-bone sm:grid-cols-[auto_1fr_auto] sm:gap-8">
          <p className="font-display text-5xl leading-none sm:text-6xl">−90&nbsp;%</p>
          <p className="max-w-md text-sm leading-relaxed text-bone/80 sm:text-base">
            Emissionen gegenüber einem Neukauf. Kuratiert, restauriert, ehrlich
            beschrieben — Patina bleibt Patina.
          </p>
          <Link
            to="/ueber"
            className="btn justify-self-start border-bone/50 text-bone hover:bg-bone hover:text-deep-sage sm:justify-self-end"
          >
            Mehr erfahren
          </Link>
        </Reveal>
      </section>

      {/* Story strip */}
      <section aria-labelledby="values-heading" className="bg-sage/20 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 id="values-heading" className="sr-only">
            Werte
          </h2>
          <ul className="grid gap-10 md:grid-cols-3">
            {VALUES.map((value, i) => (
              <Reveal as="li" key={value.title} delay={i * 120}>
                <p className="font-display text-2xl text-deep-sage">
                  {value.title}
                </p>
                <p className="mt-3 text-muted">{value.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
