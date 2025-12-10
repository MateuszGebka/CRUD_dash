import type { Campaign } from "../types"
import CampaignTile from "../campaignTile/campaignTile"
import styles from "./campaignList.module.css"

export default function CampaignList({
  campaigns,
  onEdit,
  onDelete,
}: {
  campaigns: Campaign[]
  onEdit: (c: Campaign) => void
  onDelete: (id: string) => void
}) {
  if (campaigns.length === 0) {
    return <div>No campaigns yet — create the first one!</div>
  }
  return (
    <div className={styles.campaignList}>
      {campaigns.map((c) => (
        <CampaignTile
          key={c.id}
          c={c}
          onEdit={() => onEdit(c)}
          onDelete={() => onDelete(c.id)}
        />
      ))}
    </div>
  )
}
