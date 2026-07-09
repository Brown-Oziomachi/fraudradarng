<script setup lang="ts">
useHead({
  title: 'Terms & Conditions — Fraud Radar NG',
  meta: [{ name: 'description', content: 'The terms governing use of Fraud Radar NG.' }],
})

const lastUpdated = 'July 6, 2026'

const sections = [
  { id: 'acceptance', title: 'Acceptance of terms' },
  { id: 'what-we-are', title: 'What Fraud Radar NG is \u2014 and isn\u2019t' },
  { id: 'user-content', title: 'Reports and user-submitted content' },
  { id: 'no-verification', title: 'No verification of reports' },
  { id: 'prohibited-conduct', title: 'Prohibited conduct' },
  { id: 'removal', title: 'Flagging and removal of content' },
  { id: 'liability', title: 'Limitation of liability' },
  { id: 'indemnification', title: 'Indemnification' },
  { id: 'intellectual-property', title: 'Intellectual property' },
  { id: 'changes', title: 'Changes to these terms' },
  { id: 'governing-law', title: 'Governing law' },
  { id: 'contact', title: 'Contact us' },
]
</script>

<template>
  <div class="page-shell">
    <div class="page-container">
      <p class="eyebrow">Legal</p>
      <h1 class="page-title">Terms &amp; Conditions</h1>
      <p class="last-updated">Last updated: {{ lastUpdated }}</p>

      <p class="intro">
        These terms govern your use of Fraud Radar NG. By accessing or using
        this platform \u2014 including submitting a report, subscribing to
        alerts, or browsing reports \u2014 you agree to be bound by them. If you
        do not agree, please do not use this platform.
      </p>

      <nav class="toc" aria-label="Table of contents">
        <a v-for="section in sections" :key="section.id" :href="`#${section.id}`" class="toc-link">
          {{ section.title }}
        </a>
      </nav>

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
        <h2>2. What Fraud Radar NG is \u2014 and isn\u2019t</h2>
        <p>
          Fraud Radar NG is an independent, community-powered fraud
          awareness platform. We are not a bank, a law enforcement agency, a
          financial regulator, or a government body of any kind, and we do
          not have the authority to investigate crimes, freeze funds,
          recover money, or take legal action on anyone\u2019s behalf.
        </p>
        <p>
          If you have been defrauded, this platform is a tool for warning
          others \u2014 it is not a substitute for reporting to your bank, the
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
          are published. Reports reflect the submitter\u2019s account of events
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
          <li>Attempt to disrupt, scrape at scale, or interfere with the platform\u2019s normal operation.</li>
          <li>Use the platform to collect personal data about other users or report subjects for any purpose outside its stated fraud-awareness function.</li>
        </ul>
        <p>
          Violation of these rules may result in content removal, account
          restriction, or reporting to the appropriate authorities where the
          conduct itself may be unlawful.
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
          flagged report will be reviewed within a specific timeframe.
        </p>
      </section>

      <section id="liability" class="terms-section">
        <h2>7. Limitation of liability</h2>
        <p>
          Fraud Radar NG is provided on an "as is" and "as available" basis.
          To the fullest extent permitted by law, we disclaim all
          warranties regarding the accuracy, completeness, or reliability
          of any report or content on the platform. We are not liable for
          any loss, damage, or harm \u2014 financial or otherwise \u2014 arising from
          your reliance on any report, your decision to send or withhold
          money based on content found here, or any dispute between users
          and individuals or businesses named in reports.
        </p>
      </section>

      <section id="indemnification" class="terms-section">
        <h2>8. Indemnification</h2>
        <p>
          You agree to indemnify and hold Fraud Radar NG, its operator, and
          affiliates harmless from any claim, liability, damage, or expense
          \u2014 including reasonable legal fees \u2014 arising from content you
          submit, your violation of these terms, or your violation of any
          law or the rights of a third party.
        </p>
      </section>

      <section id="intellectual-property" class="terms-section">
        <h2>9. Intellectual property</h2>
        <p>
          The Fraud Radar NG name, logo, design, and platform code are the
          property of their owner and may not be copied, reproduced, or
          used without permission. Content you submit remains subject to
          the license described in Section 3, but you retain the right to
          request removal of your own submitted content by contacting us.
        </p>
      </section>

      <section id="changes" class="terms-section">
        <h2>10. Changes to these terms</h2>
        <p>
          We may revise these terms as the platform evolves. Material
          changes will be reflected by updating the "Last updated" date at
          the top of this page. Continuing to use Fraud Radar NG after
          changes are posted constitutes your acceptance of the revised
          terms.
        </p>
      </section>

      <section id="governing-law" class="terms-section">
        <h2>11. Governing law</h2>
        <p>
          These terms are governed by the laws of the Federal Republic of
          Nigeria. Any dispute arising from your use of this platform will
          be subject to the exclusive jurisdiction of Nigerian courts.
        </p>
      </section>

      <section id="contact" class="terms-section">
        <h2>12. Contact us</h2>
        <p>
          Questions about these terms? Reach out via our
          <NuxtLink to="/contact" class="inline-link">contact page</NuxtLink>.
        </p>
      </section>
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
  margin: 0 0 2.5rem;
}

.toc {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  padding: 1.25rem 1.5rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  margin: 0 0 3rem;
}
.toc-link {
  font-family: var(--mono);
  font-size: 0.8rem;
  color: var(--text-3);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: color 0.15s ease, border-color 0.15s ease;
}
.toc-link:hover {
  color: var(--accent);
  border-color: currentColor;
}

.terms-section {
  padding: 2rem 0;
  border-top: 1px solid var(--border);
  scroll-margin-top: 2rem;
}
.terms-section:first-of-type { border-top: none; }

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
  .toc { padding: 1rem; }
}
</style>