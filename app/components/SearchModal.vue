<script setup lang="ts">
import { guides } from '~/data/guides'

interface SearchReportResult {
  id: string
  name: string
  typeLabel: string
  category: string
  excerpt?: string
  dateReported?: string
  status: string
  reportCount: number
  thumbnail?: string | null
}

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const query = ref('')
const inputRef = ref<HTMLInputElement | null>(null)
const activeIndex = ref(0)

const reportResults = ref<SearchReportResult[]>([])
const searching = ref(false)
let debounceTimer: ReturnType<typeof setTimeout> | null = null
let requestId = 0

async function runSearch(term: string) {
  const q = term.trim()
  if (!q) {
    reportResults.value = []
    return
  }
  const thisRequest = ++requestId
  searching.value = true
  try {
    const data = await $fetch<SearchReportResult[]>('/api/reports/search', { query: { q } })
    // Guard against out-of-order responses (e.g. a slow earlier keystroke
    // resolving after a faster later one) overwriting fresher results.
    if (thisRequest === requestId) {
      reportResults.value = data ?? []
    }
  } catch {
    if (thisRequest === requestId) reportResults.value = []
  } finally {
    if (thisRequest === requestId) searching.value = false
  }
}

watch(query, (val) => {
  activeIndex.value = 0
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => runSearch(val), 250)
})

const matchedGuides = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return []
  return guides.filter(g => {
    const haystack = `${g.title} ${g.preview} ${g.category}`.toLowerCase()
    return haystack.includes(q)
  }).slice(0, 8)
})

// Flat list purely for keyboard navigation across both groups
const flatResults = computed(() => [
  ...reportResults.value.map(r => ({ kind: 'report' as const, item: r })),
  ...matchedGuides.value.map(g => ({ kind: 'guide' as const, item: g }))
])

const hasQuery = computed(() => query.value.trim().length > 0)
const hasResults = computed(() => flatResults.value.length > 0)

watch(() => props.modelValue, async (open) => {
  if (open) {
    query.value = ''
    reportResults.value = []
    activeIndex.value = 0
    document.body.style.overflow = 'hidden'
    await nextTick()
    inputRef.value?.focus()
  } else {
    document.body.style.overflow = ''
    if (debounceTimer) clearTimeout(debounceTimer)
  }
})

function close() {
  emit('update:modelValue', false)
}

function goToResult(entry: typeof flatResults.value[number]) {
  if (entry.kind === 'report') {
    navigateTo(`/reports/${entry.item.id}`)
  } else {
    navigateTo(`/guides/${entry.item.slug}`)
  }
  close()
}

function handleKeydown(e: KeyboardEvent) {
  if (!props.modelValue) return
  if (e.key === 'Escape') {
    close()
    return
  }
  if (!hasResults.value) return
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    activeIndex.value = (activeIndex.value + 1) % flatResults.value.length
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    activeIndex.value = (activeIndex.value - 1 + flatResults.value.length) % flatResults.value.length
  } else if (e.key === 'Enter') {
    e.preventDefault()
    const entry = flatResults.value[activeIndex.value]
    if (entry) goToResult(entry)
  }
}

onMounted(() => document.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
  if (debounceTimer) clearTimeout(debounceTimer)
})

function isActive(kind: 'report' | 'guide', index: number) {
  const offset = kind === 'guide' ? reportResults.value.length : 0
  return activeIndex.value === offset + index
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>

<template>
  <Transition name="search-fade">
    <div v-if="modelValue" class="search-overlay" @click.self="close">
      <div class="search-panel">

        <div class="search-header">
          <span class="search-eyebrow">
            <span class="dot" /> SEARCH_RADAR
          </span>
          <button type="button" class="search-close" aria-label="Close search" @click="close">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <div class="search-prompt">
          <span class="prompt-caret">&gt;</span>
          <input
            ref="inputRef"
            v-model="query"
            type="text"
            class="prompt-input"
            placeholder="Query a bank name, account, company, or scam pattern..."
            autocomplete="off"
            spellcheck="false"
          />
          <span class="prompt-blink" v-if="!query" />
        </div>

       <div class="search-body">

  <!-- Empty state — no query yet -->
  <div v-if="!hasQuery" class="search-idle">
    <p class="idle-line">Search across every filed report and <strong>{{ guides.length }}</strong> safety guides.</p>
    <p class="idle-line idle-line--muted">Try a bank name, an account number, or a phrase like "romance scam".</p>
  </div>

  <!-- Searching -->
  <div v-else-if="searching && !hasResults" class="search-idle">
    <p class="idle-line idle-line--muted">Searching…</p>
  </div>

  <!-- No matches -->
  <div v-else-if="!hasResults" class="search-empty">
    <span class="empty-code">NO_MATCH</span>
    <p class="empty-text">Nothing on file for "<strong>{{ query }}</strong>".</p>
    <NuxtLink to="/report/new" class="empty-cta" @click="close">Report this yourself →</NuxtLink>
  </div>

  <!-- Results -->
  <template v-else>
    <div v-if="reportResults.length" class="result-group">
      <p class="group-label">Reports · {{ reportResults.length }}</p>
      <button
        v-for="(r, i) in reportResults"
        :key="r.id"
        type="button"
        class="result-row"
        :class="{ 'result-row--active': isActive('report', i) }"
        @click="goToResult({ kind: 'report', item: r })"
        @mouseenter="activeIndex = i"
      >
        <img v-if="r.thumbnail" :src="r.thumbnail" alt="" class="result-thumb" />
        <span v-else class="result-index">R-{{ String(i + 1).padStart(3, '0') }}</span>
        <span class="result-text">
          <span class="result-title">{{ r.name }}</span>
          <span class="result-sub">{{ r.category || r.typeLabel }}</span>
          <span v-if="r.status === 'flagged'" class="result-risk result-risk--high">
            🚨 High Risk: {{ r.reportCount }} reports match this entity.
          </span>
          <span v-else class="result-risk result-risk--low">
            ⚠️ {{ r.reportCount }} unverified report{{ r.reportCount === 1 ? '' : 's' }} filed. Proceed with caution.
          </span>
        </span>
        <span class="result-tag result-tag--report">{{ r.typeLabel }}</span>
      </button>
    </div>

    <div v-if="matchedGuides.length" class="result-group">
      <p class="group-label">Guides · {{ matchedGuides.length }}</p>
      <button
        v-for="(g, i) in matchedGuides"
        :key="g.slug"
        type="button"
        class="result-row"
        :class="{ 'result-row--active': isActive('guide', i) }"
        @click="goToResult({ kind: 'guide', item: g })"
        @mouseenter="activeIndex = reportResults.length + i"
      >
        <span class="result-index">G-{{ String(i + 1).padStart(3, '0') }}</span>
        <span class="result-text">
          <span class="result-title">{{ g.title }}</span>
          <span class="result-sub">{{ g.category }} · {{ formatDate(g.datePublished) }}</span>
        </span>
        <span class="result-tag result-tag--guide">guide</span>
      </button>
    </div>
  </template>

</div>

        <div class="search-footer">
          <span class="hint"><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span class="hint"><kbd>↵</kbd> open</span>
          <span class="hint"><kbd>esc</kbd> close</span>
        </div>

      </div>
    </div>
  </Transition>
</template>

<style scoped>
.search-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(6, 6, 7, 0.72);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 10vh 20px 40px;
}
@media (max-width: 640px) {
  .search-overlay { padding: 0; align-items: stretch; }
}

.search-panel {
  width: 100%;
  max-width: 680px;
  max-height: 76vh;
  background: var(--bg);
  border: 1px solid var(--border-hi);
  border-radius: var(--radius);
  box-shadow: 0 30px 80px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
@media (max-width: 640px) {
  .search-panel {
    max-width: 100%;
    max-height: 100vh;
    height: 100vh;
    border-radius: 0;
    border: none;
  }
}

.search-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}
.search-eyebrow {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-3);
}
.dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 0 rgba(232,255,71,0.5);
  animation: dot-pulse 1.6s ease-out infinite;
}
@keyframes dot-pulse {
  0% { box-shadow: 0 0 0 0 rgba(232,255,71,0.45); }
  100% { box-shadow: 0 0 0 6px rgba(232,255,71,0); }
}
.search-close {
  display: flex; align-items: center; justify-content: center;
  width: 28px; height: 28px;
  background: none; border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--text-2);
  cursor: pointer;
}
.search-close:hover { border-color: var(--border-hi); color: var(--text-1); }

.search-prompt {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 20px 18px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
  position: relative;
}

.result-risk {
  font-family: var(--mono);
  font-size: 10.5px;
  margin-top: 2px;
}
.result-risk--high { color: #f87171; }
.result-risk--low { color: #eab308; }

.prompt-caret {
  font-family: var(--mono);
  font-size: 20px;
  color: var(--accent);
  flex-shrink: 0;
}
.prompt-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-family: var(--serif);
  font-size: clamp(18px, 2.6vw, 24px);
  color: var(--text-1);
  min-width: 0;
}
.prompt-input::placeholder {
  color: var(--text-3);
  font-family: var(--serif);
  font-weight: 300;
}
.prompt-blink {
  position: absolute;
  left: 46px;
  width: 2px;
  height: 22px;
  background: var(--accent);
  animation: blink 1s step-start infinite;
}
@keyframes blink {
  50% { opacity: 0; }
}

.search-body {
  flex: 1;
  overflow-y: auto;
  padding: 8px 12px;
}

.search-idle, .search-empty {
  padding: 32px 16px;
  text-align: center;
}
.idle-line {
  font-size: 13.5px;
  color: var(--text-2);
  line-height: 1.6;
  margin-bottom: 6px;
}
.idle-line--muted {
  color: var(--text-3);
  font-family: var(--mono);
  font-size: 11.5px;
}
.idle-line strong { color: var(--text-1); }

.empty-code {
  display: inline-block;
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.1em;
  color: #f87171;
  border: 1px solid rgba(248,113,113,0.3);
  background: rgba(248,113,113,0.08);
  padding: 3px 8px;
  border-radius: 3px;
  margin-bottom: 12px;
}
.empty-text {
  font-size: 13.5px;
  color: var(--text-2);
  margin-bottom: 14px;
}
.empty-cta {
  font-family: var(--mono);
  font-size: 12px;
  color: var(--accent);
  text-decoration: none;
}
.empty-cta:hover { text-decoration: underline; }

.result-group {
  margin-bottom: 14px;
}
.group-label {
  font-family: var(--mono);
  font-size: 9.5px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-3);
  padding: 10px 10px 6px;
}

.result-row {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  background: none;
  border: none;
  border-radius: var(--radius);
  padding: 10px;
  cursor: pointer;
  text-align: left;
  transition: background 0.1s;
}
.result-row--active,
.result-row:hover {
  background: var(--surface-2, var(--surface));
}

.result-index {
  font-family: var(--mono);
  font-size: 10px;
  color: var(--text-3);
  flex-shrink: 0;
  width: 42px;
}

.result-thumb {
  flex-shrink: 0;
  width: 42px;
  height: 42px;
  border-radius: 6px;
  object-fit: cover;
  border: 1px solid var(--border);
}

.result-text {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.result-title {
  font-size: 13.5px;
  color: var(--text-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.result-sub {
  font-family: var(--mono);
  font-size: 10.5px;
  color: var(--text-3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-tag {
  flex-shrink: 0;
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 3px;
}
.result-tag--report {
  color: #f87171;
  background: rgba(248,113,113,0.08);
  border: 1px solid rgba(248,113,113,0.25);
}
.result-tag--guide {
  color: var(--accent);
  background: var(--accent-dim, rgba(232,255,71,0.08));
  border: 1px solid rgba(232,255,71,0.2);
}

.search-footer {
  display: flex;
  gap: 16px;
  padding: 12px 20px;
  border-top: 1px solid var(--border);
  flex-shrink: 0;
}
.hint {
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: var(--mono);
  font-size: 10.5px;
  color: var(--text-3);
}
kbd {
  font-family: var(--mono);
  font-size: 10px;
  background: var(--surface-2, var(--surface));
  border: 1px solid var(--border-hi);
  border-radius: 3px;
  padding: 1px 5px;
  color: var(--text-2);
}

.search-fade-enter-active,
.search-fade-leave-active {
  transition: opacity 0.15s ease;
}
.search-fade-enter-from,
.search-fade-leave-to {
  opacity: 0;
}
</style>