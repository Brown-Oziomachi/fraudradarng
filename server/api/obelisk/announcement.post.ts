// server/api/obelisk/announcement.post.ts
import { requireAdmin } from '../../utils/require-admin'
import { db } from '../../utils/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody(event)

  await db.collection('siteSettings').doc('announcement').set({
    message: body.message,
    label: body.label,
    linkUrl: body.linkUrl,
    linkText: body.linkText,
    bgColor: body.bgColor,
    textColor: body.textColor,
    active: body.active,
    updatedAt: FieldValue.serverTimestamp()
  })

  return { ok: true }
})