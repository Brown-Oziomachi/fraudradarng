<script setup>
definePageMeta({
  middleware: ['admin-only'],
  layout: 'obelisk',
})

useHead({ title: 'Reporters' })

const { getAuthHeader } = useAuth()

const { data, pending, error, refresh } = await useAsyncData(
  'reporters-feed',
  async () => {
    const headers = await getAuthHeader()
    return $fetch('/api/obelisk/reporters', { headers })
  },
  { server: false, lazy: true }
)

const deletingImage = ref(null)
async function handleDeleteImage(reportId, index) {
  if (!confirm('Delete this image permanently?')) return
  deletingImage.value = `${reportId}:${index}`
  try {
    const headers = await getAuthHeader()
    await $fetch(`/api/obelisk/evidence/${reportId}/${index}`, { method: 'DELETE', headers })
    await refresh()
  } catch {
    alert('Failed to delete image.')
  } finally {
    deletingImage.value = null
  }
}

const deletingReport = ref(null)
async function handleDeleteReport(reportId) {
  if (!confirm('Delete this entire report? This cannot be undone.')) return
  deletingReport.value = reportId
  try {
    const headers = await getAuthHeader()
    await $fetch(`/api/reports/${reportId}`, { method: 'DELETE', headers })
    await refresh()
  } catch {
    alert('Failed to delete report.')
  } finally {
    deletingReport.value = null
  }
}
</script>

<template>
  <div class="reporters">
    <header class="top">
      <div>
        <h1>Reporters</h1>
        <p class="sub">Every reporter fingerprint, ranked by strikes.</p>
      </div>
      <NuxtLink to="/obelisk" class="back-link">← Back to Obelisk</NuxtLink>
    </header>

    <div v-if="error" class="banner banner-error">Couldn't load reporters.</div>

    <div v-for="r in data?.reporters ?? []" :key="r.fingerprint" class="reporter-card">
      <div class="reporter-head">
        <code class="fingerprint">{{ r.fingerprint.slice(0, 16) }}…</code>
        <span v-if="r.strikeCount > 0" class="strike-badge">{{ r.strikeCount }} strikes</span>
        <span v-if="data.blockedKeys.some(k => k.startsWith(r.fingerprint))" class="blocked-badge">Blocked</span>
      </div>

      <div v-for="report in r.reports" :key="report.id" class="report-row">
        <div class="report-info">
          <span class="entity">{{ report.entity }}</span>
          <span class="status">{{ report.status }}</span>
          <button class="delete-btn" :disabled="deletingReport === report.id" @click="handleDeleteReport(report.id)">
            {{ deletingReport === report.id ? 'Deleting…' : 'Delete report' }}
          </button>
        </div>
        <div v-if="report.evidenceUrls?.length" class="image-strip">
          <div v-for="(url, i) in report.evidenceUrls" :key="i" class="image-wrap">
            <img :src="url" alt="Evidence" />
            <button
              class="image-delete"
              :disabled="deletingImage === `${report.id}:${i}`"
              @click="handleDeleteImage(report.id, i)"
            >×</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.reporters { min-height: 100vh; padding: 32px clamp(16px,4vw,48px) 64px; background: var(--bg); color: var(--text-1); }
.top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
.sub { color: var(--text-2); font-size: 14px; margin: 4px 0 0; }
.back-link { color: var(--text-2); font-size: 13px; text-decoration: none; }
.banner-error { background: color-mix(in srgb, #d64545 15%, transparent); color: #d64545; padding: 10px 14px; border-radius: 8px; margin-bottom: 20px; }

.reporter-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 16px 18px; margin-bottom: 14px; }
.reporter-head { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.fingerprint { font-family: var(--mono, monospace); font-size: 12px; color: var(--text-3); }
.strike-badge { background: color-mix(in srgb, #d64545 18%, transparent); color: #d64545; font-size: 11px; padding: 2px 8px; border-radius: 999px; font-weight: 600; }
.blocked-badge { background: #d64545; color: #fff; font-size: 11px; padding: 2px 8px; border-radius: 999px; font-weight: 600; }

.report-row { border-top: 1px solid var(--border); padding-top: 10px; margin-top: 10px; }
.report-info { display: flex; align-items: center; gap: 10px; font-size: 13px; margin-bottom: 8px; }
.entity { color: var(--text-1); font-weight: 500; }
.status { color: var(--text-3); }

.image-strip { display: flex; gap: 8px; flex-wrap: wrap; }
.image-wrap { position: relative; width: 90px; height: 90px; }
.image-wrap img { width: 100%; height: 100%; object-fit: cover; border-radius: 8px; border: 1px solid var(--border); }
.image-delete {
  position: absolute; top: -6px; right: -6px; width: 20px; height: 20px;
  border-radius: 50%; background: #d64545; color: #fff; border: none; cursor: pointer; font-size: 12px;
}

.delete-btn {
  font-size: 11px; font-family: var(--mono, monospace); padding: 5px 10px; border-radius: 6px; cursor: pointer;
  background: color-mix(in srgb, #d64545 15%, transparent); color: #d64545; border: 1px solid color-mix(in srgb, #d64545 35%, transparent);
}
.delete-btn:disabled { opacity: 0.6; cursor: not-allowed; }
</style>