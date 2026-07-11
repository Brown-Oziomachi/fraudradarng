// server/api/obelisk/reporters/[key]/block.delete.ts
import { liftBlock } from '../../../../utils/abuse-tracking'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const key = getRouterParam(event, 'key')
  if (!key || !key.includes('__')) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid reporter key' })
  }
  const [fingerprint, ipHash] = key.split('__')

  await liftBlock(fingerprint, ipHash)
  return { success: true }
})