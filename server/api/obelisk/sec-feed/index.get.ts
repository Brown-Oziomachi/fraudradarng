import { db } from '../../../utils/firebase-admin'
import { requireAdmin } from '~~/server/utils/require-admin'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const snap = await db.collection('sec_feed_items')
    .orderBy('fetchedAt', 'desc')
    .limit(100)
    .get()

  return {
    items: snap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
  }
})