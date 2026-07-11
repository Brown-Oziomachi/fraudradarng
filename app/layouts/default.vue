<script setup lang="ts">
const route = useRoute()
const { theme, toggleTheme, initTheme } = useTheme()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()
const isSubscribeOpen = ref(false)

const isMobileMenuOpen = ref(false)
const openAccordion = ref<string | null>(null)

const isSearchOpen = ref(false)

function handleGlobalKeydown(e: KeyboardEvent) {
  const isCmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'
  if (isCmdK) {
    e.preventDefault()
    isSearchOpen.value = true
  }
}
const openDesktopMenu = ref<string | null>(null)
const desktopMenuRefs = ref<Record<string, HTMLElement | null>>({})

// Hover-driven mega-menu: a short close delay so moving the cursor from
// the trigger down into the menu (across the gap) doesn't slam it shut.
let hoverCloseTimer: ReturnType<typeof setTimeout> | null = null

function openMenuOnHover(id: string) {
  if (hoverCloseTimer) {
    clearTimeout(hoverCloseTimer)
    hoverCloseTimer = null
  }
  openDesktopMenu.value = id
}

function scheduleMenuClose() {
  if (hoverCloseTimer) clearTimeout(hoverCloseTimer)
  hoverCloseTimer = setTimeout(() => {
    openDesktopMenu.value = null
  }, 150)
}

onMounted(() => {
  initTheme()
  document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleGlobalKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleGlobalKeydown)
  if (hoverCloseTimer) clearTimeout(hoverCloseTimer)
})

function handleClickOutside(event: MouseEvent) {
  if (openDesktopMenu.value) {
    const currentRef = desktopMenuRefs.value[openDesktopMenu.value]
    if (currentRef && !currentRef.contains(event.target as Node)) {
      openDesktopMenu.value = null
    }
  }
}

// Click stays as a fallback (touch devices, keyboard activation via Enter/Space)
function toggleDesktopMenu(id: string) {
  openDesktopMenu.value = openDesktopMenu.value === id ? null : id
}

function closeDesktopMenu() {
  openDesktopMenu.value = null
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  if (isMobileMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
    openAccordion.value = null
  }
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
  document.body.style.overflow = ''
  openAccordion.value = null
}

function toggleAccordion(id: string) {
  openAccordion.value = openAccordion.value === id ? null : id
}

function openSubscribeFromMobile() {
  closeMobileMenu()
  isSubscribeOpen.value = true
}

// Small inline icon set for nav items — no external icon package needed.
const navIcons: Record<string, string> = {
  grid: `<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="8" height="8" rx="1.5" fill="currentColor"/><rect x="13" y="3" width="8" height="8" rx="1.5" fill="currentColor"/><rect x="3" y="13" width="8" height="8" rx="1.5" fill="currentColor"/><rect x="13" y="13" width="8" height="8" rx="1.5" fill="currentColor"/></svg>`,
  flag: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3v18"/><path d="M5 4h13l-2.5 4L18 12H5"/></svg>`,
  vault: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M12 9v0M7 4v3M17 4v3"/></svg>`,
  chart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10M12 20V4M20 20v-7"/></svg>`,
  alert: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/></svg>`,
  users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  book: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></svg>`,
  info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/></svg>`,
  building: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22v-4h6v4M9 6h.01M15 6h.01M9 10h.01M15 10h.01M9 14h.01M15 14h.01"/></svg>`,
  mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg>`,
  help: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.1 9a3 3 0 0 1 5.83 1c0 2-3 2-3 4M12 17h.01"/></svg>`,
  handshake: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 3 3a1 1 0 1 0 3-3l-3.7-3.7"/><path d="M9 12 4 7"/><path d="m2 9 3-3 6 6-1.5 1.5"/><path d="m13.5 6.5 1-1a2 2 0 0 1 3 0l3 3"/></svg>`,
  shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>`,
  target: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1" fill="currentColor"/></svg>`,
  share: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-3.9M8.6 13.5l6.8 3.9"/></svg>`,
  lock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>`,
  doc: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M9 13h6M9 17h6"/></svg>`,
  scale: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M5 8l-3 6a3 3 0 0 0 6 0ZM22 8l-3 6a3 3 0 0 0 6 0ZM3 8h4M17 8h4M7 3h10"/></svg>`,
  recover: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg>`,
  megaphone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 11 18-5v12L3 13v-2Z"/><path d="M11.6 16.8 13 22h-3l-1.6-5.6"/></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/></svg>`,
  shieldCheck: `<svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 11 11 13 15 9"/></svg>`,

}

// Each section has one promo (image + caption + Learn More link) shown on
// desktop mega-menus only, plus a grid of items — each with an icon and a
// one-line description — shared by both desktop and mobile navigation.
const mobileSections = [
 {
  id: 'reports',
  label: 'Reports',
  promo: {
    image: '/reports.png',
    eyebrow: 'Community reports',
    title: 'See what\'s been flagged this week',
    to: '/reports',
  },
  items: [
    { label: 'All reports', to: '/reports', icon: 'grid', desc: 'Browse every report submitted so far.' },
    { label: 'Report a scam', to: '/report/new', icon: 'flag', desc: "Tell us who's targeting Nigerians right now." },
    { label: 'BlackList Vault', to: '/blacklistvault', icon: 'vault', desc: 'Search confirmed scammers before you pay.' },
    { label: 'Government Escalation Desk', to: '/fraud/patterns', icon: 'chart', desc: 'See which scam types are trending and get help.' },
    { label: 'Flag a reports on FRNG', to: '/flag/report', icon: 'alert', desc: 'Dispute or flag an existing report.' },
    { label: 'Most flagged Accounts', to: '/most-flagged', icon: 'users', desc: 'The handles and numbers reported most.' },
  ]
},
  {
    id: 'resources',
    label: 'Resources',
    promo: {
      image: '/stay.png',
      eyebrow: 'Stay informed',
      title: 'research scams, learn how to avoid them',
      to: '/guides',
    },
    items: [
      { label: 'Safety guides', to: '/guides', icon: 'book', desc: 'Practical steps to avoid common scams.' },
      { label: 'How it works', to: '/how-it-works', icon: 'info', desc: 'How reports get verified and shared.' },
      { label: 'Domain Literacy', to: '/greenlist', icon: ' shieldCheck', desc: 'Master character-by-character URL inspection to catch clone sites instantly.' 
}
    ]
  },
  {
    id: 'platform',
    label: 'Platform',
    promo: {
      image: '/about.png',
      eyebrow: 'About FRNG',
      title: 'Built by Nigerians, for Nigerians',
      to: '/about-FRNG',
    },
    items: [
      { label: 'About FRNG', to: '/about-FRNG', icon: 'building', desc: 'Why we built Fraud Radar Nigeria.' },
      { label: 'Contact', to: '/contact', icon: 'mail', desc: 'Reach the team behind FRNG.' },
      { label: 'FAQ', to: '/faq', icon: 'help', desc: 'Answers to what we get asked most.' },
      { label: 'Partnership', to: '/partnership_FRNG', icon: 'handshake', desc: 'Work with us to fight fraud.' },
      { label: 'Trust & moderation', to: '/trust', icon: 'shield', desc: 'How we verify and moderate reports.' },
      { label: 'Vision & Mission', to: '/vision-mission-statement', icon: 'target', desc: "What we're building toward, and why." },
      { label: 'Follow FRNG', to: '/follow', icon: 'share', desc: 'Stay updated across social media.' },
    ]
  },
   {
    id: 'legal',
    label: 'Legal',
    promo: {
      image: '/legal.png',
      eyebrow: 'Stay informed',
      title: 'Legal and privacy information',
      to: '/privacy-notice',
    },
    items: [
      { label: 'Privacy Policy', to: '/privacy-notice', icon: 'lock', desc: 'How your data is handled.' },
      { label: 'Terms of Service', to: '/terms', icon: 'doc', desc: 'The rules for using FRNG.' },
      { label: 'Politics', to: '/politics', icon: 'scale', desc: 'Our position on political neutrality.' },
      { label: 'Disclaimer', to: '/disclaimer', icon: 'alert', desc: "What FRNG is, and isn't." },
    ]
  },
   {
    id: 'help',
    label: 'Help & Reporting',
    promo: {
      image: '/trusts.png',
      eyebrow: 'Stay informed',
      title: 'Get help or report a scam',
      to: '/help',
    },
    items: [
      { label: 'Help Center', to: '/help', icon: 'help', desc: 'Get support using the platform.' },
      { label: 'Naira Recovery Pipeline', to: '/recovery', icon: 'recover', desc: 'Steps to try and recover funds.' },
      { label: 'Community Awareness', to: '/community', icon: 'megaphone', desc: 'Campaigns to spread scam awareness.' },
      { label: 'Check Before You Pay', to: '/lookupsearch', icon: 'search', desc: 'Look up a number before sending money.' },
      { label: 'FRNG Intelligence(Coming Soon)', to: '/intelligence',  icon: 'cpu', desc: 'Proactive cyber-threat analytics and real-time fraud prevention engines.' 
}
    ]
  },
]

function close() {
  emit('update:modelValue', false)
}
</script>

<template>
  <div class="page">
    <header class="site-header">
      <NuxtLink to="/" class="brand">
  <img src="/FRLOGO.png" alt="Fraud Radar NG" class="brand-logo" />
  <span class="brand-text">
    <span class="brand-name">FRNG</span>
    <span class="brand-subtext">Fraud Radar NIGERIA</span>
  </span>
</NuxtLink>

      <!-- ===================== DESKTOP NAV ===================== -->
      <nav class="nav">

        <div
          v-for="section in mobileSections"
          :key="section.id"
          :ref="el => (desktopMenuRefs[section.id] = el as HTMLElement)"
          class="nav-dropdown"
          @mouseenter="openMenuOnHover(section.id)"
          @mouseleave="scheduleMenuClose"
        >
          <button
            type="button"
            class="nav-dropdown-trigger"
            :class="{ 'nav-dropdown-trigger--active': openDesktopMenu === section.id }"
            :aria-expanded="openDesktopMenu === section.id"
            @click="toggleDesktopMenu(section.id)"
          >
            {{ section.label }}
            <svg viewBox="0 0 24 24" width="11" height="11" fill="none" class="nav-caret">
              <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>

          <div v-if="openDesktopMenu === section.id" class="mega-menu">
            <div class="mega-menu-promo">
              <img :src="section.promo.image" :alt="section.promo.title" class="mega-menu-promo-image" />
              <div class="mega-menu-promo-text">
                <span class="mega-menu-promo-eyebrow">{{ section.promo.eyebrow }}</span>
                <span class="mega-menu-promo-title">{{ section.promo.title }}</span>
                <NuxtLink
                  :to="section.promo.to"
                  class="mega-menu-promo-btn"
                  @click="closeDesktopMenu"
                >
                  Learn more
                </NuxtLink>
              </div>
            </div>

            <div class="mega-menu-links">
              <NuxtLink
                v-for="item in section.items"
                :key="item.to"
                :to="item.to"
                class="mega-menu-item"
                @click="closeDesktopMenu"
              >
                <span class="mega-menu-item-icon" v-html="navIcons[item.icon]" />
                <span class="mega-menu-item-text">
                  <span class="mega-menu-item-title">{{ item.label }}</span>
                  <span class="mega-menu-item-desc">{{ item.desc }}</span>
                </span>
              </NuxtLink>
            </div>
          </div>
        </div>

        <NuxtLink to="/contact" class="nav-link">Contact us</NuxtLink>

        <!-- Inside .nav, alongside theme-toggle -->
        <button
          type="button"
          class="search-trigger"
          aria-label="Search reports and guides"
          @click="isSearchOpen = true"
        >
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/>
            <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <kbd class="search-trigger-kbd">⌘K</kbd>
        </button>

        <button
          type="button"
          class="theme-toggle"
          :aria-label="theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'"
          @click="toggleTheme"
        >
          <svg v-if="theme === 'light'" viewBox="0 0 24 24" width="15" height="15" fill="none">
            <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" width="15" height="15" fill="none">
            <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2"/>
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>

        <button type="button" class="nav-link" @click="isSubscribeOpen = true">
          Subscribe
        </button>

        <NuxtLink to="/report/new" class="nav-link nav-link--cta">
          Report a scam
        </NuxtLink>
        
      </nav>

 <div class="mobile-icon-group">
  <button
    type="button"
    class="mobile-search-btn"
    aria-label="Search reports and guides"
    @click="isSearchOpen = true"
  >
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/>
      <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  </button>

  <!-- Mobile hamburger -->
  <button
    type="button"
    class="hamburger-btn"
    aria-label="Open menu"
    @click="toggleMobileMenu"
  >
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
      <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  </button>
</div>
    </header>

    <!-- ===================== MOBILE MENU OVERLAY ===================== -->
    <Transition name="mobile-menu">
      <div v-if="isMobileMenuOpen" class="mobile-menu">
      <div class="mobile-menu-header">
  <NuxtLink to="/" class="mobile-brand" @click="closeMobileMenu">
    <img src="/FRLOGO.png" alt="Fraud Radar NG" class="mobile-brand-logo" />
    <span class="mobile-brand-text">
      <span class="mobile-brand-name">FRNG</span>
      <span class="mobile-brand-subtext">Fraud Radar NIGERIA</span>
    </span>
  </NuxtLink>
  <button type="button" class="mobile-close-btn" aria-label="Close menu" @click="closeMobileMenu">
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  </button>
</div>

        <div class="mobile-menu-body">
          <div
            v-for="section in mobileSections"
            :key="section.id"
            class="accordion-section"
          >
            <button
              type="button"
              class="accordion-trigger"
              @click="toggleAccordion(section.id)"
            >
              <span>{{ section.label }}</span>
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                class="accordion-chevron"
                :class="{ 'accordion-chevron--open': openAccordion === section.id }"
              >
                <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>

            <Transition name="accordion">
              <div v-if="openAccordion === section.id" class="accordion-content">
                <NuxtLink
                  v-for="item in section.items"
                  :key="item.to"
                  :to="item.to"
                  class="accordion-item"
                  @click="closeMobileMenu"
                >
                  <span class="accordion-item-title">{{ item.label }}</span>
                  <span class="accordion-item-desc">{{ item.desc }}</span>
                </NuxtLink>
              </div>
            </Transition>
          </div>
        </div>

        <div class="mobile-menu-footer">
          <button type="button" class="mobile-action-row" @click="openSubscribeFromMobile">
            <span class="mobile-action-icon">✉</span>
            <span>Subscribe for alerts</span>
          </button>

          <button type="button" class="mobile-action-row" @click="toggleTheme">
            <span class="mobile-action-icon">
              <svg v-if="theme === 'light'" viewBox="0 0 24 24" width="15" height="15" fill="none">
                <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" width="15" height="15" fill="none">
                <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2"/>
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </span>
            <span>{{ theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode' }}</span>
          </button>

          <NuxtLink to="/report/new" class="mobile-cta" @click="closeMobileMenu">
            Report a scam
          </NuxtLink>
        </div>
      </div>
    </Transition>

    <main class="content">
      <slot />
    </main>

    <SiteFooter v-if="!route.meta.hideFooter"/>
    <SearchModal v-model="isSearchOpen" />
    <SubscribeModal v-model="isSubscribeOpen" privacy-notice-url="/privacy-notice" />
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding: 1px 44px;
  border-bottom: 1px solid var(--border);
  background: color-mix(in srgb, var(--bg) 85%, transparent);

}

@media (max-width: 720px) {
  .site-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
  }

  /* Push page content down so it doesn't hide under the now-fixed header */
  .content {
    padding-top: 68px; /* adjust to match your actual mobile header height */
  }
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  position: relative;
}

.brand-logo {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 50%;
  position: relative;
  box-shadow:
    0 0 0 2px var(--bg),
    0 0 0 3.5px var(--accent),
    0 6px 18px rgba(232, 255, 71, 0.35);
  transition: box-shadow 0.25s ease, transform 0.25s ease;
}

.brand:hover .brand-logo {
  transform: scale(1.04);
  box-shadow:
    0 0 0 2px var(--bg),
    0 0 0 3.5px var(--accent),
    0 8px 24px rgba(232, 255, 71, 0.55);
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1;
  position: relative;
}

.brand-name {
  font-family: var(--mono);
  font-size: 48px;
  font-weight: 800;
  letter-spacing: -0.02em;
  position: relative;
  display: inline-block;
  background: linear-gradient(100deg, var(--text-1) 30%, var(--accent) 55%, var(--text-1) 80%);
  background-size: 220% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: brandShine 5s ease-in-out infinite;
}

@keyframes brandShine {
  0%   { background-position: 0% 0%; }
  50%  { background-position: 100% 0%; }
  100% { background-position: 0% 0%; }
}

@media (prefers-reduced-motion: reduce) {
  .brand-name {
    animation: none;
    background-position: 0% 0%;
  }
}

.brand-subtext {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-3);
  margin-top: 2px;
  position: relative;
  padding-bottom: 4px;
}

/* accent underline that draws in beneath the subtext */
.brand-subtext::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  height: 1.5px;
  width: 100%;
  background: var(--accent);
  transform: scaleX(0.3);
  transform-origin: left;
  opacity: 0.6;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.brand:hover .brand-subtext::after {
  transform: scaleX(1);
  opacity: 1;
}

@media (max-width: 720px) {
  .brand-subtext { font-size: 8px; }
}

.nav {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

@keyframes status-pulse {
  0%   { box-shadow: 0 0 0 0 rgba(74,222,128,0.5); }
  100% { box-shadow: 0 0 0 6px rgba(74,222,128,0); }
}

.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: none;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  cursor: pointer;
  color: var(--text-2);
  transition: border-color 0.15s, background 0.15s, color 0.15s;
}
.theme-toggle:hover {
  border-color: var(--border-hi);
  background: var(--surface-2);
  color: var(--text-1);
}

.nav-link {
  font-family: var(--mono); font-size: 11px; letter-spacing: 0.04em;
  color: var(--text-2); text-decoration: none;
  padding: 8px 14px; border-radius: var(--radius);
  border: 1px solid var(--border);
  transition: border-color 0.15s, color 0.15s, background 0.15s;
  background: none;
  cursor: pointer;
  font-family: var(--mono);
}
.nav-link:hover {
  border-color: var(--border-hi);
  color: var(--text-1);
}

.nav-link--cta {
  background: var(--accent);
  color: #0a0a0b;
  font-weight: 600;
  border-color: var(--accent);
}
.nav-link--cta:hover {
  background: #d4eb3c;
  border-color: #d4eb3c;
}

/* ============ DESKTOP MEGA-MENU — full viewport width ============ */
.nav-dropdown {
  position: static; /* mega-menu positions against viewport, not trigger */
}

.nav-dropdown-trigger {
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: var(--sans);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.01em;
  color: var(--text-3);
  background: none;
  border: 1px solid transparent;
  border-radius: var(--radius);
  padding: 8px 14px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}

.nav-dropdown-trigger:hover {
  color: var(--text-1);
  border-color: var(--border);
}

.nav-dropdown-trigger--active {
  background: var(--accent-dim, rgba(74, 222, 128, 0.12));
  color: var(--accent, #2d7a3f);
  border-color: transparent;
}

.nav-caret {
  flex-shrink: 0;
  transition: transform 0.15s;
}
.nav-dropdown-trigger--active .nav-caret {
  transform: rotate(180deg);
}

.mega-menu {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 97vw;
  background: var(--surface);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border-hi);
  box-shadow: 0 20px 40px rgba(0,0,0,0.12);
  border-radius: var(--radius);
  display: flex;
  z-index: 60;
  min-height: 320px;
  padding-top: 1px;
  margin-top: -1px;
}

.mega-menu-promo {
  flex: 0 0 340px;
  position: relative;
  overflow: hidden;
}

.mega-menu-promo-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  position: absolute;
  inset: 0;
}

.mega-menu-promo-text {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  padding: 32px;
  height: 100%;
  justify-content: flex-end;
  background: linear-gradient(180deg, rgba(10,10,11,0) 40%, rgba(10,10,11,0.85) 100%);
}

.mega-menu-promo-eyebrow {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent);
}

.mega-menu-promo-title {
  font-family: var(--serif);
  font-size: 20px;
  color: #fdfdfa;
  line-height: 1.3;
  max-width: 260px;
}

.mega-menu-promo-btn {
  margin-top: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 18px;
  border-radius: 999px;
  background: #fdfdfa;
  color: var(--accent, #2d7a3f);
  font-family: var(--sans);
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.mega-menu-promo-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
}

.mega-menu-links {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-content: start;
  gap: 6px 48px;
  padding: 40px 60px;
}

.mega-menu-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 14px 10px;
  border-radius: var(--radius);
  text-decoration: none;
  transition: background 0.15s;
}
.mega-menu-item:hover {
  background: var(--surface-2);
}
.mega-menu-item:hover .mega-menu-item-title {
  color: var(--accent);
}

.mega-menu-item-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: var(--accent-dim, rgba(74, 222, 128, 0.12));
  color: var(--accent, #2d7a3f);
}
.mega-menu-item-icon :deep(svg) {
  width: 16px;
  height: 16px;
}

.mega-menu-item-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.mega-menu-item-title {
  font-family: var(--sans);
  font-size: 14px;
  font-weight: 700;
  color: var(--text-1);
  transition: color 0.15s;
}

.mega-menu-item-desc {
  font-family: var(--sans);
  font-size: 12.5px;
  line-height: 1.4;
  color: var(--text-3);
}

.content {
  flex: 1;
  width: 100%;
}

.site-footer {
  border-top: 1px solid var(--border);
  padding: 24px;
}
.footer-inner {
  max-width: 1120px;
  margin: 0 auto;
  font-family: var(--mono); font-size: 10px;
  color: var(--text-3);
  display: flex; align-items: center; gap: 8px;
}
.footer-logo {
  width: 16px;
  height: 16px;
  object-fit: contain;
  border-radius: 3px;
}
.footer-dot { color: var(--border-hi); }

/* ============ HAMBURGER (mobile only) ============ */
.hamburger-btn {
  display: none;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: none;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--text-1);
  cursor: pointer;
  flex-shrink: 0;
}

.mobile-search-btn {
  display: none;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: none;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--text-1);
  cursor: pointer;
  flex-shrink: 0;
}

.mobile-icon-group {
  display: none;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

@media (max-width: 720px) {
  .mobile-icon-group { display: flex; }
}

@media (max-width: 720px) {
  .nav { display: none; }
  .hamburger-btn { display: flex; }
  .mobile-search-btn { display: flex; } 
  .site-header { padding: 10px 20px; }
  .brand-logo { width: 44px; height: 44px; }
  .brand-name { font-size: 35px; }
}

/* ============ MOBILE MENU OVERLAY ============ */
.mobile-menu {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: var(--bg);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.mobile-menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}
.mobile-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}
.mobile-brand-logo {
  width: 36px;
  height: 36px;
  object-fit: contain;
  border-radius: 50%;
  box-shadow: 0 0 0 2px var(--bg), 0 0 0 3px var(--accent);
}

.mobile-brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.mobile-brand-name {
  font-family: var(--mono);
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.02em;
  background: linear-gradient(100deg, var(--text-1) 30%, var(--accent) 55%, var(--text-1) 80%);
  background-size: 220% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.mobile-brand-subtext {
  font-family: var(--mono);
  font-size: 8px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-3);
  margin-top: 2px;
}
.mobile-close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  color: var(--text-1);
  cursor: pointer;
}

.mobile-menu-body {
  flex: 1;
  padding: 8px 20px;
}

.accordion-section {
  border-bottom: 1px solid var(--border);
}

.accordion-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: none;
  border: none;
  padding: 20px 4px;
  font-family: var(--serif);
  font-size: 19px;
  color: var(--text-1);
  cursor: pointer;
  text-align: left;
}

.accordion-chevron {
  color: var(--text-2);
  transition: transform 0.2s ease;
  flex-shrink: 0;
}
.accordion-chevron--open {
  transform: rotate(180deg);
}

.accordion-content {
  display: flex;
  flex-direction: column;
  padding: 0 4px 16px;
  overflow: hidden;
}

.accordion-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 12px;
  text-decoration: none;
  border-radius: var(--radius);
  transition: background 0.15s, color 0.15s;
}
.accordion-item:hover {
  background: var(--surface-2);
}
.accordion-item-title {
  font-family: var(--mono);
  font-size: 13px;
  color: var(--text-2);
}
.accordion-item:hover .accordion-item-title {
  color: var(--text-1);
}
.accordion-item-desc {
  font-family: var(--sans);
  font-size: 11.5px;
  color: var(--text-3);
}

.accordion-enter-active,
.accordion-leave-active {
  transition: max-height 0.25s ease, opacity 0.2s ease;
  max-height: 400px;
}
.accordion-enter-from,
.accordion-leave-to {
  max-height: 0;
  opacity: 0;
}

.mobile-menu-footer {
  flex-shrink: 0;
  padding: 16px 20px 28px;
  border-top: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mobile-action-row {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 14px 16px;
  background: var(--surface-2);
  border: none;
  border-radius: var(--radius);
  font-family: var(--mono);
  font-size: 13px;
  color: var(--text-1);
  cursor: pointer;
  text-align: left;
}
.mobile-action-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  color: var(--text-2);
}

.mobile-cta {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 4px;
  padding: 14px;
  background: var(--accent);
  color: #0a0a0b;
  font-weight: 600;
  font-family: var(--mono);
  font-size: 13px;
  letter-spacing: 0.04em;
  border-radius: var(--radius);
  text-decoration: none;
}
.mobile-cta:hover {
  background: #d4eb3c;
}

/* Overlay transition */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.2s ease;
}
.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
}

.search-trigger:hover {
  border-color: var(--border-hi);
  background: var(--surface-2);
  color: var(--text-1);
}
.search-trigger-kbd {
  font-family: var(--mono);
  font-size: 9.5px;
  color: var(--text-3);
  border: 1px solid var(--border);
  border-radius: 3px;
  padding: 1px 4px;
}
@media (max-width: 720px) {
  .search-trigger { display: none; }
}
</style>