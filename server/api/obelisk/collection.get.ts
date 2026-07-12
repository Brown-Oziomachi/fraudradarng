// server/api/obelisk/collection.get.ts
import { db } from '../../utils/firebase-admin'
import { requireAdmin } from "~~/server/utils/require-admin"

// Hard allowlist — comments, likes, and _connection_test belong to the
// portfolio site (browncode.name.ng) and must never be reachable from
// the FRNG admin dashboard, even by a crafted request.
const ALLOWED_COLLECTIONS = new Set([
  'contact_messages',
  'subscribers',
  'report_flags',
  'partnershipApplications',  
])

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const query = getQuery(event)
  const name = String(query.name ?? '')

  if (!ALLOWED_COLLECTIONS.has(name)) {
    throw createError({ statusCode: 400, statusMessage: 'Unknown or disallowed collection' })
  }

  const snapshot = await db.collection(name).limit(300).get()
  const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))

  // Field names differ per collection (createdAt vs subscribedAt etc) —
  // sort client-agnostic by whichever timestamp-like field exists.
  docs.sort((a: any, b: any) => {
    const ad = a.createdAt ?? a.subscribedAt ?? ''
    const bd = b.createdAt ?? b.subscribedAt ?? ''
    return String(bd).localeCompare(String(ad))
  })

  return { name, count: docs.length, docs }
})