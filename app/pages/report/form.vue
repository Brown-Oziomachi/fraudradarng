<script setup lang="ts">
useHead({
  title: 'Submit Your Report — Fraud Radar NG'
})

function handleSubmitted(id: string) {
  navigateTo(`/reports/${id}`)
}

const goodExample =
  '"Sent \u20a635,000 to account 0123456789 (GTBank, name: John A. Okafor) on 12 June after he claimed to be selling a generator on Facebook Marketplace. Blocked me right after payment cleared."'

const weakExample =
  '"Some guy scammed me on Facebook, don\u2019t remember his name."'

const checklist = [
  'Include the exact account number, bank, or website URL',
  'Give a date or timeframe, even approximate',
  'State the amount involved, if money changed hands',
  'Describe the platform where contact happened (WhatsApp, Instagram, etc.)',
  'Attach a screenshot if you have one — it\'s the fastest way to build trust'
]
</script>

<template>
  <section class="form-hero">
    <div class="form-hero-content">
      <NuxtLink to="/report/new" class="back-link">← Back</NuxtLink>

      <div class="page-header">
        <div class="eyebrow">
          <span class="dot" /> Community Report
        </div>
        <h1 class="form-hero-title">Tell us what happened.</h1>
        <p class="form-hero-sub">
          Be specific and accurate — this becomes a public record other
          people will rely on before they send their own money. Screenshots
          are optional but help others verify your report.
        </p>
      </div>

      <div class="hero-grid">
        <div class="form-column">
          <ReportForm @submitted="handleSubmitted" />

          <p class="legal-note">
            By submitting, you confirm this report is based on a real experience,
            to the best of your knowledge. Fraud Radar NG does not verify reports
            before publishing and is not liable for user-submitted content.
          </p>
        </div>

        <aside class="help-column">
          <div class="help-card">
            <h3 class="help-title">Write a report that helps</h3>
            <ul class="checklist">
              <li v-for="item in checklist" :key="item">
                <span class="check-icon">✓</span>
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>

          <div class="help-card">
            <h3 class="help-title">Specific reports get taken seriously</h3>
            <div class="example example--weak">
              <span class="example-label">Too vague</span>
              <p>{{ weakExample }}</p>
            </div>
            <div class="example example--good">
              <span class="example-label">Useful</span>
              <p>{{ goodExample }}</p>
            </div>
          </div>

          <div class="help-card help-card--note">
            <h3 class="help-title">Your report is public</h3>
            <p class="note-body">
              Once submitted, anyone can search and see this report — that's
              what makes it useful. Stick to what you personally experienced
              and avoid personal attacks unrelated to the fraud itself.
            </p>
          </div>
        </aside>
      </div>
    </div>
  </section>
</template>

<style scoped>
.eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: var(--mono); font-size: 10px; letter-spacing: 0.12em;
  text-transform: uppercase; color: var(--text-3);
  margin-bottom: 16px;
}
.dot { width: 5px; height: 5px; background: var(--accent); border-radius: 50%; }

.form-hero {
  background: var(--bg);
  min-height: 100vh;
}

.form-hero-content {
  max-width: 600px;
  margin: 0 auto;
  padding: 48px 24px 80px;
  width: 100%;
}

.back-link {
  display: inline-block;
  margin-bottom: 24px;
  font-family: var(--mono);
  font-size: 11px;
  color: var(--text-3);
  text-decoration: none;
}
.back-link:hover { color: var(--accent); }

.form-hero-title {
  font-family: var(--serif);
  font-size: clamp(28px, 4vw, 38px);
  color: var(--text-1);
  line-height: 1.15;
  margin-bottom: 12px;
}

.form-hero-sub {
  font-size: 14px;
  color: var(--text-2);
  line-height: 1.7;
  font-weight: 300;
  max-width: 480px;
}

.form-column {
  display: flex;
  flex-direction: column;
  margin-top: 32px;
}

.legal-note {
  font-family: var(--mono);
  font-size: 10px;
  color: var(--text-3);
  line-height: 1.7;
  margin-top: 20px;
}

/* ---------- Sidebar (help column) ---------- */
.help-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 32px;
}

.help-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px 22px;
}
.help-title {
  font-family: var(--serif);
  font-size: 16px;
  color: var(--text-1);
  margin-bottom: 14px;
}

.checklist {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.checklist li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 12.5px;
  color: var(--text-2);
  line-height: 1.55;
  font-weight: 300;
}
.check-icon {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: color-mix(in srgb, var(--accent) 20%, transparent);
  color: var(--accent);
  font-size: 10px;
  font-weight: 700;
  margin-top: 1px;
}

.example {
  border-radius: calc(var(--radius) - 2px);
  padding: 12px 14px;
  margin-top: 10px;
}
.example p {
  font-size: 12px;
  line-height: 1.55;
  font-style: italic;
  color: var(--text-2);
}
.example-label {
  display: block;
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 6px;
}
.example--weak {
  background: rgba(248, 113, 113, 0.06);
  border: 1px solid rgba(248, 113, 113, 0.2);
}
.example--weak .example-label { color: #f87171; }
.example--good {
  background: color-mix(in srgb, var(--accent) 8%, transparent);
  border: 1px solid color-mix(in srgb, var(--accent) 25%, transparent);
}
.example--good .example-label { color: var(--accent); }

.help-card--note .note-body {
  font-size: 12.5px;
  color: var(--text-3);
  line-height: 1.65;
  font-weight: 300;
}

@media (min-width: 900px) {
  .form-hero-content {
    max-width: 1100px;
    padding: 90px 40px 120px;
  }
  .page-header { max-width: 700px; }

  .hero-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 340px;
    gap: 48px;
    align-items: start;
  }

  .form-column { margin-top: 40px; }

  .help-column {
    margin-top: 40px;
    position: sticky;
    top: 96px;
  }
}
</style>