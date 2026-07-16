import { performLookup } from '../../utils/lookup'
import type { LookupResult } from '#shared/types/report'

export default defineEventHandler(async (event): Promise<LookupResult> => {
  const query = getQuery(event)
  const rawInput = typeof query.q === 'string' ? query.q.trim() : ''

  if (!rawInput) {
    throw createError({ statusCode: 400, statusMessage: 'A search query is required.' })
  }

  try {
    const { reportId, ...result } = await performLookup(rawInput, query.type)
    return result
  } catch (error) {
    console.error('[api/community/lookup] lookup failed:', error)
    // Same discipline as before: never let a database error look like
    // "this identifier is clean" — fail loudly instead.
    throw createError({
      statusCode: 503,
      statusMessage: 'Lookup search is temporarily unavailable. Please try again shortly.',
    })
  }
})