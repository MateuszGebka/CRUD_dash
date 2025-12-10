import { useEffect, useState } from "react"
import "./App.css"
import CreationBox from "./components/creationBox/creationBox"
import CampaignList from "./components/campaignList/campaignList"

type Campaign = {
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

const STORAGE_KEY = "crud_campaigns_v1"
const STORAGE_BALANCE = "crud_balance_v1"

const uid = () => Math.random().toString(36).slice(2, 9)

export default function App() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })
  const [balance, setBalance] = useState<number>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_BALANCE)
      return raw ? Number(raw) : 1000
    } catch {
      return 1000
    }
  })
  const [editing, setEditing] = useState<Campaign | null>(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns))
  }, [campaigns])
  useEffect(() => {
    localStorage.setItem(STORAGE_BALANCE, String(balance))
  }, [balance])

  const createCampaign = (c: Omit<Campaign, "id" | "createdAt">) => {
    const id = uid()
    const createdAt = new Date().toISOString()
    const campaign: Campaign = { id, createdAt, ...c }
    setCampaigns((s) => [campaign, ...s])
    setBalance((b) => b - c.fund)
  }

  const updateCampaign = (
    id: string,
    updated: Omit<Campaign, "id" | "createdAt">
  ) => {
    setCampaigns((s) => {
      const old = s.find((x) => x.id === id)!
      if (!old) return s
      const fundDelta = updated.fund - old.fund
      setBalance((bal) => bal - fundDelta)
      return s.map((x) => (x.id === id ? { ...x, ...updated } : x))
    })
    setEditing(null)
  }

  const deleteCampaign = (id: string) => {
    setCampaigns((s) => {
      const old = s.find((x) => x.id === id)
      if (old) {
        setBalance((b) => b + old.fund)
      }
      return s.filter((x) => x.id !== id)
    })
  }

  return (
    <div className="app-root">
      <header className="topbar">
        <h1>Campaigns Dashboard</h1>
        <div className="balance">
          Emerald balance: <strong>{balance.toFixed(2)}</strong>
        </div>
      </header>

      <main className="container">
        <aside className="creation-column">
          <CreationBox
            onCreate={createCampaign}
            onUpdate={updateCampaign}
            editing={editing}
            onCancelEdit={() => setEditing(null)}
            balance={balance}
          />
        </aside>

        <section className="list-column">
          <CampaignList
            campaigns={campaigns}
            onEdit={(c) => setEditing(c)}
            onDelete={deleteCampaign}
          />
        </section>
      </main>
    </div>
  )
}
