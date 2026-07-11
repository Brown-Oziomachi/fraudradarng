<script setup>
definePageMeta({
  hideFooter: true,
})

useHead({
  title: 'FRNG Intelligence | Threat Data Center',
  meta: [
    {
      name: 'description',
      content: 'Proactive cyber-threat analytics, real-time mule account tracking, and fraud prevention APIs engineered for the Nigerian tech ecosystem.',
    },
  ],
})
</script>

<template>
  <div class="intelligence-page">

    <!-- Banner -->
    <div class="banner-wrap">
      <img
        src="/intell.png"
        alt="FRNG Intelligence — threat data center"
        class="banner-img"
      />
      <div class="banner-gradient"></div>

      <div class="banner-content">
        <div class="status-badge">
          <span class="pulse-dot"></span>
          <span class="badge-text">FRNG INTELLIGENCE CORE </span>
        </div>
    </div>
    </div>

    <div class="intel-container">
      <div class="grid-layout">
        <!-- Left Column: Content Narrative -->
        <div class="content-side">
          <p class="hero-desc">
            Right now, fraud prevention in Nigeria is entirely reactive. A victim gets scammed, they cry out on social media, and their money is already gone. Our vision for FRNG Intelligence is to turn the tables — moving from reactive defense to proactive interception. We want to stop cybercriminals before they can move stolen funds.
          </p>

          <h2 class="section-label">How We Achieve It</h2>
          <p class="section-sub">
            We are building a centralized, community-driven data pipeline that treats fraud like a structural network problem. We achieve this by doing three things:
          </p>

          <!-- Core Pillars Grid -->
          <div class="pillars-grid">
            <div class="pillar-card">
              <div class="pillar-icon">🗂️</div>
              <h3>1. Aggregating Data</h3>
              <p>Crowdsourcing high-confidence threat reports directly from users and public channels.</p>
            </div>

            <div class="pillar-card">
              <div class="pillar-icon">🕸️</div>
              <h3>2. Mapping Syndicates</h3>
              <p>Identifying the interconnected phone numbers, fake URLs, and 'mule' bank accounts scammers share.</p>
            </div>

            <div class="pillar-card">
              <div class="pillar-icon">🔌</div>
              <h3>3. Open Integration</h3>
              <p>Exposing this data via lightweight, real-time developer APIs so local fintech apps and e-commerce checkouts can automatically block a transaction the second a known scammer fingerprint is detected.</p>
            </div>
          </div>

          <!-- Bottom Meta Badge -->
          <div class="eta-box">
            <span class="eta-label">DEVELOPMENT ARCHITECTURE STATUS:</span>
            <span class="eta-value">Active Core Construction</span>
          </div>
        </div>

        <!-- Right Column: High-Tech Interactive SVG Graphic -->
        <div class="visual-side">
          <div class="graphic-wrapper">
            <svg viewBox="0 0 400 400" fill="none" class="intel-vector" xmlns="http://www.w3.org/2000/svg">
              <!-- Grid Overlay -->
              <path d="M0 100H400M0 200H400M0 300H400M100 0V400M200 0V400M300 0V400" stroke="var(--border-color, rgba(128,128,128,0.15))" stroke-width="1"/>

              <!-- Outer Radar Ring -->
              <circle cx="200" cy="200" r="140" stroke="var(--accent-dim, #22c55e33)" stroke-width="2" stroke-dasharray="8 4" class="rotating-ring" />
              <!-- Inner Solid Shield Ring -->
              <circle cx="200" cy="200" r="90" stroke="var(--accent-color, #22c55e)" stroke-width="1.5" />

              <!-- Core Data Node Center -->
              <circle cx="200" cy="200" r="12" fill="var(--accent-color, #22c55e)" class="pulse-node"/>
              <circle cx="200" cy="200" r="25" stroke="var(--accent-color, #22c55e)" stroke-width="1" opacity="0.5" class="pulse-ring"/>

              <!-- Satellite Threat Vector Connections -->
              <g class="threat-vectors">
                <line x1="200" y1="200" x2="110" y2="120" stroke="var(--accent-color, #22c55e)" stroke-width="1.5" />
                <line x1="200" y1="200" x2="310" y2="160" stroke="var(--accent-color, #22c55e)" stroke-width="1.5" stroke-dasharray="4 4" />
                <line x1="200" y1="200" x2="250" y2="290" stroke="var(--accent-color, #22c55e)" stroke-width="1.5" />

                <!-- Satellite Nodes -->
                <circle cx="110" cy="120" r="6" fill="var(--text)" />
                <circle cx="310" cy="160" r="6" fill="var(--accent-color, #22c55e)" />
                <circle cx="250" cy="290" r="6" fill="var(--text)" />
              </g>

              <!-- Target crosshair indicators -->
              <path d="M190 40H210M200 30V50M190 360H210M200 350V370M30 200H50M40 190V210M350 200H370M360 190V210" stroke="var(--text)" stroke-width="1.5" opacity="0.3"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.intelligence-page {
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Banner */
.banner-wrap {
  position: relative;
  width: 100%;
  height: clamp(260px, 38vw, 440px);
  overflow: hidden;
}

.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.banner-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--bg) 30%, transparent) 0%,
    color-mix(in srgb, var(--bg) 55%, transparent) 55%,
    var(--bg) 100%
  );
}

.banner-content {
  position: absolute;
  left: 0;
  right: 0;
  bottom: clamp(24px, 4vw, 48px);
  padding: 0 clamp(1.5rem, 4vw, 4rem);
  max-width: 1200px;
  margin: 0 auto;
}

.banner-title {
  font-size: clamp(1.8rem, 3.4vw, 2.6rem);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.03em;
  margin: 0.75rem 0 0;
  max-width: 780px;
  text-shadow: 0 2px 20px color-mix(in srgb, var(--bg) 70%, transparent);
}

.accent-text {
  color: var(--accent-color, #22c55e);
}

.intel-container {
  max-width: 1200px;
  width: 100%;
  margin: auto;
  padding: 2rem 1.5rem 4rem;
  box-sizing: border-box;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--badge-bg, rgba(34, 197, 94, 0.1));
  border: 1px solid var(--accent-color, #22c55e);
  padding: 0.5rem 1rem;
  border-radius: 50px;
  backdrop-filter: blur(4px);
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: var(--accent-color, #22c55e);
  border-radius: 50%;
  box-shadow: 0 0 0 0 var(--accent-color, #22c55e);
  animation: pulse-effect 1.8s infinite cubic-bezier(0.66, 0, 0, 1);
}

.badge-text {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--accent-color, #22c55e);
}

/* Main Grid Layout */
.grid-layout {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 4rem;
  align-items: center;
}

@media (max-width: 968px) {
  .grid-layout {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
  .visual-side {
    order: -1;
  }
}

.hero-desc {
  font-size: 1.105rem;
  line-height: 1.6;
  opacity: 0.8;
  margin: 0 0 2rem 0;
  max-width: 680px;
}

.section-label {
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  margin: 0 0 0.5rem 0;
}

.section-sub {
  font-size: 1rem;
  line-height: 1.6;
  opacity: 0.75;
  margin: 0 0 1.5rem 0;
  max-width: 680px;
}

/* Pillars Cards Grid */
.pillars-grid {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 2.5rem;
}

.pillar-card {
  background: var(--card-bg, rgba(128, 128, 128, 0.05));
  border: 1px solid var(--border-color, rgba(128, 128, 128, 0.15));
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 1rem;
  align-items: start;
}

.pillar-icon {
  grid-row: span 2;
  font-size: 1.5rem;
  margin-top: 0.1rem;
}

.pillar-card h3 {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
}

.pillar-card p {
  font-size: 0.9rem;
  line-height: 1.45;
  opacity: 0.7;
  margin: 0;
}

/* ETA Info Block footer element */
.eta-box {
  border-top: 1px dashed var(--border-color, rgba(128, 128, 128, 0.2));
  padding-top: 1.5rem;
  display: flex;
  gap: 0.5rem;
  font-size: 0.85rem;
}

.eta-label {
  opacity: 0.5;
  font-weight: 600;
}

.eta-value {
  color: var(--accent-color, #22c55e);
  font-weight: 700;
}

/* Vector Graphics Animations */
.graphic-wrapper {
  width: 100%;
  max-width: 360px;
  margin: auto;
  aspect-ratio: 1;
}

.intel-vector {
  width: 100%;
  height: 100%;
}

.rotating-ring {
  transform-origin: 200px 200px;
  animation: rotate-ring 25s linear infinite;
}

@keyframes pulse-effect {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.5); }
  70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
}

@keyframes rotate-ring {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.pulse-ring {
  transform-origin: 200px 200px;
  animation: ripple 3s ease-out infinite;
}

@keyframes ripple {
  0% { r: 15px; opacity: 0.6; }
  100% { r: 60px; opacity: 0; }
}
</style>