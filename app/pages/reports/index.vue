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
// ADDED: state filter, mirrors categoryFilter — combined with AND logic
// in filteredReports below so both can be active at once.
const stateFilter = ref<string | null>(null)

const categoryCounts = computed(() => {
  const counts: Record<string, number> = {}
  for (const r of validReports.value) {
    if (r.category && r.category !== 'other') {
      counts[r.category] = (counts[r.category] ?? 0) + 1
    }
  }
  return counts
})

// ADDED: state counts, from currently-loaded reports only (same caveat as
// uniqueTargets above — this is a client-side tally, not a full scan).
const stateCounts = computed(() => {
  const counts: Record<string, number> = {}
  for (const r of validReports.value) {
      // Report may not have a typed `state` property; access dynamically to
      // avoid TypeScript errors while still supporting state-based UI.
      const st = (r as any).state as string | undefined
      if (st) {
        counts[st] = (counts[st] ?? 0) + 1
      }
    }
  return counts
})

const filteredReports = computed(() => {
  return validReports.value.filter(r => {
    if (categoryFilter.value && r.category !== categoryFilter.value) return false
    const st = (r as any).state as string | undefined
    if (stateFilter.value && st !== stateFilter.value) return false
    return true
  })
})

// ============ ADDED: desktop sidebar data + "magical" touches ============
// Nothing above this point was changed — everything below is additive.

// Smoothly counts a display ref up (or down) to match a source ref whenever
// it changes, instead of the number just snapping into place.
function useCountUp(source: Ref<number>) {
  const display = ref(0)

  // requestAnimationFrame only exists in the browser — on the server (SSR)
  // just mirror the value straight through, no animation.
  if (!import.meta.client) {
    watch(source, (newVal) => { display.value = newVal }, { immediate: true })
    return display
  }

  watch(
    source,
    (newVal) => {
      const start = display.value
      const startTime = performance.now()
      const duration = 800
      function tick(now: number) {
        const progress = Math.min((now - startTime) / duration, 1)
        display.value = Math.round(start + (newVal - start) * progress)
        if (progress < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    },
    { immediate: true }
  )
  return display
}

const displayTotal = useCountUp(totalReports)
const displayUnique = useCountUp(uniqueTargets)
const displayHighRisk = useCountUp(highRiskCount)

// "Live Radar" widget — reports filed in the last 24 hours
const reportsToday = computed(() => {
  const now = Date.now()
  return validReports.value.filter(
    r => r.createdAt && now - new Date(r.createdAt).getTime() < 86400000
  ).length
})

// "Trending scam types" mini bar chart, built from the category counts
// that already power the filter chips above.
const categoryBars = computed(() => {
  const entries = Object.entries(categoryCounts.value)
  const max = Math.max(1, ...entries.map(([, count]) => count))
  return entries
    .sort((a, b) => b[1] - a[1])
    .map(([key, count]) => ({
      key,
      label: CATEGORY_LABELS[key] ?? key,
      count,
      pct: Math.round((count / max) * 100)
    }))
})

// ADDED: "Reports by state" mini bar chart — the sidebar's lightweight
// stand-in for a geographic heatmap on a page with no map component.
// Capped to the top 6 states so the widget stays compact.
const stateBars = computed(() => {
  const entries = Object.entries(stateCounts.value)
  const max = Math.max(1, ...entries.map(([, count]) => count))
  return entries
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([key, count]) => ({
      key,
      label: key,
      count,
      pct: Math.round((count / max) * 100)
    }))
})

// "Most flagged right now" — top 3 loaded reports by report count
function targetName(r: Report) {
  if (r.targetType === 'company') return r.companyName ?? 'Unknown company'
  if (r.targetType === 'website') return r.websiteName || r.websiteUrl || 'Unknown website'
  return r.accountName ?? 'Unknown account'
}

const topFlagged = computed(() => {
  return [...validReports.value]
    .sort((a, b) => (b.reportCount ?? 1) - (a.reportCount ?? 1))
    .slice(0, 3)
})

// Rotating safety-tip widget
const safetyTips = [
  'Never send money to "unlock" a prize you did not enter for.',
  'Legitimate banks never ask for your PIN or OTP over the phone.',
  'A verified badge does not mean a seller is legitimate — check reports first.',
  'If a "job offer" asks you to pay for training first, it is not a real job.',
  'Screenshot every conversation before you block a suspected scammer.',
  'Slow down — urgency and pressure are the two biggest scam warning signs.'
]
const currentTipIndex = ref(0)
let tipInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  tipInterval = setInterval(() => {
    currentTipIndex.value = (currentTipIndex.value + 1) % safetyTips.length
  }, 6000)
})

onBeforeUnmount(() => {
  if (tipInterval) clearInterval(tipInterval)
})
</script>

<template>
  <div>

    <div class="page-body">
      <Teleport to="body">
        <ReportsLoader v-if="initialPending" />
      </Teleport>

      <!-- ADDED: layout-grid wraps the existing content in a main column and
           introduces a new sidebar column (desktop only) — nothing inside
           main-col was removed or reordered. -->
      <div class="layout-grid">
        <div class="main-col">

          <!-- COMPOSER STACK — search pill on top, "file a report" row right below,
               replacing the old hero image entirely -->
          <div class="composer-stack">
            <div class="composer-bar">
              <div class="composer-avatar">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                  <path
                    d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
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
            <button type="button" class="category-filter-chip" :class="{ active: !categoryFilter }"
              @click="categoryFilter = null">
              All
            </button>
            <button v-for="(count, key) in categoryCounts" :key="key" type="button" class="category-filter-chip"
              :class="{ active: categoryFilter === key }" @click="categoryFilter = key">
              {{ CATEGORY_LABELS[key] }} ({{ count }})
            </button>
          </div>

          <!-- ADDED: state filter row, same chip pattern as the category
               row above. Only renders once at least one loaded report has
               a state set. -->
          <div v-if="Object.keys(stateCounts).length" class="category-filter-row">
            <button type="button" class="category-filter-chip" :class="{ active: !stateFilter }"
              @click="stateFilter = null">
              All states
            </button>
            <button v-for="(count, key) in stateCounts" :key="key" type="button" class="category-filter-chip"
              :class="{ active: stateFilter === key }" @click="stateFilter = key">
              {{ key }} ({{ count }})
            </button>
          </div>

          <div class="stats-row">
            <div class="stat-pill">
              <div class="stat-num">{{ displayTotal }}</div>
              <div class="stat-label">Reports filed</div>
            </div>
            <div class="stat-pill">
              <div class="stat-num">{{ displayUnique }}</div>
              <div class="stat-label">Unique targets</div>
            </div>
            <div class="stat-pill">
              <div class="stat-num stat-num--danger">{{ displayHighRisk }}</div>
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
            No reports match this filter yet.
          </p>

          <!-- ADDED: card-reveal wrapper gives each card a staggered fade/slide-in;
               ReportCard itself is unchanged. -->
          <div v-for="(report, i) in filteredReports" :key="report.id" class="card-reveal" :style="{ '--i': i }">
            <ReportCard :report="report" />
          </div>

          <div v-if="cursor && !categoryFilter && !stateFilter" class="load-more-row">
            <button type="button" class="load-more-btn" :disabled="loadingMore" @click="loadMore">
              {{ loadingMore ? 'Loading…' : 'Load more reports' }}
            </button>
          </div>
        </div>

        <!-- ADDED: desktop-only sidebar. Hidden below 1080px via CSS so mobile
             layout is completely unaffected. -->
        <aside class="side-col">

          <div class="widget widget--radar">
            <div class="widget-radar-visual">
              <span class="radar-sweep"></span>
              <span class="radar-dot"></span>
            </div>
            <div>
              <span class="widget-radar-num">{{ reportsToday }}</span>
              <span class="widget-radar-label">reports filed today</span>
            </div>
          </div>

          <div v-if="categoryBars.length" class="widget">
            <h3 class="widget-title">Trending scam types</h3>
            <div v-for="bar in categoryBars" :key="bar.key" class="widget-bar-row">
              <span class="widget-bar-label">{{ bar.label }}</span>
              <div class="widget-bar-track">
                <div class="widget-bar-fill" :style="{ width: bar.pct + '%' }"></div>
              </div>
              <span class="widget-bar-count">{{ bar.count }}</span>
            </div>
          </div>

          <!-- ADDED: "Reports by state" widget — a ranked list stand-in
               for a geographic heatmap, reusing the same bar-row styling
               as "Trending scam types" above. -->
          <div v-if="stateBars.length" class="widget">
            <h3 class="widget-title">Reports by state</h3>
            <div v-for="bar in stateBars" :key="bar.key" class="widget-bar-row">
              <span class="widget-bar-label">{{ bar.label }}</span>
              <div class="widget-bar-track">
                <div class="widget-bar-fill" :style="{ width: bar.pct + '%' }"></div>
              </div>
              <span class="widget-bar-count">{{ bar.count }}</span>
            </div>
          </div>

          <div v-if="topFlagged.length" class="widget">
            <h3 class="widget-title">Most flagged right now</h3>
            <NuxtLink v-for="(r, i) in topFlagged" :key="r.id" :to="`/reports/${r.id}`" class="widget-flagged-row">
              <span class="widget-flagged-rank">{{ i + 1 }}</span>
              <span class="widget-flagged-name">{{ targetName(r) }}</span>
              <span class="widget-flagged-count">{{ r.reportCount ?? 1 }}x</span>
            </NuxtLink>
          </div>

          <div class="widget widget--tip">
            <span class="widget-tip-icon">✦</span>
            <Transition name="tip-fade" mode="out-in">
              <p :key="currentTipIndex" class="widget-tip-text">{{ safetyTips[currentTipIndex] }}</p>
            </Transition>
          </div>

          <NuxtLink to="/lookupsearch" class="widget widget--cta">
            <span class="widget-cta-title">Check before you pay</span>
            <span class="widget-cta-sub">Look up a number or account in seconds</span>
            <span class="widget-cta-arrow">→</span>
          </NuxtLink>

        </aside>
      </div>
    </div>
  </div>
</template>

<style scoped>
.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--mono);
  font-size: 20px;
  letter-spacing: 0.12em;
  font-weight: 400;
  text-transform: uppercase;
  margin-bottom: 16px;
}

/* ADDED: pulsing ring around the eyebrow dot — pure CSS, no markup change */
.eyebrow-dot {
  width: 5px;
  height: 5px;
  background: var(--accent);
  border-radius: 50%;
  position: relative;
}

.eyebrow-dot::after {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 1px solid var(--accent);
  opacity: 0.6;
  animation: eyebrowPulse 1.8s ease-out infinite;
}

@keyframes eyebrowPulse {
  0% {
    transform: scale(0.6);
    opacity: 0.6;
  }

  100% {
    transform: scale(2.4);
    opacity: 0;
  }
}

.page-body {
  max-width: 920px;
  margin: 0 auto;
  padding: 32px 24px 40px;
}

/* ADDED: page widens slightly on large screens to make room for the sidebar
   without squeezing the main column below its original width. */
@media (min-width: 1080px) {
  .page-body {
    max-width: 1180px;
  }
}

@media (max-width: 560px) {
  .page-body {
    padding: 24px 16px 40px;
  }
}

/* ADDED: two-column layout grid — main content + sidebar */
.layout-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 28px;
  align-items: start;
}

@media (min-width: 1080px) {
  .layout-grid {
    grid-template-columns: 1fr 320px;
  }
}

.main-col {
  min-width: 0;
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
  /* ADDED: needed so the new radar-sweep pseudo-element stays clipped and
     the icon renders above it */
  position: relative;
  overflow: hidden;
}

/* ADDED: quiet rotating radar sweep behind the flag icon — desktop + mobile */
.composer-avatar::before {
  content: '';
  position: absolute;
  inset: 0;
  background: conic-gradient(from 0deg, rgba(248, 113, 113, 0.4), transparent 55%);
  animation: radarSpin 3.2s linear infinite;
}

.composer-avatar svg {
  position: relative;
  z-index: 1;
}

@keyframes radarSpin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .composer-avatar::before {
    animation: none;
  }
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
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.02em;
  background: var(--surface);
  color: var(--text-3);
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 8px 14px;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
}

.category-filter-chip:hover {
  border-color: var(--border-hi);
  color: var(--text-1);
}

.category-filter-chip.active {
  background: var(--accent);
  border-color: var(--accent);
  color: #0a0a0b;
  font-weight: 600;
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

.stat-num {
  font-family: var(--serif);
  font-size: 26px;
  color: var(--text-1);
}

.stat-num--danger {
  color: #f87171;
}

.stat-label {
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-3);
  margin-top: 4px;
}

.section-header {
  margin-bottom: 20px;
}

.loading-text,
.empty-text {
  font-family: var(--mono);
  font-size: 12px;
  color: var(--text-3);
  padding: 24px 0;
}

/* ADDED: staggered reveal wrapper around each ReportCard */
.card-reveal {
  animation: cardIn 0.5s ease both;
  animation-delay: calc(var(--i) * 70ms);
}

@keyframes cardIn {
  from {
    opacity: 0;
    transform: translateY(14px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .card-reveal {
    animation: none;
  }
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

.load-more-btn:hover:not(:disabled) {
  border-color: var(--accent);
  background: var(--surface-2);
}

.load-more-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ============ ADDED: sidebar widgets (desktop only) ============ */
.side-col {
  display: none;
}

@media (min-width: 1080px) {
  .side-col {
    display: flex;
    flex-direction: column;
    gap: 16px;
    position: sticky;
    top: 96px;
  }
}

.widget {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
  position: relative;
  overflow: hidden;
}

.widget-title {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-3);
  margin: 0 0 12px 0;
}

/* Live radar widget */
.widget--radar {
  display: flex;
  align-items: center;
  gap: 14px;
  background: linear-gradient(135deg, var(--surface) 60%, rgba(74, 222, 128, 0.06));
}

.widget-radar-visual {
  position: relative;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(74, 222, 128, 0.15), transparent 70%);
  border: 1px solid rgba(74, 222, 128, 0.3);
  flex-shrink: 0;
  overflow: hidden;
}

.radar-sweep {
  position: absolute;
  inset: 0;
  background: conic-gradient(from 0deg, rgba(74, 222, 128, 0.55), transparent 60%);
  animation: radarSpin 2.4s linear infinite;
  border-radius: 50%;
}

.radar-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  margin: -2.5px;
  background: #4ade80;
  border-radius: 50%;
  box-shadow: 0 0 8px 2px rgba(74, 222, 128, 0.7);
  animation: radarPulse 2s ease-in-out infinite;
}

@keyframes radarPulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.3;
  }
}

.widget-radar-num {
  display: block;
  font-family: var(--serif);
  font-size: 22px;
  color: var(--text-1);
}

.widget-radar-label {
  font-family: var(--mono);
  font-size: 10px;
  color: var(--text-3);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

@media (prefers-reduced-motion: reduce) {

  .radar-sweep,
  .radar-dot {
    animation: none;
  }
}

/* Trending categories bar chart */
.widget-bar-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.widget-bar-row:last-child {
  margin-bottom: 0;
}

.widget-bar-label {
  flex: 0 0 92px;
  font-family: var(--sans);
  font-size: 11px;
  color: var(--text-2);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.widget-bar-track {
  flex: 1;
  height: 6px;
  background: var(--surface-2);
  border-radius: 4px;
  overflow: hidden;
}

.widget-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), #4ade80);
  border-radius: 4px;
  transition: width 0.6s ease;
}

.widget-bar-count {
  flex: 0 0 20px;
  text-align: right;
  font-family: var(--mono);
  font-size: 10px;
  color: var(--text-3);
}

/* Most flagged right now */
.widget-flagged-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 4px;
  text-decoration: none;
  border-radius: 6px;
  transition: background 0.15s;
}

.widget-flagged-row:hover {
  background: var(--surface-2);
}

.widget-flagged-rank {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--surface-2);
  color: var(--text-3);
  font-family: var(--mono);
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.widget-flagged-name {
  flex: 1;
  min-width: 0;
  font-family: var(--sans);
  font-size: 12.5px;
  color: var(--text-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.widget-flagged-count {
  font-family: var(--mono);
  font-size: 10px;
  color: #f87171;
  flex-shrink: 0;
}

/* Rotating safety tip */
.widget--tip {
  background: linear-gradient(135deg, rgba(232, 255, 71, 0.06), var(--surface));
}

.widget-tip-icon {
  color: var(--accent);
  font-size: 14px;
  margin-bottom: 6px;
  display: inline-block;
}

.widget-tip-text {
  font-family: var(--sans);
  font-size: 12.5px;
  line-height: 1.6;
  color: var(--text-2);
  margin: 0;
}

.tip-fade-enter-active,
.tip-fade-leave-active {
  transition: opacity 0.4s ease;
}

.tip-fade-enter-from,
.tip-fade-leave-to {
  opacity: 0;
}

/* CTA widget */
.widget--cta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-decoration: none;
  border-left: 3px solid var(--accent);
  transition: transform 0.15s, border-color 0.15s;
}

.widget--cta:hover {
  transform: translateY(-2px);
}

.widget-cta-title {
  font-family: var(--serif);
  font-size: 14px;
  color: var(--text-1);
}

.widget-cta-sub {
  font-family: var(--mono);
  font-size: 10.5px;
  color: var(--text-3);
}

.widget-cta-arrow {
  align-self: flex-end;
  color: var(--accent);
  font-family: var(--mono);
  margin-top: 4px;
}
</style>