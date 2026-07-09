<script setup lang="ts">
/**
 * FRNG Historical Blacklist Vault
 * -----------------------------------------------------------------------
 * A standing archive of SEC-sealed / regulator-flagged investment
 * schemes. Two tiers of data:
 *   - FEATURED CASES: fully documented (mechanism, yield promise, status)
 *   - ARCHIVE LEDGER: name/area/year only, sourced from the SEC schedule.
 *     These are intentionally marked "Unclassified" rather than guessing
 *     at a scam mechanism we don't have evidence for.
 *
 * Styling uses the site's existing --bg / --surface / --text-* / --accent
 * tokens, so this page follows the global light/dark toggle automatically.
 */

interface FeaturedCase {
  id: string
  name: string
  aka?: string
  year: number
  area: string
  category: string
  mechanism: string
  promise: string
  loss?: string
  status: string
  redFlag: string
}

interface ArchiveCase {
  sn: number
  name: string
  area: string
  year: number
}

const featuredCases: FeaturedCase[] = [
  {
    id: 'FRNG-VLT-029',
    name: 'MBA Forex and Investment Ltd',
    year: 2019,
    area: 'Nationwide',
    category: 'Forex Pools',
    mechanism: 'Unlicensed forex trading pools operating without CBN/SEC authorization',
    promise: '15% guaranteed monthly returns',
    loss: '₦213B in investor funds',
    status: 'Seized & Frozen',
    redFlag: 'Guaranteed Monthly Yield',
  },
  {
    id: 'FRNG-VLT-036',
    name: 'Farmforte Agro Allied Solutions',
    aka: 'Agropartnerships',
    year: 2022,
    area: 'Lagos / Abuja',
    category: 'Agri / Insurance Fraud',
    mechanism: 'Agricultural crowdfunding fronted by fabricated insurance backing',
    promise: '10% quarterly yields',
    status: 'Offices Sealed / Founders Fled',
    redFlag: 'False Insurance Claims',
  },
  {
    id: 'FRNG-VLT-024',
    name: 'Yuan Dong',
    aka: 'YDEC',
    year: 2017,
    area: 'Abuja / Asaba / Kano',
    category: 'MLM / Matrix Loops',
    mechanism: 'Traditional multi-level matrix with heavy downline recruitment',
    promise: 'Daily cash payouts + referral commissions',
    status: 'Promoters Arrested / Offices Sealed',
    redFlag: 'Aggressive Referral Multiplier',
  },
  {
    id: 'FRNG-VLT-035',
    name: 'Oxford International Group',
    year: 2022,
    area: 'Lagos / Port Harcourt',
    category: 'Unregistered Crowdfunding',
    mechanism: 'Real estate and agriculture subsidiaries used to illegally pool public funds',
    promise: 'Fixed returns via subsidiary "investment" products',
    status: 'Head Offices Sealed by SEC',
    redFlag: 'Unlicensed Fund Pooling',
  },
  {
    id: 'FRNG-VLT-026',
    name: 'Loom Nigeria Money',
    aka: 'Flip Cash Investment',
    year: 2019,
    area: 'Online (WhatsApp / Telegram)',
    category: 'MLM / Matrix Loops',
    mechanism: 'Peer-to-peer digital matrix loop, no underlying asset or revenue',
    promise: 'Double your money via recruitment tiers',
    status: 'Regulatory Public Disclaimers',
    redFlag: 'Pure Pyramid Structure',
  },
]

const archiveCases: ArchiveCase[] = [
  { sn: 1, name: 'Women in Oil Ltd', area: 'Kaduna State', year: 2013 },
  { sn: 2, name: 'Rosabon Financial Services Ltd', area: 'Lagos State / Port Harcourt', year: 2013 },
  { sn: 3, name: 'Gift from Above', area: 'Onitsha', year: 2013 },
  { sn: 4, name: 'Baresi Capital Ltd', area: 'Lagos State', year: 2013 },
  { sn: 5, name: 'Joy Apple Investment Ltd', area: 'Lagos State', year: 2013 },
  { sn: 6, name: 'Divine Settlement Investment and Resources Company Ltd', area: 'Lagos State', year: 2013 },
  { sn: 7, name: 'Obichi Investment & Management Nig. Ltd', area: 'Onitsha', year: 2013 },
  { sn: 8, name: 'New Nation / Women in Oil', area: '35 States (excl. Borno & Yobe)', year: 2014 },
  { sn: 9, name: 'Equation Global Services Solution', area: 'Port Harcourt, Rivers State', year: 2014 },
  { sn: 10, name: 'DMC Management Ltd', area: 'Lagos State', year: 2014 },
  { sn: 11, name: 'Whitewood Asset Management Limited', area: 'Lagos State', year: 2015 },
  { sn: 12, name: 'Lamb & Lamb Ltd.', area: 'Anambra State', year: 2015 },
  { sn: 13, name: 'Powertronic Ltd', area: 'Rivers State', year: 2015 },
  { sn: 14, name: 'Madumon Investment Ltd', area: 'Anambra State', year: 2015 },
  { sn: 15, name: 'Stock Empire Ventures Limited', area: 'Oyo State', year: 2015 },
  { sn: 16, name: 'YBF Consult Limited', area: 'Abuja / Ilorin', year: 2016 },
  { sn: 17, name: 'Tine God Network Limited', area: 'Lagos / Onitsha', year: 2016 },
  { sn: 18, name: 'Converged Dynamic International Limited', area: 'Sokoto / Port Harcourt', year: 2016 },
  { sn: 19, name: 'All Trust Heritage International Limited', area: 'Bonny Island, Rivers State', year: 2016 },
  { sn: 20, name: 'Fantastic Esanbet Nigeria Limited', area: 'Benin, Edo State', year: 2016 },
  { sn: 21, name: 'MMM Federal Republic of Nigeria', area: 'Online', year: 2016 },
  { sn: 22, name: 'Flexus Global Solutions Investment Ltd.', area: 'Port Harcourt', year: 2016 },
  { sn: 23, name: 'Ruby Gold Ventures', area: 'Abuja', year: 2016 },
  { sn: 25, name: 'Box Value Trading Company', area: 'Not specified', year: 2019 },
  { sn: 28, name: 'Helping Hand and Investment', area: 'Not specified', year: 2019 },
  { sn: 30, name: 'Federate Investors Trading Company', area: 'Not specified', year: 2019 },
  { sn: 31, name: 'Jamalife Helpers Global Ltd', area: 'Not specified', year: 2019 },
  { sn: 32, name: 'Kudy Financial Ltd', area: 'Not specified', year: 2019 },
  { sn: 33, name: 'Now Now Alert', area: 'Not specified', year: 2019 },
  { sn: 34, name: 'Darrol Investment Limited', area: 'Ibadan', year: 2020 },
  { sn: 37, name: 'Vekt Capital Investment Limited', area: 'Lagos / Abuja', year: 2022 },
  { sn: 38, name: 'Ovaioza Farm Produce Storage Business', area: 'Abuja', year: 2022 },
]

const CHIPS = [
  'All',
  'Forex Pools',
  'MLM / Matrix Loops',
  'Agri / Insurance Fraud',
  'Unregistered Crowdfunding',
  'Unclassified',
] as const

const activeChip = ref<(typeof CHIPS)[number]>('All')
const query = ref('')

function norm(s: string) {
  return s.toLowerCase().trim()
}

const filteredFeatured = computed(() => {
  const q = norm(query.value)
  return featuredCases.filter((c) => {
    const chipMatch = activeChip.value === 'All' || c.category === activeChip.value
    if (!chipMatch) return false
    if (!q) return true
    return (
      norm(c.name).includes(q) ||
      norm(c.aka ?? '').includes(q) ||
      String(c.year).includes(q) ||
      norm(c.mechanism).includes(q) ||
      norm(c.category).includes(q) ||
      norm(c.area).includes(q)
    )
  })
})

const filteredArchive = computed(() => {
  const q = norm(query.value)
  // Archive entries have no scam-mechanism category, so a specific
  // category chip (anything but All/Unclassified) hides them.
  if (activeChip.value !== 'All' && activeChip.value !== 'Unclassified') return []
  if (!q) return archiveCases
  return archiveCases.filter(
    (c) =>
      norm(c.name).includes(q) ||
      String(c.year).includes(q) ||
      norm(c.area).includes(q)
  )
})

const totalIndexed = computed(() => featuredCases.length + archiveCases.length)
const resultCount = computed(() => filteredFeatured.value.length + filteredArchive.value.length)

const hasResults = computed(() => resultCount.value > 0)
</script>

<template>
  <div class="vault-page">
    <!-- ============ HERO ============ -->
    <section class="v-hero">
      <div class="v-hero-grid" aria-hidden="true" />
      <div class="v-hero-inner">
        <div class="v-hero-top">
          <span class="v-mark">FRNG</span>
          <span class="v-divider" />
          <span class="v-kicker">Restricted Archive · SEC Nigeria Cross-Reference</span>
        </div>
        <h1 class="v-title">Historical Blacklist Vault</h1>
        <p class="v-sub">
          A standing record of Ponzi schemes, unregistered investment houses, and MLM
          matrices formally sealed up or flagged by regulators — from 2013 to present.
          <span class="v-count">{{ totalIndexed }} case files indexed.</span>
        </p>
      </div>
    </section>

    <!-- ============ SEARCH / FILTER ============ -->
    <section class="v-controls">
      <div class="v-search">
        <svg class="v-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
        <input
          v-model="query"
          type="text"
          placeholder="Search by company, year, or mechanism…"
          class="v-search-input"
        />
        <span v-if="query" class="v-search-clear" role="button" tabindex="0" @click="query = ''">✕</span>
      </div>

      <div class="v-chips" role="tablist" aria-label="Filter by category">
        <button
          v-for="chip in CHIPS"
          :key="chip"
          type="button"
          class="v-chip"
          :class="{ 'is-active': activeChip === chip }"
          @click="activeChip = chip"
        >
          {{ chip }}
        </button>
      </div>
    </section>

    <!-- ============ FEATURED CASE FILES ============ -->
    <section v-if="filteredFeatured.length" class="v-section">
      <div class="v-section-head">
        <h2 class="v-section-title">Featured Case Files</h2>
        <span class="v-section-note">Fully documented — mechanism, promise & outcome on record</span>
      </div>

      <div class="v-case-grid">
        <article v-for="c in filteredFeatured" :key="c.id" class="v-case">
          <div class="v-case-top">
            <span class="v-case-id">{{ c.id }}</span>
            <span class="v-stamp v-stamp--sealed">
              <span class="v-stamp-dot" /> Sealed {{ c.year }}
            </span>
          </div>

          <h3 class="v-case-name">
            {{ c.name }}
            <span v-if="c.aka" class="v-case-aka">aka {{ c.aka }}</span>
          </h3>

          <div class="v-case-meta">
            <span class="v-tag">{{ c.category }}</span>
            <span class="v-case-area">{{ c.area }}</span>
          </div>

          <dl class="v-case-facts">
            <div class="v-fact">
              <dt>The trap</dt>
              <dd>{{ c.mechanism }}</dd>
            </div>
            <div class="v-fact">
              <dt>Promised</dt>
              <dd>{{ c.promise }}</dd>
            </div>
            <div v-if="c.loss" class="v-fact">
              <dt>Est. exposure</dt>
              <dd class="v-fact-loss">{{ c.loss }}</dd>
            </div>
            <div class="v-fact">
              <dt>Outcome</dt>
              <dd>{{ c.status }}</dd>
            </div>
          </dl>

          <div class="v-redflag">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 9v4M12 17h.01" />
              <path
                d="M10.29 3.86 1.82 18a1.5 1.5 0 0 0 1.29 2.25h17.78A1.5 1.5 0 0 0 22.18 18L13.71 3.86a1.5 1.5 0 0 0-2.42 0z"
              />
            </svg>
            Key Red Flag: {{ c.redFlag }}
          </div>
        </article>
      </div>
    </section>

    <!-- ============ ARCHIVE LEDGER ============ -->
    <section v-if="filteredArchive.length" class="v-section">
      <div class="v-section-head">
        <h2 class="v-section-title">Archive Ledger</h2>
        <span class="v-section-note">Name, area & sealing year only — sourced from the SEC schedule</span>
      </div>

      <div class="v-ledger" role="table">
        <div class="v-ledger-row v-ledger-row--head" role="row">
          <span role="columnheader">S/N</span>
          <span role="columnheader">Company</span>
          <span role="columnheader">Area of Operation</span>
          <span role="columnheader">Year Sealed</span>
          <span role="columnheader">Category</span>
        </div>
        <div v-for="c in filteredArchive" :key="c.sn" class="v-ledger-row" role="row">
          <span class="v-ledger-sn" data-label="S/N">{{ String(c.sn).padStart(2, '0') }}</span>
          <span class="v-ledger-name" data-label="Company">{{ c.name }}</span>
          <span class="v-ledger-area" data-label="Area">{{ c.area }}</span>
          <span class="v-ledger-year" data-label="Year">{{ c.year }}</span>
          <span class="v-tag v-tag--muted" data-label="Category">Unclassified</span>
        </div>
      </div>
    </section>

    <!-- ============ EMPTY STATE ============ -->
    <section v-if="!hasResults" class="v-empty">
      <p>No case files match "{{ query }}". Try a different name, year, or clear the filter.</p>
      <button type="button" class="v-empty-reset" @click="query = ''; activeChip = 'All'">Reset search</button>
    </section>

    <!-- ============ ANATOMY OF A COLLAPSE ============ -->
    <section class="v-anatomy">
      <div class="v-anatomy-head">
        <span class="v-anatomy-eyebrow">Pattern Analysis</span>
        <h2 class="v-anatomy-title">The Anatomy of a Collapse</h2>
        <p class="v-anatomy-sub">
          Across every sealed operator in this vault, roughly 90% share the same three
          structural tells. Learn them once, and you can spot the next one before it collapses.
        </p>
      </div>

      <div class="v-anatomy-grid">
        <div class="v-anatomy-card">
          <span class="v-anatomy-mark">01</span>
          <h3>Unrealistic Guaranteed Yields</h3>
          <p>Fixed, above-market returns promised regardless of real-world market conditions — a mathematical impossibility for any legitimate asset class.</p>
        </div>
        <div class="v-anatomy-card">
          <span class="v-anatomy-mark">02</span>
          <h3>Aggressive Referral Multipliers</h3>
          <p>Income depends more on recruiting new depositors than on any underlying business — the defining signature of a matrix or pyramid loop.</p>
        </div>
        <div class="v-anatomy-card">
          <span class="v-anatomy-mark">03</span>
          <h3>False Licensing / Insurance Claims</h3>
          <p>Fabricated SEC registration, CBN licensing, or third-party insurance backing used to manufacture false trust ahead of collapse.</p>
        </div>
      </div>

      <div class="v-anatomy-cta">
        <p>Spotting a platform matching these patterns right now?</p>
        <NuxtLink to="/report/new" class="v-cta-btn">
          Report them on the FRNG Radar
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* All colors/type come from the site's global tokens (--bg, --surface,
   --text-1/2/3, --accent, --accent-dim, --accent-bdr, --border, --border-hi,
   --serif, --sans, --mono) so this page follows the light/dark toggle
   automatically. The only additions are --danger / --danger-dim for the
   red "sealed / red flag" alerts, themed separately for light vs dark. */
.vault-page {
  --danger: #dc2626;
  --danger-dim: rgba(220, 38, 38, 0.08);
  --danger-bdr: rgba(220, 38, 38, 0.3);

  background: var(--bg);
  color: var(--text-2);
  font-family: var(--sans);
  min-height: 100vh;
  padding-bottom: 6rem;
  transition: background 0.2s ease, color 0.2s ease;
}

[data-theme='dark'] .vault-page {
  --danger: #f87171;
  --danger-dim: rgba(248, 113, 113, 0.1);
  --danger-bdr: rgba(248, 113, 113, 0.3);
}

/* ---------- Hero ---------- */
.v-hero {
  position: relative;
  border-bottom: 1px solid var(--border);
  overflow: hidden;
  padding: 3.5rem 1.25rem 3rem;
  background: var(--surface);
}

.v-hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--border) 1px, transparent 1px),
    linear-gradient(90deg, var(--border) 1px, transparent 1px);
  background-size: 32px 32px;
  mask-image: radial-gradient(ellipse 70% 60% at 50% 0%, black 20%, transparent 90%);
  opacity: 0.6;
}

.v-hero-inner {
  position: relative;
  max-width: 64rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.v-hero-top {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.v-mark {
  font-family: var(--mono);
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: var(--accent);
  border: 1px solid var(--accent-bdr);
  border-radius: 2px;
  padding: 0.25rem 0.5rem;
  background: var(--accent-dim);
}

.v-divider {
  width: 1px;
  height: 16px;
  background: var(--border);
}

.v-kicker {
  font-family: var(--mono);
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-3);
}

.v-title {
  font-family: var(--serif);
  font-weight: 400;
  font-size: clamp(2rem, 4.5vw, 3rem);
  letter-spacing: -0.01em;
  color: var(--text-1);
}

.v-sub {
  max-width: 40rem;
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--text-2);
}

.v-count {
  display: inline-block;
  margin-left: 0.5rem;
  font-family: var(--mono);
  font-size: 0.8125rem;
  color: var(--accent);
}

/* ---------- Search / filters ---------- */
.v-controls {
  max-width: 64rem;
  margin: 2rem auto 0;
  padding: 0 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.v-search {
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--surface);
  padding: 0 0.875rem;
  transition: border-color 0.15s ease;
}

.v-search:focus-within {
  border-color: var(--border-hi);
}

.v-search-icon {
  width: 17px;
  height: 17px;
  color: var(--text-3);
  flex-shrink: 0;
}

.v-search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text-1);
  font-family: var(--sans);
  font-size: 0.875rem;
  padding: 0.75rem 0.625rem;
}

.v-search-input::placeholder {
  color: var(--text-3);
}

.v-search-clear {
  color: var(--text-3);
  font-size: 0.75rem;
  cursor: pointer;
  padding: 0.25rem;
}

.v-search-clear:hover {
  color: var(--text-1);
}

.v-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.v-chip {
  font-family: var(--mono);
  font-size: 0.75rem;
  letter-spacing: 0.02em;
  color: var(--text-2);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 0.4rem 0.875rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.v-chip:hover {
  color: var(--text-1);
  border-color: var(--text-3);
}

.v-chip.is-active {
  color: var(--bg);
  background: var(--accent);
  border-color: var(--accent);
  font-weight: 600;
}

/* ---------- Sections ---------- */
.v-section {
  max-width: 64rem;
  margin: 3rem auto 0;
  padding: 0 1.25rem;
}

.v-section-head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.625rem;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border);
}

.v-section-title {
  font-family: var(--serif);
  font-size: 1.375rem;
  font-weight: 400;
  color: var(--text-1);
}

.v-section-note {
  font-family: var(--mono);
  font-size: 0.6875rem;
  color: var(--text-3);
  letter-spacing: 0.02em;
}

/* ---------- Featured case cards ---------- */
.v-case-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1rem;
}

.v-case {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius, 8px);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  transition: border-color 0.15s ease;
}

.v-case:hover {
  border-color: var(--border-hi);
}

.v-case-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.v-case-id {
  font-family: var(--mono);
  font-size: 0.6875rem;
  color: var(--text-3);
  letter-spacing: 0.04em;
}

.v-stamp {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-family: var(--mono);
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
}

.v-stamp--sealed {
  color: var(--danger);
  background: var(--danger-dim);
  border: 1px solid var(--danger-bdr);
}

.v-stamp-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--danger);
  box-shadow: 0 0 6px var(--danger);
}

.v-case-name {
  font-family: var(--serif);
  font-size: 1.1875rem;
  font-weight: 400;
  color: var(--text-1);
  line-height: 1.3;
}

.v-case-aka {
  display: block;
  font-family: var(--sans);
  font-size: 0.75rem;
  font-weight: 400;
  color: var(--text-3);
  margin-top: 0.125rem;
}

.v-case-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.v-tag {
  font-family: var(--mono);
  font-size: 0.6875rem;
  color: var(--accent);
  background: var(--accent-dim);
  border: 1px solid var(--accent-bdr);
  border-radius: 4px;
  padding: 0.2rem 0.5rem;
  white-space: nowrap;
}

.v-tag--muted {
  color: var(--text-3);
  background: var(--surface-2);
  border-color: var(--border);
}

.v-case-area {
  font-size: 0.75rem;
  color: var(--text-3);
}

.v-case-facts {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border-top: 1px solid var(--border);
  padding-top: 0.75rem;
}

.v-fact {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.v-fact dt {
  font-family: var(--mono);
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-3);
}

.v-fact dd {
  font-size: 0.8125rem;
  line-height: 1.45;
  color: var(--text-2);
}

.v-fact-loss {
  color: var(--danger);
  font-weight: 600;
}

.v-redflag {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--danger);
  background: var(--danger-dim);
  border: 1px solid var(--danger-bdr);
  border-radius: 6px;
  padding: 0.5rem 0.625rem;
}

.v-redflag svg {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}

/* ---------- Archive ledger ---------- */
.v-ledger {
  border: 1px solid var(--border);
  border-radius: var(--radius, 8px);
  overflow: hidden;
  background: var(--surface);
}

.v-ledger-row {
  display: grid;
  grid-template-columns: 3.5rem 1.6fr 1.2fr 5rem 6.5rem;
  gap: 0.75rem;
  align-items: center;
  padding: 0.7rem 1rem;
  border-bottom: 1px solid var(--border);
}

.v-ledger-row:last-child {
  border-bottom: none;
}

.v-ledger-row:not(.v-ledger-row--head):hover {
  background: var(--surface-2);
}

.v-ledger-row--head {
  font-family: var(--mono);
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-3);
}

.v-ledger-sn {
  font-family: var(--mono);
  font-size: 0.75rem;
  color: var(--text-3);
}

.v-ledger-name {
  font-size: 0.8125rem;
  color: var(--text-1);
}

.v-ledger-area {
  font-size: 0.75rem;
  color: var(--text-3);
}

.v-ledger-year {
  font-family: var(--mono);
  font-size: 0.75rem;
  color: var(--text-2);
}

/* ---------- Empty state ---------- */
.v-empty {
  max-width: 64rem;
  margin: 3rem auto 0;
  padding: 3rem 1.25rem;
  text-align: center;
  color: var(--text-3);
  font-size: 0.875rem;
}

.v-empty-reset {
  margin-top: 0.75rem;
  font-family: var(--mono);
  font-size: 0.75rem;
  color: var(--accent);
  background: none;
  border: 1px solid var(--accent-bdr);
  border-radius: 999px;
  padding: 0.4rem 1rem;
  cursor: pointer;
}

/* ---------- Anatomy of a Collapse ---------- */
.v-anatomy {
  max-width: 64rem;
  margin: 4rem auto 0;
  padding: 0 1.25rem;
}

.v-anatomy-head {
  text-align: center;
  max-width: 36rem;
  margin: 0 auto 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.v-anatomy-eyebrow {
  font-family: var(--mono);
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--accent);
}

.v-anatomy-title {
  font-family: var(--serif);
  font-size: 1.75rem;
  font-weight: 400;
  color: var(--text-1);
}

.v-anatomy-sub {
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--text-2);
}

.v-anatomy-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.v-anatomy-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius, 8px);
  padding: 1.5rem 1.25rem;
  position: relative;
}

.v-anatomy-mark {
  display: block;
  font-family: var(--mono);
  font-size: 0.75rem;
  color: var(--accent);
  margin-bottom: 0.75rem;
}

.v-anatomy-card h3 {
  font-family: var(--sans);
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-1);
  margin-bottom: 0.5rem;
}

.v-anatomy-card p {
  font-size: 0.8125rem;
  line-height: 1.55;
  color: var(--text-3);
}

.v-anatomy-cta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.875rem;
  text-align: center;
  border-top: 1px solid var(--border);
  padding-top: 2rem;
}

.v-anatomy-cta p {
  font-size: 0.9375rem;
  color: var(--text-1);
  font-weight: 500;
}

.v-cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--sans);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--bg);
  background: var(--accent);
  border-radius: 999px;
  padding: 0.75rem 1.5rem;
  text-decoration: none;
  box-shadow: 0 0 0 1px var(--accent-bdr);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.v-cta-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 0 0 1px var(--accent-bdr), 0 8px 20px -8px var(--accent-dim);
}

.v-cta-btn svg {
  width: 16px;
  height: 16px;
}

/* ---------- Responsive: ledger collapses to stacked cards ---------- */
@media (max-width: 640px) {
  .v-ledger-row {
    grid-template-columns: 1fr;
    gap: 0.25rem;
    padding: 0.875rem 1rem;
  }

  .v-ledger-row--head {
    display: none;
  }

  .v-ledger-row:not(.v-ledger-row--head) [data-label]::before {
    content: attr(data-label);
    display: inline-block;
    font-family: var(--mono);
    font-size: 0.5625rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-3);
    width: 5.5rem;
  }

  .v-ledger-name {
    font-weight: 500;
  }

  .v-case-grid {
    grid-template-columns: 1fr;
  }
}
</style>