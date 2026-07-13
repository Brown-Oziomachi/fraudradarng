<script setup lang="ts">
const currentYear = new Date().getFullYear()
const isSubscribeOpen = ref(false)

const aboutLinks = [
  { label: 'How it works', to: '/how-it-works' },
  { label: 'Trust & moderation', to: '/trust' },
  { label: 'Partnership', to: '/partnership_FRNG' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Vision & Mission', to: '/vision-mission-statement' },
  { label: 'Follow FRNG', to: '/follow' },
  { label: 'Domain Literacy', to: '/greenlist' },
]

const reportsLinks = [
  { label: 'Report a scam', to: '/report/new' },
  { label: 'Browse reports', to: '/reports' },
  { label: 'Most flagged', to: '/most-flagged' },
  { label: 'Safety guides', to: '/guides' },
  { label: 'Fraud categories', to: '/categories' },
  { label: 'Flag a reports on FRNG', to: '/flag/report' },
  { label: 'Most flagged Accounts', to: '/most-flagged' },
  { label: 'Check Before You Pay', to: '/lookupsearch' },
  { label: 'BlackList Vault', to: '/blacklistvault' },
  { label: 'Government Escalation Desk', to: '/fraud/patterns' },
]

const quickLinks = [
  { label: 'About FRNG', to: '/about-FRNG' },
  { label: 'Contact', to: '/contact' },
  { label: 'Privacy Notice', to: '/privacy-notice' },
  { label: 'Terms & Conditions', to: '/terms' },
  { label: 'Politics', to: '/politics' },
  { label: 'Disclaimer', to: '/disclaimer' },
  { label: 'Help Center', to: '/help' },
  { label: 'Naira Recovery Pipeline', to: '/recovery' },
  { label: 'Community Awareness', to: '/community' },
  { label: 'FRNG Intelligence', to: '/intelligence' },
]

const emergencyContacts = [
  { label: 'EFCC', href: 'https://www.efcc.gov.ng/ScamSafety' },
  { label: 'NPF Cybercrime', href: 'https://portal.police.gov.ng' },
  { label: 'CBN Consumer Protection', href: 'https://www.cbn.gov.ng/supervision/cpd.asp' },
]
</script>

<template>
  <footer class="site-footer">
    <div class="footer-inner">

      <!-- Top: brand+contact block | link columns -->
      <div class="footer-top">
        <div class="footer-brand-block">
          <div class="brand-row">
            <NuxtLink to="/" class="brand-logo-link">
              <img src="/FRLOGO.png" alt="Fraud Radar NG" class="brand-logo" />
            </NuxtLink>
            <span class="brand-wordmark">Fraud Radar NG</span>
          </div>
          <p class="brand-address">
            A community-powered fraud radar for Nigeria.<br />
            Built so people can warn each other before the<br />
            next scam finds a new victim.
          </p>

          <div class="brand-divider" />

          <h4 class="contact-heading">Emergency &amp; Reporting</h4>
          <div class="contact-list">

             <a v-for="contact in emergencyContacts"
              :key="contact.label"
              :href="contact.href"
              target="_blank"
              rel="noopener"
              class="contact-row"
            >
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1.1.4 2.1.8 3.1a2 2 0 0 1-.4 2.1L8.1 10.3a16 16 0 0 0 6 6l1.4-1.4a2 2 0 0 1 2.1-.4c1 .4 2 .7 3.1.8a2 2 0 0 1 1.7 2Z"/>
              </svg>
              {{ contact.label }}
            </a>
            <button type="button" class="contact-row contact-row--btn" @click="isSubscribeOpen = true">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8">
                <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 6 10 7 10-7"/>
              </svg>
              Get scam alerts by email
            </button>
          </div>
        </div>

        <div class="footer-vdivider" />

        <div class="footer-col">
          <h4 class="col-heading">About Us</h4>
          <NuxtLink v-for="link in aboutLinks" :key="link.to" :to="link.to" class="footer-link">
            {{ link.label }}
          </NuxtLink>
        </div>

        <div class="footer-col">
          <h4 class="col-heading">Reports</h4>
          <NuxtLink v-for="link in reportsLinks" :key="link.to" :to="link.to" class="footer-link">
            {{ link.label }}
          </NuxtLink>
        </div>

        <div class="footer-col footer-col--social">
          <h4 class="col-heading">Follow</h4>
          <div class="social-row">
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

          <div class="app-badge" aria-disabled="true">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M3.6 2.3 13.9 12 3.6 21.7c-.4-.2-.6-.6-.6-1.1V3.4c0-.5.2-.9.6-1.1Zm11.2 10.6 2.6-2.6 3.2 1.8c.8.5.8 1.5 0 2l-3.2 1.8-2.6-2.6Zm-.9-.9L4.5 2.5l9-5 3.4 1.9-9 5Zm0 1.8 9 5-3.4 1.9-9-5 3.4-1.9Z"/>
            </svg>
            <div class="app-badge-text">
              <span class="app-badge-small">Coming soon to</span>
              <span class="app-badge-big">Google Play</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Links row -->
      <div class="quick-links-block">
        <h4 class="col-heading">Quick Links</h4>
        <div class="quick-links-grid">
          <NuxtLink v-for="link in quickLinks" :key="link.to" :to="link.to" class="quick-link">
            {{ link.label }}
          </NuxtLink>
        </div>
      </div>

      <!-- Coverage strip -->
      <p class="coverage-text">
        Built for all 36 states and the FCT — from Lagos and Abuja to Kano
        and Port Harcourt, one shared radar for the whole country.
      </p>

      <!-- Divider with centered dot -->
      <div class="dot-divider">
        <span class="dot-divider-line" />
        <span class="dot-divider-dot" />
        <span class="dot-divider-line" />
      </div>

      <!-- Centered copyright -->
      <p class="copyright">
        Copyright © {{ currentYear }} Fraud Radar NG. Built by Sir Brown AD.
        &nbsp;|&nbsp; All rights reserved.
      </p>

      <p class="disclaimer">
        Fraud Radar NG is an independent, community-run awareness platform.
        It is not a bank, law enforcement agency, or government body, and
        does not verify reports before publishing. If you are a victim of
        fraud, also report to your bank and the Nigeria Police Force /
        EFCC through their official channels.
      </p>
    </div>

    <SubscribeModal v-model="isSubscribeOpen" privacy-notice-url="/privacy-notice" />
  </footer>
</template>

<style scoped>
.site-footer {
  background: var(--bg);
  color: var(--text-2);
  border-top: 1px solid var(--border);
  padding: 64px 24px 40px;
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
}

/* Top section: brand block + link columns */
.footer-top {
  display: grid;
  grid-template-columns: 1.3fr auto 1fr 1fr 1fr;
  gap: 40px;
  align-items: start;
  margin-bottom: 56px;
}
@media (max-width: 900px) {
  .footer-top { grid-template-columns: 1fr 1fr; }
  .footer-vdivider { display: none; }
}
@media (max-width: 560px) {
  .footer-top { grid-template-columns: 1fr; }
}

.footer-brand-block { display: flex; flex-direction: column; }

.brand-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.brand-logo-link { display: flex; align-items: center; }
.brand-logo {
  width: 84px;
  height: 84px;
  object-fit: cover;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(9, 229, 90, 0.807);
}

.brand-wordmark {
  font-family: var(--serif);
  font-size: 28px;
  font-weight: 800;
  color: var(--text-1);
  line-height: 1.1;
}

.brand-address {
  font-size: 13.5px;
  color: var(--text-3);
  line-height: 1.6;
  font-weight: 300;
  margin-bottom: 18px;
}

.brand-divider {
  border-top: 1px solid var(--border);
  margin-bottom: 16px;
}

.contact-heading {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-1);
  margin-bottom: 12px;
}

.contact-list { display: flex; flex-direction: column; gap: 10px; }

.contact-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-2);
  text-decoration: none;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
}
.contact-row:hover { color: var(--accent); }
.contact-row svg { flex-shrink: 0; color: var(--text-3); }

.footer-vdivider {
  width: 1px;
  align-self: stretch;
  background: var(--border);
}

.footer-col { display: flex; flex-direction: column; gap: 12px; }
.footer-col--social { align-items: flex-start; }

.col-heading {
  font-size: 17px;
  font-weight: 700;
  color: var(--text-1);
  margin-bottom: 4px;
}

.footer-link {
  font-size: 13.5px;
  color: var(--text-2);
  text-decoration: none;
  transition: color 0.15s;
}
.footer-link:hover { color: var(--accent); }

.social-row { display: flex; gap: 10px; margin-bottom: 16px; }
.social-link {
  display: flex; align-items: center; justify-content: center;
  width: 32px; height: 32px; border-radius: 6px;
  border: 1px solid var(--border);
  color: var(--text-3);
  transition: border-color 0.15s, color 0.15s;
}
.social-link:hover { border-color: var(--border-hi); color: var(--text-1); }

.app-badge {
  display: inline-flex; align-items: center; gap: 8px; padding: 8px 12px;
  border: 1px solid var(--border); border-radius: 6px;
  color: var(--text-3); opacity: 0.85;
}
.app-badge-text { display: flex; flex-direction: column; line-height: 1.2; }
.app-badge-small { font-size: 9px; letter-spacing: 0.02em; }
.app-badge-big { font-size: 12px; font-weight: 600; color: var(--text-2); }

/* Quick links row */
.quick-links-block { margin-bottom: 20px; }

.quick-links-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px 24px;
  margin-top: 16px;
}

@media (max-width: 900px) {
  .quick-links-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .quick-links-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px 16px;
  }
}

.quick-link {
  font-size: 13.5px;
  color: var(--text-2);
  text-decoration: none;
  transition: color 0.15s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.quick-link:hover { color: var(--accent); }

/* Coverage */
.coverage-text {
  font-size: 12.5px;
  color: var(--text-3);
  line-height: 1.6;
  font-weight: 300;
  margin-bottom: 32px;
  max-width: 640px;
}

/* Dot divider */
.dot-divider {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 28px;
}
.dot-divider-line {
  flex: 1;
  height: 1px;
  background: var(--accent);
}
.dot-divider-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #08e931;
  flex-shrink: 0;
}

/* Bottom */
.copyright {
  text-align: center;
  font-size: 13px;
  color: var(--text-2);
  margin-bottom: 20px;
}

.disclaimer {
  text-align: center;
  font-size: 11px;
  color: var(--text-3);
  line-height: 1.7;
  font-weight: 300;
  max-width: 760px;
  margin: 0 auto;
}
</style>