<script setup lang="ts">
useHead({
  title: 'Disclaimer — Fraud Radar NG',
  meta: [
    {
      name: 'description',
      content: 'Fraud Radar NG is an independent, community-driven platform and is not affiliated with any Nigerian government agency, the Police, the EFCC, or the CBN.'
    }
  ]
})
</script>

<template>
  <div class="disclaimer-page">
    <div class="disclaimer-bg" aria-hidden="true" />

    <div class="disclaimer-content">
      <section class="disclaimer-hero">
        <div class="hero-panel">
          <p class="hero-eyebrow"><span class="dot" /> Legal</p>
          <h1 class="hero-title">Who we are —<br />and who we're not.</h1>
        </div>
      </section>

      <GovernmentDisclaimer variant="full" />
    </div>
  </div>
</template>

<style scoped>
.disclaimer-page {
  position: relative;
  isolation: isolate;
  padding-bottom: 80px;
}

/* Fixed, full-viewport background — z-index:0 (not -1) so it can't get
   pulled into the same stacking layer as content on browsers that don't
   give unpositioned siblings their own context (notably mobile Safari). */
.disclaimer-bg {
  position: absolute;
  /* was: fixed */
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
  background-image:
    linear-gradient(color-mix(in srgb, var(--bg) 85%, transparent),
      color-mix(in srgb, var(--bg) 90%, transparent)),
    url('/def.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
.disclaimer-content {
  position: relative;
  z-index: 1;
}

.disclaimer-hero {
  max-width: 920px;
  margin: 0 auto;
  padding: 64px 24px 40px;
}

.hero-panel {
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 40px;
}

.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--mono, monospace);
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-2);
  margin-bottom: 16px;
}

.dot {
  width: 6px;
  height: 6px;
  background: var(--accent, #dc3333);
  border-radius: 50%;
}

.hero-title {
  font-family: var(--serif, serif);
  font-size: clamp(34px, 5vw, 84px);
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--text-1, #111);
}

@media (max-width: 640px) {
  .disclaimer-hero {
    padding: 40px 20px 24px;
  }

  .hero-panel {
    padding: 24px 20px;
  }
}
</style>