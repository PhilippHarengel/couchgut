import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import { Header } from '#/components/layout/Header'
import { Footer } from '#/components/layout/Footer'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Couchgut – Vintage Sofas mit Geschichte' },
      {
        name: 'description',
        content:
          'Kuratierte Second-Hand-Sofas: restauriert, nachhaltig, mit Geschichte. Klare Preise, direkter Kauf.',
      },
      { property: 'og:title', content: 'Couchgut – Vintage Sofas mit Geschichte' },
      {
        property: 'og:description',
        content:
          'Kuratierte Second-Hand-Sofas: restauriert, nachhaltig, mit Geschichte.',
      },
    ],
    links: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Patua+One&family=Inter:wght@400;500;600;700&display=swap',
      },
      { rel: 'stylesheet', href: appCss },
    ],
  }),
  shellComponent: RootDocument,
  component: RootLayout,
})

function RootLayout() {
  return (
    <>
      <Header />
      <main className="min-h-[60vh]">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
