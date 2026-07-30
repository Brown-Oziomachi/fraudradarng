<script setup lang="ts">
import type { Report } from '#shared/types/report'

const props = defineProps<{
  report: Report
}>()

// Unifies the "main" report and every entry in additionalReports into one
// flat, numbered list — #1 is always the original report, #2+ are each
// additional submission in the order they were filed. submissionId is
// carried through here (may be undefined on reports predating that
// system) so per-reporter ownership/edit checks below have something
// concrete to match against.
const reportersList = computed(() => {
  if (!props.report) return []

  const list = [
    {
      number: 1,
      submissionId: (props.report as any).submissionId as string | undefined,
      description: props.report.description ?? '',
      amountInvolved: props.report.amountInvolved ?? null,
      contactPlatform: props.report.contactPlatform ?? '',
      createdAt: props.report.createdAt ?? '',
      evidenceUrls: props.report.evidenceUrls ?? []
    }
  ]

  const additional = props.report.additionalReports ?? []
  additional.forEach((sub: any, i: number) => {
    list.push({
      number: i + 2,
      submissionId: sub.submissionId as string | undefined,
      description: sub.description ?? '',
      amountInvolved: sub.amountInvolved ?? null,
      contactPlatform: sub.contactPlatform ?? '',
      createdAt: sub.createdAt ?? '',
      evidenceUrls: sub.evidenceUrls ?? []
    })
  })

  return list
})

// ============ OWNERSHIP: which of these reporters is "me"? ============
// Populated once on mount from localStorage. A submissionId shows up here
// only if this exact browser made that exact submission — used to decide
// whether an Edit control appears on a given reporter's row/detail, never
// trusted server-side (the actual PATCH endpoint re-verifies via
// fingerprint regardless of what's shown in the UI).
const ownedSubmissionIds = ref<Set<string>>(new Set())

onMounted(() => {
  const owned = new Set<string>()

  try {
    const mine: { reportId: string; submissionId: string }[] =
      JSON.parse(localStorage.getItem('myReportSubmissions') || '[]')
    mine
      .filter(m => m.reportId === props.report.id)
      .forEach(m => owned.add(m.submissionId))
  } catch { }

  // Legacy fallback for reports/browsers that predate the submissionId
  // system — a match here only ever means "I was the original reporter",
  // so it only ever grants ownership of the main submission (#1).
  try {
    const legacy: string[] = JSON.parse(localStorage.getItem('myReportIds') || '[]')
    const mainSubmissionId = (props.report as any).submissionId as string | undefined
    if (legacy.includes(props.report.id) && mainSubmissionId) {
      owned.add(mainSubmissionId)
    }
  } catch { }

  ownedSubmissionIds.value = owned
})

function isOwnedReporter(r: { submissionId?: string }): boolean {
  return !!r.submissionId && ownedSubmissionIds.value.has(r.submissionId)
}

function editLinkFor(r: { submissionId?: string }): string {
  return `/reports/${props.report.id}/edit?submissionId=${encodeURIComponent(r.submissionId ?? '')}`
}

const visibleReporters = computed(() => reportersList.value.slice(0, 6))

// "View all" only makes sense once there's something hidden beyond the
// first 6 — at exactly 6 or fewer, the chip row already shows everyone.
const showViewAll = computed(() => reportersList.value.length > 6)

// Flattened image list across every reporter, each tagged with which
// reporter number it belongs to, for the right-hand table in the modal.
const allImages = computed(() => {
  const imgs: { url: string; reporterNumber: number }[] = []
  reportersList.value.forEach(r => {
    r.evidenceUrls.forEach(url => imgs.push({ url, reporterNumber: r.number }))
  })
  return imgs
})

const modalOpen = ref(false)
const selectedReporterNumber = ref<number | null>(null)

// Reporter detail is its own stacked modal — opening it does NOT close the
// reporters-list modal underneath. The X on the detail modal only closes
// that top layer, dropping the user back on the list, not out entirely.
const detailModalOpen = ref(false)

function openModal() {
  modalOpen.value = true
  nextTick(() => updateImageScrollState())
}
function closeModal() {
  modalOpen.value = false
  detailModalOpen.value = false
  selectedReporterNumber.value = null
}

function selectReporter(n: number) {
  selectedReporterNumber.value = n
  detailModalOpen.value = true
}
function closeDetailModal() {
  detailModalOpen.value = false
}

const selectedReporter = computed(() =>
  reportersList.value.find(r => r.number === selectedReporterNumber.value) ?? null
)

// Formats an ISO-ish timestamp into something readable, without assuming
// a specific input shape — falls back to the raw string if parsing fails,
// so a slightly different format from additionalReports never breaks the UI.
function formatTimestamp(value: string): string {
  if (!value) return 'Unknown date'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleString('en-NG', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: 'numeric', minute: '2-digit'
  })
}

// Self-contained lightbox — intentionally not shared with the parent
// page's own gallery lightbox, so this component has zero dependency on
// how the parent implements image viewing.
const lightboxImage = ref<string | null>(null)
function openLightbox(url: string) {
  lightboxImage.value = url
}
function closeLightbox() {
  lightboxImage.value = null
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key !== 'Escape') return
  // Close whichever layer is topmost first — never skip a layer.
  if (lightboxImage.value) closeLightbox()
  else if (detailModalOpen.value) closeDetailModal()
  else if (modalOpen.value) closeModal()
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('resize', updateImageScrollState)
})
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('resize', updateImageScrollState)
})

const imageGridRef = ref<HTMLElement | null>(null)
const canScrollImagesRight = ref(false)

function updateImageScrollState() {
  const el = imageGridRef.value
  if (!el) {
    canScrollImagesRight.value = false
    return
  }
  canScrollImagesRight.value = el.scrollWidth - el.clientWidth - el.scrollLeft > 4
}

function scrollImagesRight() {
  imageGridRef.value?.scrollBy({ left: 240, behavior: 'smooth' })
}

</script>

<template>
  <div v-if="reportersList.length" class="rp-panel">
    <h2 class="rp-heading">
      Reported by {{ reportersList.length }} reporter{{ reportersList.length > 1 ? 's' : '' }}
    </h2>

    <div class="rp-chip-row">
      <span v-for="r in visibleReporters" :key="r.number" class="rp-chip">#reporter{{ r.number }}</span>
    </div>

    <button v-if="showViewAll" type="button" class="rp-viewall-btn" @click="openModal">
      View all reporters →
    </button>
  </div>

  <!-- ============ ALL REPORTERS MODAL (list + images tables) ============ -->
  <Teleport to="body">
    <div v-if="modalOpen" class="rp-modal-overlay" @click.self="closeModal">
      <div class="rp-modal" role="dialog" aria-modal="true" aria-label="All reporters">
        <button type="button" class="rp-modal-close" @click="closeModal" aria-label="Close">×</button>
        <h3 class="rp-modal-title">All reporters ({{ reportersList.length }})</h3>

        <div class="rp-tables">
          <div class="rp-table-col">
            <h4 class="rp-table-heading">Reporters</h4>
            <div class="rp-reporter-rows">
              <div v-for="r in reportersList" :key="r.number" class="rp-reporter-row" role="button" tabindex="0"
                @click="selectReporter(r.number)" @keydown.enter="selectReporter(r.number)"
                @keydown.space.prevent="selectReporter(r.number)">
                <span class="rp-reporter-badge">#{{ r.number }}</span>
                <span class="rp-reporter-meta">
                  <span class="rp-reporter-date">{{ formatTimestamp(r.createdAt) }}</span>
                  <span v-if="r.contactPlatform" class="rp-reporter-platform">{{ r.contactPlatform }}</span>
                </span>
                <NuxtLink v-if="isOwnedReporter(r)" :to="editLinkFor(r)" class="rp-reporter-edit" @click.stop>
                  Edit
                </NuxtLink>
                <span class="rp-reporter-arrow">→</span>
              </div>
            </div>
          </div>

          <div class="rp-table-col">
            <h4 class="rp-table-heading">Images uploaded ({{ allImages.length }})</h4>
            <div v-if="allImages.length" class="rp-image-scroll-wrap">
              <div ref="imageGridRef" class="rp-image-grid" @scroll="updateImageScrollState">
                <button v-for="(img, i) in allImages" :key="i" type="button" class="rp-image-thumb"
                  @click="openLightbox(img.url)">
                  <img :src="img.url" :alt="`Evidence from reporter ${img.reporterNumber}`" />
                  <span class="rp-image-tag">#{{ img.reporterNumber }}</span>
                </button>
              </div>
              <button v-if="canScrollImagesRight" type="button" class="rp-image-scroll-btn" aria-label="Scroll images"
                @click="scrollImagesRight">
                ›
              </button>
            </div>
            <p v-else class="rp-empty-note">No images uploaded yet.</p>
          </div>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- ============ REPORTER DETAIL MODAL — stacks on top of the list modal.
       Opens on clicking any reporter row. X returns to the list underneath,
       it does not close everything. ============ -->
  <Teleport to="body">
    <div v-if="detailModalOpen && selectedReporter" class="rd-overlay" @click.self="closeDetailModal">
      <div class="rd-modal" role="dialog" aria-modal="true" :aria-label="`Reporter ${selectedReporter.number} report`">
        <button type="button" class="rd-close" @click="closeDetailModal" aria-label="Back to all reporters">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </button>

        <NuxtLink v-if="isOwnedReporter(selectedReporter)" :to="editLinkFor(selectedReporter)" class="rd-edit-link">
          Edit your report
        </NuxtLink>

        <div class="rd-header">
          <span class="rd-avatar">#{{ selectedReporter.number }}</span>
          <div class="rd-header-text">
            <span class="rd-header-title">Reporter #{{ selectedReporter.number }}</span>
            <span class="rd-header-meta">
              {{ formatTimestamp(selectedReporter.createdAt) }}
              <template v-if="selectedReporter.contactPlatform">
                <span class="rd-meta-dot">·</span>{{ selectedReporter.contactPlatform }}
              </template>
            </span>
          </div>
        </div>

        <blockquote class="rd-desc">
          {{ selectedReporter.description || 'No description provided.' }}
        </blockquote>

        <div v-if="selectedReporter.amountInvolved" class="rd-amount-pill">
          <span class="rd-amount-label">Amount involved</span>
          <span class="rd-amount-value">₦{{ selectedReporter.amountInvolved.toLocaleString() }}</span>
        </div>

        <div v-if="selectedReporter.evidenceUrls.length" class="rd-evidence">
          <span class="rd-evidence-label">
            Evidence ({{ selectedReporter.evidenceUrls.length }})
          </span>
          <div class="rd-evidence-grid">
            <button v-for="(url, i) in selectedReporter.evidenceUrls" :key="i" type="button" class="rd-evidence-thumb"
              @click="openLightbox(url)">
              <img :src="url" :alt="`Evidence ${i + 1} from reporter ${selectedReporter.number}`" />
              <span class="rd-evidence-zoom">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2" />
                  <path d="M21 21l-4.3-4.3" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                </svg>
              </span>
            </button>
          </div>
        </div>

        <button type="button" class="rd-back-link" @click="closeDetailModal">
          ← Back to all reporters
        </button>
      </div>
    </div>
  </Teleport>

  <!-- ============ LIGHTBOX — stacks above everything ============ -->
  <Teleport to="body">
    <div v-if="lightboxImage" class="rp-lightbox" @click="closeLightbox">
      <img :src="lightboxImage" alt="Evidence full size" @click.stop />
      <button type="button" class="rp-lightbox-close" @click.stop="closeLightbox" aria-label="Close">×</button>
    </div>
  </Teleport>
</template>

<style scoped>
/* ============ INLINE PANEL ============ */
.rp-panel {
  margin: 18px 16px 0;
  padding: 14px;
  background: var(--surface-2);
  border: 1px solid var(--border);
}

.rp-heading {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-3);
  margin: 0 0 12px;
}

.rp-chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.rp-chip {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.02em;
  color: var(--text-2);
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 5px 12px;
}

.rp-viewall-btn {
  font-family: var(--mono);
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.03em;
  background: none;
  color: var(--text-1);
  border: none;
  padding: 0;
  cursor: pointer;
}

.rp-viewall-btn:hover {
  text-decoration: underline;
}

/* ============ ALL REPORTERS MODAL ============ */
.rp-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(2, 6, 4, 0.72);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.rp-modal {
  position: relative;
  width: 100%;
  max-width: 760px;
  max-height: 88vh;
  overflow-y: auto;
  background: var(--surface);
  border: 1px solid var(--border-hi);
  padding: 32px;
}

/* On desktop, let the modal claim most of the viewport instead of staying
   pinned at a flat 760px — scales with the window, capped so it never
   goes edge-to-edge or absurdly wide on ultra-wide monitors. */
@media (min-width: 1024px) {
  .rp-modal {
    width: 88vw;
    max-width: 1200px;
    max-height: 85vh;
  }
}

.rp-modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid var(--border-hi);
  background: transparent;
  color: var(--text-2);
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
}

.rp-modal-close:hover {
  color: var(--accent);
  border-color: var(--accent);
}

.rp-modal-title {
  font-family: var(--serif);
  font-size: 20px;
  color: var(--text-1);
  margin: 0 0 20px;
  padding-right: 24px;
}

.rp-tables {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 620px) {
  .rp-tables {
    grid-template-columns: 1fr;
  }
}

.rp-table-heading {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-3);
  margin: 0 0 10px;
}

.rp-reporter-rows {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 320px;
  overflow-y: auto;
}

.rp-reporter-row {
  display: flex;
  align-items: center;
  gap: 10px;
  text-align: left;
  background: var(--bg);
  border: 1px solid var(--border);
  padding: 10px 12px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, transform 0.15s;
}

.rp-reporter-row:hover {
  border-color: var(--accent);
  background: var(--accent-dim, rgba(232, 255, 71, 0.06));
  transform: translateX(2px);
}

.rp-reporter-row:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.rp-reporter-badge {
  flex-shrink: 0;
  font-family: var(--mono);
  font-size: 10.5px;
  font-weight: 700;
  color: #f87171;
  background: rgba(248, 113, 113, 0.08);
  border: 1px solid rgba(248, 113, 113, 0.25);
  padding: 3px 8px;
}

.rp-reporter-meta {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.rp-reporter-date {
  font-size: 12px;
  color: var(--text-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rp-reporter-platform {
  font-family: var(--mono);
  font-size: 10px;
  color: var(--text-3);
}

.rp-reporter-arrow {
  flex-shrink: 0;
  color: var(--text-3);
  font-family: var(--mono);
  transition: transform 0.15s, color 0.15s;
}

.rp-table-col {
  min-width: 0;
}

.rp-reporter-edit {
  flex-shrink: 0;
  font-family: var(--mono);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--accent);
  background: var(--accent-dim, rgba(232, 255, 71, 0.08));
  border: 1px solid rgba(232, 255, 71, 0.25);
  padding: 3px 8px;
  text-decoration: none;
}

.rp-reporter-edit:hover {
  background: var(--accent);
  color: #0a0a0b;
}

.rp-reporter-row:hover .rp-reporter-arrow {
  color: var(--accent);
  transform: translateX(3px);
}

.rp-image-scroll-wrap {
  position: relative;
}

.rp-image-grid {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding-bottom: 4px;
}

.rp-image-grid .rp-image-thumb {
  flex: 0 0 96px;
  width: 96px;
}

.rp-image-scroll-btn {
  position: absolute;
  top: 50%;
  right: 4px;
  transform: translateY(-50%);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid var(--border-hi);
  background: var(--surface);
  color: var(--text-1);
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
}

.rp-image-scroll-btn:hover {
  color: var(--accent);
  border-color: var(--accent);
}.rp-image-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  max-height: 320px;
  overflow-y: auto;
}

.rp-image-thumb {
  position: relative;
  padding: 0;
  border: 1px solid var(--border);
  overflow: hidden;
  cursor: pointer;
  aspect-ratio: 1;
}

.rp-image-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.2s ease;
}

.rp-image-thumb:hover img {
  transform: scale(1.06);
}

.rp-image-tag {
  position: absolute;
  bottom: 4px;
  right: 4px;
  font-family: var(--mono);
  font-size: 9px;
  color: #fff;
  background: rgba(0, 0, 0, 0.65);
  padding: 1px 5px;
}

.rp-empty-note {
  font-size: 12.5px;
  color: var(--text-3);
  font-style: italic;
}

/* ============ REPORTER DETAIL MODAL — "pro" styled, stacks on top ============ */
.rd-overlay {
  position: fixed;
  inset: 0;
  z-index: 1050;
  background: rgba(2, 6, 4, 0.82);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.rd-modal {
  position: relative;
  width: 100%;
  max-width: 540px;
  max-height: 88vh;
  overflow-y: auto;
  background: var(--surface);
  border: 1px solid var(--border-hi);
  padding: 36px;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
}

/* Desktop: wider than the flat 540px cap, but narrower than rp-modal above
   since this only ever holds one reporter's content, not two side-by-side
   tables — doesn't need as much horizontal room. */
@media (min-width: 1024px) {
  .rd-modal {
    width: 70vw;
    max-width: 720px;
    max-height: 85vh;
  }
}

.rd-close {
  position: absolute;
  top: 18px;
  right: 18px;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid var(--border-hi);
  background: var(--bg);
  color: var(--text-2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s, transform 0.15s;
}

.rd-close:hover {
  color: var(--accent);
  border-color: var(--accent);
  transform: rotate(90deg);
}

.rd-edit-link {
  position: absolute;
  top: 24px;
  right: 62px;
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--accent);
  background: var(--accent-dim, rgba(232, 255, 71, 0.08));
  border: 1px solid rgba(232, 255, 71, 0.25);
  padding: 7px 12px;
  text-decoration: none;
}

.rd-edit-link:hover {
  background: var(--accent);
  color: #0a0a0b;
}

.rd-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 22px;
  padding-right: 36px;
}

.rd-avatar {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--mono);
  font-size: 14px;
  font-weight: 700;
  color: #f87171;
  background: rgba(248, 113, 113, 0.1);
  border: 1px solid rgba(248, 113, 113, 0.3);
}

.rd-header-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.rd-header-title {
  font-family: var(--serif);
  font-size: 18px;
  color: var(--text-1);
}

.rd-header-meta {
  font-family: var(--mono);
  font-size: 11.5px;
  color: var(--text-3);
}

.rd-meta-dot {
  margin: 0 6px;
  color: var(--border-hi);
}

.rd-desc {
  margin: 0 0 22px;
  padding: 16px 18px;
  background: var(--bg);
  border-left: 3px solid var(--accent);
  border-radius: 0 8px 8px 0;
  font-size: 14.5px;
  line-height: 1.75;
  color: var(--text-2);
  font-weight: 300;
  font-style: normal;
  white-space: pre-wrap;
}

.rd-amount-pill {
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
  background: var(--accent-dim, rgba(232, 255, 71, 0.08));
  border: 1px solid rgba(232, 255, 71, 0.25);
  border-radius: 999px;
  padding: 8px 16px;
  margin-bottom: 22px;
}

.rd-amount-label {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-3);
}

.rd-amount-value {
  font-family: var(--serif);
  font-size: 16px;
  font-weight: 700;
  color: var(--accent);
}

.rd-evidence {
  margin-bottom: 24px;
}

.rd-evidence-label {
  display: block;
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-3);
  margin-bottom: 10px;
}

.rd-evidence-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
  gap: 10px;
}

.rd-evidence-thumb {
  position: relative;
  padding: 0;
  border: 1px solid var(--border-hi);
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  aspect-ratio: 1;
}

.rd-evidence-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.25s ease;
}

.rd-evidence-thumb:hover img {
  transform: scale(1.08);
}

.rd-evidence-zoom {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: rgba(0, 0, 0, 0.35);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.rd-evidence-thumb:hover .rd-evidence-zoom {
  opacity: 1;
}

.rd-back-link {
  font-family: var(--mono);
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.02em;
  background: none;
  border: none;
  color: var(--text-3);
  padding: 0;
  cursor: pointer;
}

.rd-back-link:hover {
  color: var(--accent);
}

/* ============ LIGHTBOX (stacks above everything) ============ */
.rp-lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  cursor: zoom-out;
  padding: 24px;
}

.rp-lightbox img {
  max-width: 100%;
  max-height: 100%;
  border-radius: 8px;
  cursor: default;
}

.rp-lightbox-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  z-index: 1101;
}
</style>