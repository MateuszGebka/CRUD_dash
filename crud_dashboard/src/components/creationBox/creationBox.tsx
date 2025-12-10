import type { Campaign } from "../types"
import { useEffect, useState } from "react"
import styles from "./creationBox.module.css"

const MIN_BID = 0.1
const TOWNS = ["Warsaw", "Krakow", "Gdansk", "Wroclaw", "Poznan", "Lublin"]
const KW_SUGGESTIONS = [
  "shoes",
  "t-shirt",
  "sneakers",
  "leather",
  "backpack",
  "handmade",
  "electronics",
  "phone",
  "case",
  "gift",
  "cosmetics",
]

export default function CreationBox({
  onCreate,
  onUpdate,
  editing,
  onCancelEdit,
  balance,
}: {
  onCreate: (c: Omit<Campaign, "id" | "createdAt">) => void
  onUpdate: (id: string, c: Omit<Campaign, "id" | "createdAt">) => void
  editing: Campaign | null
  onCancelEdit: () => void
  balance: number
}) {
  const empty = {
    name: "",
    keywords: [] as string[],
    bid: MIN_BID,
    fund: 0,
    status: "on" as "on" | "off",
    town: TOWNS[0],
    radiusKm: 10,
  }

  const [form, setForm] = useState(() => ({ ...empty }))
  const [kwInput, setKwInput] = useState("")
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name,
        keywords: [...editing.keywords],
        bid: editing.bid,
        fund: editing.fund,
        status: editing.status,
        town: editing.town,
        radiusKm: editing.radiusKm,
      })
      setKwInput("")
      setErrors([])
    } else {
      setForm({ ...empty })
      setKwInput("")
      setErrors([])
    }
  }, [editing])

  const suggestions = KW_SUGGESTIONS.filter(
    (k) => k.includes(kwInput.toLowerCase()) && !form.keywords.includes(k)
  ).slice(0, 6)

  const validate = (): boolean => {
    const e: string[] = []
    if (!form.name.trim()) e.push("Campaign name is required")
    if (form.keywords.length === 0) e.push("At least one keyword is required")
    if (isNaN(form.bid) || form.bid < MIN_BID)
      e.push(`Bid must be >= ${MIN_BID}`)
    if (isNaN(form.fund) || form.fund <= 0)
      e.push("Campaign fund must be greater than 0")
    if (form.fund > balance && editing == null)
      e.push("Not enough Emerald balance to allocate this fund")
    if (form.radiusKm <= 0) e.push("Radius must be greater than 0 km")
    setErrors(e)
    return e.length === 0
  }

  const submit = () => {
    if (!validate()) return
    if (editing) {
      onUpdate(editing.id, form as Omit<Campaign, "id" | "createdAt">)
    } else {
      onCreate(form as Omit<Campaign, "id" | "createdAt">)
      setForm({ ...empty })
      setKwInput("")
    }
  }

  const addKeyword = (kw: string) => {
    if (!kw.trim()) return
    setForm((f) => ({ ...f, keywords: [...f.keywords, kw.trim()] }))
    setKwInput("")
  }

  const removeKeyword = (kw: string) =>
    setForm((f) => ({ ...f, keywords: f.keywords.filter((k) => k !== kw) }))

  return (
    <div className={styles.card_creation_box}>
      <div className={styles.creation_form}>
        <h2>{editing ? "Edit campaign" : "Create campaign"}</h2>

        <label>
          <div>Campaign name *</div>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </label>

        <label>
          <div>Keywords * (type to get suggestions)</div>
          <div>
            <input
              value={kwInput}
              onChange={(e) => setKwInput(e.target.value)}
              placeholder="Type keyword and press Enter or select suggestion"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addKeyword(kwInput)
                }
              }}
            />
            <div className={styles.keyword_suggestions}>
              {kwInput &&
                suggestions.map((s) => (
                  <button key={s} onClick={() => addKeyword(s)}>
                    {s}
                  </button>
                ))}
            </div>
          </div>
          <div>
            {form.keywords.map((k) => (
              <span key={k}>
                {k} <button onClick={() => removeKeyword(k)}>×</button>
              </span>
            ))}
          </div>
        </label>

        <label>
          <div>Bid amount (min {MIN_BID}) *</div>
          <input
            type="number"
            step="0.01"
            value={form.bid}
            onChange={(e) => setForm({ ...form, bid: Number(e.target.value) })}
          />
        </label>

        <label>
          <div>Campaign fund *</div>
          <input
            type="number"
            step="0.01"
            value={form.fund}
            onChange={(e) => setForm({ ...form, fund: Number(e.target.value) })}
          />
          <div>Available: {balance.toFixed(2)}</div>
        </label>

        <label>
          <div>Status *</div>
          <select
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value as any })
            }
          >
            <option value="on">On</option>
            <option value="off">Off</option>
          </select>
        </label>

        <label>
          <div>Town</div>
          <select
            value={form.town}
            onChange={(e) => setForm({ ...form, town: e.target.value })}
          >
            {TOWNS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        <label>
          <div>Radius (km) *</div>
          <input
            type="number"
            value={form.radiusKm}
            onChange={(e) =>
              setForm({ ...form, radiusKm: Number(e.target.value) })
            }
          />
        </label>

        <div>
          <button onClick={submit}>{editing ? "Update" : "Create"}</button>
          {editing ? <button onClick={onCancelEdit}>Cancel</button> : null}
        </div>

        {errors.length > 0 && (
          <div>
            {errors.map((er, i) => (
              <div key={i}>• {er}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
