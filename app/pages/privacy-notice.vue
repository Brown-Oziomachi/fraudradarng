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

      <!-- MOBILE / TABLET: collapsible jump-to-section dropdown -->
      <details class="toc-mobile" :open="tocOpen" @toggle="tocOpen = $event.target.open">
        <summary class="toc-mobile-summary">
          <span>Jump to a section</span>
          <svg class="toc-mobile-chevron" viewBox="0 0 24 24" width="14" height="14" fill="none">
            <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </summary>
        <nav class="toc-mobile-list" aria-label="Table of contents">
          <a
            v-for="(section, i) in sections"
            :key="section.id"
            :href="`#${section.id}`"
            class="toc-mobile-link"
            @click="closeToc"
          >
            <span class="toc-mobile-num">{{ i + 1 }}</span>{{ section.title }}
          </a>
        </nav>
      </details>

      <div class="body-grid">
        <!-- DESKTOP: sticky sidebar TOC -->
        <nav class="toc-desktop" aria-label="Table of contents">
          <span class="toc-desktop-label">Contents</span>
          <a v-for="(section, i) in sections" :key="section.id" :href="`#${section.id}`" class="toc-desktop-link">
            <span class="toc-desktop-num">{{ String(i + 1).padStart(2, '0') }}</span>{{ section.title }}
          </a>
        </nav>

        <div class="content-col">
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
              <li>
                <strong>Anonymized abuse-detection identifiers</strong> — we
                generate cryptographically hashed identifiers derived from your
                device and network (such as a salted combination of your IP
                address and browser signature) solely to detect repeated or
                coordinated abuse of the reporting system, such as one person
                submitting many false reports. These identifiers cannot be
                reversed to reveal your IP address or identity under normal
                circumstances.
              </li>
              <li>
                <strong>Security incident data</strong> — if our systems detect
                a serious security event (for example, an attempt to submit
                malicious code or systematically abuse the platform), we may
                temporarily retain unhashed technical data — such as your raw
                IP address and browser signature at the time of the event —
                strictly for security investigation and potential referral to
                law enforcement. This is not done for ordinary use of the site.
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
              <li>To investigate and, where appropriate, refer serious security incidents to law enforcement.</li>
            </ul>
          </section>

          <section id="legal-basis" class="notice-section">
            <h2>3. Legal basis for processing</h2>
            <p>
              We process your data on the basis of your consent (for example,
              when you subscribe to email alerts), our legitimate interest in
              operating a fraud-awareness platform and keeping it secure from
              abuse, and, where relevant, to comply with legal obligations.
            </p>
          </section>

          <section id="third-party-data" class="notice-section">
            <h2>4. Data about people named in reports</h2>
            <p>
              Reports often contain personal data about individuals or
              businesses who did not submit the report themselves — the
              person or entity being reported, such as their name, phone
              number, or bank account details. We process this data on the
              basis of legitimate interest in fraud prevention and public
              safety, balanced against the rights of the named party.
            </p>
            <p>
              If you are named in a report and believe it is inaccurate or
              unfair, you have the right to dispute it. See our
              <NuxtLink to="/terms" class="inline-link">Terms &amp; Conditions</NuxtLink>
              for how disputes from named parties are handled.
            </p>
          </section>

          <section id="sharing" class="notice-section">
            <h2>5. How we share data</h2>
            <p>
              Report content you submit may be made publicly visible on the
              platform, since the purpose of Fraud Radar NG is to warn others.
              We do not sell personal data. We may share limited data with:
            </p>
            <ul>
              <li>Service providers who host our infrastructure and database.</li>
              <li>Email delivery providers, to send alerts you've subscribed to.</li>
              <li>Law enforcement or regulators, where required by law or where a report indicates possible criminal conduct.</li>
            </ul>
          </section>

          <section id="international-transfer" class="notice-section">
            <h2>6. International data transfers</h2>
            <p>
              Some of our infrastructure providers (including cloud hosting and
              database services) may store or process data outside Nigeria.
              Where this occurs, we take reasonable steps to ensure your data
              receives a standard of protection consistent with Nigeria's Data
              Protection Act, including relying on providers with recognized
              international security and privacy certifications.
            </p>
          </section>

          <section id="retention" class="notice-section">
            <h2>7. Data retention</h2>
            <ul>
              <li>Published reports are retained indefinitely to preserve the public fraud record, unless successfully disputed and removed or edited.</li>
              <li>Incomplete or abandoned draft submissions are deleted after 30 days.</li>
              <li>Security and abuse-detection logs are retained for up to 2 years, consistent with data retention expectations under Nigeria's Cybercrimes Act.</li>
              <li>Contact form messages and subscriber emails are retained until you ask us to remove them or unsubscribe.</li>
            </ul>
          </section>

          <section id="your-rights" class="notice-section">
            <h2>8. Your rights</h2>
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
            <h2>9. Cookies and device identifiers</h2>
            <p>
              We use minimal cookies necessary for the site to function, such
              as remembering your theme preference. We also set a long-lived
              cookie that helps us recognize repeat submissions from the same
              device, used specifically to detect abuse of the reporting
              system (for example, someone attempting to evade a restriction
              placed on their account by clearing browser data). This cookie
              does not identify you personally, does not track you across
              other websites, and is never used for advertising.
            </p>
          </section>

          <section id="changes" class="notice-section">
            <h2>10. Changes to this notice</h2>
            <p>
              We may update this notice from time to time. Material changes will
              be reflected by updating the "Last updated" date at the top of
              this page.
            </p>
          </section>

          <section id="contact" class="notice-section">
            <h2>11. Contact us</h2>
            <p>
              Questions about this notice, or requests relating to your
              personal data? Reach out via our
              <NuxtLink to="/contact" class="inline-link">contact page</NuxtLink>,
              or email us directly at
              <a href="mailto:privacy@fraudradar.ng" class="inline-link">privacy@fraudradar.ng</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const lastUpdated = 'July 13, 2026'

const sections = [
  { id: 'data-we-collect', title: 'Data we collect' },
  { id: 'how-we-use-it', title: 'How we use your data' },
  { id: 'legal-basis', title: 'Legal basis' },
  { id: 'third-party-data', title: 'Data about people named in reports' },
  { id: 'sharing', title: 'How we share data' },
  { id: 'international-transfer', title: 'International transfers' },
  { id: 'retention', title: 'Data retention' },
  { id: 'your-rights', title: 'Your rights' },
  { id: 'cookies', title: 'Cookies and device identifiers' },
  { id: 'changes', title: 'Changes' },
  { id: 'contact', title: 'Contact us' },
]

const tocOpen = ref(false)
function closeToc() {
  tocOpen.value = false
}

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
  max-width: 64rem;
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
  margin: 0 0 2rem;
  max-width: 42rem;
}

/* ============ MOBILE/TABLET: collapsible jump menu ============ */
.toc-mobile {
  display: block;
  border: 1px solid var(--border);
  border-radius: var(--radius, 0.75rem);
  background: var(--surface);
  margin: 0 0 2rem;
  overflow: hidden;
}
.toc-mobile-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem 1.1rem;
  cursor: pointer;
  font-family: var(--mono);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-1);
  list-style: none;
}
.toc-mobile-summary::-webkit-details-marker { display: none; }
.toc-mobile-chevron { color: var(--text-3); transition: transform 0.2s ease; flex-shrink: 0; }
.toc-mobile[open] .toc-mobile-chevron { transform: rotate(180deg); }

.toc-mobile-list {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--border);
  max-height: 320px;
  overflow-y: auto;
}
.toc-mobile-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0.7rem 1.1rem;
  font-size: 0.85rem;
  color: var(--text-2);
  text-decoration: none;
  border-bottom: 1px solid var(--border);
}
.toc-mobile-link:last-child { border-bottom: none; }
.toc-mobile-link:hover { color: var(--accent); background: var(--surface-2, var(--bg)); }
.toc-mobile-num {
  font-family: var(--mono);
  font-size: 0.7rem;
  color: var(--text-3);
  width: 16px;
  flex-shrink: 0;
}

/* ============ Body grid ============ */
.body-grid { display: block; }
.content-col { min-width: 0; }
.toc-desktop { display: none; }

@media (min-width: 1024px) {
  .toc-mobile { display: none; }

  .body-grid {
    display: grid;
    grid-template-columns: 15rem 1fr;
    gap: 3rem;
    align-items: start;
  }

  .toc-desktop {
    display: flex;
    flex-direction: column;
    gap: 2px;
    position: sticky;
    top: 2rem;
    padding: 1.25rem 0.25rem;
    border-right: 1px solid var(--border);
  }
  .toc-desktop-label {
    font-family: var(--mono);
    font-size: 0.7rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-3);
    margin-bottom: 0.75rem;
    padding: 0 0.5rem;
  }
  .toc-desktop-link {
    display: flex;
    align-items: baseline;
    gap: 10px;
    padding: 0.45rem 0.5rem;
    font-size: 0.82rem;
    line-height: 1.4;
    color: var(--text-3);
    text-decoration: none;
    border-radius: 6px;
    transition: color 0.15s ease, background 0.15s ease;
  }
  .toc-desktop-link:hover {
    color: var(--text-1);
    background: var(--surface);
  }
  .toc-desktop-num {
    font-family: var(--mono);
    font-size: 0.68rem;
    color: var(--accent);
    flex-shrink: 0;
  }
}

.notice-section {
  padding: 2rem 0;
  border-top: 1px solid var(--border);
  scroll-margin-top: 2rem;
}
.notice-section:first-of-type { border-top: none; padding-top: 0; }

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
.notice-section p:last-child { margin-bottom: 0; }

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
.notice-section ul:last-child { margin-bottom: 0; }

.inline-link {
  color: var(--accent);
  text-decoration: underline;
}

@media (max-width: 480px) {
  .page-title { font-size: 2rem; }
}
</style>