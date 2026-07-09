<script setup lang="ts">
import { guides } from '~/data/guides'

useHead({
  title: 'Political Scams — Fraud Radar NG',
  meta: [
    {
      name: 'description',
      content: 'How political scams work in Nigeria — false campaign promises, vote buying, and how to protect your vote. Reported and tracked by Fraud Radar NG.'
    }
  ]
})

// Filter guides tagged under the political/consumer-awareness category.
// Rename this string once you split political scams into their own
// dedicated category in guides.ts.
const politicalGuides = computed(() =>
  guides.filter(g => g.category === 'Consumer Awareness & Protection')
)

function truncate(text: string, max: number) {
  return text.length > max ? text.slice(0, max).trim() + '…' : text
}

const reportLinks = [
  { label: 'Report fraud or Cyber crime', to: '/report/form?reason=other', icon: 'megaphone' },
  { label: 'Report a Phishing attempt', to: '/report/form?reason=other', icon: 'megaphone' },
  { label: 'Report a Cyber security incident', to: '/report/form?reason=other', icon: 'lock' },
  { label: 'Police Reporting', to: 'https://police.gov.ng/contact/display', icon: 'megaphone', external: true }
]

const feedPosts = [
  {
    handle: 'ScamwatchNG',
    text: 'We are glad to be represented on a panel discussion during a 2-day Cybersecurity stakeholder capacity building workshop.',
    time: '3 years 3 months ago'
  },
  {
    handle: 'ScamwatchNG',
    text: 'Reminder: never send money based on a transfer alert alone. Always confirm on your own banking app first.',
    time: '2 years ago'
  }
]
</script>

<template>
  <div class="politics-page">
    <div class="politics-layout">

      <!-- ===================== MAIN CONTENT ===================== -->
      <div class="politics-main">
        <h1 class="politics-title">Political</h1>

        <p class="politics-intro">
          Political scams involve making ambiguous promises or claims to electorates by
          people seeking elective positions in order to get their votes without the
          political will or the personal conviction to fulfill them.
        </p>
        <p class="politics-intro">
            How This Scam Works In a democracy, election outcomes are determined by the majority. To capture public attention, sympathy, and votes, political scammers resort to making highly appealing promises—such as uninterrupted power supply, immediate currency stabilization, robust security, accessible healthcare, quality education, employment generation, and minimum wage increases. In reality, they either lack the capacity to deliver or act as "instrumental" leaders who exploit power primarily to pursue private, familial, or cohort goals.
            These actors capitalize on regional crises, offering superficial solutions to deep-rooted issues like insurgency, herder-farmer conflicts, and kidnapping. To further deceive voters, they often distribute small sums of money, food items, or toiletries as temporary incentives, promising more wealth after the elections.
        </P>

        <img src="/pol.png" alt="Political scam awareness" class="politics-hero-image" />

        <div class="guide-cards">
          <NuxtLink
            v-for="guide in politicalGuides"
            :key="guide.slug"
            :to="`/guides/${guide.slug}`"
            class="guide-card"
          >
            <h2 class="guide-card-title">{{ guide.title }}</h2>
            <p class="guide-card-desc">{{ truncate(guide.preview, 220) }}</p>
            <span class="guide-card-more">Read more</span>
          </NuxtLink>

          <p v-if="!politicalGuides.length" class="empty-text">
            No political scam reports have been published yet.
          </p>
        </div>
      </div>

      <!-- ===================== SIDEBAR ===================== -->
      <aside class="politics-sidebar">

        <div class="report-box">
          <NuxtLink
            v-for="link in reportLinks"
            :key="link.label"
            :to="link.to"
            :target="link.external ? '_blank' : undefined"
            :rel="link.external ? 'noopener' : undefined"
            class="report-link"
          >
            <svg v-if="link.icon === 'megaphone'" viewBox="0 0 24 24" width="15" height="15" fill="none" class="report-icon">
              <path d="M3 11v2a2 2 0 002 2h1l3 5V4L6 9H5a2 2 0 00-2 2z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
              <path d="M14 8a10 10 0 013 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
              <path d="M14 4a14 14 0 015 15" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" width="15" height="15" fill="none" class="report-icon">
              <rect x="5" y="11" width="14" height="9" rx="1.5" stroke="currentColor" stroke-width="1.6"/>
              <path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
            </svg>
            {{ link.label }}
          </NuxtLink>
        </div>

        <div class="sidebar-brand">Fraud Radar NG</div>
      </aside>

    </div>
  </div>
</template>

<style scoped>
.politics-page {
  max-width: 1120px;
  margin: 0 auto;
  padding: 48px 24px 80px;
}

.politics-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 40px;
  align-items: start;
}
@media (max-width: 900px) {
  .politics-layout { grid-template-columns: 1fr; gap: 32px; }
}

/* ============ MAIN ============ */
.politics-title {
  font-family: var(--serif);
  font-size: 62px;
  font-weight: 700;
  color: var(--text-1);
  margin-bottom: 18px;
}

.politics-intro {
  font-size: 15px;
  color: var(--text-2);
  line-height: 1.7;
  font-weight: 300;
  margin-bottom: 28px;
  max-width: 640px;
}

.politics-hero-image {
  width: 100%;
  max-width: 760px;
  display: block;
  margin-bottom: 32px;
  border-radius: var(--radius);
}

.guide-cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.guide-card {
  display: block;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px 28px;
  text-decoration: none;
  transition: border-color 0.15s, background 0.15s;
}
.guide-card:hover {
  border-color: var(--accent-bdr, var(--accent));
  background: var(--accent-dim, rgba(232,255,71,0.05));
}

.guide-card-title {
  font-family: var(--serif);
  font-size: 19px;
  color: var(--accent, #2d7a3f);
  margin-bottom: 10px;
}

.guide-card-desc {
  font-size: 14px;
  color: var(--text-2);
  line-height: 1.65;
  font-weight: 300;
  margin-bottom: 16px;
}

.guide-card-more {
  display: block;
  text-align: right;
  font-family: var(--mono);
  font-size: 12px;
  color: var(--text-3);
}

.empty-text {
  font-family: var(--mono);
  font-size: 12px;
  color: var(--text-3);
  padding: 20px 0;
}

/* ============ SIDEBAR ============ */
.politics-sidebar {
  position: sticky;
  top: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.report-box,
.feed-box {
  background: #0a0a0b;
  border-radius: var(--radius);
  overflow: hidden;
}

.report-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 18px 20px;
  color: #fdfdfa;
  font-size: 14px;
  text-decoration: none;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  transition: background 0.15s;
}
.report-link:last-child { border-bottom: none; }
.report-link:hover { background: rgba(255,255,255,0.05); }

.report-icon {
  flex-shrink: 0;
  color: #fdfdfa;
}

.feed-header {
  font-family: var(--mono);
  font-size: 13px;
  font-weight: 600;
  color: #fdfdfa;
  padding: 16px 20px;
  background: rgba(255,255,255,0.04);
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.feed-list {
  padding: 4px 0;
}

.feed-item {
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.feed-item:last-child { border-bottom: none; }

.feed-text {
  font-size: 13px;
  color: #e5e5e5;
  line-height: 1.6;
  margin-bottom: 8px;
}
.feed-text strong {
  color: #fdfdfa;
}

.feed-time {
  font-family: var(--mono);
  font-size: 11px;
  font-style: italic;
  color: rgba(255,255,255,0.4);
}

.sidebar-brand {
  text-align: center;
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-3);
  padding: 4px 0;
}
</style>