<script setup lang="ts">
import { onMounted } from 'vue'
import vote2 from '@/assets/css/images/vote2.png'
useSeoMeta({
  title: '2027 Election Scams | FRNG Nigeria',
  description: 'Fake voter-registration portals, cloned donation drives and impersonated INEC officials — spot the scams targeting Nigerian voters ahead of 2027.',
  ogTitle: 'Election Scams Targeting Nigerian Voters Ahead of 2027',
  ogDescription: 'Verify before you register, donate, or respond to anyone claiming to be from INEC.',
  ogImage: 'https://fraudradar.ng/FRLOGO.png',
  ogType: 'website',
  ogSiteName: 'Fraud Radar NG',
  ogLocale: 'en_NG',
  twitterCard: 'summary_large_image',
  robots: 'index, follow',
  author: 'Fraud Radar NG Security Team'
})

/* Official INEC channels — used in the verification callout below.
   Keep this in sync if INEC changes its portals. */
const officialDomains = [
  { label: 'inecnigeria.org', desc: 'INEC\u2019s main site — news, guidelines, portal directory' },
  { label: 'cvr.inecnigeria.org', desc: 'Continuous Voter Registration — register, check status, find your polling unit' }
]

const scamCategories = [
  {
    title: 'Fake voter-registration portals',
    tagline: 'A cloned page asking for what should always be free',
    iconHtml: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    redFlags: [
      'A domain that looks close to the real one but isn\u2019t — e.g. "inec-ng.com" or "cvr-inecnigeria.info" instead of inecnigeria.org / cvr.inecnigeria.org',
      'Any request for payment to "register," "expedite," or "guarantee" your PVC — registration and collection are entirely free',
      'A request for your BVN, bank PIN, or OTP as part of "voter verification" — INEC never needs banking details to register you',
      'The link arrives via a random WhatsApp broadcast or SMS rather than something you navigated to yourself'
    ]
  },
  {
    title: 'Cloned donation drives',
    tagline: 'Real NGO branding, fake destination account',
    iconHtml: '<path d="M12 21s-7-4.35-9.5-8.5C.9 9 2.4 5.5 6 5.5c2 0 3.3 1.1 4 2.2.7-1.1 2-2.2 4-2.2 3.6 0 5.1 3.5 3.5 7C19 16.65 12 21 12 21z"/>',
    redFlags: [
      'A "voter mobilization" or civic-education fundraiser you can\u2019t find any trace of outside the message that reached you',
      'Urgency tied directly to an election date — "the deadline is tomorrow, donate now"',
      'Payment requested only in crypto or to a personal account name, never a verifiable organizational one',
      'No way to confirm the organization\u2019s registration — a real NGO can be checked against the Corporate Affairs Commission (CAC) register'
    ]
  },
  {
    title: 'Impersonated INEC / election officials',
    tagline: 'A call, text or visit that isn\u2019t who it claims to be',
    iconHtml: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7"/><path d="M17 8l1.5 1.5L21 7"/>',
    redFlags: [
      'A caller or WhatsApp contact claiming to be INEC staff, asking for your PVC number, NIN, or personal details "for verification"',
      'A demand for payment for "card printing," "priority collection," or to avoid being "removed from the register"',
      'Threats that you\u2019ll lose your voter registration or be disenfranchised unless you act immediately',
      'Contact that didn\u2019t originate from INEC\u2019s official channels — real communication comes through inecnigeria.org, its verified social accounts, or in person at a state/LGA office'
    ]
  }
]

const checklist = [
  'Register, check your status, or find your polling unit only at cvr.inecnigeria.org — bookmark it so you never rely on a link someone else sends you',
  'Voter registration and PVC collection are free, always — any fee request, at any stage, is a scam',
  'INEC does not call or message individuals asking for BVN, bank PINs, or OTPs — no legitimate voter process ever needs your banking details',
  'Verify anyone claiming to represent INEC through the Commission\u2019s official site or your nearest state/LGA office before sharing anything',
  'If you\u2019re unsure about an account, number, or website, check it against the Threat Registry — and file a report if it\u2019s already scammed someone'
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
      2027 general elections
    </div>
    <h1 class="page-title">The election isn't just contested at the ballot box.</h1>
    <p class="page-subtitle">
      Every election cycle, the same three scams resurface wearing the Commission's name:
      fake registration portals, cloned donation drives, and impersonated officials. None of
      them are new tricks — they just get a fresh coat of urgency every cycle.
    </p>
  </section>

    <section class="page-section">
    <img :src="vote2" class="center" alt="Scam awareness illustration" />
  </section>

  <!-- ============ OFFICIAL CHANNELS CALLOUT ============ -->
  <section class="official-section reveal">
    <div class="official-frame">
      <span class="official-tab">Only trust these</span>
      <div class="official-grid">
        <a v-for="d in officialDomains" :key="d.label" :href="`https://${d.label}`" target="_blank" rel="noopener noreferrer" class="official-item">
          <div class="official-domain">{{ d.label }}</div>
          <p class="official-desc">{{ d.desc }}</p>
        </a>
      </div>
      <p class="official-note">
        Anything that resembles these domains but isn't an exact match — extra words, a different
        extension, a hyphen that shouldn't be there — is not INEC.
      </p>
    </div>
  </section>

  <!-- ============ FIND YOUR POLLING UNIT — DO IT YOURSELF ============ -->
  <section class="polling-section reveal">
    <div class="polling-frame">
      <span class="polling-tab">Do this yourself — don't follow anyone</span>

      <p class="polling-warning">
        Do not follow anyone, anywhere — online, by phone, or in person — who offers to
        "help" you find, register at, or move your polling unit. You don't need an agent,
        a caller, or a stranger with a WhatsApp link. Go directly to INEC's own locator tool
        below and do it yourself, using only your own state, LGA, and ward.
      </p>

      <div class="polling-steps">
        <div class="polling-step">
          <span class="polling-step-num">1</span>
          <span>Select your <strong>State</strong> — the state you'll be voting in</span>
        </div>
        <div class="polling-step">
          <span class="polling-step-num">2</span>
          <span>Select your <strong>LGA</strong> — the local government area you live in</span>
        </div>
        <div class="polling-step">
          <span class="polling-step-num">3</span>
          <span>Select your <strong>Ward</strong></span>
        </div>
        <div class="polling-step">
          <span class="polling-step-num">4</span>
          <span>Click <strong>"Search"</strong> — your polling unit appears directly on the page</span>
        </div>
      </div>

      <p class="polling-note">
        It's best to choose a polling unit close to where you actually live, since movement
        is often restricted on election day.
      </p>

      <a href="https://inecnigeria.org/polling-units/" target="_blank" rel="noopener noreferrer" class="btn btn--accent polling-cta">
        Open the official Polling Unit Locator
      </a>
    </div>
  </section>

  <!-- ============ SCAM CATEGORIES ============ -->
  <section class="categories-section">
    <div class="eyebrow reveal">
      <span class="eyebrow-dot" />
      Three patterns, every cycle
    </div>
    <h2 class="categories-title reveal">What to watch for before 2027.</h2>

    <div class="categories-list">
      <div v-for="(cat, i) in scamCategories" :key="cat.title" class="category-card reveal" :style="{ transitionDelay: `${i * 90}ms` }">
        <div class="category-head">
          <div class="category-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" v-html="cat.iconHtml" />
          </div>
          <div>
            <h3 class="category-title">{{ cat.title }}</h3>
            <p class="category-tagline">{{ cat.tagline }}</p>
          </div>
        </div>
        <ul class="category-flags">
          <li v-for="flag in cat.redFlags" :key="flag">{{ flag }}</li>
        </ul>
      </div>
    </div>
  </section>

  <!-- ============ VERIFICATION CHECKLIST ============ -->
  <section class="checklist-section reveal">
    <div class="checklist-inner">
      <div class="eyebrow eyebrow--dark">
        <span class="eyebrow-dot" />
        Before you register, donate, or respond
      </div>
      <h2 class="checklist-title">Five checks that stop almost all of it.</h2>
      <ul class="checklist-list">
        <li v-for="(item, i) in checklist" :key="i">
          <span class="checklist-num">{{ i + 1 }}</span>
          <span>{{ item }}</span>
        </li>
      </ul>
      <div class="checklist-actions">
        <NuxtLink to="/choose-candidate" class="btn btn--accent">Election scams near you</NuxtLink>
        <NuxtLink to="/lookupsearch" class="btn btn--outline-dark">Check the registry</NuxtLink>
        <NuxtLink to="/report/new" class="btn btn--outline-dark">Report a scam</NuxtLink>
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
  max-width: 620px;
  margin: 0 auto;
}

/* OFFICIAL CHANNELS */
.official-section {
  max-width: 900px;
  margin: 0 auto;
  padding: 8px 24px 56px;
}

.official-frame {
  position: relative;
  border: 1px solid var(--border-hi);
  border-radius: 18px;
  padding: 44px 28px 28px;
}

.official-tab {
  position: absolute;
  top: 0;
  left: 28px;
  transform: translateY(-50%);
  background: var(--bg);
  border: 1px solid var(--border-hi);
  border-radius: 8px;
  padding: 7px 16px;
  font-family: var(--serif);
  font-size: 14px;
  font-weight: 700;
  color: var(--accent);
}

.official-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin-bottom: 18px;
}
@media (max-width: 600px) {
  .official-grid { grid-template-columns: 1fr; }
}

.official-item {
  display: block;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 18px;
  text-decoration: none;
  transition: border-color 0.2s ease, transform 0.2s ease;
}
.official-item:hover { border-color: var(--accent); transform: translateY(-2px); }

.official-domain {
  font-family: var(--mono);
  font-size: 14px;
  font-weight: 700;
  color: var(--accent);
  margin-bottom: 6px;
}
.official-desc { font-size: 12.5px; color: var(--text-3); line-height: 1.6; font-weight: 300; }

.official-note {
  font-size: 12.5px;
  color: var(--text-3);
  line-height: 1.7;
  font-weight: 300;
  font-style: italic;
}

/* CATEGORIES */
.categories-section {
  max-width: 1120px;
  margin: 0 auto;
  padding: 56px 24px;
}

.categories-title {
  font-family: var(--serif);
  font-size: clamp(22px, 3vw, 30px);
  color: var(--text-1);
  line-height: 1.3;
  max-width: 560px;
  margin-bottom: 32px;
}

.categories-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
@media (max-width: 900px) {
  .categories-list { grid-template-columns: 1fr; }
}

.category-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}
.category-card:hover {
  transform: translateY(-4px);
  border-color: var(--border-hi);
  box-shadow: 0 16px 32px color-mix(in srgb, var(--accent) 8%, transparent);
}

.category-head {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  margin-bottom: 18px;
}

.category-icon {
  flex-shrink: 0;
  width: 42px;
  height: 42px;
  border-radius: 10px;
  border: 1px solid var(--border-hi);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent);
}
.category-icon svg { width: 22px; height: 22px; }

.category-title { font-family: var(--serif); font-size: 16.5px; color: var(--text-1); margin-bottom: 4px; }
.category-tagline { font-family: var(--mono); font-size: 11px; color: var(--text-3); line-height: 1.5; }

.category-flags {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.category-flags li {
  font-size: 12.5px;
  color: var(--text-3);
  line-height: 1.65;
  font-weight: 300;
  padding-left: 18px;
  position: relative;
}
.category-flags li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 7px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
}

/* CHECKLIST */
.checklist-section {
  background: var(--surface);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  padding: 56px 24px;
}

.checklist-inner {
  max-width: 760px;
  margin: 0 auto;
}

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

.checklist-actions {
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

.page-section {
  max-width: 1120px;
  margin: 0 auto;
  padding: 56px 24px;
}

.center {
  display: block;
  max-width: 100%;
  height: auto;
  margin: 0 auto;
  border-radius: var(--radius);
}

/* POLLING UNIT LOCATOR */
.polling-section {
  max-width: 900px;
  margin: 0 auto;
  padding: 8px 24px 56px;
}

.polling-frame {
  position: relative;
  border: 1px solid var(--border-hi);
  border-radius: 18px;
  padding: 44px 28px 28px;
}

.polling-tab {
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

.polling-warning {
  font-size: 14.5px;
  color: var(--text-1);
  line-height: 1.8;
  font-weight: 500;
  margin-bottom: 26px;
}

.polling-steps {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.polling-step {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 14px;
  color: var(--text-2);
  line-height: 1.6;
}

.polling-step-num {
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

.polling-note {
  font-size: 12.5px;
  color: var(--text-3);
  line-height: 1.7;
  font-weight: 300;
  font-style: italic;
  margin-bottom: 24px;
}

.polling-cta {
  width: 100%;
  justify-content: center;
}
</style>