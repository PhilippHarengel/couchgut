export type CouchStatus = 'available' | 'reserved' | 'sold'

export interface CouchDimensions {
  w: number
  d: number
  h: number
  seatH: number
}

export interface Couch {
  id: string
  title: string
  slug: string
  priceCents: number
  currency: string
  status: CouchStatus
  description: string
  dimensions: CouchDimensions
  material: string
  color: string
  style: string
  year: number
  condition: string
  story: string
  images: string[]
  createdAt: string
}

export type OrderStatus = 'pending' | 'confirmed' | 'cancelled'

export interface ShippingAddress {
  name: string
  street: string
  zip: string
  city: string
  phone?: string
}

export interface Order {
  id: string
  couchId: string
  buyerUserId: string | null
  guestEmail: string | null
  guestName: string | null
  shippingAddress: ShippingAddress
  message: string | null
  status: OrderStatus
  createdAt: string
}

export interface GuestIdentity {
  name: string
  email: string
}
