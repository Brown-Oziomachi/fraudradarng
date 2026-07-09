<script setup lang="ts">
useSeoMeta({
  title: 'Report a Suspicious Account — Fraud Radar NG',
  ogTitle: 'Report a Suspicious Account — Fraud Radar NG',
  description:
    'Report a suspicious bank account or scam in minutes. Your report goes live instantly, warning the next person before they send any money.',
  ogDescription:
    'Report a suspicious bank account or scam in minutes. Your report goes live instantly, warning the next person before they send any money.',
  ogImage: '/images/report-og.jpg',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Report a Suspicious Account — Fraud Radar NG',
  twitterDescription:
    'Report a suspicious bank account or scam in minutes and warn the next person before they lose anything.',
  twitterImage: '/images/report-og.jpg',
})

const testimonials = [
  {
    quote: 'He sent a screenshot of the transfer. I released the goods before checking my own account. The money never came.',
    context: 'Online seller, Lagos'
  },
  {
    quote: 'She called crying, said her mother was in the hospital and needed money by evening. I sent \u20a645,000 before I even thought to ask questions.',
    context: 'Victim of a family emergency scam'
  },
  {
    quote: 'The account name matched the company website exactly. I found out three weeks later it was a fake account under a real name.',
    context: 'Small business owner, Abuja'
  }
]

const stats = [
  { value: '1,240+', label: 'Reports filed' },
  { value: '38', label: 'States covered' },
  { value: 'Live', label: 'Updated as reports come in' }
]

const nextSteps = [
  {
    label: 'One report',
    title: 'You submit the details',
    body: 'Account name, number, bank, and what happened — takes about two minutes.'
  },
  {
    label: 'One radar',
    title: 'It goes live instantly',
    body: 'No review queue. Your report is searchable the moment you hit submit.'
  },
  {
    label: 'One warning',
    title: 'The next person is protected',
    body: 'Anyone who checks that name or account sees your report before they send anything.'
  }
]

</script>

<template>
  <div>
    <section class="impact-strip">
      <div class="impact-bg-image" />
      <div class="impact-overlay" />

      <!-- <div class="impact-content">
        <div class="impact-eyebrow">
          <span class="dot dot--danger" /> Real reports, real losses
        </div>
        <h1 class="impact-title">
          Behind every fake account is someone who lost something real.
        </h1>
        <p class="impact-sub">
          Rent money. School fees. A small business's entire float for the
          month. Fraud isn't abstract — it's the reason people are asking
          for help below.
        </p>
      </div> -->

      <svg class="impact-curve" viewBox="0 0 1440 100" preserveAspectRatio="none">
        <path d="M0,0 C480,100 960,100 1440,0 L1440,100 L0,100 Z" fill="var(--bg)" />
      </svg>
    </section>

    <div class="page-body">
      <section class="stats-strip">
        <div v-for="s in stats" :key="s.label" class="stat">
          <span class="stat-value">{{ s.value }}</span>
          <span class="stat-label">{{ s.label }}</span>
        </div>
      </section>

      <div class="body-grid">
        <div class="body-main">
          <div class="form-section">
            <div class="eyebrow">
              <span class="dot" /> Community Report
            </div>

            <h2 class="page-title">Ready to file a report?</h2>
            <p class="page-subtitle">
              Your report helps other Nigerians avoid the same scam. Take a
              moment to make sure the details you're about to submit are
              accurate.
            </p>

            <div class="warning-box">
              <div class="warning-title">⚠ Before you submit</div>
              <ul class="warning-list">
                <li>Only report accounts you have <strong>direct evidence</strong> against — a real conversation, a real transaction, a real attempt to defraud you.</li>
                <li>Do not report someone based on rumor, suspicion alone, or a personal dispute unrelated to fraud.</li>
                <li>Reports are public and tied to a real account holder's name — a false report can cause real harm to an innocent person.</li>
                <li>Deliberately false reports may be removed, and repeated abuse of this platform may result in your submissions being blocked.</li>
              </ul>
            </div>

            <NuxtLink to="/report/form" class="continue-btn">
              Continue to report form →
            </NuxtLink>

            <p class="legal-note">
              By continuing, you confirm this report is based on a real
              experience, to the best of your knowledge. Fraud Radar NG
              does not verify reports before publishing and is not liable
              for user-submitted content.
            </p>
          </div>

          <div class="divider" />

          <div class="timeline-section">
            <h3 class="timeline-heading">What happens after you submit</h3>
            <div class="timeline-grid">
              <div v-for="step in nextSteps" :key="step.title" class="timeline-card">
                <span class="timeline-label">{{ step.label }}</span>
                <h4 class="timeline-title">{{ step.title }}</h4>
                <p class="timeline-body">{{ step.body }}</p>
              </div>
            </div>
          </div>
        </div>

        <aside class="body-aside">
          <div class="testimonials">
            <div v-for="t in testimonials" :key="t.context" class="testimonial-card">
              <div class="quote-mark">"</div>
              <p class="testimonial-quote">{{ t.quote }}</p>
              <div class="testimonial-context">— {{ t.context }}</div>
            </div>
          </div>

          <div class="share-box">
            <div class="share-text">
              <div class="share-title">Know someone about to send money to a stranger?</div>
              <p class="share-sub">Tell them to search it first. It takes ten seconds and could save them everything.</p>
            </div>
            <NuxtLink to="/report/form" class="share-btn">
              Share on FRNG
            </NuxtLink>
            <NuxtLink to="/reports" class="share-btn share-btn--secondary">
              Search reports
            </NuxtLink>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<style scoped>
.eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: var(--mono); font-size: 10px; letter-spacing: 0.12em;
  text-transform: uppercase; color: var(--text-3);
  margin-bottom: 16px;
}
.dot { width: 5px; height: 5px; background: var(--accent); border-radius: 50%; }
.dot--danger { background: #f87171; }

/* HERO — full-bleed, matches /reports exactly */
.impact-strip {
  position: relative;
  overflow: hidden;
  min-height: 420px;
  display: flex;
  align-items: center;
}

.impact-bg-image {
  position: absolute;
  inset: 0;
  background-image: url('/rep.png');
  background-size: cover;
  background-position: center;
  
  filter: grayscale(10%);
  z-index: 0;
}

.impact-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
}



@media (max-width: 640px) {
  .impact-strip { min-height: 380px; }
  .impact-content { padding: 50px 20px 80px; }
  .impact-overlay {
    background: linear-gradient(
      180deg,
      rgba(0,10,11,0.10) 10%,
      rgba(10,10,11,0.6) 20%
    );
  }
}

.impact-eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: var(--mono); font-size: 10px; letter-spacing: 0.1em;
  text-transform: uppercase; color: #f87171;
  margin-bottom: 16px;
}
.impact-title {
  font-family: var(--serif);
  font-size: clamp(30px, 4.5vw, 46px);
  color: rgba(255, 255, 255, 0.92);
  line-height: 1.2;
  margin-bottom: 14px;
}
.impact-sub {
  font-size: 14px;
  color: rgba(200, 200, 200, 0.92);
  line-height: 1.7;
  font-weight: 300;
  max-width: 480px;
}

.impact-curve {
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 60px;
  z-index: 2;
  display: block;
}

/* PAGE BODY — wider now to make room for a two-column layout */
.page-body {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 24px;
}
@media (max-width: 560px) {
  .page-body { padding: 0 16px; }
}

/* STATS STRIP */
.stats-strip {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-top: 32px;
  margin-bottom: 36px;
}
.stat {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 18px 16px;
  text-align: center;
}
.stat-value {
  display: block;
  font-family: var(--serif);
  font-size: 24px;
  color: var(--text-1);
  margin-bottom: 4px;
}
.stat-label {
  display: block;
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-3);
}
@media (max-width: 560px) {
  .stats-strip { grid-template-columns: 1fr; }
}

/* TWO-COLUMN DESKTOP LAYOUT */
.body-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 40px;
  align-items: start;
}
@media (max-width: 900px) {
  .body-grid {
    grid-template-columns: 1fr;
  }
}

.body-aside {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
@media (min-width: 901px) {
  .body-aside {
    position: sticky;
    top: 96px;
  }
}

/* TESTIMONIALS — vertical stack in the sidebar */
.testimonials {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.testimonial-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
  position: relative;
}
.quote-mark {
  font-family: var(--serif);
  font-size: 40px;
  color: var(--border-hi);
  line-height: 1;
  margin-bottom: 4px;
}
.testimonial-quote {
  font-size: 13px;
  color: var(--text-2);
  line-height: 1.65;
  font-weight: 300;
  font-style: italic;
  margin-bottom: 14px;
}
.testimonial-context {
  font-family: var(--mono);
  font-size: 10px;
  color: var(--text-3);
}

.divider {
  border-top: 1px solid var(--border);
  margin: 36px 0;
}

/* FORM SECTION */
.form-section { margin-bottom: 0; }

.page-title {
  font-family: var(--serif);
  font-size: clamp(26px, 3.6vw, 34px);
  color: var(--text-1);
  margin-bottom: 12px;
  line-height: 1.15;
}

.page-subtitle {
  font-size: 14px;
  color: var(--text-2);
  line-height: 1.7;
  font-weight: 300;
  max-width: 480px;
  margin-bottom: 28px;
}

.warning-box {
  background: rgba(248, 113, 113, 0.06);
  border: 1px solid rgba(248, 113, 113, 0.25);
  border-left: 3px solid #f87171;
  border-radius: var(--radius);
  padding: 20px 22px;
  margin-bottom: 28px;
}

.warning-title {
  font-family: var(--mono);
  font-size: 12px;
  letter-spacing: 0.06em;
  color: #f87171;
  margin-bottom: 12px;
  font-weight: 600;
}

.warning-list {
  padding-left: 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.warning-list li {
  font-size: 13px;
  color: var(--text-2);
  line-height: 1.6;
  font-weight: 300;
}
.warning-list strong {
  color: var(--text-1);
  font-weight: 600;
}

.continue-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--mono);
  font-size: 12px;
  letter-spacing: 0.04em;
  background: var(--accent);
  color: #0a0a0b;
  font-weight: 600;
  border-radius: var(--radius);
  padding: 13px 26px;
  text-decoration: none;
}
.continue-btn:hover { background: #d4eb3c; }

.legal-note {
  font-family: var(--mono);
  font-size: 10px;
  color: var(--text-3);
  line-height: 1.7;
  margin-top: 20px;
}

/* WHAT HAPPENS NEXT — mini timeline */
.timeline-heading {
  font-family: var(--serif);
  font-size: 19px;
  color: var(--text-1);
  margin-bottom: 18px;
}
.timeline-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}
@media (max-width: 640px) {
  .timeline-grid { grid-template-columns: 1fr; }
}
.timeline-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 18px;
}
.timeline-label {
  display: block;
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 8px;
}
.timeline-title {
  font-family: var(--serif);
  font-size: 15px;
  color: var(--text-1);
  margin-bottom: 6px;
}
.timeline-body {
  font-size: 12.5px;
  color: var(--text-3);
  line-height: 1.6;
  font-weight: 300;
}

/* SHARE BOX — now stacked in the sidebar */
.share-box {
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-left: 3px solid var(--accent);
  border-radius: var(--radius);
  padding: 22px;
}
.share-title {
  font-family: var(--serif);
  font-size: 16px;
  color: var(--text-1);
  margin-bottom: 6px;
}
.share-sub {
  font-size: 12px;
  color: var(--text-3);
  font-weight: 300;
  line-height: 1.6;
}
.share-btn {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.04em;
  background: var(--accent);
  color: #0a0a0b;
  font-weight: 600;
  border: none;
  border-radius: var(--radius);
  padding: 12px 18px;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  display: block;
}
.share-btn:hover { background: #d4eb3c; }
.share-btn--secondary {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-2);
}
.share-btn--secondary:hover {
  background: var(--surface-2);
  color: var(--text-1);
}
</style>