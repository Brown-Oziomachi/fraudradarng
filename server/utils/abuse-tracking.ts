// server/utils/abuse-tracking.ts
import { db } from "./firebase-admin"

const strikesRef = db.collection('reporter_strikes')
const blocksRef = db.collection('reporter_blocks')

const STRIKE_WINDOW_DAYS = 30
const WARN_AT = 2          // 2nd strike -> warning shown, still allowed to post
const TEMP_BLOCK_AT = 3    // 3rd strike -> 7 day block
const PERMANENT_BLOCK_AT = 5 // 5th strike -> indefinite, admin-reviewable

function reporterKey(fingerprint: string, ipHash: string): string {
  // Composite key: a cleared-localStorage fingerprint alone isn't enough
  // (trivially reset), and ipHash alone risks catching innocent people on
  // shared/CGNAT connections. Requiring both reduces false positives.
  return `${fingerprint}__${ipHash}`
}

export async function recordStrike(fingerprint: string, ipHash: string, reason: string) {
  const key = reporterKey(fingerprint, ipHash)
  await strikesRef.add({
    key,
    fingerprint,
    ipHash,
    reason,
    createdAt: new Date().toISOString(),
  })

  const windowStart = new Date(Date.now() - STRIKE_WINDOW_DAYS * 86400000).toISOString()
  const recentSnapshot = await strikesRef
    .where('key', '==', key)
    .where('createdAt', '>=', windowStart)
    .count()
    .get()
  const strikeCount = recentSnapshot.data().count

  if (strikeCount >= TEMP_BLOCK_AT) {
    const durationDays = strikeCount >= PERMANENT_BLOCK_AT ? null : 7 // null = indefinite
    const blockedUntil = durationDays
      ? new Date(Date.now() + durationDays * 86400000).toISOString()
      : null

    await blocksRef.doc(key).set({
      fingerprint,
      ipHash,
      strikeCount,
      blockedUntil, // null means indefinite, requires admin review to lift
      createdAt: new Date().toISOString(),
    })
  }

  return { strikeCount, warned: strikeCount >= WARN_AT }
}

export async function checkBlocked(fingerprint: string, ipHash: string): Promise<{
  blocked: boolean
  reason?: string
}> {
  const key = reporterKey(fingerprint, ipHash)
  const doc = await blocksRef.doc(key).get()
  if (!doc.exists) return { blocked: false }

  const data = doc.data()!
  if (data.blockedUntil && new Date(data.blockedUntil).getTime() < Date.now()) {
    // Temp block expired — clean it up so future checks skip the read.
    await blocksRef.doc(key).delete()
    return { blocked: false }
  }

  return {
    blocked: true,
    reason: data.blockedUntil
      ? `Temporarily restricted until ${new Date(data.blockedUntil).toLocaleDateString('en-NG')} due to repeated inaccurate reports.`
      : 'Restricted due to repeated inaccurate reports. Contact support to appeal.',
  }
}

export async function liftBlock(fingerprint: string, ipHash: string) {
  await blocksRef.doc(reporterKey(fingerprint, ipHash)).delete()
}