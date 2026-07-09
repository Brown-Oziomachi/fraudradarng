<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ScamBreakdown, ThreatLevel } from '~/types/community'

interface Props {
  breakdowns?: ScamBreakdown[]
}

const props = withDefaults(defineProps<Props>(), {
  breakdowns: () => [],
})

const openId = ref<string | null>(null)
const activeCategory = ref<string>('all')

function toggle(id: string) {
  openId.value = openId.value === id ? null : id
}

const categories = computed(() => {
  const set = new Set(props.breakdowns.map((b) => b.category))
  return ['all', ...Array.from(set)]
})

const filtered = computed(() => {
  if (activeCategory.value === 'all') return props.breakdowns
  return props.breakdowns.filter((b) => b.category === activeCategory.value)
})

const threatLabels: Record<ThreatLevel, string> = {
  critical: 'Critical',
  high: 'High',
  moderate: 'Moderate',
}

function caseId(id: string) {
  return id.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6).toUpperCase().padEnd(6, '0')
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-NG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
</script>

<template>
  <section class="scam-feed">
    <header class="feed-header">
      <div class="eyebrow">
        <span class="pulse" />
        <span class="eyebrow-text">Threat Registry — Read Only</span>
      </div>
      <h2 class="feed-title">Scam Breakdown Feed</h2>
      <p class="feed-subtitle">
        Verified fraud patterns compiled from community reports and cross-checked by moderators.
        Scan a headline, expand for the full case file.
      </p>
    </header>

    <div class="filter-bar">
      <span class="filter-label">Filter</span>
      <div class="chip-row">
        <button
          v-for="cat in categories"
          :key="cat"
          type="button"
          class="chip"
          :class="{ 'chip-active': activeCategory === cat }"
          @click="activeCategory = cat"
        >
          {{ cat === 'all' ? 'All reports' : cat }}
        </button>
      </div>
    </div>

    <ul class="feed-list">
      <li v-for="item in filtered" :key="item.id" class="case-card">
        <div class="case-tab" :class="`tab-${item.threatLevel}`">
          <span class="tab-text">CASE {{ caseId(item.id) }}</span>
        </div>

        <div class="case-body-wrap">
          <button
            type="button"
            class="case-header"
            :aria-expanded="openId === item.id"
            @click="toggle(item.id)"
          >
            <div class="case-main">
              <div class="case-meta-row">
                <span class="case-category">{{ item.category }}</span>

                <span class="blip-indicator" :aria-label="`${threatLabels[item.threatLevel]} threat`">
                  <span class="blip-dot" :class="`dot-${item.threatLevel}`">
                    <span class="blip-ring" :class="`ring-${item.threatLevel}`" />
                  </span>
                  <span class="blip-label" :class="`text-${item.threatLevel}`">
                    {{ threatLabels[item.threatLevel] }}
                  </span>
                </span>
              </div>

              <h3 class="case-title">{{ item.title }}</h3>
              <p class="case-summary">{{ item.summary }}</p>

              <div class="case-footer">
                <span>{{ item.reportedCount.toLocaleString() }} reports filed</span>
                <span class="footer-divider">·</span>
                <span>Last seen {{ formatDate(item.lastSeen) }}</span>
                <span class="footer-divider">·</span>
                <span class="platform-list">
                  <span v-for="p in item.platformsInvolved" :key="p" class="platform-pill">{{ p }}</span>
                </span>
              </div>
            </div>

            <span class="expand-indicator" :class="{ 'expand-open': openId === item.id }">
              <span class="expand-bracket expand-bracket-l">{{ openId === item.id ? '−' : '+' }}</span>
            </span>
          </button>

          <div v-show="openId === item.id" class="case-body">
            <div class="body-grid">
              <div class="body-col">
                <h4 class="body-label">Modus Operandi</h4>
                <ol class="steps">
                  <li v-for="step in item.modusOperandi" :key="step.order" class="step">
                    <span class="step-index">{{ String(step.order).padStart(2, '0') }}</span>
                    <span class="step-text">{{ step.description }}</span>
                  </li>
                </ol>
              </div>

              <div class="body-col">
                <h4 class="body-label label-danger">Red Flags</h4>
                <ul class="flags">
                  <li v-for="(flag, i) in item.redFlags" :key="i" class="flag-item">
                    <span class="flag-marker" />
                    <span>{{ flag }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>

    <p v-if="filtered.length === 0" class="empty-state">No cases logged in this category yet.</p>
  </section>
</template>

<style scoped>
.scam-feed {
  width: 100%;
}

.feed-header {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin-bottom: 2rem;
}

.eyebrow {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pulse {
  position: relative;
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: var(--accent);
}

.pulse::after {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 999px;
  border: 1px solid var(--accent);
  animation: pulse-ring 2.2s ease-out infinite;
}

@keyframes pulse-ring {
  0% { transform: scale(0.6); opacity: 0.8; }
  100% { transform: scale(2.2); opacity: 0; }
}

.eyebrow-text {
  font-family: var(--mono);
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--text-2);
}

.feed-title {
  font-family: var(--serif);
  font-size: 2rem;
  font-weight: 400;
  color: var(--text-1);
  letter-spacing: -0.01em;
}

.feed-subtitle {
  max-width: 38rem;
  font-size: 0.9375rem;
  line-height: 1.55;
  color: var(--text-2);
}

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  padding-bottom: 1rem;
  margin-bottom: 1.25rem;
  border-bottom: 1px solid var(--border);
}

.filter-label {
  font-family: var(--mono);
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--text-3);
}

.chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.chip {
  border-radius: 2px;
  border: 1px solid var(--border);
  padding: 0.3rem 0.65rem;
  font-family: var(--mono);
  font-size: 0.6875rem;
  letter-spacing: 0.02em;
  color: var(--text-2);
  background: transparent;
  cursor: pointer;
  transition: border-color 0.15s ease, color 0.15s ease, background 0.15s ease;
}

.chip:hover {
  border-color: var(--text-2);
  color: var(--text-1);
}

.chip-active {
  border-color: var(--accent);
  background: var(--accent-dim);
  color: var(--accent);
}

/* ---------- Case cards (dossier) ---------- */

.feed-list {
  display: flex;
  flex-direction: column;
  gap: 1.125rem;
  list-style: none;
}

.case-card {
  display: flex;
  align-items: stretch;
  border-radius: 2px;
  border: 1px solid var(--border);
  background: var(--surface);
  overflow: hidden;
}

.case-tab {
  flex-shrink: 0;
  width: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid var(--border);
  background: var(--surface-2);
}

.tab-text {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-family: var(--mono);
  font-size: 0.625rem;
  letter-spacing: 0.14em;
  padding: 0.75rem 0;
  color: var(--text-3);
}

.tab-critical { border-right-color: rgba(255, 59, 48, 0.5); }
.tab-critical .tab-text { color: #ff6b60; }
.tab-high { border-right-color: rgba(255, 159, 10, 0.5); }
.tab-high .tab-text { color: #ff9f0a; }
.tab-moderate { border-right-color: rgba(255, 212, 38, 0.5); }
.tab-moderate .tab-text { color: #ffd426; }

.case-body-wrap {
  flex: 1;
  min-width: 0;
}

.case-header {
  display: flex;
  width: 100%;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.125rem 1.25rem;
  text-align: left;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background 0.15s ease;
}

.case-header:hover {
  background: var(--surface-2);
}

.case-main {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
}

.case-meta-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}

.case-category {
  font-family: var(--mono);
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-2);
  border: 1px solid var(--border);
  border-radius: 2px;
  padding: 0.0625rem 0.4rem;
}

.blip-indicator {
  display: flex;
  align-items: center;
  gap: 0.4375rem;
  margin-left: auto;
}

.blip-dot {
  position: relative;
  width: 7px;
  height: 7px;
  border-radius: 999px;
}

.blip-ring {
  position: absolute;
  inset: -4px;
  border-radius: 999px;
  border: 1px solid currentColor;
  animation: blip-pulse 2s ease-out infinite;
}

@keyframes blip-pulse {
  0% { transform: scale(0.7); opacity: 0.9; }
  100% { transform: scale(2); opacity: 0; }
}

.dot-critical, .ring-critical { background: #ff3b30; color: #ff3b30; }
.dot-high, .ring-high { background: #ff9f0a; color: #ff9f0a; }
.dot-moderate, .ring-moderate { background: #ffd426; color: #ffd426; }

.blip-label {
  font-family: var(--mono);
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.text-moderate { color: #ffd426; }
.text-high { color: #ff9f0a; }
.text-critical { color: #ff3b30; }

.case-title {
  font-family: var(--serif);
  font-size: 1.125rem;
  font-weight: 400;
  color: var(--text-1);
  line-height: 1.3;
}

.case-summary {
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--text-2);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.case-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
  padding-top: 0.25rem;
  font-family: var(--mono);
  font-size: 0.6875rem;
  color: var(--text-3);
}

.footer-divider {
  color: var(--border);
}

.platform-list {
  display: flex;
  gap: 0.3rem;
}

.platform-pill {
  border: 1px solid var(--border);
  border-radius: 2px;
  padding: 0.05rem 0.35rem;
}

.expand-indicator {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border);
  border-radius: 2px;
  font-family: var(--mono);
  font-size: 0.9375rem;
  color: var(--text-3);
  transition: border-color 0.15s ease, color 0.15s ease;
}

.expand-open {
  border-color: var(--accent);
  color: var(--accent);
}

.case-body {
  border-top: 1px solid var(--border);
  padding: 1.25rem;
  background: var(--surface-2);
}

.body-grid {
  display: grid;
  gap: 1.75rem;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .body-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.body-label {
  margin-bottom: 0.875rem;
  font-family: var(--mono);
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-3);
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border);
}

.label-danger {
  color: #ff6b60;
}

.steps {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  list-style: none;
}

.step {
  display: flex;
  gap: 0.75rem;
}

.step-index {
  flex-shrink: 0;
  font-family: var(--mono);
  font-size: 0.75rem;
  color: var(--accent);
  padding-top: 0.0625rem;
}

.step-text {
  font-size: 0.875rem;
  line-height: 1.55;
  color: var(--text-2);
}

.flags {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  list-style: none;
}

.flag-item {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--text-1);
}

.flag-marker {
  flex-shrink: 0;
  margin-top: 0.4rem;
  width: 5px;
  height: 5px;
  background: #ff3b30;
}

.empty-state {
  padding: 3rem 0;
  text-align: center;
  font-family: var(--mono);
  font-size: 0.8125rem;
  color: var(--text-3);
}

@media (prefers-reduced-motion: reduce) {
  .blip-ring {
    animation: none;
  }
}
</style>