<script setup lang="ts">
useHead({ title: 'Official Enforcement Alerts — Fraud Radar NG' })

const { data, pending, error } = await useLazyFetch('/api/alerts')
const alerts = computed(() => data.value?.alerts ?? [])
</script>

<template>
  <div class="alerts-page">
    <div class="alerts-header">
      <p class="eyebrow">Official sources</p>
      <h1 class="page-title">Enforcement Alerts</h1>
      <p class="page-sub">
        Actions published by Nigeria's Securities and Exchange Commission (SEC).
        Unlike community reports below on FRNG, these are official regulatory
        actions, not user submissions.
      </p>
    </div>

    <p v-if="pending" class="status-text">Loading…</p>
    <p v-else-if="error" class="status-text">Couldn't load alerts right now.</p>
    <p v-else-if="!alerts.length" class="status-text">No alerts published yet.</p>

    <OfficialAlertCard v-for="alert in alerts" :key="alert.id" :alert="alert" />
  </div>
</template>

<style scoped>
.alerts-page { max-width: 720px; margin: 0 auto; padding: 48px 24px 80px; }
.alerts-header { margin-bottom: 32px; }
.eyebrow {
  font-family: var(--mono); font-size: 10px; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--text-3); margin-bottom: 10px;
}
.page-title { font-family: var(--serif); font-size: 62px; color: var(--text-1); margin-bottom: 10px; }
.page-sub { font-size: 14px; color: var(--text-2); line-height: 1.7; font-weight: 300; max-width: 500px; }
.status-text { font-family: var(--mono); font-size: 12px; color: var(--text-3); padding: 20px 0; }
</style>