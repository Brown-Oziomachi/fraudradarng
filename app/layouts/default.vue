<script setup lang="ts">
const route = useRoute()
const { theme, toggleTheme, initTheme } = useTheme()
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

onMounted(() => {
  initTheme()
  document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleGlobalKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleGlobalKeydown) 
})

function handleClickOutside(event: MouseEvent) {
  if (openDesktopMenu.value) {
    const currentRef = desktopMenuRefs.value[openDesktopMenu.value]
    if (currentRef && !currentRef.contains(event.target as Node)) {
      openDesktopMenu.value = null
    }
  }
}

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

// Each section has one promo (image + caption) shown on desktop
// mega-menus only, plus a plain list of links shared by both
// desktop and mobile navigation.
const mobileSections = [
 {
  id: 'reports',
  label: 'Reports',
  promo: {
    image: '/reports.png',
    eyebrow: 'Community reports',
    title: 'See what\'s been flagged this week'
  },
  items: [
    { label: 'All reports', to: '/reports' },
    { label: 'Report a scam', to: '/report/new' },
    { label: 'BlackList Vault', to: '/blacklistvault' },
    { label: 'Fraud categories', to: '/categories' },
    { label: 'Flag a reports on FRNG', to: '/flag/report' },
    { label: 'Most flagged Accounts', to: '/most-flagged' },
  ]
},
  {
    id: 'resources',
    label: 'Resources',
    promo: {
      image: '/stay.png',
      eyebrow: 'Stay informed',
      title: 'research scams, learn how to avoid them'
    },
    items: [
      { label: 'Safety guides', to: '/guides' },
      { label: 'How it works', to: '/how-it-works' },
    ]
  },
  {
    id: 'company',
    label: 'Company',
    promo: {
      image: '/about.png',
      eyebrow: 'About FRNG',
      title: 'Built by Nigerians, for Nigerians'
    },
    items: [
      { label: 'About FRNG', to: '/about-FRNG' },
      { label: 'Contact', to: '/contact' },
      { label: 'FAQ', to: '/faq' },
      { label: 'Partnership', to: '/partnership_FRNG' },
      { label: 'Trust & moderation', to: '/trust' },
      { label: 'Vision & Mission', to: '/vision-mission-statement'},
    ]
  },
   {
    id: 'legal',
    label: 'Legal',
    promo: {
      image: '/legal.png',
      eyebrow: 'Stay informed',
      title: 'Legal and privacy information'
    },
    items: [
      { label: 'Privacy Policy', to: '/privacy-notice' },
      { label: 'Terms of Service', to: '/terms' },
      { label: 'Politics', to: '/politics' },
      { label: 'Disclaimer', to: '/disclaimer' },
    ]
  },
   {
    id: 'help',
    label: 'Help & Reporting',
    promo: {
      image: '/trusts.png',
      eyebrow: 'Stay informed',
      title: 'Get help or report a scam'
    },
    items: [
      { label: 'Help Center', to: '/help' },
      { label: 'Naira Recovery Pipeline', to: '/recovery' },
      { label: 'Community Awareness', to: '/community' },
    ]
  },
]
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
        >
          <button
            type="button"
            class="nav-dropdown-trigger"
            :class="{ 'nav-dropdown-trigger--active': openDesktopMenu === section.id }"
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
              </div>
            </div>

            <div class="mega-menu-links">
              <NuxtLink
                v-for="item in section.items"
                :key="item.to"
                :to="item.to"
                class="mega-menu-link"
                @click="closeDesktopMenu"
              >
                {{ item.label }}
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
                  {{ item.label }}
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
  gap: 8px;
  text-decoration: none;
}
.brand-logo {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(9, 229, 90, 0.807);
}
.brand-name {
  font-family: var(--mono);
  font-size: 48px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--text-1);
  position: relative;
  display: inline-block;
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.brand-subtext {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-3);
  margin-top: 2px;
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
  width: 100vw;
  background: var(--surface);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border-hi);
  box-shadow: 0 20px 40px rgba(0,0,0,0.12);
  display: flex;
  z-index: 60;
  min-height: 320px;
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

.mega-menu-links {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 40px 60px;
  gap: 4px;
}

.mega-menu-link {
  font-family: var(--mono);
  font-size: 14px;
  color: var(--text-2);
  text-decoration: none;
  padding: 10px 0;
  transition: color 0.15s;
  width: fit-content;
}
.mega-menu-link:hover {
  color: var(--text-1);
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
  color: var(--text-1);
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
  padding: 10px 12px;
  font-family: var(--mono);
  font-size: 13px;
  color: var(--text-2);
  text-decoration: none;
  border-radius: var(--radius);
  transition: background 0.15s, color 0.15s;
}
.accordion-item:hover {
  background: var(--surface-2);
  color: var(--text-1);
}

.accordion-enter-active,
.accordion-leave-active {
  transition: max-height 0.25s ease, opacity 0.2s ease;
  max-height: 300px;
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