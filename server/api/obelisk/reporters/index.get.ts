// server/api/obelisk/reporters/index.get.ts
import { db } from "../../../utils/firebase-admin"

function timeAgo(iso: string | undefined): string {
  if (!iso) return '—'
  const diffMs = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diffMs / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(diffMs / 86400000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

export default defineEventHandler(async (event) => {
  // requireAdmin(event)

  const reportsRef = db.collection('reports')
  const strikesRef = db.collection('reporter_strikes')
  const blocksRef = db.collection('reporter_blocks')

  const [reportsSnap, strikesSnap, blocksSnap] = await Promise.all([
    reportsRef.get(),
    strikesRef.orderBy('createdAt', 'desc').get(),
    blocksRef.get(),
  ])

  // For every fingerprint, track: which reports it touched, and the most
  // recent ipHash we've seen it paired with (from reporterMeta) — that
  // pairing is what strike/block actions key off of.
  const reportsByFingerprint = new Map<string, Array<Record<string, unknown>>>()
  const latestIpHashByFingerprint = new Map<string, string>()

  for (const doc of reportsSnap.docs) {
    const data = doc.data()
    const meta: Array<{ fingerprint: string; ipHash: string; submittedAt: string }> = data.reporterMeta ?? []

    for (const m of meta) {
      const list = reportsByFingerprint.get(m.fingerprint) ?? []
      list.push({
        id: doc.id,
        entity: data.companyName ?? data.websiteUrl ?? data.accountName ?? data.accountNumber ?? 'Unknown',
        category: data.category ?? '—',
        reason: data.reason ?? '—',
        description: data.description ?? '',
        amountInvolved: data.amountInvolved ?? null,
        contactPlatform: data.contactPlatform ?? '—',
        status: data.status ?? 'pending',
        evidenceUrls: data.evidenceUrls ?? [],
        createdAt: data.createdAt,
        when: timeAgo(data.createdAt),
      })
      reportsByFingerprint.set(m.fingerprint, list)

      // Keep the most recent ipHash pairing for this fingerprint
      const existing = latestIpHashByFingerprint.get(m.fingerprint)
      if (!existing || new Date(m.submittedAt) > new Date(data.createdAt ?? 0)) {
        latestIpHashByFingerprint.set(m.fingerprint, m.ipHash)
      }
    }
  }

  const strikesByFingerprint = new Map<string, number>()
  for (const doc of strikesSnap.docs) {
    const fp = doc.data().fingerprint
    strikesByFingerprint.set(fp, (strikesByFingerprint.get(fp) ?? 0) + 1)
  }

  const blockInfoByKey = new Map<string, { blockedUntil: string | null }>()
  for (const doc of blocksSnap.docs) {
    blockInfoByKey.set(doc.id, { blockedUntil: doc.data().blockedUntil ?? null })
  }

  const reporters = Array.from(reportsByFingerprint.entries()).map(([fingerprint, reports]) => {
    const ipHash = latestIpHashByFingerprint.get(fingerprint) ?? 'unknown'
    const key = `${fingerprint}__${ipHash}`
    const blockInfo = blockInfoByKey.get(key) ?? null

    reports.sort((a, b) => new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime())

    return {
      fingerprint,
      ipHash,
      key,
      reportCount: reports.length,
      strikeCount: strikesByFingerprint.get(fingerprint) ?? 0,
      blocked: !!blockInfo,
      blockedUntil: blockInfo?.blockedUntil ?? null,
      reports,
    }
  })

  reporters.sort((a, b) => b.strikeCount - a.strikeCount || b.reportCount - a.reportCount)

  return { reporters }
})