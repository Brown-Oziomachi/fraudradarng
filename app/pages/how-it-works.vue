<script setup lang="ts">
useHead({ title: 'How It Works — Fraud Radar NG' })

const steps = [
  {
    number: '01',
    tag: 'Notice',
    title: 'Something feels off',
    body: 'You receive an unexpected transfer alert, a job offer that sounds too good, a message from a stranger asking for money, or you\u2019re about to send money to an account you\u2019ve never used before.'
  },
  {
    number: '02',
    tag: 'Verify',
    title: 'Search before you act',
    body: 'Before sending money or trusting the claim, search the bank account, company name, or website on Fraud Radar NG. If someone else has already reported it, you\u2019ll see their experience immediately.'
  },
  {
    number: '03',
    tag: 'Report',
    title: 'File a report if it\u2019s a scam',
    body: 'If you\u2019ve been targeted or scammed, fill out the report form: what type of account it was, why you\u2019re reporting it, and what happened. Attach screenshots if you have them \u2014 they help others verify your report.'
  },
  {
    number: '04',
    tag: 'Publish',
    title: 'Your report goes live',
    body: 'Reports are published immediately \u2014 no waiting, no approval queue. The next person who searches that account, company, or website will see your warning right away.'
  },
  {
    number: '05',
    tag: 'Protect',
    title: 'The community stays ahead',
    body: 'As more people report the same accounts and patterns, the radar gets sharper. Repeat offenders become visible faster, and new scam patterns get flagged before they spread widely.'
  }
]

const stats = [
  { value: '< 2 min', label: 'To file a report' },
  { value: '0', label: 'Sign-up required' },
  { value: 'Instant', label: 'Reports go live' }
]

const faqs = [
  {
    q: 'Does reporting someone get their account frozen automatically?',
    a: 'No. Fraud Radar NG is a public record of reports — it doesn\'t freeze accounts or contact banks on your behalf. For that, use the Recovery pipeline, which helps you generate the right letter to send to your own bank.'
  },
  {
    q: 'What if a report about me is wrong or unfair?',
    a: 'Use the "Flag a report" page to explain what\'s inaccurate. A moderator reviews every flag before any report is changed or removed — this isn\'t automatic in either direction.'
  },
  {
    q: 'Is my identity visible when I submit a report?',
    a: 'Your email is optional and only used if you want to be notified of outcomes — it\'s never shown publicly on the report itself.'
  },
  {
    q: 'Can I report a company or website, not just a bank account?',
    a: 'Yes. When submitting a report, you can choose whether the fraud involved a bank account, a company, or a website — the form adjusts to ask for the right details either way.'
  },
  {
    q: 'How do I get my money back if I\u2019ve already been scammed?',
    a: 'Use the Naira Recovery Pipeline. It walks you through generating a bank freeze-request letter and lays out the next steps for reporting to your bank and the CBN.'
  }
]
</script>

<template>
  <div class="how-page">

    <!-- ===================== HERO — image first, oversized type ===================== -->
    <section class="hero">
      <div class="hero-image-wrap">
        <img
          src="/fraudmap.png"
          alt="Person checking an account before sending money"
          class="hero-image"
        />
        <div class="hero-scrim" />
      </div>

      <div class="hero-content">
        <p class="hero-eyebrow"><span class="dot" /> How it works</p>
        <h1 class="hero-title">
          Five steps<br />between a scam<br />and a stopped scam.
        </h1>
        <p class="hero-sub">
          No sign-up required to search or report. Here's exactly what
          happens from the moment something feels wrong to the moment
          your report protects someone else.
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

    <!-- ===================== STEPS SECTION ===================== -->
    <section class="steps-section">
      <p class="section-eyebrow">The process</p>
      <h2 class="section-title">What happens, in order</h2>

      <div class="steps-grid">
        <div v-for="step in steps" :key="step.number" class="step-card">
          <div class="step-card-top">
            <span class="step-number">{{ step.number }}</span>
            <span class="step-tag">{{ step.tag }}</span>
          </div>
          <h3 class="step-title">{{ step.title }}</h3>
          <p class="step-body">{{ step.body }}</p>
        </div>
      </div>
    </section>

    <!-- ===================== CONTACT CTA — signature stamp ===================== -->
    <section class="contact-section">
      <div class="contact-inner">
        <div class="contact-copy">
          <h2 class="contact-title">Ready to check before you send?</h2>
          <p class="contact-body">
            Search a bank account, company, or website in seconds — or file
            a report if you've already been targeted. Either way, no
            account needed.
          </p>

          <div class="contact-actions">
            <NuxtLink to="/reports" class="btn-primary">
              Search reports
            </NuxtLink>
            <NuxtLink to="/report/new" class="btn-secondary">
              Report a scam
            </NuxtLink>
          </div>
        </div>

        <div class="stamp-wrap" aria-hidden="true">
          <div class="stamp">
            <svg viewBox="0 0 140 140" class="stamp-ring">
              <defs>
                <path id="how-stamp-circle" d="M 70,70 m -55,0 a 55,55 0 1,1 110,0 a 55,55 0 1,1 -110,0" />
              </defs>
              <text class="stamp-text">
                <textPath href="#how-stamp-circle" startOffset="0%">
                  VERIFIED PROCESS · FRAUD RADAR NG · VERIFIED PROCESS ·
                </textPath>
              </text>
            </svg>
            <span class="stamp-check">✓</span>
          </div>
        </div>
      </div>
    </section>

        
    <!-- ===================== FAQ SECTION ===================== -->
    <section class="faq-section">
      <p class="section-eyebrow">Questions</p>
      <h2 class="section-title">Common questions</h2>

      <div class="faq-list">
        <details
          v-for="(faq, i) in faqs"
          :key="i"
          class="faq-item"
        >
          <summary class="faq-q">{{ faq.q }}</summary>
          <p class="faq-a">{{ faq.a }}</p>
        </details>
      </div>
    </section>

  </div>
</template>

<style scoped>
.how-page {
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

/* ============ STEPS SECTION ============ */
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

/* ============ FAQ SECTION ============ */
.faq-section {
  max-width: 900px;
  margin: 0 auto;
  padding: 96px 44px;
  border-top: 1px solid var(--border);
}
@media (max-width: 720px) {
  .faq-section { padding: 64px 20px; }
}

.faq-list {
  display: flex;
  flex-direction: column;
}

.faq-item {
  padding: 22px 0;
  border-bottom: 1px solid var(--border);
}
.faq-item:last-child { border-bottom: none; }

.faq-q {
  font-family: var(--serif);
  font-size: 16.5px;
  color: var(--text-1);
  cursor: pointer;
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.faq-q::-webkit-details-marker { display: none; }
.faq-q::after {
  content: '+';
  flex-shrink: 0;
  font-family: var(--mono);
  color: var(--accent);
  font-size: 18px;
  transition: transform 0.2s ease;
}
.faq-item[open] .faq-q::after { transform: rotate(45deg); }

.faq-a {
  font-size: 13.5px;
  color: var(--text-2);
  font-weight: 300;
  line-height: 1.75;
  margin-top: 12px;
  max-width: 620px;
}
</style>