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

                <!-- BACKGROUND MEDIA -->
                <!-- Using an image for now. When the video is ready, swap this
                     block for a <video> tag (see commented example below) and
                     remove the img. -->
                <div class="splash-media">
                    <img src="/logoooo.png" alt="" class="splash-media__img" />
                    <!--
                    <video
                        class="splash-media__video"
                        src="/intro-bg.mp4"
                        autoplay
                        muted
                        loop
                        playsinline
                    />
                    -->
                </div>

                <div class="splash-scrim" aria-hidden="true" />

                <div class="splash-content">
                    <img src="/LOGOOO.png" alt="Fraud Radar NG" class="splash-logo" />

                    <p class="splash-eyebrow"><span class="splash-dot" /> Fraud Radar NG</p>

                    <p class="splash-title">Report. Check. Protect.</p>

                    <button type="button" class="splash-cta" @click="proceed">
                        Proceed
                    </button>
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
    justify-content: flex-end;
    overflow: hidden;
    background: var(--bg);
}

/* ── Background media ── */
.splash-media {
    position: absolute;
    inset: 0;
    z-index: 0;
}

.splash-media__img,
.splash-media__video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
}

/* Gradient scrim fading the media into var(--bg) at the bottom,
   where the text and button sit — matches the reference screenshot. */
.splash-scrim {
    position: absolute;
    inset: 0;
    z-index: 1;
    background: linear-gradient(to bottom,
            transparent 0%,
            transparent 40%,
            color-mix(in srgb, var(--bg) 55%, transparent) 62%,
            color-mix(in srgb, var(--bg) 88%, transparent) 78%,
            var(--bg) 92%);
}

.splash-content {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 24px 24px 56px;
    width: 100%;
    max-width: 480px;
}

.splash-logo {
    width: min(50vw, 180px);
    height: auto;
    object-fit: contain;
    filter: drop-shadow(0 0 22px color-mix(in srgb, var(--accent, #4ade80) 45%, transparent));
    margin-bottom: 8px;
}

.splash-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 6px;
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
    margin-top: 18px;
    font-family: var(--serif, serif);
    font-size: clamp(24px, 6vw, 34px);
    font-weight: 700;
    line-height: 1.2;
    color: #fff;
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.5);
}

.splash-cta {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-top: 28px;
    padding: 17px 32px;
    border: none;
    border-radius: 999px;
    background: var(--accent, #4ade80);
    color: #06210f;
    font-family: var(--mono, monospace);
    font-weight: 700;
    font-size: 16px;
    letter-spacing: 0.02em;
    cursor: pointer;
    box-shadow: 0 8px 28px color-mix(in srgb, var(--accent, #4ade80) 45%, transparent);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.splash-cta:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 34px color-mix(in srgb, var(--accent, #4ade80) 60%, transparent);
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
</style>