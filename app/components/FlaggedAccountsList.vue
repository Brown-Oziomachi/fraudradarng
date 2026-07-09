<!-- app/components/FlaggedAccountsList.vue -->
<script setup lang="ts">
import type { Report } from '#shared/types/report'

const props = defineProps<{ reports: Report[] }>()

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

function firstReported(r: Report) {
  if (!r.createdAt) return '—'
  return new Date(r.createdAt).toLocaleDateString('en-NG', {
    month: 'short',
    year: 'numeric'
  })
}

const sortedReports = computed(() =>
  [...props.reports].sort((a, b) => {
    const aFlagged = a.status === 'flagged' ? 1 : 0
    const bFlagged = b.status === 'flagged' ? 1 : 0
    return bFlagged - aFlagged
  })
)
</script>

<template>
  <section class="flagged-section">
    <div class="section-title-row">
      <svg class="section-icon" viewBox="0 0 24 24" width="22" height="22" fill="none">
        <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <h2 class="section-title">Flagged Accounts</h2>
    </div>

    <div class="flagged-card">
      <p class="flagged-intro">
        The table below lists bank accounts, companies, and websites that have
        been reported for suspected fraudulent activity on Fraud Radar NG,
        ordered by verification status.
      </p>

      <h3 class="subheading">REPORTED ACCOUNTS</h3>

      <div class="table-wrap">
        <table class="flagged-table">
          <thead>
            <tr>
              <th class="col-num">S</th>
              <th>Name</th>
              <th>Bank / Source</th>
              <th>First Reported</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(r, i) in sortedReports" :key="r.id">
              <td class="col-num">{{ i + 1 }}.</td>
              <td>
                <NuxtLink :to="`/reports/${r.id}`" class="row-name">
                  {{ displayName(r) }}
                </NuxtLink>
              </td>
              <td class="row-source">{{ displaySource(r) }}</td>
              <td class="row-date">{{ firstReported(r) }}</td>
              <td>
                <span v-if="r.status === 'flagged'" class="status-chip status-chip--flagged">
                  Highly Suspicious
                </span>
                <span v-else class="status-chip status-chip--pending">
                  Unverified
                </span>
              </td>
            </tr>
            <tr v-if="!sortedReports.length">
              <td colspan="5" class="empty-row">No flagged accounts yet.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<style scoped>
.flagged-section {
  max-width: 920px;
  margin: 0 auto;
  padding: 24px;
}

.section-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}
.section-icon { color: #f87171; flex-shrink: 0; }
.section-title {
  font-family: var(--serif);
  font-size: 22px;
  color: var(--text-1);
}

.flagged-card {
  background: var(--surface);
  border: 1px solid rgba(248, 113, 113, 0.3);
  border-radius: var(--radius);
  padding: 24px;
}

.flagged-intro {
  font-size: 13.5px;
  color: var(--text-2);
  line-height: 1.7;
  font-weight: 300;
  margin-bottom: 20px;
}

.subheading {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #f87171;
  margin-bottom: 12px;
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
.status-chip--pending {
  color: #eab308;
  background: rgba(234, 179, 8, 0.08);
  border: 1px solid rgba(234, 179, 8, 0.25);
}

.empty-row {
  text-align: center;
  color: var(--text-3);
  font-family: var(--mono);
  font-size: 12px;
  padding: 24px 0;
}
</style>