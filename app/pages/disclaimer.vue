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
    <section class="disclaimer-hero">
      <p class="hero-eyebrow"><span class="dot" /> Legal</p>
      <h1 class="hero-title">Who we are —<br />and who we're not.</h1>
    </section>

    <GovernmentDisclaimer variant="full" />
  </div>
</template>

<style scoped>
.disclaimer-page {
  padding: 0 0 80px;
  min-height: 60vh;
}

.disclaimer-hero {
  max-width: 920px;
  margin: 0 auto;
  padding: 64px 24px 40px;
}
.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--mono, monospace);
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent, #dc3333);
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
  font-size: clamp(50px, 5vw, 84px);
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--text-1, #111);
}
</style>