interface WatchlistItem {
  id: string
  label: string
  query: string
  addedAt: string
  seenReportIds: string[]
}

interface WatchlistStatus {
  matchCount: number
  reportIds: string[]
  highestRisk: 'none' | 'pending' | 'flagged'
  newCount: number
}

const STORAGE_KEY = 'frng_watchlist'

export function useWatchlist() {
  const items = useState<WatchlistItem[]>('watchlist-items', () => [])
  const statuses = useState<Record<string, WatchlistStatus>>('watchlist-statuses', () => ({}))
  const loaded = useState('watchlist-loaded', () => false)
  const checking = useState('watchlist-checking', () => false)

  function loadFromStorage() {
    if (loaded.value) return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      items.value = raw ? JSON.parse(raw) : []
    } catch {
      items.value = []
    }
    loaded.value = true
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value))
    } catch {
      // localStorage unavailable (private browsing, quota) — fail silently,
      // watchlist just won't persist across reloads for this session.
    }
  }

  function addItem(query: string, label?: string) {
    loadFromStorage()
    const trimmed = query.trim()
    if (!trimmed) return false
    const isDuplicate = items.value.some((i) => i.query.toLowerCase() === trimmed.toLowerCase())
    if (isDuplicate) return false

    items.value.push({
      id: crypto.randomUUID(),
      label: label?.trim() || trimmed,
      query: trimmed,
      addedAt: new Date().toISOString(),
      seenReportIds: [],
    })
    persist()
    return true
  }

  function removeItem(id: string) {
    items.value = items.value.filter((i) => i.id !== id)
    delete statuses.value[id]
    persist()
  }

  function markSeen(id: string) {
    const item = items.value.find((i) => i.id === id)
    const status = statuses.value[id]
    if (item && status) {
      item.seenReportIds = status.reportIds
      persist()
    }
  }

  async function refreshAll() {
    loadFromStorage()
    if (!items.value.length) return
    checking.value = true
    try {
      const { results } = await $fetch<{ results: any[] }>('/api/watchlist/check', {
        method: 'POST',
        body: { queries: items.value.map((i) => i.query) },
      })
      results.forEach((r, idx) => {
        const item = items.value[idx]
        if (!item) return
        const newIds = r.reportIds.filter((rid: string) => !item.seenReportIds.includes(rid))
        statuses.value[item.id] = {
          matchCount: r.matchCount,
          reportIds: r.reportIds,
          highestRisk: r.highestRisk,
          newCount: newIds.length,
        }
      })
    } catch {
      // Network/API hiccup — leave existing statuses in place, try again next time.
    } finally {
      checking.value = false
    }
  }

  const totalNewCount = computed(() =>
    Object.values(statuses.value).reduce((sum, s) => sum + (s?.newCount ?? 0), 0)
  )

  return {
    items,
    statuses,
    totalNewCount,
    checking,
    loadFromStorage,
    addItem,
    removeItem,
    markSeen,
    refreshAll,
  }
}