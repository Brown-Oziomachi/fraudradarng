<script setup lang="ts">
useHead({ title: 'Fraud Radar NG — Check before you send' })

const lessons = [
  {
    title: 'Urgency is the first red flag',
    body: 'Scammers create pressure — "send now or lose the deal," "the offer expires in 10 minutes." Legitimate transactions rarely require you to skip verification because of time.'
  },
  {
    title: 'A matching name isn\u2019t proof',
    body: 'Fraudsters often use real, verified bank accounts under someone else\u2019s name obtained through mules. The account being "real" doesn\u2019t mean the person behind it is who they claim.'
  },
  {
    title: 'Screenshots can be faked',
    body: 'A "payment sent" screenshot proves nothing — it\u2019s trivial to edit. Only trust a transfer once it actually reflects in your own account balance.'
  },
  {
    title: 'Once sent, it\u2019s gone',
    body: 'Nigerian bank transfers are typically irreversible once completed. There is no "recall" button — prevention before sending is the only real protection.'
  }
]

const scamSteps = [
  {
    number: '01',
    title: 'Contact is made',
    body: 'Through a marketplace listing, a job posting, a dating app, or a random DM — the fraudster reaches out with a believable reason to talk to you.'
  },
  {
    number: '02',
    title: 'Trust is built quickly',
    body: 'A convincing story, sometimes borrowed details from a real business or person, and often a sense of urgency: a deadline, an emergency, a limited-time offer.'
  },
  {
    number: '03',
    title: 'Payment is requested',
    body: 'You\u2019re asked to send money first — for a deposit, a fee, a "verification transfer," or to release goods/services before your own payment clears.'
  },
  {
    number: '04',
    title: 'Contact disappears',
    body: 'Once the transfer goes through, the account holder stops responding, blocks your number, or the account itself gets abandoned.'
  }
]

const { data: validReports } = await useLazyFetch('/api/reports', {
  default: () => []
})
</script>

<template>
  <section class="hero">
    <div class="hero-bg-image" />
    <div class="hero-overlay" />

  <div class="hero-content">
<div class="hero-copy">
  <h1 class="hero-title">
    <span class="hero-title-line">FRNG</span>
    <span class="hero-title-line hero-title-line--accent">File a Report</span>
  </h1>

 <p class="hero-subtext">
  The scam that hit them yesterday<br />
  is coming for you today. Check first.
</p>

  <div class="hero-actions">
    <NuxtLink to="/help" class="btn btn--pill">
      Need Help
    </NuxtLink>
  </div>
</div>
</div>

    <svg class="hero-curve" viewBox="0 0 1440 100" preserveAspectRatio="none">
      <path d="M0,0 C480,100 960,100 1440,0 L1440,100 L0,100 Z" fill="var(--bg)" />
    </svg>
  </section>

  
  

<section class="illustration-section">
  <div class="eyebrow">
    <span class="eyebrow-dot" />
    How the scam usually works
  </div>
  <h2 class="how-title">The pattern repeats because it works.</h2>

  <div class="how-layout">
    <div class="how-image-col">
      <!-- Replace src with your actual image path once added,
           e.g. /how-it-works.png -->
      <img src="/trusts.png" alt="How the scam pattern unfolds" class="how-image" />
    </div>

    <div class="steps-list">
      <div v-for="step in scamSteps" :key="step.number" class="step-row">
        <div class="step-number">{{ step.number }}</div>
        <div class="step-text">
          <div class="step-title">{{ step.title }}</div>
          <p class="step-body">{{ step.body }}</p>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="about-section">
  <div class="about-inner">
    <div class="about-copy">
      <div class="eyebrow eyebrow--dark">
        <span class="eyebrow-dot" />
        Why Fraud Radar NG exists
      </div>
      <h2 class="about-title">
        The scam only works once. Don't let it work twice.
      </h2>
      <p class="about-lead">
        Fraud Radar NG is Nigeria's fraud detection and awareness
        platform — built to help people identify, report, and avoid
        scams before they become victims.
      </p>
      <p class="about-body">
        Every fraudulent account, fake company, and cloned website
        eventually reuses the same script on someone new. The account
        that scammed you today will try the exact same message on
        someone else tomorrow — unless the pattern is exposed. A
        report you file in five minutes could be the five minutes
        that saves a stranger's life savings.
      </p>
      <p class="about-body">
        This isn't a bank, a government agency, or a law firm. It's a
        shared radar — built by Nigerians, for Nigerians — that gets
        stronger every time someone chooses to speak up instead of
        staying silent out of embarrassment.
      </p>
      <NuxtLink to="/report/new" class="btn btn--accent">
        File a report now
      </NuxtLink>
    </div>
    <div><img src="/FRLOGO.png" alt="Fraud Radar NG" class="about-art" /></div> 
  </div>
</section>

<section class="map-section">
  <div class="map-inner">
    <div class="eyebrow eyebrow--dark" style="justify-content: center;">
      <span class="eyebrow-dot" />
      One network, thirty-six states
    </div>
    <h2 class="map-title">Every report strengthens the radar.</h2>
    <img src="/state.png" alt="Fraud Radar NG — Detect, Verify, Protect" class="map-image" />
  </div>
</section>

  <section class="lessons-section">
    <div class="eyebrow">
      <span class="eyebrow-dot" />
      What every Nigerian should know
    </div>
    <h2 class="lessons-title">Fraud relies on speed. Slow down and it usually falls apart.</h2>

    <div class="lessons-grid">
      <div v-for="lesson in lessons" :key="lesson.title" class="lesson-card">
        <div class="lesson-title">{{ lesson.title }}</div>
        <p class="lesson-body">{{ lesson.body }}</p>
      </div>
    </div>

    <a
      href="/guides"
      target="_blank"
      rel="noopener noreferrer"
      class="blog-callout"
    >
      <div class="blog-callout-text">
        <div class="blog-eyebrow">From the blog</div>
        <div class="blog-title">A deeper breakdown: how bank transfer scams actually work in Nigeria</div>
        <p class="blog-desc">
          Read the full write-up on real cases, warning signs, and what to do
          in the first hour after you realize you've been scammed.
        </p>
      </div>
      <span class="blog-arrow">→</span>
    </a>
  </section>
<FlaggedAccountsList :reports="validReports" />
<div class="most-flagged-cta">
  <NuxtLink to="/most-flagged" class="cta-btn">
    🚩 View Most Flagged Accounts
    <span>→</span>
  </NuxtLink>
</div>
  <section class="howit-section">
  <div class="howit-inner" >
   <img src="/how.png" alt="Fraud Radar NG" />
  </div>
</section>
</template>

<style scoped>
.eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: var(--mono); font-size: 20px; letter-spacing: 0.12em;
  text-transform: uppercase; 
  margin-bottom: 16px; 
}
.eyebrow-dot { width: 5px; height: 5px; background: var(--accent); border-radius: 50%; }

/* HERO */
.hero {
  position: relative;
  overflow: hidden;
  min-height: 600px;
  display: flex;
  align-items: center;
}

.hero-bg-image {
  position: absolute;
  inset: 0;
  background-image: url('/com.png');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 100%;
  z-index: 0;
}

@media (max-width: 1200px) {
  .hero-bg-image {
    background-size: 90%;
  }
}

@media (max-width: 992px) {
  .hero-bg-image {
    background-size: 100%;
  }
}

@media (max-width: 768px) {
  .hero-bg-image {
    background-size: 115%;
    background-position: center top;
  }
}

@media (max-width: 480px) {
  .hero-bg-image {
    background-size: 130%;
    background-position: center top;
  }
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(10,10,11,0.92) 5%,
    rgba(10,10,11,0.65) 45%,
    rgba(10,10,11,0.15) 75%,
    rgba(10,10,11,0) 100%
  );
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 100px 40px 140px;
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 40px;
  align-items: start;
  align-items: center;       
  justify-content: center;   
  text-align: center;  
}

@media (max-width: 900px) {
  .hero {
    min-height: 480px;
  }
  .hero-bg-image {
    background-position: center 79%;
  }
  .hero-content {
    grid-template-columns: 1fr;
    padding: 48px 20px 56px;
    align-items: center;      /* was: start — pulls content toward vertical center */
    min-height: 480px;
  }
  .hero-overlay {
    /* Even top-to-bottom scrim instead of the desktop horizontal one —
       keeps text legible no matter what's behind it on a narrow column. */
    background: linear-gradient(
      180deg,
      rgba(10,10,11,0.5) 0%,
      rgba(33, 33, 35, 0.82) 100%,
      rgba(54, 54, 59, 0.92) 100%
    );
  }
}

@media (max-width: 640px) {
  .hero {
    min-height: 440px;
  }
  .hero-content {
    padding: 40px 20px 48px;
  }
  .hero-title {
    font-size: 32px;          /* explicit, not vw-based — stays 2 clean lines */
    line-height: 1.15;
    margin-bottom: 18px;
  }
  .hero-desc {
    font-size: 14px;
    line-height: 1.7;
    padding-left: 16px;
    margin-bottom: 26px;
  }
}

@media (max-width: 420px) {
  .hero {
    min-height: 400px;
  }
  .hero-title {
    font-size: 27px;
  }
  .hero-actions {
    flex-direction: column;
    align-items: stretch;      /* buttons become full-width, easy to tap */
  }
  .hero-actions .btn {
    justify-content: center;
    width: 100%;
  }
}

.hero-title {
  text-align: left;
  line-height: 1.05;
}

.hero-title-line {
  display: block;
  font-family: var(--serif);
  font-size: clamp(50px, 7vw, 68px);
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
}

.hero-title-line--accent {
  color: var(--accent);
}

.hero-subtext {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 300;
  line-height: 1.6;
  text-align: left;
  margin: 20px 0 0;
  font-family: var(--mono);
}

.hero-actions {
  display: flex;
  justify-content: flex-start;
  margin-top: 20px;
}

.btn--pill {
  border-radius: 999px;
  background: var(--accent);
  border-color: var(--accent);
  color: #0a0a0b;
  font-weight: 700;
  padding: 14px 32px;
}
.btn--pill:hover {
  background: #d4eb3c;
  border-color: #d4eb3c;
}

.hero-desc {
  font-size: 16px;
  color: rgba(243, 234, 234, 0.92);
  line-height: 1.8;
  font-weight: 300;
  max-width: 480px;
  border-left: 2px solid var(--accent-bdr, var(--border));
  padding-left: 20px;
  margin-bottom: 35px;
  letter-spacing: 0.01em;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.6);
}

.hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--mono);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 13px 26px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  color: black;
  border: #0a0a0b;
  text-decoration: none;
  transition: color 0.15s, border-color 0.15s, transform 0.15s;
}
.btn:hover {
  color: var(--text-1);
  border-color: var(--border-hi);
  transform: translateY(-1px);
}

.btn--accent {
  background: var(--accent);
  border-color: var(--accent);
  color: #0a0a0b;
  font-weight: 700;
}
.btn--accent:hover {
  background: #d4eb3c;
  border-color: #d4eb3c;
}

.hero-curve {
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 70px;
  z-index: 2;
  display: block;
}

/* ILLUSTRATION SECTION — now wider to fit the two-column layout */
.illustration-section {
  max-width: 1120px;
  margin: 0 auto;
  padding: 56px 24px;
  border-bottom: 1px solid var(--border);
}

.how-title {
  font-family: var(--serif);
  font-size: clamp(22px, 3vw, 28px);
  color: var(--text-1);
  line-height: 1.3;
  margin-bottom: 36px;
  max-width: 600px;
}

/* SIDE-BY-SIDE LAYOUT — image sticks in place on desktop while the
   steps list scrolls past it, since the list is usually taller than
   a single image. Collapses to a stacked column on mobile. */
.how-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: start;
}

@media (max-width: 800px) {
  .how-layout {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}

.how-image-col {
  position: sticky;
  top: 24px;
}

@media (max-width: 800px) {
  .how-image-col {
    position: static;
  }
}

.how-image {
  width: 100%;
  height: 20em;
  border: 1px solid var(--border-hi);
  display: block;
  object-fit: contain;
}

/* SCAM STEPS */
.steps-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.step-row {
  display: flex;
  gap: 18px;
  align-items: flex-start;
  border-top: 1px solid var(--border);
  padding-top: 22px;
}
.step-row:first-child {
  border-top: none;
  padding-top: 0;
}

.step-number {
  font-family: var(--serif);
  font-size: 26px;
  color: var(--accent);
  flex-shrink: 0;
  width: 44px;
}

.step-title {
  font-family: var(--serif);
  font-size: 17px;
  color: var(--text-1);
  margin-bottom: 8px;
}

.step-body {
  font-size: 13px;
  color: var(--text-3);
  line-height: 1.7;
  font-weight: 300;
}

/* LESSONS SECTION */
.lessons-section {
  padding: 56px 24px;
  max-width: 1120px;
  margin: 0 auto;

}

.lessons-title {
  font-family: var(--serif);
  font-size: clamp(22px, 3vw, 30px);
  color: var(--text-1);
  line-height: 1.3;
  max-width: 560px;
  margin-bottom: 32px;
  
}

.lessons-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 40px;
}
@media (max-width: 640px) {
  .lessons-grid { grid-template-columns: 1fr; }
}

.lesson-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
}
.lesson-title {
  font-family: var(--serif); font-size: 16px;
  color: var(--text-1); margin-bottom: 8px;
}
.lesson-body {
  font-size: 13px; color: var(--text-3); line-height: 1.65; font-weight: 300;
}

/* BLOG CALLOUT */
.blog-callout {
  display: flex; align-items: center; justify-content: space-between; gap: 20px;
  background: var(--surface); border: 1px solid var(--border);
  border-left: 3px solid var(--accent);
  border-radius: var(--radius); padding: 24px 28px;
  text-decoration: none;
  transition: border-color 0.15s;
}
.blog-callout:hover { border-color: var(--accent-bdr); }
@media (max-width: 560px) {
  .blog-callout { flex-direction: column; align-items: flex-start; }
}

.blog-eyebrow {
  font-family: var(--mono); font-size: 9px; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--accent); margin-bottom: 8px;
}
.blog-title {
  font-family: var(--serif); font-size: 18px; color: var(--text-1);
  line-height: 1.3; margin-bottom: 8px;
}
.blog-desc { font-size: 13px; color: var(--text-3); line-height: 1.6; font-weight: 300; max-width: 460px; }
.blog-arrow { font-family: var(--mono); font-size: 20px; color: var(--accent); flex-shrink: 0; }

.about-section {
  padding: 72px 24px;
}

.about-inner {
  max-width: 1120px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 56px;
  align-items: center;
}

@media (max-width: 860px) {
  .about-inner {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .about-art { order: -1; }
}

.about-title {
  font-family: var(--serif);
  font-size: clamp(26px, 3.4vw, 38px);
  line-height: 1.25;
  margin-bottom: 20px;
}

.about-lead {
  font-size: 16px;
  line-height: 1.7;
  font-weight: 500;
  margin-bottom: 18px;
}

.about-body {
  font-size: 14px;
  line-height: 1.8;
  font-weight: 300;
  margin-bottom: 16px;
}

.about-art {
  width: 100%;
}
.about-art svg {
  width: 100%;
  height: auto;
  display: block;
}

.howit-section {
  background: #ffffff;
  padding: 32px 24px;
}

.howit-inner {
  max-width: 1120px;
  margin: 0 auto;
}
.howit-inner img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 8px;
}

@media (max-width: 640px) {
  .howit-section {
    padding: 24px 16px;
  }
}

.map-section {
  background: var(--bg);
  padding: 56px 24px;
}

.map-inner {
  max-width: 1120px;
  margin: 0 auto;
  text-align: center;
}

.map-title {
  font-family: var(--serif);
  font-size: clamp(22px, 3vw, 30px);
  color: var(--text-1);
  margin-bottom: 28px;
}

.map-image {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 12px;
}

.most-flagged-cta {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 48px auto;
  padding: 0 24px 40px;
}

.cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 12px;

  padding: 16px 34px;

  background: #ef4444;
  color: #fff;
  text-decoration: none;

  font-size: 16px;
  font-weight: 700;

  border-radius: 999px;
  border: none;

  box-shadow: 0 10px 30px rgba(248, 113, 113, 0.35);
  transition: all 0.3s ease;
}

.cta-btn:hover {
    background: #f87171;
  transform: translateY(-3px);
  box-shadow: 0 16px 40px rgba(248, 113, 113, 0.45);
}

.cta-btn span {
  transition: transform 0.3s ease;
}

.cta-btn:hover span {
  transform: translateX(6px);
}
</style>