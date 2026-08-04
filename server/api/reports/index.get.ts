import { getAllReports } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const limit = query.limit ? Number(query.limit) : 30
  const cursorId = query.cursor ? String(query.cursor) : undefined

  return await getAllReports(limit, cursorId)
})