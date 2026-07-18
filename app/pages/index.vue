<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'

useSeoMeta({
  title: 'Fraud Radar NG',
  description: 'Help protect citizens by flagging ongoing internet fraud immediately.',

  ogTitle: 'Alert: Active Phishing Campaign Flagged',
  ogDescription: 'Read the structural breakdown of this scam on Fraud Radar.',
  ogImage: 'https://fraudradar.ng/FRLOGO.png',
  ogType: 'website',
  ogSiteName: 'Fraud Radar NG',
  ogLocale: 'en_NG',

  twitterCard: 'summary_large_image',
  twitterTitle: 'Alert: Active Phishing Campaign Flagged — FRNG',
  twitterDescription: 'Help protect citizens by flagging ongoing internet fraud immediately.',
  twitterImage: 'https://fraudradar.ng/FRLOGO.png',
  twitterCreator: '@FraudRadarNG',

  robots: 'index, follow',
  author: 'Fraud Radar NG Security Team'
})

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

const { data } = await useLazyFetch<{ reports: any[]; nextCursor: string | null }>('/api/reports', {
  default: () => ({ reports: [], nextCursor: null })
})

const validReports = computed(() => data.value?.reports ?? [])

const fallbackTicker = [
  'Fintech USSD impersonation — reported Lagos',
  'Fake investment scheme — reported Abuja',
  'Cloned e-commerce storefront — reported Port Harcourt',
  'Job offer advance-fee scam — reported Ibadan',
  'Romance scam wallet tag — reported Kano'
]

const tickerItems = computed(() => {
  const items = validReports.value
    .slice(0, 8)
    .map((r) => r?.companyName || r?.websiteUrl || r?.title || r?.category)
    .filter(Boolean)
  return items.length ? items : fallbackTicker
})

const tickerLoop = computed(() => [...tickerItems.value, ...tickerItems.value])

const stats = [
  { target: 1240, label: 'Reports filed', suffix: '+' },
  { target: 36, label: 'States covered', suffix: '' },
  { target: 900, label: 'Accounts flagged', suffix: '+' },
  { target: 24, label: 'Hour monitoring', suffix: '/7' }
]

function animateCount(el: Element, target: number) {
  const duration = 1300
  const start = performance.now()
  function tick(now: number) {
    const progress = Math.min((now - start) / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    el.textContent = Math.floor(eased * target).toLocaleString('en-NG')
    if (progress < 1) requestAnimationFrame(tick)
    else el.textContent = target.toLocaleString('en-NG')
  }
  requestAnimationFrame(tick)
}

const toolkitFeatures = [
  {
    title: 'Threat Registry Lookup',
    body: 'Search any bank account, phone number, company name or website before you pay. See every prior report tied to it in seconds.',
    linkText: 'Search the registry',
    linkTo: '/lookupsearch',
    iconHtml: '<circle cx="10.5" cy="10.5" r="6.5"/><line x1="15.3" y1="15.3" x2="20" y2="20"/>'
  },
  {
    title: 'File a Report in Minutes',
    body: 'A guided, multi-step form captures the account details, screenshots and story — so the next person searching sees the full pattern, not just a name.',
    linkText: 'Report a scam',
    linkTo: '/report/new',
    iconHtml: '<path d="M5 3v18"/><path d="M5 4h11l-2 4 2 4H5"/>'
  },
  {
    title: 'Live Community Alerts',
    body: 'Newly flagged accounts and emerging scam patterns surface immediately across the network — built from real reports filed by real Nigerians, hour by hour.',
    linkText: 'See recent activity',
    linkTo: '/reports',
    iconHtml: '<path d="M12 4a7 7 0 0 1 7 7v4l1.5 3h-17L5 15v-4a7 7 0 0 1 7-7z"/><path d="M9.5 20a2.5 2.5 0 0 0 5 0"/>'
  },
  {
    title: 'Guides & Domain Safety',
    body: 'Deep-dive breakdowns of how specific scam types work, an interactive domain-safety quiz, and verified contacts for EFCC, CBN, SEC and other agencies.',
    linkText: 'Browse guides',
    linkTo: '/guides',
    iconHtml: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 5.5v15"/>'
  }
]

const scamModalOpen = ref(false)
function openScamModal() {
  scamModalOpen.value = true
}
function closeScamModal() {
  scamModalOpen.value = false
}

const annotatedMessage = [
  { text: 'Dear Customer, ', flag: null },
  { text: 'your account will be permanently blocked in 30 minutes', flag: 1 },
  { text: ' unless you ', flag: null },
  { text: 'verify your BVN immediately', flag: 2 },
  { text: ' via this link: bit.ly/xxxxx. ', flag: 3 },
  { text: 'Do not share this message with anyone, including bank staff.', flag: 4 },
  { text: ' Reply "YES" now to avoid suspension.', flag: 5 }
]

const flagLegend = [
  { n: 1, label: 'Manufactured urgency', body: 'A short, specific deadline is designed to trigger panic before you have time to verify anything.' },
  { n: 2, label: 'Sensitive-data request', body: 'Your BVN, PIN, OTP or full card number should never be requested by SMS, call, or link — no legitimate bank asks this way.' },
  { n: 3, label: 'Shortened / disguised link', body: 'Shortened links hide the real destination. Real institutions link to their own verified domain, never a generic shortener.' },
  { n: 4, label: 'Instruction to stay silent', body: 'Isolating you from anyone who might warn you — a bank, a friend, a colleague — is one of the clearest fraud signals there is.' },
  { n: 5, label: 'Fake engagement bait', body: '"Reply YES" simply confirms your number is active and reachable, marking you for further targeting.' }
]

/* ============================================================
   NEW: Fraud Files — expandable, click-to-reveal lessons across
   technology, politics, everyday life and devices.
   ============================================================ */
const fraudFiles = reactive([
  {
    key: 'technology',
    title: 'Technology',
    tagline: 'Where the fraud usually starts first',
    iconHtml: '<rect x="6" y="6" width="12" height="12" rx="1.5"/><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"/>',
    open: false,
    items: [
      { title: 'Cloned voices, real panic', body: 'AI voice-cloning tools can now recreate a familiar voice from seconds of audio — used to fake a distress call from a "relative" or "boss" demanding an urgent transfer.', revealed: false },
      { title: 'Investment apps with fake growth', body: 'Some trading apps display fabricated, ever-rising balances to encourage bigger deposits — the number on screen was never connected to a real market.', revealed: false },
      { title: 'SIM-swap takeovers', body: 'Weak carrier verification lets a fraudster port your number to a new SIM, silently intercepting the OTPs your bank sends to confirm transfers.', revealed: false },
      { title: 'Look-alike banking apps', body: 'Fake APKs shared outside official app stores mimic real banking apps closely enough to harvest your login the moment you type it in.', revealed: false }
    ]
  },
  {
    key: 'politics',
    title: 'Politics',
    tagline: 'Where trust in institutions is the target',
    iconHtml: '<path d="M12 3l8 4v2H4V7z"/><path d="M5 9v9M9 9v9M15 9v9M19 9v9"/><path d="M3 20h18"/>',
    open: false,
    items: [
      { title: '"Government scheme" processing fees', body: 'Fake palliative, grant or empowerment scheme pages ask for a small "processing" or "verification" fee before a payout that never arrives.', revealed: false },
      { title: 'Cloned charity drives', body: 'During elections, disasters or crises, fraudsters mirror real NGO branding almost exactly, redirecting donations to personal accounts.', revealed: false },
      { title: 'Impersonated officials', body: 'A call or WhatsApp message claiming to be from an agency or office, threatening arrest or asset freeze unless a sum is paid immediately — real agencies do not collect fines this way.', revealed: false },
      { title: 'Fake "verification portals"', body: 'Election-period misinformation is used to funnel people toward lookalike portals that harvest personal or financial data under the guise of civic verification.', revealed: false }
    ]
  },
  {
    key: 'life',
    title: 'Everyday life',
    tagline: 'Where patience is the weapon',
    iconHtml: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7"/>',
    open: false,
    items: [
      { title: 'Romance scams played long', body: 'Relationships built over weeks or months, moved off-platform early, followed by a staged emergency that always needs money fast.', revealed: false },
      { title: 'Pay-to-work job offers', body: 'Legitimate employers do not charge you for "training kits," "clearance," or "certification" before your first day.', revealed: false },
      { title: 'Land sold more than once', body: 'The same plot gets sold to several buyers using forged or duplicated documents — always verify at the land registry, not just with the seller.', revealed: false },
      { title: '"Your package is held" messages', body: 'Fake courier or customs texts claim a parcel is stuck pending a small release fee — a lure that costs nothing to send to thousands of people at once.', revealed: false }
    ]
  },
  {
    key: 'devices',
    title: 'Devices',
    tagline: 'Where the smallest habits matter most',
    iconHtml: '<rect x="7" y="2" width="10" height="20" rx="2"/><line x1="11" y1="18" x2="13" y2="18"/>',
    open: false,
    items: [
      { title: 'Juice-jacking at public kiosks', body: 'Public USB charging cables and kiosks can, in rare cases, be rigged to copy data or push malware while your phone charges — a personal power bank avoids the risk entirely.', revealed: false },
      { title: 'Swapped QR codes', body: 'A fraudulent QR sticker placed over a real one at a POS terminal, parking meter, or menu can redirect payment to a stranger\u2019s wallet.', revealed: false },
      { title: 'Skimmers and shoulder-surfing', body: 'Card skimmers on ATMs and POS machines, paired with someone simply watching you type your PIN, remain one of the oldest tricks still working today.', revealed: false },
      { title: 'Pre-loaded malware on cheap phones', body: 'Some heavily discounted or informally "refurbished" phones ship with spyware already installed, active before you\u2019ve entered a single password.', revealed: false }
    ]
  }
])

function toggleCategory(key: string) {
  const cat = fraudFiles.find((c) => c.key === key)
  if (cat) cat.open = !cat.open
}

function revealItem(catKey: string, idx: number) {
  const cat = fraudFiles.find((c) => c.key === catKey)
  const item = cat?.items[idx]
  if (item) item.revealed = true
}

/* ============================================================
   NEW: Live-signal toast — a single, dismissible nudge shown
   once per session, not a repeating annoyance.
   ============================================================ */
const showToast = ref(false)
let toastTimer: ReturnType<typeof setTimeout> | null = null

function dismissToast() {
  showToast.value = false
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('frng_toast_seen', '1')
  }
}

/* ============================================================
   NEW: Exit-intent check — "before you send that transfer".
   Fires once per session when the cursor leaves toward the
   top of the viewport (desktop only).
   ============================================================ */
const exitModalOpen = ref(false)

function handleMouseLeave(e: MouseEvent) {
  if (e.clientY > 0) return
  if (typeof window === 'undefined') return
  if (window.localStorage.getItem('frng_exit_seen')) return
  exitModalOpen.value = true
  window.localStorage.setItem('frng_exit_seen', '1')
}

function closeExitModal() {
  exitModalOpen.value = false
}

onMounted(() => {
  if (typeof window === 'undefined') return

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'))
    document.querySelectorAll('.stat-number[data-target]').forEach((el) => {
      el.textContent = Number((el as HTMLElement).dataset.target || 0).toLocaleString('en-NG')
    })
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            revealObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    )
    document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el))

    const statObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = Number((entry.target as HTMLElement).dataset.target || 0)
            animateCount(entry.target, target)
            statObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.4 }
    )
    document.querySelectorAll('.stat-number[data-target]').forEach((el) => statObserver.observe(el))
  }

  // Live-signal toast, once per session
  if (!window.localStorage.getItem('frng_toast_seen')) {
    toastTimer = setTimeout(() => {
      showToast.value = true
    }, 15000)
  }

  // Exit-intent, desktop pointer only
  if (window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mouseleave', handleMouseLeave)
  }
})

onUnmounted(() => {
  if (typeof window === 'undefined') return
  document.removeEventListener('mouseleave', handleMouseLeave)
  if (toastTimer) clearTimeout(toastTimer)
})
</script>

<template>
  <section class="hero">
    <div class="hero-bg-image" />
    <div class="hero-overlay" />
    <div class="hero-scanline" aria-hidden="true" />
    <svg class="hero-radar" viewBox="0 0 200 200" aria-hidden="true">
      <circle cx="100" cy="100" r="70" class="radar-ring" />
      <circle cx="100" cy="100" r="46" class="radar-ring" />
      <circle cx="100" cy="100" r="22" class="radar-ring" />
      <g class="radar-sweep">
        <path d="M100 100 L100 30 A70 70 0 0 1 149.5 129.5 Z" fill="url(#sweepGradient)" />
      </g>
      <defs>
        <linearGradient id="sweepGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.35" />
          <stop offset="100%" stop-color="var(--accent)" stop-opacity="0" />
        </linearGradient>
      </defs>
    </svg>

    <div class="hero-content">
      <div class="hero-copy">
        <h1 class="hero-title">
          <span class="hero-title-line hero-anim hero-anim--1">FRNG</span>
          <span class="hero-title-line hero-title-line--accent hero-anim hero-anim--2">Report. Check. Protect.</span>
        </h1>

        <p class="hero-subtext hero-anim hero-anim--3">
          The scam that hit them yesterday is coming for you today.
        </p>

        <div class="hero-actions hero-anim hero-anim--4">
          <NuxtLink to="/report/new" class="btn btn--pill btn--accent">
            File a Report
          </NuxtLink>
          <NuxtLink to="/lookupsearch" class="btn btn--pill btn--outline">
            Search Registry
          </NuxtLink>
          <button type="button" class="btn btn--pill btn--ghost" @click="openScamModal">
            See a scam, annotated
          </button>
        </div>
      </div>
    </div>
  </section>

  <div id="live-signal" class="ticker-bar" role="status" aria-label="Recently flagged reports">
    <span class="ticker-tag">
      <span class="ticker-dot" />
      Live signal
    </span>
    <div class="ticker-track">
      <div class="ticker-content">
        <span v-for="(item, i) in tickerLoop" :key="i" class="ticker-item">
          {{ item }}
          <span class="ticker-sep">•</span>
        </span>
      </div>
    </div>
  </div>

  <section class="stats-strip reveal">
    <div class="stat-block" v-for="stat in stats" :key="stat.label">
      <div class="stat-number-wrap">
        <span class="stat-number" :data-target="stat.target">0</span><span class="stat-suffix">{{ stat.suffix }}</span>
      </div>
      <div class="stat-label">{{ stat.label }}</div>
    </div>
  </section>

  <!-- ============ TOOLKIT — solutions-style card list ============ -->
  <section class="toolkit-section reveal">
    <div class="toolkit-frame">
      <span class="toolkit-tab">What Fraud Radar NG gives you</span>

      <div class="toolkit-grid">
        <div class="toolkit-list">
          <div v-for="feature in toolkitFeatures" :key="feature.title" class="toolkit-item">
            <div class="toolkit-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"
                stroke-linejoin="round" v-html="feature.iconHtml" />
            </div>
            <div class="toolkit-copy">
              <h3 class="toolkit-item-title">{{ feature.title }}</h3>
              <p class="toolkit-item-body">
                {{ feature.body }}
                <NuxtLink v-if="feature.linkTo.startsWith('/')" :to="feature.linkTo" class="toolkit-link">{{
                  feature.linkText }}</NuxtLink>
                <a v-else :href="feature.linkTo" class="toolkit-link">{{ feature.linkText }}</a>
              </p>
            </div>
          </div>
        </div>

        <div class="toolkit-image-col">
          <img src="/radar2.png" alt="Verifying a transfer before sending money" class="toolkit-image" />
        </div>
      </div>
    </div>
  </section>

  <section class="illustration-section reveal">
    <div class="eyebrow">
      <span class="eyebrow-dot" />
      How the scam usually works
    </div>
    <h2 class="how-title">The pattern repeats because it works.</h2>

    <div class="how-layout">
      <div class="how-image-col">
        <img src="/trusts.png" alt="How the scam pattern unfolds" class="how-image" />
      </div>

      <div class="steps-list">
        <div v-for="(step, i) in scamSteps" :key="step.number" class="step-row reveal"
          :style="{ transitionDelay: `${i * 90}ms` }">
          <div class="step-number">{{ step.number }}</div>
          <div class="step-text">
            <div class="step-title">{{ step.title }}</div>
            <p class="step-body">{{ step.body }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ ANNOTATED SCAM CALLOUT ============ -->
  <section class="scam-callout-section reveal">
    <div class="scam-callout">
      <div class="scam-callout-copy">
        <div class="eyebrow">
          <span class="eyebrow-dot" />
          Recognize it instantly
        </div>
        <h2 class="scam-callout-title">Every scam message uses the same five tricks.</h2>
        <p class="scam-callout-body">
          Strip away the bank name, the app name, the platform — and almost every fraud message
          leans on the same handful of pressure tactics. Learn to spot them once, and you'll
          recognize them everywhere: text, WhatsApp, email, even phone calls.
        </p>
        <button type="button" class="btn btn--accent" @click="openScamModal">
          Break down a real example
        </button>
      </div>
      <div class="scam-callout-preview" @click="openScamModal">
        <div class="preview-bubble">
          <span>Dear Customer, your account will be <mark>permanently blocked</mark> in 30 minutes unless you
            <mark>verify your BVN</mark>&hellip;</span>
        </div>
        <span class="preview-hint">Tap to annotate →</span>
      </div>
    </div>
  </section>

  <section class="about-section reveal">
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

  <section class="map-section reveal">
    <div class="map-inner">
      <div class="eyebrow eyebrow--dark" style="justify-content: center;">
        <span class="eyebrow-dot" />
        One network, thirty-six states
      </div>
      <h2 class="map-title">Every report strengthens the radar.</h2>
      <img src="/state.png" alt="Fraud Radar NG — Detect, Verify, Protect" class="map-image" />
    </div>
  </section>

  <section class="lessons-section reveal">
    <div class="eyebrow">
      <span class="eyebrow-dot" />
      What every Nigerian should know
    </div>
    <h2 class="lessons-title">Fraud relies on speed. Slow down and it usually falls apart.</h2>

    <div class="lessons-grid">
      <div v-for="(lesson, i) in lessons" :key="lesson.title" class="lesson-card reveal"
        :style="{ transitionDelay: `${i * 90}ms` }">
        <div class="lesson-title">{{ lesson.title }}</div>
        <p class="lesson-body">{{ lesson.body }}</p>
      </div>
    </div>

    <a href="/guides" target="_blank" rel="noopener noreferrer" class="blog-callout reveal">
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

  <!-- ============ FRAUD FILES — deep-dive accordion ============ -->
  <section class="fraud-files-section reveal">
    <div class="eyebrow eyebrow--dark">
      <span class="eyebrow-dot" />
      The fraud files
    </div>
    <h2 class="fraud-files-title">Exposed: how it plays out across technology, politics, everyday life and your devices.
    </h2>
    <p class="fraud-files-subtitle">
      Tap a category to open it, then tap a lesson to reveal it. Nothing here is theoretical —
      every pattern below has already shown up in reports filed on this platform.
    </p>

    <div class="fraud-files-grid">
      <div v-for="cat in fraudFiles" :key="cat.key" class="fraud-category" :class="{ 'is-open': cat.open }">
        <button type="button" class="fraud-category-head" @click="toggleCategory(cat.key)">
          <span class="fraud-category-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"
              stroke-linejoin="round" v-html="cat.iconHtml" />
          </span>
          <span class="fraud-category-heading">
            <span class="fraud-category-title">{{ cat.title }}</span>
            <span class="fraud-category-tagline">{{ cat.tagline }}</span>
          </span>
          <span class="fraud-category-chevron">{{ cat.open ? '−' : '+' }}</span>
        </button>

        <div v-show="cat.open" class="fraud-category-body">
          <button v-for="(item, idx) in cat.items" :key="item.title" type="button" class="fraud-item"
            :class="{ 'is-revealed': item.revealed }" @click="!item.revealed && revealItem(cat.key, idx)">
            <div class="fraud-item-title">{{ item.title }}</div>
            <p class="fraud-item-body">{{ item.body }}</p>
            <span v-if="!item.revealed" class="fraud-item-lock">Tap to reveal</span>
          </button>
        </div>
      </div>
    </div>
  </section>

  <div class="reveal">
    <FlaggedAccountsList :reports="validReports" />
  </div>

  <section class="registry-context reveal">
    <div class="context-intro">
      <span class="context-eyebrow">
        <span class="dot" /> Why this matters
      </span>
      <h2 class="context-title">
        Fraud spreads faster than warnings do.
      </h2>
      <p class="context-body">
        By the time a scam account gets flagged on social media, dozens of
        people may have already sent money. The <NuxtLink to="/lookupsearch" class="threat-body">Threat Registry
        </NuxtLink> closes that
        gap — every report filed by someone who got scammed becomes a shield
        for the next person about to make the same transfer.
      </p>
      <p class="context-body">
        Whether it's a bank account, a company claiming to be an investment
        firm, or a website posing as a legitimate business, checking first
        takes seconds. Losing money to a scam that was already reported
        takes a lot longer to recover from.
      </p>
    </div>

    <ThreatRegistryPromo />
  </section>

  <!-- ============ ANNOTATED SCAM MODAL ============ -->
  <Teleport to="body">
    <div v-if="scamModalOpen" class="modal-overlay" @click.self="closeScamModal">
      <div class="modal-card" role="dialog" aria-modal="true" aria-label="Annotated scam message example">
        <button type="button" class="modal-close" @click="closeScamModal" aria-label="Close">×</button>
        <div class="modal-eyebrow">Composite example — not a real message</div>
        <h3 class="modal-title">Annotated: the five-trick scam text</h3>
        <div class="modal-message">
          <span v-for="(part, i) in annotatedMessage" :key="i">
            <mark v-if="part.flag" class="flag-mark" :class="`flag-${part.flag}`">{{ part.text }}<sup>{{ part.flag
                }}</sup></mark>
            <template v-else>{{ part.text }}</template>
          </span>
        </div>
        <div class="modal-legend">
          <div v-for="f in flagLegend" :key="f.n" class="legend-row">
            <span class="legend-num" :class="`flag-${f.n}`">{{ f.n }}</span>
            <div>
              <div class="legend-label">{{ f.label }}</div>
              <p class="legend-body">{{ f.body }}</p>
            </div>
          </div>
        </div>
        <NuxtLink to="/lookupsearch" class="btn btn--accent modal-cta" @click="closeScamModal">
          Check a number or account now
        </NuxtLink>
      </div>
    </div>
  </Teleport>

  <!-- ============ EXIT-INTENT MODAL ============ -->
  <Teleport to="body">
    <div v-if="exitModalOpen" class="modal-overlay" @click.self="closeExitModal">
      <div class="modal-card modal-card--small" role="dialog" aria-modal="true" aria-label="Before you go">
        <button type="button" class="modal-close" @click="closeExitModal" aria-label="Close">×</button>
        <div class="modal-eyebrow">Before you send that transfer</div>
        <h3 class="modal-title">Three questions, ten seconds.</h3>
        <ul class="exit-checklist">
          <li>Were you pressured to act fast?</li>
          <li>Were you told to keep it secret?</li>
          <li>Have you checked this account on the registry?</li>
        </ul>
        <div class="modal-actions">
          <NuxtLink to="/lookupsearch" class="btn btn--accent" @click="closeExitModal">Check the registry</NuxtLink>
          <button type="button" class="btn btn--outline-dark" @click="closeExitModal">I'll check first</button>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- ============ LIVE-SIGNAL TOAST ============ -->
  <Teleport to="body">
    <div v-if="showToast" class="toast">
      <span class="toast-dot" />
      <div class="toast-text">
        <div class="toast-title">New report just filed</div>
        <div class="toast-body">{{ tickerItems[0] }}</div>
      </div>
      <NuxtLink to="/lookupsearch" class="toast-link" @click="dismissToast">View</NuxtLink>
      <button type="button" class="toast-close" @click="dismissToast" aria-label="Dismiss">×</button>
    </div>
  </Teleport>
</template>

<style scoped>
.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--mono);
  font-size: 20px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 16px;
}

.eyebrow-dot {
  width: 5px;
  height: 5px;
  background: var(--accent);
  border-radius: 50%;
}

/* ============ SCROLL REVEAL ============ */
.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.7s cubic-bezier(0.2, 0.7, 0.2, 1), transform 0.7s cubic-bezier(0.2, 0.7, 0.2, 1);
  will-change: opacity, transform;
}

.reveal.is-visible {
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  .reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }
}

/* HERO */
.hero {
  position: relative;
  overflow: hidden;
  min-height: 640px;
  display: flex;
  align-items: center;
  border-radius: 0 0 48px 48px;
}

.hero-bg-image {
  position: absolute;
  inset: 0;
  background-image: url('/FRNGLOGOO.png');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  z-index: 0;
  filter: brightness(0.5) saturate(0.85);
  animation: heroKenBurns 22s ease-in-out infinite alternate;
  will-change: transform;
}

@keyframes heroKenBurns {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(1.08);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-bg-image {
    animation: none;
  }
}



.hero-scanline {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(to bottom,
      transparent 0%,
      color-mix(in srgb, var(--accent) 10%, transparent) 50%,
      transparent 100%);
  height: 40%;
  animation: scanDrift 7s linear infinite;
  pointer-events: none;
}

@keyframes scanDrift {
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }

  10% {
    opacity: 1;
  }

  90% {
    opacity: 1;
  }

  100% {
    transform: translateY(250%);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-scanline {
    animation: none;
    opacity: 0;
  }
}

.hero-radar {
  position: absolute;
  z-index: 1;
  top: 24px;
  right: 24px;
  width: 150px;
  height: 150px;
  opacity: 0.55;
  pointer-events: none;
}

.radar-ring {
  fill: none;
  stroke: color-mix(in srgb, var(--accent) 45%, transparent);
  stroke-width: 1;
}

.radar-sweep {
  transform-origin: 100px 100px;
  animation: radarSpin 4.5s linear infinite;
}

@keyframes radarSpin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 720px) {
  .hero-radar {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .radar-sweep {
    animation: none;
  }
}

.hero-content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 100px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 900px) {
  .hero {
    min-height: 480px;
  }

  .hero-bg-image {
    background-position: center 30%;
  }

  .hero-content {
    padding: 48px 20px;
    min-height: 480px;
  }
}

@media (max-width: 640px) {
  .hero {
    min-height: 440px;
  }

  .hero-content {
    padding: 40px 20px;
  }

  .hero-title-line {
    font-size: 32px;
  }
}

@media (max-width: 420px) {
  .hero {
    min-height: 400px;
  }

  .hero-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .hero-actions .btn {
    justify-content: center;
    width: 100%;
  }
}

.hero-copy {
  max-width: 780px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.hero-title {
  width: 100%;
  line-height: 1.05;
}

.hero-title-line {
  display: block;
  width: 100%;
  text-align: center;
  font-family: var(--serif);
  font-size: clamp(48px, 6vw, 70px);
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.5);
}

.hero-title-line--accent {
  text-shadow: 0 2px 16px color-mix(in srgb, var(--accent) 45%, transparent);
}

.hero-subtext {
  width: 100%;
  max-width: 620px;
  margin: 20px auto 0;
  text-align: center;
  font-size: 17px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 400;
  line-height: 1.6;
  font-family: var(--mono);
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.45);
}

.hero-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 14px;
  margin-top: 32px;
  flex-wrap: wrap;
  width: 100%;
}

.hero-anim {
  opacity: 0;
  transform: translateY(18px);
  animation: heroFadeUp 0.7s ease forwards;
}

.hero-anim--1 {
  animation-delay: 0.05s;
}

.hero-anim--2 {
  animation-delay: 0.2s;
}

.hero-anim--3 {
  animation-delay: 0.35s;
}

.hero-anim--4 {
  animation-delay: 0.5s;
}

@keyframes heroFadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-anim {
    opacity: 1;
    transform: none;
    animation: none;
  }
}

.btn--pill {
  border-radius: 999px;
  padding: 14px 32px;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.15s, border-color 0.15s;
}

.btn--pill.btn--accent {
  background: var(--accent);
  border-color: var(--accent);
  color: #0a0a0b;
  font-weight: 700;
}

.btn--pill.btn--accent:hover {
  background: #d4eb3c;
  border-color: #d4eb3c;
  transform: translateY(-3px);
  box-shadow: 0 12px 28px color-mix(in srgb, var(--accent) 45%, transparent);
}

.btn--pill.btn--outline {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.5);
  color: #fff;
  font-weight: 600;
}

.btn--pill.btn--outline:hover {
  border-color: var(--accent);
  color: var(--accent);
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(255, 255, 255, 0.08);
}

.btn--pill.btn--ghost {
  background: rgba(255, 255, 255, 0.08);
  border: 1px dashed rgba(255, 255, 255, 0.4);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}

.btn--pill.btn--ghost:hover {
  border-color: var(--accent);
  color: var(--accent);
  transform: translateY(-3px);
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
  text-decoration: none;
  cursor: pointer;
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

.btn--outline-dark {
  background: transparent;
  border: 1px solid var(--border-hi);
  color: var(--text-2);
}

/* ============ LIVE TICKER ============ */
.ticker-bar {
  display: flex;
  align-items: center;
  gap: 0;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  overflow: hidden;
}

.ticker-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  padding: 10px 18px;
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent);
  border-right: 1px solid var(--border);
  background: var(--surface-2, var(--surface));
}

.ticker-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 0 color-mix(in srgb, var(--accent) 60%, transparent);
  animation: tickerPulse 1.6s ease-in-out infinite;
}

@keyframes tickerPulse {
  0% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--accent) 55%, transparent);
  }

  70% {
    box-shadow: 0 0 0 7px transparent;
  }

  100% {
    box-shadow: 0 0 0 0 transparent;
  }
}

.ticker-track {
  flex: 1;
  overflow: hidden;
  mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent);
}

.ticker-content {
  display: flex;
  width: max-content;
  animation: tickerScroll 32s linear infinite;
  padding: 11px 0;
}

.ticker-bar:hover .ticker-content {
  animation-play-state: paused;
}

@keyframes tickerScroll {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-50%);
  }
}

.ticker-item {
  display: inline-flex;
  align-items: center;
  gap: 18px;
  font-family: var(--mono);
  font-size: 12.5px;
  color: var(--text-2);
  white-space: nowrap;
  padding-right: 18px;
}

.ticker-sep {
  color: var(--accent);
}

@media (prefers-reduced-motion: reduce) {
  .ticker-content {
    animation: none;
  }

  .ticker-dot {
    animation: none;
  }
}

/* ============ STATS STRIP ============ */
.stats-strip {
  max-width: 1120px;
  margin: 0 auto;
  padding: 48px 24px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  text-align: center;
}

@media (max-width: 720px) {
  .stats-strip {
    grid-template-columns: repeat(2, 1fr);
  }
}

.stat-block {
  padding: 20px 12px;
  border-left: 1px solid var(--border);
}

.stat-block:first-child {
  border-left: none;
}

@media (max-width: 720px) {
  .stat-block:nth-child(odd) {
    border-left: none;
  }
}

.stat-number-wrap {
  font-family: var(--serif);
  font-size: clamp(30px, 4vw, 42px);
  color: var(--accent);
  line-height: 1;
}

.stat-suffix {
  color: var(--accent);
}

.stat-label {
  margin-top: 10px;
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-3);
}

/* ============ TOOLKIT SECTION ============ */
.toolkit-section {
  max-width: 1120px;
  margin: 0 auto;
  padding: 56px 24px;
}

.toolkit-frame {
  position: relative;
  border: 1px solid var(--border-hi);
  padding: 48px 32px 32px;
}

.toolkit-tab {
  position: absolute;
  top: 0;
  left: 32px;
  transform: translateY(-50%);
  background: var(--bg);
  border: 1px solid var(--border-hi);
  padding: 8px 18px;
  font-family: var(--serif);
  font-size: 15px;
  font-weight: 700;
  color: var(--text-1);
}

.toolkit-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 40px;
  align-items: stretch;
}

@media (max-width: 860px) {
  .toolkit-grid {
    grid-template-columns: 1fr;
  }
}

.toolkit-list {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.toolkit-item {
  display: flex;
  gap: 18px;
  align-items: flex-start;
}

.toolkit-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 10px;
  border: 1px solid var(--border-hi);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent);
}

.toolkit-icon svg {
  width: 24px;
  height: 24px;
}

.toolkit-item-title {
  font-family: var(--serif);
  font-size: 17px;
  color: var(--text-1);
  margin-bottom: 6px;
}

.toolkit-item-body {
  font-size: 13.5px;
  color: var(--text-3);
  line-height: 1.7;
  font-weight: 300;
}

.toolkit-link {
  display: inline-block;
  margin-left: 4px;
  color: var(--accent);
  font-weight: 600;
  text-decoration: underline;
  text-decoration-color: color-mix(in srgb, var(--accent) 50%, transparent);
}

.toolkit-image-col {
  overflow: hidden;
  min-height: 320px;
}

.toolkit-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* ILLUSTRATION SECTION */
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
  transition: transform 0.4s ease;
}

.how-image-col:hover .how-image {
  transform: scale(1.015);
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
  transition: border-color 0.25s ease;
}

.step-row:first-child {
  border-top: none;
  padding-top: 0;
}

.step-row:hover .step-number {
  color: #d4eb3c;
}

.step-number {
  font-family: var(--serif);
  font-size: 26px;
  color: var(--accent);
  flex-shrink: 0;
  width: 44px;
  transition: color 0.2s ease;
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

/* ============ SCAM CALLOUT ============ */
.scam-callout-section {
  max-width: 1120px;
  margin: 0 auto;
  padding: 8px 24px 56px;
}

.scam-callout {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 40px;
  align-items: center;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 40px;
}

@media (max-width: 860px) {
  .scam-callout {
    grid-template-columns: 1fr;
  }
}

.scam-callout-title {
  font-family: var(--serif);
  font-size: clamp(22px, 3vw, 30px);
  color: var(--text-1);
  line-height: 1.3;
  margin-bottom: 16px;
}

.scam-callout-body {
  font-size: 14px;
  color: var(--text-3);
  line-height: 1.75;
  font-weight: 300;
  margin-bottom: 24px;
}

.scam-callout-preview {
  background: var(--bg);
  border: 1px dashed var(--border-hi);
  border-radius: 14px;
  padding: 24px;
  cursor: pointer;
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.scam-callout-preview:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
}

.preview-bubble {
  font-family: var(--mono);
  font-size: 13px;
  line-height: 1.7;
  color: var(--text-2);
}

.preview-bubble mark {
  background: color-mix(in srgb, var(--accent) 30%, transparent);
  color: var(--text-1);
  padding: 0 2px;
  border-radius: 3px;
}

.preview-hint {
  display: block;
  margin-top: 14px;
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);
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
  .lessons-grid {
    grid-template-columns: 1fr;
  }
}

.lesson-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.lesson-card:hover {
  transform: translateY(-4px);
  border-color: var(--accent-bdr, var(--border-hi));
  box-shadow: 0 16px 32px color-mix(in srgb, var(--accent) 8%, transparent);
}

.lesson-title {
  font-family: var(--serif);
  font-size: 16px;
  color: var(--text-1);
  margin-bottom: 8px;
}

.lesson-body {
  font-size: 13px;
  color: var(--text-3);
  line-height: 1.65;
  font-weight: 300;
}

/* BLOG CALLOUT */
.blog-callout {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-left: 3px solid var(--accent);
  border-radius: var(--radius);
  padding: 24px 28px;
  text-decoration: none;
  transition: border-color 0.15s, transform 0.2s ease, box-shadow 0.2s ease;
}

.blog-callout:hover {
  border-color: var(--accent-bdr);
  transform: translateY(-2px);
  box-shadow: 0 16px 36px color-mix(in srgb, var(--accent) 10%, transparent);
}

@media (max-width: 560px) {
  .blog-callout {
    flex-direction: column;
    align-items: flex-start;
  }
}

.blog-eyebrow {
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 8px;
}

.blog-title {
  font-family: var(--serif);
  font-size: 18px;
  color: var(--text-1);
  line-height: 1.3;
  margin-bottom: 8px;
}

.blog-desc {
  font-size: 13px;
  color: var(--text-3);
  line-height: 1.6;
  font-weight: 300;
  max-width: 460px;
}

.blog-arrow {
  font-family: var(--mono);
  font-size: 20px;
  color: var(--accent);
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.blog-callout:hover .blog-arrow {
  transform: translateX(6px);
}

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

  .about-art {
    order: -1;
  }
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
  transition: transform 0.4s ease;
}

.about-art:hover {
  transform: translateY(-4px);
}

.about-art svg {
  width: 100%;
  height: auto;
  display: block;
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

/* ============ FRAUD FILES ============ */
.fraud-files-section {
  max-width: 1120px;
  margin: 0 auto;
  padding: 56px 24px;
}

.fraud-files-title {
  font-family: var(--serif);
  font-size: clamp(22px, 3vw, 30px);
  color: var(--text-1);
  line-height: 1.3;
  max-width: 720px;
  margin-bottom: 12px;
}

.fraud-files-subtitle {
  font-size: 14px;
  color: var(--text-3);
  line-height: 1.7;
  font-weight: 300;
  max-width: 640px;
  margin-bottom: 32px;
}

.fraud-files-grid {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.fraud-category {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  overflow: hidden;
  transition: border-color 0.2s ease;
}

.fraud-category.is-open {
  border-color: var(--border-hi);
}

.fraud-category-head {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 22px;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
}

.fraud-category-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 9px;
  border: 1px solid var(--border-hi);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent);
}

.fraud-category-icon svg {
  width: 20px;
  height: 20px;
}

.fraud-category-heading {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.fraud-category-title {
  font-family: var(--serif);
  font-size: 17px;
  color: var(--text-1);
}

.fraud-category-tagline {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--text-3);
}

.fraud-category-chevron {
  font-family: var(--mono);
  font-size: 20px;
  color: var(--accent);
  width: 24px;
  text-align: center;
  flex-shrink: 0;
}

.fraud-category-body {
  padding: 0 22px 22px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

@media (max-width: 640px) {
  .fraud-category-body {
    grid-template-columns: 1fr;
  }
}

.fraud-item {
  position: relative;
  text-align: left;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 16px;
  cursor: pointer;
  overflow: hidden;
  min-height: 108px;
}

.fraud-item-title {
  font-family: var(--serif);
  font-size: 14.5px;
  color: var(--text-1);
  margin-bottom: 6px;
}

.fraud-item-body {
  font-size: 12.5px;
  color: var(--text-3);
  line-height: 1.6;
  font-weight: 300;
  filter: blur(5px);
  user-select: none;
  transition: filter 0.3s ease;
}

.fraud-item.is-revealed .fraud-item-body {
  filter: none;
  user-select: text;
}

.fraud-item.is-revealed {
  cursor: default;
}

.fraud-item-lock {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);
  background: color-mix(in srgb, var(--bg) 55%, transparent);
}

.registry-context {
  max-width: 920px;
  margin: 0 auto;
  padding: 0 1.25rem;
}

.context-intro {
  max-width: 640px;
  margin: 0 auto 2rem;
  text-align: center;
}

.context-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-3);
  margin-bottom: 14px;
}

.context-eyebrow .dot {
  width: 5px;
  height: 5px;
  background: var(--accent);
  border-radius: 50%;
}

.context-title {
  font-family: var(--serif);
  font-size: clamp(1.6rem, 3.5vw, 5.1rem);
  color: var(--text-1);
  line-height: 1.25;
  margin-bottom: 16px;
}

.context-body {
  font-size: 14.5px;
  color: var(--text-2);
  line-height: 1.75;
  font-weight: 300;
  margin-bottom: 2px;
  font-family: var(--mono)
}

.threat-body {
  font-family: sans-serif;
  text-decoration: underline;
  text-decoration-color: var(--accent);
  text-decoration-thickness: 2px;
}

.context-body:last-child {
  margin-bottom: 0;
}

/* ============ MODALS ============ */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(2, 6, 4, 0.72);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-card {
  position: relative;
  width: 100%;
  max-width: 560px;
  max-height: 88vh;
  overflow-y: auto;
  background: var(--surface);
  border: 1px solid var(--border-hi);
  border-radius: 18px;
  padding: 36px;
}

.modal-card--small {
  max-width: 440px;
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid var(--border-hi);
  background: transparent;
  color: var(--text-2);
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
}

.modal-close:hover {
  color: var(--accent);
  border-color: var(--accent);
}

.modal-eyebrow {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-3);
  margin-bottom: 10px;
}

.modal-title {
  font-family: var(--serif);
  font-size: 22px;
  color: var(--text-1);
  line-height: 1.3;
  margin-bottom: 20px;
  padding-right: 24px;
}

.modal-message {
  font-family: var(--mono);
  font-size: 13.5px;
  line-height: 2;
  color: var(--text-2);
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 18px;
  margin-bottom: 24px;
}

.flag-mark {
  background: color-mix(in srgb, var(--accent) 24%, transparent);
  color: var(--text-1);
  border-radius: 3px;
  padding: 0 2px;
}

.flag-mark sup {
  font-family: var(--mono);
  font-weight: 700;
  color: var(--accent);
  margin-left: 2px;
}

.modal-legend {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 26px;
}

.legend-row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.legend-num {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
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

.legend-label {
  font-family: var(--serif);
  font-size: 14.5px;
  color: var(--text-1);
  margin-bottom: 3px;
}

.legend-body {
  font-size: 12.5px;
  color: var(--text-3);
  line-height: 1.6;
  font-weight: 300;
}

.modal-cta {
  width: 100%;
  justify-content: center;
}

.exit-checklist {
  list-style: none;
  padding: 0;
  margin: 0 0 26px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.exit-checklist li {
  font-size: 14px;
  color: var(--text-2);
  padding-left: 22px;
  position: relative;
}

.exit-checklist li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 7px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
}

.modal-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.modal-actions .btn {
  flex: 1;
  justify-content: center;
}

/* ============ TOAST ============ */
.toast {
  position: fixed;
  bottom: 24px;
  left: 24px;
  z-index: 900;
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 340px;
  background: var(--surface);
  border: 1px solid var(--border-hi);
  border-radius: 14px;
  padding: 14px 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
  animation: toastIn 0.4s cubic-bezier(0.2, 0.7, 0.2, 1);
}

@keyframes toastIn {
  from {
    opacity: 0;
    transform: translateY(16px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 480px) {
  .toast {
    left: 12px;
    right: 12px;
    max-width: none;
  }
}

.toast-dot {
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 0 color-mix(in srgb, var(--accent) 55%, transparent);
  animation: tickerPulse 1.6s ease-in-out infinite;
}

.toast-text {
  flex: 1;
  min-width: 0;
}

.toast-title {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 2px;
}

.toast-body {
  font-size: 12.5px;
  color: var(--text-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.toast-link {
  flex-shrink: 0;
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--accent);
  text-decoration: none;
}

.toast-close {
  flex-shrink: 0;
  background: none;
  border: none;
  color: var(--text-3);
  font-size: 16px;
  cursor: pointer;
  line-height: 1;
}

.toast-close:hover {
  color: var(--accent);
}
</style>