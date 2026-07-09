import { searchReports } from '../utils/db'
import { getReportDisplayName, getTypeLabel, getCategoryLabel, getDetailFields, getSharedFields } from '~~/shared/utils/reportDisplay'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const searchTerm = String(query.q ?? '')

  if (!searchTerm.trim()) {
    return []
  }

  const results = await searchReports(searchTerm)

  return results.map((r: any) => ({
    id: r.id,
    name: getReportDisplayName(r),
    typeLabel: getTypeLabel(r),
    category: getCategoryLabel(r),
    excerpt: r.description ? r.description.slice(0, 120) : undefined,
    dateReported: r.createdAt,
    detailFields: getDetailFields(r),
    sharedFields: getSharedFields(r)
  }))
})