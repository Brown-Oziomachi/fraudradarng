// server/api/cron/compute-trends.get.ts
//
// Scheduled job: computes "rising threats" by comparing report volume
// per entity over the last 7 days vs the 7 days before that.
// Writes results to a `trending` collection so the frontend never
// has to scan raw reports live.
//
// Trigger this via Vercel Cron (vercel.json) hitting this route daily,
// protected by a shared secret header — NOT requireAdmin, since cron
// triggers aren't an authenticated admin session.
//
// vercel.json:
// {
//   "crons": [{ "path": "/api/cron/compute-trends", "schedule": "0 3 * * *" }]
// }

import { getFirestore, Timestamp, FieldValue } from 'firebase-admin/firestore'

interface TrendEntry {
  entity: string
  recentCount: number
  priorCount: number
  spikeScore: number
  computedAt: FirebaseFirestore.FieldValue
}

const MIN_RECENT_REPORTS = 3 // ignore noise from single/double one-off reports

function normalizeEntity(raw: string): string {
  // Swap this out for your existing normalizeByType() if it covers
  // entity names too — this is a minimal fallback.
  return raw.trim().toLowerCase().replace(/\s+/g, ' ')
}

export default defineEventHandler(async (event) => {
  // --- Auth: shared secret, not requireAdmin ---
  const authHeader = getHeader(event, 'authorization')
  const expected = `Bearer ${process.env.CRON_SECRET}`
  if (!process.env.CRON_SECRET || authHeader !== expected) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const db = getFirestore()

  const now = Timestamp.now()
  const sevenDaysAgo = Timestamp.fromMillis(now.toMillis() - 7 * 24 * 60 * 60 * 1000)
  const fourteenDaysAgo = Timestamp.fromMillis(now.toMillis() - 14 * 24 * 60 * 60 * 1000)

  // Pull last 14 days of reports in one query, bucket in memory —
  // cheaper than two separate range queries and avoids double-counting
  // at the boundary.
  const snapshot = await db
    .collection('reports')
    .where('createdAt', '>=', fourteenDaysAgo)
    .select('entity', 'createdAt')
    .get()

  const recentCounts = new Map<string, number>()
  const priorCounts = new Map<string, number>()

  snapshot.forEach((doc) => {
    const data = doc.data()
    const entityRaw = data.entity
    const createdAt = data.createdAt as FirebaseFirestore.Timestamp | undefined
    if (!entityRaw || !createdAt) return

    const entity = normalizeEntity(entityRaw)
    const isRecent = createdAt.toMillis() >= sevenDaysAgo.toMillis()

    const targetMap = isRecent ? recentCounts : priorCounts
    targetMap.set(entity, (targetMap.get(entity) ?? 0) + 1)
  })

  const trends: TrendEntry[] = []

  for (const [entity, recentCount] of recentCounts.entries()) {
    if (recentCount < MIN_RECENT_REPORTS) continue

    const priorCount = priorCounts.get(entity) ?? 0
    const spikeScore = (recentCount - priorCount) / Math.max(priorCount, 1)

    trends.push({
      entity,
      recentCount,
      priorCount,
      spikeScore,
      computedAt: FieldValue.serverTimestamp(),
    })
  }

  trends.sort((a, b) => b.spikeScore - a.spikeScore)

  // Overwrite the trending collection atomically-ish: delete stale docs,
  // write fresh ones. Small collection (bounded by distinct entities
  // with >= MIN_RECENT_REPORTS), so batch is fine.
  const trendingRef = db.collection('trending')
  const existing = await trendingRef.select().get()

  const batch = db.batch()
  existing.forEach((doc) => batch.delete(doc.ref))
  trends.forEach((trend) => {
    const docRef = trendingRef.doc(normalizeEntity(trend.entity).replace(/[/.#$[\]]/g, '_'))
    batch.set(docRef, trend)
  })
  await batch.commit()

  return {
    success: true,
    entitiesTracked: trends.length,
    topSpikes: trends.slice(0, 5),
  }
})