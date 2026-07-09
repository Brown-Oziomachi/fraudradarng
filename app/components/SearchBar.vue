<script setup lang="ts">
const query = ref('')

function handleSearch() {
  if (query.value.trim()) {
    navigateTo(`/search/${encodeURIComponent(query.value.trim())}`)
  }
}
</script>

<template>
  <form class="search-form" @submit.prevent="handleSearch">
    <input v-model="query" class="search-input" placeholder="Search bank, name, or account number..." />
    <button type="submit" class="search-btn">Search</button>
  </form>
</template>

<style scoped>
.search-form { display: flex; gap: 8px; margin-bottom: 24px; }
.search-input {
  flex: 1; background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 10px 14px;
  color: var(--text-1); font-family: var(--sans); font-size: 13px;
}
.search-input:focus { outline: none; border-color: var(--accent-bdr); }
.search-btn {
  background: var(--surface-2); border: 1px solid var(--border);
  color: var(--text-2); font-family: var(--mono); font-size: 11px;
  padding: 10px 16px; border-radius: var(--radius); cursor: pointer;
}
.search-btn:hover { border-color: var(--border-hi); color: var(--text-1); }
</style>