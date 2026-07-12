// server/api/obelisk/partnerships/[id].patch.ts
import { db } from '../../../utils/firebase-admin'
import { requireAdmin } from '~~/server/utils/require-admin'

const VALID_STATUSES = ['new', 'contacted', 'approved', 'declined'] as const
type Status = (typeof VALID_STATUSES)[number]

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing id' })
  }

  const body = await readBody<{ status?: Status }>(event)
  if (!body?.status || !VALID_STATUSES.includes(body.status)) {
    throw createError({ statusCode: 400, statusMessage: `status must be one of: ${VALID_STATUSES.join(', ')}` })
  }

  const docRef = db.collection('partnershipApplications').doc(id)
  const doc = await docRef.get()
  if (!doc.exists) {
    throw createError({ statusCode: 404, statusMessage: 'Application not found' })
  }

  await docRef.update({
    status: body.status,
    statusUpdatedAt: new Date().toISOString(),
  })

  return { success: true, status: body.status }
})