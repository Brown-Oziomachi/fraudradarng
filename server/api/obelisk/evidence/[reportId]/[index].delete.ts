// server/api/obelisk/evidence/[reportId]/[index].delete.ts
import { db } from "../../../../utils/firebase-admin"
import { deleteEvidenceImage } from "../../../../utils/firebase-storage"
import { FieldValue } from 'firebase-admin/firestore'
import { requireAdmin } from "~~/server/utils/require-admin"

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const reportId = getRouterParam(event, 'reportId')
  const index = Number(getRouterParam(event, 'index'))
  if (!reportId || Number.isNaN(index)) {
    throw createError({ statusCode: 400, statusMessage: 'Missing reportId or index' })
  }

  const docRef = db.collection('reports').doc(reportId)
  const doc = await docRef.get()
  if (!doc.exists) throw createError({ statusCode: 404, statusMessage: 'Report not found' })

  const evidenceUrls: string[] = doc.data()?.evidenceUrls ?? []
  const target = evidenceUrls[index]
  if (!target) throw createError({ statusCode: 404, statusMessage: 'Image not found at that index' })

  await deleteEvidenceImage(target).catch(() => {}) // best-effort storage cleanup
  await docRef.update({ evidenceUrls: FieldValue.arrayRemove(target) })

  return { success: true }
})