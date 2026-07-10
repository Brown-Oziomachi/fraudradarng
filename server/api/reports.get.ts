import { getAllReports } from "../utils/db"

export default defineCachedEventHandler(async (event) => {
  const query = getQuery(event)
  const cursor = typeof query.cursor === 'string' ? query.cursor : undefined
  const limit = 30

  return getAllReports(limit, cursor)
}, {
  maxAge: 30,
  name: 'reports-list',
  getKey: (event) => {
    const query = getQuery(event)
    return `reports-${query.cursor ?? 'first'}`
  }
})