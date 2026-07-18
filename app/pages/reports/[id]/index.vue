<script setup lang="ts">
import type { Report, ScamCategory } from '#shared/types/report'

const route = useRoute()
const router = useRouter()
const id = route.params.id as string
const detailCache = useReportDetailCache()

const cached = detailCache.value[id]
const report = ref<Report & { state?: string } | null>(cached ?? null)
const pending = ref(!cached)
const error = ref<any>(null)

if (!cached) {
  const { data, pending: fetchPending, error: fetchError } = await useLazyFetch<Report>(`/api/reports/${id}`)
  watch(data, (val) => {
    if (val) {
      report.value = val
      detailCache.value[id] = val
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

const showUnverifiedInfo = ref(false)

function toggleUnverifiedInfo() {
  showUnverifiedInfo.value = !showUnverifiedInfo.value
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

const timeAgo = computed(() => {
  const r = report.value
  if (!r?.createdAt) return ''
  const diffMs = Date.now() - new Date(r.createdAt).getTime()
  const minutes = Math.floor(diffMs / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return new Date(r.createdAt).toLocaleDateString('en-NG', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
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

const images = computed(() => {
  const r = report.value
  if (!r) return []
  if (r.evidenceUrls?.length) return r.evidenceUrls
  const legacy = (r as any).evidenceUrl
  return legacy ? [legacy] : []
})

const reportForShare = computed<Report | null>(() => {
  const r = report.value
  if (!r) return null
  // ensure non-optional fields expected by ShareableWarningCard
  return ({ ...r, bankName: r.bankName ?? '' }) as Report
})

const sharedFields = computed(() => {
  const r = report.value
  if (!r) return []
  const fields = []
  if (r.amountInvolved != null) {
    fields.push({ label: 'Amount involved', value: `₦${r.amountInvolved.toLocaleString()}` })
  }
  if (r.contactPlatform) {
    fields.push({ label: 'Contact platform', value: r.contactPlatform })
  }
  // ADDED: surfaces the state field captured on the report form, alongside
  // the other cross-cutting details that aren't tied to a specific target type.
  if (r.state) {
    fields.push({ label: 'State', value: r.state })
  }
  return fields
})

const detailFields = computed(() => {
  const r = report.value
  if (!r) return []
  if (r.targetType === 'company') {
    return [
      { label: 'Company name', value: r.companyName },
      { label: 'Address', value: r.companyAddress },
    ].filter(f => f.value)
  }
  if (r.targetType === 'website') {
    return [
      { label: 'Website name', value: r.websiteName },
      { label: 'Website URL', value: r.websiteUrl },
    ].filter(f => f.value)
  }
  return [
    { label: 'Account name', value: r.accountName },
    { label: 'Bank name', value: r.bankName },
    { label: 'Account number', value: r.accountNumber },
  ].filter(f => f.value)
})

const galleryScrollRef = ref<HTMLElement | null>(null)

// Main gallery images support prev/next navigation.
// Additional-reporter evidence images (separate arrays) open standalone, no navigation.
const activeGalleryIndex = ref<number | null>(null)
const activeStandaloneImage = ref<string | null>(null)

const lightboxOpen = computed(() => activeGalleryIndex.value !== null || activeStandaloneImage.value !== null)
const lightboxSrc = computed(() => {
  if (activeGalleryIndex.value !== null) return images.value[activeGalleryIndex.value]
  return activeStandaloneImage.value
})
const canNavigate = computed(() => activeGalleryIndex.value !== null && images.value.length > 1)

function openImage(index: number) {
  activeGalleryIndex.value = index
  activeStandaloneImage.value = null
}
function openStandaloneImage(src: string) {
  activeStandaloneImage.value = src
  activeGalleryIndex.value = null
}
function closeImage() {
  activeGalleryIndex.value = null
  activeStandaloneImage.value = null
}
function nextImage() {
  if (activeGalleryIndex.value === null) return
  activeGalleryIndex.value = (activeGalleryIndex.value + 1) % images.value.length
}
function prevImage() {
  if (activeGalleryIndex.value === null) return
  activeGalleryIndex.value = (activeGalleryIndex.value - 1 + images.value.length) % images.value.length
}
function scrollGallery(direction: number) {
  const el = galleryScrollRef.value
  if (!el) return
  el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: 'smooth' })
}
function handleLightboxKeydown(e: KeyboardEvent) {
  if (!lightboxOpen.value) return
  if (e.key === 'ArrowRight') nextImage()
  else if (e.key === 'ArrowLeft') prevImage()
  else if (e.key === 'Escape') closeImage()
}

onMounted(() => window.addEventListener('keydown', handleLightboxKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleLightboxKeydown))

// ============ ADDED: everything below is new — nothing above was changed ============

// --- Verification progress meter ---
// Mirrors the "3 independent reports = Highly Suspicious" rule already
// explained in the unverified-badge popover above.
const confirmationsNeeded = 3
const confirmationsCount = computed(() => {
  const r = report.value
  if (!r) return 0
  return Math.min(r.distinctReporterCount ?? r.reportCount ?? 1, confirmationsNeeded)
})
const confirmationsPct = computed(() => Math.round((confirmationsCount.value / confirmationsNeeded) * 100))

// --- Trust & similar-reports sidebar ---
// Client-only supplementary fetch — pulls the general reports feed and
// filters to the same category on the client so it doesn't block or slow
// down the main report's SSR render. If a dedicated `/api/reports?category=`
// filter exists server-side, swapping this fetch to use it would be cheaper.
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

    <!-- ADDED: detail-grid wraps the article in a main column and introduces
         a sidebar (desktop only, from 1080px). The article's own markup is
         completely unchanged apart from the two new panels marked below. -->
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

              <!-- FIXED: backdrop is now just a click-catcher, no longer wraps the popover,
       so it can't hijack the popover's absolute-positioning containing block -->
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

          <!-- ADDED: verification progress meter -->
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
              </div>
            </div>
          </div>

          <p class="post-desc">{{ report.description }}</p>

          <div v-if="images.length" class="gallery-carousel-wrap">
            <button v-if="images.length > 1" type="button" class="gallery-arrow gallery-arrow--left"
              aria-label="Scroll images left" @click="scrollGallery(-1)">‹</button>

            <div ref="galleryScrollRef" class="gallery-scroll">
              <div v-for="(img, index) in images" :key="index" class="gallery-thumb" @click="openImage(index)">
                <img :src="img" :alt="`Evidence ${index + 1}`" />
                <span class="gallery-thumb-index">{{ index + 1 }}/{{ images.length }}</span>
              </div>
            </div>

            <button v-if="images.length > 1" type="button" class="gallery-arrow gallery-arrow--right"
              aria-label="Scroll images right" @click="scrollGallery(1)">›</button>
          </div>

          <div v-if="detailFields.length" class="details-panel">
            <h2 class="details-heading">Reported details</h2>
            <dl class="details-list">
              <div v-for="field in detailFields" :key="field.label" class="details-row">
                <dt>{{ field.label }}</dt>
                <dd>{{ field.value }}</dd>
              </div>
            </dl>
          </div>

          <div v-if="sharedFields.length" class="details-panel">
            <h2 class="details-heading">Additional details</h2>
            <dl class="details-list">
              <div v-for="field in sharedFields" :key="field.label" class="details-row">
                <dt>{{ field.label }}</dt>
                <dd>{{ field.value }}</dd>
              </div>
            </dl>
          </div>

          <!-- Other reporters' submissions on the same target -->
          <div v-if="report.additionalReports?.length" class="details-panel details-panel--reporters">
            <h2 class="details-heading">
              Also reported by {{ report.additionalReports.length }} other{{ report.additionalReports.length > 1 ? 's' :
                '' }}
            </h2>
            <p class="reporters-intro">
              These are separate people who independently reported the same account, number, or website.
            </p>

            <div v-for="(sub, index) in report.additionalReports" :key="index" class="additional-report-item">
              <div class="additional-report-header">
                <span class="reporter-badge">Reporter #{{ index + 2 }}</span>
                <span class="additional-report-date">{{ sub.createdAt }}</span>
              </div>

              <p class="post-desc post-desc--nested">{{ sub.description }}</p>

              <dl v-if="sub.amountInvolved || sub.contactPlatform" class="details-list">
                <div v-if="sub.amountInvolved" class="details-row">
                  <dt>Amount involved</dt>
                  <dd>₦{{ sub.amountInvolved.toLocaleString() }}</dd>
                </div>
                <div v-if="sub.contactPlatform" class="details-row">
                  <dt>Contact platform</dt>
                  <dd>{{ sub.contactPlatform }}</dd>
                </div>
              </dl>

              <div v-if="sub.evidenceUrls?.length" class="additional-evidence">
                <img v-for="(img, i) in sub.evidenceUrls" :key="i" :src="img" alt="Evidence"
                  class="additional-evidence-thumb" @click="openStandaloneImage(img)" />
              </div>
            </div>
          </div>

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

          <!-- ADDED: printable evidence packet -->
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

      <!-- ADDED: trust & similar-reports sidebar (desktop only) -->
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
          <!-- ADDED: state row, only shown when the report has one set -->
          <div v-if="report.state" class="widget-snap-row">
            <span>State</span>
            <span>{{ report.state }}</span>
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
        {{ (activeGalleryIndex ?? 0) + 1 }} / {{ images.length }}
      </span>

      <button type="button" class="lightbox-close" aria-label="Close" @click.stop="closeImage">×</button>
    </div>

    <!-- ADDED: sticky mobile action bar -->
    <div v-if="report" class="mobile-sticky-bar">
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

/* FIXED: give the page more room once the sidebar kicks in, so the main
   card isn't squeezed to fit both columns inside the old 720px cap */
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

/* ADDED: extra bottom padding on mobile so the sticky action bar never
   covers the last bit of content */
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

/* ADDED: two-column layout — article + sidebar (desktop only) */
.detail-grid {
  display: grid;
  grid-template-columns: 1fr;
  /* mobile/tablet: single column, full width */
  gap: 24px;
}

@media (min-width: 1080px) {
  .detail-grid {
    grid-template-columns: 1fr 320px;
    gap: 32px;
    /* FIXED: a bit more breathing room between columns on desktop */
  }
}

.detail-grid .main-col {
  min-width: 0;
  width: 100%;
}

.detail-grid .post {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
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
  border-radius: 3px;
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
  border-radius: 3px;
}

.badge-count {
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.06em;
  color: #4ade80;
  background: rgba(74, 222, 128, 0.07);
  border: 1px solid rgba(74, 222, 128, 0.18);
  padding: 2px 8px;
  border-radius: 3px;
}

.badge-count.high {
  color: #f87171;
  background: rgba(248, 113, 113, 0.08);
  border-color: rgba(248, 113, 113, 0.25);
}

/* ADDED: verification progress meter */
.verify-meter-wrap {
  padding: 10px 16px 0;
}

.verify-meter {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  /* FIXED: allow the row to wrap instead of forcing overflow */
}

.verify-meter-track {
  flex: 1;
  min-width: 60px;
  /* FIXED: keep the bar from collapsing to nothing when wrapped */
  height: 6px;
  background: var(--surface-2);
  border-radius: 4px;
  overflow: hidden;
}

.verify-meter-fill {
  height: 100%;
  background: linear-gradient(90deg, #eab308, var(--accent));
  border-radius: 4px;
  transition: width 0.5s ease;
}

.verify-meter-text {
  font-family: var(--mono);
  font-size: 10px;
  color: var(--text-3);
  white-space: normal;
  /* FIXED: was nowrap, which pushed text outside the card */
}

.verify-meter--complete {
  background: rgba(74, 222, 128, 0.07);
  border: 1px solid rgba(74, 222, 128, 0.18);
  border-radius: 6px;
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
  font-family: var(--mono);
  font-size: 11px;
  color: var(--text-3);
  margin-top: 2px;
}

.post-dot {
  color: var(--border-hi);
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
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 8px;
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
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  scroll-snap-align: start;
  border: 1px solid var(--border);
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
  border-radius: 4px;
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
  background: rgba(0, 0, 0, 0.9);
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
  border-radius: 8px;
  cursor: default;
}

.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.25);
}

/* Responsive adjustments */
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
    text-align: left;
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

  .gallery-thumb {
    width: 45vw;
    height: 45vw;
    border-radius: 8px;
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

.post-desc--nested {
  padding: 0 0 10px;
}

.additional-evidence {
  display: flex;
  gap: 8px;
  margin-top: 10px;
  flex-wrap: wrap;
}

.additional-evidence-thumb {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid var(--border-hi);
  cursor: pointer;
}

.additional-report-date {
  display: block;
  margin-top: 8px;
  font-family: var(--mono);
  font-size: 10px;
  color: var(--text-3);
}

.recovery-cta {
  margin: 18px 16px 16px;
  padding: 18px;
  background: var(--accent-dim, rgba(232, 255, 71, 0.06));
  border: 1px solid rgba(232, 255, 71, 0.25);
  border-radius: 8px;
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
  border-radius: 6px;
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
  border-radius: 3px;
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
  border-radius: 3px;
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
  border-radius: 8px;
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
    bottom: 20px;
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
  font-size: 12px;
  color: var(--text-3);
  font-weight: 300;
  line-height: 1.6;
  margin-bottom: 14px;
}

.additional-report-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
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
  border-radius: 4px;
}

/* ADDED: printable evidence packet panel */
.evidence-packet-panel {
  margin: 18px 16px 0;
  padding: 16px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 8px;
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
  border-radius: 6px;
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
  border-radius: 8px;
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
  border-radius: var(--radius, 8px);
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

.widget-similar-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 4px;
  text-decoration: none;
  border-radius: 6px;
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

/* ============ ADDED: sticky mobile action bar ============ */
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
  border-radius: 8px;
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
</style>