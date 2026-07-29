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

onMounted(async () => {
  try {
    const mine: OwnedSubmission[] = JSON.parse(localStorage.getItem('myReportSubmissions') || '[]')
    const match = queryySubmissionId
      ? mine.find(m => m.reportId === reportId && m.submissionId === queryySubmissionId)
      : mine.find(m => m.reportId === reportId)

    if (match) {
      isOwner.value = true
      resolvedSubmissionId.value = match.submissionId || queryySubmissionId
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
})

const isMainSubmission = computed(() => (report.value as any)?.submissionId === resolvedSubmissionId.value)

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


    <ReportForm v-else-if="isMainSubmission && report" :report="report" @submitted="handleSubmitted" />

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