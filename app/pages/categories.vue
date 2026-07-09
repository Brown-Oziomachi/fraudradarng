<script setup lang="ts">
useHead({ title: 'Fraud Categories — Fraud Radar NG' })

const stats = [
  { value: 'TIRMS', label: 'CBN/NCC SIM-swap check, live since April 2026' },
  { value: 'SEC', label: 'Now enforces jail time for Ponzi operators' },
  { value: 'NANTA', label: 'Has a public visa-agent verification portal' }
]

const categories = [
  {
    id: 'fintech_ussd',
    tag: 'Fintech & USSD',
    title: 'Fintech & USSD exploits',
    intro: 'OPay, PalmPay, and Moniepoint impersonation, and SIM-swap attacks that hijack USSD banking.',
    patterns: [
      'A "customer service" account on WhatsApp, Facebook, or Telegram claims there\u2019s a problem with your wallet and asks for your OTP, PIN, or debit card details \u2014 the single most common fintech scam reported in 2026.',
      'A fraudster bribes or social-engineers a telecom agent into transferring your number onto their SIM. Once it completes, your bank\u2019s USSD codes, OTPs, and transaction alerts all go to their device instead of yours.',
      'A fake QR code redirects a payment meant for a merchant into the scammer\u2019s own wallet.',
      'Accounts opened in your name without your BVN or NIN, exploiting looser identity-verification paths some platforms still allow.'
    ],
    redFlags: [
      'Any message asking you to share an OTP, PIN, or "verification code" \u2014 no legitimate platform ever needs this from you',
      'Your phone suddenly loses all signal with no explanation \u2014 treat this as an active SIM swap, not a network glitch',
      'A link asking you to "verify" or "upgrade" your account outside the official app'
    ],
    doThis: 'If your phone loses signal unexpectedly, contact your bank immediately to freeze transactions before contacting your telecom provider. Banks can now check a number\u2019s SIM-swap status in real time through the CBN/NCC\u2019s TIRMS portal before authorizing large transfers \u2014 ask your bank if this check was run.',
    agency: { name: 'CBN Consumer Protection Department', href: '/help' }
  },
  {
    id: 'social_commerce',
    tag: 'Social Commerce',
    title: 'Social commerce scams',
    intro: '"Pay before delivery" Instagram, TikTok, and WhatsApp vendors who take payment and disappear.',
    patterns: [
      'A seller with a well-curated page and active comments offers goods at prices noticeably below the market rate.',
      'Payment is requested by direct bank transfer to a personal account, never an escrow or verified checkout.',
      'After payment, the seller stops responding, blocks the buyer, or sends a fake tracking number for a courier that doesn\u2019t exist.',
      'The same operator resurfaces under a new handle after being exposed, often reusing the same product photos.'
    ],
    redFlags: [
      'No verifiable physical address and no phone number \u2014 only a DM or WhatsApp line',
      'The account was created only weeks or months ago \u2014 check the date of its very first post',
      'Every "review" lives only in the seller\u2019s own comment section, with nothing independent to confirm them'
    ],
    doThis: 'Reverse-search product photos and the seller\u2019s name before paying. For any order above a small amount, insist on part-payment on delivery, or use an escrow arrangement you choose yourselves \u2014 never one the seller proposes and controls.',
    agency: { name: 'FCCPC — for vendor & product complaints', href: '/help' }
  },
  {
    id: 'visa_travel',
    tag: 'Visa & Travel',
    title: 'Visa / travel logistics fraud',
    intro: 'Fake agents promising guaranteed Canadian, UK, or other visas \u2014 one of the costliest scams facing Nigerians right now.',
    patterns: [
      'An "agent" guarantees visa approval for a flat, often very large, fee \u2014 no legitimate agent can ever guarantee an embassy\u2019s decision.',
      'Fake job offers requiring upfront payment for "security clearance" or "medical checks" before a visa or work permit is issued.',
      'Forged supporting documents (bank statements, accommodation contracts, LMIA letters) submitted on the applicant\u2019s behalf \u2014 the applicant, not the agent, bears the consequences if the embassy detects the fraud.',
      'Payment demanded in cash or to a personal account, with pressure to pay quickly before "the slots close."'
    ],
    redFlags: [
      'Any guarantee of approval \u2014 the honest answer to "can you guarantee my visa?" is always no',
      'The agent isn\u2019t listed on NANTA\u2019s public member-verification portal, or can\u2019t produce a NANTA ID card on request',
      'No physical office, and all communication happens only through WhatsApp DMs'
    ],
    doThis: 'Verify any travel agent against NANTA\u2019s member portal before paying anything. For the visa itself, apply directly through the embassy\u2019s own listed visa application centre (VFS Global, TLScontact, etc.) \u2014 the fee is fixed regardless of who you go through, so a "discount" from an unofficial agent has no basis.',
    agency: { name: 'NANTA member verification, plus EFCC for the fraud itself', href: '/help' }
  },
  {
    id: 'job_ponzi',
    tag: 'Job & Ponzi',
    title: 'Job & Ponzi schemes',
    intro: 'Task-based apps and investment platforms promising daily returns in USDT or Naira \u2014 Nigeria\u2019s SEC has flagged dozens of these as unregistered Ponzi operations.',
    patterns: [
      'An app pays users to "rate" videos or complete simple tasks, with a referral structure that rewards recruiting new users far more than the tasks themselves.',
      'An investment platform promises fixed daily or weekly returns, often paid in USDT, regardless of any real market conditions.',
      'Early withdrawals process smoothly to build trust, followed by mounting excuses once larger sums are involved \u2014 the exact pattern behind the CBEX collapse, which cost Nigerian investors an estimated hundreds of millions of dollars in 2025.',
      'Heavy promotion through WhatsApp groups, Instagram, and Telegram, sometimes using AI-generated videos of real public figures appearing to endorse the platform.'
    ],
    redFlags: [
      'Any "guaranteed" return, especially one paid on a fixed daily schedule \u2014 no real investment can promise this',
      'A referral or "VIP tier" system that rewards recruiting others more than the underlying product or service',
      'The platform isn\u2019t on the SEC\u2019s public list of registered capital market operators'
    ],
    doThis: 'Verify any investment platform against the SEC\u2019s public register before depositing anything \u2014 Nigeria\u2019s Investments and Securities Act 2025 now makes running an unregistered Ponzi scheme a criminal offence with real prison time, precisely because of losses like CBEX.',
    agency: { name: 'Securities and Exchange Commission (SEC)', href: '/help' }
  }
]
</script>

<template>
  <div class="cat-page">

    <!-- ===================== HERO ===================== -->
    <section class="hero">
      <div class="hero-image-wrap">
        <div class="hero-scrim" />
      </div>
      <div class="hero-content">
        <p class="hero-eyebrow"><span class="dot" /> Fraud categories</p>
        <h1 class="hero-title">Scams don't look<br />the same everywhere.<br />Here's what they<br />look like here.</h1>
        <p class="hero-sub">
          Four patterns account for a large share of what Nigerians actually report right now \u2014
          not generic "online scam" advice, but the specific mechanics, red flags, and the exact
          agency that handles each one.
        </p>
      </div>
    </section>

    <!-- ===================== STATS STRIP ===================== -->
    <section class="stats-strip">
      <div v-for="stat in stats" :key="stat.label" class="stat-block">
        <span class="stat-value">{{ stat.value }}</span>
        <span class="stat-label">{{ stat.label }}</span>
      </div>
    </section>

    <!-- ===================== CATEGORY SECTIONS ===================== -->
    <section class="categories-section">
      <article v-for="cat in categories" :key="cat.id" :id="cat.id" class="category-block">
        <div class="category-header">
          <span class="category-tag">{{ cat.tag }}</span>
          <h2 class="category-title">{{ cat.title }}</h2>
          <p class="category-intro">{{ cat.intro }}</p>
        </div>

        <div class="category-grid">
          <div class="category-col">
            <h3 class="col-heading">How it plays out</h3>
            <ul class="pattern-list">
              <li v-for="p in cat.patterns" :key="p">{{ p }}</li>
            </ul>
          </div>

          <div class="category-col">
            <h3 class="col-heading">Red flags</h3>
            <ul class="flag-list">
              <li v-for="f in cat.redFlags" :key="f">{{ f }}</li>
            </ul>

            <div class="do-this-box">
              <span class="do-this-label">What actually helps</span>
              <p>{{ cat.doThis }}</p>
            </div>

            <NuxtLink :to="cat.agency.href" class="agency-link">
              Report to: {{ cat.agency.name }} →
            </NuxtLink>
          </div>
        </div>

        <NuxtLink :to="`/report/form?category=${cat.id}`" class="report-this-btn">
          Report a {{ cat.tag.toLowerCase() }} scam →
        </NuxtLink>
      </article>
    </section>

    <!-- ===================== CONTACT CTA ===================== -->
    <section class="contact-section">
      <div class="contact-inner">
        <div class="contact-copy">
          <h2 class="contact-title">Doesn't match any of these?</h2>
          <p class="contact-body">
            You can still file a report for any bank account, company, or website \u2014
            these four categories are the most common, not the only ones we track.
          </p>
          <div class="contact-actions">
            <NuxtLink to="/report/form" class="btn-primary">Report a scam</NuxtLink>
            <NuxtLink to="/reports" class="btn-secondary">Browse all reports</NuxtLink>
          </div>
        </div>

        <div class="stamp-wrap" aria-hidden="true">
          <div class="stamp">
            <svg viewBox="0 0 140 140" class="stamp-ring">
              <defs>
                <path id="cat-stamp-circle" d="M 70,70 m -55,0 a 55,55 0 1,1 110,0 a 55,55 0 1,1 -110,0" />
              </defs>
              <text class="stamp-text">
                <textPath href="#cat-stamp-circle" startOffset="0%">
                  LOCALIZED TO NIGERIA \u00b7 FRAUD RADAR NG \u00b7 LOCALIZED TO NIGERIA \u00b7
                </textPath>
              </text>
            </svg>
            <span class="stamp-check">4</span>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
.cat-page { width: 100%; }

/* ============ HERO ============ */
.hero {
  position: relative;
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}



.hero-content {
  position: relative;
  z-index: 1;
  padding: 0 44px 64px;
  max-width: 900px;
  text-align: left;
}
@media (max-width: 720px) { .hero-content { padding: 0 20px 44px; } }

.hero-eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: var(--mono); font-size: 11px; letter-spacing: 0.12em;
  text-transform: uppercase; color: var(--accent); margin-bottom: 20px;
}
.dot { width: 6px; height: 6px; background: var(--accent); border-radius: 50%; }

.hero-title {
  font-family: var(--serif);
  font-size: clamp(52px, 6vw, 84px);
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin-bottom: 24px;
  text-align: left;
}

.hero-sub {
  font-size: clamp(15px, 1.8vw, 18px);
  line-height: 1.6;
  font-weight: 300;
  max-width: 600px;
  text-align: left;
}

/* ============ STATS STRIP ============ */
.stats-strip { display: grid; grid-template-columns: repeat(3, 1fr); border-bottom: 1px solid var(--border); }
@media (max-width: 640px) { .stats-strip { grid-template-columns: 1fr; } }
.stat-block {
  display: flex; flex-direction: column; gap: 6px; padding: 28px 44px;
  border-right: 1px solid var(--border);
}
.stat-block:last-child { border-right: none; }
@media (max-width: 640px) {
  .stat-block { border-right: none; border-bottom: 1px solid var(--border); }
  .stat-block:last-child { border-bottom: none; }
}
.stat-value { font-family: var(--serif); font-size: 24px; color: var(--text-1); }
.stat-label {
  font-family: var(--mono); font-size: 10.5px; letter-spacing: 0.04em;
  color: var(--text-3); line-height: 1.5;
}

/* ============ CATEGORY SECTIONS ============ */
.categories-section { max-width: 1000px; margin: 0 auto; padding: 72px 44px; }
@media (max-width: 720px) { .categories-section { padding: 48px 20px; } }

.category-block {
  padding: 56px 0;
  border-bottom: 1px solid var(--border);
}
.category-block:last-child { border-bottom: none; }

.category-header { margin-bottom: 32px; max-width: 680px; }
.category-tag {
  display: inline-block;
  font-family: var(--mono); font-size: 10px; letter-spacing: 0.08em;
  text-transform: uppercase; padding: 4px 10px; border-radius: 3px;
  background: var(--accent-dim, rgba(232,255,71,0.08)); color: var(--accent);
  border: 1px solid rgba(232,255,71,0.25); margin-bottom: 14px;
}
.category-title {
  font-family: var(--serif); font-size: clamp(24px, 3.2vw, 32px);
  color: var(--text-1); margin-bottom: 12px; line-height: 1.25;
}
.category-intro { font-size: 15px; color: var(--text-2); line-height: 1.7; font-weight: 300; }

.category-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 28px;
}
@media (max-width: 760px) { .category-grid { grid-template-columns: 1fr; } }

.col-heading {
  font-family: var(--mono); font-size: 11px; letter-spacing: 0.08em;
  text-transform: uppercase; color: var(--text-3); margin-bottom: 14px;
}

.pattern-list, .flag-list {
  display: flex; flex-direction: column; gap: 12px;
  padding-left: 20px; font-size: 13.5px; color: var(--text-2);
  line-height: 1.65; font-weight: 300;
}
.flag-list li { color: var(--text-1); font-weight: 400; }

.do-this-box {
  margin-top: 20px;
  padding: 16px 18px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-left: 3px solid var(--accent);
  border-radius: var(--radius);
}
.do-this-label {
  display: block; font-family: var(--mono); font-size: 10px;
  letter-spacing: 0.06em; text-transform: uppercase; color: var(--accent);
  margin-bottom: 8px;
}
.do-this-box p { font-size: 13px; color: var(--text-2); line-height: 1.65; font-weight: 300; }

.agency-link {
  display: inline-block;
  margin-top: 16px;
  font-family: var(--mono); font-size: 12.5px;
  color: var(--text-1); text-decoration: underline;
}
.agency-link:hover { color: var(--accent); }

.report-this-btn {
  display: inline-flex; align-items: center;
  background: var(--accent); color: #0a0a0b; font-weight: 600;
  font-family: var(--mono); font-size: 12.5px; letter-spacing: 0.03em;
  padding: 14px 22px; border-radius: var(--radius); text-decoration: none;
}
.report-this-btn:hover { background: #d4eb3c; }

/* ============ CONTACT SECTION ============ */
.contact-section { border-top: 1px solid var(--border); padding: 80px 44px; }
@media (max-width: 720px) { .contact-section { padding: 56px 20px; } }
.contact-inner {
  max-width: 1120px; margin: 0 auto;
  display: grid; grid-template-columns: 1fr auto; gap: 48px; align-items: center;
}
@media (max-width: 780px) { .contact-inner { grid-template-columns: 1fr; text-align: center; } }
.contact-title { font-family: var(--serif); font-size: clamp(24px, 3.4vw, 34px); color: var(--text-1); margin-bottom: 14px; }
.contact-body {
  font-size: 14.5px; line-height: 1.75; font-weight: 300; color: var(--text-2);
  max-width: 480px; margin-bottom: 26px;
}
@media (max-width: 780px) { .contact-body { margin-left: auto; margin-right: auto; } }
.contact-actions { display: flex; gap: 12px; flex-wrap: wrap; }
@media (max-width: 780px) { .contact-actions { justify-content: center; } }
.btn-primary {
  display: inline-flex; align-items: center; background: var(--accent);
  color: #0a0a0b; font-weight: 600; font-family: var(--mono); font-size: 12px;
  letter-spacing: 0.04em; padding: 14px 24px; border-radius: var(--radius); text-decoration: none;
}
.btn-primary:hover { background: #d4eb3c; }
.btn-secondary {
  display: inline-flex; align-items: center; font-family: var(--mono); font-size: 12px;
  letter-spacing: 0.04em; color: var(--text-2); background: none;
  border: 1px solid var(--border-hi); border-radius: var(--radius); padding: 14px 20px;
  cursor: pointer; text-decoration: none; transition: border-color 0.15s, color 0.15s;
}
.btn-secondary:hover { border-color: var(--accent); color: var(--text-1); }

.stamp-wrap { display: flex; justify-content: center; }
@media (max-width: 780px) { .stamp-wrap { margin-top: 8px; } }
.stamp {
  position: relative; width: 130px; height: 130px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  transform: rotate(-9deg); opacity: 0.92;
}
.stamp-ring { position: absolute; inset: 0; width: 100%; height: 100%; }
.stamp-text { font-family: var(--mono); font-size: 8.4px; letter-spacing: 0.12em; fill: var(--accent); }
.stamp-check {
  font-family: var(--serif); font-size: 38px; color: var(--accent);
  border: 2px solid var(--accent); border-radius: 50%;
  width: 52px; height: 52px; display: flex; align-items: center; justify-content: center; line-height: 1;
}
</style>