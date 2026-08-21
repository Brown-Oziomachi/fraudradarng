import { getAuth } from 'firebase-admin/auth'
import { ensureFirebaseAdmin } from './firebase-admin'

export async function requireAdmin(event: any) {
  ensureFirebaseAdmin() // must run before any getAuth() call

  const sessionCookie = getCookie(event, '__session')

  if (sessionCookie) {
    let decoded
    try {
      decoded = await getAuth().verifySessionCookie(sessionCookie, true)
    } catch {
      throw createError({ statusCode: 401, statusMessage: 'Invalid or expired session' })
    }
    if (decoded.admin !== true) {
      throw createError({ statusCode: 403, statusMessage: 'Admin access required' })
    }
    return decoded
  }

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