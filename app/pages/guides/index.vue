<script setup lang="ts">
import { guides } from '~/data/guides'

const categories = computed(() => {
  const unique = Array.from(new Set(guides.map((g) => g.category)))
  return unique
})

const activeCategory = ref<string | null>(null)

const filteredGuides = computed(() => {
  const sorted = [...guides].sort((a, b) => b.datePublished.localeCompare(a.datePublished))
  if (!activeCategory.value) return sorted
  return sorted.filter((g) => g.category === activeCategory.value)
})

function getReadingTime(content: string) {
  return Math.max(1, Math.ceil(content.split(' ').length / 200))
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

useSeoMeta({
  title: 'Safety Guides — Fraud Radar NG',
  ogTitle: 'Safety Guides — Fraud Radar NG',
  description:
    'Practical, Nigeria-specific breakdowns of how common scams actually work — written so you can recognize the pattern before it reaches you.',
  ogDescription:
    'Practical, Nigeria-specific breakdowns of how common scams actually work — written so you can recognize the pattern before it reaches you.',
  ogImage: '/FRLOGO.png',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Safety Guides — Fraud Radar NG',
  twitterDescription:
    'Practical, Nigeria-specific breakdowns of how common scams actually work.',
  twitterImage: '/FRLOGO.png',
})
</script>

<template>
  <div class="page-shell">
    <section class="page-hero">
      <div class="eyebrow">
        <span class="eyebrow-dot" /> Safety Guides
      </div>
      <h1 class="page-title">Learn the patterns before they reach you.</h1>
      <p class="page-sub">
        Practical, Nigeria-specific breakdowns of how common scams actually
        work — written so you can recognize the pattern the moment it
        appears, not after it's too late.
      </p>
    </section>

    <div class="filter-row">
      <button
        type="button"
        class="filter-chip"
        :class="{ active: activeCategory === null }"
        @click="activeCategory = null"
      >
        All guides
      </button>
      <button
        v-for="cat in categories"
        :key="cat"
        type="button"
        class="filter-chip"
        :class="{ active: activeCategory === cat }"
        @click="activeCategory = cat"
      >
        {{ cat }}
      </button>
    </div>

    <div class="guide-grid">
      <NuxtLink
        v-for="guide in filteredGuides"
        :key="guide.slug"
        :to="`/guides/${guide.slug}`"
        class="guide-card"
      >
        <div class="guide-image-wrap">
          <img
            :src="guide.image"
            :alt="guide.title"
            class="guide-image"
            loading="lazy"
          />
        </div>

        <div class="guide-card-body">
          <span class="guide-tag">{{ guide.category }}</span>
          <h2 class="guide-title">{{ guide.title }}</h2>
          <p class="guide-preview">{{ guide.preview }}</p>
          <div class="guide-meta">
            <span>{{ getReadingTime(guide.content) }} min read</span>
            <span class="guide-meta-dot" />
            <span>{{ formatDate(guide.datePublished) }}</span>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.page-shell {
  max-width: 1080px;
  margin: 0 auto;
  padding: 56px 24px 100px;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: var(--mono); font-size: 10px; letter-spacing: 0.12em;
  text-transform: uppercase; color: var(--text-3); margin-bottom: 16px;
}
.eyebrow-dot { width: 5px; height: 5px; background: var(--accent); border-radius: 50%; }

.page-title {
  font-family: var(--serif); font-size: clamp(88px, 7vw, 62px);
  color: var(--text-1); line-height: 1.2; margin-bottom: 14px; 

}
.page-sub {
  font-size: 14.5px; color: var(--text-2); line-height: 1.75; font-weight: 300;
  max-width: 620px;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 36px 0 32px;
}
.filter-chip {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.04em;
  padding: 8px 16px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text-2);
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
}
.filter-chip:hover {
  border-color: var(--border-hi);
  color: var(--text-1);
}
.filter-chip.active {
  background: var(--accent);
  border-color: var(--accent);
  color: #0a0a0b;
  font-weight: 600;
}

.guide-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
@media (max-width: 720px) {
  .guide-grid { grid-template-columns: 1fr; }
}

.guide-card {
  display: flex;
  flex-direction: column;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  text-decoration: none;
  transition: border-color 0.2s ease, transform 0.2s ease;
}
.guide-card:hover {
  border-color: var(--border-hi);
  transform: translateY(-2px);
}

.guide-image-wrap {
  width: 100%;
  height: 160px;
  overflow: hidden;
  background: var(--bg);
}
.guide-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}
.guide-card:hover .guide-image {
  transform: scale(1.04);
}

.guide-card-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 24px;
}

.guide-tag {
  display: inline-block;
  width: fit-content;
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 3px;
  background: var(--accent-dim, rgba(232,255,71,0.08));
  color: var(--accent);
  border: 1px solid rgba(232,255,71,0.2);
  margin-bottom: 14px;
}

.guide-title {
  font-family: var(--serif);
  font-size: 19px;
  color: var(--text-1);
  line-height: 1.3;
  margin-bottom: 10px;
}

.guide-preview {
  font-size: 13px;
  color: var(--text-2);
  line-height: 1.65;
  font-weight: 300;
  flex: 1;
  margin-bottom: 16px;
}

.guide-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--mono);
  font-size: 10.5px;
  color: var(--text-3);
}
.guide-meta-dot {
  width: 3px; height: 3px; border-radius: 50%; background: var(--border-hi);
}
</style>