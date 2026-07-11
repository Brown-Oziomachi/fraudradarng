<script setup lang="ts">
useHead({ title: 'Help & Reporting — Fraud Radar NG' })

const officialChannels = [
  {
    name: 'Economic and Financial Crimes Commission',
    shortName: 'EFCC',
    logo: '/EFCC1.jpeg',
    role: 'Nigeria\u2019s federal agency for investigating financial crime, online fraud, advance fee fraud, and money laundering.',
    phone: '+234 809 332 2644',
    phoneAlt: '+234 9 904 4751',
    email: 'info@efcc.gov.ng',
    website: 'https://efcc.gov.ng',
    when: 'Money was sent to a fraudulent account, an investment scheme collapsed, or you have evidence identifying a fraudster.',
  },
  {
    name: 'Nigeria Police Force \u2014 National Cybercrime Centre',
    shortName: 'NPF-NCCC',
    logo: '/NPF.jpg',
    role: 'Handles hacking, phishing, identity theft, cyberstalking, and online banking fraud complaints.',
    phone: '+234 707 848 9293',
    email: 'support@nccc.npf.gov.ng',
    website: 'https://nccc.npf.gov.ng/ereport',
    when: 'Your account was hacked, you were impersonated online, or you were targeted by cyberstalking or a digital scam.',
  },
  {
    name: 'CBN Consumer Protection Department',
    shortName: 'CBN',
    logo: '/CPN.jpeg',
    role: 'Handles unresolved complaints against Nigerian banks and financial institutions \u2014 only after your bank itself has failed to resolve the issue within two weeks.',
    phone: '0700 225 5226',
    email: 'cpd@cbn.gov.ng',
    website: 'https://www.cbn.gov.ng/supervision/cpdcomgt.html',
    when: 'Your bank did not resolve a fraud dispute, reversal, or unauthorized transaction complaint within the required timeline.',
  },
  {
    name: 'Federal Competition and Consumer Protection Commission',
    shortName: 'FCCPC',
    logo: '/FCCPC.png',
    role: 'Nigeria\u2019s consumer protection regulator \u2014 handles vendor and product scams: fake goods, undelivered online orders, and predatory digital lenders, rather than direct bank account fraud.',
    phone: '0805 600 2020 \u00b7 0805 600 3030',
    email: 'contact@fccpc.gov.ng',
    website: 'https://complaints.fccpc.gov.ng',
    when: 'You paid for a product or service that was fake, never delivered, or came from a predatory digital lender.',
  },
  {
    name: 'Securities and Exchange Commission',
    shortName: 'SEC',
    logo: '/SEC.png',
    role: 'Regulates Nigeria\u2019s capital market and enforces the Investments and Securities Act 2025 against unregistered investment platforms and Ponzi schemes.',
    phone: '+234 (0)209 462 1168',
    phoneAlt: '+234 (0)916 772 3240 (WhatsApp)',
    email: 'sec@sec.gov.ng',
    website: 'https://sec.gov.ng/about/contact-us/',
    when: 'An investment platform promised fixed daily or weekly returns and stopped paying, or you suspect an unregistered scheme.',
  },
  {
    name: 'Nigerian Communications Commission \u2014 Consumer Affairs Bureau',
    shortName: 'NCC',
    logo: '/NCC.jpeg',
    role: 'Telecom regulator. Its Consumer Affairs Bureau handles SIM-swap, unauthorized porting, and telecom-linked fraud complaints, after your network operator has first failed to resolve it.',
    phone: 'Toll-free 622',
    phoneAlt: '+234-209-461-7000',
    website: 'https://consumer.ncc.gov.ng/consumer-complaints/complaint-form',
    when: 'Your SIM was swapped without your consent, or your line was used as part of a telecom-based fraud.',
  },
  {
    name: 'Independent Corrupt Practices Commission',
    shortName: 'ICPC',
    logo: '/ICPC.jpeg',
    role: 'Investigates corruption-linked offences, particularly cases involving a public official, public contract, or misuse of public funds.',
    phone: '0803 123 0280',
    phoneAlt: '0803 123 0281',
    email: 'info@icpc.gov.ng',
    website: 'https://icpc.gov.ng/petition',
    when: 'The fraud involves a government official, a public contract, or the misuse of public funds.',
  },
  {
    name: 'Nigeria Deposit Insurance Corporation',
    shortName: 'NDIC',
    logo: '/NDIC.png',
    role: 'Protects bank depositors and manages payouts when a licensed bank, microfinance bank, or mortgage institution is closed or fails.',
    phone: '0800 634 2 4357',
    email: 'info@ndic.gov.ng',
    website: 'https://ndic.gov.ng/',
    when: 'A licensed bank or microfinance institution you had funds with was shut down and you\u2019re owed an insured payout.',
  },
  {
    name: 'National Information Technology Development Agency',
    shortName: 'NITDA',
    logo: '/NITDA.jpg',
    role: 'Oversees IT policy and data protection \u2014 relevant when a scam involved a data breach or the unlawful use of your personal information.',
    email: 'info@nitda.gov.ng',
    website: 'https://nitda.gov.ng/',
    when: 'Your personal data was leaked, sold, or used without your consent as part of the scam.',
  },
  {
    name: 'National Association of Nigeria Travel Agencies',
    shortName: 'NANTA',
    logo: '/NANTA.png',
    role: 'Umbrella body for licensed travel agents. Runs the public member-verification portal used to confirm whether a travel or visa agent is genuine.',
    website: 'https://nanta.org.ng/',
    when: 'You\u2019re about to pay a travel or visa "agent" and want to verify they\u2019re a real, registered member before sending money.',
  },
  {
    name: 'Nigerian Financial Intelligence Unit',
    shortName: 'NFIU',
    logo: '/NFIU.jpeg',
    role: 'Receives suspicious-transaction reports from banks and other institutions as part of the national anti-money-laundering system. Not a walk-in complaints desk \u2014 most individual reports still go through your bank or the EFCC.',
    website: 'https://www.nfiu.gov.ng/',
    when: 'You suspect large-scale money laundering rather than a single fraud incident, and your bank has already been notified.',
  },
]

const steps = [
  {
    title: 'Contact your bank immediately',
    body: 'Call the fraud line printed on your card or your bank\u2019s verified app \u2014 never a number given to you during the incident. Ask for a transaction freeze and a formal dispute reference number.',
  },
  {
    title: 'File a report on Fraud Radar NG',
    body: 'Add the account, website, number, or company involved so the next person searching sees your warning before they lose anything. This takes a few minutes and does not require formal proof.',
  },
  {
    title: 'Report to the relevant official agency',
    body: 'Use the directory below. The right agency depends on what happened \u2014 a bank dispute, a cybercrime, or a financial crime with identifiable suspects.',
  },
  {
    title: 'Keep your reference numbers',
    body: 'Every official report should give you a tracking or case number. Save it \u2014 you will need it for any follow-up, and it is proof you reported promptly.',
  },
]

const heroTitle = 'Been defrauded? Here is exactly what to do.'
const heroWords = heroTitle.split(' ')

const sectionRefs = ref<HTMLElement[]>([])
function setSectionRef(el: any) {
  if (el) sectionRefs.value.push(el as HTMLElement)
}

let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer?.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  )
  sectionRefs.value.forEach((el) => observer?.observe(el))
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>

<template>
  <div>
    <!-- ============ FULL-BLEED HERO ============ -->
    <section class="help-hero">
      <div class="help-hero-bg" />
      <div class="help-hero-overlay" />

      <div class="help-hero-content">
        <div class="eyebrow">
          <span class="eyebrow-dot" /> Help &amp; Reporting
        </div>
        <h1 class="hero-title">
          <span
            v-for="(word, i) in heroWords"
            :key="i"
            class="word"
            :style="{ animationDelay: `${i * 0.05}s` }"
          >{{ word }}&nbsp;</span>
        </h1>
        <p class="hero-sub">
          Fraud Radar NG is a community awareness platform, not a law
          enforcement or financial regulatory body. This page points you to
          the official Nigerian agencies who can actually investigate,
          freeze funds, or pursue prosecution.
        </p>
      </div>

      <svg class="hero-curve" viewBox="0 0 1440 100" preserveAspectRatio="none">
        <path d="M0,0 C480,100 960,100 1440,0 L1440,100 L0,100 Z" fill="var(--bg)" />
      </svg>
    </section>

    <div class="page-shell">
      <section :ref="setSectionRef" class="disclaimer-box reveal">
        <div class="disclaimer-title">Before you continue</div>
        <p>
          Fraud Radar NG does not process, forward, or act on your behalf
          with any government agency. Reports filed here are for public
          community awareness only. For recovery of funds, investigation,
          or prosecution, you must contact the relevant official agency
          directly using the information below.
        </p>
      </section>

      <section :ref="setSectionRef" class="steps-section reveal">
        <h2 class="section-title">What to do, in order</h2>
        <div class="steps-list">
          <div v-for="(step, i) in steps" :key="step.title" class="step-row">
            <span class="step-index">{{ String(i + 1).padStart(2, '0') }}</span>
            <div>
              <h3 class="step-title">{{ step.title }}</h3>
              <p class="step-body">{{ step.body }}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="channels-section">
        <h2 class="section-title">Official reporting channels</h2>
       <p class="section-sub">
        We verify each contact directly from the agency's official website.
        If anything here ever looks outdated, trust what you find on their
        site over this page.
      </p>

        <div class="channel-list">
          <article
            v-for="(channel, i) in officialChannels"
            :key="channel.name"
            :ref="setSectionRef"
            class="channel-card reveal"
            :class="{ 'channel-card--reverse': i % 2 === 1 }"
          >
            <div class="channel-logo-wrap">
              <img :src="channel.logo" :alt="`${channel.shortName} logo`" class="channel-logo-img" />
              <div class="logo-fade" />
              <div class="logo-overlay">
                <span class="official-badge official-badge--onimage">Official</span>
                <span class="logo-shortname">{{ channel.shortName }}</span>
              </div>
            </div>

            <div class="channel-content">
              <h3 class="channel-name">{{ channel.name }}</h3>
              <p class="channel-role">{{ channel.role }}</p>

              <div class="channel-details">
                <div v-if="channel.phone" class="detail-row">
                  <span class="detail-label">Phone</span>
                  <span class="detail-value">
                    {{ channel.phone }}<span v-if="channel.phoneAlt"> &middot; {{ channel.phoneAlt }}</span>
                  </span>
                </div>
                <div v-if="channel.email" class="detail-row">
                  <span class="detail-label">Email</span>
                  <a :href="`mailto:${channel.email}`" class="detail-value detail-link">{{ channel.email }}</a>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Website</span>
                  <a :href="channel.website" target="_blank" rel="noopener noreferrer" class="detail-value detail-link">
                    {{ channel.website.replace('https://', '') }}
                  </a>
                </div>
              </div>

              <div class="channel-when">
                <span class="when-label">Use this if:</span> {{ channel.when }}
              </div>
            </div>
          </article>
        </div>
      </section>

      <section :ref="setSectionRef" class="cta-strip reveal">
        <h3 class="cta-title">Already contacted the right agency?</h3>
        <p class="cta-sub">File a report here on FRNG, so the next person searching this account or number sees your warning.</p>
        <NuxtLink to="/report/new" class="btn btn--accent">Report a scam</NuxtLink>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* ============ HERO ============ */
.help-hero {
  position: relative;
  overflow: hidden;
  min-height: 460px;
  display: flex;
  align-items: center;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.help-hero-bg {
  position: absolute;
  inset: 0;
  background-image: url('/trusts.png');
  background-size: cover;
  background-position: center;
  filter: grayscale(15%);
  z-index: 0;
}

.help-hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    100deg,
    rgba(10,10,11,0.95) 0%,
    rgba(10,10,11,0.8) 45%,
    rgba(10,10,11,0.4) 100%
  );
  z-index: 1;
}

.help-hero-content {
  position: relative;
  z-index: 2;
  max-width: 1120px;
  margin: 0 auto;
  padding: 90px 24px 210px;
  width: 100%;
  
}


@media (max-width: 640px) {
  .help-hero { min-height: 400px; }
  .help-hero-content { padding: 60px 20px 90px; }
  .help-hero-overlay {
    background: linear-gradient(180deg, rgba(10,10,11,0.92) 0%, rgba(10,10,11,0.6) 100%);
  }
}

.eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: var(--mono); font-size: 11px; letter-spacing: 0.12em;
  text-transform: uppercase; color: #4ade80; margin-bottom: 20px;
  font-weight: 600;
}
.eyebrow-dot {
  width: 6px; height: 6px; background: #4ade80; border-radius: 50%;
  animation: dot-pulse 2.2s ease-out infinite;
}
@keyframes dot-pulse {
  0% { box-shadow: 0 0 0 0 rgba(74,222,128,0.55); }
  70% { box-shadow: 0 0 0 10px transparent; }
  100% { box-shadow: 0 0 0 0 transparent; }
}

.hero-title {
  font-family: var(--serif);
  font-weight: 700;
  font-size: clamp(49px, 5.5vw, 78px);
  color: #fff;
  line-height: 1.1;
  letter-spacing: -0.01em;
  margin-bottom: 20px;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.word {
  display: inline-block;
  opacity: 0;
  transform: translateY(16px);
  animation: word-rise 0.6s ease forwards;
}
@keyframes word-rise {
  to { opacity: 1; transform: translateY(0); }
}

.hero-sub {
  font-size: 15px;
  color: rgba(230,230,230,0.92);
  line-height: 1.75;
  font-weight: 300;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.hero-curve {
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 60px;
  z-index: 2;
  display: block;
}

/* ============ PAGE SHELL ============ */
.page-shell {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 24px 100px;
}

.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}
.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.disclaimer-box {
  margin-top: 40px;
  padding: 24px 26px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-left: 4px solid #4ade80;
  border-radius: var(--radius);
}
.disclaimer-title {
  font-family: var(--mono);
  font-size: 12px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #4ade80;
  font-weight: 700;
  margin-bottom: 12px;
}
.disclaimer-box p {
  font-size: 14.5px;
  color: var(--text-1);
  line-height: 1.75;
  font-weight: 400;
}

.section-title {
  font-family: var(--serif);
  font-size: clamp(24px, 3vw, 30px);
  font-weight: 700;
  color: var(--text-1);
  margin-bottom: 10px;
}
.section-sub {
  font-size: 14.5px;
  color: var(--text-2);
  line-height: 1.7;
  font-weight: 400;
  margin-bottom: 28px;
  max-width: 640px;
}

.steps-section { margin-top: 64px; }
.steps-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 28px;
}
.step-row {
  display: flex;
  gap: 20px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border);
}
.step-row:last-child { border-bottom: none; padding-bottom: 0; }
.step-index {
  font-family: var(--mono);
  font-size: 18px;
  color: var(--accent);
  font-weight: 800;
  flex-shrink: 0;
  padding-top: 2px;
}
.step-title {
  font-family: var(--serif);
  font-size: 19px;
  font-weight: 700;
  color: var(--text-1);
  margin-bottom: 8px;
}
.step-body {
  font-size: 14.5px;
  color: var(--text-2);
  line-height: 1.7;
  font-weight: 400;
}

/* ============ CHANNEL CARDS: side-by-side, alternating left/right ============ */
.channels-section { margin-top: 64px; }

.channel-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.channel-card {
  display: grid;
  grid-template-columns: 42% 58%;
  gap: 0;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: calc(var(--radius) + 4px);
  overflow: hidden;
  transition: border-color 0.25s ease, transform 0.25s ease;
}
.channel-card:hover {
  border-color: var(--border-hi);
  transform: translateY(-3px);
}
.channel-card--reverse {
  grid-template-columns: 58% 42%;
}
.channel-card--reverse .channel-logo-wrap {
  order: 2;
}
.channel-card--reverse .channel-content {
  order: 1;
}
.channel-card--reverse .logo-fade {
  background: linear-gradient(to left, var(--surface) 0%, transparent 35%);
}
.channel-card--reverse .logo-overlay {
  align-items: flex-end;
  text-align: right;
}

@media (max-width: 720px) {
  .channel-card,
  .channel-card--reverse {
    grid-template-columns: 1fr;
  }
  .channel-card--reverse .channel-logo-wrap,
  .channel-card--reverse .channel-content {
    order: initial;
  }
  .channel-card--reverse .logo-fade {
    background: linear-gradient(to top, var(--surface) 0%, transparent 35%);
  }
  .channel-logo-wrap { min-height: 220px; }
}

.channel-logo-wrap {
  position: relative;
  min-height: 260px;
  overflow: hidden;
}
.channel-logo-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}

.logo-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 20px;
  gap: 10px;
  background: linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.55) 100%);
}
.official-badge {
  display: inline-block;
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 3px;
  background: rgba(74, 222, 128, 0.12);
  color: #4ade80;
  border: 1px solid rgba(74, 222, 128, 0.35);
}
.official-badge--onimage {
  background: rgba(74, 222, 128, 0.16);
  color: #4ade80;
  border-color: rgba(74, 222, 128, 0.5);
  backdrop-filter: blur(4px);
}
.logo-shortname {
  font-family: var(--serif);
  font-weight: 800;
  font-size: 30px;
  color: #fff;
  text-shadow: 0 2px 12px rgba(0,0,0,0.6);
  letter-spacing: -0.01em;
}

.channel-content {
  padding: 28px 30px;
}
.channel-name {
  font-family: var(--serif);
  font-size: 21px;
  font-weight: 700;
  color: var(--text-1);
  line-height: 1.3;
  margin-bottom: 12px;
}
.channel-role {
  font-size: 14px;
  color: var(--text-2);
  line-height: 1.65;
  font-weight: 400;
  margin-bottom: 20px;
}

.channel-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: calc(var(--radius) - 2px);
  margin-bottom: 18px;
}
.detail-row {
  display: flex;
  gap: 10px;
  font-size: 13.5px;
}
.detail-label {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-3);
  width: 60px;
  flex-shrink: 0;
  padding-top: 1px;
  font-weight: 600;
}
.detail-value { color: var(--text-1); font-weight: 500; }
.detail-link { text-decoration: underline; color: var(--text-1); }
.detail-link:hover { color: var(--accent); }

.channel-when {
  font-size: 13px;
  color: var(--text-2);
  line-height: 1.65;
  font-weight: 400;
}
.when-label {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text-3);
  margin-right: 4px;
  font-weight: 700;
}

/* ============ CTA ============ */
.cta-strip {
  margin-top: 64px;
  text-align: center;
  padding: 48px 24px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
}
.cta-title {
  font-family: var(--serif);
  font-size: 23px;
  font-weight: 700;
  color: var(--text-1);
  margin-bottom: 10px;
}
.cta-sub {
  font-size: 14px;
  color: var(--text-2);
  font-weight: 400;
  margin-bottom: 24px;
}
.btn {
  display: inline-flex; align-items: center; font-family: var(--mono);
  font-size: 13px; font-weight: 700; letter-spacing: 0.05em;
  padding: 14px 28px; border-radius: var(--radius); border: none;
  text-decoration: none;
  transition: background 0.15s ease, transform 0.15s ease;
}
.btn--accent { background: var(--accent); color: #0a0a0b; }
.btn--accent:hover { background: #d4eb3c; transform: translateY(-2px); }

@media (prefers-reduced-motion: reduce) {
  .word, .reveal, .eyebrow-dot {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
}
</style>