import type { Couch } from '#/lib/types'

const img = (slug: string, count: number) =>
  Array.from({ length: count }, (_, i) => `/images/couches/${slug}-${i + 1}.jpg`)

/**
 * Seed-Kollektion. Wird verwendet, solange kein Supabase-Backend
 * konfiguriert ist (siehe src/lib/supabase.ts). IDs sind stabil,
 * damit Bestellungen im Demo-Modus referenzierbar bleiben.
 *
 * Fotos: Unsplash (Unsplash-Lizenz, kommerzielle Nutzung erlaubt),
 * lokal unter public/images/couches/.
 */
export const seedCouches: Couch[] = [
  {
    id: 'c1',
    title: 'Velvet Forest',
    slug: 'velvet-forest-3er',
    priceCents: 89000,
    currency: 'EUR',
    status: 'available',
    description:
      'Dreisitzer in tiefem Tannengrün-Samt auf konischen Holzbeinen. Neu aufgepolstert, Bezug professionell gereinigt.',
    dimensions: { w: 218, d: 92, h: 84, seatH: 44 },
    material: 'Samt (Baumwolle/Polyester)',
    color: 'Tannengrün',
    style: 'Mid-Century',
    year: 2016,
    condition: 'Sehr gut, aufbereitet',
    story:
      'Erstbesitz aus einem Münchner Altbau, dort stand er im wenig genutzten Salon. Die Kissen wurden neu gefüllt, der Samt tiefengereinigt – die klare Silhouette spricht für sich.',
    images: img('velvet-forest-3er', 1),
    createdAt: '2026-05-02T10:00:00Z',
  },
  {
    id: 'c2',
    title: 'Terracotta Club',
    slug: 'terracotta-club-2er',
    priceCents: 64000,
    currency: 'EUR',
    status: 'available',
    description:
      'Kompakter Zweisitzer in Terracotta-Leder auf filigranem Metallgestell. Klare Linien, warme Ausstrahlung – perfekt für kleine Räume.',
    dimensions: { w: 168, d: 88, h: 78, seatH: 43 },
    material: 'Glattleder',
    color: 'Terracotta',
    style: 'Zeitgenössisch',
    year: 2019,
    condition: 'Gut, gepflegte Patina',
    story:
      'Aus einer Kölner Designagentur, wo er im Empfangsbereich stand. Das Leder wurde rückgefettet und handpoliert – die leichte Patina an den Sitzflächen erzählt von guten Gesprächen. Zweites Bild: Wohnbeispiel mit passendem Sessel (nicht Teil des Angebots).',
    images: img('terracotta-club-2er', 2),
    createdAt: '2026-05-10T10:00:00Z',
  },
  {
    id: 'c3',
    title: 'Nebelblau Zweisitzer',
    slug: 'nebel-zweisitzer',
    priceCents: 72000,
    currency: 'EUR',
    status: 'reserved',
    description:
      'Gemütlicher Zweisitzer in graublauem Webstoff mit Knopfheftung im Rücken. Leseinsel, Nachmittagsschlaf-Platz, Lieblingsstück.',
    dimensions: { w: 200, d: 90, h: 82, seatH: 42 },
    material: 'Webstoff (Wollmischung)',
    color: 'Nebelblau',
    style: 'Skandinavisch',
    year: 2014,
    condition: 'Sehr gut',
    story:
      'Aus einem Hamburger Stadthaus, erste Hand. Der Bezug wurde schonend gereinigt, das Buchengestell geprüft und neu verschraubt. Zweites Bild: Wohnbeispiel.',
    images: img('nebel-zweisitzer', 2),
    createdAt: '2026-05-18T10:00:00Z',
  },
  {
    id: 'c4',
    title: 'Rauchgrau Salon',
    slug: 'rauchgrau-salon',
    priceCents: 95000,
    currency: 'EUR',
    status: 'available',
    description:
      'Eleganter Dreisitzer in Rauchgrau mit geknöpfter Rückenlehne und Holzbeinen. Klassische Anmutung, moderner Komfort.',
    dimensions: { w: 212, d: 94, h: 86, seatH: 44 },
    material: 'Strukturgewebe',
    color: 'Rauchgrau',
    style: 'Klassisch / Knopfheftung',
    year: 2015,
    condition: 'Sehr gut, neue Kissenfüllung',
    story:
      'Stand in einer Berliner Anwaltskanzlei im Besprechungszimmer – repräsentativ, aber kaum benutzt. Kissenfüllungen komplett erneuert, sitzt straff und aufrecht.',
    images: img('rauchgrau-salon', 1),
    createdAt: '2026-05-25T10:00:00Z',
  },
  {
    id: 'c5',
    title: 'Cognac Sixty',
    slug: 'cognac-sixty',
    priceCents: 149000,
    currency: 'EUR',
    status: 'available',
    description:
      'Dreisitzer in Cognac-Leder auf Nussbaumgestell im Mid-Century-Stil. Warmes Anilin-Leder, das mit jedem Jahr schöner wird.',
    dimensions: { w: 210, d: 95, h: 76, seatH: 45 },
    material: 'Anilin-Leder',
    color: 'Cognac',
    style: 'Mid-Century',
    year: 2017,
    condition: 'Gut, gepflegte Gebrauchsspuren',
    story:
      'Aus einem Architekturbüro in Wien. Das Leder wurde rückgefettet und handpoliert – jede Falte sitzt, wo sie hingehört. Die weiteren Bilder zeigen ihn beim Vorbesitzer in zwei Räumen.',
    images: img('cognac-sixty', 3),
    createdAt: '2026-06-01T10:00:00Z',
  },
  {
    id: 'c6',
    title: 'Bone Curve',
    slug: 'bone-curve',
    priceCents: 118000,
    currency: 'EUR',
    status: 'available',
    description:
      'Geschwungenes Ecksofa in cremefarbenem Bouclé. Runde Formen, helle Ruhe, große Wirkung – das Zentrum jedes Wohnzimmers.',
    dimensions: { w: 260, d: 160, h: 72, seatH: 41 },
    material: 'Bouclé (Wolle)',
    color: 'Creme / Bone',
    style: 'Organic Modern',
    year: 2021,
    condition: 'Wie neu, tiefengereinigt',
    story:
      'Aus einem Neubau-Penthouse in Frankfurt – die Besitzer sind ins Ausland gezogen, das Sofa passte nicht in den Container. Professionell tiefengereinigt, fleckenfrei. Zweites Bild: Wohnbeispiel.',
    images: img('bone-curve', 2),
    createdAt: '2026-06-05T10:00:00Z',
  },
  {
    id: 'c7',
    title: 'Loft Modular',
    slug: 'loft-modular',
    priceCents: 119000,
    currency: 'EUR',
    status: 'sold',
    description:
      'Breites Lounge-Sofa in Steingrau mit tiefen Sitzen und Lederkissen-Akzenten. Bodennah, großzügig, gemacht für lange Abende.',
    dimensions: { w: 280, d: 105, h: 68, seatH: 38 },
    material: 'Webstoff',
    color: 'Steingrau',
    style: 'Lounge / Low',
    year: 2018,
    condition: 'Sehr gut',
    story:
      'Aus einem Loft in Leipzig. Der Stoff wurde aufgebürstet und wirkt fast neu – ein Sofa, auf dem ganze Wochenenden verschwinden.',
    images: img('loft-modular', 1),
    createdAt: '2026-06-10T10:00:00Z',
  },
  {
    id: 'c8',
    title: 'Sonnengelb Zweisitzer',
    slug: 'sonnengelb-zweisitzer',
    priceCents: 42000,
    currency: 'EUR',
    status: 'available',
    description:
      'Kompakter Zweisitzer in kräftigem Gelb. Der Farbtupfer, der ein ganzes Zimmer aufweckt – abnehmbarer, waschbarer Bezug.',
    dimensions: { w: 160, d: 85, h: 80, seatH: 44 },
    material: 'Webstoff (abnehmbar)',
    color: 'Sonnengelb',
    style: 'Modern / Kompakt',
    year: 2020,
    condition: 'Sehr gut, Bezug frisch gewaschen',
    story:
      'Stand in einem Fotostudio in Berlin als Requisite – mehr fotografiert als benutzt. Der Bezug wurde frisch gewaschen, das Gestell ist tadellos.',
    images: img('sonnengelb-zweisitzer', 1),
    createdAt: '2026-06-15T10:00:00Z',
  },
  {
    id: 'c9',
    title: 'Wolke',
    slug: 'wolke-2er',
    priceCents: 68000,
    currency: 'EUR',
    status: 'available',
    description:
      'Weicher Zweisitzer in Hellgrau mit tiefen Kissen. Unaufgeregt, unglaublich bequem – das Sofa für Sonntagnachmittage.',
    dimensions: { w: 180, d: 95, h: 78, seatH: 42 },
    material: 'Leinenmischung',
    color: 'Hellgrau',
    style: 'Scandi Cosy',
    year: 2019,
    condition: 'Sehr gut, gereinigt',
    story:
      'Aus einer kleinen Altbauwohnung in Freiburg – die Besitzerin hat sich räumlich verkleinert. Schonend gereinigt, Kissen neu aufgeschüttelt, sofort einzugsbereit.',
    images: img('wolke-2er', 1),
    createdAt: '2026-06-20T10:00:00Z',
  },
]

export const featuredSlug = 'cognac-sixty'
