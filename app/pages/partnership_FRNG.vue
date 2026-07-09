<script setup lang="ts">
useSeoMeta({
  title: 'Press & Partnerships — Fraud Radar NG',
  ogTitle: 'Press & Partnerships — Fraud Radar NG',
  description:
    'Journalists, NGOs, and fintechs working on fraud prevention — Fraud Radar NG is glad to talk. Reach our press and partnerships team directly.',
  ogDescription:
    'Journalists, NGOs, and fintechs working on fraud prevention — we\'re glad to talk.',
  ogImage: '/partnership.png',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Press & Partnerships — Fraud Radar NG',
  twitterDescription: 'Journalists, NGOs, and fintechs working on fraud prevention — we\'re glad to talk.',
  twitterImage: '/partnership.png',
})

const audiences = [
  {
    tag: 'Press',
    title: 'Journalists',
    image: '/journa.jpeg',
    body: 'Working a story on fraud patterns, scam networks, or financial crime in Nigeria? We can share anonymized report data, trend breakdowns, and go on record.',
    send: 'Your outlet, deadline, and what you\'re investigating.'
  },
  {
    tag: 'Impact',
    title: 'NGOs & advocacy groups',
    image: '/NG.jpg',
    body: 'Running consumer protection or financial literacy programs? We can share regional fraud data and explore ways to point your community toward each other\'s work.',
    send: 'Your organization, region of focus, and what collaboration you have in mind.'
  },
  {
    tag: 'Industry',
    title: 'Fintechs & banks',
    image: '/fin.jpeg',
    body: 'Building fraud detection, KYC, or dispute tooling? We hear about scam patterns before they show up in chargeback data. Let\'s talk about what\'s useful to share.',
    send: 'Your company, what you\'re building, and the specific data or integration you\'re after.'
  }
]

const stats = [
  { value: '1,240+', label: 'Reports filed' },
  { value: '38', label: 'States covered' },
  { value: '< 48h', label: 'Typical response time' }
]

const emailAddress = 'partnerships@fraudradar.ng'
const copied = ref(false)

function copyEmail() {
  navigator.clipboard.writeText(emailAddress)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
</script>

<template>
  <div class="partner-page">

    <!-- ===================== HERO — image first, oversized type ===================== -->
    <section class="hero">
      <div class="hero-image-wrap">
        <img
          src="/parts.png"
          alt="Investigators reviewing a fraud case file"
          class="hero-image"
        />
        <div class="hero-scrim" />
      </div>

      <div class="hero-content">
        <p class="hero-eyebrow"><span class="dot" /> Press &amp; partnerships</p>
        <h1 class="hero-title">
          Press or<br />partnership<br />inquiry?
        </h1>
        <p class="hero-sub">
          Journalists, NGOs, and fintechs working on fraud prevention —
          we're glad to talk.
        </p>
      </div>
    </section>

    <!-- ===================== STATS STRIP ===================== -->
    <section class="stats-strip">
      <div v-for="stat in stats" :key="stat.label" class="stat-block">
        <span class="stat-value">{{ stat.value }}</span>
        <span class="stat-label">{{ stat.label }}</span>
      </div>
    </section>

    <!-- ===================== AUDIENCE CARDS ===================== -->
    <section class="audience-section">
      <p class="section-eyebrow">Who we talk to</p>
      <h2 class="section-title">Three kinds of conversations we have often</h2>

      <div class="audience-grid">
  <div v-for="a in audiences" :key="a.title" class="audience-card">
    <div class="audience-image-wrap">
      <img :src="a.image" :alt="a.title" class="audience-image" />
    </div>
    <span class="audience-tag">{{ a.tag }}</span>
    <h3 class="audience-title">{{ a.title }}</h3>
    <p class="audience-body">{{ a.body }}</p>
    <div class="audience-send">
      <span class="send-label">Include in your first message</span>
      <span class="send-text">{{ a.send }}</span>
    </div>
  </div>
</div>
    </section>

    <!-- ===================== INFOGRAPHIC SECTION ===================== -->
<section class="infographic-section">
  <p class="section-eyebrow">The full picture</p>
  <h2 class="section-title">Why organizations choose to partner with us</h2>
  <p class="infographic-sub">
    A quick overview of how we collaborate, and what partnering with
    Fraud Radar NG actually looks like in practice.
  </p>

  <div class="infographic-frame">
    <!-- Replace with your actual filename once added to /public -->
    <img
      src="/part.png"
      alt="Fraud Radar NG partnership overview — strategic collaborations, media partnerships, regulatory engagement, and community impact"
      class="infographic-image"
    />
  </div>
</section>

    <!-- ===================== CONTACT CTA — signature stamp ===================== -->
    <section class="contact-section">
      <div class="contact-inner">
        <div class="contact-copy">
          <h2 class="contact-title">Reach the team directly</h2>
          <p class="contact-body">
            One inbox, checked by a real person — not a form that disappears
            into a queue. Tell us who you are and what you're working on;
            we'll route it to the right person from there.
          </p>

          <div class="contact-actions">
            <a :href="`mailto:${emailAddress}`" class="btn-primary">
              Email {{ emailAddress }}
            </a>
            <button type="button" class="btn-secondary" @click="copyEmail">
              {{ copied ? 'Copied ✓' : 'Copy address' }}
            </button>
          </div>
        </div>

        <div class="stamp-wrap" aria-hidden="true">
          <div class="stamp">
            <svg viewBox="0 0 140 140" class="stamp-ring">
              <defs>
                <path id="stamp-circle" d="M 70,70 m -55,0 a 55,55 0 1,1 110,0 a 55,55 0 1,1 -110,0" />
              </defs>
              <text class="stamp-text">
                <textPath href="#stamp-circle" startOffset="0%">
                  VERIFIED CONTACT · FRAUD RADAR NG · VERIFIED CONTACT · 
                </textPath>
              </text>
            </svg>
            <span class="stamp-check">✓</span>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
.partner-page {
  width: 100%;
}

/* ============ HERO ============ */
.hero {
  position: relative;
  min-height: 88vh;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}

.hero-image-wrap {
  position: absolute;
  inset: 0;
}
.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(0.55) contrast(1.05) brightness(0.65);
}
.hero-scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    280deg,
    rgba(10, 10, 11, 0.15) 0%,
    rgba(10, 10, 11, 0.55) 55%,
    rgba(10, 10, 11, 0.92) 100%
  );
}

.hero-content {
  position: relative;
  z-index: 1;
  padding: 0 44px 72px;
  max-width: 900px;
}
@media (max-width: 720px) {
  .hero-content { padding: 0 20px 48px; }
}

.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 20px;
}
.dot { width: 6px; height: 6px; background: var(--accent); border-radius: 50%; }

.hero-title {
  font-family: var(--serif);
  font-size: clamp(48px, 9vw, 108px);
  line-height: 0.98;
  letter-spacing: -0.02em;
  color: #fdfdfa;
  margin-bottom: 28px;
}

.hero-sub {
  font-size: clamp(16px, 2vw, 20px);
  line-height: 1.6;
  font-weight: 300;
  color: rgba(253, 253, 250, 0.82);
  max-width: 620px;
}

/* ============ STATS STRIP ============ */
.stats-strip {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-bottom: 1px solid var(--border);
}
@media (max-width: 640px) {
  .stats-strip { grid-template-columns: 1fr; }
}

.stat-block {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 32px 44px;
  border-right: 1px solid var(--border);
}
.stat-block:last-child { border-right: none; }
@media (max-width: 640px) {
  .stat-block { border-right: none; border-bottom: 1px solid var(--border); }
  .stat-block:last-child { border-bottom: none; }
}

.stat-value {
  font-family: var(--serif);
  font-size: 32px;
  color: var(--text-1);
}
.stat-label {
  font-family: var(--mono);
  font-size: 10.5px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-3);
}

/* ============ AUDIENCE SECTION ============ */
.audience-section {
  max-width: 1120px;
  margin: 0 auto;
  padding: 96px 44px 64px;
}
@media (max-width: 720px) {
  .audience-section { padding: 64px 20px 40px; }
}

.section-eyebrow {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-3);
  margin-bottom: 12px;
}
.section-title {
  font-family: var(--serif);
  font-size: clamp(26px, 3.4vw, 38px);
  color: var(--text-1);
  line-height: 1.2;
  max-width: 680px;
  margin-bottom: 48px;
}

.audience-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
@media (max-width: 900px) {
  .audience-grid { grid-template-columns: 1fr; }
}

.audience-card {
  display: flex;
  flex-direction: column;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  transition: border-color 0.2s ease, transform 0.2s ease;
}
.audience-card:hover {
  border-color: var(--border-hi);
  transform: translateY(-2px);
}

.audience-image-wrap {
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: var(--surface-2);
}

.audience-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.audience-tag {
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
  margin: 20px 28px 0;
}

.audience-title {
  font-family: var(--serif);
  font-size: 20px;
  color: var(--text-1);
  margin: 12px 28px 0;
}

.audience-body {
  font-size: 13.5px;
  line-height: 1.7;
  font-weight: 300;
  color: var(--text-2);
  flex: 1;
  margin: 0 28px 20px;
}

.audience-send {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px 28px 28px;
  border-top: 1px solid var(--border);
  margin-top: auto;
}
.send-label {
  font-family: var(--mono);
  font-size: 9.5px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-3);
}
.send-text {
  font-size: 12.5px;
  color: var(--text-2);
  font-weight: 300;
  line-height: 1.5;
}

/* ============ CONTACT SECTION ============ */
.contact-section {
  border-top: 1px solid var(--border);
  padding: 96px 44px;
}
@media (max-width: 720px) {
  .contact-section { padding: 64px 20px; }
}

.contact-inner {
  max-width: 1120px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 48px;
  align-items: center;
}
@media (max-width: 780px) {
  .contact-inner {
    grid-template-columns: 1fr;
    text-align: center;
  }
}

.contact-title {
  font-family: var(--serif);
  font-size: clamp(26px, 3.6vw, 38px);
  color: var(--text-1);
  margin-bottom: 16px;
}
.contact-body {
  font-size: 14.5px;
  line-height: 1.75;
  font-weight: 300;
  color: var(--text-2);
  max-width: 520px;
  margin-bottom: 28px;
}
@media (max-width: 780px) {
  .contact-body { margin-left: auto; margin-right: auto; }
}

.contact-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
@media (max-width: 780px) {
  .contact-actions { justify-content: center; }
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  background: var(--accent);
  color: #0a0a0b;
  font-weight: 600;
  font-family: var(--mono);
  font-size: 12px;
  letter-spacing: 0.04em;
  padding: 14px 24px;
  border-radius: var(--radius);
  text-decoration: none;
}
.btn-primary:hover { background: #d4eb3c; }

.btn-secondary {
  font-family: var(--mono);
  font-size: 12px;
  letter-spacing: 0.04em;
  color: var(--text-2);
  background: none;
  border: 1px solid var(--border-hi);
  border-radius: var(--radius);
  padding: 14px 20px;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
}
.btn-secondary:hover {
  border-color: var(--accent);
  color: var(--text-1);
}

/* ============ SIGNATURE ELEMENT — stamp ============ */
.stamp-wrap {
  display: flex;
  justify-content: center;
}
@media (max-width: 780px) {
  .stamp-wrap { margin-top: 8px; }
}

.stamp {
  position: relative;
  width: 140px;
  height: 140px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(-9deg);
  opacity: 0.92;
}

.stamp-ring {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.stamp-text {
  font-family: var(--mono);
  font-size: 8.4px;
  letter-spacing: 0.12em;
  fill: var(--accent);
}

.stamp-check {
  font-family: var(--serif);
  font-size: 40px;
  color: var(--accent);
  border: 2px solid var(--accent);
  border-radius: 50%;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

/* ============ INFOGRAPHIC SECTION ============ */
.infographic-section {
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 44px 96px;
}
@media (max-width: 720px) {
  .infographic-section { padding: 0 20px 64px; }
}

.infographic-sub {
  font-size: 14.5px;
  line-height: 1.75;
  font-weight: 300;
  color: var(--text-2);
  max-width: 620px;
  margin-bottom: 40px;
}

.infographic-frame {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--surface);
}

.infographic-image {
  width: 100%;
  height: auto;
  display: block;
}
</style>