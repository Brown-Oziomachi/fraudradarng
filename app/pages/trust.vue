<script setup lang="ts">
useHead({ title: 'Trust & Moderation — Fraud Radar NG' })

const principles = [
  {
    number: '01',
    tag: 'Speed',
    title: 'Reports publish instantly',
    body: 'We don\u2019t hold reports in a review queue before they go live. Fraud moves fast, and a warning that arrives a week late is a warning that arrived too late. Reports are visible the moment they\u2019re submitted.'
  },
  {
    number: '02',
    tag: 'Honesty',
    title: 'We don\u2019t verify claims before publishing',
    body: 'Because reports go live immediately, we can\u2019t independently confirm every detail before it\u2019s visible. What you\u2019re reading is what someone reported \u2014 not a confirmed legal finding. Use judgment alongside what you find here, the same way you would with any public review or complaint.'
  },
  {
    number: '03',
    tag: 'Accountability',
    title: 'Anyone can flag a report',
    body: 'If a report is wrong, misleading, or about the wrong target, use the flag option on that report. Flagged reports are reviewed \u2014 we look at the details, the evidence attached, and the context before deciding whether it stays, gets corrected, or comes down.'
  },
  {
    number: '04',
    tag: 'Accumulation',
    title: 'Repeat reports strengthen the record, they don\u2019t replace it',
    body: 'When multiple people report the same account, company, or website, each new report is added alongside the original \u2014 not overwritten. The reported count and every added story stay visible, so the fuller picture builds over time instead of being lost.'
  },
  {
    number: '05',
    tag: 'Privacy',
    title: 'You can report without identifying yourself',
    body: 'We don\u2019t require a name, email, or account to file a report. What you choose to share \u2014 in your description, in evidence you attach \u2014 is up to you. We don\u2019t sell or share report data with third parties.'
  },
  {
    number: '06',
    tag: 'Limits',
    title: 'What we are, and what we are not',
    body: 'Fraud Radar NG is an independent, community-run awareness platform. We are not a bank, a law enforcement agency, or a government body, and filing a report here does not substitute for reporting to your bank, the police, or the EFCC.'
  }
]

const stats = [
  { value: '0', label: 'Reports pre-screened before publishing' },
  { value: 'Open', label: 'Flagging available on every report' },
  { value: 'Kept', label: 'Every added report, not overwritten' }
]
</script>

<template>
  <div class="trust-page">

    <!-- ===================== HERO ===================== -->
    <section class="hero">
      <div class="hero-image-wrap">
        <img
          src="/fraudmap.png"
          alt="A shared, transparent record of reported fraud"
          class="hero-image"
        />
        <div class="hero-scrim" />
      </div>

      <div class="hero-content">
        <p class="hero-eyebrow"><span class="dot" /> Trust &amp; moderation</p>
        <h1 class="hero-title">
          Open by design.<br />Honest about<br />its limits.
        </h1>
        <p class="hero-sub">
          Fraud Radar NG publishes reports instantly, without a review queue.
          That speed is the point \u2014 and it comes with responsibilities we
          take seriously. Here's exactly how moderation, flagging, and your
          data actually work.
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

    <!-- ===================== PRINCIPLES SECTION ===================== -->
    <section class="steps-section">
      <p class="section-eyebrow">How this works</p>
      <h2 class="section-title">Six principles behind every report you see</h2>

      <div class="steps-grid">
        <div v-for="p in principles" :key="p.number" class="step-card">
          <div class="step-card-top">
            <span class="step-number">{{ p.number }}</span>
            <span class="step-tag">{{ p.tag }}</span>
          </div>
          <h3 class="step-title">{{ p.title }}</h3>
          <p class="step-body">{{ p.body }}</p>
        </div>
      </div>
    </section>

    <!-- ===================== CONTACT CTA ===================== -->
    <section class="contact-section">
      <div class="contact-inner">
        <div class="contact-copy">
          <h2 class="contact-title">Think a report is wrong?</h2>
          <p class="contact-body">
            Flag it directly from the report page, or reach out to us if you
            need help resolving something more specific. We take every flag
            seriously \u2014 being fast doesn\u2019t mean being careless.
          </p>

          <div class="contact-actions">
            <NuxtLink to="/contact" class="btn-primary">
              Contact us
            </NuxtLink>
            <NuxtLink to="/reports" class="btn-secondary">
              Browse reports
            </NuxtLink>
          </div>
        </div>

        <div class="stamp-wrap" aria-hidden="true">
          <div class="stamp">
            <svg viewBox="0 0 140 140" class="stamp-ring">
              <defs>
                <path id="trust-stamp-circle" d="M 70,70 m -55,0 a 55,55 0 1,1 110,0 a 55,55 0 1,1 -110,0" />
              </defs>
              <text class="stamp-text">
                <textPath href="#trust-stamp-circle" startOffset="0%">
                  COMMUNITY MODERATED · FRAUD RADAR NG · COMMUNITY MODERATED ·
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
.trust-page {
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
  font-size: clamp(40px, 7.5vw, 92px);
  line-height: 1.05;
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

/* ============ PRINCIPLES SECTION ============ */
.steps-section {
  max-width: 1120px;
  margin: 0 auto;
  padding: 96px 44px 64px;
}
@media (max-width: 720px) {
  .steps-section { padding: 64px 20px 40px; }
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

.steps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
@media (max-width: 900px) {
  .steps-grid { grid-template-columns: 1fr; }
}

.step-card {
  display: flex;
  flex-direction: column;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 28px;
  transition: border-color 0.2s ease, transform 0.2s ease;
}
.step-card:hover {
  border-color: var(--border-hi);
  transform: translateY(-2px);
}

.step-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.step-number {
  font-family: var(--serif);
  font-size: 30px;
  color: var(--accent);
}

.step-tag {
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
}

.step-title {
  font-family: var(--serif);
  font-size: 19px;
  color: var(--text-1);
  margin-bottom: 12px;
}

.step-body {
  font-size: 13.5px;
  line-height: 1.7;
  font-weight: 300;
  color: var(--text-2);
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
  display: inline-flex;
  align-items: center;
  font-family: var(--mono);
  font-size: 12px;
  letter-spacing: 0.04em;
  color: var(--text-2);
  background: none;
  border: 1px solid var(--border-hi);
  border-radius: var(--radius);
  padding: 14px 20px;
  cursor: pointer;
  text-decoration: none;
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
</style>