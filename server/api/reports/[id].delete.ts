// server/api/reports/[id].delete.ts  (adjust path to match your actual file)
import { requireAdmin } from '~~/server/utils/require-admin'
import { db } from '../../utils/firebase-admin' 

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing report id' })
  }

  console.log('[delete-report] Received id:', JSON.stringify(id))

  const docRef = db.collection('reports').doc(id)
  const before = await docRef.get()
  console.log('[delete-report] Exists before delete?', before.exists)

  if (!before.exists) {
    console.log('[delete-report] Bailing — no such document. This id came from somewhere that does not match Firestore.')
    throw createError({ statusCode: 404, statusMessage: `No report found with id "${id}"` })
  }

  await docRef.delete()

  const after = await docRef.get()
  console.log('[delete-report] Exists after delete?', after.exists)

  setResponseStatus(event, 200)
  return { success: true, deletedId: id }
})