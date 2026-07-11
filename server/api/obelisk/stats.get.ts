// server/api/obelisk/stats.get.ts
import { db } from "../../utils/firebase-admin"
import { getPendingFlags } from '../../utils/db'
import { requireAdmin } from "~~/server/utils/require-admin"

const DAY_MS = 24 * 60 * 60 * 1000
const TREND_DAYS = 30

function timeAgo(iso: string | undefined): string {
  if (!iso) return '—'
  const diffMs = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diffMs / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

export default defineEventHandler(async (event) => {
      await requireAdmin(event)
  const query = getQuery(event)
  const windowParam = ['7d', '30d', '90d'].includes(String(query.window)) ? String(query.window) : '30d'
  const TREND_DAYS = { '7d': 7, '30d': 30, '90d': 90 }[windowParam]!

  const reportsRef = db.collection('reports')

  const now = Date.now()
  const windowStart = new Date(now - TREND_DAYS * DAY_MS).toISOString()
  const prevWindowStart = new Date(now - TREND_DAYS * 2 * DAY_MS).toISOString()

  const [
    totalSnapshot,
    pendingReviewSnapshot,
    pendingSnapshot,
    recentWindowSnapshot,
    prevWindowSnapshot,
    activitySnapshot,
    flags,
  ] = await Promise.all([
    reportsRef.count().get(),
    reportsRef.where('status', '==', 'pending_review').count().get(),
    reportsRef.where('status', 'in', ['pending', 'pending_review']).count().get(),
    reportsRef.where('createdAt', '>=', windowStart).orderBy('createdAt', 'desc').get(),
    reportsRef.where('createdAt', '>=', prevWindowStart).where('createdAt', '<', windowStart).count().get(),
    reportsRef.orderBy('createdAt', 'desc').limit(20).get(),
    getPendingFlags(),
  ])

  const totalReports = totalSnapshot.data().count
  const pending = pendingSnapshot.data().count
  const clusters = pendingReviewSnapshot.data().count

  const recentDocs = recentWindowSnapshot.docs.map(d => d.data())
  const recentCount = recentDocs.length
  const prevCount = prevWindowSnapshot.data().count
  const reportsDelta = prevCount > 0
    ? Math.round(((recentCount - prevCount) / prevCount) * 100)
    : 0

  // No 'verified'/'rejected' status is written anywhere in createReport/
  // updateReport yet — these read as 0 until an admin review flow sets
  // those statuses somewhere.
  const verified = recentDocs.filter(r => r.status === 'verified').length
  const rejected = recentDocs.filter(r => r.status === 'rejected').length
  const verifiedRate = (verified + rejected) > 0
    ? Math.round((verified / (verified + rejected)) * 100)
    : 0

  const oldestPending = recentDocs
    .filter(r => r.status === 'pending' || r.status === 'pending_review')
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())[0]
  const oldestPendingAge = oldestPending
    ? `${Math.floor((now - new Date(oldestPending.createdAt).getTime()) / DAY_MS)}d`
    : '—'

  const trendMap = new Map<string, number>()
  for (let i = 0; i < TREND_DAYS; i++) {
    const day = new Date(now - (TREND_DAYS - 1 - i) * DAY_MS)
    trendMap.set(day.toISOString().slice(0, 10), 0)
  }
  for (const r of recentDocs) {
    const key = String(r.createdAt).slice(0, 10)
    if (trendMap.has(key)) trendMap.set(key, (trendMap.get(key) ?? 0) + 1)
  }
  const trend = Array.from(trendMap.entries()).map(([date, count]) => ({
    label: new Date(date).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' }),
    count,
  }))

  const categoryCounts: Record<string, number> = {}
  for (const r of recentDocs) {
    if (r.category) categoryCounts[r.category] = (categoryCounts[r.category] ?? 0) + 1
  }
  const categories = Object.entries(categoryCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)

  const platformCounts: Record<string, number> = {}
  for (const r of recentDocs) {
    if (r.contactPlatform) platformCounts[r.contactPlatform] = (platformCounts[r.contactPlatform] ?? 0) + 1
  }
  const platforms = Object.entries(platformCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)

  // No state/region field exists on report submissions yet — leaving
  // empty until that field is added to NewReportInput + ReportForm.
  const geography: Array<{ state: string; count: number }> = []

  const clusterDocs = recentWindowSnapshot.docs.filter(d => d.data().status === 'pending_review')
  const clusterList = clusterDocs.slice(0, 10).map(d => {
    const data = d.data()
    return {
      id: d.id,
      signal: 'Shared IP / CGNAT pattern',
      count: data.reportCount ?? 1,
      uniqueReporters: data.distinctReporterCount ?? 1,
      lastSeen: timeAgo(data.createdAt),
    }
  })

  function entityName(r: FirebaseFirestore.DocumentData): string {
    if (r.targetType === 'company') return r.companyName ?? 'Unknown company'
    if (r.targetType === 'website') return r.websiteName || r.websiteUrl || 'Unknown website'
    return r.accountName ?? r.accountNumber ?? 'Unknown account'
  }

  const activity = activitySnapshot.docs.map(d => {
    const r = d.data()
    return {
      id: d.id,
      entity: entityName(r),
      category: r.category ?? '—',
      platform: r.contactPlatform ?? '—',
      status: r.status ?? 'pending',
      when: timeAgo(r.createdAt),
    }
  })

  return {
    kpis: {
      totalReports,
      reportsDelta,
      verified,
      verifiedRate,
      pending,
      oldestPendingAge,
      clusters,
    },
    trend,
    categories,
    platforms,
    geography,
    clusters: clusterList,
    activity,
    flags,
    generatedAt: new Date().toISOString(),
  }
})