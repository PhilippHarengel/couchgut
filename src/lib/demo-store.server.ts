import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import type { CouchStatus, Order } from '#/lib/types'

/**
 * File-backed store for demo mode (no Supabase configured).
 * Keeps orders and couch status overrides across dev-server restarts.
 * Never import from client code.
 */
interface DemoStore {
  orders: Order[]
  statusOverrides: Record<string, CouchStatus>
}

// Serverless (Vercel/Lambda): nur /tmp ist beschreibbar. Ephemer pro
// Instanz – für den Demo-Modus akzeptabel, echte Persistenz kommt via Supabase.
const STORE_PATH = process.env.VERCEL
  ? join('/tmp', 'couchgut-demo-store.json')
  : join(process.cwd(), '.data', 'demo-store.json')

const EMPTY_STORE: DemoStore = { orders: [], statusOverrides: {} }

export function readDemoStore(): DemoStore {
  try {
    const raw = readFileSync(STORE_PATH, 'utf8')
    const parsed = JSON.parse(raw) as Partial<DemoStore>
    return {
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
      statusOverrides:
        parsed.statusOverrides && typeof parsed.statusOverrides === 'object'
          ? parsed.statusOverrides
          : {},
    }
  } catch {
    return EMPTY_STORE
  }
}

export function writeDemoStore(store: DemoStore): void {
  mkdirSync(dirname(STORE_PATH), { recursive: true })
  writeFileSync(STORE_PATH, JSON.stringify(store, null, 2))
}
