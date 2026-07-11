import { getAuth } from 'firebase-admin/auth'

/**
 * Verifies the Authorization: Bearer <idToken> header on an admin-only
 * API route. Throws a 401/403 H3Error if missing, invalid, or not admin.
 * Call this at the top of every route under /api/obelisk and any other
 * route that mutates or exposes report data to admins only.
 */
export async function requireAdmin(event: any) {
  const authHeader = getHeader(event, 'authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Missing auth token' })
  }

  let decoded
  try {
    decoded = await getAuth().verifyIdToken(token)
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Invalid or expired token' })
  }

  if (decoded.admin !== true) {
    throw createError({ statusCode: 403, statusMessage: 'Admin access required' })
  }

  return decoded
}