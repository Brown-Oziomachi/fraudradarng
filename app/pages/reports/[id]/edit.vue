<script setup lang="ts">
import type { Report } from '#shared/types/report'

const route = useRoute()
const router = useRouter()
const reportId = route.params.id as string

const report = ref<Report | null>(null)
const isLoading = ref(true)
const loadError = ref('')
const isOwner = ref(false)

onMounted(async () => {
  try {
    const mine: string[] = JSON.parse(localStorage.getItem('myReportIds') || '[]')
    isOwner.value = mine.includes(reportId)
  } catch {
    isOwner.value = false
  }

  if (!isOwner.value) {
    isLoading.value = false
    return
  }

  try {
    report.value = await $fetch<Report>(`/api/reports/${reportId}`)
  } catch {
    loadError.value = 'Could not load this report. It may have been removed.'
  } finally {
    isLoading.value = false
  }
})

function handleSubmitted(id: string) {
  router.push(`/reports/${id}`)
}
</script>

<template>
  <div class="edit-page">
    <div v-if="isLoading" class="state-msg">Loading...</div>

    <div v-else-if="!isOwner" class="state-msg">
      You can only edit reports you created from this browser.
    </div>

    <div v-else-if="loadError" class="state-msg error">{{ loadError }}</div>

    <ReportForm v-else :report="report" @submitted="handleSubmitted" />
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