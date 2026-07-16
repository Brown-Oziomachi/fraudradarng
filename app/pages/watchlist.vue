<script setup lang="ts">
useHead({ title: 'Your Watchlist — Fraud Radar NG' })

const { items, statuses, refreshAll, addItem, removeItem, markSeen, checking, loadFromStorage } = useWatchlist()

const newQuery = ref('')
const newLabel = ref('')
const addError = ref('')
const showPrivacyInfo = ref(false)

onMounted(() => {
    loadFromStorage()
    refreshAll()
})

function handleAdd() {
    addError.value = ''
    if (!newQuery.value.trim()) {
        addError.value = 'Enter an account number, phone number, company, or website to watch.'
        return
    }
    const added = addItem(newQuery.value, newLabel.value)
    if (!added) {
        addError.value = 'Already on your watchlist.'
        return
    }
    newQuery.value = ''
    newLabel.value = ''
    refreshAll()
}

function statusFor(id: string) {
    return statuses.value[id] ?? null
}

function hasReports(id: string) {
    const status = statusFor(id)
    return status ? status.matchCount > 0 : false
}

const howItWorks = [
    {
        step: '01',
        title: 'Add what you care about',
        body: "An account number, phone number, company, or website — anything you'd want to know if it ever got reported.",
    },
    {
        step: '02',
        title: 'We check quietly, in the background',
        body: 'Every time you open this page, each saved item is checked against every report on FRNG.',
    },
    {
        step: '03',
        title: "You'll see it the moment it matters",
        body: "If a match ever shows up, it's flagged right here with a link straight to the report.",
    },
]
</script>

<template>
    <div class="watchlist-page">

        <!-- ============ HERO ============ -->
        <div class="watchlist-hero">
            <div class="hero-icon-wrap">
                <svg class="hero-icon-sweep" viewBox="0 0 100 100" aria-hidden="true">
                    <circle cx="50" cy="50" r="46" class="sweep-ring" />
                    <circle cx="50" cy="50" r="46" class="sweep-ring sweep-ring--dashed" />
                </svg>
                <svg class="hero-icon-clock" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6" />
                    <path d="M12 7v5l3.5 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
            </div>

            <p class="eyebrow">Private · Saved only on this device</p>
            <h1 class="page-title">Your Watchlist</h1>
            <p class="page-sub">
                Save an account number, phone number, company, or website you care about.
                We'll quietly keep checking, and tell you the moment anyone reports it.
            </p>

            <button type="button" class="privacy-link" @click="showPrivacyInfo = !showPrivacyInfo">
                {{ showPrivacyInfo ? 'Hide' : 'Who can see this?' }}
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" :class="{ 'flip': showPrivacyInfo }">
                    <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
            </button>

            <Transition name="drop">
                <div v-if="showPrivacyInfo" class="privacy-panel">
                    <p>
                        <strong>Only you, on this exact device and browser.</strong> Your watchlist is stored
                        locally in this browser — not in our database, not tied to any account, and never
                        visible to us, to other users, or to anyone you're watching.
                    </p>
                    <p>
                        Switch devices or browsers and you'll start a fresh, empty watchlist there. Clear your
                        browser data and this one disappears. Nothing here is ever synced or backed up on our
                        servers — the only thing we ever receive is the search term itself, for a split second,
                        purely to check for a match.
                    </p>
                </div>
            </Transition>
        </div>

        <!-- ============ HOW IT WORKS ============ -->
        <div class="how-it-works">
            <div v-for="step in howItWorks" :key="step.step" class="how-card">
                <span class="how-step">{{ step.step }}</span>
                <h3 class="how-title">{{ step.title }}</h3>
                <p class="how-body">{{ step.body }}</p>
            </div>
        </div>

        <!-- ============ ADD FORM ============ -->
        <div class="add-section">
            <h2 class="section-heading">Add something to watch</h2>
            <div class="add-form">
                <input v-model="newQuery" type="text" class="input" placeholder="e.g. 0123456789, or a company name"
                    @keydown.enter="handleAdd" />
                <input v-model="newLabel" type="text" class="input"
                    placeholder="Optional label, e.g. 'Landlord's account'" @keydown.enter="handleAdd" />
                <button type="button" class="add-btn" @click="handleAdd">
                    Add to watchlist
                </button>
            </div>
            <p v-if="addError" class="error-text">{{ addError }}</p>
        </div>

        <!-- ============ LIST ============ -->
        <div class="watchlist-toolbar">
            <span class="muted">{{ items.length }} item{{ items.length === 1 ? '' : 's' }} watched</span>
            <button type="button" class="refresh-btn" :disabled="checking" @click="refreshAll">
                <span :class="{ spin: checking }">↻</span> {{ checking ? 'Checking…' : 'Check now' }}
            </button>
        </div>

        <div v-if="!items.length" class="empty-state">
            <p class="empty-title">Nothing here yet</p>
            <p class="empty-text">Add an account, phone number, or company above — this is where you'll see it if it's
                ever reported.</p>
        </div>

        <div v-for="item in items" :key="item.id" class="watchlist-card">
            <div class="watchlist-card-main">
                <span class="watchlist-card-label">{{ item.label }}</span>
                <span v-if="item.label !== item.query" class="watchlist-card-query">{{ item.query }}</span>
            </div>

            <div class="watchlist-card-status">
                <template v-if="statusFor(item.id)">
                    <span v-if="statusFor(item.id)?.matchCount === 0" class="status-pill status-pill--clean">
                        No reports found
                    </span>
                    <span v-else class="status-pill"
                        :class="statusFor(item.id)?.highestRisk === 'flagged' ? 'status-pill--danger' : 'status-pill--warn'">
                        {{ statusFor(item.id)?.matchCount }} report{{ statusFor(item.id)?.matchCount === 1 ? '' : 's' }}
                        found
                    </span>
                    <span v-if="(statusFor(item.id)?.newCount ?? 0) > 0" class="new-badge">
                        {{ statusFor(item.id)?.newCount }} new
                    </span>
                </template>
                <span v-else class="status-pill status-pill--checking">
                    Checking…
                </span>
            </div>

            <div v-if="hasReports(item.id)" class="watchlist-card-links">
                <NuxtLink v-for="rid in statusFor(item.id)?.reportIds?.slice(0, 3) ?? []" :key="rid"
                    :to="`/reports/${rid}`" class="watchlist-report-link" @click="markSeen(item.id)">
                    View report →
                </NuxtLink>
            </div>

            <button type="button" class="remove-btn" @click="removeItem(item.id)">Remove</button>
        </div>
    </div>
</template>

<style scoped>
.watchlist-page {
    max-width: 720px;
    margin: 0 auto;
    padding: 56px 24px 90px;
}

/* ============ HERO ============ */
.watchlist-hero {
    text-align: center;
    margin-bottom: 40px;
}

.hero-icon-wrap {
    position: relative;
    width: 68px;
    height: 68px;
    margin: 0 auto 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.hero-icon-sweep {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    color: var(--accent);
}

.sweep-ring {
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    opacity: 0.15;
}

.sweep-ring--dashed {
    stroke-dasharray: 8 14;
    opacity: 0.55;
    animation: rotate-sweep 6s linear infinite;
    transform-origin: 50px 50px;
}

@keyframes rotate-sweep {
    to {
        transform: rotate(360deg);
    }
}

@media (prefers-reduced-motion: reduce) {
    .sweep-ring--dashed {
        animation: none;
    }
}

.hero-icon-clock {
    position: relative;
    width: 26px;
    height: 26px;
    color: var(--text-1);
    background: var(--surface);
    border-radius: 50%;
    padding: 6px;
    border: 1px solid var(--border);
}

.eyebrow {
    font-family: var(--mono);
    font-size: 10.5px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-3);
    margin-bottom: 12px;
}

.page-title {
    font-family: var(--serif);
    font-size: clamp(88px, 4vw, 36px);
    color: var(--text-1);
    margin-bottom: 12px;
}

.page-sub {
    font-size: 14px;
    color: var(--text-2);
    line-height: 1.7;
    font-weight: 300;
    max-width: 460px;
    margin: 0 auto 16px;
}

.privacy-link {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: none;
    border: none;
    font-family: var(--mono);
    font-size: 11.5px;
    color: var(--accent);
    text-decoration: underline;
    cursor: pointer;
    padding: 0;
}

.privacy-link svg {
    transition: transform 0.2s ease;
}

.privacy-link svg.flip {
    transform: rotate(180deg);
}

.privacy-panel {
    max-width: 900px;
    margin: 16px auto 0;
    text-align: left;
    background: var(--surface);
    border: 1px solid var(--border);
    border-left: 3px solid var(--accent);
    border-radius: 8px;
    padding: 16px 18px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.privacy-panel p {
    font-size: 22.5px;
    color: var(--text-2);
    line-height: 1.65;
    font-weight: 300;
}

.privacy-panel strong {
    color: var(--text-1);
    font-weight: 600;
}

.drop-enter-active,
.drop-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.drop-enter-from,
.drop-leave-to {
    opacity: 0;
    transform: translateY(-6px);
}

/* ============ HOW IT WORKS ============ */
.how-it-works {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
    margin-bottom: 40px;
}

@media (max-width: 640px) {
    .how-it-works {
        grid-template-columns: 1fr;
    }
}

.how-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 18px;
}

.how-step {
    display: block;
    font-family: var(--mono);
    font-size: 10px;
    color: var(--accent);
    letter-spacing: 0.08em;
    margin-bottom: 10px;
}

.how-title {
    font-family: var(--serif);
    font-size: 14.5px;
    color: var(--text-1);
    margin-bottom: 6px;
    line-height: 1.35;
}

.how-body {
    font-size: 12px;
    color: var(--text-3);
    line-height: 1.6;
    font-weight: 300;
}

/* ============ ADD SECTION ============ */
.add-section {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 22px;
    margin-bottom: 32px;
}

.section-heading {
    font-family: var(--serif);
    font-size: 16px;
    color: var(--text-1);
    margin-bottom: 14px;
}

.add-form {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.input {
    flex: 1;
    min-width: 160px;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 11px 14px;
    color: var(--text-1);
    font-size: 13.5px;
}

.add-btn {
    background: var(--accent);
    color: #0a0a0b;
    font-weight: 600;
    font-family: var(--mono);
    font-size: 12px;
    border: none;
    border-radius: var(--radius);
    padding: 11px 18px;
    cursor: pointer;
    white-space: nowrap;
}

.add-btn:hover {
    background: #d4eb3c;
}

.error-text {
    font-family: var(--mono);
    font-size: 11.5px;
    color: #f87171;
    margin-top: 10px;
}

/* ============ LIST ============ */
.watchlist-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
}

.muted {
    font-family: var(--mono);
    font-size: 11.5px;
    color: var(--text-3);
}

.refresh-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 7px 14px;
    font-family: var(--mono);
    font-size: 11.5px;
    color: var(--text-2);
    cursor: pointer;
}

.refresh-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.spin {
    display: inline-block;
    animation: spin 0.9s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.empty-state {
    text-align: center;
    padding: 40px 20px;
    border: 1px dashed var(--border-hi);
    border-radius: 12px;
}

.empty-title {
    font-family: var(--serif);
    font-size: 16px;
    color: var(--text-1);
    margin-bottom: 6px;
}

.empty-text {
    font-size: 12.5px;
    color: var(--text-3);
    font-weight: 300;
    max-width: 320px;
    margin: 0 auto;
}

.watchlist-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 16px 18px;
    margin-bottom: 12px;
    position: relative;
}

.watchlist-card-main {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-bottom: 10px;
}

.watchlist-card-label {
    font-family: var(--serif);
    font-size: 15px;
    color: var(--text-1);
}

.watchlist-card-query {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--text-3);
}

.watchlist-card-status {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    flex-wrap: wrap;
}

.status-pill {
    font-family: var(--mono);
    font-size: 10.5px;
    font-weight: 600;
    padding: 3px 9px;
    border-radius: 999px;
}

.status-pill--clean {
    background: rgba(74, 222, 128, 0.08);
    color: #4ade80;
    border: 1px solid rgba(74, 222, 128, 0.2);
}

.status-pill--warn {
    background: rgba(234, 179, 8, 0.08);
    color: #eab308;
    border: 1px solid rgba(234, 179, 8, 0.25);
}

.status-pill--danger {
    background: rgba(248, 113, 113, 0.08);
    color: #f87171;
    border: 1px solid rgba(248, 113, 113, 0.25);
}

.status-pill--checking {
    background: rgba(148, 163, 184, 0.08);
    color: var(--text-3);
    border: 1px solid var(--border);
}

.new-badge {
    background: #f87171;
    color: #fff;
    font-family: var(--mono);
    font-size: 9.5px;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: 999px;
}

.watchlist-card-links {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 8px;
}

.watchlist-report-link {
    font-family: var(--mono);
    font-size: 11.5px;
    color: var(--accent);
    text-decoration: none;
}

.watchlist-report-link:hover {
    text-decoration: underline;
}

.remove-btn {
    position: absolute;
    top: 14px;
    right: 14px;
    background: none;
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 5px 10px;
    font-family: var(--mono);
    font-size: 10.5px;
    color: var(--text-3);
    cursor: pointer;
}

.remove-btn:hover {
    color: #f87171;
    border-color: rgba(248, 113, 113, 0.3);
}
</style>