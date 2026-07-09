<!-- pages/most-flagged.vue -->
<script setup lang="ts">
import type { Report } from '#shared/types/report'

useHead({ title: 'Most Flagged Accounts — Fraud Radar NG' })

const { data: reports, pending, error } = await useLazyFetch<Report[]>('/api/reports', {
  default: () => []
})

function displayName(r: Report) {
  if (r.targetType === 'company') return r.companyName ?? 'Unknown company'
  if (r.targetType === 'website') return r.websiteName || r.websiteUrl || 'Unknown website'
  return r.accountName ?? 'Unknown account'
}

function displaySource(r: Report) {
  if (r.targetType === 'company') return r.companyAddress || '—'
  if (r.targetType === 'website') return r.websiteUrl || '—'
  return r.bankName || '—'
}

function typeLabel(r: Report) {
  if (r.targetType === 'company') return 'Company'
  if (r.targetType === 'website') return 'Website'
  return 'Bank Account'
}

function firstReported(r: Report) {
  if (!r.createdAt) return '—'
  return new Date(r.createdAt).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

function formatAmount(r: Report) {
  if (r.amountInvolved == null) return '—'
  return `₦${r.amountInvolved.toLocaleString()}`
}

// Only accounts that have actually been flagged (auto-escalated by 3+ distinct reporters)
const flaggedOnly = computed(() =>
  (reports.value ?? []).filter(r => r.status === 'flagged')
)

// Most-reported first
const sortedFlagged = computed(() =>
  [...flaggedOnly.value].sort((a, b) => (b.reportCount ?? 0) - (a.reportCount ?? 0))
)

const totalFlagged = computed(() => flaggedOnly.value.length)
const totalReportsAcrossFlagged = computed(() =>
  flaggedOnly.value.reduce((sum, r) => sum + (r.reportCount ?? 0), 0)
)
</script>

<template>
  <div class="page-shell">
    <div class="page-header">
      <div class="eyebrow">
        <span class="eyebrow-dot" /> Community Verified
      </div>
      <h1 class="page-title">Most Flagged Accounts</h1>
      <p class="page-sub">
        These accounts, companies, and websites have been independently reported by
        3 or more different people and have automatically escalated to
        <strong>Highly Suspicious</strong> status.
      </p>

      <div class="stats-row">
        <div class="stat-card">
          <span class="stat-value">{{ totalFlagged }}</span>
          <span class="stat-label">Flagged entities</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ totalReportsAcrossFlagged }}</span>
          <span class="stat-label">Total reports filed</span>
        </div>
      </div>
    </div>

    <p v-if="pending" class="loading-text">Loading flagged accounts...</p>
    <p v-else-if="error" class="empty-text">Something went wrong loading reports.</p>

    <div v-else class="flagged-card">
      <div class="table-wrap">
        <table class="flagged-table">
          <thead>
            <tr>
              <th class="col-num">#</th>
              <th>Name</th>
              <th>Type</th>
              <th>Bank / Source</th>
              <th>Amount Involved</th>
              <th>Reports</th>
              <th>Distinct Reporters</th>
              <th>First Reported</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(r, i) in sortedFlagged" :key="r.id">
              <td class="col-num">{{ i + 1 }}.</td>
              <td>
                <NuxtLink :to="`/reports/${r.id}`" class="row-name">
                  {{ displayName(r) }}
                </NuxtLink>
              </td>
              <td class="row-source">{{ typeLabel(r) }}</td>
              <td class="row-source">{{ displaySource(r) }}</td>
              <td class="row-source">{{ formatAmount(r) }}</td>
              <td class="row-source row-source--strong">{{ r.reportCount ?? 1 }}</td>
              <td class="row-source">{{ r.distinctReporterCount ?? 1 }}</td>
              <td class="row-date">{{ firstReported(r) }}</td>
              <td>
                <span class="status-chip status-chip--flagged">
                  Highly Suspicious
                </span>
              </td>
            </tr>
            <tr v-if="!sortedFlagged.length">
              <td colspan="9" class="empty-row">No flagged accounts yet.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="back-cta">
      <NuxtLink to="/" class="btn btn--accent">← Back to Fraud Radar NG</NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.page-shell {
  max-width: 1120px;
  margin: 0 auto;
  padding: 56px 24px 100px;
}

.page-header {
  margin-bottom: 32px;
}

.eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: var(--mono); font-size: 10px; letter-spacing: 0.12em;
  text-transform: uppercase; color: var(--text-3); margin-bottom: 16px;
}
.eyebrow-dot { width: 5px; height: 5px; background: #f87171; border-radius: 50%; }

.page-title {
  font-family: var(--serif);
  font-size: clamp(48px, 4vw, 80px);
  color: var(--text-1);
  margin-bottom: 14px;
}

.page-sub {
  font-size: 14.5px;
  color: var(--text-2);
  line-height: 1.75;
  font-weight: 300;
  max-width: 640px;
  margin-bottom: 28px;
}

.stats-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.stat-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px 24px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  min-width: 160px;
}
.stat-value {
  font-family: var(--serif);
  font-size: 28px;
  color: #f87171;
}
.stat-label {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-3);
}

.loading-text, .empty-text {
  font-family: var(--mono);
  font-size: 12px;
  color: var(--text-3);
  padding: 24px 0;
}

.flagged-card {
  background: var(--surface);
  border: 1px solid rgba(248, 113, 113, 0.3);
  border-radius: var(--radius);
  padding: 24px;
}

.table-wrap {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid var(--border);
}

.flagged-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.flagged-table thead tr {
  background: #b3413f;
}
.flagged-table th {
  text-align: left;
  padding: 12px 16px;
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #fff;
  white-space: nowrap;
}
.col-num { width: 40px; }

.flagged-table td {
  padding: 12px 16px;
  border-top: 1px solid var(--border);
  color: var(--text-2);
  vertical-align: middle;
  white-space: nowrap;
}
.flagged-table tbody tr:nth-child(even) {
  background: var(--surface-2, rgba(255,255,255,0.02));
}

.row-name {
  color: var(--text-1);
  font-weight: 600;
  text-decoration: none;
}
.row-name:hover { text-decoration: underline; }

.row-source, .row-date {
  font-family: var(--mono);
  font-size: 12px;
  color: var(--text-3);
}
.row-source--strong {
  color: #f87171;
  font-weight: 700;
}

.status-chip {
  display: inline-block;
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 3px;
  white-space: nowrap;
}
.status-chip--flagged {
  color: #f87171;
  background: rgba(248, 113, 113, 0.1);
  border: 1px solid rgba(248, 113, 113, 0.3);
}

.empty-row {
  text-align: center;
  color: var(--text-3);
  font-family: var(--mono);
  font-size: 12px;
  padding: 24px 0;
}

.back-cta {
  margin-top: 32px;
  text-align: center;
}

.btn {
  display: inline-flex; align-items: center; font-family: var(--mono);
  font-size: 12px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;
  padding: 13px 26px; border-radius: var(--radius); border: 1px solid var(--accent);
  background: var(--accent); color: #0a0a0b; text-decoration: none;
  transition: background 0.15s ease, transform 0.15s ease;
}
.btn:hover { background: #d4eb3c; transform: translateY(-2px); }

@media (max-width: 640px) {
  .flagged-table { font-size: 12px; }
  .flagged-table th, .flagged-table td { padding: 10px 12px; }
}
</style>