<script setup lang="ts">
import type { Report } from '#shared/types/report'
import { onBeforeRouteLeave } from 'vue-router'

useHead({ title: 'Browse Reports — Fraud Radar NG' })
const allReports = ref<Report[]>([])
const cursor = ref<string | null>(null)
const initialPending = ref(true)
const loadingMore = ref(false)

const totalReports = ref(0)
const highRiskCount = ref(0)

const listCache = useReportsListCache()
const detailCache = useReportDetailCache()

function cacheReports(reports: Report[]) {
  for (const r of reports) {
    if (r?.id) detailCache.value[r.id] = r
  }
}
async function fetchPage(afterCursor?: string) {
  const query = afterCursor ? `?cursor=${afterCursor}` : ''
  return await $fetch<{ reports: Report[]; nextCursor: string | null }>(`/api/reports${query}`)
}

async function fetchStats() {
  return await $fetch<{ totalReports: number; highRiskCount: number }>('/api/reports/stats')
}
onMounted(async () => {
  if (listCache.value.loaded) {
    // Came back from a report — restore instantly, no refetch, no loader
    allReports.value = listCache.value.reports
    cursor.value = listCache.value.cursor
    totalReports.value = listCache.value.totalReports
    highRiskCount.value = listCache.value.highRiskCount
    initialPending.value = false
    await nextTick()
    window.scrollTo(0, listCache.value.scrollY)
    return
  }

  try {
    const [firstPage, stats] = await Promise.all([fetchPage(), fetchStats()])
    allReports.value = firstPage.reports
    cursor.value = firstPage.nextCursor
    totalReports.value = stats.totalReports
    highRiskCount.value = stats.highRiskCount
    cacheReports(firstPage.reports)
  } finally {
    initialPending.value = false
  }
})

async function loadMore() {
  if (!cursor.value || loadingMore.value) return
  loadingMore.value = true
  try {
    const { reports, nextCursor } = await fetchPage(cursor.value)
    allReports.value.push(...reports)
    cursor.value = nextCursor
    cacheReports(reports)
  } finally {
    loadingMore.value = false
  }
}

onBeforeRouteLeave(() => {
  listCache.value = {
    reports: allReports.value,
    cursor: cursor.value,
    totalReports: totalReports.value,
    highRiskCount: highRiskCount.value,
    scrollY: window.scrollY,
    loaded: true
  }
})

const validReports = computed(() => allReports.value.filter(Boolean))

// Unique targets is computed from currently-loaded reports only, since
// true platform-wide uniqueness would require reading every document.
// See note below for a scalable alternative if this needs to be exact.
const uniqueTargets = computed(() => {
  const identifiers = validReports.value
    .map(r => {
      if (r.targetType === 'company') return r.companyName
      if (r.targetType === 'website') return r.websiteUrl
      return r.bankName
    })
    .filter(Boolean)
  return new Set(identifiers).size
})

const CATEGORY_LABELS: Record<string, string> = {
  fintech_ussd: 'Fintech & USSD',
  social_commerce: 'Social commerce',
  visa_travel: 'Visa & travel',
  job_ponzi: 'Job & Ponzi'
}

const categoryFilter = ref<string | null>(null)

const categoryCounts = computed(() => {
  const counts: Record<string, number> = {}
  for (const r of validReports.value) {
    if (r.category && r.category !== 'other') {
      counts[r.category] = (counts[r.category] ?? 0) + 1
    }
  }
  return counts
})

const filteredReports = computed(() => {
  if (!categoryFilter.value) return validReports.value
  return validReports.value.filter(r => r.category === categoryFilter.value)
})
</script>

<template>
  <div>
    
    <div class="page-body">
      <Teleport to="body">
        <ReportsLoader v-if="initialPending" />
      </Teleport>

      <!-- COMPOSER STACK — search pill on top, "file a report" row right below,
           replacing the old hero image entirely -->
      <div class="composer-stack">
        <div class="composer-bar">
          <div class="composer-avatar">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
              <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="composer-search">
            <SearchBar />
          </div>
        </div>

        <NuxtLink to="/report/new" class="file-report-row">
          <span class="file-report-icon">+</span>
          <div class="file-report-text">
            <span class="file-report-title">File a report</span>
            <span class="file-report-sub">Warn others before they lose money</span>
          </div>
          <span class="file-report-arrow">→</span>
        </NuxtLink>
      </div>

      <div v-if="Object.keys(categoryCounts).length" class="category-filter-row">
        <button
          type="button"
          class="category-filter-chip"
          :class="{ active: !categoryFilter }"
          @click="categoryFilter = null"
        >
          All
        </button>
        <button
          v-for="(count, key) in categoryCounts"
          :key="key"
          type="button"
          class="category-filter-chip"
          :class="{ active: categoryFilter === key }"
          @click="categoryFilter = key"
        >
          {{ CATEGORY_LABELS[key] }} ({{ count }})
        </button>
      </div>

      <div class="stats-row">
        <div class="stat-pill">
          <div class="stat-num">{{ totalReports }}</div>
          <div class="stat-label">Reports filed</div>
        </div>
        <div class="stat-pill">
          <div class="stat-num">{{ uniqueTargets }}</div>
          <div class="stat-label">Unique targets</div>
        </div>
        <div class="stat-pill">
          <div class="stat-num stat-num--danger">{{ highRiskCount }}</div>
          <div class="stat-label">High-risk accounts</div>
        </div>
      </div>
      
      <div class="section-header">
        <div class="eyebrow">
          <span class="eyebrow-dot" />
          PUBLIC CITIZEN REPORTS
        </div>
      </div>

      <p v-if="!initialPending && !validReports.length" class="empty-text">
        No reports yet — be the first to flag a suspicious account.
      </p>
      <p v-else-if="!initialPending && !filteredReports.length" class="empty-text">
        No reports match this category yet.
      </p>

      <ReportCard v-for="report in filteredReports" :key="report.id" :report="report" />

      <div v-if="cursor && !categoryFilter" class="load-more-row">
        <button
          type="button"
          class="load-more-btn"
          :disabled="loadingMore"
          @click="loadMore"
        >
          {{ loadingMore ? 'Loading…' : 'Load more reports' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: var(--mono); font-size: 20px; letter-spacing: 0.12em; font-weight: 400;
  text-transform: uppercase;
  margin-bottom: 16px;
}
.eyebrow-dot { width: 5px; height: 5px; background: var(--accent); border-radius: 50%; }

.page-body {
  max-width: 920px;
  margin: 0 auto;
  padding: 32px 24px 40px;
}

@media (max-width: 560px) {
  .page-body { padding: 24px 16px 40px; }
}

/* COMPOSER STACK — the Facebook-feed-style pair of bars replacing the hero */
.composer-stack {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 28px;
}

.composer-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 12px 14px;
}

.composer-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(248, 113, 113, 0.1);
  border: 1px solid rgba(248, 113, 113, 0.3);
  color: #f87171;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.composer-search {
  flex: 1;
  min-width: 0;
}

.file-report-row {
  display: flex;
  align-items: center;
  gap: 14px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-left: 3px solid var(--accent);
  border-radius: var(--radius);
  padding: 14px 16px;
  text-decoration: none;
  transition: border-color 0.15s, background 0.15s;
}
.file-report-row:hover {
  background: var(--surface-2);
  border-color: var(--border-hi);
  border-left-color: var(--accent);
}

.file-report-icon {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--accent);
  color: #0a0a0b;
  font-family: var(--mono);
  font-size: 18px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.file-report-text {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.file-report-title {
  font-family: var(--serif);
  font-size: 15px;
  color: var(--text-1);
}
.file-report-sub {
  font-family: var(--mono);
  font-size: 10.5px;
  color: var(--text-3);
  margin-top: 2px;
}

.file-report-arrow {
  font-family: var(--mono);
  color: var(--text-3);
  flex-shrink: 0;
}

.category-filter-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}
.category-filter-chip {
  font-family: var(--mono); font-size: 11px; letter-spacing: 0.02em;
  background: var(--surface); color: var(--text-3);
  border: 1px solid var(--border); border-radius: 999px;
  padding: 8px 14px; cursor: pointer;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
}
.category-filter-chip:hover { border-color: var(--border-hi); color: var(--text-1); }
.category-filter-chip.active {
  background: var(--accent); border-color: var(--accent);
  color: #0a0a0b; font-weight: 600;
}

.stats-row {
  display: flex;
  gap: 12px;
  margin-top: 8px;
  margin-bottom: 36px;
  flex-wrap: wrap;
}
.stat-pill {
  flex: 1;
  min-width: 140px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
  text-align: center;
}
.stat-num { font-family: var(--serif); font-size: 26px; color: var(--text-1); }
.stat-num--danger { color: #f87171; }
.stat-label {
  font-family: var(--mono); font-size: 9px; letter-spacing: 0.06em;
  text-transform: uppercase; color: var(--text-3); margin-top: 4px;
}

.section-header { margin-bottom: 20px; }

.loading-text, .empty-text {
  font-family: var(--mono); font-size: 12px; color: var(--text-3);
  padding: 24px 0;
}

.load-more-row {
  display: flex;
  justify-content: center;
  margin-top: 24px;
  padding-bottom: 20px;
}

.impact-strip {
  position: relative;
  overflow: hidden;
  min-height: 420px;
  display: flex;
  align-items: center;
  background: var(--bg);
}

.load-more-btn {
  font-family: var(--mono);
  font-size: 12px;
  letter-spacing: 0.03em;
  background: var(--surface);
  color: var(--text-1);
  border: 1px solid var(--border-hi);
  border-radius: 8px;
  padding: 12px 28px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.load-more-btn:hover:not(:disabled) { border-color: var(--accent); background: var(--surface-2); }
.load-more-btn:disabled { opacity: 0.6; cursor: not-allowed; }
</style>