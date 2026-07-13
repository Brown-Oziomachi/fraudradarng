<script setup lang="ts">
useHead({ title: 'Flag a Report — Fraud Radar NG' })
import { getReportDisplayName, getTypeLabel, getCategoryLabel, getDetailFields, getSharedFields } from '~~/shared/utils/reportDisplay'

const route = useRoute()

interface ReportResult {
  id: string
  name: string
  typeLabel?: string
  category?: string
  excerpt?: string
  dateReported?: string
  detailFields?: { label: string; value: string }[]
  sharedFields?: { label: string; value: string }[]
}

const query = ref('')
const searchResults = ref<ReportResult[]>([])
const isSearching = ref(false)
const searchError = ref('')
const selectedReport = ref<ReportResult | null>(null)
let searchTimer: ReturnType<typeof setTimeout>

async function runSearch() {
  const q = query.value.trim()
  if (!q) {
    searchResults.value = []
    return
  }
  isSearching.value = true
  searchError.value = ''
  try {
    const data = await $fetch<ReportResult[]>('/api/reports/search', {
  query: { q }
})
    searchResults.value = data || []
  } catch {
    searchError.value = 'Could not load results. Try again.'
    searchResults.value = []
  } finally {
    isSearching.value = false
  }
}

watch(query, () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(runSearch, 350)
})

function selectReport(report: ReportResult) {
  selectedReport.value = report
  searchResults.value = []
  query.value = ''
}

function clearSelection() {
  selectedReport.value = null
}

onMounted(async () => {
  const prefillId = route.query.reportId as string | undefined
  if (!prefillId) return
  try {
    const raw = await $fetch<any>(`/api/reports/${prefillId}`)
    selectedReport.value = {
      id: raw.id,
      name: getReportDisplayName(raw),
      typeLabel: getTypeLabel(raw),
      category: getCategoryLabel(raw),
      excerpt: raw.description ? raw.description.slice(0, 120) : undefined,
      dateReported: raw.createdAt,
      detailFields: getDetailFields(raw),
      sharedFields: getSharedFields(raw)
    }
  } catch {
    selectedReport.value = {
      id: prefillId,
      name: (route.query.title as string) || 'Selected report',
      category: (route.query.category as string) || undefined
    }
  }
})

const reasons = [
  {
    id: 'wrong-name',
    label: 'Wrong name',
    desc: "The person or business named isn't who this actually happened with."
  },
  {
    id: 'wrong-number',
    label: 'Wrong phone number',
    desc: "The number listed doesn't match, or has since been reassigned to someone else."
  },
  {
    id: 'wrong-account',
    label: 'Wrong account or bank details',
    desc: 'The account number, bank name, or wallet address is incorrect.'
  },
  {
    id: 'outdated',
    label: 'Outdated or already resolved',
    desc: "This has since been refunded, resolved, or is no longer accurate."
  },
  {
    id: 'duplicate',
    label: 'Duplicate report',
    desc: 'This same incident already exists as a separate report.'
  },
  {
    id: 'not-a-scam',
    label: 'Not actually a scam',
    desc: 'This reads like a misunderstanding or dispute, not fraud.'
  },
  {
    id: 'other',
    label: 'Something else',
    desc: "None of the above quite fits — explain in the details below."
  }
]

const selectedReason = ref('')
const details = ref('')
const evidenceLink = ref('')
const evidenceFiles = ref<File[]>([])
const evidencePreviews = ref<string[]>([])
const reporterEmail = ref('')

const MAX_FILES = 4
const MAX_FILE_MB = 5

function onFilesSelected(e: Event) {
  const input = e.target as HTMLInputElement
  const incoming = Array.from(input.files || [])

  const valid = incoming.filter((f) => f.size <= MAX_FILE_MB * 1024 * 1024)
  const combined = [...evidenceFiles.value, ...valid].slice(0, MAX_FILES)
  evidenceFiles.value = combined

  evidencePreviews.value = []
  combined.forEach((file) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') evidencePreviews.value.push(reader.result)
    }
    reader.readAsDataURL(file)
  })

  input.value = ''
}

function removeFile(index: number) {
  evidenceFiles.value.splice(index, 1)
  evidencePreviews.value.splice(index, 1)
}

const isSubmitting = ref(false)
const isSuccess = ref(false)
const errorMessage = ref('')

const detailsMinLength = 10
const canSubmit = computed(
  () =>
    !!selectedReport.value &&
    !!selectedReason.value &&
    details.value.trim().length >= detailsMinLength &&
    !isSubmitting.value
)

async function submitFlag() {
  errorMessage.value = ''

  if (!selectedReport.value) {
    errorMessage.value = 'Pick the report you want to flag first.'
    return
  }
  if (!selectedReason.value) {
    errorMessage.value = 'Choose a reason for the flag.'
    return
  }
  if (details.value.trim().length < detailsMinLength) {
    errorMessage.value = `Add a bit more detail (at least ${detailsMinLength} characters).`
    return
  }

  isSubmitting.value = true
  try {
    await $fetch(`/api/reports/${selectedReport.value.id}/flag`, {
      method: 'POST',
      body: {
        reportId: selectedReport.value.id,
        reportName: selectedReport.value.name,
        reason: selectedReason.value,
        details: details.value.trim(),
        evidenceLink: evidenceLink.value.trim() || null,
        evidenceImages: evidencePreviews.value,
        reporterEmail: reporterEmail.value.trim() || null
      }
    })
    isSuccess.value = true
  } catch (err: any) {
    errorMessage.value = err?.data?.statusMessage || 'Something went wrong. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

function flagAnother() {
  isSuccess.value = false
  selectedReport.value = null
  selectedReason.value = ''
  details.value = ''
  evidenceLink.value = ''
  evidenceFiles.value = []
  evidencePreviews.value = []
  reporterEmail.value = ''
}
</script>

<template>
  <div class="page-shell">
    <div class="page-header">
      <div class="eyebrow"><span class="eyebrow-dot" /> Flag a report on FRNG</div>
      <h1 class="page-title">Spotted something that isn't right?</h1>
      <p class="page-sub">
        Pick the report, tell us exactly what's wrong, and add evidence if you
        have it. A moderator reviews every flag before anything changes.
      </p>
    </div>

    <div v-if="!isSuccess" class="form-card">
      <!-- ============ STEP 1: pick the report ============ -->
      <section class="step">
        <div class="step-head">
          <span class="step-num">1</span>
          <div>
            <h2 class="step-title">Which report is this?</h2>
            <p class="step-hint">Search by name, phone number, or account used in the report.</p>
          </div>
        </div>

        <div v-if="!selectedReport" class="search-wrap">
          <div class="search-input-row">
            <svg class="search-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" stroke-linecap="round" />
            </svg>
            <input
              v-model="query"
              type="text"
              class="input search-input"
              placeholder="e.g. John Adeyemi, 080..., GTB 012..."
            />
          </div>

          <p v-if="searchError" class="error-text">{{ searchError }}</p>

          <div v-if="isSearching" class="search-status">Searching…</div>

          <div v-else-if="query && !searchResults.length" class="search-status">
            No matching reports. Double-check the spelling, or
            <NuxtLink to="/reports" class="inline-link">browse all reports</NuxtLink>.
          </div>

          <ul v-if="searchResults.length" class="search-results">
            <li v-for="r in searchResults" :key="r.id">
              <button type="button" class="search-result" @click="selectReport(r)">
  <span class="result-main">
    <span class="result-name">{{ r.name }}</span>
    <span v-if="r.category" class="result-tag">{{ r.category }}</span>
  </span>
  <span v-if="r.detailFields?.length" class="result-excerpt">
    {{ r.detailFields?.[0]?.value }}
  </span>
</button>
            </li>
          </ul>
        </div>

        <div v-else class="selected-report">
  <div class="selected-report-main">
    <span class="selected-name">{{ selectedReport.name }}</span>
    <span v-if="selectedReport.category" class="result-tag">{{ selectedReport.category }}</span>
  </div>
  <button type="button" class="change-btn" @click="clearSelection">Change</button>
</div>

<div v-if="selectedReport?.detailFields?.length" class="details-panel">
  <h3 class="details-heading">Reported details</h3>
  <dl class="details-list">
    <div v-for="f in selectedReport.detailFields" :key="f.label" class="details-row">
      <dt>{{ f.label }}</dt>
      <dd>{{ f.value }}</dd>
    </div>
  </dl>
</div>

<div v-if="selectedReport?.sharedFields?.length" class="details-panel">
  <h3 class="details-heading">Additional details</h3>
  <dl class="details-list">
    <div v-for="f in selectedReport.sharedFields" :key="f.label" class="details-row">
      <dt>{{ f.label }}</dt>
      <dd>{{ f.value }}</dd>
    </div>
  </dl>
</div>
      </section>

      <!-- ============ STEP 2: reason ============ -->
      <section class="step" :class="{ 'step--disabled': !selectedReport }">
        <div class="step-head">
          <span class="step-num">2</span>
          <div>
            <h2 class="step-title">What's wrong with it?</h2>
            <p class="step-hint">Pick the option that fits best.</p>
          </div>
        </div>

        <div class="reason-grid">
          <label
            v-for="reason in reasons"
            :key="reason.id"
            class="reason-card"
            :class="{ 'reason-card--active': selectedReason === reason.id }"
          >
            <input
              v-model="selectedReason"
              type="radio"
              name="reason"
              :value="reason.id"
              class="reason-radio"
              :disabled="!selectedReport"
            />
            <span class="reason-label">{{ reason.label }}</span>
            <span class="reason-desc">{{ reason.desc }}</span>
          </label>
        </div>
      </section>

      <!-- ============ STEP 3: details ============ -->
      <section class="step" :class="{ 'step--disabled': !selectedReport }">
        <div class="step-head">
          <span class="step-num">3</span>
          <div>
            <h2 class="step-title">Tell us more</h2>
            <p class="step-hint">What specifically is inaccurate, and how do you know?</p>
          </div>
        </div>

        <textarea
          v-model="details"
          class="input textarea"
          rows="5"
          :disabled="!selectedReport"
          placeholder="e.g. This is my shop's phone number, but I've never had this dispute. It looks like it was reused from a previous owner of the line."
        />
        <span class="char-hint" :class="{ 'char-hint--ok': details.trim().length >= detailsMinLength }">
          {{ details.trim().length }}/{{ detailsMinLength }} characters minimum
        </span>
      </section>

      <!-- ============ STEP 4: evidence (optional) ============ -->
      <section class="step" :class="{ 'step--disabled': !selectedReport }">
        <div class="step-head">
          <span class="step-num">4</span>
          <div>
            <h2 class="step-title">Evidence <span class="optional-tag">Optional</span></h2>
            <p class="step-hint">Screenshots, a link, or anything that backs up the correction.</p>
          </div>
        </div>

        <div class="form-group">
          <label for="evidence-link">Link to evidence</label>
          <input
            id="evidence-link"
            v-model="evidenceLink"
            type="url"
            class="input"
            :disabled="!selectedReport"
            placeholder="https://..."
          />
        </div>

        <div class="upload-wrap">
          <label class="upload-btn" :class="{ 'upload-btn--disabled': !selectedReport || evidenceFiles.length >= MAX_FILES }">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M12 16V4M12 4l-4 4M12 4l4 4" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke-linecap="round" />
            </svg>
            Upload screenshots
            <input
              type="file"
              accept="image/*"
              multiple
              class="upload-input"
              :disabled="!selectedReport || evidenceFiles.length >= MAX_FILES"
              @change="onFilesSelected"
            />
          </label>
          <span class="upload-hint">Up to {{ MAX_FILES }} images, {{ MAX_FILE_MB }}MB each</span>
        </div>

        <div v-if="evidencePreviews.length" class="preview-grid">
          <div v-for="(src, i) in evidencePreviews" :key="i" class="preview-item">
            <img :src="src" alt="Evidence preview" class="preview-img" />
            <button type="button" class="preview-remove" @click="removeFile(i)" aria-label="Remove image">✕</button>
          </div>
        </div>
      </section>

      <!-- ============ STEP 5: contact (optional) ============ -->
      <section class="step" :class="{ 'step--disabled': !selectedReport }">
        <div class="step-head">
          <span class="step-num">5</span>
          <div>
            <h2 class="step-title">Your email <span class="optional-tag">Optional</span></h2>
            <p class="step-hint">Only if you'd like to know the outcome — we won't share it.</p>
          </div>
        </div>

        <div class="form-group">
          <input
            v-model="reporterEmail"
            type="email"
            class="input"
            :disabled="!selectedReport"
            placeholder="you@example.com"
          />
        </div>
      </section>

      <p v-if="errorMessage" class="error-text error-text--main">{{ errorMessage }}</p>

      <button type="button" class="btn-submit" :disabled="!canSubmit" @click="submitFlag">
        {{ isSubmitting ? 'Submitting…' : 'Submit flag' }}
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>

    <!-- ============ SUCCESS STATE ============ -->
    <div v-else class="form-card success-card">
      <div class="success-icon">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.4">
          <path class="success-check" d="M20 6 9 17l-5-5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
      <h3 class="success-title">Flag submitted</h3>
      <p class="success-body">
        Thanks for keeping the record accurate. A moderator will review this
        and update the report if the correction checks out.
      </p>
      <div class="success-actions">
        <button type="button" class="btn" @click="flagAnother">Flag another report</button>
        <NuxtLink to="/reports" class="btn btn--accent">Browse reports</NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-shell {
  max-width: 720px;
  margin: 0 auto;
  padding: 56px 24px 100px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}
.eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: var(--mono); font-size: 10px; letter-spacing: 0.12em;
  text-transform: uppercase; color: var(--text-3); margin-bottom: 16px;
}
.eyebrow-dot { width: 5px; height: 5px; background: var(--accent); border-radius: 50%; }

.page-title {
  font-family: var(--serif);
  font-size: clamp(56px, 3.4vw, 79px);
  color: var(--text-1);
  line-height: 1.25;
  margin-bottom: 12px;
}
.page-sub {
  font-size: 14px;
  color: var(--text-3);
  line-height: 1.7;
  font-weight: 300;
  max-width: 480px;
  margin: 0 auto;
}

/* ============ Form card ============ */
.form-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: calc(var(--radius) + 6px);
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 40px;
}
@media (max-width: 600px) {
  .form-card { padding: 28px 20px; gap: 32px; }
}

.step {
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: opacity 0.25s ease;
}
.step--disabled {
  opacity: 0.45;
  pointer-events: none;
}

.step-head {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}
.step-num {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--bg);
  border: 1px solid var(--border-hi);
  color: var(--accent);
  font-family: var(--mono);
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}
.step-title {
  font-family: var(--serif);
  font-size: 17px;
  color: var(--text-1);
  line-height: 1.3;
  display: flex;
  align-items: center;
  gap: 8px;
}
.step-hint {
  font-size: 12.5px;
  color: var(--text-3);
  font-weight: 300;
  margin-top: 3px;
}
.optional-tag {
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-3);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 2px 6px;
}

/* Inputs */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
label {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-3);
}
.input {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 12px 14px;
  color: var(--text-1);
  font-family: var(--sans);
  font-size: 13.5px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  width: 100%;
}
.input::placeholder { color: var(--text-3); }
.input:focus {
  outline: none;
  border-color: var(--accent-bdr, var(--accent));
  box-shadow: 0 0 0 3px rgba(232,255,71,0.12);
}
.input:disabled { cursor: not-allowed; opacity: 0.7; }
.textarea { resize: vertical; }

.char-hint {
  font-family: var(--mono);
  font-size: 10.5px;
  color: var(--text-3);
}
.char-hint--ok { color: #7fd8a8; }

/* Search */
.search-wrap { display: flex; flex-direction: column; gap: 10px; }
.search-input-row {
  position: relative;
  display: flex;
  align-items: center;
}
.search-icon {
  position: absolute;
  left: 14px;
  color: var(--text-3);
}
.search-input { padding-left: 38px; }

.search-status {
  font-size: 12.5px;
  color: var(--text-3);
  font-weight: 300;
}

.search-results {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 260px;
  overflow-y: auto;
}
.search-result {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: left;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 12px 14px;
  cursor: pointer;
  transition: border-color 0.15s ease;
  width: 100%;
}
.search-result:hover { border-color: var(--border-hi); }
.result-main { display: flex; align-items: center; gap: 8px; }
.result-name {
  font-family: var(--serif);
  font-size: 14px;
  color: var(--text-1);
}
.result-tag {
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 2px 7px;
  border-radius: 3px;
  background: var(--accent-dim, rgba(232,255,71,0.08));
  color: var(--accent);
  border: 1px solid rgba(232,255,71,0.2);
}
.result-excerpt {
  font-size: 12px;
  color: var(--text-3);
  font-weight: 300;
  line-height: 1.5;
}

.selected-report {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: var(--bg);
  border: 1px solid var(--accent);
  border-radius: var(--radius);
  padding: 14px 16px;
}
.selected-report-main {
  display: flex;
  align-items: center;
  gap: 10px;
}
.selected-name {
  font-family: var(--serif);
  font-size: 14.5px;
  color: var(--text-1);
}
.change-btn {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--text-3);
  background: none;
  border: none;
  text-decoration: underline;
  cursor: pointer;
  flex-shrink: 0;
}
.change-btn:hover { color: var(--text-1); }

.inline-link {
  color: var(--text-2);
  text-decoration: underline;
}

/* Reasons */
.reason-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
@media (max-width: 560px) {
  .reason-grid { grid-template-columns: 1fr; }
}
.reason-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 12px 14px 12px 34px;
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease;
}
.reason-card:hover { border-color: var(--border-hi); }
.reason-card--active {
  border-color: var(--accent);
  background: var(--accent-dim, rgba(232,255,71,0.06));
}
.reason-radio {
  position: absolute;
  left: 12px;
  top: 14px;
  accent-color: var(--accent);
  width: 14px;
  height: 14px;
}
.reason-label {
  font-family: var(--serif);
  font-size: 13.5px;
  color: var(--text-1);
}
.reason-desc {
  font-size: 11.5px;
  color: var(--text-3);
  font-weight: 300;
  line-height: 1.5;
}

/* Upload */
.upload-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.upload-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--mono);
  font-size: 11.5px;
  color: var(--text-2);
  border: 1px dashed var(--border-hi);
  border-radius: var(--radius);
  padding: 10px 16px;
  cursor: pointer;
  transition: border-color 0.15s ease, color 0.15s ease;
}
.upload-btn:hover { border-color: var(--accent); color: var(--text-1); }
.upload-btn--disabled { opacity: 0.5; pointer-events: none; }
.upload-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}
.upload-hint {
  font-size: 11px;
  color: var(--text-3);
  font-weight: 300;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}
@media (max-width: 500px) {
  .preview-grid { grid-template-columns: repeat(2, 1fr); }
}
.preview-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: var(--radius);
  overflow: hidden;
  border: 1px solid var(--border);
}
.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.preview-remove {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: none;
  background: rgba(10,10,11,0.75);
  color: #fff;
  font-size: 11px;
  line-height: 1;
  cursor: pointer;
}

/* Error text */
.error-text {
  font-family: var(--mono);
  font-size: 11px;
  color: #f87171;
}
.error-text--main { text-align: center; }

/* Submit */
.btn-submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: var(--accent);
  color: #0a0a0b;
  font-weight: 700;
  font-family: var(--mono);
  font-size: 12px;
  letter-spacing: 0.05em;
  border: none;
  border-radius: var(--radius);
  padding: 15px 24px;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
}
.btn-submit:hover:not(:disabled) {
  background: #d4eb3c;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(232,255,71,0.25);
}
.btn-submit:disabled { opacity: 0.4; cursor: not-allowed; }

/* Success */
.success-card {
  align-items: center;
  text-align: center;
  animation: fadeUp 0.5s ease both;
}
.success-icon {
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: color-mix(in srgb, var(--accent) 18%, transparent);
  color: var(--accent);
  margin: 0 auto 16px;
  animation: popIn 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
.success-check {
  stroke-dasharray: 30;
  stroke-dashoffset: 30;
  animation: drawCheck 0.5s ease 0.2s forwards;
}
.success-title {
  font-family: var(--serif);
  font-size: 22px;
  color: var(--text-1);
  margin-bottom: 8px;
}
.success-body {
  font-size: 13.5px;
  color: var(--text-3);
  font-weight: 300;
  max-width: 380px;
  margin: 0 auto 24px;
  line-height: 1.7;
}
.success-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}
.btn {
  display: inline-flex; align-items: center; font-family: var(--mono);
  font-size: 12px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase;
  padding: 12px 22px; border-radius: var(--radius); border: 1px solid var(--border);
  background: var(--bg); color: var(--text-2); text-decoration: none;
  cursor: pointer;
  transition: color 0.15s ease, border-color 0.15s ease, transform 0.15s ease;
}
.btn:hover { color: var(--text-1); border-color: var(--border-hi); transform: translateY(-2px); }
.btn--accent { background: var(--accent); border-color: var(--accent); color: #0a0a0b; font-weight: 700; }
.btn--accent:hover { background: #d4eb3c; border-color: #d4eb3c; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes popIn {
  0% { opacity: 0; transform: scale(0.5); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes drawCheck {
  to { stroke-dashoffset: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .success-card, .success-icon, .success-check, .btn, .btn-submit {
    animation: none !important;
    transition: none !important;
    opacity: 1 !important;
    transform: none !important;
    stroke-dashoffset: 0 !important;
  }
}

.details-panel {
  margin-top: 4px;
  padding: 14px;
  background: var(--surface-2, var(--bg));
  border: 1px solid var(--border);
  border-radius: var(--radius);
}
.details-heading {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-3);
  margin-bottom: 10px;
}
.details-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.details-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 13px;
}
.details-row dt {
  color: var(--text-3);
  font-family: var(--mono);
  font-size: 11px;
  text-transform: none;
  letter-spacing: normal;
}
.details-row dd {
  color: var(--text-1);
  text-align: right;
  word-break: break-word;
  margin: 0;
}
</style>