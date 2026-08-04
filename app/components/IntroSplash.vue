<!-- app/components/IntroSplash.vue -->
<script setup lang="ts">
import { useIntroSplash } from '~/composables/useIntroSplash'
import type { ComponentPublicInstance } from 'vue'
const SESSION_KEY = 'frng_splash_seen_v1'
const AUTO_DISMISS_MS = 4200

const introActive = useIntroSplash()
const visible = ref(true)
const imageLoaded = ref(false)
const imageFailed = ref(false)

let dismissTimer: ReturnType<typeof setTimeout> | null = null
let safetyTimer: ReturnType<typeof setTimeout> | null = null

function lockScroll() {
    document.documentElement.style.overflow = 'hidden'
}
function unlockScroll() {
    document.documentElement.style.overflow = ''
}

function dismiss() {
    if (!visible.value) return
    visible.value = false
    if (dismissTimer) clearTimeout(dismissTimer)
    try {
        sessionStorage.setItem(SESSION_KEY, '1')
    } catch {
    }
}

function onAfterLeave() {
    introActive.value = false
    unlockScroll()
}

function handleKeydown(e: KeyboardEvent) {
    if (!visible.value) return
    if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        dismiss()
    }
}

function handleImageLoad() {
    imageLoaded.value = true
}
function handleImageError() {
    imageFailed.value = true
}

function onImgRef(el: Element | ComponentPublicInstance | null, _refs: Record<string, any>) {
    if (!el) return
    const imgEl = el as HTMLImageElement
    if (imgEl.complete && imgEl.naturalWidth > 0) {
        imageLoaded.value = true
    } else if (imgEl.complete && imgEl.naturalWidth === 0) {
        imageFailed.value = true
    }
}

onMounted(() => {
    lockScroll()
    window.addEventListener('keydown', handleKeydown)

    safetyTimer = setTimeout(() => {
        if (!imageLoaded.value && !imageFailed.value) {
            imageLoaded.value = true
        }
    }, 800)

    let alreadySeen = false
    try {
        alreadySeen = !!sessionStorage.getItem(SESSION_KEY)
    } catch {
    }

    if (alreadySeen) {
        dismiss()
        return
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
        dismiss()
    } else {
        dismissTimer = setTimeout(dismiss, AUTO_DISMISS_MS)
    }
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
    if (dismissTimer) clearTimeout(dismissTimer)
    if (safetyTimer) clearTimeout(safetyTimer)
    unlockScroll()
})
</script>

<template>
    <Teleport to="body">
        <Transition name="splash-fade" @after-leave="onAfterLeave">
            <div v-if="visible" class="splash-overlay" role="dialog" aria-modal="true" aria-label="Fraud Radar NG intro"
                @click="dismiss">
                <div class="splash-radar" aria-hidden="true">
                    <span class="splash-ring splash-ring--1" />
                    <span class="splash-ring splash-ring--2" />
                    <span class="splash-ring splash-ring--3" />
                    <span class="splash-sweep" />
                </div>

                <button type="button" class="splash-skip" @click.stop="dismiss">
                    Skip <span aria-hidden="true">→</span>
                </button>

                <div class="splash-content">
                    <img :ref="onImgRef" v-show="!imageLoaded" src="/guard-shield.png"
                        alt="A man holds up a radar shield, warning viewers to verify before trusting"
                        class="splash-image" :class="{ 'is-loaded': !imageLoaded }" @load="handleImageLoad"
                        @error="handleImageError" />
                    <div v-if="imageLoaded && imageFailed" class="splash-placeholder" />
                    <p v-if="!imageFailed" class="splash-fallback">Fraud Radar NG</p>

                    <p class="splash-eyebrow"><span class="splash-dot" /> Fraud Radar NG</p>
                    <h1 class="splash-title">Report. Check. Protect.</h1>
                    <p class="splash-sub">Tap anywhere to continue</p>
                </div>

                <div class="splash-progress" aria-hidden="true">
                    <div class="splash-progress-bar" />
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
    background: radial-gradient(circle at 50% 40%, #10241a 0%, #060807 70%);
    cursor: pointer;
}

.splash-radar {
    position: absolute;
    top: 50%;
    left: 50%;
    width: min(90vw, 720px);
    height: min(90vw, 720px);
    transform: translate(-50%, -50%);
    pointer-events: none;
    opacity: 0.35;
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
    max-width: 520px;
}

.splash-image {
    width: min(78vw, 400px);
    height: auto;
    object-fit: contain;
    filter: drop-shadow(0 20px 45px rgba(0, 0, 0, 0.55));
    opacity: 0;
    transform: scale(0.94) translateY(10px);
    transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.2, 0.7, 0.2, 1);
}

.splash-image.is-loaded {
    opacity: 1;
    transform: scale(1) translateY(0);
}

.splash-placeholder {
    width: min(78vw, 400px);
    aspect-ratio: 3 / 4;
}

.splash-fallback {
    font-family: var(--serif, serif);
    font-size: 22px;
    color: rgba(255, 255, 255, 0.7);
}

.splash-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 24px;
    font-family: var(--mono, monospace);
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--accent, #4ade80);
}

.splash-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--accent, #4ade80);
}

.splash-title {
    margin-top: 14px;
    font-family: var(--serif, serif);
    font-size: clamp(28px, 5vw, 44px);
    line-height: 1.15;
    color: #fff;
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.5);
}

.splash-sub {
    margin-top: 14px;
    font-family: var(--mono, monospace);
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.6);
}

.splash-skip {
    position: absolute;
    top: 24px;
    right: 24px;
    z-index: 2;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.25);
    color: #fff;
    font-family: var(--mono, monospace);
    font-size: 11px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 9px 16px;
    border-radius: 999px;
    cursor: pointer;
    transition: border-color 0.15s ease, background 0.15s ease;
}

.splash-skip:hover {
    border-color: var(--accent, #4ade80);
    background: rgba(255, 255, 255, 0.14);
}

.splash-progress {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: rgba(255, 255, 255, 0.08);
}

.splash-progress-bar {
    height: 100%;
    width: 0%;
    background: var(--accent, #4ade80);
    animation: splash-progress 4.2s linear forwards;
}

@keyframes splash-progress {
    to {
        width: 100%;
    }
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

    .splash-sweep,
    .splash-progress-bar,
    .splash-image {
        animation: none !important;
        transition: none !important;
    }
}
</style>