import { requireAdmin } from "~~/server/utils/require-admin"
import { db } from "../../utils/firebase-admin"

const DAY_MS = 24 * 60 * 60 * 1000

function timeAgo(iso: string | undefined): string {
  if (!iso) return '—'
  const diffMs = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diffMs / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(diffMs / DAY_MS)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

function entityName(r: FirebaseFirestore.DocumentData): string {
  if (r.targetType === 'company') return r.companyName ?? 'Unknown company'
  if (r.targetType === 'website') return r.websiteName || r.websiteUrl || 'Unknown website'
  return r.accountName ?? r.accountNumber ?? 'Unknown account'
}

export default defineEventHandler(async (event) => {
    await requireAdmin(event)
  // TODO: real server-side admin check — same as stats.get.ts.
  // Client-side 'admin-only' middleware only guards page navigation.

  const reportsRef = db.collection('reports')
  const snapshot = await reportsRef
    .where('status', '==', 'flagged')
    .orderBy('createdAt', 'desc')
    .limit(200)
    .get()

  const entries = snapshot.docs.map((d) => {
    const r = d.data()
    return {
      id: d.id,
      entity: entityName(r),
      category: r.category ?? '—',
      platform: r.contactPlatform ?? '—',
      reportCount: r.reportCount ?? 1,
      distinctReporterCount: r.distinctReporterCount ?? 1,
      when: timeAgo(r.createdAt),
    }
  })

  return {
    total: entries.length,
    entries,
  }
})