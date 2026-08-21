// server/api/obelisk/announcement.get.ts
import { requireAdmin } from '../../utils/require-admin'
import { db } from '../../utils/firebase-admin'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const doc = await db.collection('siteSettings').doc('announcement').get()
  return doc.exists ? doc.data() : null
})