import { performLookup } from '../../utils/lookup'
import { checkRateLimit } from '../../utils/db'

const MAX_QUERIES_PER_CALL = 20

export default defineEventHandler(async (event) => {
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'

  const allowed = await checkRateLimit(ip, 'watchlist-check')
  if (!allowed) {
    throw createError({ statusCode: 429, statusMessage: 'Too many checks. Please try again shortly.' })
  }

  const body = await readBody<{ queries?: string[] }>(event)
  const queries = Array.isArray(body?.queries)
    ? body.queries.filter((q) => typeof q === 'string' && q.trim()).slice(0, MAX_QUERIES_PER_CALL)
    : []

  if (!queries.length) return { results: [] }

  const results = await Promise.all(
    queries.map(async (q) => {
      try {
        const lookup = await performLookup(q)
        return {
          query: q,
          matchCount: lookup.matchFound ? lookup.reportCount : 0,
          reportIds: lookup.reportId ? [lookup.reportId] : [],
          highestRisk:
            lookup.riskLevel === 'high-risk' ? 'flagged' :
            lookup.riskLevel === 'caution' ? 'pending' : 'none',
        }
      } catch (err) {
        console.error('[watchlist/check] lookup failed for query:', q, err)
        
        return { query: q, matchCount: 0, reportIds: [], highestRisk: 'none', checkFailed: true }
      }
    })
  )

  return { results }
})