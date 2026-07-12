import { getAuth } from 'firebase-admin/auth'


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