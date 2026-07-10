<script setup lang="ts">
import { ref } from 'vue'
import type { LookupResult } from '#shared/types/report'

const query = ref('')
const result = ref<LookupResult | null>(null)
const loading = ref(false)
const errorMessage = ref<string | null>(null)

async function runLookup() {
  const trimmed = query.value.trim()
  if (!trimmed) return

  loading.value = true
  errorMessage.value = null
  result.value = null

  try {
    result.value = await $fetch<LookupResult>('/api/community/lookup', {
      query: { q: trimmed },
    })
  } catch (err: any) {
    errorMessage.value =
      err?.statusMessage ?? 'Lookup search is temporarily unavailable. Please try again shortly.'
  } finally {
    loading.value = false
  }
}

function closeResult() {
  result.value = null
  errorMessage.value = null
}

const riskCopy: Record<'high-risk' | 'caution' | 'none', { label: string; class: string }> = {
  'high-risk': { label: 'HIGH RISK — Multiple confirmed reports', class: 'risk-high' },
  caution: { label: 'CAUTION — At least one report filed', class: 'risk-caution' },
  none: { label: 'No reports found', class: 'risk-none' },
}

const defaultRisk = riskCopy.none

function getRiskLevel(level?: string) {
  if (level === 'high-risk' || level === 'caution' || level === 'none') {
    return riskCopy[level]
  }
  return defaultRisk
}

function formatDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>

<template>
  <section
    class="lookup-section"
    :style="{ backgroundImage: `url('/com.png')` }"
  >
    <div class="lookup-overlay" aria-hidden="true" />

    <div class="lookup-inner">
      <div class="glow-orb" aria-hidden="true" />

      <header class="lookup-header">
        <div class="eyebrow-badge">
          <svg class="badge-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 1.5l6.5 2.6v4.7c0 4.4-2.8 8.3-6.5 9.7-3.7-1.4-6.5-5.3-6.5-9.7V4.1L10 1.5z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>
            <path d="M7 10.2l2.1 2.1L13.3 8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="eyebrow-text">Check Before You Pay</span>
        </div>

        <h2 class="lookup-title">
          Search the <span class="accent-word">Threat Registry</span>
        </h2>
        <p class="lookup-subtitle">
          Enter a bank account number, phone number, wallet tag, company name, or website — we'll
          check it against every report filed on FRNG.
        </p>
      </header>

      <form class="search-form" @submit.prevent="runLookup">
        <div class="search-input-wrap">
          <svg class="search-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="9" cy="9" r="6.5" stroke="currentColor" stroke-width="1.4"/>
            <path d="M17 17l-3.2-3.2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
          </svg>
          <input
            v-model="query"
            type="text"
            class="search-input"
            placeholder="e.g. 0123456789, @quickcash, 08012345678"
            :disabled="loading"
          />
        </div>
        <button type="submit" class="search-btn" :disabled="loading || !query.trim()">
          <span>{{ loading ? 'Checking…' : 'Check' }}</span>
          <svg v-if="!loading" class="btn-arrow" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </form>

      <p class="tagline">
        <span class="tagline-dot" />
        One Search. One Report. Many
        <span class="accent-word">Protected.</span>
        <span class="tagline-dot" />
      </p>

      <!-- Result / error now render as an overlay covering the whole card -->
      <Transition name="result-fade">
        <div v-if="errorMessage || result" class="result-overlay">
          <button type="button" class="result-close" aria-label="Close result" @click="closeResult">
            <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
            </svg>
          </button>

          <div v-if="errorMessage" class="error-banner">
            {{ errorMessage }}
          </div>

          <div
            v-else-if="result"
            class="result-panel"
            :class="riskCopy[result?.riskLevel ?? 'none']?.class ?? riskCopy.none.class"
          >
            <div class="result-top">
              <div class="result-top-left">
                <span class="result-identifier">{{ result.normalizedIdentifier }}</span>
                <span class="result-type">{{ result.identifierType.replace('_', ' ') }}</span>
              </div>
            </div>

            <p class="result-verdict">
              {{ riskCopy[result?.riskLevel ?? 'none']?.label ?? riskCopy.none.label }}
            </p>

            <div v-if="result.matchFound" class="result-detail">
              <div class="detail-grid">
                <div class="detail-row">
                  <span class="detail-label">Reports filed</span>
                  <span class="detail-value">{{ result.reportCount }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Distinct reporters</span>
                  <span class="detail-value">{{ result.distinctReporterCount }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">First reported</span>
                  <span class="detail-value">{{ formatDate(result.firstReportedAt) }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Last reported</span>
                  <span class="detail-value">{{ formatDate(result.lastReportedAt) }}</span>
                </div>
              </div>

              <div v-if="result.sampleDescriptions.length" class="sample-block">
                <h4 class="sample-label">What reporters said</h4>
                <ul class="sample-list">
                  <li v-for="(desc, i) in result.sampleDescriptions" :key="i" class="sample-item">
                    {{ desc }}
                  </li>
                </ul>
              </div>
            </div>

            <p v-else class="no-match-note">
              No reports on file for this identifier. That doesn't guarantee safety — always verify
              through official channels before sending money.
            </p>
          </div>
        </div>
      </Transition>
    </div>
  </section>
  <LearnMoreResources />
</template>

<style scoped>
.lookup-section {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 5rem 1.25rem;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
}

/* Dark wash over the photo so the card + copy stay readable, matching the
   moody dark-green tint on the reference hero image */
.lookup-overlay {
  position: absolute;
  inset: 0;
  z-index: 0;
  background:
    linear-gradient(
      180deg,
      color-mix(in srgb, var(--bg) 0%, transparent) 100%,
      color-mix(in srgb, var(--bg) 2%, transparent) 100%
    ),
    color-mix(in srgb, var(--accent) 14%, transparent);
}

.lookup-inner {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 680px;
  background: color-mix(in srgb, var(--surface) 90%, transparent);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--border);
  border-radius: var(--radius, 16px);
  padding: 2.75rem 2.25rem;
  box-shadow:
    0 30px 70px rgba(0, 0, 0, 0.45),
    0 8px 24px color-mix(in srgb, var(--accent) 12%, transparent);
  overflow: hidden;
}
@media (max-width: 560px) {
  .lookup-inner { padding: 2rem 1.5rem; }
}

/* soft radial accent glow, like the radar backdrop */
.glow-orb {
  position: absolute;
  top: -140px;
  left: 50%;
  transform: translateX(-50%);
  width: 480px;
  height: 320px;
  background: radial-gradient(
    ellipse at center,
    color-mix(in srgb, var(--accent) 22%, transparent) 0%,
    transparent 70%
  );
  pointer-events: none;
  z-index: 0;
}

.lookup-header,
.search-form,
.tagline {
  position: relative;
  z-index: 1;
}

.lookup-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.85rem;
  margin-bottom: 2rem;
}

.eyebrow-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  border: 1px solid var(--accent-bdr);
  background: var(--accent-dim);
  border-radius: 999px;
  padding: 0.4rem 0.9rem 0.4rem 0.7rem;
  color: var(--accent);
}

.badge-icon {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}

.eyebrow-text {
  font-family: var(--mono);
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--accent);
}

.lookup-title {
  font-family: var(--serif);
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 400;
  color: var(--text-1);
  letter-spacing: -0.01em;
  line-height: 1.15;
}

.accent-word {
  color: var(--accent);
}

.lookup-subtitle {
  max-width: 34rem;
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--text-2);
  font-weight: 300;
}

/* ============ SEARCH FORM ============ */
.search-form {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}
@media (max-width: 520px) {
  .search-form { flex-direction: column; }
}

.search-input-wrap {
  position: relative;
  flex: 1;
  min-width: 0;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 17px;
  height: 17px;
  color: var(--text-3);
  pointer-events: none;
}

.search-input {
  width: 100%;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--surface);
  padding: 0.9rem 1.1rem 0.9rem 2.6rem;
  font-family: var(--mono);
  font-size: 0.875rem;
  color: var(--text-1);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--accent-bdr);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 16%, transparent);
}

.search-input::placeholder {
  color: var(--text-3);
}

.search-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  border-radius: 999px;
  border: 1px solid var(--accent-bdr);
  background: var(--accent);
  padding: 0.9rem 1.5rem;
  font-family: var(--mono);
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--accent-contrast, #08120a);
  cursor: pointer;
  box-shadow: 0 8px 20px color-mix(in srgb, var(--accent) 35%, transparent);
  transition: filter 0.15s ease, box-shadow 0.15s ease, transform 0.1s ease;
  white-space: nowrap;
  flex-shrink: 0;
}
@media (max-width: 520px) {
  .search-btn { width: 100%; }
}

.btn-arrow {
  width: 14px;
  height: 14px;
}

.search-btn:hover:not(:disabled) {
  filter: brightness(1.08);
  box-shadow: 0 10px 26px color-mix(in srgb, var(--accent) 45%, transparent);
}

.search-btn:active:not(:disabled) {
  transform: translateY(1px);
}

.search-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

/* ============ TAGLINE ============ */
.tagline {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
  font-family: var(--mono);
  font-size: 0.8125rem;
  color: var(--text-2);
}

.tagline-dot {
  width: 5px;
  height: 5px;
  border-radius: 999px;
  background: var(--accent);
  flex-shrink: 0;
}

/* ============ RESULT OVERLAY ============
   Instead of pushing content down, the result now sits on top of the
   entire card (header, form, tagline) as a full-cover overlay. */
.result-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  padding: 2.75rem 2.25rem;
  background: color-mix(in srgb, var(--surface) 97%, transparent);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  overflow-y: auto;
}
@media (max-width: 560px) {
  .result-overlay { padding: 2rem 1.5rem; }
}

.result-close {
  position: absolute;
  top: 1.1rem;
  right: 1.1rem;
  z-index: 3;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-2);
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}

.result-close svg {
  width: 15px;
  height: 15px;
}

.result-close:hover {
  background: var(--surface-2, var(--surface));
  border-color: var(--accent-bdr);
  color: var(--accent);
}

/* Fade/scale transition for the overlay */
.result-fade-enter-active,
.result-fade-leave-active {
  transition: opacity 0.2s ease;
}
.result-fade-enter-from,
.result-fade-leave-to {
  opacity: 0;
}

/* ============ ERROR ============ */
.error-banner {
  margin-top: 2.5rem;
  border-radius: var(--radius, 6px);
  border: 1px solid rgba(255, 176, 32, 0.35);
  background: rgba(255, 176, 32, 0.08);
  padding: 0.875rem 1rem;
  font-size: 0.875rem;
  color: #ffb020;
}

/* ============ RESULT PANEL ============ */
.result-panel {
  margin-top: 2.5rem;
  border-radius: var(--radius, 8px);
  border: 1px solid var(--border);
  background: var(--surface);
  padding: 1.75rem;
}

.result-panel.risk-high { border-color: rgba(255, 59, 48, 0.4); }
.result-panel.risk-caution { border-color: rgba(255, 176, 32, 0.35); }
.result-panel.risk-none { border-color: var(--accent-bdr); }

.result-top {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
}

.result-top-left {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  flex-wrap: wrap;
}

.result-identifier {
  font-family: var(--mono);
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-1);
  word-break: break-word;
}

.result-type {
  font-family: var(--mono);
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-3);
  border: 1px solid var(--border);
  border-radius: 2px;
  padding: 0.15rem 0.45rem;
  white-space: nowrap;
}

.result-verdict {
  margin-bottom: 1.25rem;
  font-family: var(--mono);
  font-size: 0.9375rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.risk-high .result-verdict { color: #ff6b60; }
.risk-caution .result-verdict { color: #ffb020; }
.risk-none .result-verdict { color: var(--accent); }

.result-detail {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 1.5rem;
}
@media (max-width: 420px) {
  .detail-grid { grid-template-columns: 1fr; }
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border);
  font-size: 0.8125rem;
  gap: 0.75rem;
}

.detail-label { color: var(--text-3); }

.detail-value {
  font-family: var(--mono);
  color: var(--text-1);
  text-align: right;
}

.sample-block { padding-top: 0.25rem; }

.sample-label {
  margin-bottom: 0.75rem;
  font-family: var(--mono);
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-3);
}

.sample-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  list-style: none;
}

.sample-item {
  font-size: 0.8125rem;
  line-height: 1.55;
  color: var(--text-2);
  padding: 0.75rem 0.875rem;
  background: var(--surface-2, var(--surface));
  border: 1px solid var(--border);
  border-radius: var(--radius, 6px);
}

.no-match-note {
  font-size: 0.8125rem;
  line-height: 1.55;
  color: var(--text-3);
}
</style>