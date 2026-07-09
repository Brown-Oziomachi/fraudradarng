<script setup lang="ts">
useHead({ title: 'FAQ — Fraud Radar NG' })

const stats = [
  { value: 'Free', label: 'No cost to search or report' },
  { value: '0', label: 'Sign-up required' },
  { value: 'Anonymous', label: 'By default' }
]

const faqGroups = [
  {
    category: 'Getting started',
    items: [
      {
        q: 'Is Fraud Radar NG free to use?',
        a: 'Yes. Searching reports and filing a report are both completely free, with no sign-up required.'
      },
      {
        q: 'Do I need an account to search or report?',
        a: 'No. You can search and file a report from any browser without creating an account. Editing a report you filed relies on that same browser remembering it, so avoid clearing your browsing data if you may need to edit it later.'
      },
      {
        q: 'Can I search before sending money, even if nothing feels wrong yet?',
        a: 'Yes, and we\u2019d encourage it. Searching an unfamiliar account, company, or website takes seconds and costs nothing \u2014 it\u2019s the single easiest habit that prevents most fraud.'
      }
    ]
  },
  {
    category: 'Filing & editing reports',
    items: [
      {
        q: 'Do you verify reports before they go live?',
        a: 'No. Reports go live immediately so the information is useful right away. This means every report should be read as one person\u2019s account of what happened, not a legally proven fact. If you believe a report is false or misleading, you can flag it for review.'
      },
      {
        q: 'Can I edit or delete my report after submitting?',
        a: 'You can edit a report you submitted, from the same browser you used to create it. There is currently no way to fully delete a report, since removing warnings could put others at risk if the account is still active.'
      },
      {
        q: 'What happens if someone else reports the same account I did?',
        a: 'Their report is added alongside yours rather than replacing it. The flagged count goes up, and their description and any evidence they attach appear as an additional report on the same page \u2014 so the fuller picture builds over time instead of only the first report surviving.'
      },
      {
        q: 'Can I attach evidence, and how much?',
        a: 'Yes \u2014 you can attach screenshots as evidence when filing or editing a report, up to a set number of images per submission. Evidence from every reporter on the same account is shown together, not just the first person\u2019s.'
      },
      {
        q: 'What if the account I want to report belongs to someone innocent (a mule or hacked account)?',
        a: 'It\u2019s common for scammers to use accounts that don\u2019t belong to them, obtained through mules or compromised credentials. Reporting the account still helps warn others, even if the named account holder wasn\u2019t the one who scammed you directly.'
      }
    ]
  },
  {
    category: 'Privacy & safety',
    items: [
      {
        q: 'Is my identity shown on a report I submit?',
        a: 'No. Reports do not display your name, email, or any identifying information about you as the reporter.'
      },
      {
        q: 'Will filing a report get my money back?',
        a: 'No. Fraud Radar NG is an awareness and warning platform, not a recovery service. If you\u2019ve lost money, you should also report it to your bank immediately and, where relevant, to the Nigeria Police Force or the EFCC.'
      }
    ]
  },
  {
    category: 'Recovery & official agencies',
    items: [
      {
        q: 'I\u2019ve already lost money \u2014 what should I actually do?',
        a: 'Use the Naira Recovery Pipeline tool to generate a bank freeze-request letter, understand the police report and court order process, and find the right agency to escalate to \u2014 CBN, FCCPC, EFCC, or the Police Cybercrime Centre, depending on what happened.'
      },
      {
        q: 'Can Fraud Radar NG freeze an account or contact my bank for me?',
        a: 'No. We are not a bank, law enforcement agency, or government body, and we don\u2019t process or forward anything on your behalf. Our recovery tool helps you generate the right letter and points you to the right agency \u2014 you still need to send it and follow up yourself.'
      },
      {
        q: 'Which agency should I contact \u2014 CBN, FCCPC, EFCC, or the Police?',
        a: 'It depends on what happened: CBN Consumer Protection is for unresolved bank disputes, FCCPC is for vendor or product scams, EFCC is for financial crime with an identifiable suspect account, and the Police Cybercrime Centre is for hacking, phishing, or filing the official police report your case needs. See the Help page for direct contact details for each.'
      }
    ]
  }
]

// Flat, sequential numbering across all groups (44, 45, 46... style from the reference)
let runningIndex = 0
const numberedGroups = faqGroups.map(group => ({
  ...group,
  items: group.items.map(item => {
    runningIndex += 1
    return { ...item, number: runningIndex }
  })
}))

const openKey = ref<string | null>(null)
function toggle(key: string) {
  openKey.value = openKey.value === key ? null : key
}
</script>

<template>
  <div class="faq-page">

    <!-- ===================== HERO ===================== -->
    <section class="hero">
      <div class="hero-image-wrap">
        <img src="/fraudmap.png" alt="Questions people ask before they report" class="hero-image" />
        <div class="hero-scrim" />
      </div>

      <div class="hero-content">
        <p class="hero-eyebrow"><span class="dot" /> Frequently asked questions</p>
        <h1 class="hero-title">Questions people<br />ask before they<br />report.</h1>
        <p class="hero-sub">
          Everything about how reporting, privacy, and recovery actually work on
          Fraud Radar NG will answered plainly, no sign-up required to read any of it.
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

    <!-- ===================== FAQ GROUPS ===================== -->
    <section class="faq-section">
      <div v-for="group in numberedGroups" :key="group.category" class="faq-group">
        <h2 class="group-title">{{ group.category }}</h2>

        <div class="faq-list">
          <div
            v-for="item in group.items"
            :key="item.q"
            class="faq-item"
            :class="{ open: openKey === `${group.category}-${item.q}` }"
          >
            <button
              type="button"
              class="faq-question"
              @click="toggle(`${group.category}-${item.q}`)"
            >
              <span class="faq-number">{{ item.number }}</span>
              <span class="faq-question-text">{{ item.q }}</span>
              <span
                class="faq-chevron"
                :class="{ open: openKey === `${group.category}-${item.q}` }"
              >⌄</span>
            </button>
            <div
              class="faq-answer"
              :class="{ open: openKey === `${group.category}-${item.q}` }"
            >
              <p>{{ item.a }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================== CONTACT CTA ===================== -->
    <section class="contact-section">
      <div class="contact-inner">
        <div class="contact-copy">
          <h2 class="contact-title">Still have a question?</h2>
          <p class="contact-body">
            If something isn't covered here, reach out directly \u2014 we read
            every message.
          </p>

          <div class="contact-actions">
            <NuxtLink to="/contact" class="btn-primary">Contact us</NuxtLink>
            <NuxtLink to="/report/new" class="btn-secondary">Report a scam</NuxtLink>
          </div>
        </div>

        <div class="stamp-wrap" aria-hidden="true">
          <div class="stamp">
            <svg viewBox="0 0 140 140" class="stamp-ring">
              <defs>
                <path id="faq-stamp-circle" d="M 70,70 m -55,0 a 55,55 0 1,1 110,0 a 55,55 0 1,1 -110,0" />
              </defs>
              <text class="stamp-text">
                <textPath href="#faq-stamp-circle" startOffset="0%">
                  ANSWERED PLAINLY \u00b7 FRAUD RADAR NG \u00b7 ANSWERED PLAINLY \u00b7
                </textPath>
              </text>
            </svg>
            <span class="stamp-check">?</span>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
.faq-page { width: 100%; }

/* ============ HERO ============ */
.hero {
  position: relative;
  min-height: 70vh;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  align-items: center;       
  justify-content: center;   
  text-align: center;  
}
.hero-image-wrap { position: absolute; inset: 0; }
.hero-image {
  width: 100%; height: 100%; object-fit: cover;
  filter: grayscale(0.55) contrast(1.05) brightness(0.65);
}
.hero-scrim {
  position: absolute; inset: 0;
  background: linear-gradient(
    280deg,
    rgba(10, 10, 11, 0.15) 0%,
    rgba(10, 10, 11, 0.55) 55%,
    rgba(10, 10, 11, 0.92) 100%
  );
}
.hero-content {
  position: relative; z-index: 1;
  padding: 0 44px 64px;
  max-width: 900px;
}
@media (max-width: 720px) {
  .hero-content { padding: 0 20px 44px; }
}
.hero-eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: var(--mono); font-size: 11px; letter-spacing: 0.12em;
  text-transform: uppercase; color: var(--accent); margin-bottom: 20px;
}
.dot { width: 6px; height: 6px; background: var(--accent); border-radius: 50%; }
.hero-title {
  font-family: var(--serif);
  font-size: clamp(36px, 6.5vw, 74px);
  line-height: 1.08;
  letter-spacing: -0.02em;
  color: #fdfdfa;
  margin-bottom: 24px;
}
.hero-sub {
  font-size: clamp(15px, 1.8vw, 18px);
  line-height: 1.6;
  font-weight: 300;
  color: rgba(253, 253, 250, 0.82);
  max-width: 560px;
}

/* ============ STATS STRIP ============ */
.stats-strip {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-bottom: 1px solid var(--border);
}
@media (max-width: 640px) { .stats-strip { grid-template-columns: 1fr; } }
.stat-block {
  display: flex; flex-direction: column; gap: 6px;
  padding: 32px 44px;
  border-right: 1px solid var(--border);
}
.stat-block:last-child { border-right: none; }
@media (max-width: 640px) {
  .stat-block { border-right: none; border-bottom: 1px solid var(--border); }
  .stat-block:last-child { border-bottom: none; }
}
.stat-value { font-family: var(--serif); font-size: 28px; color: var(--text-1); }
.stat-label {
  font-family: var(--mono); font-size: 10.5px; letter-spacing: 0.06em;
  text-transform: uppercase; color: var(--text-3);
}

/* ============ FAQ SECTION ============ */
.faq-section {
  max-width: 780px;
  margin: 0 auto;
  padding: 80px 44px 64px;
}
@media (max-width: 720px) {
  .faq-section { padding: 56px 20px 40px; }
}

.faq-group { margin-bottom: 48px; }
.faq-group:last-child { margin-bottom: 0; }

.group-title {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
}

/* ============ FAQ CARDS (numbered, matches reference) ============ */
.faq-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.faq-item {
  background: var(--surface, #fff);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 0 20px;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.faq-item.open {
  border-color: var(--accent);
  box-shadow: 0 0 0 1px var(--accent) inset;
}

.faq-question {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 16px;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  padding: 18px 0;
  font-family: var(--sans);
}

.faq-number {
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

.faq-question-text {
  flex: 1;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-1);
}

.faq-chevron {
  flex-shrink: 0;
  color: var(--text-3);
  font-size: 18px;
  transition: transform 0.2s;
}
.faq-chevron.open { transform: rotate(180deg); color: var(--accent); }

.faq-answer {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  padding-left: 42px;
  transition: max-height 0.25s ease, opacity 0.2s ease, padding-bottom 0.25s ease;
}
.faq-answer.open { max-height: 320px; opacity: 1; padding-bottom: 20px; }
.faq-answer p { font-size: 14px; color: var(--text-2); line-height: 1.75; font-weight: 300; }

/* ============ CONTACT SECTION ============ */
.contact-section {
  border-top: 1px solid var(--border);
  padding: 80px 44px;
}
@media (max-width: 720px) { .contact-section { padding: 56px 20px; } }

.contact-inner {
  max-width: 1120px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 48px;
  align-items: center;
}
@media (max-width: 780px) {
  .contact-inner { grid-template-columns: 1fr; text-align: center; }
}

.contact-title {
  font-family: var(--serif);
  font-size: clamp(24px, 3.4vw, 34px);
  color: var(--text-1);
  margin-bottom: 14px;
}
.contact-body {
  font-size: 14.5px;
  line-height: 1.75;
  font-weight: 300;
  color: var(--text-2);
  max-width: 480px;
  margin-bottom: 26px;
}
@media (max-width: 780px) { .contact-body { margin-left: auto; margin-right: auto; } }

.contact-actions { display: flex; gap: 12px; flex-wrap: wrap; }
@media (max-width: 780px) { .contact-actions { justify-content: center; } }

.btn-primary {
  display: inline-flex; align-items: center;
  background: var(--accent); color: #0a0a0b; font-weight: 600;
  font-family: var(--mono); font-size: 12px; letter-spacing: 0.04em;
  padding: 14px 24px; border-radius: var(--radius); text-decoration: none;
}
.btn-primary:hover { background: #d4eb3c; }

.btn-secondary {
  display: inline-flex; align-items: center;
  font-family: var(--mono); font-size: 12px; letter-spacing: 0.04em;
  color: var(--text-2); background: none; border: 1px solid var(--border-hi);
  border-radius: var(--radius); padding: 14px 20px; cursor: pointer;
  text-decoration: none; transition: border-color 0.15s, color 0.15s;
}
.btn-secondary:hover { border-color: var(--accent); color: var(--text-1); }

/* ============ SIGNATURE STAMP ============ */
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
  width: 52px; height: 52px;
  display: flex; align-items: center; justify-content: center; line-height: 1;
}
</style>