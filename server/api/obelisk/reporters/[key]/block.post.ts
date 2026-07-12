import { db } from '../../../../utils/firebase-admin'
import { requireAdmin } from "~~/server/utils/require-admin"

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const key = getRouterParam(event, 'key')
  if (!key || !key.includes('__')) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid reporter key' })
  }
  const [fingerprint, ipHash] = key.split('__')

  const body = await readBody<{ durationDays?: number | null }>(event)
  const durationDays = body?.durationDays ?? null

  await db.collection('reporter_blocks').doc(key).set({
    fingerprint,
    ipHash,
    deviceId: null, 
    strikeCount: null,
    blockedUntil: durationDays ? new Date(Date.now() + durationDays * 86400000).toISOString() : null,
    createdAt: new Date().toISOString(),
    manual: true,
  })

  return { success: true }
})