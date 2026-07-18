<script setup lang="ts">
import { onMounted } from 'vue'

useSeoMeta({
  title: 'Forex & Ponzi Schemes | FRNG Nigeria',
  description: 'How Forex and Ponzi investment schemes actually work in Nigeria, why smart people fall for them, and how to check before you invest — or report one that already took your money.',
  ogTitle: 'Forex & Ponzi Schemes — The Pattern Behind Every Collapse',
  ogDescription: 'The return was never the point. Learn the mechanics before you deposit another naira.',
  ogImage: 'https://fraudradar.ng/FRLOGO.png',
  ogType: 'website',
  ogSiteName: 'Fraud Radar NG',
  ogLocale: 'en_NG',
  twitterCard: 'summary_large_image',
  robots: 'index, follow',
  author: 'Fraud Radar NG Security Team'
})

const howSteps = [
  {
    number: '01',
    title: 'The pitch',
    body: 'A platform promises fixed, guaranteed returns — often 20% to 100% within days or weeks — tied to "forex trading," an "AI trading bot," or "crypto arbitrage" that supposedly cannot lose. Real markets never guarantee a fixed return; only a scheme built on new deposits can promise one.'
  },
  {
    number: '02',
    title: 'The early payouts',
    body: 'The first depositors really do get paid — not from trading profit, but from the deposits of the people who joined after them. Those payouts become the testimonials and screenshots that convince the next wave to join.'
  },
  {
    number: '03',
    title: 'The referral escalation',
    body: 'Bonuses for bringing in new investors turn early participants into unpaid promoters. The platform grows faster through word of mouth from people who trust the recruiter than it ever could through advertising.'
  },
  {
    number: '04',
    title: 'The freeze',
    body: 'Withdrawals start taking longer. New "verification fees," "tax clearances," or "account unlock" charges appear — money you have to pay before you can access money that was already yours. Every excuse buys the operators a few more days of incoming deposits.'
  },
  {
    number: '05',
    title: 'The vanish',
    body: 'The app stops loading, the office is empty, the founders are unreachable, and the money is gone. What made it feel different from every scheme before it — the AI dashboard, the professional branding, the CAC certificate — turns out to have never mattered.'
  }
]

const whyReasons = [
  {
    title: 'Economic pressure',
    body: 'In a tough economy, a "guaranteed" high return doesn\u2019t read as too good to be true — it reads as the only realistic shortcut left. Desperation lowers the bar for what counts as believable.'
  },
  {
    title: 'Social proof from people you trust',
    body: 'By the time a scheme reaches you, someone you know has probably already been paid — a colleague, a church member, a cousin. Their real testimony carries more weight than any abstract warning ever could.'
  },
  {
    title: 'Professional camouflage',
    body: 'Slick dashboards, fabricated AI trading charts, CAC registration certificates, and offices in a business district all signal legitimacy — even though none of them prove the platform is actually trading anything.'
  },
  {
    title: 'Sunk cost',
    body: 'Once money is in, doubt feels expensive. People add more, hoping to recover losses or hit the "next payout," rather than accepting a smaller loss early and walking away.'
  }
]

const checklist = [
  'No legitimate investment can guarantee a fixed, high return — real markets go up and down, and anyone promising otherwise is describing a Ponzi structure, not an investment strategy',
  'Check the platform against the Securities and Exchange Commission\u2019s (SEC) list of registered operators, and its published list of unregistered or illegal investment schemes, before depositing anything',
  'Try withdrawing a small amount early. A genuine platform processes it without excuses; a Ponzi scheme stalls, adds conditions, or introduces a sudden "fee"',
  'Any charge required before you can withdraw your own money — a "verification fee," "unlock fee," or "tax" — is a stalling tactic, not a real requirement',
  'If you\u2019re still in a scheme that hasn\u2019t collapsed yet, stop reinvesting and attempt to withdraw everything now — don\u2019t wait for a bigger payout that may never come',
  'If it already collapsed, file a report on FRNG immediately. Recovering your money may not be possible, but your report becomes evidence in the pattern that protects the next person'
]

onMounted(() => {
  if (typeof window === 'undefined') return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'))
    return
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  )
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
})
</script>

<template>
  <section class="page-hero reveal">
    <div class="eyebrow">
      <span class="eyebrow-dot" />
      Forex &amp; Ponzi schemes
    </div>
    <h1 class="page-title">The return was never the point — the recruitment was.</h1>
    <p class="page-subtitle">
      Since 2016, Nigeria has watched the same structure collapse under a dozen different
      names — MMM, MBA Forex, and most recently CBEX, which regulators say wiped out
      over a trillion naira from hundreds of thousands of people in under a year.
      Every version wears different branding. The mechanics never change.
    </p>
  </section>

  <!-- ============ HOW IT WORKS ============ -->
  <section class="how-section">
    <div class="eyebrow reveal">
      <span class="eyebrow-dot" />
      How it actually works
    </div>
    <h2 class="section-title reveal">Five stages, every single time.</h2>

    <div class="steps-list">
      <div v-for="(step, i) in howSteps" :key="step.number" class="step-row reveal" :style="{ transitionDelay: `${i * 80}ms` }">
        <div class="step-number">{{ step.number }}</div>
        <div class="step-text">
          <div class="step-title">{{ step.title }}</div>
          <p class="step-body">{{ step.body }}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ WHY PEOPLE FALL FOR IT ============ -->
  <section class="why-section reveal">
    <div class="why-inner">
      <div class="eyebrow eyebrow--dark">
        <span class="eyebrow-dot" />
        Why smart people still fall for it
      </div>
      <h2 class="section-title section-title--light">This isn't about being gullible.</h2>
      <div class="why-grid">
        <div v-for="reason in whyReasons" :key="reason.title" class="why-card">
          <div class="why-title">{{ reason.title }}</div>
          <p class="why-body">{{ reason.body }}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ THE PATTERN, DOCUMENTED ============ -->
  <section class="pattern-section reveal">
    <div class="pattern-frame">
      <span class="pattern-tab">Documented, not speculation</span>
      <p class="pattern-body">
        Nigeria's Deposit Insurance Corporation has traced roughly ₦900 billion in losses
        to Ponzi-related schemes over the past two decades, with MMM alone accounting for
        billions of that figure. The Securities and Exchange Commission has since published
        a running list of dozens of unregistered investment operators. CBEX, the most
        recent large collapse, promised 100% returns in 30 days behind a fabricated
        AI-trading dashboard — and introduced "verification fees" in its final weeks, the
        same stalling pattern seen in nearly every scheme before it.
      </p>
    </div>
  </section>

  <!-- ============ ESCAPE + VERIFY CHECKLIST ============ -->
  <section class="checklist-section reveal">
    <div class="checklist-inner">
      <div class="eyebrow eyebrow--dark">
        <span class="eyebrow-dot" />
        Before you deposit, or before you deposit again
      </div>
      <h2 class="checklist-title">Six checks that catch almost every version of this.</h2>
      <ul class="checklist-list">
        <li v-for="(item, i) in checklist" :key="i">
          <span class="checklist-num">{{ i + 1 }}</span>
          <span>{{ item }}</span>
        </li>
      </ul>
      <div class="checklist-actions">
        <NuxtLink to="/blacklistvault?category=Forex Pools" class="btn btn--accent">Search Forex &amp; Ponzi in the vault</NuxtLink>
        <NuxtLink to="/report/new" class="btn btn--outline-dark">Report a scheme</NuxtLink>
        <NuxtLink to="/lookupsearch" class="btn btn--outline-dark">Check the registry</NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: var(--mono); font-size: 12px; letter-spacing: 0.12em;
  text-transform: uppercase; color: var(--text-3);
  margin-bottom: 16px;
}
.eyebrow--dark { color: var(--text-2); }
.eyebrow-dot { width: 5px; height: 5px; background: var(--accent); border-radius: 50%; }

.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.7s cubic-bezier(0.2, 0.7, 0.2, 1), transform 0.7s cubic-bezier(0.2, 0.7, 0.2, 1);
}
.reveal.is-visible { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) {
  .reveal { opacity: 1; transform: none; transition: none; }
}

/* HERO */
.page-hero {
  max-width: 860px;
  margin: 0 auto;
  padding: 72px 24px 40px;
  text-align: center;
}
.page-hero .eyebrow { justify-content: center; }

.page-title {
  font-family: var(--serif);
  font-size: clamp(30px, 4.5vw, 46px);
  font-weight: 700;
  color: var(--text-1);
  line-height: 1.25;
  margin-bottom: 20px;
}

.page-subtitle {
  font-size: 15.5px;
  color: var(--text-3);
  line-height: 1.75;
  font-weight: 300;
  max-width: 660px;
  margin: 0 auto;
}

/* HOW SECTION */
.how-section {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 24px 56px;
}

.section-title {
  font-family: var(--serif);
  font-size: clamp(22px, 3vw, 30px);
  color: var(--text-1);
  line-height: 1.3;
  max-width: 600px;
  margin-bottom: 36px;
}
.section-title--light { color: #fff; }

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.step-row {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  border-top: 1px solid var(--border);
  padding-top: 22px;
}
.step-row:first-child { border-top: none; padding-top: 0; }

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
  font-size: 13.5px;
  color: var(--text-3);
  line-height: 1.75;
  font-weight: 300;
}

/* WHY SECTION — dark inverted panel for contrast */
.why-section {
  background: #0d1410;
  padding: 64px 24px;
}

.why-inner {
  max-width: 1000px;
  margin: 0 auto;
}
.why-inner .eyebrow { color: rgba(255,255,255,0.55); }

.why-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 8px;
}
@media (max-width: 700px) {
  .why-grid { grid-template-columns: 1fr; }
}

.why-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius);
  padding: 22px;
}

.why-title {
  font-family: var(--serif);
  font-size: 16px;
  color: var(--accent);
  margin-bottom: 8px;
}

.why-body {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.7;
  font-weight: 300;
}

/* PATTERN — documented facts callout */
.pattern-section {
  max-width: 900px;
  margin: 0 auto;
  padding: 56px 24px;
}

.pattern-frame {
  position: relative;
  border: 1px solid var(--border-hi);
  border-radius: 18px;
  padding: 44px 28px 28px;
}

.pattern-tab {
  position: absolute;
  top: 0;
  left: 28px;
  transform: translateY(-50%);
  background: var(--bg);
  border: 1px solid var(--border-hi);
  border-radius: 8px;
  padding: 7px 16px;
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--accent);
}

.pattern-body {
  font-size: 14.5px;
  color: var(--text-2);
  line-height: 1.8;
  font-weight: 300;
}

/* CHECKLIST */
.checklist-section {
  background: var(--surface);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  padding: 56px 24px;
}

.checklist-inner { max-width: 780px; margin: 0 auto; }

.checklist-title {
  font-family: var(--serif);
  font-size: clamp(22px, 3vw, 30px);
  color: var(--text-1);
  line-height: 1.3;
  margin-bottom: 28px;
}

.checklist-list {
  list-style: none;
  padding: 0;
  margin: 0 0 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.checklist-list li {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  font-size: 14px;
  color: var(--text-2);
  line-height: 1.7;
}

.checklist-num {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--accent);
  color: #0a0a0b;
  font-family: var(--mono);
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checklist-actions { display: flex; gap: 12px; flex-wrap: wrap; }

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
  text-decoration: none;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s, transform 0.15s;
}
.btn--accent {
  background: var(--accent);
  border-color: var(--accent);
  color: #0a0a0b;
  font-weight: 700;
}
.btn--accent:hover { background: #d4eb3c; border-color: #d4eb3c; }

.btn--outline-dark {
  background: transparent;
  border: 1px solid var(--border-hi);
  color: var(--text-2);
}
.btn--outline-dark:hover { border-color: var(--accent); color: var(--accent); transform: translateY(-1px); }
</style>