import { db } from '~~/server/utils/firebase-admin'
import { requireAdmin } from '~~/server/utils/require-admin'
import { fetchSecFeed } from '../../../utils/sec-feed'

const stagingRef = db.collection('sec_feed_items')

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  let items: Awaited<ReturnType<typeof fetchSecFeed>>
  try {
    items = await fetchSecFeed()
  } catch (err: any) {
    console.error('[sec-feed/refresh] fetch failed:', err)
    throw createError({ statusCode: 502, statusMessage: 'Could not reach the SEC feed. Try again shortly.' })
  }

  let added = 0
  let refreshed = 0

  for (const item of items) {
    if (!item.guid) continue
    const docRef = stagingRef.doc(Buffer.from(item.guid).toString('base64url').slice(0, 500))
    const existing = await docRef.get()

    if (!existing.exists) {
      await docRef.set({
        ...item,
        status: 'unreviewed',
        fetchedAt: new Date().toISOString(),
      })
      added++
      continue
    }

    // Already seen this guid. Only re-sync the raw feed fields if it's still
    // unreviewed — never touch anything you've already published or
    // dismissed, so re-pulling can't silently rewrite your review history.
    const existingStatus = existing.data()?.status
    if (existingStatus === 'unreviewed') {
      await docRef.update({
        title: item.title,
        summary: item.summary,
        link: item.link,
        pubDate: item.pubDate,
        refetchedAt: new Date().toISOString(),
      })
      refreshed++
    }
  }

  return { success: true, fetched: items.length, added, refreshed }
})