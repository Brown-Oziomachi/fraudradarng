<script setup>
/**
 * /vault — Blacklist Vault
 * -------------------------------------------------------------
 * Internal review list of reports that have crossed the
 * escalation threshold (status: 'flagged'). Linked from the
 * /obelisk KPI strip.
 * -------------------------------------------------------------
 */

definePageMeta({
  middleware: ['admin-only'],
  layout: 'obelisk',
})

useHead({
  title: 'Blacklist Vault',
})

const { getAuthHeader } = useAuth()

const { data, pending, error, refresh } = await useAsyncData(
  'vault-feed',
  async () => {
    const headers = await getAuthHeader()
    return $fetch('/api/obelisk/vault', { headers })
  },
  { server: false, lazy: true }
)

const search = ref('')

const filteredEntries = computed(() => {
  const rows = data.value?.entries ?? []
  if (!search.value.trim()) return rows
  const q = search.value.toLowerCase()
  return rows.filter(
    (r) =>
      r.entity?.toLowerCase().includes(q) ||
      r.category?.toLowerCase().includes(q) ||
      r.platform?.toLowerCase().includes(q)
  )
})

function fmt(n) {
  if (n == null) return '—'
  return new Intl.NumberFormat('en-NG').format(n)
}

const deleting = ref(null)

async function handleDeleteReport(id) {
  if (!confirm('Permanently delete this report? This cannot be undone.')) return
  deleting.value = id
  try {
    const headers = await getAuthHeader()
    await $fetch(`/api/reports/${id}`, { method: 'DELETE', headers })
    await refresh()
  } catch {
    alert('Failed to delete report.')
  } finally {
    deleting.value = null
  }
}
</script>

<template>
  <div class="vault">
    <header class="top">
      <div class="top-left">
        <span class="mark">◆</span>
        <div>
          <h1>Blacklist Vault</h1>
          <p class="sub">Reports that crossed the escalation threshold — {{ fmt(data?.total) }} entries.</p>
        </div>
      </div>

      <div class="top-right">
        <NuxtLink to="/obelisk" class="back-link">← Back to Obelisk</NuxtLink>
        <button class="refresh" :disabled="pending" @click="refresh()">
          <span :class="{ spin: pending }">↻</span>
        </button>
      </div>
    </header>

    <div v-if="error" class="banner banner-error">
      Couldn't reach the vault. Check the connection and try again.
    </div>

    <section class="panel">
      <div class="panel-head">
        <h2>Flagged entities</h2>
        <input
          v-model="search"
          type="search"
          placeholder="Filter by entity, category, platform…"
          class="filter-input"
        />
      </div>

      <table class="vault-table">
        <thead>
          <tr>
            <th>Entity</th>
            <th>Category</th>
            <th>Platform</th>
            <th>Reports</th>
            <th>Distinct reporters</th>
            <th>Flagged</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in filteredEntries" :key="row.id">
            <td class="entity-cell">{{ row.entity }}</td>
            <td>{{ row.category }}</td>
            <td>{{ row.platform }}</td>
            <td>{{ fmt(row.reportCount) }}</td>
            <td>{{ fmt(row.distinctReporterCount) }}</td>
            <td class="muted">{{ row.when }}</td>
            <td>
              <button
                type="button"
                class="delete-btn"
                :disabled="deleting === row.id"
                @click="handleDeleteReport(row.id)"
              >
                {{ deleting === row.id ? 'Deleting…' : 'Delete' }}
              </button>
            </td>
          </tr>
          <tr v-if="!pending && !filteredEntries.length">
            <td colspan="7" class="empty-row">No flagged entries match that filter.</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<style scoped>
.vault {
  min-height: 100vh;
  padding: 32px clamp(16px, 4vw, 48px) 64px;
  background: var(--bg);
  color: var(--text-1);
  font-family: var(--font-body, 'Inter', system-ui, sans-serif);
}

.top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 28px;
}
.top-left { display: flex; gap: 12px; align-items: flex-start; }
.mark { color: var(--accent); font-size: 20px; line-height: 1; margin-top: 4px; }
.top h1 { font-size: 26px; font-weight: 650; letter-spacing: -0.01em; margin: 0; }
.sub { margin: 4px 0 0; color: var(--text-2); font-size: 14px; }

.top-right { display: flex; align-items: center; gap: 12px; }
.back-link { color: var(--text-2); font-size: 13px; text-decoration: none; }
.back-link:hover { color: var(--accent); }
.refresh {
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-2);
  border-radius: 8px;
  width: 34px;
  height: 34px;
  cursor: pointer;
  font-size: 15px;
}
.spin { display: inline-block; animation: spin 0.9s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.banner {
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
  margin-bottom: 20px;
}
.banner-error {
  background: color-mix(in srgb, #d64545 15%, transparent);
  color: #d64545;
  border: 1px solid color-mix(in srgb, #d64545 35%, transparent);
}

.panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 18px 20px;
}
.panel-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}
.panel-head h2 { font-size: 15px; font-weight: 600; margin: 0; }

.filter-input {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 7px 10px;
  font-size: 13px;
  color: var(--text-1);
  width: 240px;
}

.vault-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.vault-table th {
  text-align: left;
  color: var(--text-3);
  font-weight: 500;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  padding: 8px 10px;
  border-bottom: 1px solid var(--border);
}
.vault-table td {
  padding: 10px;
  border-bottom: 1px solid var(--border);
  color: var(--text-2);
}
.entity-cell { color: var(--text-1); font-weight: 500; }
.muted { color: var(--text-3); }
.empty-row { color: var(--text-3); font-size: 13px; padding: 20px 0; text-align: center; }

.delete-btn {
  font-size: 11px;
  font-family: var(--mono, monospace);
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  background: color-mix(in srgb, #d64545 15%, transparent);
  color: #d64545;
  border: 1px solid color-mix(in srgb, #d64545 35%, transparent);
  white-space: nowrap;
}
.delete-btn:disabled { opacity: 0.6; cursor: not-allowed; }
</style>