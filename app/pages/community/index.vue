<script setup lang="ts">
import type { ScamBreakdown } from '~/types/community'

interface Props {
  heroImage?: string
  heroImageAlt?: string
}

const props = withDefaults(defineProps<Props>(), {
  heroImage: '/com.png',
  heroImageAlt: 'FRNG Community Intelligence Hub',
})

const { data: breakdowns } = await useLazyFetch<ScamBreakdown[]>('/api/community/breakdowns')

const today = new Date().toLocaleDateString('en-NG', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

useHead(() => ({
    title: 'Community Awareness — Fraud Radar NG',
    meta: [
      {
         name: 'description',
         content:
            'Community Awareness Hub: Read-only, verified scam breakdowns and account hardening tips from the FRNG community.',
      },
    ],
}))
     
</script>

<template>
  <div class="community-page">
    <section class="hero">
      <div class="hero-media" :class="{ 'hero-media-empty': !heroImage }">
        <img
        v-if="heroImage"
        :src="heroImage"
        :alt="heroImageAlt"
        class="hero-img"
        width="1600"
        height="580"
        loading="eager"
        fetchpriority="high"
        />
        <div v-else class="hero-placeholder">
          <svg class="placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="4" width="18" height="16" rx="1" />
            <circle cx="8.5" cy="9.5" r="1.5" />
            <path d="M21 16l-5.5-5.5a1 1 0 00-1.4 0L6 19" />
          </svg>
          <span class="placeholder-text">Hero image goes here</span>
          <span class="placeholder-sub">Recommended 1600×640, dark or high-contrast subject</span>
        </div>
        <div class="hero-scrim" />
      </div>

      <span class="hero-stamp">
        <span class="hero-stamp-top">FRNG</span>
        <span class="hero-stamp-main">Field Report</span>
        <span class="hero-stamp-bottom">{{ today }}</span>
      </span>

      <header class="masthead">
        <div class="masthead-top">
          <span class="masthead-mark">FRNG</span>
          <span class="masthead-divider" />
          <span class="masthead-kicker">Community Intelligence Hub</span>
        </div>
        <h1 class="masthead-title">FRNG COMMUNITY</h1>
        <p class="masthead-note">
          Read-only. No open chat, no unmoderated links. Every entry below is compiled and verified
          by FRNG moderators from community-submitted reports.
        </p>
      </header>
    </section>

    <CommunityScamBreakdownFeed :breakdowns="breakdowns ?? []" />

    <div class="continue-row">
        <NuxtLink to="/community-extension" class="continue-btn">
          <span>See the full case archive</span>
          <span class="continue-arrow">→</span>
        </NuxtLink>
        <p class="continue-note">Showing recent highlights only — the extended registry has the complete record.</p>
      </div>

    <CommunityAccountHardeningChecklist />
    <CommunityScamCheckWizard />
  </div>
</template>

<style scoped>
.community-page {
  max-width: 64rem;
  margin: 0 auto;
  padding: 0 1.25rem 5rem;
  display: flex;
  flex-direction: column;
  gap: 4.5rem;
}

/* ---------- Hero ---------- */

.hero {
  position: relative;
  margin: 0 -1.25rem 0;
  border-bottom: 1px solid var(--border);
  overflow: hidden;
}

.hero-media {
  position: relative;
  width: 100%;
  height: 300px;
}

@media (min-width: 768px) {
  .hero-media {
    height: 580px;
  }
}

.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  margin-top: 27px;
}

.hero-media-empty {
  background: var(--surface);
}

.hero-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: 1px dashed var(--border);
  margin: 0.75rem;
  color: var(--text-3);
}

.placeholder-icon {
  width: 28px;
  height: 28px;
  color: var(--text-3);
  margin-bottom: 0.25rem;
}

.placeholder-text {
  font-family: var(--mono);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-2);
}

.placeholder-sub {
  font-size: 0.75rem;
  color: var(--text-3);
}

.hero-scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    var(--bg) 0%,
    rgba(0, 0, 0, 0.55) 25%,
    rgba(0, 0, 0, 0.05) 65%,
    transparent 100%
  );
  pointer-events: none;
}

.hero-media-empty + .hero-scrim,
.hero-media-empty ~ .hero-scrim {
  opacity: 0.4;
}

.hero-stamp {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.0625rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--accent-bdr);
  border-radius: 2px;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(6px);
}

.hero-stamp-top {
  font-family: var(--mono);
  font-size: 0.5625rem;
  letter-spacing: 0.18em;
  color: var(--accent);
}

.hero-stamp-main {
  font-family: var(--mono);
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--text-1);
  text-transform: uppercase;
}

.hero-stamp-bottom {
  font-family: var(--mono);
  font-size: 0.5625rem;
  letter-spacing: 0.04em;
  color: var(--text-3);
}

.masthead {
  position: relative;
  z-index: 2;
  margin-top: -5.5rem;
  padding: 0 1.25rem 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  max-width: 64rem;
  margin-left: auto;
  margin-right: auto;
}

.masthead-top {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.masthead-mark {
  font-family: var(--mono);
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  color: var(--accent);
  border: 1px solid var(--accent-bdr);
  border-radius: 2px;
  padding: 0.25rem 0.5rem;
  background: rgba(0, 0, 0, 0.25);
}

.masthead-divider {
  width: 1px;
  height: 16px;
  background: var(--border);
}

.masthead-kicker {
  font-family: var(--mono);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-2);
}

.masthead-title {
  font-family: var(--serif);
  font-size: 2.5rem;
  font-weight: 400;
  letter-spacing: -0.01em;
  color: var(--text-1);
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
}

.masthead-note {
  max-width: 40rem;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--text-2);
}


.continue-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
}

.continue-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid var(--accent-bdr);
  border-radius: 2px;
  padding: 0.7rem 1.5rem;
  font-family: var(--mono);
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--accent);
  text-decoration: none;
  background: var(--accent-dim);
  transition: background 0.15s ease, transform 0.15s ease;
}

.continue-btn:hover {
  background: var(--accent-bdr);
  transform: translateY(-1px);
}

.continue-arrow {
  transition: transform 0.15s ease;
}

.continue-btn:hover .continue-arrow {
  transform: translateX(3px);
}

.continue-note {
  font-size: 0.75rem;
  color: var(--text-3);
}
</style>