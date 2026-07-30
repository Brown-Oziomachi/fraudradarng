<script setup lang="ts">
import type { Report } from '#shared/types/report'
definePageMeta({
  hideFooter: true,
})

useHead(() => ({
  title: 'Edit Report — Fraud Radar NG'
}))
const route = useRoute()
const router = useRouter()
const reportId = route.params.id as string
const queryySubmissionId = route.query.submissionId as string | undefined

const report = ref<Report | null>(null)
const isLoading = ref(true)
const loadError = ref('')
const isOwner = ref(false)


const resolvedSubmissionId = ref<string | undefined>(queryySubmissionId)

interface OwnedSubmission {
  reportId: string
  submissionId: string
}

// Extracted so it can run on first mount AND whenever the submissionId
// query changes without a full reload — Nuxt reuses this page component
// when only the query changes (e.g. editing reporter #2, then #3, on the
// same report), so onMounted alone would never re-run and the page would
// stay stuck on whatever loaded first.
async function loadEditTarget(targetSubmissionId: string | undefined) {
  isLoading.value = true
  loadError.value = ''
  isOwner.value = false
  resolvedSubmissionId.value = targetSubmissionId
  report.value = null

  try {
    const mine: OwnedSubmission[] = JSON.parse(localStorage.getItem('myReportSubmissions') || '[]')
    const match = targetSubmissionId
      ? mine.find(m => m.reportId === reportId && m.submissionId === targetSubmissionId)
      : mine.find(m => m.reportId === reportId)

    if (match) {
      isOwner.value = true
      resolvedSubmissionId.value = match.submissionId || targetSubmissionId
    }
  } catch {
    isOwner.value = false
  }

  if (!isOwner.value) {
    try {
      const legacyMine: string[] = JSON.parse(localStorage.getItem('myReportIds') || '[]')
      if (legacyMine.includes(reportId)) {
        isOwner.value = true
        resolvedSubmissionId.value = undefined
      }
    } catch {
      // no-op — falls through to "not owner" below
    }
  }

  if (!isOwner.value) {
    isLoading.value = false
    return
  }

  try {
    report.value = await $fetch<Report>(`/api/reports/${reportId}`)

    if (!resolvedSubmissionId.value) {
      resolvedSubmissionId.value = (report.value as any)?.submissionId
    }
  } catch {
    loadError.value = 'Could not load this report. It may have been removed.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => loadEditTarget(queryySubmissionId))

watch(
  () => route.query.submissionId as string | undefined,
  (newId, oldId) => {
    if (newId !== oldId) loadEditTarget(newId)
  }
)

const isMainSubmission = computed(() => (report.value as any)?.submissionId === resolvedSubmissionId.value)

// The top-level evidenceUrls array gets polluted with every additional
// reporter's photos too (the backend currently merges them all into it
// with arrayUnion), so strip out anything that belongs to a specific
// additional reporter — what's left is the main submission's own images.
const mainOwnImages = computed(() => {
  if (!report.value) return []
  const subSet = new Set(
    (report.value.additionalReports ?? []).flatMap((sub: any) => sub.evidenceUrls ?? [])
  )
  return ((report.value as any).evidenceUrls ?? []).filter((img: string) => !subSet.has(img))
})

const reportForEdit = computed(() => {
  if (!report.value) return null
  return { ...report.value, evidenceUrls: mainOwnImages.value }
})

const ownSubmissionEntry = computed(() => {
  if (!report.value || isMainSubmission.value) return null
  return (report.value.additionalReports ?? []).find((s: any) => s.submissionId === resolvedSubmissionId.value) ?? null
})

function handleSubmitted(id: string) {
  router.push(`/reports/${id}`)
}
</script>

<template>
  <div class="edit-page">
    <div v-if="isLoading" class="state-msg">Loading...</div>

    <div v-else-if="!isOwner" class="state-msg">
      You can only edit a report you submitted from this browser.
    </div>

    <div v-else-if="loadError" class="state-msg error">{{ loadError }}</div>

    <ReportForm v-else-if="isMainSubmission && reportForEdit" :report="reportForEdit" @submitted="handleSubmitted" />

    <EditSubmissionForm v-else-if="ownSubmissionEntry && report" :report-id="reportId"
      :submission-id="resolvedSubmissionId!" :submission="ownSubmissionEntry" @submitted="handleSubmitted" />

    <div v-else class="state-msg error">
      Could not find your submission on this report.
    </div>
  </div>
</template>

<style scoped>
.edit-page {
  max-width: 640px;
  margin: 0 auto;
  padding: 32px 20px;
}

.state-msg {
  font-family: var(--mono);
  font-size: 13px;
  color: var(--text-3);
  text-align: center;
  padding: 60px 20px;
}

.state-msg.error {
  color: #f87171;
}
</style>