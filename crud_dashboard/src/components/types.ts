export type Campaign = {
  id: string
  name: string
  keywords: string[]
  bid: number
  fund: number
  status: "on" | "off"
  town: string
  radiusKm: number
  createdAt: string
}
