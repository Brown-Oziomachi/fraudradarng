import { recordStrike } from '../../../../utils/abuse-tracking'
import { requireAdmin } from "~~/server/utils/require-admin"

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const key = getRouterParam(event, 'key')
  if (!key || !key.includes('__')) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid reporter key' })
  }
  const [fingerprint, ipHash] = key.split('__') as [string, string]

  const body = await readBody<{ reason?: string }>(event)
  const reason: string = body?.reason ?? 'admin_manual_strike'

  try {
    // deviceId unknown from a URL-derived key — union matching in
    // abuse-tracking still catches related fingerprint/ipHash records.
    const result = await recordStrike({ fingerprint, ipHash, deviceId: '' }, reason)
    return { success: true, ...result }
  } catch (err: any) {
    console.error('[strike.post] failed:', err)
    throw createError({ statusCode: 500, statusMessage: err?.message ?? 'Failed to record strike' })
  }
})