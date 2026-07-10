<script setup lang="ts">
import { computed, onMounted } from 'vue'

useSeoMeta({
  title: 'Report a Scam — Fraud Radar NG',
  description: 'Help protect citizens by flagging ongoing internet fraud immediately.',
  ogTitle: 'Alert: Active Phishing Campign Flagged',
  ogDescription: 'Read the structural breakdown of this scam on Fraud Radar.',
  ogImage: 'https://fraudradar.ng/FRLOGO.png',
  twitterCard: 'summary_large_image'
})

const lessons = [
  {
    title: 'Urgency is the first red flag',
    body: 'Scammers create pressure — "send now or lose the deal," "the offer expires in 10 minutes." Legitimate transactions rarely require you to skip verification because of time.'
  },
  {
    title: 'A matching name isn\u2019t proof',
    body: 'Fraudsters often use real, verified bank accounts under someone else\u2019s name obtained through mules. The account being "real" doesn\u2019t mean the person behind it is who they claim.'
  },
  {
    title: 'Screenshots can be faked',
    body: 'A "payment sent" screenshot proves nothing — it\u2019s trivial to edit. Only trust a transfer once it actually reflects in your own account balance.'
  },
  {
    title: 'Once sent, it\u2019s gone',
    body: 'Nigerian bank transfers are typically irreversible once completed. There is no "recall" button — prevention before sending is the only real protection.'
  }
]

const scamSteps = [
  {
    number: '01',
    title: 'Contact is made',
    body: 'Through a marketplace listing, a job posting, a dating app, or a random DM — the fraudster reaches out with a believable reason to talk to you.'
  },
  {
    number: '02',
    title: 'Trust is built quickly',
    body: 'A convincing story, sometimes borrowed details from a real business or person, and often a sense of urgency: a deadline, an emergency, a limited-time offer.'
  },
  {
    number: '03',
    title: 'Payment is requested',
    body: 'You\u2019re asked to send money first — for a deposit, a fee, a "verification transfer," or to release goods/services before your own payment clears.'
  },
  {
    number: '04',
    title: 'Contact disappears',
    body: 'Once the transfer goes through, the account holder stops responding, blocks your number, or the account itself gets abandoned.'
  }
]

const { data } = await useLazyFetch<{ reports: any[]; nextCursor: string | null }>('/api/reports', {
  default: () => ({ reports: [], nextCursor: null })
})

const validReports = computed(() => data.value?.reports ?? [])

// Ticker feed — pulls a live identifier off each recent report when the
// shape is available, otherwise falls back to placeholder signal text so
// the strip never renders empty on a cold cache.
const fallbackTicker = [
  'Fintech USSD impersonation — reported Lagos',
  'Fake investment scheme — reported Abuja',
  'Cloned e-commerce storefront — reported Port Harcourt',
  'Job offer advance-fee scam — reported Ibadan',
  'Romance scam wallet tag — reported Kano'
]

const tickerItems = computed(() => {
  const items = validReports.value
    .slice(0, 8)
    .map((r) => r?.companyName || r?.websiteUrl || r?.title || r?.category)
    .filter(Boolean)
  return items.length ? items : fallbackTicker
})

// Doubled for a seamless CSS marquee loop
const tickerLoop = computed(() => [...tickerItems.value, ...tickerItems.value])

// Live counters — swap the fallback numbers for real aggregate values
// (e.g. data.value.totalReports) once the API exposes them.
const stats = [
  { target: 1240, label: 'Reports filed', suffix: '+' },
  { target: 36, label: 'States covered', suffix: '' },
  { target: 900, label: 'Accounts flagged', suffix: '+' },
  { target: 24, label: 'Hour monitoring', suffix: '/7' }
]

function animateCount(el: Element, target: number) {
  const duration = 1300
  const start = performance.now()
  function tick(now: number) {
    const progress = Math.min((now - start) / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    el.textContent = Math.floor(eased * target).toLocaleString('en-NG')
    if (progress < 1) requestAnimationFrame(tick)
    else el.textContent = target.toLocaleString('en-NG')
  }
  requestAnimationFrame(tick)
}

onMounted(() => {
  if (typeof window === 'undefined') return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'))
    document.querySelectorAll('.stat-number[data-target]').forEach((el) => {
      el.textContent = Number((el as HTMLElement).dataset.target || 0).toLocaleString('en-NG')
    })
    return
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          revealObserver.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  )
  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el))

  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = Number((entry.target as HTMLElement).dataset.target || 0)
          animateCount(entry.target, target)
          statObserver.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.4 }
  )
  document.querySelectorAll('.stat-number[data-target]').forEach((el) => statObserver.observe(el))
})
</script>

<template>
  <section class="hero">
    <div class="hero-bg-image" />
    <div class="hero-overlay" />
    <div class="hero-scanline" aria-hidden="true" />
    <svg class="hero-radar" viewBox="0 0 200 200" aria-hidden="true">
      <circle cx="100" cy="100" r="70" class="radar-ring" />
      <circle cx="100" cy="100" r="46" class="radar-ring" />
      <circle cx="100" cy="100" r="22" class="radar-ring" />
      <g class="radar-sweep">
        <path d="M100 100 L100 30 A70 70 0 0 1 149.5 129.5 Z" fill="url(#sweepGradient)" />
      </g>
      <defs>
        <linearGradient id="sweepGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.35" />
          <stop offset="100%" stop-color="var(--accent)" stop-opacity="0" />
        </linearGradient>
      </defs>
    </svg>

    <div class="hero-content">
      <div class="hero-copy">
        <h1 class="hero-title">
          <span class="hero-title-line hero-anim hero-anim--1">Know Before You Send</span>
          <span class="hero-title-line hero-title-line--accent hero-anim hero-anim--2">Report. Check. Protect.</span>
        </h1>

        <p class="hero-subtext hero-anim hero-anim--3">
          The scam that hit them yesterday is coming for you today.
        </p>

        <div class="hero-actions hero-anim hero-anim--4">
          <NuxtLink to="/report/new" class="btn btn--pill btn--accent">
            File a Report
          </NuxtLink>
          <NuxtLink to="/lookupsearch" class="btn btn--pill btn--outline">
            Search Registry
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>

  <!-- Live signal ticker — keeps the page feeling alive as soon as the
       hero settles, and gives returning visitors a reason to look twice. -->
  <div class="ticker-bar" role="status" aria-label="Recently flagged reports">
    <span class="ticker-tag">
      <span class="ticker-dot" />
      Live signal
    </span>
    <div class="ticker-track">
      <div class="ticker-content">
        <span v-for="(item, i) in tickerLoop" :key="i" class="ticker-item">
          {{ item }}
          <span class="ticker-sep">•</span>
        </span>
      </div>
    </div>
  </div>

  <!-- Animated stat strip -->
  <section class="stats-strip reveal">
    <div class="stat-block" v-for="stat in stats" :key="stat.label">
      <div class="stat-number-wrap">
        <span class="stat-number" :data-target="stat.target">0</span><span class="stat-suffix">{{ stat.suffix }}</span>
      </div>
      <div class="stat-label">{{ stat.label }}</div>
    </div>
  </section>

  <section class="illustration-section reveal">
    <div class="eyebrow">
      <span class="eyebrow-dot" />
      How the scam usually works
    </div>
    <h2 class="how-title">The pattern repeats because it works.</h2>

    <div class="how-layout">
      <div class="how-image-col">
        <img src="/trusts.png" alt="How the scam pattern unfolds" class="how-image" />
      </div>

      <div class="steps-list">
        <div v-for="(step, i) in scamSteps" :key="step.number" class="step-row reveal" :style="{ transitionDelay: `${i * 90}ms` }">
          <div class="step-number">{{ step.number }}</div>
          <div class="step-text">
            <div class="step-title">{{ step.title }}</div>
            <p class="step-body">{{ step.body }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="about-section reveal">
    <div class="about-inner">
      <div class="about-copy">
        <div class="eyebrow eyebrow--dark">
          <span class="eyebrow-dot" />
          Why Fraud Radar NG exists
        </div>
        <h2 class="about-title">
          The scam only works once. Don't let it work twice.
        </h2>
        <p class="about-lead">
          Fraud Radar NG is Nigeria's fraud detection and awareness
          platform — built to help people identify, report, and avoid
          scams before they become victims.
        </p>
        <p class="about-body">
          Every fraudulent account, fake company, and cloned website
          eventually reuses the same script on someone new. The account
          that scammed you today will try the exact same message on
          someone else tomorrow — unless the pattern is exposed. A
          report you file in five minutes could be the five minutes
          that saves a stranger's life savings.
        </p>
        <p class="about-body">
          This isn't a bank, a government agency, or a law firm. It's a
          shared radar — built by Nigerians, for Nigerians — that gets
          stronger every time someone chooses to speak up instead of
          staying silent out of embarrassment.
        </p>
        <NuxtLink to="/report/new" class="btn btn--accent">
          File a report now
        </NuxtLink>
      </div>
      <div><img src="/FRLOGO.png" alt="Fraud Radar NG" class="about-art" /></div>
    </div>
  </section>

  <section class="map-section reveal">
    <div class="map-inner">
      <div class="eyebrow eyebrow--dark" style="justify-content: center;">
        <span class="eyebrow-dot" />
        One network, thirty-six states
      </div>
      <h2 class="map-title">Every report strengthens the radar.</h2>
      <img src="/state.png" alt="Fraud Radar NG — Detect, Verify, Protect" class="map-image" />
    </div>
  </section>

  <section class="lessons-section reveal">
    <div class="eyebrow">
      <span class="eyebrow-dot" />
      What every Nigerian should know
    </div>
    <h2 class="lessons-title">Fraud relies on speed. Slow down and it usually falls apart.</h2>

    <div class="lessons-grid">
      <div
        v-for="(lesson, i) in lessons"
        :key="lesson.title"
        class="lesson-card reveal"
        :style="{ transitionDelay: `${i * 90}ms` }"
      >
        <div class="lesson-title">{{ lesson.title }}</div>
        <p class="lesson-body">{{ lesson.body }}</p>
      </div>
    </div>


    <a href="/guides"
      target="_blank"
      rel="noopener noreferrer"
      class="blog-callout reveal"
    >
      <div class="blog-callout-text">
        <div class="blog-eyebrow">From the blog</div>
        <div class="blog-title">A deeper breakdown: how bank transfer scams actually work in Nigeria</div>
        <p class="blog-desc">
          Read the full write-up on real cases, warning signs, and what to do
          in the first hour after you realize you've been scammed.
        </p>
      </div>
      <span class="blog-arrow">→</span>
    </a>
  </section>

  <div class="reveal">
    <FlaggedAccountsList :reports="validReports" />
  </div>

  <section class="registry-context reveal">
    <div class="context-intro">
      <span class="context-eyebrow">
        <span class="dot" /> Why this matters
      </span>
      <h2 class="context-title">
        Fraud spreads faster than warnings do.
      </h2>
      <p class="context-body">
        By the time a scam account gets flagged on social media, dozens of
        people may have already sent money. The <NuxtLink to="/lookupsearch" class="threat-body">Threat Registry</NuxtLink> closes that
        gap — every report filed by someone who got scammed becomes a shield
        for the next person about to make the same transfer.
      </p>
      <p class="context-body">
        Whether it's a bank account, a company claiming to be an investment
        firm, or a website posing as a legitimate business, checking first
        takes seconds. Losing money to a scam that was already reported
        takes a lot longer to recover from.
      </p>
    </div>

    <ThreatRegistryPromo />
  </section>
</template>

<style scoped>
.eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: var(--mono); font-size: 20px; letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 16px;
}
.eyebrow-dot { width: 5px; height: 5px; background: var(--accent); border-radius: 50%; }

/* ============ SCROLL REVEAL ============ */
.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.7s cubic-bezier(0.2, 0.7, 0.2, 1), transform 0.7s cubic-bezier(0.2, 0.7, 0.2, 1);
  will-change: opacity, transform;
}
.reveal.is-visible {
  opacity: 1;
  transform: none;
}
@media (prefers-reduced-motion: reduce) {
  .reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }
}

/* HERO */
.hero {
  position: relative;
  overflow: hidden;
  min-height: 640px;
  display: flex;
  align-items: center;
  border-radius: 0 0 48px 48px;
}

.hero-bg-image {
  position: absolute;
  inset: 0;
  background-image: url('/save.png');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  z-index: 0;
  filter: brightness(0.5) saturate(0.85);
  animation: heroKenBurns 22s ease-in-out infinite alternate;
  will-change: transform;
}

@keyframes heroKenBurns {
  0% { transform: scale(1); }
  100% { transform: scale(1.08); }
}

@media (prefers-reduced-motion: reduce) {
  .hero-bg-image {
    animation: none;
  }
}

/* Dim black wash with a green bloom bleeding through the center — the
   "signal" glow that carries through the rest of the page's accent. */
.hero-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    radial-gradient(120% 90% at 50% 8%, color-mix(in srgb, var(--accent) 24%, transparent) 0%, transparent 55%),
    linear-gradient(160deg, rgba(2, 8, 4, 0.4) 0%, rgba(2, 8, 4, 0.7) 55%, rgba(1, 4, 2, 0.88) 100%);
}

/* Faint scanning line drifting down the hero, reinforcing the
   "monitoring" idea without being a gimmick. */
.hero-scanline {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    color-mix(in srgb, var(--accent) 10%, transparent) 50%,
    transparent 100%
  );
  height: 40%;
  animation: scanDrift 7s linear infinite;
  pointer-events: none;
}
@keyframes scanDrift {
  0% { transform: translateY(-100%); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(250%); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .hero-scanline { animation: none; opacity: 0; }
}

/* Ambient radar glyph, top-right of the hero — the one signature motif
   carried through from the Community Hub's signal-intelligence look. */
.hero-radar {
  position: absolute;
  z-index: 1;
  top: 24px;
  right: 24px;
  width: 150px;
  height: 150px;
  opacity: 0.55;
  pointer-events: none;
}
.radar-ring {
  fill: none;
  stroke: color-mix(in srgb, var(--accent) 45%, transparent);
  stroke-width: 1;
}
.radar-sweep {
  transform-origin: 100px 100px;
  animation: radarSpin 4.5s linear infinite;
}
@keyframes radarSpin {
  to { transform: rotate(360deg); }
}
@media (max-width: 720px) {
  .hero-radar { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .radar-sweep { animation: none; }
}

.hero-content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 100px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 900px) {
  .hero { min-height: 480px; }
  .hero-bg-image { background-position: center 30%; }
  .hero-content { padding: 48px 20px; min-height: 480px; }
}

@media (max-width: 640px) {
  .hero { min-height: 440px; }
  .hero-content { padding: 40px 20px; }
  .hero-title-line { font-size: 32px; }
}

@media (max-width: 420px) {
  .hero { min-height: 400px; }
  .hero-actions { flex-direction: column; align-items: stretch; }
  .hero-actions .btn { justify-content: center; width: 100%; }
}

.hero-copy {
  max-width: 780px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.hero-title { width: 100%; line-height: 1.05; }

.hero-title-line {
  display: block;
  width: 100%;
  text-align: center;
  font-family: var(--serif);
  font-size: clamp(48px, 6vw, 70px);
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.5);
}

.hero-title-line--accent {
  color: var(--accent);
  text-shadow: 0 2px 16px color-mix(in srgb, var(--accent) 45%, transparent);
}

.hero-subtext {
  width: 100%;
  max-width: 620px;
  margin: 20px auto 0;
  text-align: center;
  font-size: 17px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 400;
  line-height: 1.6;
  font-family: var(--mono);
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.45);
}

.hero-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 14px;
  margin-top: 32px;
  flex-wrap: wrap;
  width: 100%;
}

.hero-anim {
  opacity: 0;
  transform: translateY(18px);
  animation: heroFadeUp 0.7s ease forwards;
}
.hero-anim--1 { animation-delay: 0.05s; }
.hero-anim--2 { animation-delay: 0.2s; }
.hero-anim--3 { animation-delay: 0.35s; }
.hero-anim--4 { animation-delay: 0.5s; }

@keyframes heroFadeUp {
  to { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .hero-anim { opacity: 1; transform: none; animation: none; }
}

.btn--pill {
  border-radius: 999px;
  padding: 14px 32px;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.15s, border-color 0.15s;
}

.btn--pill.btn--accent {
  background: var(--accent);
  border-color: var(--accent);
  color: #0a0a0b;
  font-weight: 700;
}
.btn--pill.btn--accent:hover {
  background: #d4eb3c;
  border-color: #d4eb3c;
  transform: translateY(-3px);
  box-shadow: 0 12px 28px color-mix(in srgb, var(--accent) 45%, transparent);
}

.btn--pill.btn--outline {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.5);
  color: #fff;
  font-weight: 600;
}
.btn--pill.btn--outline:hover {
  border-color: var(--accent);
  color: var(--accent);
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(255, 255, 255, 0.08);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--mono);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 13px 26px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  color: black;
  text-decoration: none;
  transition: color 0.15s, border-color 0.15s, transform 0.15s;
}
.btn:hover {
  color: var(--text-1);
  border-color: var(--border-hi);
  transform: translateY(-1px);
}

.btn--accent {
  background: var(--accent);
  border-color: var(--accent);
  color: #0a0a0b;
  font-weight: 700;
}
.btn--accent:hover {
  background: #d4eb3c;
  border-color: #d4eb3c;
}

/* ============ LIVE TICKER ============ */
.ticker-bar {
  display: flex;
  align-items: center;
  gap: 0;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  overflow: hidden;
}

.ticker-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  padding: 10px 18px;
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent);
  border-right: 1px solid var(--border);
  background: var(--surface-2, var(--surface));
}

.ticker-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 0 color-mix(in srgb, var(--accent) 60%, transparent);
  animation: tickerPulse 1.6s ease-in-out infinite;
}
@keyframes tickerPulse {
  0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--accent) 55%, transparent); }
  70% { box-shadow: 0 0 0 7px transparent; }
  100% { box-shadow: 0 0 0 0 transparent; }
}

.ticker-track {
  flex: 1;
  overflow: hidden;
  mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent);
}

.ticker-content {
  display: flex;
  width: max-content;
  animation: tickerScroll 32s linear infinite;
  padding: 11px 0;
}
.ticker-bar:hover .ticker-content {
  animation-play-state: paused;
}

@keyframes tickerScroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

.ticker-item {
  display: inline-flex;
  align-items: center;
  gap: 18px;
  font-family: var(--mono);
  font-size: 12.5px;
  color: var(--text-2);
  white-space: nowrap;
  padding-right: 18px;
}
.ticker-sep { color: var(--accent); }

@media (prefers-reduced-motion: reduce) {
  .ticker-content { animation: none; }
  .ticker-dot { animation: none; }
}

/* ============ STATS STRIP ============ */
.stats-strip {
  max-width: 1120px;
  margin: 0 auto;
  padding: 48px 24px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  text-align: center;
}
@media (max-width: 720px) {
  .stats-strip { grid-template-columns: repeat(2, 1fr); }
}

.stat-block {
  padding: 20px 12px;
  border-left: 1px solid var(--border);
}
.stat-block:first-child { border-left: none; }
@media (max-width: 720px) {
  .stat-block:nth-child(odd) { border-left: none; }
}

.stat-number-wrap {
  font-family: var(--serif);
  font-size: clamp(30px, 4vw, 42px);
  color: var(--accent);
  line-height: 1;
}
.stat-suffix { color: var(--accent); }

.stat-label {
  margin-top: 10px;
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-3);
}

/* ILLUSTRATION SECTION */
.illustration-section {
  max-width: 1120px;
  margin: 0 auto;
  padding: 56px 24px;
  border-bottom: 1px solid var(--border);
}

.how-title {
  font-family: var(--serif);
  font-size: clamp(22px, 3vw, 28px);
  color: var(--text-1);
  line-height: 1.3;
  margin-bottom: 36px;
  max-width: 600px;
}

.how-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: start;
}

@media (max-width: 800px) {
  .how-layout { grid-template-columns: 1fr; gap: 32px; }
}

.how-image-col { position: sticky; top: 24px; }
@media (max-width: 800px) {
  .how-image-col { position: static; }
}

.how-image {
  width: 100%;
  height: 20em;
  border: 1px solid var(--border-hi);
  display: block;
  object-fit: contain;
  transition: transform 0.4s ease;
}
.how-image-col:hover .how-image {
  transform: scale(1.015);
}

/* SCAM STEPS */
.steps-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.step-row {
  display: flex;
  gap: 18px;
  align-items: flex-start;
  border-top: 1px solid var(--border);
  padding-top: 22px;
  transition: border-color 0.25s ease;
}
.step-row:first-child { border-top: none; padding-top: 0; }
.step-row:hover .step-number { color: #d4eb3c; }

.step-number {
  font-family: var(--serif);
  font-size: 26px;
  color: var(--accent);
  flex-shrink: 0;
  width: 44px;
  transition: color 0.2s ease;
}

.step-title {
  font-family: var(--serif);
  font-size: 17px;
  color: var(--text-1);
  margin-bottom: 8px;
}

.step-body {
  font-size: 13px;
  color: var(--text-3);
  line-height: 1.7;
  font-weight: 300;
}

/* LESSONS SECTION */
.lessons-section {
  padding: 56px 24px;
  max-width: 1120px;
  margin: 0 auto;
}

.lessons-title {
  font-family: var(--serif);
  font-size: clamp(22px, 3vw, 30px);
  color: var(--text-1);
  line-height: 1.3;
  max-width: 560px;
  margin-bottom: 32px;
}

.lessons-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 40px;
}
@media (max-width: 640px) {
  .lessons-grid { grid-template-columns: 1fr; }
}

.lesson-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}
.lesson-card:hover {
  transform: translateY(-4px);
  border-color: var(--accent-bdr, var(--border-hi));
  box-shadow: 0 16px 32px color-mix(in srgb, var(--accent) 8%, transparent);
}
.lesson-title {
  font-family: var(--serif); font-size: 16px;
  color: var(--text-1); margin-bottom: 8px;
}
.lesson-body {
  font-size: 13px; color: var(--text-3); line-height: 1.65; font-weight: 300;
}

/* BLOG CALLOUT */
.blog-callout {
  display: flex; align-items: center; justify-content: space-between; gap: 20px;
  background: var(--surface); border: 1px solid var(--border);
  border-left: 3px solid var(--accent);
  border-radius: var(--radius); padding: 24px 28px;
  text-decoration: none;
  transition: border-color 0.15s, transform 0.2s ease, box-shadow 0.2s ease;
}
.blog-callout:hover {
  border-color: var(--accent-bdr);
  transform: translateY(-2px);
  box-shadow: 0 16px 36px color-mix(in srgb, var(--accent) 10%, transparent);
}
@media (max-width: 560px) {
  .blog-callout { flex-direction: column; align-items: flex-start; }
}

.blog-eyebrow {
  font-family: var(--mono); font-size: 9px; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--accent); margin-bottom: 8px;
}
.blog-title {
  font-family: var(--serif); font-size: 18px; color: var(--text-1);
  line-height: 1.3; margin-bottom: 8px;
}
.blog-desc { font-size: 13px; color: var(--text-3); line-height: 1.6; font-weight: 300; max-width: 460px; }
.blog-arrow {
  font-family: var(--mono); font-size: 20px; color: var(--accent); flex-shrink: 0;
  transition: transform 0.2s ease;
}
.blog-callout:hover .blog-arrow { transform: translateX(6px); }

.about-section { padding: 72px 24px; }

.about-inner {
  max-width: 1120px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 56px;
  align-items: center;
}

@media (max-width: 860px) {
  .about-inner { grid-template-columns: 1fr; gap: 32px; }
  .about-art { order: -1; }
}

.about-title {
  font-family: var(--serif);
  font-size: clamp(26px, 3.4vw, 38px);
  line-height: 1.25;
  margin-bottom: 20px;
}

.about-lead { font-size: 16px; line-height: 1.7; font-weight: 500; margin-bottom: 18px; }
.about-body { font-size: 14px; line-height: 1.8; font-weight: 300; margin-bottom: 16px; }

.about-art { width: 100%; transition: transform 0.4s ease; }
.about-art:hover { transform: translateY(-4px); }
.about-art svg { width: 100%; height: auto; display: block; }

.map-section { background: var(--bg); padding: 56px 24px; }

.map-inner { max-width: 1120px; margin: 0 auto; text-align: center; }

.map-title {
  font-family: var(--serif);
  font-size: clamp(22px, 3vw, 30px);
  color: var(--text-1);
  margin-bottom: 28px;
}

.map-image { width: 100%; height: auto; display: block; border-radius: 12px; }

.registry-context { max-width: 920px; margin: 0 auto; padding: 0 1.25rem; }

.context-intro { max-width: 640px; margin: 0 auto 2rem; text-align: center; }

.context-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-3);
  margin-bottom: 14px;
}
.context-eyebrow .dot { width: 5px; height: 5px; background: var(--accent); border-radius: 50%; }

.context-title {
  font-family: var(--serif);
  font-size: clamp(1.6rem, 3.5vw, 5.1rem);
  color: var(--text-1);
  line-height: 1.25;
  margin-bottom: 16px;
}

.context-body {
  font-size: 14.5px;
  color: var(--text-2);
  line-height: 1.75;
  font-weight: 300;
  margin-bottom: 2px;
  font-family: var(--mono)
}
.threat-body {
  font-family: sans-serif;
  text-decoration: underline;
  text-decoration-color: var(--accent);
  text-decoration-thickness: 2px;
}
.context-body:last-child { margin-bottom: 0; }
</style>