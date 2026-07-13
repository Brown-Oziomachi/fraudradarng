<script setup lang="ts">
useHead({
  title: 'Terms & Conditions — Fraud Radar NG',
  meta: [{ name: 'description', content: 'The terms governing use of Fraud Radar NG.' }],
})

const lastUpdated = 'July 13, 2026'

const sections = [
  { id: 'acceptance', title: 'Acceptance of terms' },
  { id: 'what-we-are', title: 'What Fraud Radar NG is \u2014 and isn\u2019t' },
  { id: 'user-content', title: 'Reports and user-submitted content' },
  { id: 'no-verification', title: 'No verification of reports' },
  { id: 'prohibited-conduct', title: 'Prohibited conduct' },
  { id: 'removal', title: 'Flagging and removal of content' },
  { id: 'named-disputes', title: 'Disputes by named parties' },
  { id: 'law-enforcement', title: 'Law enforcement and legal process' },
  { id: 'liability', title: 'Limitation of liability' },
  { id: 'indemnification', title: 'Indemnification' },
  { id: 'intellectual-property', title: 'Intellectual property' },
  { id: 'severability', title: 'Severability and entire agreement' },
  { id: 'changes', title: 'Changes to these terms' },
  { id: 'governing-law', title: 'Governing law' },
  { id: 'contact', title: 'Contact us' },
]

const tocOpen = ref(false)
function closeToc() {
  tocOpen.value = false
}
</script>

<template>
  <div class="page-shell">
    <div class="page-container">
      <p class="eyebrow">Legal</p>
      <h1 class="page-title">Terms &amp; Conditions</h1>
      <p class="last-updated">Last updated: {{ lastUpdated }}</p>

      <p class="intro">
        These terms govern your use of Fraud Radar NG. By accessing or using
        this platform — including submitting a report, subscribing to
        alerts, or browsing reports — you agree to be bound by them. If you
        do not agree, please do not use this platform.
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

      <!-- Body grid: sidebar (desktop only, via CSS) + content -->
      <div class="body-grid">
        <!-- DESKTOP: sticky sidebar TOC -->
        <nav class="toc-desktop" aria-label="Table of contents">
          <span class="toc-desktop-label">Contents</span>
          <a v-for="(section, i) in sections" :key="section.id" :href="`#${section.id}`" class="toc-desktop-link">
            <span class="toc-desktop-num">{{ String(i + 1).padStart(2, '0') }}</span>{{ section.title }}
          </a>
        </nav>

        <div class="content-col">
          <section id="acceptance" class="terms-section">
            <h2>1. Acceptance of terms</h2>
            <p>
              By using Fraud Radar NG in any capacity, you confirm that you are
              at least 18 years old, or using the platform with the involvement
              of a parent or guardian, and that you agree to these terms and our
              <NuxtLink to="/privacy-notice" class="inline-link">Privacy Notice</NuxtLink>.
              We may update these terms from time to time, and continued use of
              the platform after changes take effect constitutes acceptance of
              the revised terms.
            </p>
          </section>

          <section id="what-we-are" class="terms-section">
            <h2>2. What Fraud Radar NG is — and isn't</h2>
            <p>
              Fraud Radar NG is an independent, community-powered fraud
              awareness platform. We are not a bank, a law enforcement agency, a
              financial regulator, or a government body of any kind, and we do
              not have the authority to investigate crimes, freeze funds,
              recover money, or take legal action on anyone's behalf.
            </p>
            <p>
              If you have been defrauded, this platform is a tool for warning
              others — it is not a substitute for reporting to your bank, the
              EFCC, the Nigeria Police Force, or any other appropriate
              authority. See our
              <NuxtLink to="/help" class="inline-link">Help &amp; Reporting</NuxtLink>
              page for official channels.
            </p>
          </section>

          <section id="user-content" class="terms-section">
            <h2>3. Reports and user-submitted content</h2>
            <p>
              When you submit a report, you are publishing content that will be
              publicly visible on this platform, associated with the account,
              number, or entity you name. You retain ownership of what you
              submit, but by submitting it you grant Fraud Radar NG a
              worldwide, royalty-free license to host, display, distribute, and
              reproduce that content as part of operating the platform.
            </p>
            <p>By submitting a report, you confirm that:</p>
            <ul>
              <li>The report is based on your own direct experience or firsthand evidence, to the best of your knowledge.</li>
              <li>You have not submitted the report out of personal dispute, rumor, or malice unrelated to actual fraud.</li>
              <li>You understand the report will be public and may affect a real person or business named in it.</li>
            </ul>
          </section>

          <section id="no-verification" class="terms-section">
            <h2>4. No verification of reports</h2>
            <p>
              Fraud Radar NG does not independently verify reports before they
              are published. Reports reflect the submitter's account of events
              and should be treated as unverified, individual claims rather than
              proven fact. We encourage every user to exercise independent
              judgment and to seek corroborating evidence before relying on any
              single report.
            </p>
          </section>

          <section id="prohibited-conduct" class="terms-section">
            <h2>5. Prohibited conduct</h2>
            <p>You agree not to use Fraud Radar NG to:</p>
            <ul>
              <li>Submit a report you know to be false, exaggerated, or fabricated.</li>
              <li>Target an individual or business out of personal dispute, competition, or harassment rather than genuine fraud concerns.</li>
              <li>Post content that is defamatory, obscene, threatening, or that violates the rights of others.</li>
              <li>Attempt to disrupt, scrape at scale, or interfere with the platform's normal operation.</li>
              <li>Use the platform to collect personal data about other users or report subjects for any purpose outside its stated fraud-awareness function.</li>
            </ul>
            <p>
              Violation of these rules may result in content removal, account
              or device restriction, or reporting to the appropriate authorities
              where the conduct itself may be unlawful.
            </p>
          </section>

          <section id="removal" class="terms-section">
            <h2>6. Flagging and removal of content</h2>
            <p>
              Any user can flag a report they believe is inaccurate, malicious,
              or in violation of these terms. We reserve the right, at our
              discretion, to review, edit, or remove any content that violates
              these terms or that we reasonably believe exposes the platform or
              another party to legal risk. We do not guarantee that every
              flagged report will be reviewed within a specific timeframe,
              though we aim to review flags from named parties (see Section 7)
              within 5–7 business days.
            </p>
            <p>
              Where a report is disputed and found to be inaccurate, we may
              correct or annotate the report to reflect that outcome rather
              than silently deleting it, so the public record remains honest
              about what was claimed and what was found.
            </p>
          </section>

          <section id="named-disputes" class="terms-section">
            <h2>7. Disputes by named parties</h2>
            <p>
              If you are the individual or business named in a report and
              believe it is false, outdated, or defamatory, you may submit a
              dispute through our
              <NuxtLink to="/flag/report" class="inline-link">dispute page</NuxtLink>.
              We review disputes submitted by named parties with priority over
              general accuracy flags. While a dispute is under review, we may
              temporarily restrict a report's visibility, add a note indicating
              it is disputed, or remove it, depending on the credibility of the
              claim and the evidence provided.
            </p>
            <p>
              Submitting a dispute does not guarantee removal. Reports
              supported by corroborating evidence or multiple independent
              submissions may remain published, with the dispute and our
              findings noted alongside it.
            </p>
          </section>

          <section id="law-enforcement" class="terms-section">
            <h2>8. Law enforcement and legal process</h2>
            <p>
              Where a report describes conduct that may constitute a criminal
              offence, we reserve the right to preserve relevant submission
              data — including technical identifiers described in our
              <NuxtLink to="/privacy-notice" class="inline-link">Privacy Notice</NuxtLink>
              — and to share it with the EFCC, the Nigeria Police Force, or
              another appropriate authority, independent of any request from
              the person who submitted the report. We may also disclose
              information where required by a valid court order or other legal
              process.
            </p>
          </section>

          <section id="liability" class="terms-section">
            <h2>9. Limitation of liability</h2>
            <p>
              Fraud Radar NG is provided on an "as is" and "as available" basis.
              To the fullest extent permitted by law, we disclaim all
              warranties regarding the accuracy, completeness, or reliability
              of any report or content on the platform. We are not liable for
              any loss, damage, or harm — financial or otherwise — arising from
              your reliance on any report, your decision to send or withhold
              money based on content found here, or any dispute between users
              and individuals or businesses named in reports.
            </p>
          </section>

          <section id="indemnification" class="terms-section">
            <h2>10. Indemnification</h2>
            <p>
              You agree to indemnify and hold Fraud Radar NG, its operator, and
              affiliates harmless from any claim, liability, damage, or expense
              — including reasonable legal fees — arising from content you
              submit, your violation of these terms, or your violation of any
              law or the rights of a third party.
            </p>
          </section>

          <section id="intellectual-property" class="terms-section">
            <h2>11. Intellectual property</h2>
            <p>
              The Fraud Radar NG name, logo, design, and platform code are the
              property of their owner and may not be copied, reproduced, or
              used without permission. Content you submit remains subject to
              the license described in Section 3, but you retain the right to
              request removal of your own submitted content by contacting us.
            </p>
          </section>

          <section id="severability" class="terms-section">
            <h2>12. Severability and entire agreement</h2>
            <p>
              If any provision of these terms is found to be unenforceable or
              invalid under applicable law, that provision will be limited or
              removed to the minimum extent necessary, and the remaining
              provisions will continue in full force and effect. These terms,
              together with our Privacy Notice, constitute the entire agreement
              between you and Fraud Radar NG regarding your use of the
              platform.
            </p>
          </section>

          <section id="changes" class="terms-section">
            <h2>13. Changes to these terms</h2>
            <p>
              We may revise these terms as the platform evolves. Material
              changes will be reflected by updating the "Last updated" date at
              the top of this page. Continuing to use Fraud Radar NG after
              changes are posted constitutes your acceptance of the revised
              terms.
            </p>
          </section>

          <section id="governing-law" class="terms-section">
            <h2>14. Governing law</h2>
            <p>
              These terms are governed by the laws of the Federal Republic of
              Nigeria. Any dispute arising from your use of this platform will
              be subject to the exclusive jurisdiction of Nigerian courts.
            </p>
          </section>

          <section id="contact" class="terms-section">
            <h2>15. Contact us</h2>
            <p>
              Questions about these terms? Reach out via our
              <NuxtLink to="/contact" class="inline-link">contact page</NuxtLink>.
            </p>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-shell {
  min-height: 100vh;
  padding: 4rem 1.5rem 6rem;
  background: var(--bg);
  color: var(--text-1);
}

.page-container {
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
  font-weight: 700;
  letter-spacing: -0.02em;
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
  font-size: 1.02rem;
  line-height: 1.7;
  color: var(--text-2);
  font-weight: 300;
  margin: 0 0 2rem;
  max-width: 42rem;
}

/* ============ MOBILE/TABLET: collapsible jump menu ============ */
.toc-mobile {
  display: block;
  border: 1px solid var(--border);
  border-radius: var(--radius);
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
.body-grid {
  display: block;
}

.content-col {
  min-width: 0;
}

/* ============ DESKTOP: sticky sidebar TOC ============ */
.toc-desktop {
  display: none;
}

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

.terms-section {
  padding: 2rem 0;
  border-top: 1px solid var(--border);
  scroll-margin-top: 2rem;
}
.terms-section:first-of-type { border-top: none; padding-top: 0; }

.terms-section h2 {
  font-family: var(--serif);
  font-size: 1.2rem;
  color: var(--text-1);
  font-weight: 700;
  margin: 0 0 1rem;
}
.terms-section p {
  font-size: 0.95rem;
  line-height: 1.75;
  color: var(--text-2);
  font-weight: 300;
  margin: 0 0 1rem;
}
.terms-section p:last-child { margin-bottom: 0; }

.terms-section ul {
  margin: 0 0 1rem;
  padding-left: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.terms-section li {
  font-size: 0.95rem;
  line-height: 1.65;
  color: var(--text-2);
  font-weight: 300;
}
.terms-section ul:last-child { margin-bottom: 0; }

.inline-link {
  color: var(--text-1);
  text-decoration: underline;
}
.inline-link:hover { color: var(--accent); }

@media (max-width: 480px) {
  .page-title { font-size: 2rem; }
}
</style>