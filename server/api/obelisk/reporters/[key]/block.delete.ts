import { liftBlock } from '../../../../utils/abuse-tracking'
import { requireAdmin } from "~~/server/utils/require-admin"

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const key = getRouterParam(event, 'key')
  if (!key || !key.includes('__')) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid reporter key' })
  }

  const parts = key.split('__')
  if (parts.length !== 2) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid reporter key' })
  }

  const [fingerprint, ipHash] = parts
  if (!fingerprint || !ipHash) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid reporter key' })
  }

  await liftBlock({ fingerprint, ipHash, deviceId: '' })
  return { success: true }
})