import { db } from '../../../utils/firebase-admin'
import { requireAdmin } from '~~/server/utils/require-admin'

const VALID_ACTIONS = ['publish', 'dismiss'] as const

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing id' })

  const body = await readBody<{ action?: (typeof VALID_ACTIONS)[number] }>(event)
  if (!body?.action || !VALID_ACTIONS.includes(body.action)) {
    throw createError({ statusCode: 400, statusMessage: `action must be one of: ${VALID_ACTIONS.join(', ')}` })
  }

  const stagingRef = db.collection('sec_feed_items').doc(id)
  const doc = await stagingRef.get()
  if (!doc.exists) throw createError({ statusCode: 404, statusMessage: 'Feed item not found' })

  const data = doc.data()!

  if (body.action === 'dismiss') {
    await stagingRef.update({ status: 'dismissed', reviewedAt: new Date().toISOString() })
    return { success: true, status: 'dismissed' }
  }

  // publish — creates the public-facing entry in a SEPARATE collection from
  // both `reports` (user submissions) and `sec_feed_items` (raw staging).
  await db.collection('official_alerts').add({
    title: data.title,
    summary: data.summary,
    sourceUrl: data.link,
    sourcePublishedAt: data.pubDate,
    publishedAt: new Date().toISOString(),
    origin: 'sec_nigeria',
  })

  await stagingRef.update({ status: 'published', reviewedAt: new Date().toISOString() })
  return { success: true, status: 'published' }
})