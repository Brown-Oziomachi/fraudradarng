<script setup lang="ts">
import { guides } from '~/data/guides'

useHead({
  title: 'Political Fraud — Fraud Radar NG',
  meta: [
    {
      name: 'description',
      content: 'How political fraud works in Nigeria — false campaign promises, vote buying, and how to protect your vote. Reported and tracked by Fraud Radar NG.'
    }
  ]
})

// Guides tagged under any of these categories show up on this page.
// Add more category strings here as you tag more political-fraud guides —
// this was previously hardcoded to a single non-matching category, which
// silently hid every political guide from this page.
const POLITICAL_CATEGORIES = ['Civic & Election Fraud', 'Political Fraud']

const politicalGuides = computed(() =>
  guides.filter(g => POLITICAL_CATEGORIES.includes(g.category))
)

function truncate(text: string, max: number) {
  return text.length > max ? text.slice(0, max).trim() + '…' : text
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return ''
  }
}

// Report links now route through /report/new — the consent-gated landing
// page — rather than straight to /report/form, so these can't be used to
// bypass the "I agree to the Terms" checkbox that gates real submission.
const reportLinks = [
  { label: 'Report fraud or cyber crime', to: '/report/new?reason=other', icon: 'megaphone' },
  { label: 'Report vote buying or an election scam', to: '/report/new?reason=other', icon: 'megaphone' },
  { label: 'Report a cyber security incident', to: '/report/new?reason=other', icon: 'lock' },
  { label: 'Police reporting', to: 'https://police.gov.ng/contact/display', icon: 'shield', external: true }
]

// The three-part anatomy of a political scam, mirrored visually from the
// Vault page's "Anatomy of a Collapse" pattern-card layout so the two
// fraud-education pages feel like one consistent design language.
const tactics = [
  {
    mark: '01',
    title: 'Appealing, unrealistic promises',
    body: 'Uninterrupted power, instant currency stabilization, guaranteed jobs — promises pitched at a scale no single term in office could realistically deliver.',
  },
  {
    mark: '02',
    title: 'Exploiting real, urgent crises',
    body: 'Insurgency, herder-farmer conflict, kidnapping — genuine regional problems used as a backdrop for promises with no real plan behind them.',
  },
  {
    mark: '03',
    title: 'Small gifts, bigger ask',
    body: 'Cash, food items, or toiletries handed out as a "taste" of what is promised after the vote — the same inducement mechanic as outright vote buying, just softened.',
  },
]

// Extra supporting images for this page. Replace the src values with your
// actual filenames from /public — each needs only a path and an alt text.
const galleryImages = [
  { src: '/vote2.png', alt: 'Voters queueing at a polling unit in Nigeria' },
  { src: '/vote1.png', alt: 'Cash changing hands near a polling location' },
]
</script>

<template>
  <div class="politics-page">

    <!-- ============ HERO ============ -->
    <section class="pol-hero">
      <div class="pol-hero-text">
        <p class="pol-eyebrow">
          <span class="pol-eyebrow-dot" /> Civic &amp; Election Fraud
        </p>
        <h1 class="pol-title">Political Fraud</h1>
        <p class="pol-lede">
          Political scams involve making ambiguous, often impossible promises to voters —
          in exchange for their vote — with no real intention or capacity to deliver.
          This includes false campaign promises and outright vote buying, and both are
          tracked here the same way any other fraud is.
        </p>
      </div>
      <img src="/pol.png" alt="Political scam awareness" class="pol-hero-image" />
    </section>

    <div class="politics-layout">

      <!-- ============ MAIN ============ -->
      <div class="politics-main">

        <section class="pol-article">
          <h2 class="pol-article-heading">How this scam works</h2>
          <p class="pol-article-p">
            In a democracy, election outcomes are decided by the majority — which means
            capturing public attention, sympathy, and votes is the entire game. Political
            scammers exploit this by making highly appealing promises: uninterrupted power
            supply, immediate currency stabilization, robust security, accessible
            healthcare, quality education, employment generation, minimum wage increases.
          </p>
          <p class="pol-article-p">
            In reality, they either lack the capacity to deliver these promises, or they
            never intended to — acting instead as "instrumental" leaders who exploit power
            primarily to pursue private, familial, or cohort goals once elected.
          </p>
          <p class="pol-article-p">
            These actors also capitalize on genuine regional crises, offering superficial
            solutions to deep-rooted issues like insurgency, herder-farmer conflict, and
            kidnapping. To further secure votes, they often distribute small sums of money,
            food items, or toiletries as a temporary incentive — with the implicit promise
            of more to come after the election.
          </p>
        </section>

        <!-- ============ TACTIC CARDS ============ -->
        <section class="pol-tactics">
          <div v-for="t in tactics" :key="t.mark" class="pol-tactic-card">
            <span class="pol-tactic-mark">{{ t.mark }}</span>
            <h3>{{ t.title }}</h3>
            <p>{{ t.body }}</p>
          </div>
        </section>

        <!-- ============ GALLERY ============ -->
        <section v-if="galleryImages.length" class="pol-gallery">
          <img v-for="img in galleryImages" :key="img.src" :src="img.src" :alt="img.alt" class="pol-gallery-img" />
        </section>

        <!-- ============ GUIDES ============ -->
        <section class="pol-guides-section">
          <div class="pol-guides-head">
            <h2 class="pol-article-heading">Related reports &amp; guides</h2>
            <span class="pol-guides-count">{{ politicalGuides.length }} published</span>
          </div>

          <div class="guide-cards">
            <NuxtLink v-for="guide in politicalGuides" 
            :key="guide.slug" 
            :to="`/guides/${guide.slug}`"
            class="guide-card">

              <img v-if="guide.image" 
              :src="guide.image" 
              :alt="guide.title" 
              class="guide-card-image" />
              <div class="guide-card-body">
                <span class="guide-card-date">{{ formatDate(guide.datePublished) }}</span>
                <h3 class="guide-card-title">{{ guide.title }}</h3>
                <p class="guide-card-desc">{{ truncate(guide.preview, 200) }}</p>
                <span class="guide-card-more">Read more →</span>
              </div>
            </NuxtLink>

            <p v-if="!politicalGuides.length" class="empty-text">
              No political fraud reports have been published yet.
            </p>
          </div>
        </section>
      </div>

      <!-- ============ SIDEBAR ============ -->
      <aside class="politics-sidebar">
        <div class="report-box">
          <span class="report-box-head">Take action</span>
          <NuxtLink v-for="link in reportLinks" :key="link.label" :to="link.to"
            :target="link.external ? '_blank' : undefined" :rel="link.external ? 'noopener' : undefined"
            class="report-link">
            <svg v-if="link.icon === 'megaphone'" viewBox="0 0 24 24" width="15" height="15" fill="none"
              class="report-icon">
              <path d="M3 11v2a2 2 0 002 2h1l3 5V4L6 9H5a2 2 0 00-2 2z" stroke="currentColor" stroke-width="1.6"
                stroke-linejoin="round" />
              <path d="M14 8a10 10 0 013 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
              <path d="M14 4a14 14 0 015 15" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
            </svg>
            <svg v-else-if="link.icon === 'lock'" viewBox="0 0 24 24" width="15" height="15" fill="none"
              class="report-icon">
              <rect x="5" y="11" width="14" height="9" rx="1.5" stroke="currentColor" stroke-width="1.6" />
              <path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
            </svg>
            <svg v-else viewBox="0 0 24 24" width="15" height="15" fill="none" class="report-icon">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" stroke="currentColor" stroke-width="1.6"
                stroke-linejoin="round" />
            </svg>
            {{ link.label }}
          </NuxtLink>
        </div>

        <div class="neutrality-box">
          <h3 class="neutrality-title">Where FRNG stands</h3>
          <p class="neutrality-body">
            Political fraud happens across every party, every cycle. FRNG does not endorse,
            oppose, or take a position on any candidate or party — reporting a number used
            for vote buying is not an act against any one side, it is a defense of the
            process itself.
          </p>
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
  padding: 0 24px 80px;
}

/* ============ HERO ============ */
.pol-hero {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 40px;
  align-items: center;
  padding: 48px 0 40px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 40px;
}

@media (max-width: 800px) {
  .pol-hero {
    grid-template-columns: 1fr;
    padding-top: 32px;
  }
}

.pol-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--mono);
  font-size: 10.5px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-3);
  margin-bottom: 16px;
}

.pol-eyebrow-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--accent);
}

.pol-title {
  font-family: var(--serif);
  font-size: clamp(38px, 5vw, 58px);
  font-weight: 700;
  color: var(--text-1);
  line-height: 1.08;
  margin-bottom: 16px;
}

.pol-lede {
  font-size: 15px;
  color: var(--text-2);
  line-height: 1.75;
  font-weight: 300;
  max-width: 480px;
}

.pol-hero-image {
  width: 100%;
  height: 100%;
  max-height: 320px;
  object-fit: cover;

}

/* ============ LAYOUT ============ */
.politics-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 40px;
  align-items: start;
}

@media (max-width: 900px) {
  .politics-layout {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}

/* ============ ARTICLE ============ */
.pol-article {
  margin-bottom: 32px;
}

.pol-article-heading {
  font-family: var(--serif);
  font-size: 22px;
  color: var(--text-1);
  margin-bottom: 16px;
}

.pol-article-p {
  font-size: 14.5px;
  color: var(--text-2);
  line-height: 1.75;
  font-weight: 300;
  margin-bottom: 14px;
  max-width: 700px;
}

/* ============ TACTIC CARDS ============ */
.pol-tactics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 36px;
}

@media (max-width: 700px) {
  .pol-tactics {
    grid-template-columns: 1fr;
  }
}

.pol-tactic-card {
  background: var(--surface);

  padding: 20px;
}

.pol-tactic-mark {
  display: block;
  font-family: var(--mono);
  font-size: 11px;
  color: var(--accent);
  margin-bottom: 10px;
}

.pol-tactic-card h3 {
  font-family: var(--sans);
  font-size: 14.5px;
  font-weight: 700;
  color: var(--text-1);
  margin-bottom: 8px;
  line-height: 1.35;
}

.pol-tactic-card p {
  font-size: 12.5px;
  color: var(--text-3);
  line-height: 1.6;
  font-weight: 300;
}

/* ============ GALLERY ============ */
.pol-gallery {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 36px;
}

@media (max-width: 560px) {
  .pol-gallery {
    grid-template-columns: 1fr;
  }
}

.pol-gallery-img {
  width: 100%;
  height: 220px;
  object-fit: cover;
}

/* ============ GUIDES ============ */
.pol-guides-section {
  margin-top: 8px;
}

.pol-guides-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 18px;
}

.pol-guides-count {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--text-3);
}

.guide-cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.guide-card {
  display: flex;
  gap: 18px;
  background: var(--surface);

  border-radius: var(--radius);
  padding: 18px;
  text-decoration: none;
  transition: border-color 0.15s, background 0.15s;
}

.guide-card:hover {
  border-color: var(--accent-bdr, var(--accent));
  background: var(--accent-dim, rgba(232, 255, 71, 0.05));
}

@media (max-width: 560px) {
  .guide-card {
    flex-direction: column;
  }
}

.guide-card-image {
  width: 140px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
  background: var(--surface-2);
}

@media (max-width: 560px) {
  .guide-card-image {
    width: 100%;
    height: 160px;
  }
}

.guide-card-body {
  flex: 1;
  min-width: 0;
}

.guide-card-date {
  font-family: var(--mono);
  font-size: 10.5px;
  color: var(--text-3);
  display: block;
  margin-bottom: 6px;
}

.guide-card-title {
  font-family: var(--serif);
  font-size: 17px;
  color: var(--text-1);
  margin-bottom: 8px;
  line-height: 1.35;
}

.guide-card-desc {
  font-size: 13px;
  color: var(--text-2);
  line-height: 1.6;
  font-weight: 300;
  margin-bottom: 10px;
}

.guide-card-more {
  display: inline-block;
  font-family: var(--mono);
  font-size: 11.5px;
  color: var(--accent);
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

.report-box {
  background: #0a0a0b;
  border-radius: var(--radius);
  overflow: hidden;
}

.report-box-head {
  display: block;
  font-family: var(--mono);
  font-size: 10.5px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
  padding: 16px 20px 10px;
}

.report-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 20px;
  color: #fdfdfa;
  font-size: 13.5px;
  text-decoration: none;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  transition: background 0.15s;
}

.report-link:hover {
  background: rgba(255, 255, 255, 0.05);
}

.report-icon {
  flex-shrink: 0;
  color: #fdfdfa;
}

.neutrality-box {
  background: var(--surface);

  border-left: 3px solid var(--accent);
  padding: 18px 20px;
}

.neutrality-title {
  font-family: var(--serif);
  font-size: 15px;
  color: var(--text-1);
  margin-bottom: 8px;
}

.neutrality-body {
  font-size: 12.5px;
  color: var(--text-3);
  line-height: 1.65;
  font-weight: 300;
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