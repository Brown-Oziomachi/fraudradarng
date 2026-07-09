<script setup lang="ts">
useHead({
  title: 'Vision & Mission — Fraud Radar NG',
  meta: [
    {
      name: 'description',
      content: 'The vision and mission behind Fraud Radar NG — Nigeria\'s community-powered fraud detection and awareness platform.',
    },
  ],
})

const branches = [
  {
    label: 'Verify Before You Trust',
    leaves: ['Search before sending money', 'Search before answering a call', 'Search before a job offer'],
  },
  {
    label: 'Instant Public Warning',
    leaves: ['Live on the homepage', 'Added to the reports directory', 'Indexed in search'],
  },
  {
    label: 'Community Sharing',
    leaves: ['Shared in WhatsApp groups', 'Posted on social media', 'Passed by word of mouth'],
  },
  {
    label: 'Pattern Tracking',
    leaves: ['Linked accounts flagged', 'Similar scams grouped together', 'Repeat offender profile grows'],
  },
  {
    label: 'People Protected',
    leaves: ['Family & friends warned', 'Strangers warned', 'Future victims avoided'],
  },
]
</script>

<template>
  <div class="page-shell">
    <div class="page-container">
      <h1 class="page-title">Vision &amp; Mission Statement</h1>
      <div class="divider" />

      <section class="statement-block">
        <h2 class="block-heading">Our Vision</h2>
        <p class="block-body">
          To be Nigeria's most trusted community radar for fraud —
          <mark class="highlight">a place where a warning reaches someone
          before their money leaves their account</mark>, not after. We
          want checking a name, number, or account before you trust it to
          become as ordinary as checking a price before you buy.
        </p>
      </section>

      <div class="divider" />

      <section class="statement-block">
        <h2 class="block-heading">Mission Statement</h2>
        <p class="block-body">
          To protect Nigerians from fraud by giving every person a free,
          instant way to report and search suspicious bank accounts,
          companies, and websites — turning individual experiences into a
          shared, growing defense that gets stronger every time someone
          chooses to speak up instead of staying silent.
          <mark class="highlight">No report is too small, and no warning
          comes too late for the next person searching that name.</mark>
        </p>
      </section>

      <div class="divider" />

     
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
  max-width: 1100px;
  margin: 0 auto;
}

.page-title {
  font-family: var(--serif);
  font-weight: 700;
  font-size: clamp(30px, 4.5vw, 44px);
  letter-spacing: -0.01em;
  color: var(--text-1);
  margin: 0 0 1.75rem;
  line-height: 1.15;
}

.divider {
  height: 1px;
  background: var(--accent);
  opacity: 0.6;
  margin: 1.75rem 0;
}

.statement-block {
  padding: 0.5rem 0;
}

.block-heading {
  font-family: var(--serif);
  font-size: clamp(20px, 2.6vw, 26px);
  font-weight: 600;
  color: var(--text-1);
  margin-bottom: 1rem;
}

.block-body {
  font-size: 15px;
  line-height: 1.85;
  color: var(--text-2);
  font-weight: 300;
  max-width: 760px;
  margin-bottom: 1rem;
}

.highlight {
  background: none;
  color: var(--text-1);
  font-weight: 500;
  padding: 0 2px;
  background-image: linear-gradient(
    color-mix(in srgb, var(--accent) 30%, transparent),
    color-mix(in srgb, var(--accent) 30%, transparent)
  );
  background-repeat: no-repeat;
  background-position: 0 100%;
  background-size: 100% 40%;
}

/* ============ ORG-CHART FLOW (matches EFCC-style reference) ============ */
.chart-scroll {
  overflow-x: auto;
  padding: 24px 8px 40px;
  -webkit-overflow-scrolling: touch;
}

.scroll-hint {
  display: none;
  text-align: center;
  font-family: var(--mono);
  font-size: 11px;
  color: var(--text-3);
  margin-top: -8px;
}

.org-tree,
.org-tree ul {
  list-style: none;
  margin: 0;
  padding: 0;
  position: relative;
  display: flex;
  justify-content: center;
}

.org-tree ul {
  padding-top: 36px;
}

.org-tree li {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  list-style-type: none;
  position: relative;
  padding: 36px 10px 0;
}

.org-tree li::before,
.org-tree li::after {
  content: '';
  position: absolute;
  top: 0;
  right: 50%;
  width: 50%;
  height: 36px;
  border-top: 1.5px solid var(--border-hi);
}
.org-tree li::after {
  right: auto;
  left: 50%;
  border-left: 1.5px solid var(--border-hi);
}
.org-tree li:only-child::before,
.org-tree li:only-child::after {
  display: none;
}
.org-tree li:only-child {
  padding-top: 0;
}
.org-tree li:first-child::before,
.org-tree li:last-child::after {
  border: 0 none;
}
.org-tree li:last-child::before {
  border-right: 1.5px solid var(--border-hi);
  border-radius: 0 6px 0 0;
}
.org-tree li:first-child::after {
  border-radius: 6px 0 0 0;
}
.org-tree ul::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  width: 0;
  height: 36px;
  border-left: 1.5px solid var(--border-hi);
}

.node {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 150px;
  padding: 14px 18px;
  border-radius: 4px;
  font-family: var(--sans, var(--mono));
  font-size: 13px;
  font-weight: 700;
  line-height: 1.35;
  color: #fff;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.25);
  white-space: normal;
}

.node-top,
.node-mid,
.node-branch,
.node-leaf {
  background: #e11d2e;
}

.node-top { min-width: 170px; }
.node-mid { min-width: 240px; }
.node-branch { min-width: 170px; }
.node-leaf {
  min-width: 150px;
  max-width: 170px;
  font-weight: 600;
  font-size: 12.5px;
}

@media (max-width: 900px) {
  .chart-scroll {
    display: flex;
    justify-content: flex-start;
  }
  .scroll-hint { display: block; }
  .node { font-size: 12px; padding: 12px 14px; min-width: 130px; }
  .node-mid { min-width: 200px; }
  .node-leaf { max-width: 140px; }
}
</style>