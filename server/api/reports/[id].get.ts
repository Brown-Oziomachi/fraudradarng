import { getReportById } from '../../utils/db'

export default defineEventHandler(async (event) => {
  // getRouterParam reads the [id] part of the URL — same idea as
  // route.params.query on the frontend, just the server-side version.
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing id' })
  }

  const report = await getReportById(id)

  if (!report) {
    throw createError({ statusCode: 404, statusMessage: 'Report not found' })
  }

  return report
})