// server/api/obelisk/collection/[name]/[id].delete.ts
import { db } from '../../../../utils/firebase-admin'
import { requireAdmin } from "~~/server/utils/require-admin"

// Same allowlist as collection.get.ts — keep these in sync, or better,
// extract to a shared constant both files import.
const ALLOWED_COLLECTIONS = new Set([
  'contact_messages',
  'subscribers',
  'report_flags',
])

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const name = getRouterParam(event, 'name')
  const rawId = getRouterParam(event, 'id')

  if (!name || !ALLOWED_COLLECTIONS.has(name)) {
    throw createError({ statusCode: 400, statusMessage: 'Unknown or disallowed collection' })
  }
  if (!rawId) {
    throw createError({ statusCode: 400, statusMessage: 'Missing document id' })
  }

  // subscribers docs are keyed by email — decode in case '@' arrived
  // URL-encoded as %40 from the client.
  const id = decodeURIComponent(rawId)

  const docRef = db.collection(name).doc(id)
  const snap = await docRef.get()

  if (!snap.exists) {
    throw createError({
      statusCode: 404,
      statusMessage: `No document found in "${name}" with id "${id}"`,
    })
  }

  await docRef.delete()

  return { success: true, collection: name, deletedId: id }
})