import { requireAdmin } from '~~/server/utils/require-admin'
import { resolveFlag } from '../../../utils/db'

export default defineEventHandler(async (event) => {
    await requireAdmin(event)
  // TODO: real admin auth check — verify Firebase ID token + admin email,
  // same pattern noted in reports/[id].delete.ts.

  const flagId = getRouterParam(event, 'id')
  if (!flagId) {
    throw createError({ statusCode: 400, statusMessage: 'Missing flag id' })
  }

  const body = await readBody<{ action?: 'dismiss' | 'resolved' }>(event)
  const action = body?.action === 'resolved' ? 'resolved' : 'dismiss'

  await resolveFlag(flagId, action)
  setResponseStatus(event, 200)
  return { success: true }
})