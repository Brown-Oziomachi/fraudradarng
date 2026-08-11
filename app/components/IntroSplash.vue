<!-- app/components/IntroSplash.vue -->
<script setup lang="ts">
import { useIntroSplash } from '~/composables/useIntroSplash'
const SESSION_KEY = 'frng_splash_seen_v1'

const introActive = useIntroSplash()
const visible = ref(true)

function lockScroll() {
    document.documentElement.style.overflow = 'hidden'
}
function unlockScroll() {
    document.documentElement.style.overflow = ''
}

function proceed() {
    if (!visible.value) return
    visible.value = false
    try {
        sessionStorage.setItem(SESSION_KEY, '1')
    } catch {
    }
}

function onAfterLeave() {
    introActive.value = false
    unlockScroll()
}

onMounted(() => {
    let alreadySeen = false
    try {
        alreadySeen = !!sessionStorage.getItem(SESSION_KEY)
    } catch {
    }

    if (alreadySeen) {
        visible.value = false
        introActive.value = false
        return
    }

    lockScroll()
})

onUnmounted(() => {
    unlockScroll()
})
</script>

<template>
    <Teleport to="body">
        <Transition name="splash-fade" @after-leave="onAfterLeave">
            <div v-if="visible" class="splash-overlay" role="dialog" aria-modal="true"
                aria-label="Fraud Radar NG intro">
                <div class="splash-radar" aria-hidden="true">
                    <span class="splash-ring splash-ring--1" />
                    <span class="splash-ring splash-ring--2" />
                    <span class="splash-ring splash-ring--3" />
                    <span class="splash-sweep" />
                </div>

                <div class="splash-content">
                    <img src="/LOGOOO.png" alt="Fraud Radar NG" class="splash-logo" />

                    <p class="splash-eyebrow"><span class="splash-dot" /> Fraud Radar NG</p>

                    <p class="splash-title">Report. Check. Protect.</p>

                    <button type="button" class="splash-cta" @click="proceed">
                        <svg class="splash-cta-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M12 2L20 5.5V11C20 16.5 16.5 20.7 12 22C7.5 20.7 4 16.5 4 11V5.5L12 2Z"
                                fill="currentColor" />
                        </svg>
                        Proceed
                    </button>

                    <p class="splash-legal">
                        By tapping Proceed you agree to have read our
                        <NuxtLink to="/privacy-notice" class="splash-legal-link" target="_blank">Privacy Policy
                        </NuxtLink>
                        and
                        <NuxtLink to="/terms" class="splash-legal-link" target="_blank">Terms of Service</NuxtLink>.
                    </p>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.splash-overlay {
    position: fixed;
    inset: 0;
    z-index: 999999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: radial-gradient(circle at 50% 42%, #123322 0%, #081b12 45%, #05090a 85%);
}

.splash-radar {
    position: absolute;
    top: 50%;
    left: 50%;
    width: min(90vw, 720px);
    height: min(90vw, 720px);
    transform: translate(-50%, -50%);
    pointer-events: none;
    opacity: 0.3;
}

.splash-ring {
    position: absolute;
    inset: 0;
    border: 1px solid color-mix(in srgb, var(--accent, #4ade80) 40%, transparent);
    border-radius: 50%;
}

.splash-ring--2 {
    inset: 12%;
}

.splash-ring--3 {
    inset: 24%;
}

.splash-sweep {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: conic-gradient(from 0deg,
            color-mix(in srgb, var(--accent, #4ade80) 55%, transparent) 0deg,
            transparent 50deg,
            transparent 360deg);
    animation: splash-spin 3.5s linear infinite;
}

@keyframes splash-spin {
    to {
        transform: rotate(360deg);
    }
}

.splash-content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 24px;
    max-width: 480px;
}

.splash-logo {
    width: min(70vw, 260px);
    height: auto;
    object-fit: contain;
    filter: drop-shadow(0 0 22px color-mix(in srgb, var(--accent, #4ade80) 45%, transparent));
}

.splash-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 14px;
    font-family: var(--mono, monospace);
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.55);
}

.splash-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--accent, #4ade80);
}

.splash-title {
    margin-top: 22px;
    font-family: var(--serif, serif);
    font-size: clamp(18px, 3.4vw, 22px);
    color: #fff;
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.5);
}

.splash-cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: 28px;
    padding: 15px 32px;
    border: none;
    border-radius: 999px;
    background: var(--accent, #4ade80);
    color: #06210f;
    font-family: var(--mono, monospace);
    font-weight: 700;
    font-size: 15px;
    letter-spacing: 0.02em;
    cursor: pointer;
    box-shadow: 0 8px 28px color-mix(in srgb, var(--accent, #4ade80) 45%, transparent);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.splash-cta:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 34px color-mix(in srgb, var(--accent, #4ade80) 60%, transparent);
}

.splash-cta-icon {
    width: 16px;
    height: 16px;
    color: #06210f;
}

.splash-legal {
    margin-top: 16px;
    max-width: 320px;
    font-family: var(--mono, monospace);
    font-size: 11px;
    line-height: 1.6;
    letter-spacing: 0.01em;
    color: rgba(255, 255, 255, 0.45);
}

.splash-legal-link {
    color: rgba(255, 255, 255, 0.75);
    text-decoration: underline;
    text-underline-offset: 2px;
}

.splash-legal-link:hover {
    color: var(--accent, #4ade80);
}

.splash-fade-enter-active {
    transition: opacity 0.3s ease;
}

.splash-fade-leave-active {
    transition: opacity 0.45s ease;
}

.splash-fade-enter-from,
.splash-fade-leave-to {
    opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
    .splash-sweep {
        animation: none !important;
    }
}
</style>