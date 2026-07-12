import { db } from "../../../utils/firebase-admin"
import { requireAdmin } from "~~/server/utils/require-admin"

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

// --- tiny union-find over prefixed identity nodes ("fp:x", "ip:y", "dev:z") ---
class UnionFind {
  private parent = new Map<string, string>()
  private find(x: string): string {
    if (!this.parent.has(x)) this.parent.set(x, x)
    const p = this.parent.get(x)!
    if (p === x) return x
    const root = this.find(p)
    this.parent.set(x, root)
    return root
  }
  union(a: string, b: string) {
    const ra = this.find(a)
    const rb = this.find(b)
    if (ra !== rb) this.parent.set(ra, rb)
  }
  root(x: string): string {
    return this.find(x)
  }
}

interface MetaEntry {
  fingerprint: string
  ipHash: string
  deviceId?: string
  submittedAt: string
}

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const reportsRef = db.collection('reports')
  const strikesRef = db.collection('reporter_strikes')
  const blocksRef = db.collection('reporter_blocks')

  const [reportsSnap, strikesSnap, blocksSnap] = await Promise.all([
    reportsRef.get(),
    strikesRef.orderBy('createdAt', 'desc').get(),
    blocksRef.get(),
  ])

  const uf = new UnionFind()

  // Build clusters: link fingerprint/ipHash/deviceId whenever they co-occur
  // on the same meta entry — this is what lets a VPN-switching-but-same-
  // device reporter still resolve to one cluster.
  function linkMeta(m: MetaEntry) {
    const fp = `fp:${m.fingerprint}`
    const ip = `ip:${m.ipHash}`
    uf.union(fp, ip)
    if (m.deviceId) {
      const dev = `dev:${m.deviceId}`
      uf.union(fp, dev)
      uf.union(ip, dev)
    }
  }

  const reportsByRoot = new Map<string, Array<Record<string, unknown>>>()
  const metaByRoot = new Map<string, MetaEntry[]>()

  // First pass: union everything
  for (const doc of reportsSnap.docs) {
    const data = doc.data()
    const meta: MetaEntry[] = data.reporterMeta ?? []
    for (const m of meta) linkMeta(m)
  }
  for (const doc of strikesSnap.docs) {
    const d = doc.data()
    if (d.fingerprint || d.ipHash) linkMeta({ fingerprint: d.fingerprint, ipHash: d.ipHash, deviceId: d.deviceId, submittedAt: d.createdAt })
  }
  for (const doc of blocksSnap.docs) {
    const d = doc.data()
    if (d.fingerprint || d.ipHash) linkMeta({ fingerprint: d.fingerprint, ipHash: d.ipHash, deviceId: d.deviceId, submittedAt: d.createdAt })
  }

  // Second pass: group reports and meta by resolved cluster root
  for (const doc of reportsSnap.docs) {
    const data = doc.data()
    const meta: MetaEntry[] = data.reporterMeta ?? []
    const rootsForThisReport = new Set<string>()

    for (const m of meta) {
      const root = uf.root(`fp:${m.fingerprint}`)
      rootsForThisReport.add(root)

      const metaList = metaByRoot.get(root) ?? []
      metaList.push(m)
      metaByRoot.set(root, metaList)
    }

    const entry = {
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
    }

    for (const root of rootsForThisReport) {
      const list = reportsByRoot.get(root) ?? []
      list.push(entry)
      reportsByRoot.set(root, list)
    }
  }

  const strikesByRoot = new Map<string, number>()
  for (const doc of strikesSnap.docs) {
    const d = doc.data()
    if (!d.fingerprint) continue
    const root = uf.root(`fp:${d.fingerprint}`)
    strikesByRoot.set(root, (strikesByRoot.get(root) ?? 0) + 1)
  }

  const blockByRoot = new Map<string, { blockedUntil: string | null }>()
  for (const doc of blocksSnap.docs) {
    const d = doc.data()
    if (!d.fingerprint) continue
    const root = uf.root(`fp:${d.fingerprint}`)
    const until = d.blockedUntil ?? null
    const existing = blockByRoot.get(root)
    // keep the most restrictive: null (indefinite) beats any expiry date
    if (!existing || existing.blockedUntil === undefined) {
      blockByRoot.set(root, { blockedUntil: until })
    } else if (existing.blockedUntil !== null && (until === null || new Date(until) > new Date(existing.blockedUntil))) {
      blockByRoot.set(root, { blockedUntil: until })
    }
  }

  const reporters = Array.from(reportsByRoot.entries()).map(([root, reports]) => {
    const metaList = metaByRoot.get(root) ?? []
    // dedupe fingerprints/ipHashes/deviceIds for display
    const fingerprints = [...new Set(metaList.map(m => m.fingerprint))]
    const ipHashes = [...new Set(metaList.map(m => m.ipHash))]
    const deviceIds = [...new Set(metaList.map(m => m.deviceId).filter(Boolean))] as string[]

    // Representative identity for admin actions (strike/block URLs still
    // expect fingerprint__ipHash) — use the most recent meta entry.
    const latest = [...metaList].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())[0]
    const fingerprint = latest?.fingerprint ?? fingerprints[0] ?? 'unknown'
    const ipHash = latest?.ipHash ?? ipHashes[0] ?? 'unknown'
    const key = `${fingerprint}__${ipHash}`

    const dedupedReports = Array.from(new Map(reports.map(r => [r.id, r])).values())
    dedupedReports.sort((a, b) => new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime())

    const blockInfo = blockByRoot.get(root) ?? null

    return {
      fingerprint,
      ipHash,
      key,
      linkedFingerprints: fingerprints,   // for admin visibility: "this person also reported as..."
      linkedIpHashes: ipHashes,
      linkedDeviceIds: deviceIds,
      reportCount: dedupedReports.length,
      strikeCount: strikesByRoot.get(root) ?? 0,
      blocked: !!blockInfo,
      blockedUntil: blockInfo?.blockedUntil ?? null,
      reports: dedupedReports,
    }
  })

  reporters.sort((a, b) => b.strikeCount - a.strikeCount || b.reportCount - a.reportCount)

  return { reporters }
})