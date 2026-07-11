import { requireAdmin } from '~~/server/utils/require-admin'
import { deleteReport } from '../../utils/db'

export default defineEventHandler(async (event) => {
    await requireAdmin(event)
  // TODO: real admin auth check — verify Firebase ID token + admin email,

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing report id' })
  }

  await deleteReport(id)
  setResponseStatus(event, 200)
  return { success: true }
})