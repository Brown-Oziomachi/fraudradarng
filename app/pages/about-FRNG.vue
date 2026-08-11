<script setup lang="ts">
import { ref, onBeforeUpdate } from 'vue'

useHead({ title: 'About Us — Fraud Radar NG' })

const founderName = ref('Sir Brown AD')
const showFounderModal = ref(false)

const founderLinks = [
  { label: 'X (Twitter)', href: 'https://x.com/@BrownC15427449', icon: 'x' as const },
  { label: 'GitHub', href: 'https://github.com/Brown-Oziomachi', icon: 'github' as const },
  { label: 'Website', href: 'https://sirbrownad.name.ng/bc/about', icon: 'globe' as const },
]

const headline = "Built because silence protects scammers, not victims."
const headlineWords = headline.split(' ')

const principles = [
  { label: 'Live in seconds', body: 'No approval queue. A report is searchable the moment it\u2019s submitted.' },
  { label: 'Free, always', body: 'No account, no fee. Protection shouldn\u2019t be gated behind either.' },
  { label: 'Community-flagged', body: 'Anyone can flag a report as inaccurate, keeping the radar honest.' },
]

const flowCards = [
  {
    label: 'One report',
    title: 'Spot it, log it',
    body: 'See a suspicious account, number, or message? File it in under two minutes — no login, no bureaucracy.',
    image: '/ones.png',
  },
  {
    label: 'One radar',
    title: 'It goes live instantly',
    body: 'Your report joins the shared radar immediately, searchable by anyone checking a name, number, or account before they trust it.',
    image: '/radargo1.png',
  },
  {
    label: 'One warning',
    title: 'Someone else is protected',
    body: 'The next person who searches that name sees your warning first — and walks away before they lose anything.',
    image: '/warningnow.png',
  },
]

const sectionRefs = ref<HTMLElement[]>([])
function setSectionRef(el: any) {
  if (el) sectionRefs.value.push(el as HTMLElement)
}

// Refs get re-collected on every render; without this, toggling the
// founder modal (or any reactive change) would keep appending duplicate
// entries to sectionRefs.
onBeforeUpdate(() => {
  sectionRefs.value = []
})

let observer: IntersectionObserver | null = null

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    sectionRefs.value.forEach((el) => el.classList.add('is-visible'))
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer?.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  )
  sectionRefs.value.forEach((el) => observer?.observe(el))
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>

<template>
  <div class="page-shell">
    <section class="page-hero">
      <div class="radar-field" aria-hidden="true">
        <span class="radar-ring radar-ring--1" />
        <span class="radar-ring radar-ring--2" />
        <span class="radar-ring radar-ring--3" />
        <span class="radar-sweep" />
        <span class="radar-blip radar-blip--1" />
        <span class="radar-blip radar-blip--2" />
        <span class="radar-blip radar-blip--3" />
        <span class="radar-blip radar-blip--4" />
      </div>

      <div class="page-hero-inner">
        <div class="eyebrow-pill">
          <span class="eyebrow-icon">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
              <path d="M12 2 4 5v6c0 5 3.4 8.9 8 11 4.6-2.1 8-6 8-11V5l-8-3Z" stroke="currentColor" stroke-width="1.8"
                stroke-linejoin="round" />
              <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </span>
          About us
        </div>

        <div class="page-main">
          <h1 class="page-title">
            <span v-for="(word, i) in headlineWords" :key="i" class="word"
              :style="{ animationDelay: `${i * 0.06}s` }">{{
                word }}&nbsp;</span>
          </h1>
        </div>
      </div>
    </section>

    <div>
      <p class="page-sub">
        Fraud Radar NG is Nigeria's community-powered fraud detection and
        awareness platform — helping people identify, report, and avoid
        scams before they become victims.
      </p>
    </div>

    <section :ref="setSectionRef" class="content-block reveal">
      <div class="signal-tag"><span class="signal-dot" /> SIGNAL DETECTED — WHY WE EXIST</div>
      <h2 class="block-title">Why we exist</h2>
      <p class="block-body">
        Every fraudulent bank account, fake company, and cloned website
        eventually reuses the same script on someone new.
        <mark class="highlight">The account that scammed you today will
          try the exact same message on someone else tomorrow</mark> — unless
        the pattern is exposed. A report filed in five minutes could be the
        five minutes that saves a stranger's life savings.
      </p>
      <p class="block-body">
        We're not a bank, a government agency, or a law firm. We're a
        shared radar — built by Nigerians, for Nigerians — that gets
        stronger every time someone chooses to speak up instead of staying
        silent out of embarrassment.
      </p>
    </section>

    <section :ref="setSectionRef" class="deep-dive-section reveal">
      <div class="deep-dive-grid">
        <div class="deep-dive-image-wrap">
          <img src="/repnow.png" alt="Fraud Radar NG platform showing community-submitted fraud reports"
            class="deep-dive-image" loading="lazy" />
        </div>

        <div class="deep-dive-copy">
          <div class="signal-tag"><span class="signal-dot" /> SIGNAL DETECTED — WHAT FRAUD RADAR NG ACTUALLY IS</div>
          <h2 class="block-title">More than a complaints board</h2>
          <p class="block-body">
            Fraud Radar NG is a searchable, growing database of fraud
            reports — bank accounts, companies, and websites — submitted
            directly by the people who encountered them. There's no
            approval queue standing between a warning and the person who
            needs to see it.
          </p>
          <p class="block-body">
            <mark class="highlight">Every account, name, or number can be
              checked before you send money</mark> — turning a moment of
            uncertainty into thirty seconds of verification instead of a
            leap of faith.
          </p>

          <ul class="deep-dive-points">
            <li>
              <span class="point-marker">01</span>
              <span class="point-text">Report bank accounts, companies, or websites in under two minutes</span>
            </li>
            <li>
              <span class="point-marker">02</span>
              <span class="point-text">Search before you transfer — see if others have already been warned</span>
            </li>
            <li>
              <span class="point-marker">03</span>
              <span class="point-text">Flag reports you believe are inaccurate, keeping the data trustworthy</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section :ref="setSectionRef" class="flow-section reveal">
      <div class="flow-inner">
        <h2 class="flow-heading">The power of one report</h2>

        <ul class="principle-strip">
          <li v-for="p in principles" :key="p.label" class="principle-chip">
            <span class="principle-label">{{ p.label }}</span>
            <span class="principle-body">{{ p.body }}</span>
          </li>
        </ul>

        <div class="flow-grid">
          <article v-for="card in flowCards" :key="card.title" class="flow-card">
            <div class="flow-image-wrap">
              <img :src="card.image" :alt="card.title" class="flow-image" loading="lazy" />
            </div>
            <div class="flow-card-body">
              <span class="flow-label">{{ card.label }}</span>
              <h3 class="flow-title">{{ card.title }}</h3>
              <p class="flow-text">{{ card.body }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section :ref="setSectionRef" class="content-block reveal">
      <div class="signal-tag"><span class="signal-dot" /> SIGNAL DETECTED — HOW REPORTS ARE HANDLED</div>
      <h2 class="block-title">How reports are handled</h2>
      <p class="block-body">
        Reports go live immediately after submission so the information is
        useful right away.
        <mark class="highlight">We don't verify claims before
          publishing</mark> — this keeps the platform fast and free, but it
        also means every report should be read as one person's account, not
        a proven fact. Anyone can flag a report they believe is inaccurate
        or misleading.
      </p>
    </section>

    <section :ref="setSectionRef" class="content-block reveal">
      <div class="signal-tag"><span class="signal-dot" /> SIGNAL DETECTED — WHO'S BEHIND THIS</div>
      <h2 class="block-title">Who's behind this</h2>
      <p class="block-body">
        Fraud Radar NG is built and maintained by
        <a href="#" class="highlight" @click.prevent="showFounderModal = true"> {{ founderName }}</a>,
        a full-stack developer based in Abuja. It's an independent project
        built to give ordinary Nigerians a place to warn each other,
        without needing a government office or a corporation's permission.
      </p>
    </section>

    <AboutFounderModal v-model="showFounderModal" :founder-name="founderName" :links="founderLinks" />

    <section :ref="setSectionRef" class="cta-block reveal">
      <NuxtLink to="/report/new" class="btn btn--accent">Report a scam</NuxtLink>
      <NuxtLink to="/reports" class="btn">Browse reports</NuxtLink>
    </section>
  </div>
</template>

<style scoped>
.page-shell {
  max-width: 1000px;
  margin: 0 auto;
  padding: 56px 24px 80px;
  position: relative;
}

/* ---------- Hero ---------- */
.page-hero {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  overflow: hidden;
  background-image: url('/report.png');
  padding: 0 24px;
  background-size: cover;
  background-position: center;
}

.page-hero-inner {
  position: relative;
  z-index: 1;
  max-width: 760px;
  margin: 0 auto;
  max-width: 100%;
}

.radar-field {
  position: absolute;
  top: 50%;
  right: -220px;
  transform: translateY(-50%);
  width: 640px;
  height: 640px;
  pointer-events: none;
  z-index: 0;
  opacity: 0.5;
}

.page-main {
  background-color: var(--surface);
  padding: 50px;
}

.page-title {
  position: relative;
  z-index: 1;
  font-family: var(--serif);
  font-weight: 700;
  font-size: clamp(36px, 9vw, 104px);
  color: var(--text-1);
  line-height: 1.05;
  letter-spacing: -0.02em;
  margin-bottom: 0;
}

.page-sub {
  z-index: 1;
  font-size: 20px;
  color: var(--text-2);
  line-height: 1.75;
  font-weight: 500;
  text-align: center;
  background-color: var(--surface);
  padding: 50px;
  margin-top: 40px;
  font-family: 'Times New Roman', Times, serif;
}

@media (max-width: 720px) {
  .page-hero {
    min-height: 90vh;
    min-height: 90dvh;
    padding: 0 16px;
  }

  .page-main {
    padding: 28px 20px;
  }

  .page-sub {
    padding: 32px 20px;
    font-size: 15px;
  }
}

.hero-scroll-cue {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-3);
}

.scroll-arrow {
  animation: scroll-bounce 1.8s ease-in-out infinite;
}

@keyframes scroll-bounce {

  0%,
  100% {
    transform: translateY(0);
    opacity: 0.6;
  }

  50% {
    transform: translateY(6px);
    opacity: 1;
  }
}

.radar-ring {
  position: absolute;
  inset: 0;
  border: 1px solid color-mix(in srgb, var(--accent) 35%, transparent);
  border-radius: 50%;
}

.radar-ring--1 {
  inset: 0;
}

.radar-ring--2 {
  inset: 90px;
}

.radar-ring--3 {
  inset: 180px;
}

.radar-sweep {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: conic-gradient(from 0deg,
      color-mix(in srgb, var(--accent) 55%, transparent) 0deg,
      transparent 55deg,
      transparent 360deg);
  animation: radar-spin 4s linear infinite;
}

.radar-blip {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 0 color-mix(in srgb, var(--accent) 60%, transparent);
  animation: blip-pulse 2.4s ease-out infinite;
}

.radar-blip--1 {
  top: 65px;
  left: 115px;
  animation-delay: 0s;
}

.radar-blip--2 {
  top: 195px;
  left: 360px;
  animation-delay: 0.6s;
}

.radar-blip--3 {
  top: 325px;
  left: 145px;
  animation-delay: 1.2s;
}

.radar-blip--4 {
  top: 145px;
  left: 260px;
  animation-delay: 1.8s;
}

@keyframes radar-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes blip-pulse {
  0% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--accent) 55%, transparent);
    opacity: 1;
  }

  70% {
    box-shadow: 0 0 0 10px transparent;
    opacity: 0.4;
  }

  100% {
    box-shadow: 0 0 0 0 transparent;
    opacity: 1;
  }
}

.eyebrow-pill {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 18px 9px 14px;
  background: color-mix(in srgb, var(--accent) 16%, var(--surface));
  border: 1px solid color-mix(in srgb, var(--accent) 40%, var(--border));
  color: var(--text-1);
  font-family: var(--mono);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.03em;
  margin-bottom: 28px;
}

.eyebrow-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent);
}

.word {
  display: inline-block;
  opacity: 0;
  transform: translateY(14px);
  animation: word-rise 0.55s ease forwards;
}

@keyframes word-rise {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ---------- Scroll reveal ---------- */
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* ---------- Content sections ---------- */
.content-block {
  margin-top: 56px;
}

.signal-tag {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #4ade80;
  margin-bottom: 14px;
}

.signal-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #4ade80;
  animation: blip-pulse 2.4s ease-out infinite;
}

.block-title {
  font-family: var(--serif);
  font-size: 20px;
  color: var(--text-1);
  margin-bottom: 12px;
}

.block-body {
  font-size: 14px;
  color: var(--text-3);
  line-height: 1.8;
  font-weight: 300;
  margin-bottom: 12px;
}

.highlight {
  background: none;
  color: var(--text-1);
  font-weight: 500;
  padding: 0 2px;
  position: relative;
  background-image: linear-gradient(color-mix(in srgb, var(--accent) 30%, transparent),
      color-mix(in srgb, var(--accent) 30%, transparent));
  background-repeat: no-repeat;
  background-position: 0 100%;
  background-size: 0% 40%;
  transition: background-size 0.8s ease 0.15s;
}

.reveal.is-visible .highlight {
  background-size: 100% 40%;
}

/* ---------- Flow / "power of one" section ---------- */
.flow-section {
  position: relative;
  left: 50%;
  right: 50%;
  width: 100vw;
  margin-left: -50vw;
  margin-right: -50vw;
  margin-top: 64px;
  padding: 56px 32px;
  box-sizing: border-box;
  background-color: var(--surface);
}

.flow-inner {
  max-width: 1200px;
  margin: 0 auto;
}

.flow-heading {
  font-family: var(--serif);
  font-size: clamp(24px, 3.2vw, 32px);
  font-weight: 700;
  color: var(--text-1);
  text-align: center;
  margin-bottom: 28px;
}

.principle-strip {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin: 0 0 36px;
  padding: 0;
}

.principle-chip {
  border: 1px solid var(--border);
  background: var(--bg);
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.principle-label {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--accent);
}

.principle-body {
  font-size: 12.5px;
  color: var(--text-3);
  line-height: 1.55;
  font-weight: 300;
}

@media (max-width: 720px) {
  .principle-strip {
    grid-template-columns: 1fr;
  }
}

.flow-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.flow-card {
  background: var(--surface);
  border: 1px solid var(--border);
  overflow: hidden;
  transition: transform 0.25s ease, border-color 0.25s ease;
}

.flow-card:hover {
  transform: translateY(-4px);
  border-color: var(--border-hi);
}

.flow-image-wrap {
  aspect-ratio: 1 / 1;
  background: var(--surface-2);
  overflow: hidden;
  margin-top: 20px;
}

.flow-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.flow-card-body {
  padding: 18px 18px 22px;
}

.flow-label {
  display: block;
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 8px;
}

.flow-title {
  font-family: var(--serif);
  font-size: 17px;
  color: var(--text-1);
  margin-bottom: 8px;
}

.flow-text {
  font-size: 13px;
  line-height: 1.65;
  color: var(--text-3);
  font-weight: 300;
}

/* ---------- CTA ---------- */
.cta-block {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 48px;
}

.btn {
  display: inline-flex;
  align-items: center;
  font-family: var(--mono);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 13px 26px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-2);
  text-decoration: none;
  transition: color 0.15s, border-color 0.15s, transform 0.15s, box-shadow 0.15s;
}

.btn:hover {
  color: var(--text-1);
  border-color: var(--border-hi);
  transform: translateY(-2px);
  border-color: #d4eb3c;
}

.btn--accent {
  background: var(--accent);
  border-color: var(--accent);
  color: var(--text-1);
  font-weight: 700;
}

.btn--accent:hover {
  background: var(--surface);
  border-color: #d4eb3c;
  box-shadow: 0 6px 24px color-mix(in srgb, var(--accent) 45%, transparent);
}

/* ---------- Reduced motion ---------- */
@media (prefers-reduced-motion: reduce) {

  .radar-sweep,
  .radar-blip,
  .signal-dot,
  .word {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }

  .reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }

  .highlight {
    background-size: 100% 40% !important;
    transition: none;
  }
}

@media (max-width: 720px) {
  .flow-grid {
    grid-template-columns: 1fr;
  }

  .flow-section {
    padding: 40px 20px;
  }
}

@media (max-width: 560px) {
  .radar-field {
    display: none;
  }
}

/* ---------- Deep dive section ---------- */
.deep-dive-section {
  margin-top: 64px;
}

.deep-dive-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
}

.deep-dive-image-wrap {
  position: sticky;
  top: 32px;
  overflow: hidden;
  border: 1px solid var(--border);
  aspect-ratio: 7 / 7;
}

.deep-dive-image {
  width: 100%;
  height: 100%;
  display: block;
}

.deep-dive-copy {
  display: flex;
  flex-direction: column;
}

.deep-dive-points {
  list-style: none;
  margin-top: 24px;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.deep-dive-points li {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

.deep-dive-points li:first-child {
  padding-top: 0;
  border-top: none;
}

.point-marker {
  font-family: var(--serif);
  font-size: 18px;
  color: var(--accent);
  flex-shrink: 0;
  width: 28px;
}

.point-text {
  font-size: 13.5px;
  line-height: 1.65;
  color: var(--text-2);
  font-weight: 300;
  padding-top: 2px;
}

@media (max-width: 820px) {
  .deep-dive-grid {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .deep-dive-image-wrap {
    position: static;
    aspect-ratio: 16 / 10;
  }
}
</style>