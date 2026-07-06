import type { GuestIdentity } from '#/lib/types'

const STORAGE_KEY = 'couchgut.guest'

export function getGuestIdentity(): GuestIdentity | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<GuestIdentity>
    if (typeof parsed.name !== 'string' || typeof parsed.email !== 'string') {
      return null
    }
    return { name: parsed.name, email: parsed.email }
  } catch {
    return null
  }
}

export function setGuestIdentity(identity: GuestIdentity): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(identity))
  window.dispatchEvent(new Event('couchgut:auth-changed'))
}

export function clearGuestIdentity(): void {
  window.localStorage.removeItem(STORAGE_KEY)
  window.dispatchEvent(new Event('couchgut:auth-changed'))
}
