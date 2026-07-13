import type { Report } from '#shared/types/report'

export function useReportsListCache() {
  return useState<{
    reports: Report[]
    cursor: string | null
    totalReports: number
    highRiskCount: number
    scrollY: number
    loaded: boolean
  }>('reportsListCache', () => ({
    reports: [],
    cursor: null,
    totalReports: 0,
    highRiskCount: 0,
    scrollY: 0,
    loaded: false
  }))
}

export function useReportDetailCache() {
  return useState<Record<string, Report>>('reportDetailCache', () => ({}))
}