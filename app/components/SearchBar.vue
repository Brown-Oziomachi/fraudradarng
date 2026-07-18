<script setup lang="ts">
interface SearchResult {
  id: string
  name: string
  typeLabel: string
  category: string
  excerpt?: string
  dateReported?: string
  status: string
  reportCount: number
  thumbnail: string | null
}

const query = ref('')
const isOpen = ref(false)
const loading = ref(false)
const hasSearched = ref(false)
const results = ref<SearchResult[]>([])

const wrapRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

function openSearch() {
  isOpen.value = true
  nextTick(() => inputRef.value?.focus())
}

function closeSearch() {
  isOpen.value = false
}

function clearQuery() {
  query.value = ''
  results.value = []
  hasSearched.value = false
}

async function runSearch(term: string) {
  loading.value = true
  try {
    const data = await $fetch<SearchResult[]>('/api/reports/search', { query: { q: term } })
    results.value = data ?? []
  } catch {
    results.value = []
  } finally {
    loading.value = false
    hasSearched.value = true
  }
}

function onInput() {
  if (debounceTimer) clearTimeout(debounceTimer)
  const term = query.value.trim()
  if (!term) {
    results.value = []
    hasSearched.value = false
    return
  }
  debounceTimer = setTimeout(() => runSearch(term), 300)
}

function onEnter() {
  if (debounceTimer) clearTimeout(debounceTimer)
  const term = query.value.trim()
  if (term) runSearch(term)
}

function goToResult(id: string) {
  closeSearch()
  navigateTo(`/reports/${id}`)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') closeSearch()
}

function onClickOutside(e: MouseEvent) {
  if (isOpen.value && wrapRef.value && !wrapRef.value.contains(e.target as Node)) {
    closeSearch()
  }
}

watch(isOpen, (open) => {
  if (open) {
    document.addEventListener('keydown', onKeydown)
    document.addEventListener('mousedown', onClickOutside)
    if (window.matchMedia('(max-width: 767px)').matches) {
      document.body.style.overflow = 'hidden'
    }
  } else {
    document.removeEventListener('keydown', onKeydown)
    document.removeEventListener('mousedown', onClickOutside)
    document.body.style.overflow = ''
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('mousedown', onClickOutside)
  document.body.style.overflow = ''
})
</script>

<template>
  <div ref="wrapRef" class="search-wrap" :class="{ open: isOpen }">
    <div class="search-bar">
      <button v-if="isOpen" type="button" class="search-back" aria-label="Close search" @click="closeSearch">←</button>
      <svg v-else class="search-icon" viewBox="0 0 24 24" width="15" height="15" fill="none">
        <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/>
        <path d="M20 20l-3.5-3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>

      <input
        ref="inputRef"
        v-model="query"
        class="search-input"
        placeholder="Search bank, name, or account number..."
        @focus="openSearch"
        @input="onInput"
        @keydown.enter.prevent="onEnter"
      />

      <button v-if="query" type="button" class="search-clear" aria-label="Clear search" @click="clearQuery">×</button>
    </div>

    <div v-if="isOpen" class="search-panel">
      <p v-if="loading" class="search-status">Searching…</p>
      <p v-else-if="hasSearched && !results.length" class="search-status">No matches found.</p>
      <p v-else-if="!query.trim()" class="search-status">Start typing a bank, name, phone-Number or account number.</p>

      <button
        v-for="r in results"
        :key="r.id"
        type="button"
        class="search-result"
        @click="goToResult(r.id)"
      >
        <div v-if="r.thumbnail" class="search-result-thumb">
          <img :src="r.thumbnail" alt="" />
        </div>
        <div v-else class="search-result-avatar">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
            <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="search-result-body">
          <div class="search-result-top">
            <span class="search-result-name">{{ r.name }}</span>
            <span v-if="r.status === 'flagged'" class="search-result-badge">Flagged {{ r.reportCount }}x</span>
          </div>
          <div class="search-result-meta">
            <span>{{ r.typeLabel }}</span>
            <span v-if="r.category">· {{ r.category }}</span>
          </div>
          <p v-if="r.excerpt" class="search-result-excerpt">{{ r.excerpt }}</p>
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.search-wrap {
  position: relative;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 10px 12px;
}

.search-icon,
.search-back {
  flex-shrink: 0;
  color: var(--text-3);
}
.search-back {
  background: none;
  border: none;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  padding: 0 2px;
}
.search-back:hover { color: var(--text-1); }

.search-input {
  flex: 1;
  min-width: 0;
  background: transparent;
  border: none;
  color: var(--text-1);
  font-family: var(--sans);
  font-size: 13px;
  padding: 4px 0;
}
.search-input:focus { outline: none; }
.search-input::placeholder { color: var(--text-3); }

.search-clear {
  flex-shrink: 0;
  background: none;
  border: none;
  color: var(--text-3);
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  padding: 0 2px;
}
.search-clear:hover { color: var(--text-1); }

/* DESKTOP: panel occupies space as an anchored dropdown, page stays visible */
.search-panel {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: var(--surface);
  border: 1px solid var(--border-hi);
  border-radius: var(--radius);
  max-height: 440px;
  overflow-y: auto;
  z-index: 45;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
  padding: 6px;
}

.search-status {
  font-family: var(--mono);
  font-size: 12px;
  color: var(--text-3);
  padding: 16px 10px;
}

.search-result {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  border-radius: 8px;
  padding: 10px;
  cursor: pointer;
}
.search-result:hover { background: var(--surface-2); }

.search-result-thumb,
.search-result-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  flex-shrink: 0;
  overflow: hidden;
  border: 1px solid var(--border-hi);
}
.search-result-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.search-result-avatar {
  background: rgba(248, 113, 113, 0.1);
  color: #f87171;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-result-body { flex: 1; min-width: 0; }

.search-result-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.search-result-name {
  font-family: var(--serif);
  font-size: 14px;
  color: var(--text-1);
}

.search-result-badge {
  flex-shrink: 0;
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.04em;
  color: #f87171;
  background: rgba(248, 113, 113, 0.08);
  border: 1px solid rgba(248, 113, 113, 0.25);
  padding: 2px 6px;
  border-radius: 3px;
}

.search-result-meta {
  display: flex;
  gap: 4px;
  font-family: var(--mono);
  font-size: 11px;
  color: var(--text-3);
  margin-top: 2px;
}

.search-result-excerpt {
  font-size: 12px;
  color: var(--text-2);
  line-height: 1.5;
  margin-top: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* MOBILE: the whole wrapper becomes a fullscreen takeover when open */
@media (max-width: 767px) {
  .search-wrap.open {
    position: fixed;
    inset: 0;
    z-index: 200;
    background: var(--bg);
    display: flex;
    flex-direction: column;
    padding: 12px;
  }
  .search-wrap.open .search-bar {
    flex-shrink: 0;
  }
  .search-wrap.open .search-panel {
    position: static;
    flex: 1;
    margin-top: 12px;
    max-height: none;
    box-shadow: none;
    border: none;
    background: transparent;
    padding: 0;
  }
}
</style>