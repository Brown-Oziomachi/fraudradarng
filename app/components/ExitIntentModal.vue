<script setup lang="ts">
defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()
</script>

<template>
    <Teleport to="body">
        <div v-if="open" class="modal-overlay" @click.self="emit('close')">
            <div class="modal-card modal-card--small" role="dialog" aria-modal="true" aria-label="Before you go">
                <button type="button" class="modal-close" @click="emit('close')" aria-label="Close">×</button>
                <div class="modal-eyebrow">Before you send that transfer</div>
                <h3 class="modal-title">Three questions, ten seconds.</h3>
                <ul class="exit-checklist">
                    <li>Were you pressured to act fast?</li>
                    <li>Were you told to keep it secret?</li>
                    <li>Have you checked this account on the registry?</li>
                </ul>
                <div class="modal-actions">
                    <NuxtLink to="/lookupsearch" class="btn btn--accent" @click="emit('close')">Check the registry
                    </NuxtLink>
                    <button type="button" class="btn btn--outline-dark" @click="emit('close')">I'll check first</button>
                </div>
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

.modal-card--small {
    max-width: 440px;
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

.exit-checklist {
    list-style: none;
    padding: 0;
    margin: 0 0 26px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.exit-checklist li {
    font-size: 14px;
    color: var(--text-2);
    padding-left: 22px;
    position: relative;
}

.exit-checklist li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 7px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent);
}

.modal-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.modal-actions .btn {
    flex: 1;
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

.btn--outline-dark {
    background: transparent;
    border: 1px solid var(--border-hi);
    color: var(--text-2);
}
</style>