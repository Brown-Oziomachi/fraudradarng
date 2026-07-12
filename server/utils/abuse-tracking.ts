import { db } from "./firebase-admin"

const strikesRef = db.collection('reporter_strikes')
const blocksRef = db.collection('reporter_blocks')

export const STRIKE_WINDOW_DAYS = 30
export const WARN_AT = 2
export const TEMP_BLOCK_AT = 3
export const PERMANENT_BLOCK_AT = 5

export interface ReporterIdentity {
  fingerprint: string
  ipHash: string
  deviceId: string
}

// A single stable "identity key" for storage — still needed as a doc id for
// blocks, but lookups no longer trust it alone. We use fingerprint__ipHash
// for the primary block doc (kept for backwards compat with existing docs
// and the Obelisk UI's `key` field), but every read is a 3-way union query.
function primaryKey(id: ReporterIdentity): string {
  return `${id.fingerprint}__${id.ipHash}`
}

async function findMatchingBlocks(id: ReporterIdentity) {
  const [byFp, byIp, byDevice] = await Promise.all([
    blocksRef.where('fingerprint', '==', id.fingerprint).get(),
    blocksRef.where('ipHash', '==', id.ipHash).get(),
    blocksRef.where('deviceId', '==', id.deviceId).get(),
  ])
  const seen = new Map<string, FirebaseFirestore.QueryDocumentSnapshot>()
  for (const snap of [byFp, byIp, byDevice]) {
    for (const doc of snap.docs) seen.set(doc.id, doc)
  }
  return Array.from(seen.values())
}

export async function recordStrike(id: ReporterIdentity, reason: string) {
  await strikesRef.add({
    fingerprint: id.fingerprint,
    ipHash: id.ipHash,
    deviceId: id.deviceId,
    reason,
    createdAt: new Date().toISOString(),
  })

  const windowStart = new Date(Date.now() - STRIKE_WINDOW_DAYS * 86400000).toISOString()
  const matches = await findMatchingStrikes(id)
  const strikeCount = matches.filter(d => d.data().createdAt >= windowStart).length

  if (strikeCount >= TEMP_BLOCK_AT) {
    const durationDays = strikeCount >= PERMANENT_BLOCK_AT ? null : 7
    const blockedUntil = durationDays
      ? new Date(Date.now() + durationDays * 86400000).toISOString()
      : null

    await blocksRef.doc(primaryKey(id)).set({
      fingerprint: id.fingerprint,
      ipHash: id.ipHash,
      deviceId: id.deviceId,
      strikeCount,
      blockedUntil,
      createdAt: new Date().toISOString(),
    })
  }

  return { strikeCount, warned: strikeCount >= WARN_AT }
}

export async function getStrikeCount(id: ReporterIdentity): Promise<number> {
  const windowStart = new Date(Date.now() - STRIKE_WINDOW_DAYS * 86400000).toISOString()
  const matches = await findMatchingStrikes(id)
  return matches.filter(d => d.data().createdAt >= windowStart).length
}

export async function checkBlocked(id: ReporterIdentity): Promise<{ blocked: boolean; reason?: string }> {
  const matches = await findMatchingBlocks(id)
  if (!matches.length) return { blocked: false }

  // If several linked block docs exist (e.g. one keyed on old IP, one on
  // new), treat the most restrictive as authoritative: indefinite beats
  // any expiring block, and among expiring blocks the furthest-out wins.
  let active: { docId: string; blockedUntil: string | null } | null = null
  for (const doc of matches) {
    const data = doc.data()
    const blockedUntil: string | null = data.blockedUntil ?? null

    if (blockedUntil && new Date(blockedUntil).getTime() < Date.now()) {
      continue // this particular block doc has expired — ignore it
    }
    if (!active) {
      active = { docId: doc.id, blockedUntil }
      continue
    }
    if (active.blockedUntil === null) continue // already indefinite, nothing beats it
    if (blockedUntil === null || new Date(blockedUntil) > new Date(active.blockedUntil)) {
      active = { docId: doc.id, blockedUntil }
    }
  }

  if (!active) return { blocked: false }

  return {
    blocked: true,
    reason: active.blockedUntil
      ? `Temporarily restricted until ${new Date(active.blockedUntil).toLocaleDateString('en-NG')} due to repeated inaccurate reports.`
      : 'Restricted due to repeated inaccurate reports. Contact support to appeal.',
  }
}

export async function liftBlock(id: ReporterIdentity) {
  const matches = await findMatchingBlocks(id)
  await Promise.all(matches.map(doc => doc.ref.delete()))
}

async function findMatchingStrikes(id: ReporterIdentity) {
  const queries = []
  if (id.fingerprint) queries.push(strikesRef.where('fingerprint', '==', id.fingerprint).get())
  if (id.ipHash) queries.push(strikesRef.where('ipHash', '==', id.ipHash).get())
  if (id.deviceId) queries.push(strikesRef.where('deviceId', '==', id.deviceId).get())

  const results = await Promise.all(queries)
  const seen = new Map<string, FirebaseFirestore.QueryDocumentSnapshot>()
  for (const snap of results) {
    for (const doc of snap.docs) seen.set(doc.id, doc)
  }
  return Array.from(seen.values())
}