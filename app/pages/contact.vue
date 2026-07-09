<script setup lang="ts">
useHead({ title: 'Contact — Fraud Radar NG' })

const name = ref('')
const email = ref('')
const message = ref('')
const wantsUpdates = ref(false)
const isSubmitting = ref(false)
const isSuccess = ref(false)
const errorMessage = ref('')

async function submitContact() {
  errorMessage.value = ''

  if (!name.value || !email.value || !message.value) {
    errorMessage.value = 'Please fill in all fields.'
    return
  }

  isSubmitting.value = true

  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: {
        name: name.value,
        email: email.value,
        message: message.value,
        wantsUpdates: wantsUpdates.value
      }
    })
    isSuccess.value = true
    name.value = ''
    email.value = ''
    message.value = ''
    wantsUpdates.value = false
  } catch (err: any) {
    errorMessage.value = err?.data?.statusMessage || 'Something went wrong. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

const helpCards = [
  {
    icon: 'flag',
    title: 'Spotted an error in a report?',
    body: 'Wrong name, wrong number, or something that no longer looks accurate — flag it and we\'ll take a look.',
    action: { label: 'Flag Now', href: '/flag/report' }
  },
  {
    icon: 'megaphone',
    title: 'Press or partnership inquiry?',
    body: 'Journalists, NGOs, and fintechs working on fraud prevention — we\'re glad to talk.',
    action: { label: 'Partner with FRNG', href: '/partnership_FRNG' }
  },
  {
    icon: 'alert',
    title: 'In the middle of being scammed right now?',
    body: 'Don\'t wait on us. Call your bank\'s fraud line immediately to try to freeze the transfer, then file a report here after.',
    action: { label: 'Report after you\'ve called your bank', to: '/report/new' }
  }
]

const storyBlocks = [
  {
    image: '/abng.png',
    eyebrow: 'Why we exist',
    title: 'One quiet report can stop a scam from working twice.',
    body: 'Scammers reuse the same account, the same script, the same story — on someone new, in a different state, a week later. Every report anyone sends through this contact form, or through the platform itself, feeds a radar that gets sharper the more Nigerians use it.'
  },
  {
    image: '/state.png',
    eyebrow: 'Who reaches out',
    title: 'Traders, students, small business owners — from every state.',
    body: 'Most messages we get aren\'t complaints. They\'re a market woman in Onitsha asking how to flag a fake supplier, a student in Zaria reporting a fake scholarship offer, a shop owner in Lagos double-checking an account before releasing goods. That range is exactly who this was built for.',
    reverse: true
  }
]

/* ---------- Scroll-triggered reveal animations ---------- */

const pageRoot = ref<HTMLElement | null>(null)

onMounted(() => {
  nextTick(() => {
    const targets = pageRoot.value?.querySelectorAll('.reveal')
    if (!targets || !targets.length) return

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    )

    targets.forEach((t) => io.observe(t))
  })
})
</script>

<template>
  <div ref="pageRoot" class="page-shell">
    <!-- ============ HERO: two-column contact panel ============ -->
    <section class="hero-panel">
      <div class="hero-left">
        <div class="hero-left-overlay" />
        <div class="hero-left-content">
          <div class="eyebrow hero-anim" style="animation-delay: 0.05s">
            <span class="eyebrow-dot" /> Contact
          </div>
          <h1 class="hero-title hero-anim" style="animation-delay: 0.15s">
            <span class="underline">Need to reach</span><br />
            the Fraud Radar NG team?
          </h1>
          <p class="hero-sub hero-anim" style="animation-delay: 0.25s">
            Corrections, press, partnerships, or feedback on the platform
            itself — tell us what's going on and we'll get back to you,
            usually within a couple of days.
          </p>

          <div class="social-row hero-anim" style="animation-delay: 0.35s">
            <a href="#" class="social-link" aria-label="Fraud Radar NG on X">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M18.9 2H22l-7.6 8.7L23.3 22h-6.9l-5.4-7-6.2 7H1.6l8.1-9.3L1 2h7l4.9 6.4L18.9 2Zm-1.2 18h1.9L7.4 4H5.4l12.3 16Z"/></svg>
            </a>
            <a href="#" class="social-link" aria-label="Fraud Radar NG on Instagram">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1"/></svg>
            </a>
            <a href="#" class="social-link" aria-label="Fraud Radar NG on WhatsApp">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20Zm4.4-6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1s-.6.8-.8 1c-.1.1-.3.2-.5.1-.2-.1-1-.4-2-1.2-.7-.6-1.2-1.4-1.4-1.6-.1-.2 0-.4.1-.5l.4-.4c.1-.1.2-.3.2-.4.1-.1 0-.3 0-.4l-.7-1.7c-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.4c.1.2 1.6 2.5 3.9 3.4.5.2 1 .4 1.3.5.5.2 1 .1 1.4.1.4-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.2-.4-.3Z"/></svg>
            </a>
          </div>
        </div>
      </div>

      <div class="hero-right">
        <template v-if="!isSuccess">
          <form class="contact-form hero-anim" style="animation-delay: 0.2s" @submit.prevent="submitContact">
            <div class="form-group">
              <label for="name">Full name *</label>
              <input id="name" v-model="name" class="input" placeholder="Your name" />
            </div>
            <div class="form-group">
              <label for="email">Email address *</label>
              <input id="email" v-model="email" type="email" class="input" placeholder="you@example.com" />
            </div>
            <div class="form-group">
              <label for="message">Message *</label>
              <textarea
                id="message"
                v-model="message"
                class="input textarea"
                rows="5"
                placeholder="Tell us what this is about"
              />
            </div>

            <label class="checkbox-row">
              <input v-model="wantsUpdates" type="checkbox" class="checkbox" />
              <span>I'd like to receive occasional fraud alerts and updates by email</span>
            </label>

            <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>

            <button type="submit" class="btn-submit" :disabled="isSubmitting">
              {{ isSubmitting ? 'Sending…' : 'Submit' }}
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>

            <p class="form-note">
              Your personal data will be processed following
              <NuxtLink to="/privacy-notice" class="inline-link">the Privacy Notice</NuxtLink>.
            </p>
          </form>
        </template>

        <div v-else class="success-panel">
          <div class="success-icon">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.4">
              <path class="success-check" d="M20 6 9 17l-5-5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
          <h3 class="success-title">Message sent</h3>
          <p class="success-body">Thanks — we've got it and will get back to you soon.</p>
        </div>
      </div>
    </section>

    <!-- ============ HOW CAN WE HELP — 3 cards ============ -->
    <section class="help-section">
      <h2 class="help-heading reveal reveal--up">How can we help?</h2>
      <div class="help-grid">
        <div
          v-for="(card, i) in helpCards"
          :key="card.title"
          class="help-card reveal reveal--up"
          :style="{ transitionDelay: `${i * 0.12}s` }"
        >
          <div class="help-card-split" />
          <div class="help-card-content">
            <div class="help-icon">
              <svg v-if="card.icon === 'flag'" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M5 3v18M5 4h11l-2 4 2 4H5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <svg v-else-if="card.icon === 'megaphone'" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M3 11v2a2 2 0 0 0 2 2h1l3 6V9L6 9a2 2 0 0 0-2 2Z" stroke-linejoin="round" />
                <path d="M9 9l10-5v16L9 15" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <svg v-else viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M12 9v4M12 17h.01" stroke-linecap="round" />
                <path d="m10.3 3.9-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3.1l-8-14a2 2 0 0 0-3.4 0Z" stroke-linejoin="round" />
              </svg>
            </div>
            <h3 class="help-title">{{ card.title }}</h3>
            <p class="help-body">{{ card.body }}</p>
            <a v-if="card.action.href" :href="card.action.href" class="help-action">{{ card.action.label }}</a>
            <NuxtLink v-else :to="card.action.to" class="help-action help-action--btn">
              {{ card.action.label }} →
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ IMAGE + TEXT STORY BLOCKS ============ -->
    <section class="story-section">
      <div
        v-for="block in storyBlocks"
        :key="block.title"
        class="story-row reveal"
        :class="block.reverse ? 'story-row--reverse reveal--right' : 'reveal--left'"
      >
        <div class="story-image-wrap">
          <img :src="block.image" :alt="block.title" class="story-image" loading="lazy" />
        </div>
        <div class="story-text">
          <span class="story-eyebrow">{{ block.eyebrow }}</span>
          <h3 class="story-title">{{ block.title }}</h3>
          <p class="story-body">{{ block.body }}</p>
        </div>
      </div>
    </section>

    <!-- ============ CLOSING CTA ============ -->
    <section class="cta-strip reveal reveal--up">
      <h3 class="cta-title">Not sure this is a "contact us" thing?</h3>
      <p class="cta-sub">If it's about a scam, it probably belongs on the platform itself.</p>
      <div class="cta-actions">
        <NuxtLink to="/report/new" class="btn btn--accent">Report a scam</NuxtLink>
        <NuxtLink to="/reports" class="btn">Browse reports</NuxtLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page-shell {
  max-width: 1120px;
  margin: 0 auto;
  padding: 56px 24px 100px;
}

.eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: var(--mono); font-size: 10px; letter-spacing: 0.12em;
  text-transform: uppercase; color: var(--text-3); margin-bottom: 20px;
}
.eyebrow-dot { width: 5px; height: 5px; background: var(--accent); border-radius: 50%; }

/* ============ HERO PANEL ============ */
.hero-panel {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  border: 1px solid var(--border);
  border-radius: calc(var(--radius) + 10px);
  overflow: hidden;
}
@media (max-width: 900px) {
  .hero-panel {
    grid-template-columns: 1fr;
  }
}

.hero-left {
  position: relative;
  padding: 56px;
  background-color: #0a0a0b; /* fallback while image loads */
  background-image: url('/FRLOGO.png');
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  display: flex;
  align-items: flex-end;
  min-height: 420px;
  filter: saturate(1.05) contrast(1.03);
}

@media (max-width: 900px) {
  .hero-left {
    background-position: center 20%;
  }
}

@media (max-width: 720px) {
  .hero-anim {
    animation: none;
    opacity: 1;
  }
}

.hero-left-overlay {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(120% 90% at 20% 100%, rgba(10,10,11,0.15) 0%, transparent 55%),
    linear-gradient(
      120deg,
      rgba(51, 65, 59, 0.35) 0%,
      rgba(7, 187, 61, 0.55) 5%,
      rgba(10, 10, 11, 0.9) 100%
    );
}

.hero-left-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
}

.hero-left .eyebrow { color: rgba(255,255,255,0.75); }

.hero-title {
  font-family: var(--serif);
  font-size: clamp(38px, 3.6vw, 42px);
  color: white;
  line-height: 1.2;
  margin-bottom: 18px;
}
.underline {
  border-bottom: 3px solid var(--accent);
  padding-bottom: 2px;
}

.hero-sub {
  font-size: 14.5px;
  color: white;
  line-height: 1.75;
  font-weight: 300;
  max-width: 400px;
  margin-bottom: 32px;
}

.social-row {
  display: flex;
  gap: 10px;
}
.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius);
  border: 1px solid rgba(255,255,255,0.3);
  color: rgba(255,255,255,0.85);
  transition: border-color 0.2s ease, color 0.2s ease, transform 0.2s ease, background 0.2s ease;
}
.social-link:hover {
  border-color: var(--accent);
  color: #0a0a0b;
  background: var(--accent);
  transform: translateY(-3px) scale(1.06);
}

/* Right side keeps the plain surface color */
.hero-right {
  background: var(--surface);
  padding: 56px;
  display: flex;
  align-items: center;
}
@media (max-width: 900px) {
  .hero-right { padding: 36px 24px; }
}

/* Form */
.contact-form {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.form-group {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
label {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-3);
}
.input {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 12px 14px;
  color: var(--text-1);
  font-family: var(--sans);
  font-size: 13.5px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.input::placeholder { color: var(--text-3); }
.input:focus {
  outline: none;
  border-color: var(--accent-bdr, var(--accent));
  box-shadow: 0 0 0 3px rgba(232,255,71,0.12);
}
.textarea { resize: vertical; }

.checkbox-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 12.5px;
  color: var(--text-3);
  font-weight: 300;
  line-height: 1.5;
  margin: 4px 0 18px;
  cursor: pointer;
}
.checkbox {
  margin-top: 2px;
  accent-color: var(--accent);
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}

.error-text {
  font-family: var(--mono);
  font-size: 11px;
  color: #f87171;
  margin-bottom: 12px;
  animation: shake 0.4s ease;
}

.btn-submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: var(--accent);
  color: #0a0a0b;
  font-weight: 700;
  font-family: var(--mono);
  font-size: 12px;
  letter-spacing: 0.05em;
  border: none;
  border-radius: var(--radius);
  padding: 14px 24px;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
}
.btn-submit:hover:not(:disabled) {
  background: #d4eb3c;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(232,255,71,0.25);
}
.btn-submit:active:not(:disabled) { transform: translateY(0); }
.btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-submit svg { transition: transform 0.2s ease; }
.btn-submit:hover:not(:disabled) svg { transform: translateX(3px); }

.form-note {
  font-family: var(--mono);
  font-size: 10px;
  color: var(--text-3);
  line-height: 1.7;
  margin-top: 16px;
}
.inline-link {
  color: var(--text-2);
  text-decoration: underline;
}

/* Success panel */
.success-panel {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  height: 100%;
  padding: 20px 0;
  animation: fadeUp 0.5s ease both;
}
.success-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: color-mix(in srgb, var(--accent) 18%, transparent);
  color: var(--accent);
  margin-bottom: 16px;
  animation: popIn 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
.success-check {
  stroke-dasharray: 30;
  stroke-dashoffset: 30;
  animation: drawCheck 0.5s ease 0.2s forwards;
}
.success-title {
  font-family: var(--serif);
  font-size: 22px;
  color: var(--text-1);
  margin-bottom: 8px;
}
.success-body {
  font-size: 14px;
  color: var(--text-2);
  font-weight: 300;
}

/* ============ HOW CAN WE HELP ============ */
.help-section {
  margin-top: 72px;
}
.help-heading {
  font-family: var(--serif);
  font-size: clamp(24px, 3vw, 32px);
  color: var(--text-1);
  text-align: center;
  margin-bottom: 32px;
}
.help-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
@media (max-width: 800px) {
  .help-grid { grid-template-columns: 1fr; }
}
.help-card {
  position: relative;
  overflow: hidden;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  min-height: 240px;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}
.help-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 34px 30px rgba(3, 114, 39, 0.25);
  border-color: var(--border-hi);
}

/* Diagonal green/plain split */
.help-card-split {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #1e6b3f 0%, #2f8f57 100%);
  clip-path: polygon(0 0, 62% 0, 0 78%);
  transition: clip-path 0.4s ease;
  z-index: 0;
}
.help-card:hover .help-card-split {
  clip-path: polygon(0 0, 72% 0, 0 90%);
}

.help-card-content {
  position: relative;
  z-index: 1;
  padding: 26px 24px;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.help-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius);
  background: rgba(255,255,255,0.14);
  color: #fff;
  margin-bottom: 18px;
  transition: transform 0.25s ease;
}
.help-card:hover .help-icon { transform: scale(1.08) rotate(-4deg); }
.help-title {
  font-family: var(--serif);
  font-size: 27px;
  margin-bottom: 10px;
  line-height: 1.3;
}
.help-body {
  font-size: 13px;
  line-height: 1.65;
  font-weight: 500;
  flex: 1;
  margin-bottom: 18px;
}
.help-action {
  font-family: var(--mono);
  font-size: 12px;
  color: var(--accent);
  text-decoration: underline;
  width: fit-content;
  transition: color 0.2s ease;
}
.help-action:hover { color: var(--accent); }
.help-action--btn {
  text-decoration: none;
  color: var(--accent);
  font-weight: 600;
}

/* ============ STORY BLOCKS ============ */
.story-section {
  margin-top: 88px;
  display: flex;
  flex-direction: column;
  gap: 64px;
}
.story-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
}
.story-row--reverse .story-image-wrap {
  order: 2;
}
.story-row--reverse .story-text {
  order: 1;
}
@media (max-width: 800px) {
  .story-row,
  .story-row--reverse {
    grid-template-columns: 1fr;
  }
  .story-row--reverse .story-image-wrap,
  .story-row--reverse .story-text {
    order: initial;
  }
}

.story-image-wrap {
  aspect-ratio: 4 / 3;
  border-radius: calc(var(--radius) + 6px);
  overflow: hidden;
  background: var(--surface-2, var(--surface));
  border: 1px solid var(--border);
}
.story-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease;
}
.story-row:hover .story-image { transform: scale(1.04); }

.story-eyebrow {
  display: block;
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 12px;
}
.story-title {
  font-family: var(--serif);
  font-size: clamp(21px, 2.6vw, 27px);
  color: var(--text-1);
  line-height: 1.3;
  margin-bottom: 14px;
}
.story-body {
  font-size: 14px;
  color: var(--text-3);
  line-height: 1.75;
  font-weight: 300;
}

/* ============ CLOSING CTA ============ */
.cta-strip {
  margin-top: 88px;
  text-align: center;
  padding: 48px 24px;
  border: 1px solid var(--border);
  border-radius: calc(var(--radius) + 8px);
  background: var(--surface);
}
.cta-title {
  font-family: var(--serif);
  font-size: clamp(20px, 2.6vw, 26px);
  color: var(--text-1);
  margin-bottom: 8px;
}
.cta-sub {
  font-size: 13.5px;
  color: var(--text-3);
  font-weight: 300;
  margin-bottom: 26px;
}
.cta-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}
.btn {
  display: inline-flex; align-items: center; font-family: var(--mono);
  font-size: 12px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase;
  padding: 13px 26px; border-radius: var(--radius); border: 1px solid var(--border);
  background: var(--bg); color: var(--text-2); text-decoration: none;
  transition: color 0.15s ease, border-color 0.15s ease, transform 0.15s ease;
}
.btn:hover { color: var(--text-1); border-color: var(--border-hi); transform: translateY(-2px); }
.btn--accent { background: var(--accent); border-color: var(--accent); color: #0a0a0b; font-weight: 700; }
.btn--accent:hover { background: #d4eb3c; border-color: #d4eb3c; }

/* ============ ANIMATIONS ============ */

/* Hero: entrance animation on load, no scroll trigger needed (above the fold) */
.hero-anim {
  opacity: 0;
  animation: fadeUp 0.6s ease forwards;
}

/* Scroll-triggered reveals: default hidden, IntersectionObserver adds .is-visible */
.reveal {
  opacity: 0;
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.reveal--up { transform: translateY(28px); }
.reveal--left { transform: translateX(-40px); }
.reveal--right { transform: translateX(40px); }
.reveal.is-visible {
  opacity: 1;
  transform: translate(0, 0);
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes popIn {
  0% { opacity: 0; transform: scale(0.5); }
  100% { opacity: 1; transform: scale(1); }
}

@keyframes drawCheck {
  to { stroke-dashoffset: 0; }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-4px); }
  40% { transform: translateX(4px); }
  60% { transform: translateX(-3px); }
  80% { transform: translateX(3px); }
}

@media (prefers-reduced-motion: reduce) {
  .hero-anim,
  .reveal,
  .success-panel,
  .success-icon,
  .success-check,
  .help-card,
  .help-icon,
  .story-image,
  .social-link,
  .btn,
  .btn-submit {
    animation: none !important;
    transition: none !important;
    opacity: 1 !important;
    transform: none !important;
    stroke-dashoffset: 0 !important;
  }
}
</style>