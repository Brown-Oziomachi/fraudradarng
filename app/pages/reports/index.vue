<script setup lang="ts">
import type { Report } from '#shared/types/report'

useHead({ title: 'Browse Reports — Fraud Radar NG' })

const { data: reports, pending } = await useLazyFetch<Report[]>('/api/reports')

const validReports = computed(() => (reports.value ?? []).filter(Boolean))

const totalReports = computed(() => validReports.value.length)

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

const highRiskCount = computed(() =>
  validReports.value.filter(r => (r.reportCount ?? 1) >= 3).length
)

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
    <section class="browse-hero">
      <div class="browse-bg-image" />
      <div class="browse-overlay" />

      <div class="browse-hero-content">
        <div class="eyebrow">
          <span class="eyebrow-dot" />
          The reality of bank transfer fraud
        </div>
        <h1 class="browse-title">Fraud doesn't announce itself.</h1>
        <p class="browse-desc">
          Most victims don't realize they've been scammed until the money
          is already gone. A fake urgency, a convincing story, a familiar-
          sounding bank name — and a transfer that can't be undone. This
          page exists so the next transfer isn't made blind.
        </p>
      </div>

      <svg class="browse-curve" viewBox="0 0 1440 100" preserveAspectRatio="none">
        <path d="M0,0 C480,100 960,100 1440,0 L1440,100 L0,100 Z" fill="var(--bg)" />
      </svg>
    </section>

    <div class="page-body">
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
          All reports
        </div>
        <SearchBar />
      </div>

      <p v-if="pending" class="loading-text">Loading Fraud reports...</p>
      <p v-else-if="!validReports.length" class="empty-text">
        No reports yet — be the first to flag a suspicious account.
      </p>
      <p v-else-if="!filteredReports.length" class="empty-text">
        No reports match this category yet.
      </p>
      <ReportCard v-for="report in filteredReports" :key="report.id" :report="report" />
    </div>
  </div>
</template>

<style scoped>
.eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: var(--mono); font-size: 10px; letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 16px;
}
.eyebrow-dot { width: 5px; height: 5px; background: var(--accent); border-radius: 50%; }

.browse-hero {
  position: relative;
  overflow: hidden;
  min-height: 420px;
  display: flex;
  align-items: center;
}

.browse-bg-image {
  position: absolute;
  inset: 0;
  background-image: url('/all.png');
  background-size: cover;
  background-position: center;
  filter: grayscale(10%);
  z-index: 0;
}

.browse-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(10,10,11,0.94) 0%,
    rgba(10,10,11,0.75) 10%,
    rgba(10,10,11,0.35) 100%
  );
  z-index: 1;
}

.browse-hero-content {
  position: relative;
  z-index: 2;
  max-width: 920px;
  margin: 0 auto;
  padding: 70px 24px 90px;
  width: 100%;
}

@media (max-width: 640px) {
  .browse-hero { min-height: 380px; }
  .browse-hero-content { padding: 50px 20px 80px; }
  .browse-overlay {
    background: linear-gradient(
      180deg,
      rgba(10,10,11,0.9) 0%,
      rgba(10,10,11,0.6) 100%
    );
  }
}

.browse-title {
  font-family: var(--serif);
  font-size: clamp(50px, 8.9vw, 76px);
  color: rgba(255, 255, 255, 0.92);
  line-height: 1.15;
  margin-bottom: 16px;
}

.browse-desc {
  font-size: 14px;
  color: rgba(200, 200, 200, 0.9);
  line-height: 1.75;
  font-weight: 300;
  max-width: 460px;
}

.browse-curve {
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 60px;
  z-index: 2;
  display: block;
}

.page-body {
  max-width: 920px;
  margin: 0 auto;
  padding: 0 24px 40px;
}

@media (max-width: 560px) {
  .page-body { padding: 0 16px 40px; }
}

.category-filter-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 32px;
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
</style>