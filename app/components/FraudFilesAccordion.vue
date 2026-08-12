<script setup lang="ts">
import { reactive } from 'vue'

const fraudFiles = reactive([
    {
        key: 'technology', title: 'Technology', tagline: 'Where the fraud usually starts first',
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
        key: 'politics', title: 'Politics', tagline: 'Where trust in institutions is the target',
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
        key: 'life', title: 'Everyday life', tagline: 'Where patience is the weapon',
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
        key: 'devices', title: 'Devices', tagline: 'Where the smallest habits matter most',
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
</script>

<template>
    <section class="fraud-files-section">
        <div class="eyebrow eyebrow--dark">
            <span class="eyebrow-dot" />
            The fraud files
        </div>
        <h2 class="fraud-files-title">Exposed: how it plays out across technology, politics, everyday life and your
            devices.</h2>
        <p class="fraud-files-subtitle">
            Tap a category to open it, then tap a lesson to reveal it. Nothing here is theoretical —
            every pattern below has already shown up in reports filed on this platform.
        </p>

        <div class="fraud-files-grid">
            <div v-for="cat in fraudFiles" :key="cat.key" class="fraud-category" :class="{ 'is-open': cat.open }">
                <button type="button" class="fraud-category-head" @click="toggleCategory(cat.key)">
                    <span class="fraud-category-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
                            stroke-linecap="round" stroke-linejoin="round" v-html="cat.iconHtml" />
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
    padding-left: 90px;
    margin-top: 15px;
}

.eyebrow-dot {
    width: 5px;
    height: 5px;
    background: var(--accent);
    border-radius: 50%;
}

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
</style>