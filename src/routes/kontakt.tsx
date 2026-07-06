import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/kontakt')({
  head: () => ({
    meta: [
      { title: 'Kontakt & FAQ – Couchgut' },
      {
        name: 'description',
        content: 'Fragen zu Couches, Lieferung oder Abholung? Kontakt und häufige Fragen.',
      },
      { property: 'og:title', content: 'Kontakt & FAQ – Couchgut' },
      { property: 'og:description', content: 'Kontakt und häufige Fragen zu Couchgut.' },
    ],
  }),
  component: KontaktPage,
})

const FAQ = [
  {
    q: 'Wie funktioniert der Kauf ohne Online-Zahlung?',
    a: 'Du bestellst verbindlich über die Website, die Couch wird für dich reserviert. Ich melde mich innerhalb von 24 Stunden per E-Mail, dann klären wir Bezahlung (Überweisung oder bar bei Übergabe) und den Termin.',
  },
  {
    q: 'Liefert ihr oder muss ich abholen?',
    a: 'Beides möglich. Abholung ist kostenlos, Lieferung organisiere ich je nach Entfernung gegen Aufpreis – der genaue Betrag steht fest, bevor du dich entscheidest.',
  },
  {
    q: 'Kann ich eine Couch vorher ansehen?',
    a: 'Ja, gern. Schreib mir einfach eine E-Mail mit deinem Wunschstück, dann machen wir einen Besichtigungstermin aus.',
  },
  {
    q: 'Was heißt „restauriert" genau?',
    a: 'Je nach Stück: professionelle Reinigung, neue Kissenfüllungen, aufgearbeitete Holzteile, neu verleimt oder neu bezogen. Was gemacht wurde, steht immer in der Story der jeweiligen Couch.',
  },
  {
    q: 'Gibt es eine Gewährleistung?',
    a: 'Gebrauchte Möbel verkaufe ich als Privatverkäufer unter Ausschluss der Sachmängelhaftung – dafür beschreibe ich jeden Makel ehrlich und du kannst jedes Stück vor dem Kauf ansehen.',
  },
]

function KontaktPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="text-section text-deep-sage">Kontakt</h1>
      <p className="mt-4 text-lg text-ink/85">
        Am schnellsten erreichst du mich per E-Mail:{' '}
        <a
          href="mailto:hallo@couchgut.de"
          className="font-semibold text-ember underline-offset-4 hover:underline"
        >
          hallo@couchgut.de
        </a>
      </p>
      <p className="mt-2 text-muted">
        Ich antworte in der Regel innerhalb von 24 Stunden – auch am Wochenende.
      </p>

      <h2 className="font-display mt-14 text-2xl text-deep-sage">
        Häufige Fragen
      </h2>
      <div className="mt-6 space-y-3">
        {FAQ.map((item) => (
          <details
            key={item.q}
            className="group rounded-2xl border border-line bg-surface-raised p-5 open:bg-sage/10"
          >
            <summary className="cursor-pointer font-semibold marker:text-deep-sage">
              {item.q}
            </summary>
            <p className="mt-3 leading-relaxed text-muted">{item.a}</p>
          </details>
        ))}
      </div>

      <section id="impressum" aria-labelledby="impressum-heading" className="mt-16">
        <h2 id="impressum-heading" className="font-display text-2xl text-deep-sage">
          Impressum
        </h2>
        <address className="mt-4 text-sm leading-relaxed text-muted not-italic">
          Couchgut · Philipp Harengel
          <br />
          Musterstraße 1, 00000 Musterstadt
          <br />
          hallo@couchgut.de
        </address>
        <p className="mt-2 text-xs text-muted">
          (Platzhalter – vor dem Livegang mit vollständigen Pflichtangaben ersetzen.)
        </p>
      </section>
    </div>
  )
}
