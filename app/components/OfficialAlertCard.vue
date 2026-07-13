<script setup lang="ts">
defineProps<{
  alert: {
    id: string
    title: string
    summary?: string
    sourceUrl: string
    sourcePublishedAt?: string | null
    publishedAt: string
  }
}>()

function formatDate(iso?: string | null) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return ''
  }
}
</script>

<template>
  <article class="alert-card">
    <div class="alert-badge">
      <svg viewBox="0 0 24 24" width="13" height="13" fill="none">
        <path d="M12 2 3 6v6c0 5 3.8 8.5 9 10 5.2-1.5 9-5 9-10V6l-9-4z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
      </svg>
      Official — SEC Nigeria
    </div>

    <h3 class="alert-title">{{ alert.title }}</h3>
    <p v-if="alert.summary" class="alert-summary">{{ alert.summary }}</p>

    <div class="alert-footer">
      <span v-if="alert.sourcePublishedAt" class="alert-date">{{ formatDate(alert.sourcePublishedAt) }}</span>
      <a :href="alert.sourceUrl" target="_blank" rel="noopener noreferrer" class="alert-source-link">
        Read on sec.gov.ng →
      </a>
    </div>
  </article>
</template>

<style scoped>
.alert-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-left: 3px solid #3b82f6;
  border-radius: 10px;
  padding: 18px 20px;
  margin-bottom: 14px;
}
.alert-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.08);
  border: 1px solid rgba(59, 130, 246, 0.25);
  padding: 3px 9px;
  border-radius: 4px;
  margin-bottom: 10px;
}
.alert-title {
  font-family: var(--serif);
  font-size: 16px;
  color: var(--text-1);
  line-height: 1.4;
  margin-bottom: 8px;
}
.alert-summary {
  font-size: 13px;
  color: var(--text-2);
  line-height: 1.6;
  font-weight: 300;
  margin-bottom: 12px;
}
.alert-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.alert-date {
  font-family: var(--mono);
  font-size: 10.5px;
  color: var(--text-3);
}
.alert-source-link {
  font-family: var(--mono);
  font-size: 11.5px;
  color: var(--accent);
  text-decoration: none;
}
.alert-source-link:hover { text-decoration: underline; }
</style>