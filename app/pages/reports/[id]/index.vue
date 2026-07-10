<script setup lang="ts">
import type { Report, ScamCategory } from '#shared/types/report'

const route = useRoute()
const id = route.params.id as string

const { data: report, pending, error } = await useLazyFetch<Report>(`/api/reports/${id}`)

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

const galleryClass = computed(() => {
  const n = images.value.length
  if (n === 1) return 'gallery-1'
  if (n === 2) return 'gallery-2'
  if (n === 3) return 'gallery-3'
  return 'gallery-4plus'
})

const activeImage = ref<string | null>(null)
function openImage(src: string) {
  activeImage.value = src
}
function closeImage() {
  activeImage.value = null
}

useHead(() => ({
  title: report.value ? `${displayTitle.value} — Fraud Radar NG` : 'Report — Fraud Radar NG'
}))
</script>

<template>
  <div class="page-body">
    <NuxtLink to="/reports" class="back-link">← Back to reports</NuxtLink>

    <p v-if="pending" class="loading-text">Loading report...</p>
    <p v-else-if="error || !report" class="empty-text">
      This report could not be found. It may have been removed.
    </p>

    <article v-else class="post">
   <div class="post-top">
  <span class="type-chip">{{ typeLabel }}</span>
  <span v-if="categoryLabel" class="category-chip">{{ categoryLabel }}</span>

  <span v-if="report.status === 'flagged'" class="badge-suspicious">
    ⚠ Highly Suspicious — {{ report.distinctReporterCount ?? report.reportCount ?? 1 }} independent reports
  </span>

  <span v-else class="badge-unverified-wrap">
    <span class="badge-unverified">Unverified</span>
    <button
      type="button"
      class="badge-info-btn"
      aria-label="Why is this unverified?"
      @click="toggleUnverifiedInfo"
    >
      <svg viewBox="0 0 24 24" width="12" height="12" fill="none">
        <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

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
<p class="badge-popover-brand">
  Fraud Radar NG
</p>
    </div>
  </span>
</div>

      <div class="post-header">
  <div class="avatar avatar--flagged">
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
      <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </div>
  <div class="post-header-text">
    <span class="post-name-label">Flagged account</span>
    <span class="post-name">{{ displayTitle }}</span>
    <div class="post-meta">
      <span>{{ displaySubtitle }}</span>
      <span v-if="timeAgo" class="post-dot">·</span>
      <span v-if="timeAgo">reported {{ timeAgo }}</span>
    </div>
  </div>
</div>

      <p class="post-desc">{{ report.description }}</p>

      <div v-if="images.length" class="gallery" :class="galleryClass">
        <div
          v-for="(img, index) in images.slice(0, 4)"
          :key="index"
          class="gallery-cell"
          @click="openImage(img)"
        >
          <img :src="img" :alt="`Evidence ${index + 1}`" />
          <span v-if="index === 3 && images.length > 4" class="gallery-more-overlay">
            +{{ images.length - 4 }}
          </span>
        </div>
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
            Also reported by {{ report.additionalReports.length }} other{{ report.additionalReports.length > 1 ? 's' : '' }}
          </h2>
          <p class="reporters-intro">
            These are separate people who independently reported the same account, number, or website.
          </p>

          <div
            v-for="(sub, index) in report.additionalReports"
            :key="index"
            class="additional-report-item"
          >
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
              <img
                v-for="(img, i) in sub.evidenceUrls"
                :key="i"
                :src="img"
                alt="Evidence"
                class="additional-evidence-thumb"
                @click="openImage(img)"
              />
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

      <div class="share-panel">
        <h2 class="details-heading">Warn others</h2>
        <ShareableWarningCard
          v-if="report"
          :report="({
            ...(report as any),
            bankName: report.bankName ?? '',
            accountName: report.accountName ?? '',
            accountNumber: report.accountNumber ?? '',
            companyName: (report as any).companyName ?? '',
            companyAddress: (report as any).companyAddress ?? '',
            websiteUrl: (report as any).websiteUrl ?? '',
            websiteName: (report as any).websiteName ?? ''
          } as any)"
        />
      </div>
    </article>

    <div v-if="activeImage" class="lightbox" @click="closeImage">
      <img :src="activeImage" alt="Evidence full size" />
    </div>
  </div>
</template>

<style scoped>
.page-body { max-width: 720px; margin: 0 auto; padding: 24px 24px 60px; }
@media (max-width: 560px) { .page-body { padding: 20px 16px 60px; } }

.back-link {
  display: inline-block;
  font-family: var(--mono); font-size: 11px; color: var(--text-3);
  text-decoration: none; margin-bottom: 20px;
}
.back-link:hover { color: var(--text-1); }

.loading-text, .empty-text {
  font-family: var(--mono); font-size: 12px; color: var(--text-3); padding: 24px 0;
}

.post {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
}

.post-top {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  padding: 14px 16px 0;
}

.type-chip {
  font-family: var(--mono); font-size: 9px; letter-spacing: 0.06em;
  text-transform: uppercase; color: var(--text-3);
  background: var(--surface-2); border: 1px solid var(--border);
  padding: 2px 8px; border-radius: 3px;
}

.category-chip {
  font-family: var(--mono); font-size: 9px; letter-spacing: 0.06em;
  text-transform: uppercase; color: var(--accent);
  background: var(--accent-dim, rgba(232,255,71,0.08));
  border: 1px solid rgba(232,255,71,0.25);
  padding: 2px 8px; border-radius: 3px;
}

.badge-count {
  font-family: var(--mono); font-size: 9px; letter-spacing: 0.06em;
  color: #4ade80; background: rgba(74,222,128,0.07);
  border: 1px solid rgba(74,222,128,0.18);
  padding: 2px 8px; border-radius: 3px;
}
.badge-count.high { color: #f87171; background: rgba(248,113,113,0.08); border-color: rgba(248,113,113,0.25); }

.post-header { display: flex; align-items: flex-start; gap: 12px; padding: 14px 16px 0; }

.avatar {
  width: 44px; height: 44px; border-radius: 50%;
  background: var(--surface-2); border: 1px solid var(--border-hi);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--mono); font-size: 14px; font-weight: 600; color: var(--accent);
  flex-shrink: 0;
}

.post-header-text { flex: 1; min-width: 0; }
.post-name { font-family: var(--serif); font-size: 18px; color: var(--text-1); display: block; }
.post-meta {
  display: flex; align-items: center; gap: 6px;
  font-family: var(--mono); font-size: 11px; color: var(--text-3); margin-top: 2px;
}
.post-dot { color: var(--border-hi); }

.post-desc {
  padding: 14px 16px 0;
  font-size: 14px; color: var(--text-2); line-height: 1.75; font-weight: 300;
  white-space: pre-wrap;
}

.gallery { margin: 14px 16px 0; border-radius: 10px; overflow: hidden; }
.gallery-cell { position: relative; cursor: pointer; overflow: hidden; }
.gallery-cell img { width: 100%; height: 100%; object-fit: cover; display: block; }

.gallery-1 { display: grid; }
.gallery-1 .gallery-cell { aspect-ratio: 16 / 10; }

.gallery-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 3px; }
.gallery-2 .gallery-cell { aspect-ratio: 1; }

.gallery-3 { display: grid; grid-template-columns: 2fr 1fr; grid-template-rows: 1fr 1fr; gap: 3px; height: 320px; }
.gallery-3 .gallery-cell:first-child { grid-row: 1 / span 2; }

.gallery-4plus { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 3px; height: 340px; }

.gallery-more-overlay {
  position: absolute; inset: 0;
  background: rgba(10,10,11,0.6);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--mono); font-size: 20px; color: #fff;
}

.details-panel { margin: 18px 16px 0; padding: 14px; background: var(--surface-2); border: 1px solid var(--border); border-radius: 8px; }
.details-heading {
  font-family: var(--mono); font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--text-3); margin-bottom: 10px;
}
.details-list { display: flex; flex-direction: column; gap: 8px; }
.details-row { display: flex; justify-content: space-between; gap: 12px; font-size: 13px; }
.details-row dt { color: var(--text-3); font-family: var(--mono); font-size: 11px; }
.details-row dd { color: var(--text-1); text-align: right; word-break: break-word; }

.post-footer {
  display: flex; justify-content: space-between;
  padding: 14px 16px 16px; margin-top: 10px; border-top: 1px solid var(--border);
  font-family: var(--mono); font-size: 10px; color: var(--text-3);
}

.lightbox {
  position: fixed; inset: 0; background: rgba(0,0,0,0.9);
  display: flex; align-items: center; justify-content: center;
  z-index: 100; cursor: zoom-out; padding: 24px;
}
.lightbox img { max-width: 100%; max-height: 100%; border-radius: 8px; }

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
  background: var(--accent-dim, rgba(232,255,71,0.06));
  border: 1px solid rgba(232,255,71,0.25);
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
.recovery-cta-btn:hover { background: #d4eb3c; }

.badge-suspicious {
  font-family: var(--mono); font-size: 9px; letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #f87171; background: rgba(248,113,113,0.08);
  border: 1px solid rgba(248,113,113,0.25);
  padding: 2px 8px; border-radius: 3px;
}

.badge-unverified-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.badge-unverified {
  font-family: var(--mono); font-size: 9px; letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #eab308; background: rgba(234,179,8,0.08);
  border: 1px solid rgba(234,179,8,0.25);
  padding: 2px 8px; border-radius: 3px;
}
.badge-info-btn {
  display: flex; align-items: center; justify-content: center;
  width: 16px; height: 16px;
  background: none; border: 1px solid var(--border-hi);
  border-radius: 50%; color: var(--text-3);
  cursor: pointer; padding: 0;
}
.badge-info-btn:hover { color: var(--text-1); border-color: var(--text-1); }

.badge-popover {
  position: absolute;
  top: calc(100% + 8px);
  right: 5;
  left: auto;
  z-index: 20;
  width: min(260px, calc(100vw - 40px));
  background: var(--surface);
  border: 1px solid var(--border-hi);
  border-radius: 8px;
  padding: 12px 14px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.25);
}
.badge-popover p {
  font-size: 12px;
  line-height: 1.6;
  color: var(--text-2);
  font-weight: 300;
}
.badge-popover p + p { margin-top: 8px; }
.badge-popover-sub { color: var(--text-3); font-style: italic; }

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

.share-panel {
  margin: 18px 16px 20px;
}
.share-panel .details-heading {
  margin-bottom: 10px;
}
</style>