<!-- app/components/ReportCard.vue -->
<script setup lang="ts">
import type { Report } from '#shared/types/report'

const props = defineProps<{ report: Report }>()

const displayTitle = computed(() => {
  if (props.report.targetType === 'company') {
    return props.report.companyName ?? 'Unknown company'
  }
  if (props.report.targetType === 'website') {
    return props.report.websiteName || props.report.websiteUrl || 'Unknown website'
  }
  return props.report.accountName ?? 'Unknown account'
})

const displaySubtitle = computed(() => {
  if (props.report.targetType === 'company') {
    return props.report.companyAddress || 'Company'
  }
  if (props.report.targetType === 'website') {
    return props.report.websiteUrl || 'Website'
  }
  return props.report.bankName ?? 'Bank account'
})

const displayChip = computed(() => {
  if (props.report.targetType === 'company') {
    return props.report.companyAddress ?? null
  }
  if (props.report.targetType === 'website') {
    return props.report.websiteUrl ?? null
  }
  return props.report.accountNumber ?? null
})

const typeLabel = computed(() => {
  if (props.report.targetType === 'company') return 'Company'
  if (props.report.targetType === 'website') return 'Website'
  return 'Bank Account'
})

const timeAgo = computed(() => {
  if (!props.report.createdAt) return ''
  const now = Date.now()
  const then = new Date(props.report.createdAt).getTime()
  const diffMs = now - then
  const minutes = Math.floor(diffMs / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return new Date(props.report.createdAt).toLocaleDateString('en-NG', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
})

const initials = computed(() => {
  return displayTitle.value
    .split(' ')
    .map(word => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
})

const images = computed(() => {
  if (props.report.evidenceUrls?.length) return props.report.evidenceUrls
  const legacy = (props.report as any).evidenceUrl
  return legacy ? [legacy] : []
})

const previewImages = computed(() => images.value.slice(0, 3))
const remainingCount = computed(() => Math.max(images.value.length - 3, 0))

const CATEGORY_LABELS: Record<string, string> = {
  fintech_ussd: 'Fintech & USSD',
  social_commerce: 'Social commerce',
  visa_travel: 'Visa & travel',
  job_ponzi: 'Job & Ponzi',
  other: 'Other'
}

const categoryLabel = computed(() => {
  if (!props.report.category) return ''
  return CATEGORY_LABELS[props.report.category] ?? ''
})

const DESC_LIMIT = 140
const isTruncated = computed(() => (props.report.description?.length ?? 0) > DESC_LIMIT)
const previewDescription = computed(() => {
  const desc = props.report.description ?? ''
  if (desc.length <= DESC_LIMIT) return desc
  const cut = desc.slice(0, DESC_LIMIT)
  const lastSpace = cut.lastIndexOf(' ')
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd() + '…'
})

// OWNERSHIP — no auth system yet, so ownership is tracked per
// browser: ReportForm saves the new report's id into localStorage
// on successful submit, and we check for it here. Only the browser
// that created the report will see the edit icon.
const isOwner = ref(false)
onMounted(() => {
  try {
    const mine: string[] = JSON.parse(localStorage.getItem('myReportIds') || '[]')
    isOwner.value = mine.includes(props.report.id)
  } catch {
    isOwner.value = false
  }
})

// SHARE
const copied = ref(false)
async function shareReport() {
  const url = `${window.location.origin}/reports/${props.report.id}`
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

// REPORT THIS POST (dispute evidence as untrue)
const showFlagModal = ref(false)
const flagReason = ref('')
const flagSubmitting = ref(false)
const flagSubmitted = ref(false)

async function submitFlag() {
  if (!flagReason.value) return
  flagSubmitting.value = true
  try {
    await $fetch(`/api/reports/${props.report.id}/flag`, {
      method: ("POST" as any),
      body: { reason: flagReason.value }
    })
    flagSubmitted.value = true
    setTimeout(() => {
      showFlagModal.value = false
      flagSubmitted.value = false
      flagReason.value = ''
    }, 1500)
  } catch {
    // silently fail for now — could surface an error message here
  } finally {
    flagSubmitting.value = false
  }
}
</script>

<template>
  <article class="card">
   <div class="card-top">
  <span class="type-chip">{{ typeLabel }}</span>
  <span v-if="categoryLabel" class="category-chip">{{ categoryLabel }}</span>
  <span class="badge-count" :class="{ high: report.reportCount ? report.reportCount >= 3 : false }">
    Flagged {{ report.reportCount ?? 1 }}x
  </span>
</div>

   <NuxtLink :to="`/reports/${report.id}`" class="post-header-link">
  <div class="post-header">
    <div class="avatar avatar--flagged">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
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
</NuxtLink>

    <div class="card-body">
      <p class="card-desc">
        {{ previewDescription }}
        <NuxtLink v-if="isTruncated" :to="`/reports/${report.id}`" class="continue-inline">
          Continue reading
        </NuxtLink>
      </p>
    </div>

    <NuxtLink
      v-if="previewImages.length"
      :to="`/reports/${report.id}`"
      class="gallery"
      :class="`gallery-${previewImages.length}`"
    >
      <div
        v-for="(img, index) in previewImages"
        :key="index"
        class="gallery-cell"
      >
        <img :src="img" class="gallery-img" :alt="`Evidence ${index + 1}`" />
        <span v-if="index === 2 && remainingCount > 0" class="gallery-more-overlay">
          +{{ remainingCount }} more
        </span>
      </div>
    </NuxtLink>

    <div v-if="displayChip" class="card-footer">
      <span class="tag">{{ displayChip }}</span>
    </div>

    <!-- ACTION BAR — edit (owner only), report, share -->
    <div class="action-bar">
      <NuxtLink v-if="isOwner" :to="`/reports/${report.id}/edit`" class="action-btn">
        <svg viewBox="0 0 24 24" width="15" height="15"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z"/></svg>
        Edit
      </NuxtLink>

      <button type="button" class="action-btn" @click="showFlagModal = true">
        <svg viewBox="0 0 24 24" width="15" height="15"><path fill="currentColor" d="M4 2v20h2v-7h13l-2.5-5L19 5H6V2z"/></svg>
        Report
      </button>

      <button type="button" class="action-btn" @click="shareReport">
        <svg viewBox="0 0 24 24" width="15" height="15"><path fill="currentColor" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81a3 3 0 1 0-3-3c0 .24.04.47.09.7L8.04 9.81A2.99 2.99 0 0 0 3 12a3 3 0 0 0 5.04 2.19l7.12 4.16c-.05.21-.08.43-.08.65a3 3 0 1 0 3-3z"/></svg>
        {{ copied ? 'Link copied!' : 'Share' }}
      </button>
    </div>

    <!-- REPORT/FLAG MODAL -->
    <Teleport to="body">
      <div v-if="showFlagModal" class="modal-overlay" @click.self="showFlagModal = false">
        <div class="modal">
          <template v-if="!flagSubmitted">
            <h3 class="modal-title">Report this evidence</h3>
            <p class="modal-sub">
              Tell us why you think this report is inaccurate or misleading.
            </p>
            <select v-model="flagReason" class="modal-select">
              <option value="" disabled>Select a reason...</option>
              <option value="not_accurate">This information is not accurate</option>
              <option value="wrong_person">Wrong person / account attached</option>
              <option value="already_resolved">This has already been resolved</option>
              <option value="other">Other</option>
            </select>
            <div class="modal-actions">
              <button type="button" class="modal-cancel" @click="showFlagModal = false">Cancel</button>
              <button
                type="button"
                class="modal-submit"
                :disabled="!flagReason || flagSubmitting"
                @click="submitFlag"
              >
                {{ flagSubmitting ? 'Submitting...' : 'Submit report' }}
              </button>
            </div>
          </template>
          <template v-else>
            <p class="modal-success">Thanks — this has been flagged for review.</p>
          </template>
        </div>
      </div>
    </Teleport>
  </article>
</template>

<style scoped>
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  transition: border-color 0.2s, transform 0.2s;
  margin-bottom: 16px;
}
.card:hover { border-color: var(--border-hi); }

.card-top {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  padding: 12px 14px 0;
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
.badge-count.high {
  color: #f87171; background: rgba(248,113,113,0.08);
  border-color: rgba(248,113,113,0.25);
}

.post-header-link { text-decoration: none; display: block; }

.post-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 14px 0;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--surface-2);
  border: 1px solid var(--border-hi);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--mono);
  font-size: 13px;
  font-weight: 600;
  color: var(--accent);
  flex-shrink: 0;
}

.post-header-text { flex: 1; min-width: 0; }

.post-name {
  font-family: var(--serif);
  font-size: 16px;
  color: var(--text-1);
  display: block;
}

.post-meta {
  display: flex; align-items: center; gap: 6px;
  font-family: var(--mono); font-size: 11px; color: var(--text-3);
  margin-top: 2px;
}
.post-dot { color: var(--border-hi); }

.card-body { padding: 10px 14px; }

/* Preserve real line breaks and spacing from the original text
   instead of letting HTML collapse them */
.card-desc {
  font-size: 13px; color: var(--text-2);
  line-height: 1.6; font-weight: 300;
  white-space: pre-wrap;
  word-break: break-word;
}

.continue-inline {
  color: var(--accent);
  font-family: var(--mono);
  font-size: 12px;
  text-decoration: none;
  margin-left: 4px;
  white-space: nowrap;
}
.continue-inline:hover { text-decoration: underline; }

.gallery {
  display: grid;
  gap: 3px;
  margin: 0 14px 12px;
  border-radius: 8px;
  overflow: hidden;
  text-decoration: none;
}

.gallery-1 { grid-template-columns: 1fr; }
.gallery-1 .gallery-cell { aspect-ratio: 16 / 9; }

.gallery-2 { grid-template-columns: 1fr 1fr; }
.gallery-2 .gallery-cell { aspect-ratio: 1; }

.gallery-3 { grid-template-columns: 2fr 1fr; grid-template-rows: 1fr 1fr; height: 220px; }
.gallery-3 .gallery-cell:first-child { grid-row: 1 / span 2; }

.gallery-cell { position: relative; overflow: hidden; }
.gallery-img { width: 100%; height: 100%; object-fit: cover; display: block; }

.gallery-more-overlay {
  position: absolute; inset: 0;
  background: rgba(10,10,11,0.6);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--mono); font-size: 13px; color: #fff;
}

.card-footer { padding: 10px 14px 0; }

.tag {
  font-family: var(--mono); font-size: 10px;
  color: var(--text-3);
  word-break: break-all;
}

/* ACTION BAR */
.action-bar {
  display: flex;
  border-top: 1px solid var(--border);
  margin-top: 10px;
}
.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 8px;
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--mono);
  font-size: 11px;
  color: var(--text-3);
  text-decoration: none;
}
.action-btn:hover { background: var(--surface-2); color: var(--text-1); }

/* MODAL */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex; align-items: center; justify-content: center;
  z-index: 200; padding: 20px;
}
.modal {
  background: var(--surface);
  border: 1px solid var(--border-hi);
  border-radius: 12px;
  padding: 20px;
  max-width: 380px;
  width: 100%;
}
.modal-title { font-family: var(--serif); font-size: 17px; color: var(--text-1); margin-bottom: 6px; }
.modal-sub { font-size: 12px; color: var(--text-3); margin-bottom: 14px; line-height: 1.6; }
.modal-select {
  width: 100%;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 10px 12px;
  color: var(--text-1);
  font-size: 13px;
  margin-bottom: 14px;
}
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; }
.modal-cancel {
  background: none; border: 1px solid var(--border);
  color: var(--text-3); font-family: var(--mono); font-size: 11px;
  padding: 8px 14px; border-radius: var(--radius); cursor: pointer;
}
.modal-submit {
  background: var(--accent); color: #0a0a0b; font-weight: 600;
  font-family: var(--mono); font-size: 11px;
  padding: 8px 14px; border-radius: var(--radius); border: none; cursor: pointer;
}
.modal-submit:disabled { opacity: 0.6; cursor: not-allowed; }
.modal-success {
  font-family: var(--mono); font-size: 13px; color: #4ade80; text-align: center; padding: 10px 0;
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
</style>