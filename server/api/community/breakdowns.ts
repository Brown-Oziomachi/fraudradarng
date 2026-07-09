// server/api/community/breakdowns.ts
import { db } from '../../utils/firebase-admin'
import type { ScamBreakdown } from '~/types/community'

const DEFAULT_LIMIT = 8
const MAX_LIMIT = 100

export default defineEventHandler(async (event): Promise<ScamBreakdown[]> => {
  try {
    const query = getQuery(event)
    const requestedLimit = Number(query.limit)
    const limit =
      Number.isFinite(requestedLimit) && requestedLimit > 0
        ? Math.min(requestedLimit, MAX_LIMIT)
        : DEFAULT_LIMIT

    const snapshot = await db
      .collection('scamBreakdowns')
      .orderBy('lastSeen', 'desc')
      .limit(limit)
      .get()

    if (snapshot.empty) {
      return []
    }

    const breakdowns: ScamBreakdown[] = snapshot.docs.map((doc) => {
      const data = doc.data()

      return {
        id: doc.id,
        title: data.title ?? 'Untitled Report',
        category: data.category ?? 'Fake Job Offer',
        threatLevel: data.threatLevel ?? 'moderate',
        summary: data.summary ?? '',
        reportedCount: data.reportedCount ?? 0,
        lastSeen: data.lastSeen?.toDate
          ? data.lastSeen.toDate().toISOString()
          : (data.lastSeen ?? new Date().toISOString()),
        platformsInvolved: Array.isArray(data.platformsInvolved) ? data.platformsInvolved : [],
        modusOperandi: Array.isArray(data.modusOperandi) ? data.modusOperandi : [],
        redFlags: Array.isArray(data.redFlags) ? data.redFlags : [],
      }
    })

    return breakdowns
  } catch (error) {
    console.error('[api/community/breakdowns] Firestore fetch failed:', error)

    // Fail safe: return an empty array rather than throwing,
    // so the client never receives undefined and the UI stays stable.
    setResponseStatus(event, 200)
    return []
  }
})