import { Link, createFileRoute } from '@tanstack/react-router'
import { Reveal } from '#/components/reveal/Reveal'

export const Route = createFileRoute('/ueber')({
  head: () => ({
    meta: [
      { title: 'Über mich – Couchgut' },
      {
        name: 'description',
        content:
          'Wer hinter Couchgut steht: ein Verkäufer, ein Standard, gerettete Sofas mit Geschichte.',
      },
      { property: 'og:title', content: 'Über mich – Couchgut' },
      {
        property: 'og:description',
        content: 'Ein Verkäufer, ein Standard: Sofas, die ein zweites Wohnzimmer verdienen.',
      },
    ],
  }),
  component: UeberPage,
})

const PRINCIPLES = [
  {
    title: 'Ein Verkäufer, keine Plattform',
    text: 'Couchgut ist kein Marktplatz. Jede Couch geht durch meine Hände: gesichtet, geprüft, aufgearbeitet, fotografiert. Du kaufst direkt bei mir – ohne Zwischenhändler, ohne anonymes Lager.',
  },
  {
    title: 'Ehrliche Beschreibungen',
    text: 'Ich beschreibe, was da ist: Flecken, Patina, Reparaturen. Was du im Foto siehst, steht auch im Text. Wenn etwas nicht perfekt ist, erfährst du es vor dem Kauf, nicht bei der Übergabe.',
  },
  {
    title: 'Nachhaltigkeit als Standard',
    text: 'Ein Sofa besteht aus Holz, Metall, Schaum und Stoff – Material, das längst produziert ist. Jedes gerettete Stück spart Ressourcen und hält gutes Design im Umlauf, statt es auf den Sperrmüll zu geben.',
  },
]

function UeberPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="text-section text-deep-sage">
        Sofas verdienen ein zweites Wohnzimmer.
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-ink/85">
        Hallo, ich bin Philipp. Couchgut ist mein persönlicher
        Second-Hand-Shop für Sofas mit Charakter. Was als Rettung eines
        einzelnen Chesterfields vom Sperrmüll begann, ist heute eine kleine,
        streng kuratierte Kollektion: Stücke, die ich selbst suche, prüfe und
        aufarbeite – und nur dann verkaufe, wenn ich sie auch in mein eigenes
        Wohnzimmer stellen würde.
      </p>

      <div className="mt-14 space-y-10">
        {PRINCIPLES.map((p, i) => (
          <Reveal key={p.title} delay={i * 100}>
            <h2 className="font-display text-2xl text-deep-sage">{p.title}</h2>
            <p className="mt-3 leading-relaxed text-muted">{p.text}</p>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-16 rounded-2xl bg-sage/20 p-8">
        <h2 className="font-display text-2xl text-deep-sage">
          So läuft ein Kauf ab
        </h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-ink/85">
          <li>Couch aussuchen und verbindlich bestellen – ohne Online-Zahlung.</li>
          <li>Ich melde mich innerhalb von 24 Stunden per E-Mail.</li>
          <li>Bezahlung und Übergabe (Abholung oder Lieferung) klären wir persönlich.</li>
        </ol>
        <Link to="/couches" className="btn btn-primary mt-8">
          Zur Kollektion
        </Link>
      </Reveal>
    </div>
  )
}
