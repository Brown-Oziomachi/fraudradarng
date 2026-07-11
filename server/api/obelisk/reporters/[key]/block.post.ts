// server/api/obelisk/reporters/[key]/block.post.ts
import { db } from '../../../../utils/firebase-admin'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const key = getRouterParam(event, 'key')
  if (!key || !key.includes('__')) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid reporter key' })
  }
  const [fingerprint, ipHash] = key.split('__')

  const body = await readBody<{ durationDays?: number | null }>(event)
  const durationDays = body?.durationDays ?? null // null = indefinite

  await db.collection('reporter_blocks').doc(key).set({
    fingerprint,
    ipHash,
    strikeCount: null, // manual block, not strike-count-driven
    blockedUntil: durationDays ? new Date(Date.now() + durationDays * 86400000).toISOString() : null,
    createdAt: new Date().toISOString(),
    manual: true,
  })

  return { success: true }
})