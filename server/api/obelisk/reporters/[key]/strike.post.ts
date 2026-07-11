// server/api/obelisk/reporters/[key]/strike.post.ts
import { recordStrike } from '../../../../utils/abuse-tracking'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const key = getRouterParam(event, 'key')
  if (!key || !key.includes('__')) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid reporter key' })
  }
  const [fingerprint, ipHash] = key.split('__')

  const body = await readBody<{ reason?: string }>(event)
  const result = await recordStrike(fingerprint, ipHash, body?.reason ?? 'admin_manual_strike')

  return { success: true, ...result }
})