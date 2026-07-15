<script setup>
definePageMeta({
  middleware: ['admin-only'],
  layout: 'obelisk',
})

useHead({ title: 'Obelisk' })

const { getAuthHeader, logout } = useAuth()

const activeTab = ref('overview')

const navGroups = [
  {
    label: 'Operations',
    items: [
      { id: 'overview', label: 'Overview', icon: '◆' },
      { id: 'vault', label: 'Vault', icon: '▣' },
      { id: 'reporters', label: 'Reporters', icon: '◈' },
      { id: 'announcement', label: 'Announcement', icon: '◈', link: '/fraud/announcements' },
    ],
  },
  {
    label: 'Community',
    items: [
      { id: 'contact', label: 'Contact', icon: '✉' },
      { id: 'subscribers', label: 'Subscribers', icon: '☰' },
      { id: 'partnerships', label: 'Partnerships', icon: '🤝' },   
    ],
  },
]

const COLLECTION_MAP = {
  contact: 'contact_messages',
  subscribers: 'subscribers',
  partnerships: 'partnershipApplications',   
}

async function handleLogout() {
  await logout()
  await navigateTo('/login')
}

function handleNavClick(item) {
  if (item.link) {
    navigateTo(item.link)
    return
  }
  activeTab.value = item.id
}

// ---------- Overview tab ----------
const activeWindow = ref('30d')
const windows = [
  { id: '7d', label: '7 days' },
  { id: '30d', label: '30 days' },
  { id: '90d', label: '90 days' },
]

const {
  data: statsData,
  pending: statsPending,
  error: statsError,
  refresh: refreshStats,
} = await useAsyncData(
  'obelisk-stats',
  async () => {
    const headers = await getAuthHeader()
    return $fetch('/api/obelisk/stats', { query: { window: activeWindow.value }, headers })
  },
  { server: false, lazy: true, watch: [activeWindow] }
)

const search = ref('')
const filteredActivity = computed(() => {
  const rows = statsData.value?.activity ?? []
  if (!search.value.trim()) return rows
  const q = search.value.toLowerCase()
  return rows.filter(
    (r) =>
      r.entity?.toLowerCase().includes(q) ||
      r.platform?.toLowerCase().includes(q) ||
      r.category?.toLowerCase().includes(q)
  )
})

// Recent activity pagination: show 5, "show more" adds 5 at a time.
const activityVisibleCount = ref(5)
watch(filteredActivity, () => {
  activityVisibleCount.value = 5
})
const visibleActivity = computed(() => filteredActivity.value.slice(0, activityVisibleCount.value))
function showMoreActivity() {
  activityVisibleCount.value += 5
}

// "See all reports" modal — lists every report in a 5-wide grid.
const showAllReportsModal = ref(false)

const trendPath = computed(() => {
  const series = statsData.value?.trend ?? []
  if (!series.length) return { line: '', area: '', points: [] }
  const w = 640, h = 160, pad = 8
  const max = Math.max(...series.map((p) => p.count), 1)
  const stepX = (w - pad * 2) / (series.length - 1 || 1)
  const points = series.map((p, i) => {
    const x = pad + i * stepX
    const y = h - pad - (p.count / max) * (h - pad * 2)
    return { x, y, ...p }
  })
  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
  const area = `${line} L ${points[points.length - 1].x.toFixed(1)} ${h - pad} L ${points[0].x.toFixed(1)} ${h - pad} Z`
  return { line, area, points, w, h }
})

function statusTone(status) {
  return { verified: 'tone-danger', pending: 'tone-warn', rejected: 'tone-muted', pending_review: 'tone-warn', flagged: 'tone-danger-strong' }[status] || 'tone-muted'
}
function fmt(n) {
  if (n == null) return '—'
  return new Intl.NumberFormat('en-NG').format(n)
}
function fmtDate(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' })
  } catch {
    return String(iso)
  }
}

const dismissing = ref(null)
async function handleDismissFlag(flagId) {
  dismissing.value = flagId
  try {
    const headers = await getAuthHeader()
    await $fetch(`/api/obelisk/flags/${flagId}`, { method: 'PATCH', body: { action: 'dismiss' }, headers })
    await refreshStats()
  } catch {
    alert('Failed to dismiss flag.')
  } finally {
    dismissing.value = null
  }
}

// ---------- Vault tab ----------
const vaultSearch = ref('')
const {
  data: vaultData,
  pending: vaultPending,
  error: vaultError,
  refresh: refreshVault,
} = await useAsyncData(
  'obelisk-vault',
  async () => {
    const headers = await getAuthHeader()
    return $fetch('/api/obelisk/vault', { headers })
  },
  { server: false, lazy: true }
)

const filteredVaultEntries = computed(() => {
  const rows = vaultData.value?.entries ?? []
  if (!vaultSearch.value.trim()) return rows
  const q = vaultSearch.value.toLowerCase()
  return rows.filter(
    (r) => r.entity?.toLowerCase().includes(q) || r.category?.toLowerCase().includes(q) || r.platform?.toLowerCase().includes(q)
  )
})

// ---------- Reporters tab ----------
const {
  data: reportersData,
  pending: reportersPending,
  error: reportersError,
  refresh: refreshReporters,
} = await useAsyncData(
  'obelisk-reporters',
  async () => {
    const headers = await getAuthHeader()
    return $fetch('/api/obelisk/reporters', { headers })
  },
  { server: false, lazy: true }
)

// Search across reports: name, phone number, account number, website, company name, etc.
// NOTE: adjust these field names to whatever ReportForm.vue actually saves on each report.
const reporterSearch = ref('')

function reportMatches(report, q) {
  if (!q) return true
  const hay = [
    report.entity,
    report.category,
    report.reason,
    report.contactPlatform,
    report.phoneNumber,
    report.accountNumber,
    report.bankName,
    report.website,
    report.companyName,
    report.description,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  return hay.includes(q)
}


const filteredReporters = computed(() => {
  const q = reporterSearch.value.trim().toLowerCase()
  const list = reportersData.value?.reporters ?? []
  if (!q) return list
  return list
    .map((r) => ({ ...r, reports: r.reports.filter((rep) => reportMatches(rep, q)) }))
    .filter((r) => r.reports.length > 0)
})

// Full-screen report modal, shared by Overview / Reporters / "see all" grid.
const selectedReport = ref(null)

// replace:  const selectedReportReporter = ref(null)
const selectedReportReporters = ref([])

function openReportModal(report, reporter = null) {
  selectedReport.value = report

  if (reporter) {
    selectedReportReporters.value = [reporter]
    return
  }
  const metaList = report.reporterMeta ?? []
  const seen = new Set()
  selectedReportReporters.value = metaList
    .map((m) =>
      reportersData.value?.reporters?.find(
        (r) =>
          r.fingerprint === m.fingerprint ||
          (r.linkedFingerprints ?? []).includes(m.fingerprint)
      )
    )
    .filter((r) => {
      if (!r || seen.has(r.key)) return false
      seen.add(r.key)
      return true
    })
}

function closeReportModal() {
  selectedReport.value = null
  selectedReportReporters.value = []
}

function goToReportPage(report) {
  if (!report?.id) return
  navigateTo(`/reports/${report.id}`)
}

const deletingImage = ref(null)
async function handleDeleteImage(reportId, index) {
  if (!confirm('Delete this image permanently?')) return
  deletingImage.value = `${reportId}:${index}`
  try {
    const headers = await getAuthHeader()
    await $fetch(`/api/obelisk/evidence/${reportId}/${index}`, { method: 'DELETE', headers })
    await refreshReporters()
  } catch {
    alert('Failed to delete image.')
  } finally {
    deletingImage.value = null
  }
}

const acting = ref(null)

async function handleStrike(key, reason) {
  acting.value = key
  try {
    const headers = await getAuthHeader()
    await $fetch(`/api/obelisk/reporters/${key}/strike`, { method: 'POST', body: { reason }, headers })
    await refreshReporters()
  } catch {
    alert('Failed to issue warning.')
  } finally {
    acting.value = null
  }
}

async function handleBlock(key) {
  if (!confirm('Block this reporter from submitting further reports?')) return
  acting.value = key
  try {
    const headers = await getAuthHeader()
    await $fetch(`/api/obelisk/reporters/${key}/block`, { method: 'POST', body: { durationDays: null }, headers })
    await refreshReporters()
  } catch {
    alert('Failed to block reporter.')
  } finally {
    acting.value = null
  }
}

async function handleUnblock(key) {
  acting.value = key
  try {
    const headers = await getAuthHeader()
    await $fetch(`/api/obelisk/reporters/${key}/block`, { method: 'DELETE', headers })
    await refreshReporters()
  } catch {
    alert('Failed to unblock reporter.')
  } finally {
    acting.value = null
  }
}

// ---------- Shared: delete a report (used from Overview / Vault / Reporters) ----------
const deleting = ref(null)
async function handleDeleteReport(id) {
  if (!confirm('Permanently delete this report? This cannot be undone.')) return
  deleting.value = id
  try {
    const headers = await getAuthHeader()
    await $fetch(`/api/reports/${id}`, { method: 'DELETE', headers })

    // Optimistic local removal — don't wait on a full re-fetch to reflect it.
    if (statsData.value?.activity) {
      statsData.value.activity = statsData.value.activity.filter((r) => r.id !== id)
    }
    if (statsData.value?.flags) {
      statsData.value.flags = statsData.value.flags.filter((f) => f.reportId !== id)
    }
    if (vaultData.value?.entries) {
      vaultData.value.entries = vaultData.value.entries.filter((r) => r.id !== id)
    }
    if (reportersData.value?.reporters) {
      for (const r of reportersData.value.reporters) {
        r.reports = r.reports.filter((rep) => rep.id !== id)
      }
    }
    if (selectedReport.value?.id === id) {
      closeReportModal()
    }

    Promise.all([refreshStats(), refreshVault(), refreshReporters()]).catch(() => {})
  } catch (err) {
    alert(`Failed to delete report: ${err?.data?.statusMessage ?? err?.message ?? 'unknown error'}`)
  } finally {
    deleting.value = null
  }
}

// ---------- Generic lazy-loaded collections (Contact / Subscribers) ----------
const collectionData = reactive({})
const collectionPending = reactive({})
const collectionError = reactive({})
const loadedCollections = new Set()

async function loadCollection(name) {
  if (!name || loadedCollections.has(name)) return
  loadedCollections.add(name)
  collectionPending[name] = true
  collectionError[name] = null
  try {
    const headers = await getAuthHeader()
    const res = await $fetch('/api/obelisk/collection', { query: { name }, headers })
    collectionData[name] = res
  } catch (err) {
    collectionError[name] = err
    loadedCollections.delete(name)
  } finally {
    collectionPending[name] = false
  }
}

function refreshCollection(name) {
  loadedCollections.delete(name)
  return loadCollection(name)
}

watch(activeTab, (tab) => {
  const collectionName = COLLECTION_MAP[tab]
  if (collectionName) loadCollection(collectionName)
}, { immediate: true })

const deletingDoc = ref(null)
async function handleDeleteDoc(collectionName, id) {
  if (!confirm('Delete this record permanently?')) return
  deletingDoc.value = id
  try {
    const headers = await getAuthHeader()
    await $fetch(`/api/obelisk/collection/${collectionName}/${id}`, { method: 'DELETE', headers })
    if (collectionData[collectionName]?.docs) {
      collectionData[collectionName].docs = collectionData[collectionName].docs.filter((d) => d.id !== id)
    }
  } catch (err) {
    alert(`Failed to delete: ${err?.data?.statusMessage ?? err?.message ?? 'unknown error'}`)
  } finally {
    deletingDoc.value = null
  }
}

const updatingStatus = ref(null)
const PARTNERSHIP_STATUSES = ['new', 'contacted', 'approved', 'declined']

async function handleUpdatePartnershipStatus(id, status) {
  updatingStatus.value = id
  try {
    const headers = await getAuthHeader()
    await $fetch(`/api/obelisk/partnerships/${id}`, { method: 'PATCH', body: { status }, headers })
    if (collectionData.partnershipApplications?.docs) {
      const doc = collectionData.partnershipApplications.docs.find((d) => d.id === id)
      if (doc) doc.status = status
    }
  } catch (err) {
    alert(`Failed to update status: ${err?.data?.statusMessage ?? err?.message ?? 'unknown error'}`)
  } finally {
    updatingStatus.value = null
  }
}

const REGULATORY_STATUSES = [
  { value: null, label: 'Not set' },
  { value: 'unregistered', label: '🛑 Unregistered / Illegal operator' },
  { value: 'probation', label: '🟡 Under regulatory probation' },
  { value: 'registered', label: '🟢 Currently SEC-registered' },
]

const updatingRegStatus = ref(false)
async function updateRegulatoryStatus(reportId, status, note) {
  updatingRegStatus.value = true
  try {
    const headers = await getAuthHeader()
    await $fetch(`/api/obelisk/reports/${reportId}/regulatory-status`, {
      method: 'PATCH',
      body: { status, note },
      headers,
    })

    // Optimistic update everywhere this report might currently be rendered.
    const applyUpdate = (r) => {
      if (r?.id === reportId) {
        r.regulatoryStatus = status
        r.regulatoryStatusNote = note || undefined
      }
    }
    applyUpdate(selectedReport.value)
    statsData.value?.activity?.forEach(applyUpdate)
    vaultData.value?.entries?.forEach(applyUpdate)
    reportersData.value?.reporters?.forEach((r) => r.reports?.forEach(applyUpdate))
  } catch (err) {
    alert(`Failed to update regulatory status: ${err?.data?.statusMessage ?? err?.message ?? 'unknown error'}`)
  } finally {
    updatingRegStatus.value = false
  }
}

function statusTonePartnership(status) {
  return { new: 'tone-warn', contacted: 'tone-muted', approved: 'tone-success', declined: 'tone-muted' }[status] || 'tone-muted'
}
</script>

<template>
  <div class="obelisk-shell">
    <aside class="sidebar">
      <div class="sidebar-brand">
        <span class="mark">◆</span>
        <span class="brand-text">FRNG | Fraud Radar Nigeria</span>
      </div>

      <nav class="sidebar-nav">
        <div v-for="group in navGroups" :key="group.label" class="nav-group">
          <span class="nav-group-label">{{ group.label }}</span>
          <button
            v-for="item in group.items"
            :key="item.id"
            :class="['nav-item', { active: activeTab === item.id }]"
            @click="handleNavClick(item)"
          >
            <span class="nav-icon">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </button>
        </div>
      </nav>

      <button class="sidebar-logout" @click="handleLogout">⎋ Sign out</button>
    </aside>

    <main class="main-content">
      <div class="sweep" aria-hidden="true"></div>

      <!-- ================= OVERVIEW ================= -->
      <div v-show="activeTab === 'overview'">
        <div v-if="statsError" class="banner banner-error">Couldn't reach the feed. Check the connection and try again.</div>

        <div class="window-toggle" role="tablist" aria-label="Time window">
          <button
            v-for="w in windows"
            :key="w.id"
            :class="['w-btn', { active: activeWindow === w.id }]"
            @click="activeWindow = w.id"
          >{{ w.label }}</button>
          <button class="refresh" :disabled="statsPending" @click="refreshStats()">
            <span :class="{ spin: statsPending }">↻</span>
          </button>
        </div>

        <section class="kpis" aria-label="Key figures">
          <article class="kpi">
            <span class="kpi-label">Reports, all time</span>
            <span class="kpi-value">{{ fmt(statsData?.kpis?.totalReports) }}</span>
            <span class="kpi-delta" :class="{ up: (statsData?.kpis?.reportsDelta ?? 0) >= 0 }">
              {{ (statsData?.kpis?.reportsDelta ?? 0) >= 0 ? '↑' : '↓' }} {{ Math.abs(statsData?.kpis?.reportsDelta ?? 0) }}% vs prior window
            </span>
          </article>
          <article class="kpi">
            <span class="kpi-label">Verified scams</span>
            <span class="kpi-value danger">{{ fmt(statsData?.kpis?.verified) }}</span>
            <span class="kpi-sub">{{ statsData?.kpis?.verifiedRate ?? 0 }}% of reviewed</span>
          </article>
          <article class="kpi">
            <span class="kpi-label">Awaiting review</span>
            <span class="kpi-value">{{ fmt(statsData?.kpis?.pending) }}</span>
            <span class="kpi-sub">oldest: {{ statsData?.kpis?.oldestPendingAge ?? '—' }}</span>
          </article>
          <article class="kpi">
            <span class="kpi-label">Flagged for review</span>
            <span class="kpi-value">{{ fmt(statsData?.flags?.length) }}</span>
          </article>
          <article class="kpi flag">
            <span class="kpi-label">Suspicious clusters</span>
            <span class="kpi-value warn">{{ fmt(statsData?.kpis?.clusters) }}</span>
            <span class="kpi-sub">shared-IP / CGNAT pattern</span>
          </article>
        </section>

        <section class="grid-main">
          <article class="panel trend-panel">
            <div class="panel-head">
              <h2>Report volume</h2>
              <span class="muted">{{ windows.find((w) => w.id === activeWindow)?.label }}</span>
            </div>
            <svg v-if="trendPath.points.length" :viewBox="`0 0 ${trendPath.w} ${trendPath.h}`" class="trend-svg" preserveAspectRatio="none">
              <path :d="trendPath.area" class="trend-area" />
              <path :d="trendPath.line" class="trend-line" />
              <circle v-for="(p, i) in trendPath.points" :key="i" :cx="p.x" :cy="p.y" r="2.5" class="trend-dot">
                <title>{{ p.label }}: {{ p.count }}</title>
              </circle>
            </svg>
            <div v-else class="empty">No data in this window yet.</div>
          </article>

          <article class="panel">
            <div class="panel-head"><h2>By category</h2></div>
            <ul class="bars">
              <li v-for="c in statsData?.categories ?? []" :key="c.name">
                <div class="bar-row"><span class="bar-label">{{ c.name }}</span><span class="bar-value">{{ fmt(c.count) }}</span></div>
                <div class="bar-track"><div class="bar-fill" :style="{ width: (c.count / (statsData.categories[0]?.count || 1)) * 100 + '%' }" /></div>
              </li>
            </ul>
          </article>

          <article class="panel">
            <div class="panel-head"><h2>By platform</h2></div>
            <ul class="bars">
              <li v-for="p in statsData?.platforms ?? []" :key="p.name">
                <div class="bar-row"><span class="bar-label">{{ p.name }}</span><span class="bar-value">{{ fmt(p.count) }}</span></div>
                <div class="bar-track"><div class="bar-fill alt" :style="{ width: (p.count / (statsData.platforms[0]?.count || 1)) * 100 + '%' }" /></div>
              </li>
            </ul>
          </article>

          <article class="panel">
            <div class="panel-head"><h2>Where it's coming from</h2></div>
            <ul class="geo">
              <li v-for="g in statsData?.geography ?? []" :key="g.state">
                <span class="geo-state">{{ g.state }}</span>
                <span class="geo-bar"><span class="geo-fill" :style="{ width: (g.count / (statsData.geography[0]?.count || 1)) * 100 + '%' }" /></span>
                <span class="geo-count">{{ fmt(g.count) }}</span>
              </li>
              <li v-if="!(statsData?.geography ?? []).length" class="empty">No region data yet.</li>
            </ul>
          </article>
        </section>

        <section v-if="(statsData?.clusters ?? []).length" class="panel alert-panel">
          <div class="panel-head">
            <h2>Pattern flags</h2>
            <span class="muted">Multiple reports sharing signals — review before acting</span>
          </div>
          <ul class="cluster-list">
            <li v-for="c in statsData.clusters" :key="c.id">
              <div class="cluster-main"><span class="cluster-tag">{{ c.signal }}</span><span>{{ c.count }} reports, {{ c.uniqueReporters }} reporters</span></div>
              <span class="cluster-window">last seen {{ c.lastSeen }}</span>
            </li>
          </ul>
        </section>

        <section v-if="(statsData?.flags ?? []).length" class="panel alert-panel flag-review-panel">
          <div class="panel-head">
            <h2>Flagged for review</h2>
            <span class="muted">Reported by users as inaccurate or misleading</span>
          </div>
          <ul class="cluster-list">
            <li v-for="f in statsData.flags" :key="f.id" class="flag-row">
              <div class="cluster-main flag-row-main">
                <span><span class="cluster-tag">{{ f.reason }}</span>{{ f.entityName }}</span>
                <span class="cluster-window">{{ f.details || 'No details given' }}</span>
              </div>
              <div class="flag-actions">
                <button class="delete-btn" :disabled="deleting === f.reportId" @click="handleDeleteReport(f.reportId)">
                  {{ deleting === f.reportId ? 'Deleting…' : 'Delete report' }}
                </button>
                <button class="dismiss-btn" :disabled="dismissing === f.id" @click="handleDismissFlag(f.id)">
                  {{ dismissing === f.id ? 'Dismissing…' : 'Dismiss flag' }}
                </button>
              </div>
            </li>
          </ul>
        </section>

        <section class="grid-lower">
          <article class="panel activity-panel--full">
            <div class="panel-head">
              <h2>Recent activity</h2>
              <input v-model="search" type="search" placeholder="Filter by entity, platform, category…" class="filter-input" />
            </div>
            <table class="activity-table">
              <thead><tr><th>Entity</th><th>Category</th><th>Platform</th><th>Status</th><th>When</th><th>Actions</th></tr></thead>
              <tbody>
                <tr v-for="row in visibleActivity" :key="row.id">
                  <td class="entity-cell">
                    <span class="clickable-name" @click="goToReportPage(row)">{{ row.entity }}</span>
                  </td>
                  <td>{{ row.category }}</td>
                  <td>{{ row.platform }}</td>
                  <td><span class="status-pill" :class="statusTone(row.status)">{{ row.status }}</span></td>
                  <td class="muted">{{ row.when }}</td>
                  <td>
                    <button class="view-btn" @click="openReportModal(row)">View</button>
                    <button class="delete-btn" :disabled="deleting === row.id" @click="handleDeleteReport(row.id)">
                      {{ deleting === row.id ? 'Deleting…' : 'Delete' }}
                    </button>
                  </td>
                </tr>
                <tr v-if="!filteredActivity.length"><td colspan="6" class="empty-row">Nothing matches that filter.</td></tr>
              </tbody>
            </table>

            <div v-if="filteredActivity.length" class="load-more-row">
              <button v-if="activityVisibleCount < filteredActivity.length" class="load-more-btn" @click="showMoreActivity">
                Show 5 more ({{ filteredActivity.length - activityVisibleCount }} left)
              </button>
              <button class="see-all-btn" @click="showAllReportsModal = true">See all reports</button>
            </div>
          </article>
        </section>
      </div>

      <!-- ================= VAULT ================= -->
      <div v-show="activeTab === 'vault'">
        <div v-if="vaultError" class="banner banner-error">Couldn't reach the vault.</div>
        <section class="panel">
          <div class="panel-head">
            <h2>Flagged entities — {{ fmt(vaultData?.total) }} entries</h2>
            <input v-model="vaultSearch" type="search" placeholder="Filter by entity, category, platform…" class="filter-input" />
          </div>
          <table class="activity-table">
            <thead><tr><th>Entity</th><th>Category</th><th>Platform</th><th>Reports</th><th>Distinct reporters</th><th>Flagged</th><th>Actions</th></tr></thead>
            <tbody>
              <tr v-for="row in filteredVaultEntries" :key="row.id">
                <td class="entity-cell">
                  <span class="clickable-name" @click="goToReportPage(row)">{{ row.entity }}</span>
                </td>
                <td>{{ row.category }}</td>
                <td>{{ row.platform }}</td>
                <td>{{ fmt(row.reportCount) }}</td>
                <td>{{ fmt(row.distinctReporterCount) }}</td>
                <td class="muted">{{ row.when }}</td>
                <td><button class="delete-btn" :disabled="deleting === row.id" @click="handleDeleteReport(row.id)">
                  {{ deleting === row.id ? 'Deleting…' : 'Delete' }}
                </button></td>
              </tr>
              <tr v-if="!vaultPending && !filteredVaultEntries.length"><td colspan="7" class="empty-row">No flagged entries match that filter.</td></tr>
            </tbody>
          </table>
        </section>
      </div>

      <!-- ================= REPORTERS ================= -->
      <div v-show="activeTab === 'reporters'">
        <div v-if="reportersError" class="banner banner-error">Couldn't load reporters.</div>

        <section class="panel">
          <div class="panel-head">
            <h2>Search reports</h2>
            <input
              v-model="reporterSearch"
              type="search"
              placeholder="Name, phone number, account number, website, company…"
              class="filter-input filter-input--wide"
            />
          </div>
        </section>

        <div v-for="r in filteredReporters" :key="r.key" class="dossier-card">
         <div class="dossier-head">
            <div class="dossier-ids">
              <span class="dossier-tag">FINGERPRINT</span>
              <code class="fingerprint">{{ r.fingerprint.slice(0, 20) }}…</code>
              <span class="dossier-tag">IP HASH</span>
              <code class="fingerprint">{{ r.ipHash.slice(0, 14) }}…</code>
              <span
                v-if="(r.linkedFingerprints?.length ?? 1) > 1 || (r.linkedIpHashes?.length ?? 1) > 1"
                class="linked-note"
                :title="`${r.linkedFingerprints.length} fingerprints, ${r.linkedIpHashes.length} IPs, ${r.linkedDeviceIds?.length ?? 0} devices linked to this identity`"
              >
                ⚠ linked to {{ r.linkedFingerprints.length - 1 }} other fingerprint{{ r.linkedFingerprints.length - 1 === 1 ? '' : 's' }}
                <template v-if="r.linkedIpHashes.length > 1">· {{ r.linkedIpHashes.length }} IPs</template>
              </span>
            </div>
            <div class="dossier-badges">
              <span v-if="r.strikeCount > 0" class="strike-badge">{{ r.strikeCount }} STRIKE{{ r.strikeCount === 1 ? '' : 'S' }}</span>
              <span v-if="r.blocked" class="blocked-badge">
                {{ r.blockedUntil ? `BLOCKED UNTIL ${new Date(r.blockedUntil).toLocaleDateString('en-NG')}` : 'BLOCKED (INDEFINITE)' }}
              </span>
              <span class="report-count-badge">{{ r.reportCount }} REPORT{{ r.reportCount === 1 ? '' : 'S' }}</span>
            </div>
            <div class="dossier-actions">
              <button class="action-btn warn" :disabled="acting === r.key" @click="handleStrike(r.key, 'admin_warning')">
                Issue Warning
              </button>
              <button v-if="!r.blocked" class="action-btn block" :disabled="acting === r.key" @click="handleBlock(r.key)">
                Block Reporter
              </button>
              <button v-else class="action-btn unblock" :disabled="acting === r.key" @click="handleUnblock(r.key)">
                Unblock
              </button>
            </div>
          </div>

          <div class="report-card-grid">
            <div v-for="report in r.reports" :key="report.id" class="report-card" @click="openReportModal(report, r)">
              <img v-if="report.evidenceUrls?.[0]" :src="report.evidenceUrls[0]" alt="" class="report-card-thumb" />
              <div v-else class="report-card-thumb report-card-thumb--empty">No image</div>
              <span class="report-card-name" @click.stop="goToReportPage(report)">{{ report.entity }}</span>
              <div class="report-card-meta">
                <span class="status-pill" :class="statusTone(report.status)">{{ report.status }}</span>
                <span>{{ report.category }}</span>
              </div>
            </div>
          </div>
        </div>

        <p v-if="!reportersPending && !filteredReporters.length" class="empty">
          {{ reporterSearch ? 'No reports match your search.' : 'No reporters on file yet.' }}
        </p>
      </div>

      <!-- ================= CONTACT ================= -->
      <div v-show="activeTab === 'contact'">
        <div v-if="collectionError.contact_messages" class="banner banner-error">Couldn't load contact messages.</div>
        <section class="panel">
          <div class="panel-head">
            <h2>Contact messages — {{ collectionData.contact_messages?.count ?? 0 }} entries</h2>
            <button class="refresh" :disabled="collectionPending.contact_messages" @click="refreshCollection('contact_messages')">
              <span :class="{ spin: collectionPending.contact_messages }">↻</span>
            </button>
          </div>
          <div v-for="doc in collectionData.contact_messages?.docs ?? []" :key="doc.id" class="contact-card">
           <div class="contact-head">
        <span class="contact-name">{{ doc.fullName }} — {{ doc.orgName }}</span>
        <a :href="`mailto:${doc.email}`" class="contact-email">{{ doc.email }}</a>
        <span class="status-pill tone-muted">{{ doc.partnerType }}</span>
        <span class="status-pill" :class="statusTonePartnership(doc.status || 'new')">{{ doc.status || 'new' }}</span>
        <span class="muted">{{ fmtDate(doc.createdAt) }}</span>

        <select
          class="status-select"
          :value="doc.status || 'new'"
          :disabled="updatingStatus === doc.id"
          @change="handleUpdatePartnershipStatus(doc.id, $event.target.value)"
        >
          <option v-for="s in PARTNERSHIP_STATUSES" :key="s" :value="s">{{ s }}</option>
        </select>

        <button class="delete-btn" :disabled="deletingDoc === doc.id" @click="handleDeleteDoc('partnershipApplications', doc.id)">
          {{ deletingDoc === doc.id ? 'Deleting…' : 'Delete' }}
        </button>
      </div>
            <p class="contact-message">{{ doc.message }}</p>
          </div>
          <p v-if="!collectionPending.contact_messages && !(collectionData.contact_messages?.docs ?? []).length" class="empty">No messages yet.</p>
        </section>
      </div>

      <!-- ================= SUBSCRIBERS ================= -->
      <div v-show="activeTab === 'subscribers'">
        <div v-if="collectionError.subscribers" class="banner banner-error">Couldn't load subscribers.</div>
        <section class="panel">
          <div class="panel-head">
            <h2>Subscribers — {{ collectionData.subscribers?.count ?? 0 }}</h2>
            <button class="refresh" :disabled="collectionPending.subscribers" @click="refreshCollection('subscribers')">
              <span :class="{ spin: collectionPending.subscribers }">↻</span>
            </button>
          </div>
          <table class="activity-table">
            <thead><tr><th>Email</th><th>Subscribed</th><th>Actions</th></tr></thead>
            <tbody>
              <tr v-for="doc in collectionData.subscribers?.docs ?? []" :key="doc.id">
                <td class="entity-cell">{{ doc.email }}</td>
                <td class="muted">{{ fmtDate(doc.subscribedAt) }}</td>
                <td><button class="delete-btn" :disabled="deletingDoc === doc.id" @click="handleDeleteDoc('subscribers', doc.id)">
                  {{ deletingDoc === doc.id ? 'Deleting…' : 'Delete' }}
                </button></td>
              </tr>
              <tr v-if="!collectionPending.subscribers && !(collectionData.subscribers?.docs ?? []).length">
                <td colspan="3" class="empty-row">No subscribers yet.</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>

      <!-- ================= PARTNERSHIPS ================= -->
<div v-show="activeTab === 'partnerships'">
  <div v-if="collectionError.partnershipApplications" class="banner banner-error">Couldn't load partnership applications.</div>
  <section class="panel">
    <div class="panel-head">
      <h2>Partnership applications — {{ collectionData.partnershipApplications?.count ?? 0 }} entries</h2>
      <button class="refresh" :disabled="collectionPending.partnershipApplications" @click="refreshCollection('partnershipApplications')">
        <span :class="{ spin: collectionPending.partnershipApplications }">↻</span>
      </button>
    </div>

    <div v-for="doc in collectionData.partnershipApplications?.docs ?? []" :key="doc.id" class="contact-card">
      <div class="contact-head">
        <span class="contact-name">{{ doc.fullName }} — {{ doc.orgName }}</span>
        <a :href="`mailto:${doc.email}`" class="contact-email">{{ doc.email }}</a>
        <span class="status-pill tone-muted">{{ doc.partnerType }}</span>
        <span class="muted">{{ fmtDate(doc.createdAt) }}</span>
        <button class="delete-btn" :disabled="deletingDoc === doc.id" @click="handleDeleteDoc('partnershipApplications', doc.id)">
          {{ deletingDoc === doc.id ? 'Deleting…' : 'Delete' }}
        </button>
      </div>
      <p v-if="doc.orgWebsite" class="contact-message">
        <a :href="doc.orgWebsite" target="_blank" rel="noopener noreferrer" class="contact-email">{{ doc.orgWebsite }}</a>
      </p>
      <p v-if="doc.objectives?.length" class="contact-message">
        <strong>Objectives:</strong> {{ doc.objectives.join(', ') }}
      </p>
      <p v-if="doc.message" class="contact-message">{{ doc.message }}</p>
    </div>

    <p v-if="!collectionPending.partnershipApplications && !(collectionData.partnershipApplications?.docs ?? []).length" class="empty">
      No partnership applications yet.
    </p>
  </section>
</div>

      <!-- ================= SEE-ALL-REPORTS MODAL (Overview) ================= -->
      <div v-if="showAllReportsModal" class="modal-overlay" @click.self="showAllReportsModal = false">
        <div class="modal-panel">
          <button class="modal-close" @click="showAllReportsModal = false">×</button>
          <div class="modal-header">
            <h2>All reports — {{ fmt(filteredActivity.length) }}</h2>
          </div>
          <div class="activity-grid-5">
            <div v-for="row in filteredActivity" :key="row.id" class="report-card" @click="openReportModal(row)">
              <span class="report-card-name" @click.stop="goToReportPage(row)">{{ row.entity }}</span>
              <div class="report-card-meta">
                <span class="status-pill" :class="statusTone(row.status)">{{ row.status }}</span>
                <span>{{ row.category }}</span>
              </div>
              <span class="muted">{{ row.when }}</span>
            </div>
            <p v-if="!filteredActivity.length" class="empty">No reports yet.</p>
          </div>
        </div>
      </div>

      <!-- ================= FULL REPORT MODAL (shared) ================= -->
      <div v-if="selectedReport" class="modal-overlay" @click.self="closeReportModal">
        <div class="modal-panel">
          <button class="modal-close" @click="closeReportModal">×</button>

          <div class="modal-header">
            <span class="modal-entity-name" @click="goToReportPage(selectedReport)">{{ selectedReport.entity }}</span>
            <div class="dossier-badges">
              <span class="status-pill" :class="statusTone(selectedReport.status)">{{ selectedReport.status }}</span>
            </div>
          </div>

          <dl class="report-detail-grid">
            <div v-if="selectedReport.category"><dt>Category</dt><dd>{{ selectedReport.category }}</dd></div>
            <div v-if="selectedReport.reason"><dt>Reason</dt><dd>{{ selectedReport.reason }}</dd></div>
            <div v-if="selectedReport.contactPlatform"><dt>Platform</dt><dd>{{ selectedReport.contactPlatform }}</dd></div>
            <div v-if="selectedReport.phoneNumber"><dt>Phone number</dt><dd>{{ selectedReport.phoneNumber }}</dd></div>
            <div v-if="selectedReport.accountNumber"><dt>Account number</dt><dd>{{ selectedReport.accountNumber }}</dd></div>
            <div v-if="selectedReport.bankName"><dt>Bank</dt><dd>{{ selectedReport.bankName }}</dd></div>
            <div v-if="selectedReport.website"><dt>Website</dt><dd>{{ selectedReport.website }}</dd></div>
            <div v-if="selectedReport.companyName"><dt>Company</dt><dd>{{ selectedReport.companyName }}</dd></div>
            <div v-if="selectedReport.amountInvolved"><dt>Amount</dt><dd>₦{{ fmt(selectedReport.amountInvolved) }}</dd></div>
            <div v-if="selectedReport.when"><dt>Submitted</dt><dd>{{ selectedReport.when }}</dd></div>
          </dl>

          <div class="details-panel" style="margin: 0 0 16px;">
            <h3 class="details-heading">Regulatory status (admin-set)</h3>
            <p class="reporters-intro" style="margin-bottom: 10px;">
              Reflects the entity's registration status only — does not confirm or resolve the fraud reports above.
            </p>
            <select
              class="status-select"
              :value="selectedReport.regulatoryStatus ?? ''"
              :disabled="updatingRegStatus"
              @change="updateRegulatoryStatus(selectedReport.id, $event.target.value || null, selectedReport.regulatoryStatusNote)"
            >
              <option v-for="opt in REGULATORY_STATUSES" :key="opt.label" :value="opt.value ?? ''">{{ opt.label }}</option>
            </select>
            <input
              class="filter-input"
              style="width: 100%; margin-top: 8px;"
              placeholder="Optional note, e.g. 'Registered with SEC as of March 2026'"
              :value="selectedReport.regulatoryStatusNote"
              :disabled="updatingRegStatus"
              @change="updateRegulatoryStatus(selectedReport.id, selectedReport.regulatoryStatus, $event.target.value)"
            />
          </div>
          <p v-if="selectedReport.description" class="report-description">{{ selectedReport.description }}</p>

          <div v-if="selectedReport.evidenceUrls?.length" class="image-strip">
            <a
              v-for="(url, i) in selectedReport.evidenceUrls"
              :key="i"
              :href="url"
              target="_blank"
              rel="noopener noreferrer"
              class="image-wrap"
            >
              <img :src="url" alt="Evidence" />
              <button
                class="image-delete"
                :disabled="deletingImage === `${selectedReport.id}:${i}`"
                @click.prevent.stop="handleDeleteImage(selectedReport.id, i)"
              >×</button>
            </a>
          </div>

        <div v-if="selectedReportReporters.length" class="modal-reporter-section">
  <div class="modal-reporter-heading">
    Reporter{{ selectedReportReporters.length > 1 ? 's' : '' }} on this report
    <span v-if="selectedReportReporters.length > 1" class="muted">
      ({{ selectedReportReporters.length }} distinct)
    </span>
  </div>

  <div v-for="rep in selectedReportReporters" :key="rep.key" class="modal-reporter-row">
   <div class="dossier-ids">
      <span class="dossier-tag">FINGERPRINT</span>
      <code class="fingerprint">{{ rep.fingerprint.slice(0, 20) }}…</code>
      <span class="dossier-tag">IP HASH</span>
      <code class="fingerprint">{{ rep.ipHash.slice(0, 14) }}…</code>
      <span
        v-if="(rep.linkedFingerprints?.length ?? 1) > 1"
        class="linked-note"
        :title="`${rep.linkedFingerprints.length} fingerprints linked to this identity`"
      >
        ⚠ {{ rep.linkedFingerprints.length }} linked identities
      </span>
    </div>

    <div class="dossier-badges">
      <span v-if="rep.strikeCount > 0" class="strike-badge">
        {{ rep.strikeCount }} STRIKE{{ rep.strikeCount === 1 ? '' : 'S' }}
      </span>
      <span v-if="rep.blocked" class="blocked-badge">
        {{ rep.blockedUntil ? `BLOCKED UNTIL ${new Date(rep.blockedUntil).toLocaleDateString('en-NG')}` : 'BLOCKED (INDEFINITE)' }}
      </span>
    </div>

    <div class="dossier-actions">
      <button class="action-btn warn" :disabled="acting === rep.key" @click="handleStrike(rep.key, 'admin_warning')">
        Issue Warning
      </button>
      <button v-if="!rep.blocked" class="action-btn block" :disabled="acting === rep.key" @click="handleBlock(rep.key)">
        Block Reporter
      </button>
      <button v-else class="action-btn unblock" :disabled="acting === rep.key" @click="handleUnblock(rep.key)">
        Unblock
      </button>
    </div>
  </div>
</div>
<div v-else-if="selectedReport?.reporterMeta === undefined" class="muted modal-reporter-fallback">
  Reporter data isn't available for this report yet — this report may predate reporterMeta tracking, or the backend hasn't been updated to include it (see Step 1).
</div>

          <div class="modal-actions">
            <button
              class="delete-btn"
              :disabled="deleting === selectedReport.id"
              @click="handleDeleteReport(selectedReport.id)"
            >
              {{ deleting === selectedReport.id ? 'Deleting…' : 'Delete report' }}
            </button>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<style scoped>
.obelisk-shell { display: flex; min-height: 100vh; background: var(--bg); color: var(--text-1); font-family: var(--font-body, 'Inter', system-ui, sans-serif); }

.sidebar { width: 220px; flex-shrink: 0; border-right: 1px solid var(--border); display: flex; flex-direction: column; padding: 20px 14px; position: sticky; top: 0; height: 100vh; }
.sidebar-brand { display: flex; align-items: center; gap: 8px; padding: 6px 8px 20px; }
.sidebar-brand .mark { color: var(--accent); font-size: 18px; }
.brand-text { font-weight: 700; letter-spacing: 0.08em; font-size: 13px; }

.sidebar-nav { flex: 1; overflow-y: auto; }
.nav-group { margin-bottom: 18px; }
.nav-group-label { display: block; font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-3); font-weight: 700; padding: 0 10px 6px; }
.nav-item { display: flex; align-items: center; gap: 10px; width: 100%; text-align: left; padding: 9px 10px; border-radius: 8px; background: none; border: none; color: var(--text-2); font-size: 13px; cursor: pointer; }
.nav-item:hover { background: var(--surface); }
.nav-item.active { background: color-mix(in srgb, var(--accent) 15%, transparent); color: var(--accent); font-weight: 600; }
.nav-icon { width: 18px; text-align: center; font-size: 13px; }

.sidebar-logout { margin-top: auto; padding: 9px 10px; border-radius: 8px; background: var(--surface); border: 1px solid var(--border); color: var(--text-2); font-size: 12px; cursor: pointer; text-align: left; }

.main-content { position: relative; flex: 1; padding: 28px clamp(16px, 3vw, 40px) 64px; overflow-x: hidden; min-width: 0; }
.sweep { position: absolute; top: -160px; right: -160px; width: 480px; height: 480px; border-radius: 50%; background: conic-gradient(from 0deg, transparent 0deg, var(--accent) 8deg, transparent 40deg); opacity: 0.08; animation: rotate 14s linear infinite; pointer-events: none; }
@media (prefers-reduced-motion: reduce) { .sweep { animation: none; } }
@keyframes rotate { to { transform: rotate(360deg); } }

.window-toggle { display: flex; gap: 8px; margin-bottom: 20px; position: relative; z-index: 1; }
.w-btn { padding: 7px 12px; font-size: 13px; background: var(--surface); color: var(--text-2); border: 1px solid var(--border); border-radius: 8px; cursor: pointer; }
.w-btn.active { background: var(--accent); color: var(--bg); }
.refresh { border: 1px solid var(--border); background: var(--surface); color: var(--text-2); border-radius: 8px; width: 34px; height: 34px; cursor: pointer; font-size: 15px; }
.spin { display: inline-block; animation: spin 0.9s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.banner { padding: 10px 14px; border-radius: 8px; font-size: 13px; margin-bottom: 20px; position: relative; z-index: 1; }
.banner-error { background: color-mix(in srgb, #d64545 15%, transparent); color: #d64545; border: 1px solid color-mix(in srgb, #d64545 35%, transparent); }

.kpis { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; margin-bottom: 24px; position: relative; z-index: 1; }
@media (max-width: 1100px) { .kpis { grid-template-columns: repeat(2, 1fr); } }
.kpi { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 16px 18px; display: flex; flex-direction: column; gap: 6px; }
.kpi.flag { border-color: color-mix(in srgb, #d99b3f 40%, var(--border)); }
.kpi-label { font-size: 12px; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.04em; }
.kpi-value { font-size: 26px; font-weight: 650; color: var(--text-1); }
.kpi-value.danger { color: #d64545; }
.kpi-value.warn { color: #d99b3f; }
.kpi-sub, .kpi-delta { font-size: 12px; color: var(--text-3); }
.kpi-delta.up { color: #3fae6a; }

.grid-main { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 16px; margin-bottom: 20px; position: relative; z-index: 1; }
.grid-main .trend-panel { grid-column: 1 / 2; grid-row: 1 / 3; }
@media (max-width: 1100px) { .grid-main { grid-template-columns: 1fr; } .grid-main .trend-panel { grid-column: auto; grid-row: auto; } }

.panel { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 18px 20px; margin-bottom: 14px; position: relative; z-index: 1; }
.panel-head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; margin-bottom: 14px; flex-wrap: wrap; }
.panel-head h2 { font-size: 15px; font-weight: 600; margin: 0; }
.muted { color: var(--text-3); font-size: 12px; }

.trend-svg { width: 100%; height: 180px; }
.trend-area { fill: color-mix(in srgb, var(--accent) 16%, transparent); stroke: none; }
.trend-line { fill: none; stroke: var(--accent); stroke-width: 2; }
.trend-dot { fill: var(--accent); }
.empty, .empty-row { color: var(--text-3); font-size: 13px; padding: 20px 0; text-align: center; }

.bars { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
.bar-row { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px; }
.bar-label { color: var(--text-1); }
.bar-value { color: var(--text-3); }
.bar-track { height: 6px; border-radius: 4px; background: var(--bg); overflow: hidden; }
.bar-fill { height: 100%; background: var(--accent); border-radius: 4px; }
.bar-fill.alt { background: color-mix(in srgb, var(--accent) 60%, var(--text-2)); }

.geo { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.geo li { display: grid; grid-template-columns: 90px 1fr 44px; align-items: center; gap: 10px; font-size: 13px; }
.geo-state { color: var(--text-1); }
.geo-bar { height: 6px; border-radius: 4px; background: var(--bg); display: block; overflow: hidden; }
.geo-fill { height: 100%; display: block; background: color-mix(in srgb, var(--accent) 75%, transparent); }
.geo-count { text-align: right; color: var(--text-3); }

.alert-panel { border-color: color-mix(in srgb, #d99b3f 35%, var(--border)); }
.flag-review-panel { border-color: color-mix(in srgb, #d64545 35%, var(--border)); }
.cluster-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.cluster-list li { display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; border-radius: 8px; background: var(--bg); font-size: 13px; }
.flag-row { flex-direction: column; align-items: stretch !important; gap: 10px; }
.flag-row-main { justify-content: space-between; width: 100%; }
.flag-actions { display: flex; gap: 8px; }
.cluster-tag { display: inline-block; padding: 2px 8px; border-radius: 6px; background: color-mix(in srgb, #d99b3f 20%, transparent); color: #d99b3f; font-size: 11px; font-weight: 600; margin-right: 8px; text-transform: uppercase; letter-spacing: 0.03em; }
.cluster-window { color: var(--text-3); font-size: 12px; }

.grid-lower { display: grid; grid-template-columns: 1fr; gap: 16px; position: relative; z-index: 1; }
.filter-input { background: var(--bg); border: 1px solid var(--border); border-radius: 8px; padding: 7px 10px; font-size: 13px; color: var(--text-1); width: 240px; }
.filter-input--wide { width: 100%; max-width: 460px; }

.activity-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.activity-table th { text-align: left; color: var(--text-3); font-weight: 500; font-size: 11px; text-transform: uppercase; letter-spacing: 0.03em; padding: 8px 10px; border-bottom: 1px solid var(--border); }
.activity-table td { padding: 10px; border-bottom: 1px solid var(--border); color: var(--text-2); }
.entity-cell { color: var(--text-1); font-weight: 500; }
.clickable-name { cursor: pointer; }
.clickable-name:hover { color: var(--accent); text-decoration: underline; }

.status-pill { display: inline-block; padding: 2px 9px; border-radius: 999px; font-size: 11px; font-weight: 600; text-transform: capitalize; }
.tone-danger { background: color-mix(in srgb, #d64545 18%, transparent); color: #d64545; }
.tone-danger-strong { background: #d64545; color: #fff; }
.tone-warn { background: color-mix(in srgb, #d99b3f 18%, transparent); color: #d99b3f; }
.tone-muted { background: color-mix(in srgb, var(--text-3) 18%, transparent); color: var(--text-3); }
.tone-success { background: color-mix(in srgb, #4ade80 18%, transparent); color: #4ade80; }

.delete-btn { font-size: 11px; font-family: var(--mono, monospace); padding: 6px 12px; border-radius: 6px; cursor: pointer; background: color-mix(in srgb, #d64545 15%, transparent); color: #d64545; border: 1px solid color-mix(in srgb, #d64545 35%, transparent); white-space: nowrap; }
.delete-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.dismiss-btn { font-size: 11px; font-family: var(--mono, monospace); padding: 6px 12px; border-radius: 6px; cursor: pointer; background: var(--bg); color: var(--text-3); border: 1px solid var(--border); white-space: nowrap; }
.dismiss-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.view-btn { font-size: 11px; font-family: var(--mono, monospace); padding: 6px 12px; border-radius: 6px; cursor: pointer; background: var(--bg); color: var(--text-2); border: 1px solid var(--border); white-space: nowrap; margin-right: 6px; }

.load-more-row { display: flex; gap: 10px; justify-content: center; margin-top: 14px; }
.load-more-btn, .see-all-btn { padding: 8px 16px; border-radius: 8px; border: 1px solid var(--border); background: var(--bg); color: var(--text-2); font-size: 12px; cursor: pointer; }
.see-all-btn { background: var(--accent); color: var(--bg); border-color: var(--accent); font-weight: 600; }

.dossier-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 18px 20px; margin-bottom: 16px; position: relative; z-index: 1; }
.dossier-head { display: flex; flex-wrap: wrap; align-items: center; gap: 14px; margin-bottom: 14px; padding-bottom: 14px; border-bottom: 1px dashed var(--border); }
.dossier-ids { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.dossier-tag { font-size: 10px; letter-spacing: 0.08em; color: var(--text-3); font-weight: 700; text-transform: uppercase; }
.fingerprint { font-family: var(--mono, monospace); font-size: 12px; color: var(--text-2); background: var(--bg); padding: 2px 6px; border-radius: 4px; }
.linked-note { font-size: 11px; color: #d99b3f; font-weight: 600; margin-left: 4px; cursor: help; }

.dossier-badges { display: flex; gap: 6px; flex-wrap: wrap; }
.strike-badge, .blocked-badge, .report-count-badge {
  font-size: 10px; font-weight: 700; letter-spacing: 0.04em; padding: 3px 9px; border-radius: 999px; text-transform: uppercase;
}
.strike-badge { background: color-mix(in srgb, #d99b3f 20%, transparent); color: #d99b3f; }
.blocked-badge { background: #d64545; color: #fff; }
.report-count-badge { background: var(--bg); color: var(--text-3); border: 1px solid var(--border); }

.dossier-actions { display: flex; gap: 8px; margin-left: auto; }
.action-btn { font-size: 11px; font-family: var(--mono, monospace); padding: 6px 12px; border-radius: 6px; cursor: pointer; border: 1px solid var(--border); white-space: nowrap; }
.action-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.action-btn.warn { background: color-mix(in srgb, #d99b3f 15%, transparent); color: #d99b3f; border-color: color-mix(in srgb, #d99b3f 35%, transparent); }
.action-btn.block { background: color-mix(in srgb, #d64545 15%, transparent); color: #d64545; border-color: color-mix(in srgb, #d64545 35%, transparent); }
.action-btn.unblock { background: var(--bg); color: var(--text-2); }

/* Small report cards (Reporters tab, Recent activity "see all", Overview) */
.report-card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; margin-top: 8px; }
.report-card { background: var(--bg); border: 1px solid var(--border); border-radius: 10px; padding: 10px; cursor: pointer; display: flex; flex-direction: column; gap: 6px; transition: border-color 0.15s; }
.report-card:hover { border-color: var(--accent); }
.report-card-thumb { width: 100%; height: 74px; object-fit: cover; border-radius: 6px; background: var(--surface); }
.report-card-thumb--empty { display: flex; align-items: center; justify-content: center; font-size: 11px; color: var(--text-3); }
.report-card-name { font-size: 13px; font-weight: 600; color: var(--text-1); cursor: pointer; }
.report-card-name:hover { color: var(--accent); text-decoration: underline; }
.report-card-meta { display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: var(--text-3); gap: 6px; }

.activity-grid-5 { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
@media (max-width: 1100px) { .activity-grid-5 { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 700px) { .activity-grid-5 { grid-template-columns: repeat(2, 1fr); } }

.report-detail-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 8px 16px; margin: 0 0 8px 0; }
.report-detail-grid dt { font-size: 10px; letter-spacing: 0.05em; text-transform: uppercase; color: var(--text-3); margin: 0; }
.report-detail-grid dd { font-size: 13px; color: var(--text-1); margin: 2px 0 0; word-break: break-word; }

.report-description { font-size: 13px; color: var(--text-2); line-height: 1.5; background: var(--bg); border-radius: 8px; padding: 10px 12px; margin: 0 0 10px; }

.image-strip { display: flex; gap: 8px; flex-wrap: wrap; }
.image-wrap { position: relative; width: 90px; height: 90px; display: block; cursor: pointer; }
.image-wrap img { width: 100%; height: 100%; object-fit: cover; border-radius: 8px; border: 1px solid var(--border); transition: opacity 0.15s; }
.image-wrap:hover img { opacity: 0.8; }
.image-delete { position: absolute; top: -6px; right: -6px; width: 20px; height: 20px; border-radius: 50%; background: #d64545; color: #fff; border: none; cursor: pointer; font-size: 12px; z-index: 2; }

.contact-card { background: var(--bg); border: 1px solid var(--border); border-radius: 10px; padding: 14px 16px; margin-bottom: 10px; }
.contact-head { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 6px; }
.contact-name { font-weight: 600; font-size: 14px; }
.contact-email { color: var(--accent); font-size: 12px; text-decoration: none; }
.contact-email:hover { text-decoration: underline; }
.contact-message { font-size: 13px; color: var(--text-2); line-height: 1.5; margin: 0; }

/* Full-screen report modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(2px); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px; }
.modal-panel { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; width: 100%; max-width: 960px; height: 90vh; overflow-y: auto; padding: 26px 30px; position: relative; }
.modal-close { position: absolute; top: 14px; right: 14px; width: 32px; height: 32px; border-radius: 50%; background: var(--bg); border: 1px solid var(--border); color: var(--text-2); cursor: pointer; font-size: 16px; line-height: 1; }
.modal-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 18px; padding-bottom: 16px; border-bottom: 1px solid var(--border); padding-right: 40px; }
.modal-header h2 { font-size: 16px; font-weight: 600; margin: 0; }
.modal-entity-name { font-size: 20px; font-weight: 700; color: var(--text-1); cursor: pointer; }
.modal-entity-name:hover { color: var(--accent); text-decoration: underline; }
.modal-reporter-block { margin-top: 16px; padding-top: 16px; border-top: 1px dashed var(--border); }
.modal-actions { display: flex; gap: 8px; margin-top: 20px; }

@media (max-width: 900px) {
  .obelisk-shell { flex-direction: column; }
  .sidebar { width: 100%; height: auto; position: relative; flex-direction: row; overflow-x: auto; padding: 12px; }
  .sidebar-nav { display: flex; flex: none; }
  .nav-group { display: flex; align-items: center; gap: 4px; margin-bottom: 0; margin-right: 10px; }
  .nav-group-label { display: none; }
  .sidebar-logout { margin-top: 0; margin-left: auto; }
  .modal-panel { height: 95vh; padding: 20px; }
}

.modal-reporter-section {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px dashed var(--border);
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.modal-reporter-heading {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-2);
}
.modal-reporter-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px dashed var(--border);
}
.modal-reporter-row:last-child { border-bottom: none; }
.modal-reporter-fallback { padding-top: 12px; }
</style>