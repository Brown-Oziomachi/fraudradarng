<script setup lang="ts">
import { guides } from '~/data/guides'

interface OfficialResource {
  name: string
  description: string
  url: string
}

const officialResources: OfficialResource[] = [
  {
    name: 'EFCC',
    description: 'Report fraud directly to the Economic and Financial Crimes Commission.',
    url: 'https://www.efcc.gov.ng',
  },
  {
    name: 'NIBSS',
    description: 'Verify bank account names before transferring money.',
    url: 'https://nibss-plc.com.ng',
  },
  {
    name: 'CBN',
    description: 'Consumer protection guidelines for banking and fintech.',
    url: 'https://www.cbn.gov.ng',
  },
  {
    name: 'NCC',
    description: 'Report SIM swap fraud and phone-related scams.',
    url: 'https://www.ncc.gov.ng',
  },
  {
    name: 'FCCPC',
    description: 'File general consumer fraud and marketplace complaints.',
    url: 'https://fccpc.gov.ng',
  },
  {
    name: 'SEC Nigeria',
    description: 'Verify if an investment platform is legally registered.',
    url: 'https://sec.gov.ng',
  },
]

const featuredGuides = computed(() => {
  return [...guides]
    .sort((a, b) => b.datePublished.localeCompare(a.datePublished))
    .slice(0, 3)
})

function getReadingTime(content: string) {
  return Math.max(1, Math.ceil(content.split(' ').length / 200))
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<template>
  <section class="learn-more">
    <div class="learn-inner">
      <header class="learn-header">
        <div class="eyebrow-badge">
          <svg class="badge-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4.5h9a2.5 2.5 0 012.5 2.5v9H6.5A2.5 2.5 0 014 13.5v-9z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>
            <path d="M4 4.5v9A2.5 2.5 0 006.5 16H4z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>
            <path d="M7.5 8h5M7.5 10.5h5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
          </svg>
          <span class="eyebrow-text">Keep Learning</span>
        </div>
        <h2 class="learn-title">
          Know the pattern <span class="accent-word">before it reaches you</span>
        </h2>
        <p class="learn-subtitle">
          Every scam follows a script. The more of them you recognize, the harder you are to catch off guard.
        </p>
      </header>

      <div class="guide-strip">
        <NuxtLink
          v-for="guide in featuredGuides"
          :key="guide.slug"
          :to="`/guides/${guide.slug}`"
          class="guide-card"
        >
          <div class="guide-image-wrap">
            <img :src="guide.image" :alt="guide.title" class="guide-image" loading="lazy" />
            <span class="guide-tag">{{ guide.category }}</span>
          </div>
          <div class="guide-card-body">
            <h3 class="guide-title">{{ guide.title }}</h3>
            <p class="guide-preview">{{ guide.preview }}</p>
            <div class="guide-meta">
              <span>{{ getReadingTime(guide.content) }} min read</span>
              <span class="guide-meta-dot" />
              <span>{{ formatDate(guide.datePublished) }}</span>
            </div>
          </div>
        </NuxtLink>
      </div>

      <NuxtLink to="/guides" class="view-all-link">
        <span>View all safety guides</span>
        <svg class="link-arrow" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </NuxtLink>

      <div class="official-section">
        <h3 class="official-heading">Verify through official channels</h3>
        <p class="official-note">
          FRNG is a community signal, not a legal authority. For formal reports and identity verification, use these official Nigerian bodies.
        </p>
        <div class="official-grid">
          
           <a v-for="res in officialResources"
            :key="res.name"
            :href="res.url"
            target="_blank"
            rel="noopener noreferrer"
            class="official-card"
          >
            <span class="official-name">{{ res.name }}</span>
            <span class="official-desc">{{ res.description }}</span>
            <svg class="official-arrow" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 14L14 6M14 6H8M14 6v6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.learn-more {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 2rem 1.25rem 4rem;
}

.learn-inner {
  width: 100%;
  max-width: 920px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius, 20px);
  padding: 3rem 2.5rem;
}
@media (max-width: 640px) {
  .learn-inner { padding: 2rem 1.5rem; }
}

/* ============ HEADER ============ */
.learn-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.85rem;
  margin-bottom: 2.5rem;
}

.eyebrow-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  border: 1px solid var(--accent-bdr);
  background: var(--accent-dim);
  border-radius: 999px;
  padding: 0.4rem 0.9rem 0.4rem 0.7rem;
}

.badge-icon {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
  color: var(--accent);
}

.eyebrow-text {
  font-family: var(--mono);
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--accent);
}

.learn-title {
  font-family: var(--serif);
  font-size: clamp(1.6rem, 4vw, 2.25rem);
  font-weight: 400;
  color: var(--text-1);
  letter-spacing: -0.01em;
  line-height: 1.2;
}

.accent-word { color: var(--accent); }

.learn-subtitle {
  max-width: 32rem;
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--text-2);
  font-weight: 300;
}

/* ============ GUIDE STRIP ============ */
.guide-strip {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  margin-bottom: 1.75rem;
}
@media (max-width: 760px) {
  .guide-strip { grid-template-columns: 1fr; }
}

.guide-card {
  display: flex;
  flex-direction: column;
  background: var(--surface);
  border: 1px solid var(--border);
  overflow: hidden;
  text-decoration: none;
  transition: border-color 0.2s ease, transform 0.2s ease;
}
.guide-card:hover {
  border-color: var(--accent-bdr);
  transform: translateY(-2px);
}

.guide-image-wrap {
  position: relative;
  width: 100%;
  height: 120px;
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
.guide-card:hover .guide-image { transform: scale(1.04); }

.guide-tag {
  position: absolute;
  bottom: 0.5rem;
  left: 0.5rem;
  font-family: var(--mono);
  font-size: 0.5625rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 0.2rem 0.5rem;
  background: color-mix(in srgb, var(--bg) 70%, transparent);
  backdrop-filter: blur(4px);
  color: var(--accent);
  border: 1px solid var(--accent-bdr);
}

.guide-card-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 1.1rem;
}

.guide-title {
  font-family: var(--serif);
  font-size: 0.9375rem;
  color: var(--text-1);
  line-height: 1.35;
  margin-bottom: 0.5rem;
}

.guide-preview {
  font-size: 0.75rem;
  color: var(--text-2);
  line-height: 1.55;
  font-weight: 300;
  flex: 1;
  margin-bottom: 0.75rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.guide-meta {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-family: var(--mono);
  font-size: 0.625rem;
  color: var(--text-3);
}
.guide-meta-dot {
  width: 3px; height: 3px; border-radius: 50%; background: var(--border-hi, var(--border));
}

/* ============ VIEW ALL LINK ============ */
.view-all-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  font-family: var(--mono);
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  color: var(--accent);
  text-decoration: none;
  padding-bottom: 2.25rem;
  margin-bottom: 2.25rem;
  border-bottom: 1px solid var(--border);
}
.link-arrow { width: 13px; height: 13px; transition: transform 0.15s ease; }
.view-all-link:hover .link-arrow { transform: translateX(3px); }

/* ============ OFFICIAL RESOURCES ============ */
.official-heading {
  font-family: var(--serif);
  font-size: 1.15rem;
  font-weight: 400;
  color: var(--text-1);
  text-align: center;
  margin-bottom: 0.5rem;
}

.official-note {
  max-width: 30rem;
  margin: 0 auto 1.5rem;
  font-size: 0.8125rem;
  line-height: 1.55;
  color: var(--text-3);
  font-weight: 300;
  text-align: center;
}

.official-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}
@media (max-width: 640px) {
  .official-grid { grid-template-columns: 1fr; }
}

.official-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: 1rem 1.1rem;
  border-radius: var(--radius, 8px);
  border: 1px solid var(--border);
  background: var(--surface);
  text-decoration: none;
  transition: border-color 0.15s ease, background 0.15s ease;
}
.official-card:hover {
  border-color: var(--accent-bdr);
  background: var(--accent-dim);
}

.official-name {
  font-family: var(--mono);
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--text-1);
}

.official-desc {
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--text-3);
  font-weight: 300;
  padding-right: 1rem;
}

.official-arrow {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 13px;
  height: 13px;
  color: var(--text-3);
}
.official-card:hover .official-arrow { color: var(--accent); }
</style>