import type { Campaign } from "../types"
import styles from "./campaignTile.module.css"
export default function CampaignTile({
  c,
  onEdit,
  onDelete,
}: {
  c: Campaign
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div className={styles.campaignTile}>
      <div>
        <div>
          <h3>{c.name}</h3>
          <div>
            {c.town} • {c.radiusKm} km •{" "}
            {c.status === "on" ? "Running" : "Paused"}
          </div>
        </div>
        <div>
          {c.fund.toFixed(2)} <span>EM</span>
        </div>
      </div>

      <div>
        {c.keywords.map((k) => (
          <span key={k}>{k}</span>
        ))}
      </div>

      <div>
        <div>Bid: {c.bid.toFixed(2)}</div>
        <div>
          <button onClick={onEdit}>Edit</button>
          <button
            onClick={() => {
              if (confirm("Delete this campaign?")) onDelete()
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
