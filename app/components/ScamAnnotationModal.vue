<script setup lang="ts">
defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

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
</script>

<template>
    <Teleport to="body">
        <div v-if="open" class="modal-overlay" @click.self="emit('close')">
            <div class="modal-card" role="dialog" aria-modal="true" aria-label="Annotated scam message example">
                <button type="button" class="modal-close" @click="emit('close')" aria-label="Close">×</button>
                <div class="modal-eyebrow">Composite example — not a real message</div>
                <h3 class="modal-title">Annotated: the five-trick scam text</h3>
                <div class="modal-message">
                    <span v-for="(part, i) in annotatedMessage" :key="i">
                        <mark v-if="part.flag" class="flag-mark" :class="`flag-${part.flag}`">{{ part.text }}<sup>{{
                                part.flag }}</sup></mark>
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
                <NuxtLink to="/lookupsearch" class="btn btn--accent modal-cta" @click="emit('close')">
                    Check a number or account now
                </NuxtLink>
            </div>
        </div>
    </Teleport>
</template>

<style scoped>
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
    max-width: 960px;
    max-height: 88vh;
    overflow-y: auto;
    background: var(--surface);
    border: 1px solid var(--border-hi);
    padding: 36px;
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
    font-weight: 700;
    color: white;
}

.btn--accent:hover {
    background: #34882f;
    border-color: #eeefe9;
}
</style>