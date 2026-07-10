<script setup lang="ts">
interface Feature {
  icon: 'shield' | 'radar' | 'community' | 'bell'
  title: string
  copy: string
}

const features: Feature[] = [
  { icon: 'shield', title: 'Verify Instantly', copy: 'Search our database in seconds.' },
  { icon: 'radar', title: 'Powered by Reports', copy: 'Checked against real community reports.' },
  { icon: 'community', title: 'Community Protection', copy: 'Together, we expose scammers and fraudsters.' },
  { icon: 'bell', title: 'Stay Safe', copy: "Don't be the next victim." },
]
</script>

<template>
  <section class="registry-promo">
    <div class="promo-inner">
      <div class="glow-orb" aria-hidden="true" />
      <div class="radar-backdrop" aria-hidden="true">
        <span class="radar-ring" v-for="n in 3" :key="n" :style="{ animationDelay: `${n * 0.6}s` }" />
      </div>

      <header class="promo-header">
        <div class="eyebrow-badge">
          <svg class="badge-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 1.5l6.5 2.6v4.7c0 4.4-2.8 8.3-6.5 9.7-3.7-1.4-6.5-5.3-6.5-9.7V4.1L10 1.5z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>
            <path d="M7 10.2l2.1 2.1L13.3 8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="eyebrow-text">Check Before You Pay</span>
        </div>

        <h2 class="promo-title">
          Search the <span class="accent-word">Threat Registry</span>
        </h2>

        <p class="promo-subtitle">
          Before you send money, click a link, or trust a "seller," check them against every
          fraud report filed on FRNG. Bank accounts, phone numbers, wallet tags, company names,
          and websites — all searchable in seconds.
        </p>

        <NuxtLink to="/lookupSearch" class="cta-btn">
          <svg class="cta-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="9" cy="9" r="6.5" stroke="currentColor" stroke-width="1.4"/>
            <path d="M17 17l-3.2-3.2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
          </svg>
          <span>Search the Registry</span>
          <svg class="cta-arrow" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </NuxtLink>
      </header>

      <div class="feature-row">
        <div v-for="f in features" :key="f.title" class="feature-item">
          <div class="feature-icon-wrap">
            <svg v-if="f.icon === 'shield'" class="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2l7.5 3v5.6c0 5-3.2 9.5-7.5 11-4.3-1.5-7.5-6-7.5-11V5l7.5-3z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
              <path d="M8.5 12.2l2.4 2.4 4.6-4.9" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <svg v-else-if="f.icon === 'radar'" class="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.2" opacity="0.5"/>
              <circle cx="12" cy="12" r="5.5" stroke="currentColor" stroke-width="1.2" opacity="0.7"/>
              <circle cx="12" cy="12" r="1.8" fill="currentColor"/>
              <path d="M12 12l5-3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
            </svg>
            <svg v-else-if="f.icon === 'community'" class="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="8" r="2.4" stroke="currentColor" stroke-width="1.4"/>
              <circle cx="6" cy="9.5" r="1.8" stroke="currentColor" stroke-width="1.3" opacity="0.75"/>
              <circle cx="18" cy="9.5" r="1.8" stroke="currentColor" stroke-width="1.3" opacity="0.75"/>
              <path d="M4.5 18c.6-2.6 2.8-4 5-4M19.5 18c-.6-2.6-2.8-4-5-4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" opacity="0.75"/>
              <path d="M7.5 18.5c.8-3 2.4-4.6 4.5-4.6s3.7 1.6 4.5 4.6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
            </svg>
            <svg v-else class="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 10.5a6 6 0 1112 0c0 3.2 1 4.6 1.8 5.5H4.2c.8-.9 1.8-2.3 1.8-5.5z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
              <path d="M10 18.5a2 2 0 004 0" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
            </svg>
          </div>
          <h3 class="feature-title">{{ f.title }}</h3>
          <p class="feature-copy">{{ f.copy }}</p>
        </div>
      </div>

      <p class="tagline">
        <span class="tagline-dot" />
        One Search. One Report. Many
        <span class="accent-word">Protected.</span>
        <span class="tagline-dot" />
      </p>
    </div>
  </section>
</template>

<style scoped>
.registry-promo {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 4rem 1.25rem;
}

.promo-inner {
  position: relative;
  width: 100%;
  max-width: 920px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius, 20px);
  padding: 3.5rem 2.5rem;
  box-shadow: 0 28px 70px color-mix(in srgb, var(--accent) 8%, transparent),
              0 10px 28px rgba(0, 0, 0, 0.16);
  overflow: hidden;
}
@media (max-width: 640px) {
  .promo-inner { padding: 2.5rem 1.5rem; }
}

/* ============ BACKDROP EFFECTS ============ */
.glow-orb {
  position: absolute;
  top: -160px;
  left: 50%;
  transform: translateX(-50%);
  width: 560px;
  height: 380px;
  background: radial-gradient(
    ellipse at center,
    color-mix(in srgb, var(--accent) 20%, transparent) 0%,
    transparent 70%
  );
  pointer-events: none;
  z-index: 0;
}

.radar-backdrop {
  position: absolute;
  top: -60px;
  left: -60px;
  width: 260px;
  height: 260px;
  pointer-events: none;
  z-index: 0;
  opacity: 0.5;
}

.radar-ring {
  position: absolute;
  inset: 0;
  border: 1px solid color-mix(in srgb, var(--accent) 35%, transparent);
  border-radius: 999px;
  animation: radar-expand 4.5s ease-out infinite;
}

@keyframes radar-expand {
  0% { transform: scale(0.15); opacity: 0.8; }
  100% { transform: scale(1); opacity: 0; }
}

.promo-header,
.feature-row,
.tagline {
  position: relative;
  z-index: 1;
}

/* ============ HEADER ============ */
.promo-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
  margin-bottom: 3rem;
}

.eyebrow-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  border: 1px solid var(--accent-bdr);
  background: var(--accent-dim);
  border-radius: 999px;
  padding: 0.4rem 0.9rem 0.4rem 0.7rem;
}

.badge-icon {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
  color: var(--accent);
}

.eyebrow-text {
  font-family: var(--mono);
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--accent);
}

.promo-title {
  font-family: var(--serif);
  font-size: clamp(1.85rem, 4.5vw, 2.75rem);
  font-weight: 400;
  color: var(--text-1);
  letter-spacing: -0.01em;
  line-height: 1.15;
}

.accent-word {
  color: var(--accent);
}

.promo-subtitle {
  max-width: 38rem;
  font-size: 0.9375rem;
  line-height: 1.65;
  color: var(--text-2);
  font-weight: 300;
}

/* ============ CTA BUTTON ============ */
.cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  margin-top: 0.5rem;
  border-radius: 999px;
  border: 1px solid var(--accent-bdr);
  background: var(--accent);
  padding: 0.95rem 1.75rem;
  font-family: var(--mono);
  font-size: 0.8125rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--accent-contrast, #08120a);
  text-decoration: none;
  box-shadow: 0 8px 22px color-mix(in srgb, var(--accent) 35%, transparent);
  transition: filter 0.15s ease, box-shadow 0.15s ease, transform 0.1s ease;
}

.cta-btn:hover {
  filter: brightness(1.08);
  box-shadow: 0 10px 28px color-mix(in srgb, var(--accent) 45%, transparent);
}

.cta-btn:active {
  transform: translateY(1px);
}

.cta-icon,
.cta-arrow {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}

/* ============ FEATURE ROW ============ */
.feature-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem 1.5rem;
  margin-bottom: 2.5rem;
}
@media (max-width: 720px) {
  .feature-row { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 420px) {
  .feature-row { grid-template-columns: 1fr; }
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.6rem;
}

.feature-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 999px;
  background: var(--accent-dim);
  border: 1px solid var(--accent-bdr);
}

.feature-icon {
  width: 26px;
  height: 26px;
  color: var(--accent);
}

.feature-title {
  font-family: var(--mono);
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--accent);
}

.feature-copy {
  max-width: 15rem;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--text-2);
  font-weight: 300;
}

/* ============ TAGLINE ============ */
.tagline {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border);
  font-family: var(--mono);
  font-size: 0.8125rem;
  color: var(--text-2);
  text-align: center;
}
@media (max-width: 420px) {
  .tagline { flex-wrap: wrap; }
}

.tagline-dot {
  width: 5px;
  height: 5px;
  border-radius: 999px;
  background: var(--accent);
  flex-shrink: 0;
}
</style>