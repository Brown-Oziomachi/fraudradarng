<script setup lang="ts">
import type { Report } from '#shared/types/report'

const route = useRoute()
const searchTerm = computed(() => String(route.params.query))

const { data: results, pending } = await useFetch<Report[]>('/api/search', {
  query: { q: searchTerm },
  watch: [searchTerm]
})
</script>

<template>
  <div>
    <h2 class="search-title">Results for "{{ searchTerm }}"</h2>
    <p v-if="pending">Searching...</p>
    <p v-else-if="!results?.length" class="empty">No matches found.</p>
    <ReportCard v-for="report in results" :key="report.id" :report="report" />
  </div>
</template>

<style scoped>
.search-title {
  font-family: var(--serif); font-size: 22px;
  color: var(--text-1); margin-bottom: 16px;
}
.empty {
  font-family: var(--mono); font-size: 12px; color: var(--text-3);
}
</style>