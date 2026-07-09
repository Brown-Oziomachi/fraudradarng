<template>
  <div class="privacy-page">
    <div class="privacy-container">
      <p class="eyebrow">Legal</p>
      <h1 class="page-title">Privacy Notice</h1>
      <p class="last-updated">Last updated: {{ lastUpdated }}</p>

      <p class="intro">
        Fraud Radar NG ("we", "us", "our") helps Nigerians report and
        research suspected fraud. This notice explains what personal data we
        collect when you use our site, why we collect it, and the choices
        you have.
      </p>

      <nav class="toc" aria-label="Table of contents">
        <a
          v-for="section in sections"
          :key="section.id"
          :href="`#${section.id}`"
          class="toc-link"
        >
          {{ section.title }}
        </a>
      </nav>

      <section id="data-we-collect" class="notice-section">
        <h2>1. Data we collect</h2>
        <p>Depending on how you use Fraud Radar NG, we may collect:</p>
        <ul>
          <li>
            <strong>Report content</strong> — details you submit about a
            suspected scam, including names, phone numbers, account numbers,
            or screenshots you choose to upload.
          </li>
          <li>
            <strong>Contact details</strong> — your email address, if you
            subscribe to alerts, submit a report, or contact us directly.
          </li>
          <li>
            <strong>Usage data</strong> — basic technical information such
            as IP address, browser type, and pages visited, collected
            automatically to keep the service secure and working correctly.
          </li>
        </ul>
      </section>

      <section id="how-we-use-it" class="notice-section">
        <h2>2. How we use your data</h2>
        <ul>
          <li>To publish and moderate fraud reports on the platform.</li>
          <li>To send fraud alerts and safety tips, if you subscribe.</li>
          <li>To respond to messages sent through our contact form.</li>
          <li>To detect abuse, spam, and fraudulent report submissions.</li>
          <li>To maintain and improve the security of the site.</li>
        </ul>
      </section>

      <section id="legal-basis" class="notice-section">
        <h2>3. Legal basis for processing</h2>
        <p>
          We process your data on the basis of your consent (for example,
          when you subscribe to email alerts), our legitimate interest in
          operating a fraud-awareness platform, and, where relevant, to
          comply with legal obligations.
        </p>
      </section>

      <section id="sharing" class="notice-section">
        <h2>4. How we share data</h2>
        <p>
          Report content you submit may be made publicly visible on the
          platform, since the purpose of Fraud Radar NG is to warn others.
          We do not sell personal data. We may share limited data with:
        </p>
        <ul>
          <li>Service providers who host our infrastructure and database.</li>
          <li>Email delivery providers, to send alerts you've subscribed to.</li>
          <li>Law enforcement or regulators, where required by law.</li>
        </ul>
      </section>

      <section id="retention" class="notice-section">
        <h2>5. Data retention</h2>
        <p>
          We keep report and subscriber data for as long as it serves the
          purpose it was collected for, or until you ask us to remove it,
          whichever comes first.
        </p>
      </section>

      <section id="your-rights" class="notice-section">
        <h2>6. Your rights</h2>
        <p>You can ask us to:</p>
        <ul>
          <li>Access the personal data we hold about you.</li>
          <li>Correct inaccurate data.</li>
          <li>Delete your data, subject to legal or safety exceptions.</li>
          <li>Unsubscribe from email alerts at any time.</li>
        </ul>
        <p>
          To exercise any of these rights, contact us using the details
          below.
        </p>
      </section>

      <section id="cookies" class="notice-section">
        <h2>7. Cookies</h2>
        <p>
          We use minimal cookies necessary for the site to function, such as
          remembering your theme preference. We do not use third-party
          advertising trackers.
        </p>
      </section>

      <section id="changes" class="notice-section">
        <h2>8. Changes to this notice</h2>
        <p>
          We may update this notice from time to time. Material changes will
          be reflected by updating the "Last updated" date at the top of
          this page.
        </p>
      </section>

      <section id="contact" class="notice-section">
        <h2>9. Contact us</h2>
        <p>
          Questions about this notice or your data? Reach out via our
          <NuxtLink to="/contact" class="inline-link">contact page</NuxtLink>.
        </p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
const lastUpdated = 'July 6, 2026'

const sections = [
  { id: 'data-we-collect', title: 'Data we collect' },
  { id: 'how-we-use-it', title: 'How we use your data' },
  { id: 'legal-basis', title: 'Legal basis' },
  { id: 'sharing', title: 'How we share data' },
  { id: 'retention', title: 'Data retention' },
  { id: 'your-rights', title: 'Your rights' },
  { id: 'cookies', title: 'Cookies' },
  { id: 'changes', title: 'Changes' },
  { id: 'contact', title: 'Contact us' },
]

useHead({
  title: 'Privacy Notice — Fraud Radar NG',
  meta: [
    {
      name: 'description',
      content:
        'How Fraud Radar NG collects, uses, and protects your personal data.',
    },
  ],
})
</script>

<style scoped>
.privacy-page {
  min-height: 100vh;
  padding: 4rem 1.5rem 6rem;
  background: var(--bg);
  color: var(--text-1);
}

.privacy-container {
  max-width: 42rem;
  margin: 0 auto;
}

.eyebrow {
  font-family: var(--mono);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);
  margin: 0 0 0.75rem;
}

.page-title {
  font-family: var(--serif);
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--text-1);
  margin: 0 0 0.5rem;
  line-height: 1.1;
}

.last-updated {
  font-family: var(--mono);
  font-size: 0.85rem;
  color: var(--text-3);
  margin: 0 0 2rem;
}

.intro {
  font-size: 1.05rem;
  line-height: 1.65;
  color: var(--text-2);
  margin: 0 0 2.5rem;
}

.toc {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  padding: 1.25rem 1.5rem;
  border: 1px solid var(--border);
  border-radius: var(--radius, 0.75rem);
  background: var(--surface);
  margin: 0 0 3rem;
}

.toc-link {
  font-family: var(--mono);
  font-size: 0.85rem;
  color: var(--text-3);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: color 0.15s ease, border-color 0.15s ease;
}

.toc-link:hover {
  color: var(--accent);
  border-color: currentColor;
}

.notice-section {
  padding: 2rem 0;
  border-top: 1px solid var(--border);
  scroll-margin-top: 2rem;
}

.notice-section:first-of-type {
  border-top: none;
}

.notice-section h2 {
  font-family: var(--serif);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-1);
  margin: 0 0 1rem;
  letter-spacing: -0.01em;
}

.notice-section p {
  font-size: 0.98rem;
  line-height: 1.7;
  color: var(--text-2);
  margin: 0 0 1rem;
}

.notice-section p:last-child {
  margin-bottom: 0;
}

.notice-section ul {
  margin: 0 0 1rem;
  padding-left: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.notice-section li {
  font-size: 0.98rem;
  line-height: 1.6;
  color: var(--text-2);
}

.notice-section ul:last-child {
  margin-bottom: 0;
}

.inline-link {
  color: var(--accent);
  text-decoration: underline;
}

@media (max-width: 480px) {
  .page-title {
    font-size: 2rem;
  }
  .toc {
    padding: 1rem;
  }
}
</style>