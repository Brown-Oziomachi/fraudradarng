<script setup lang="ts">
import type { Report, ScamCategory } from '#shared/types/report'

type ReportWithState = Report & { state?: string; additionalReports?: ReportWithState[] }

definePageMeta({
  hideFooter: true,
})
const route = useRoute()
const router = useRouter()
const id = route.params.id as string
const detailCache = useReportDetailCache()

const cached = detailCache.value[id] as ReportWithState | undefined
const report = ref<ReportWithState | null>(cached ?? null)
const pending = ref(!cached)
const error = ref<any>(null)

if (!cached) {
  const { data, pending: fetchPending, error: fetchError } = await useLazyFetch<Report>(`/api/reports/${id}`)
  watch(data, (val) => {
    if (val) {
      report.value = val as ReportWithState
      detailCache.value[id] = val as ReportWithState
    }
  }, { immediate: true })
  watch(fetchPending, (val) => { pending.value = val }, { immediate: true })
  watch(fetchError, (val) => { error.value = val }, { immediate: true })
}

function goBack() {
  if (window.history.state?.back) {
    router.back()
  } else {
    router.push('/reports') 
  }
}

// after
const showUnverifiedInfo = ref(false)

function toggleUnverifiedInfo() {
  showUnverifiedInfo.value = !showUnverifiedInfo.value
}

interface OwnedSubmission {
  reportId: string
  submissionId: string
}

// --- Ownership (main report + each additional reporter's own submission) ---
const ownedSubmissionIds = ref<Set<string>>(new Set())
const legacyOwnsMain = ref(false)

function checkOwnership() {
  try {
    const mine: OwnedSubmission[] = JSON.parse(localStorage.getItem('myReportSubmissions') || '[]')
    ownedSubmissionIds.value = new Set(
      mine.filter(m => m.reportId === id).map(m => m.submissionId)
    )
  } catch {
    ownedSubmissionIds.value = new Set()
  }
  try {
    const legacyMine: string[] = JSON.parse(localStorage.getItem('myReportIds') || '[]')
    legacyOwnsMain.value = legacyMine.includes(id)
  } catch {
    legacyOwnsMain.value = false
  }
}

const isMainOwner = computed(() => {
  const r = report.value as any
  if (r?.submissionId && ownedSubmissionIds.value.has(r.submissionId)) return true
  return legacyOwnsMain.value
})

const mainEditLink = computed(() => {
  if (!isMainOwner.value) return null
  const r = report.value as any
  return r?.submissionId
    ? `/reports/${id}/edit?submissionId=${r.submissionId}`
    : `/reports/${id}/edit`
})

function subEditLink(sub: any): string | null {
  if (!sub?.submissionId || !ownedSubmissionIds.value.has(sub.submissionId)) return null
  return `/reports/${id}/edit?submissionId=${sub.submissionId}`
}

const displayTitle = computed(() => {
  const r = report.value
  if (!r) return ''
  if (r.targetType === 'company') return r.companyName ?? 'Unknown company'
  if (r.targetType === 'website') return r.websiteName || r.websiteUrl || 'Unknown website'
  return r.accountName ?? 'Unknown account'
})

const displaySubtitle = computed(() => {
  const r = report.value
  if (!r) return ''
  if (r.targetType === 'company') return r.companyAddress || 'Company'
  if (r.targetType === 'website') return r.websiteUrl || 'Website'
  return r.bankName ?? 'Bank account'
})

const typeLabel = computed(() => {
  const r = report.value
  if (!r) return ''
  if (r.targetType === 'company') return 'Company'
  if (r.targetType === 'website') return 'Website'
  return 'Bank Account'
})

const recoveryLink = computed(() => {
  const r = report.value
  if (!r) return '/recovery'
  const params = new URLSearchParams()
  if (r.targetType === 'bank_account') {
    if (r.bankName) params.set('bank', r.bankName)
    if (r.accountName) params.set('accountName', r.accountName)
    if (r.accountNumber) params.set('accountNumber', r.accountNumber)
  }
  if (r.amountInvolved) params.set('amount', String(r.amountInvolved))
  return `/recovery?${params.toString()}`
})

const REGULATORY_LABELS: Record<string, { label: string; tone: string }> = {
  unregistered: { label: '🛑 Unregistered / Illegal Operator', tone: 'unregistered' },
  probation: { label: '🟡 Under Regulatory Probation', tone: 'probation' },
  registered: { label: '🟢 Currently SEC-Registered', tone: 'registered' },
}

const regulatoryBadge = computed(() => {
  const r = report.value
  if (!r?.regulatoryStatus) return null
  return REGULATORY_LABELS[r.regulatoryStatus] ?? null
})

function formatTimeAgo(dateVal: string | number | Date) {
  const diffMs = Date.now() - new Date(dateVal).getTime()
  const minutes = Math.floor(diffMs / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return new Date(dateVal).toLocaleDateString('en-NG', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

const timeAgo = computed(() => {
  const r = report.value
  if (!r?.createdAt) return ''
  return formatTimeAgo(r.createdAt)
})

const CATEGORY_LABELS: Record<string, string> = {
  fintech_ussd: 'Fintech & USSD exploit',
  social_commerce: 'Social commerce scam',
  visa_travel: 'Visa / travel logistics fraud',
  job_ponzi: 'Job or Ponzi scheme',
  other: 'Other fraud'
}

const categoryLabel = computed(() => {
  const r = report.value
  if (!r?.category) return ''
  return CATEGORY_LABELS[r.category] ?? ''
})

const initials = computed(() => {
  if (!displayTitle.value) return ''
  return displayTitle.value
    .split(' ')
    .map(w => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
})

const rawMainImages = computed(() => {
  const r = report.value
  if (!r) return []
  if (r.evidenceUrls?.length) return r.evidenceUrls
  const legacy = (r as any).evidenceUrl
  return legacy ? [legacy] : []
})

const images = computed(() => {
  const r = report.value
  if (!r) return []
  const subSet = new Set(
    (r.additionalReports ?? []).flatMap((sub: any) => sub.evidenceUrls ?? [])
  )
  return rawMainImages.value.filter(img => !subSet.has(img))
})

const subImagesList = computed(() => {
  const r = report.value
  if (!r) return [] as string[][]
  const seen = new Set<string>()
  return (r.additionalReports ?? []).map((sub: any) => {
    const urls: string[] = (sub.evidenceUrls ?? []).filter((img: string) => !seen.has(img))
    urls.forEach((img: string) => seen.add(img))
    return urls
  })
})

const reportForShare = computed<Report | null>(() => {
  const r = report.value
  if (!r) return null
  return ({ ...r, bankName: r.bankName ?? '' }) as Report
})


function detailFieldsFor(targetType: string | undefined, src: any) {
  if (!src) return []
  if (targetType === 'company') {
    return [
      { label: 'Company name', value: src.companyName },
      { label: 'Address', value: src.companyAddress },
    ].filter(f => f.value)
  }
  if (targetType === 'website') {
    return [
      { label: 'Website name', value: src.websiteName },
      { label: 'Website URL', value: src.websiteUrl },
    ].filter(f => f.value)
  }
  return [
    { label: 'Account name', value: src.accountName },
    { label: 'Bank name', value: src.bankName },
    { label: 'Account number', value: src.accountNumber },
  ].filter(f => f.value)
}

function sharedFieldsFor(src: any, includeState = true) {
  if (!src) return []
  const fields: { label: string; value: string }[] = []
  if (src.amountInvolved != null) {
    fields.push({ label: 'Amount involved', value: `₦${Number(src.amountInvolved).toLocaleString()}` })
  }
  if (src.contactPlatform) {
    fields.push({ label: 'Contact platform', value: src.contactPlatform })
  }
  if (includeState && src.state) {
    fields.push({ label: 'State', value: src.state })
  }
  return fields
}

const sharedFields = computed(() => sharedFieldsFor(report.value))
const detailFields = computed(() => detailFieldsFor(report.value?.targetType, report.value))

function additionalDetailFields(sub: any) {
  return detailFieldsFor(report.value?.targetType, sub)
}
function additionalSharedFields(sub: any) {
  return sharedFieldsFor(sub)
}

// --- Description clamping ("Read more") for additional reporters ---
const expandedDescriptions = ref<Set<number>>(new Set())
function isDescLong(desc: string | undefined) {
  return !!desc && desc.length > 180
}
function toggleDescription(index: number) {
  const next = new Set(expandedDescriptions.value)
  if (next.has(index)) next.delete(index)
  else next.add(index)
  expandedDescriptions.value = next
}

// --- Galleries + shared lightbox (main report + each reporter has its own
// separate image set; the lightbox just navigates whichever set was opened) ---
const galleryScrollRef = ref<HTMLElement | null>(null)
const subGalleryRefs = ref<Record<number, HTMLElement | null>>({})

function setSubGalleryRef(index: number, el: any) {
  subGalleryRefs.value[index] = el
}

const lightbox = ref<{ images: string[]; index: number } | null>(null)
const lightboxOpen = computed(() => lightbox.value !== null)
const lightboxSrc = computed(() => lightbox.value ? lightbox.value.images[lightbox.value.index] : null)
const canNavigate = computed(() => !!lightbox.value && lightbox.value.images.length > 1)

function openLightbox(imgs: string[], index: number) {
  if (!imgs?.length) return
  lightbox.value = { images: imgs, index }
}
function closeImage() {
  lightbox.value = null
}
function nextImage() {
  if (!lightbox.value) return
  lightbox.value.index = (lightbox.value.index + 1) % lightbox.value.images.length
}
function prevImage() {
  if (!lightbox.value) return
  lightbox.value.index = (lightbox.value.index - 1 + lightbox.value.images.length) % lightbox.value.images.length
}
function scrollGallery(direction: number) {
  const el = galleryScrollRef.value
  if (!el) return
  el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: 'smooth' })
}
function scrollSubGallery(index: number, direction: number) {
  const el = subGalleryRefs.value[index]
  if (!el) return
  el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: 'smooth' })
}
function handleLightboxKeydown(e: KeyboardEvent) {
  if (!lightboxOpen.value) return
  if (e.key === 'ArrowRight') nextImage()
  else if (e.key === 'ArrowLeft') prevImage()
  else if (e.key === 'Escape') closeImage()
}

onMounted(() => {
  checkOwnership()
  window.addEventListener('keydown', handleLightboxKeydown)
})
onUnmounted(() => window.removeEventListener('keydown', handleLightboxKeydown))

const confirmationsNeeded = 3
const confirmationsCount = computed(() => {
  const r = report.value
  if (!r) return 0
  return Math.min(r.distinctReporterCount ?? r.reportCount ?? 1, confirmationsNeeded)
})
const confirmationsPct = computed(() => Math.round((confirmationsCount.value / confirmationsNeeded) * 100))
const { data: relatedFeed } = await useLazyFetch<{ reports: Report[] }>('/api/reports', {
  server: false
})

const similarReports = computed(() => {
  const r = report.value
  if (!r?.category || !relatedFeed.value?.reports) return []
  return relatedFeed.value.reports
    .filter(other => other.id !== r.id && other.category === r.category)
    .slice(0, 3)
})

function similarTargetName(r: Report) {
  if (r.targetType === 'company') return r.companyName ?? 'Unknown company'
  if (r.targetType === 'website') return r.websiteName || r.websiteUrl || 'Unknown website'
  return r.accountName ?? 'Unknown account'
}

// --- Report snapshot: all reporters' states, horizontally scrollable ---
const statesScrollRef = ref<HTMLElement | null>(null)
const allStates = computed(() => {
  const r = report.value
  if (!r) return []
  const list: string[] = []
  if (r.state) list.push(r.state)
  for (const sub of (r.additionalReports ?? []) as any[]) {
    if (sub?.state) list.push(sub.state)
  }
  return list
})
function scrollStates(direction: number) {
  const el = statesScrollRef.value
  if (!el) return
  el.scrollBy({ left: direction * 90, behavior: 'smooth' })
}

const totalReporters = computed(() => {
  const r = report.value
  if (!r) return 0
  return 1 + (r.additionalReports?.length ?? 0)
})

// --- Sticky mobile action bar (share) ---
const copied = ref(false)
async function shareReport() {
  if (!report.value) return
  const url = window.location.href
  try {
    if (navigator.share) {
      await navigator.share({ title: displayTitle.value, url })
      return
    }
    await navigator.clipboard.writeText(url)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    // user cancelled share sheet or clipboard blocked — no-op
  }
}

// --- Evidence packet PDF download ---
const generatingPdf = ref(false)
async function downloadEvidencePacket() {
  if (!report.value || generatingPdf.value) return
  generatingPdf.value = true
  try {
    // Placeholder: generate PDF with report details and photos
    // TODO: implement actual PDF generation
  } catch (err) {
    console.error('Failed to generate evidence packet:', err)
  } finally {
    generatingPdf.value = false
  }
}

useHead(() => ({
  title: report.value ? `${displayTitle.value} — Fraud Radar NG` : 'Report — Fraud Radar NG'
}))
</script>

<template>
  <div class="page-body" :class="{ 'has-sticky-bar': report }">
    <a href="#" class="back-link" @click.prevent="goBack">← Back to reports</a>

    <p v-if="pending" class="loading-text">Loading report...</p>
    <p v-else-if="error || !report" class="empty-text">
      This report could not be found. It may have been removed.
    </p>

    <div v-if="report" class="detail-grid">
      <div class="main-col">
        <article class="post">
          <div class="post-top">
            <span class="type-chip">{{ typeLabel }}</span>
            <span v-if="categoryLabel" class="category-chip">{{ categoryLabel }}</span>

            <span v-if="report.status === 'flagged'" class="badge-suspicious">
              ⚠ Highly Suspicious — {{ report.distinctReporterCount ?? report.reportCount ?? 1 }} independent reports
            </span>

            <span v-else class="badge-unverified-wrap">
              <span class="badge-unverified">Unverified</span>
              <button type="button" class="badge-info-btn" aria-label="Why is this unverified?"
                @click="toggleUnverifiedInfo">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none">
                  <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
              </button>

              <div v-if="showUnverifiedInfo" class="badge-popover-backdrop" @click="showUnverifiedInfo = false"></div>

              <div v-if="showUnverifiedInfo" class="badge-popover">
                <p>
                  This report is based on a single submission and hasn't been corroborated
                  by other independent reporters yet. It becomes <strong>Highly Suspicious</strong>
                  once at least 3 different people report the same account, or after a
                  moderator manually reviews it.
                </p>
                <p class="badge-popover-sub">
                  Read details carefully and verify independently before acting on this report.
                </p>
                <p class="badge-popover-brand"> Fraud Radar NG</p>
              </div>
            </span>
            <div v-if="regulatoryBadge" class="regulatory-badge" :class="`regulatory-badge--${regulatoryBadge.tone}`">
              <strong>{{ regulatoryBadge.label }}</strong>
              <span v-if="report.regulatoryStatusNote"> — {{ report.regulatoryStatusNote }}</span>
              <p class="regulatory-badge-caveat">
                Reflects the entity's regulatory registration status only. It does not confirm, dispute, or resolve the
                fraud report above.
              </p>
            </div>
          </div>

          <div class="verify-meter-wrap">
            <div v-if="report.status === 'flagged'" class="verify-meter verify-meter--complete">
              <span class="verify-meter-icon">✓</span>
              <span class="verify-meter-text">
                Verified by {{ report.distinctReporterCount ?? report.reportCount ?? 1 }} independent reporters
              </span>
            </div>
            <div v-else class="verify-meter">
              <div class="verify-meter-track">
                <div class="verify-meter-fill" :style="{ width: confirmationsPct + '%' }"></div>
              </div>
              <span class="verify-meter-text">
                {{ confirmationsCount }} of {{ confirmationsNeeded }} confirmations needed to become Highly Suspicious
              </span>
            </div>
          </div>

          <div class="post-header">
            <div class="avatar avatar--flagged">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                <path
                  d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <div class="post-header-text">
              <span class="post-name-label">Flagged Account || Illegal Operator</span>
              <span class="post-name">{{ displayTitle }}</span>
              <div class="post-meta">
                <span>{{ displaySubtitle }}</span>
                <span v-if="timeAgo" class="post-dot">·</span>
                <span v-if="timeAgo">reported {{ timeAgo }}</span>
                <template v-if="isMainOwner">
                  <span class="post-dot">·</span>
                  <span class="owner-tag"></span>
                  <NuxtLink v-if="mainEditLink" :to="mainEditLink" class="owner-edit-link">Edit →</NuxtLink>
                </template>
              </div>
            </div>
          </div>

          <p class="post-desc">{{ report.description }}</p>

          <div v-if="images.length" class="gallery-carousel-wrap">
            <button v-if="images.length > 1" type="button" class="gallery-arrow gallery-arrow--left"
              aria-label="Scroll images left" @click="scrollGallery(-1)">‹</button>

            <div ref="galleryScrollRef" class="gallery-scroll">
              <div v-for="(img, index) in images" :key="index" class="gallery-thumb"
                @click="openLightbox(images, index)">
                <img :src="img" :alt="`Evidence ${index + 1}`" />
                <span class="gallery-thumb-index">{{ index + 1 }}/{{ images.length }}</span>
              </div>
            </div>

            <button v-if="images.length > 1" type="button" class="gallery-arrow gallery-arrow--right"
              aria-label="Scroll images right" @click="scrollGallery(1)">›</button>
          </div>

          <div v-if="detailFields.length" class="details-panel details-panel--primary">
            <h2 class="details-heading">Reported details</h2>
            <dl class="details-list">
              <div v-for="field in detailFields" :key="field.label" class="details-row">
                <dt>{{ field.label }}</dt>
                <dd>{{ field.value }}</dd>
              </div>
            </dl>
          </div>

          <div v-if="sharedFields.length" class="details-panel details-panel--primary">
            <h2 class="details-heading">Additional details</h2>

            <dl class="details-list">
              <div v-for="field in sharedFields" :key="field.label" class="details-row">
                <dt>{{ field.label }}</dt>
                <dd>{{ field.value }}</dd>
              </div>
            </dl>
            <p v-if="report?.state && !['unspecified', 'prefer not to say'].includes(report.state.toLowerCase())"
              class="details-note">
              <strong>Note:</strong> This event occurred in {{ report.state }} State, Nigeria.
            </p>
            <p v-else class="details-note">
              <strong>Note:</strong> The location state for this event was not specified.
            </p>
          </div>

          <div v-if="report.additionalReports?.length" class="details-panel details-panel--reporters">
            <p class="reporters-intro">
              These are separate people who independently reported the same account, number, or website.
            </p>

            <hr class="line-through"/>

            <h2 class="details-heading">
              Also reported by {{ report.additionalReports.length }} other{{ report.additionalReports.length > 1 ? 's' :
                '' }}
            </h2>
           

            <div v-for="(sub, index) in report.additionalReports" :key="index" class="additional-report-item">
              <div class="additional-report-header">
                <span class="reporter-badge">Reporter #{{ index + 2 }}</span>
                <div class="additional-report-header-right">
                  <span class="additional-report-date">{{ sub.createdAt }}</span>
                  <NuxtLink v-if="subEditLink(sub)" :to="subEditLink(sub)!" class="sub-owner-edit-link">
                    Yours · Edit →
                  </NuxtLink>
                </div>
              </div>

              <p class="post-desc post-desc--nested"
                :class="{ 'post-desc--clamped': isDescLong(sub.description) && !expandedDescriptions.has(index) }">{{
                  sub.description }}</p>
              <button v-if="isDescLong(sub.description)" type="button" class="read-more-btn"
                @click="toggleDescription(index)">
                {{ expandedDescriptions.has(index) ? 'Read less' : 'Read more' }}
              </button>

              <div v-if="additionalDetailFields(sub).length" class="details-panel details-panel--nested">
                <h2 class="details-heading">Reported details</h2>
                <dl class="details-list">
                  <div v-for="field in additionalDetailFields(sub)" :key="field.label" class="details-row">
                    <dt>{{ field.label }}</dt>
                    <dd>{{ field.value }}</dd>
                  </div>
                </dl>
              </div>



              <div v-if="subImagesList[index]?.length" class="gallery-carousel-wrap gallery-carousel-wrap--nested">
                <button v-if="subImagesList[index].length > 1" type="button" class="gallery-arrow gallery-arrow--left"
                  aria-label="Scroll images left" @click="scrollSubGallery(index, -1)">‹</button>

                <div :ref="(el) => setSubGalleryRef(index, el)" class="gallery-scroll">
                  <div v-for="(img, i) in subImagesList[index]" :key="i" class="gallery-thumb gallery-thumb--sm"
                    @click="openLightbox(subImagesList[index], i)">
                    <img :src="img" :alt="`Evidence ${i + 1}`" />
                    <span class="gallery-thumb-index">{{ i + 1 }}/{{ subImagesList[index].length }}</span>
                  </div>
                </div>

                <button v-if="subImagesList[index].length > 1" type="button" class="gallery-arrow gallery-arrow--right"
                  aria-label="Scroll images right" @click="scrollSubGallery(index, 1)">›</button>
              </div>
              <div v-if="additionalSharedFields(sub).length" class="details-panel details-panel--nested">
                <h2 class="details-heading">Additional details</h2>
                <dl class="details-list">
                  <div v-for="field in additionalSharedFields(sub)" :key="field.label" class="details-row">
                    <dt>{{ field.label }}</dt>
                    <dd>{{ field.value }}</dd>
                  </div>
                </dl>
              </div>

              <p v-if="sub?.state && !['unspecified', 'prefer not to say'].includes(String(sub.state).toLowerCase())"
                class="details-note details-note--nested">
                <strong>Note:</strong> This event occurred in {{ sub.state }} State, Nigeria.
              </p>
              <p v-else class="details-note details-note--nested">
                <strong>Note:</strong> The location state for this event was not specified.
              </p>
            </div>
          </div>
          <ReportersPanel :report="report" />

          <div class="post-footer">
            <span class="footer-label">Reported</span>
            <span>{{ timeAgo || 'recently' }}</span>
          </div>
          <div class="recovery-cta">
            <p class="recovery-cta-text">
              Been defrauded by this account? Generate a bank freeze-request letter
              and see the next steps to recover your funds.
            </p>
            <NuxtLink :to="recoveryLink" class="recovery-cta-btn">
              Start recovery →
            </NuxtLink>
          </div>

          <div class="evidence-packet-panel">
            <div class="evidence-packet-text">
              <span class="evidence-packet-title">Evidence packet</span>
              <span class="evidence-packet-sub">
                Download a PDF with this report's details and photos — useful for banks, police reports, or your own
                records.
              </span>
            </div>
            <button type="button" class="evidence-packet-btn" :disabled="generatingPdf" @click="downloadEvidencePacket">
              {{ generatingPdf ? 'Generating…' : 'Download PDF' }}
            </button>
          </div>

          <div class="share-panel">
            <h2 class="details-heading">Warn others</h2>
            <ShareableWarningCard v-if="report" :report="({
              ...(report as any),
              bankName: report.bankName ?? '',
              accountName: report.accountName ?? '',
              accountNumber: report.accountNumber ?? '',
              companyName: (report as any).companyName ?? '',
              companyAddress: (report as any).companyAddress ?? '',
              websiteUrl: (report as any).websiteUrl ?? '',
              websiteName: (report as any).websiteName ?? ''
            } as any)" />
          </div>
        </article>
      </div>

      <aside class="side-col">
        <div class="widget widget--snapshot">
          <h3 class="widget-title">Report snapshot</h3>
          <div class="widget-snap-row">
            <span>Category</span>
            <span>{{ categoryLabel || '—' }}</span>
          </div>
          <div class="widget-snap-row">
            <span>Type</span>
            <span>{{ typeLabel }}</span>
          </div>
          <div class="widget-snap-row">
            <span>Reporters</span>
            <span>{{ totalReporters }}</span>
          </div>
          <div v-if="allStates.length" class="widget-snap-row widget-snap-row--states">
            <span>States</span>
          </div>
          <div v-if="allStates.length" class="widget-states-scroll-wrap">
            <button v-if="allStates.length > 3" type="button" class="widget-states-arrow"
              aria-label="Scroll states left" @click="scrollStates(-1)">‹</button>
            <div ref="statesScrollRef" class="widget-states-scroll">
              <span v-for="(st, i) in allStates" :key="i" class="widget-state-chip">{{ st }}</span>
            </div>
            <button v-if="allStates.length > 3" type="button" class="widget-states-arrow"
              aria-label="Scroll states right" @click="scrollStates(1)">›</button>
          </div>
          <div class="widget-snap-row">
            <span>Reported</span>
            <span>{{ timeAgo || 'recently' }}</span>
          </div>
          <div v-if="regulatoryBadge" class="widget-snap-row">
            <span>Regulatory</span>
            <span class="widget-snap-value" :class="`snap-tone--${regulatoryBadge.tone}`">
              {{ regulatoryBadge.label.replace(/[^\x00-\x7F]/g, '').trim() }}
            </span>
          </div>
        </div>

        <div v-if="similarReports.length" class="widget">
          <h3 class="widget-title">Similar reports</h3>
          <NuxtLink v-for="sim in similarReports" :key="sim.id" :to="`/reports/${sim.id}`" class="widget-similar-row">
            <span class="widget-similar-name">{{ similarTargetName(sim) }}</span>
            <span class="widget-similar-count">{{ sim.reportCount ?? 1 }}x</span>
          </NuxtLink>
        </div>

        <NuxtLink to="/report/new" class="widget widget--cta">
          <span class="widget-cta-title">Seen something similar?</span>
          <span class="widget-cta-sub">File your own report in under two minutes</span>
          <span class="widget-cta-arrow">→</span>
        </NuxtLink>
      </aside>
    </div>

    <div v-if="lightboxOpen" class="lightbox" @click="closeImage">
      <button v-if="canNavigate" type="button" class="lightbox-nav lightbox-nav--prev" aria-label="Previous image"
        @click.stop="prevImage">‹</button>

      <img :src="lightboxSrc ?? ''" alt="Evidence full size" @click.stop />

      <button v-if="canNavigate" type="button" class="lightbox-nav lightbox-nav--next" aria-label="Next image"
        @click.stop="nextImage">›</button>

      <span v-if="canNavigate" class="lightbox-counter">
        {{ (lightbox?.index ?? 0) + 1 }} / {{ lightbox?.images.length ?? 0 }}
      </span>

      <button type="button" class="lightbox-close" aria-label="Close" @click.stop="closeImage">×</button>
    </div>

    <div v-if="report" class="mobile-sticky-bar">
      <NuxtLink v-if="mainEditLink" :to="mainEditLink" class="mobile-sticky-btn">Edit</NuxtLink>
      <NuxtLink :to="`/flag/report?reportId=${id}`" class="mobile-sticky-btn">
        <svg viewBox="0 0 24 24" width="16" height="16">
          <path fill="currentColor" d="M4 2v20h2v-7h13l-2.5-5L19 5H6V2z" />
        </svg>
        Dispute
      </NuxtLink>
      <button type="button" class="mobile-sticky-btn" @click="shareReport">
        <svg viewBox="0 0 24 24" width="16" height="16">
          <path fill="currentColor"
            d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81a3 3 0 1 0-3-3c0 .24.04.47.09.7L8.04 9.81A2.99 2.99 0 0 0 3 12a3 3 0 0 0 5.04 2.19l7.12 4.16c-.05.21-.08.43-.08.65a3 3 0 1 0 3-3z" />
        </svg>
        {{ copied ? 'Copied!' : 'Share' }}
      </button>
      <NuxtLink :to="recoveryLink" class="mobile-sticky-btn mobile-sticky-btn--primary">
        Start recovery
      </NuxtLink>
    </div>
  </div>
</template>
<style scoped>
.page-body {
  max-width: 720px;
  margin: 0 auto;
  padding: 24px 24px 60px;
}

@media (min-width: 1080px) {
  .page-body {
    max-width: 1120px;
    padding: 32px 32px 60px;
  }
}

@media (max-width: 560px) {
  .page-body {
    padding: 20px 16px 60px;
  }
}

@media (max-width: 720px) {
  .page-body.has-sticky-bar {
    padding-bottom: 96px;
  }
}

.back-link {
  display: inline-block;
  font-family: var(--mono);
  font-size: 11px;
  color: var(--text-3);
  text-decoration: none;
  margin-bottom: 20px;
}

.back-link:hover {
  color: var(--text-1);
}

.loading-text,
.empty-text {
  font-family: var(--mono);
  font-size: 12px;
  color: var(--text-3);
  padding: 24px 0;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

@media (min-width: 1080px) {
  .detail-grid {
    grid-template-columns: 1fr 320px;
    gap: 32px;
  }
}

.detail-grid .main-col {
  min-width: 0;
  width: 100%;
}

.detail-grid .post {
  background: var(--surface);
  border: 1px solid var(--border);
  overflow: hidden;
}

.detail-grid .post-top {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  padding: 14px 16px 0;
}

.detail-grid .type-chip {
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-3);
  background: var(--surface-2);
  border: 1px solid var(--border);
  padding: 2px 8px;
}

.category-chip {
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--accent);
  background: var(--accent-dim, rgba(232, 255, 71, 0.08));
  border: 1px solid rgba(232, 255, 71, 0.25);
  padding: 2px 8px;
}

.badge-count {
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.06em;
  color: #4ade80;
  background: rgba(74, 222, 128, 0.07);
  border: 1px solid rgba(74, 222, 128, 0.18);
  padding: 2px 8px;
}

.badge-count.high {
  color: #f87171;
  background: rgba(248, 113, 113, 0.08);
  border-color: rgba(248, 113, 113, 0.25);
}

.verify-meter-wrap {
  padding: 10px 16px 0;
}

.verify-meter {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.verify-meter-track {
  flex: 1;
  min-width: 60px;
  height: 6px;
  background: var(--surface-2);
  overflow: hidden;
}

.verify-meter-fill {
  height: 100%;
  background: linear-gradient(90deg, #eab308, var(--accent));
  transition: width 0.5s ease;
}

.verify-meter-text {
  font-family: var(--mono);
  font-size: 10px;
  color: var(--text-3);
  white-space: normal;
}

.verify-meter--complete {
  background: rgba(74, 222, 128, 0.07);
  border: 1px solid rgba(74, 222, 128, 0.18);
  padding: 8px 12px;
}

.verify-meter--complete .verify-meter-icon {
  color: #4ade80;
  font-weight: 700;
}

.verify-meter--complete .verify-meter-text {
  color: #4ade80;
  white-space: normal;
}

.post-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px 0;
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--surface-2);
  border: 1px solid var(--border-hi);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--mono);
  font-size: 14px;
  font-weight: 600;
  color: var(--accent);
  flex-shrink: 0;
}

.post-header-text {
  flex: 1;
  min-width: 0;
}

.post-name {
  font-family: var(--serif);
  font-size: 18px;
  color: var(--text-1);
  display: block;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  font-family: var(--mono);
  font-size: 11px;
  color: var(--text-3);
  margin-top: 2px;
}

.post-dot {
  color: var(--border-hi);
}

/* Owner tag + edit link inline in the main report's header meta.
   Hidden on mobile because the sticky action bar already exposes Edit
   there — this avoids showing the edit action twice. */
.owner-tag {
  color: var(--accent);
  font-weight: 600;
}

.owner-edit-link {
  color: var(--accent);
  font-weight: 600;
  text-decoration: none;
}

.owner-edit-link:hover {
  text-decoration: underline;
}

@media (max-width: 720px) {
  .owner-edit-link {
    display: none;
  }
}

.post-desc {
  padding: 14px 16px 0;
  font-size: 14px;
  color: var(--text-2);
  line-height: 1.75;
  font-weight: 300;
  white-space: pre-wrap;
}

.details-panel {
  margin: 18px 16px 0;
  padding: 14px;
  background: var(--surface);
  border: 1px solid var(--border);
}

.details-panel--nested {
  margin: 12px 0 0;
  background: var(--surface-2);
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
}

.details-row dd {
  color: var(--text-1);
  text-align: right;
  word-break: break-word;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  padding: 14px 16px 16px;
  margin-top: 10px;
  border-top: 1px solid var(--border);
  font-family: var(--mono);
  font-size: 10px;
  color: var(--text-3);
}

.gallery-carousel-wrap {
  position: relative;
  margin: 14px 16px 0;
}

.gallery-carousel-wrap--nested {
  margin: 12px 0 0;
}

.gallery-scroll {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scroll-snap-type: x proximity;
  padding-bottom: 4px;
  scrollbar-width: thin;
  scrollbar-color: var(--border-hi) transparent;
}

.gallery-scroll::-webkit-scrollbar {
  height: 6px;
}

.gallery-scroll::-webkit-scrollbar-thumb {
  background: var(--border-hi);
  border-radius: 3px;
}

.gallery-thumb {
  position: relative;
  flex: 0 0 auto;
  width: 160px;
  height: 160px;
  overflow: hidden;
  cursor: pointer;
  scroll-snap-align: start;
  border: 1px solid var(--border);
}

.gallery-thumb--sm {
  width: 120px;
  height: 120px;
}

.gallery-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.gallery-thumb-index {
  position: absolute;
  bottom: 6px;
  right: 6px;
  font-family: var(--mono);
  font-size: 10px;
  color: #fff;
  background: rgba(0, 0, 0, 0.6);
  padding: 2px 6px;
}

.gallery-arrow {
  display: none;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--surface);
  border: 1px solid var(--border-hi);
  color: var(--text-1);
  font-size: 18px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 5;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

.gallery-arrow--left {
  left: -14px;
}

.gallery-arrow--right {
  right: -14px;
}

@media (min-width: 640px) {
  .gallery-arrow {
    display: flex;
  }
}

.lightbox {
  position: fixed;
  inset: 0;
  background: var(--surface-2);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  cursor: zoom-out;
  padding: 24px;
}

.lightbox img {
  max-width: 100%;
  max-height: 100%;
  cursor: default;
}

.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  background: var(--surface-2);
  border: 1px solid rgba(255, 255, 255, 0.25);
}

@media (max-width: 639px) {
  .post-name {
    font-size: 16px;
  }

  .post-desc {
    padding: 12px 12px 0;
    font-size: 15px;
  }

  .details-panel {
    margin: 12px 12px 0;
    padding: 12px;
  }

  .details-list {
    gap: 6px;
  }

  .details-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .details-row dd {
    text-align: center;
  }

  .post-footer {
    flex-direction: column;
    gap: 6px;
    align-items: flex-start;
    padding: 12px;
  }

  .gallery-carousel-wrap {
    margin: 12px;
  }

  .gallery-carousel-wrap--nested {
    margin: 12px 0 0;
  }

  .gallery-thumb {
    width: 45vw;
    height: 45vw;
  }

  .gallery-thumb--sm {
    width: 38vw;
    height: 38vw;
  }

  .gallery-thumb-index {
    bottom: 4px;
    right: 4px;
    font-size: 9px;
    padding: 2px 5px;
  }

  .gallery-arrow {
    display: none;
  }
}

@media (min-width: 640px) {
  .post-name {
    font-size: 20px;
  }

  .post-desc {
    font-size: 14px;
  }

  .details-list {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 12px;
  }

  .details-row {
    width: calc(50% - 6px);
  }

  .gallery-thumb {
    width: 160px;
    height: 160px;
  }

  .gallery-arrow {
    display: flex;
  }

  .post-footer {
    flex-direction: row;
  }
}

.lightbox-nav {
  color: #fff;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 101;
}

.lightbox-nav--prev {
  left: 20px;
}

.lightbox-nav--next {
  right: 20px;
}

.lightbox-nav:hover {
  background: rgba(255, 255, 255, 0.18);
}

.lightbox-counter {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--mono);
  font-size: 11px;
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 10px;
  border-radius: 999px;
}

.lightbox-close {
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
  z-index: 101;
}

.additional-report-item {
  padding: 14px 0;
  border-bottom: 1px solid var(--border);
}

.additional-report-item:last-child {
  border-bottom: none;
}

.additional-report-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.additional-report-header-right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.details-panel--primary {
  background: var(--surface-2);
  border-color: var(--border-hi);
}

.sub-owner-edit-link {
  font-family: var(--mono);
  font-size: 10.5px;
  font-weight: 600;
  color: var(--accent);
  text-decoration: none;
  white-space: nowrap;
}

.sub-owner-edit-link:hover {
  text-decoration: underline;
}

.post-desc--nested {
  padding: 0 0 6px;
}

.post-desc--clamped {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.read-more-btn {
  font-family: var(--mono);
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.03em;
  color: var(--accent);
  background: none;
  border: none;
  padding: 0 0 8px;
  cursor: pointer;
}

.read-more-btn:hover {
  text-decoration: underline;
}

.additional-report-date {
  font-family: var(--mono);
  font-size: 10px;
  color: var(--text-3);
}

.recovery-cta {
  margin: 18px 16px 16px;
  padding: 18px;
  background: var(--accent-dim, rgba(232, 255, 71, 0.06));
  border: 1px solid rgba(232, 255, 71, 0.25);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.recovery-cta-text {
  font-size: 13px;
  color: var(--text-2);
  line-height: 1.6;
  font-weight: 300;
  flex: 1;
  min-width: 200px;
}

.recovery-cta-btn {
  display: inline-flex;
  align-items: center;
  background: var(--accent);
  color: #0a0a0b;
  font-weight: 600;
  font-family: var(--mono);
  font-size: 12px;
  letter-spacing: 0.03em;
  padding: 12px 20px;
  text-decoration: none;
  white-space: nowrap;
}

.recovery-cta-btn:hover {
  background: #d4eb3c;
}

.badge-suspicious {
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #f87171;
  background: rgba(248, 113, 113, 0.08);
  border: 1px solid rgba(248, 113, 113, 0.25);
  padding: 2px 8px;
}

.badge-unverified-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.badge-unverified {
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #eab308;
  background: rgba(234, 179, 8, 0.08);
  border: 1px solid rgba(234, 179, 8, 0.25);
  padding: 2px 8px;
}

.badge-info-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  background: none;
  border: 1px solid var(--border-hi);
  border-radius: 50%;
  color: var(--text-3);
  cursor: pointer;
  padding: 0;
}

.badge-info-btn:hover {
  color: var(--text-1);
  border-color: var(--text-1);
}

.badge-popover-backdrop {
  position: fixed;
  inset: 0;
  background: transparent;
  z-index: 19;
}

.badge-popover {
  position: absolute;
  top: 26px;
  left: -6px;
  z-index: 200;
  width: max-content;
  max-width: 260px;
  background: var(--surface);
  border: 1px solid var(--border-hi);
  padding: 12px 14px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  animation: popover-drop-in 0.15s ease-out;
}

@keyframes popover-drop-in {
  from {
    opacity: 0;
    transform: translateY(-6px) scale(0.97);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.badge-popover p {
  font-size: 12px;
  line-height: 1.6;
  color: var(--text-2);
  font-weight: 300;
}

.badge-popover p+p {
  margin-top: 8px;
}

.badge-popover-sub {
  color: var(--text-3);
  font-style: italic;
}

.badge-popover-brand {
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid var(--border);
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-3);
}

@media (max-width: 480px) {
  .badge-popover {
    position: fixed;
    top: auto;
    left: 16px;
    right: 16px;
    max-width: none;
    width: auto;
  }
}

.avatar--flagged {
  background: rgba(248, 113, 113, 0.1);
  border-color: rgba(248, 113, 113, 0.35);
  color: #f87171;
}

.post-name-label {
  display: block;
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-3);
  margin-bottom: 2px;
}

.details-panel--reporters {
  border-color: rgba(248, 113, 113, 0.25);
}

.reporters-intro {
  font-size: 10px;
  color: var(--text-2);
  font-weight: 600;
  line-height: 1.6;
  margin-bottom: 14px;
  text-align: center;
  background-color: var(--accent-dim);
}

.details-note {
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  background-color: var(--accent-bdr);
  border-left: 10px solid #2b6e4d;
  font-size: 0.875rem;
  color: var(--text-2);
}

.details-note--nested {
  margin: 12px 0 0;
}

.reporter-badge {
  display: inline-block;
  font-family: var(--mono);
  font-size: 9.5px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #f87171;
  background: rgba(248, 113, 113, 0.08);
  border: 1px solid rgba(248, 113, 113, 0.25);
  padding: 3px 9px;
}

.evidence-packet-panel {
  margin: 18px 16px 0;
  padding: 16px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.evidence-packet-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
  min-width: 200px;
}

.evidence-packet-title {
  font-family: var(--serif);
  font-size: 14.5px;
  color: var(--text-1);
}

.evidence-packet-sub {
  font-family: var(--sans);
  font-size: 11.5px;
  color: var(--text-3);
  line-height: 1.5;
}

.evidence-packet-btn {
  font-family: var(--mono);
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.03em;
  background: none;
  color: var(--text-1);
  border: 1px solid var(--border-hi);
  padding: 10px 16px;
  cursor: pointer;
  white-space: nowrap;
  transition: border-color 0.15s, background 0.15s;
}

.evidence-packet-btn:hover:not(:disabled) {
  border-color: var(--accent);
  background: var(--surface);
}

.evidence-packet-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.share-panel {
  margin: 18px 16px 20px;
}

.share-panel .details-heading {
  margin-bottom: 10px;
}

.regulatory-badge {
  margin: 0 16px 14px;
  padding: 12px 14px;
  font-size: 12.5px;
  line-height: 1.6;
}

.regulatory-badge--unregistered {
  background: rgba(248, 113, 113, 0.06);
  border: 1px solid rgba(248, 113, 113, 0.25);
  color: #f87171;
}

.regulatory-badge--probation {
  background: rgba(234, 179, 8, 0.06);
  border: 1px solid rgba(234, 179, 8, 0.25);
  color: #eab308;
}

.regulatory-badge--registered {
  background: rgba(74, 222, 128, 0.06);
  border: 1px solid rgba(74, 222, 128, 0.25);
  color: #4ade80;
}

.regulatory-badge-caveat {
  color: var(--text-3);
  font-weight: 300;
  font-style: italic;
  margin-top: 6px;
  font-size: 11.5px;
}

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

.widget--snapshot {
  position: sticky;
  top: 120px;
  z-index: 5;
}

.widget {
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 16px;
}

.widget-title {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-3);
  margin: 0 0 12px 0;
}

.widget-snap-row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 6px 0;
  font-size: 12.5px;
  border-bottom: 1px solid var(--border);
}

.widget-snap-row:last-child {
  border-bottom: none;
}

.widget-snap-row--states {
  border-bottom: none;
  padding-bottom: 0;
}

.widget-snap-row>span:first-child {
  font-family: var(--mono);
  font-size: 10px;
  color: var(--text-3);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.widget-snap-value {
  text-align: right;
}

.snap-tone--unregistered {
  color: #f87171;
}

.snap-tone--probation {
  color: #eab308;
}

.snap-tone--registered {
  color: #4ade80;
}

.widget-states-scroll-wrap {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 0 10px;
  border-bottom: 1px solid var(--border);
}

.widget-states-scroll {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  scroll-snap-type: x proximity;
  scrollbar-width: none;
}

.widget-states-scroll::-webkit-scrollbar {
  display: none;
}

.widget-state-chip {
  flex: 0 0 auto;
  font-family: var(--mono);
  font-size: 10.5px;
  color: var(--text-2);
  background: var(--surface-2);
  border: 1px solid var(--border);
  padding: 4px 9px;
  scroll-snap-align: start;
  white-space: nowrap;
}

.widget-states-arrow {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: none;
  border: 1px solid var(--border-hi);
  color: var(--text-2);
  font-size: 13px;
  cursor: pointer;
  padding: 0;
}

.widget-states-arrow:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.widget-similar-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 4px;
  text-decoration: none;
  transition: background 0.15s;
}

.widget-similar-row:hover {
  background: var(--surface-2);
}

.widget-similar-name {
  flex: 1;
  min-width: 0;
  font-family: var(--sans);
  font-size: 12.5px;
  color: var(--text-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.widget-similar-count {
  font-family: var(--mono);
  font-size: 10px;
  color: #f87171;
  flex-shrink: 0;
}

.widget--cta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-decoration: none;
  border-left: 3px solid var(--accent);
  transition: transform 0.15s;
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

.mobile-sticky-bar {
  display: none;
}

@media (max-width: 720px) {
  .mobile-sticky-bar {
    display: flex;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 60;
    background: var(--surface);
    border-top: 1px solid var(--border);
    padding: 10px 12px calc(10px + env(safe-area-inset-bottom));
    gap: 8px;
    box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.2);
  }
}

.mobile-sticky-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 11px 8px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  color: var(--text-1);
  font-family: var(--mono);
  font-size: 11.5px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
}

.mobile-sticky-btn--primary {
  background: var(--accent);
  border-color: var(--accent);
  color: #0a0a0b;
}

.line-through {
background: var(--accent);
  border-color: var(--accent);
  margin-bottom: 20px;
}
</style>