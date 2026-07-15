import { db } from '~~/server/utils/firebase-admin'
import { requireAdmin } from '~~/server/utils/require-admin'

const VALID_STATUSES = ['unregistered', 'probation', 'registered'] as const
type RegulatoryStatus = (typeof VALID_STATUSES)[number]

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing id' })

  const body = await readBody<{ status?: RegulatoryStatus | null; note?: string }>(event)

  if (body.status !== null && (!body.status || !VALID_STATUSES.includes(body.status))) {
    throw createError({ statusCode: 400, statusMessage: `status must be one of: ${VALID_STATUSES.join(', ')}, or null to clear` })
  }

  const docRef = db.collection('reports').doc(id)
  const doc = await docRef.get()
  if (!doc.exists) throw createError({ statusCode: 404, statusMessage: 'Report not found' })

  const { FieldValue } = await import('firebase-admin/firestore')

  await docRef.update({
    regulatoryStatus: body.status === null ? FieldValue.delete() : body.status,
    regulatoryStatusNote: body.note?.trim() || FieldValue.delete(),
    regulatoryStatusUpdatedAt: body.status === null ? FieldValue.delete() : new Date().toISOString(),
  })

  return { success: true, status: body.status ?? null }
})