<script setup lang="ts">
definePageMeta({
  hideFooter: true,
        })

useHead({
  title: 'Page not found — Fraud Radar NG'
})

function goHome() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="error-page">
    
    <section class="hero hero--center">
      <div class="hero-image-wrap">
        <img src="/error.png" alt="Page not found" class="hero-image" />
      </div>
    </section>

    <section class="hero-content">
      <p class="hero-eyebrow">
        <span class="dot" /> 404
      </p>
      <h1 class="hero-title">
        Off the Radar
      </h1>
      <p class="hero-sub">
        This page didn't ping back — it might have moved, changed its identity, or never existed at all. Sounds a little suspicious, doesn't it?
        Let's get you back to safety.
      </p>
    </section>

    <section class="error-actions-section">
      <div class="error-actions-inner">
        <button type="button" class="btn-primary" @click="goHome">
          Back to home
        </button>
        <NuxtLink to="/reports" class="btn-secondary">Browse reports</NuxtLink>
        <NuxtLink to="/report/new" class="btn-secondary">Report a scam</NuxtLink>
      </div>
    </section>

  </div>
</template>

<style scoped>
.error-page { width: 100%; min-height: 50vh; display: flex; flex-direction: column; }

.hero {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 24px 24px 0;
}

.hero-image-wrap {
  width: 100%;
  max-width: 900px;
  aspect-ratio: 4 / 3;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

@media (min-width: 768px) {
  .hero {
    min-height: 55vh;
    padding: 40px 40px 0;
  }
  .hero-image-wrap {
    aspect-ratio: 16 / 9;
    max-width: 1100px;
  }
}

.hero-content {
  position: relative;
  z-index: 1;
  padding: 0 24px;
  max-width: 640px;
  margin: 0 auto;
  text-align: center;
}
.hero-eyebrow { display: inline-flex; align-items: center; gap: 8px; font-family: var(--mono); font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent); margin-bottom: 20px; }
.dot { width: 6px; height: 6px; background: var(--accent); border-radius: 50%; }
.hero-title { font-family: var(--serif); font-size: clamp(28px, 5vw, 48px); line-height: 1.15; letter-spacing: -0.02em;  margin-bottom: 20px; }
.hero-sub { font-size: clamp(14px, 1.6vw, 16px); line-height: 1.65; font-weight: 300;  max-width: 480px; margin: 0 auto; }

.error-actions-section { flex: 1; display: flex; align-items: center; justify-content: center; padding: 56px 24px; }
.error-actions-inner { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }
.btn-primary { display: inline-flex; align-items: center; background: var(--accent); color: #0a0a0b; font-weight: 600; font-family: var(--mono); font-size: 12px; letter-spacing: 0.04em; padding: 14px 24px; border-radius: var(--radius); border: none; cursor: pointer; text-decoration: none; transition: background 0.15s; }
.btn-primary:hover { background: #d4eb3c; }
.btn-secondary { display: inline-flex; align-items: center; font-family: var(--mono); font-size: 12px; letter-spacing: 0.04em; color: var(--text-2); background: none; border: 1px solid var(--border-hi); border-radius: var(--radius); padding: 14px 20px; cursor: pointer; text-decoration: none; transition: border-color 0.15s, color 0.15s; }
.btn-secondary:hover { border-color: var(--accent); color: var(--text-1); }
</style>