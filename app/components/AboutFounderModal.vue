<script setup lang="ts">
interface SocialLink {
    label: string
    href: string
    icon: 'x' | 'github' | 'globe' | 'linkedin' | 'youtube' | 'substack'
}

const props = withDefaults(defineProps<{
    modelValue: boolean
    founderName?: string
    role?: string
    breadcrumb?: string
    avatar?: string
    backgroundImage?: string
    bio?: string[]
    links?: SocialLink[]
}>(), {
    founderName: 'Sir Brown AD',
    role: 'Full-Stack Developer | Blogger',
    breadcrumb: '#StopScamsNG / Fraud Radar NG',
    avatar: '/meme.png',
    backgroundImage: '/USE.png',
    bio: () => [
        'Sir Brown AD is a full-stack developer and a blogger based in Abuja, building web platforms that solve problems most people don\'t realize are solvable — from fraud awareness to tools that quietly save someone an afternoon. He has been building full-stack web applications since training through EarlyCode Institute, working across React, Next.js, Vue, vite and Nuxt.',
        'Fraud Radar NG started from a simple observation: the same fraudulent account, the same fake company, the same cloned website gets reused on victim after victim because nobody warns the next person in time. Reports filed with banks and agencies disappear into case numbers — nothing public, nothing searchable, nothing that stops the next transfer.',
        'FRNG closes that gap — a free, instant, no-login way to warn everyone else before they lose anything. No approval queue, no bureaucracy, no waiting for a case to be "reviewed." A report goes live the moment it\'s submitted, because the five minutes it takes to publish a warning could be the five minutes that saves someone\'s savings.',
        'It\'s an idependent project — not a bank, not a government agency, not a law firm — built and maintained solo, for Nigerians, by a Nigerian who got tired of watching the same scripts work twice. Every part of it, from the report form to the internal moderation dashboard, was designed, built, and shipped by one person working out of Abuja.',
    ],
    links: () => [],
})

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

function close() {
    emit('update:modelValue', false)
}

function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') close()
}


watch(() => props.modelValue, (open) => {
    if (import.meta.client) {
        document.documentElement.style.overflow = open ? 'hidden' : ''
    }
})

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKeydown)
    if (import.meta.client) document.documentElement.style.overflow = ''
})
</script>

<template>
    <Teleport to="body">
        <Transition name="modal-fade">
            <div v-if="modelValue" class="modal-overlay" role="dialog" aria-modal="true"
                :aria-label="`About ${founderName}`"
                :style="backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined">
                <div class="modal-topbar" aria-hidden="true" />

                <button class="modal-close" aria-label="Close" @click="close">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                    </svg>
                </button>

                <Transition name="modal-pop" appear>
                    <div v-if="modelValue" class="modal-panel">
                        <p v-if="breadcrumb" class="modal-breadcrumb">{{ breadcrumb }}</p>

                        <div class="modal-content">
                            <div class="modal-avatar-wrap">
                                <img :src="avatar" :alt="founderName" class="modal-avatar" loading="lazy"
                                    title="Sir Brown AD" />
                            </div>

                            <div class="modal-copy">
                                <h2 class="modal-name">{{ founderName }}</h2>
                                <p class="modal-role">{{ role }}</p>

                                <div v-if="links.length" class="modal-links">
                                    <a v-for="link in links" :key="link.href" :href="link.href" target="_blank"
                                        rel="noopener noreferrer" class="modal-link-btn"
                                        :class="`modal-link-btn--${link.icon}`" :aria-label="link.label">
                                        <svg title="X Twitter" v-if="link.icon === 'x'" viewBox="0 0 24 24" width="16"
                                            height="16" fill="currentColor">
                                            <path
                                                d="M18.3 2H21l-6.7 7.6L22 22h-6.6l-5.2-6.8L4.2 22H1.5l7.2-8.2L1 2h6.7l4.7 6.2L18.3 2Zm-1.2 18h1.8L7 4H5.1l12 16Z" />
                                        </svg>
                                        <svg title="Github" v-else-if="link.icon === 'github'" viewBox="0 0 24 24"
                                            width="16" height="16" fill="currentColor">
                                            <path
                                                d="M12 2C6.5 2 2 6.5 2 12c0 4.4 2.9 8.1 6.9 9.4.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.1-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.7.4-1.1.6-1.4-2.3-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.5-1.3.1-2.7 0 0 .8-.3 2.7 1a9.3 9.3 0 0 1 4.9 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.3 4.7-4.6 5 .4.3.7 1 .7 2v3c0 .3.2.6.7.5A10 10 0 0 0 22 12c0-5.5-4.5-10-10-10Z" />
                                        </svg>
                                        <svg v-else-if="link.icon === 'globe'" viewBox="0 0 24 24" width="16"
                                            height="16" fill="none">
                                            <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8" />
                                            <path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18"
                                                stroke="currentColor" stroke-width="1.8" />
                                        </svg>
                                        <svg v-else-if="link.icon === 'substack'" title="Substack" viewBox="0 0 24 24"
                                            width="16" height="16" fill="currentColor" aria-hidden="true">
                                            <path
                                                d="M4.5 5.5h15v2.1h-15V5.5Zm0 5.3h15v2.1h-15v-2.1Zm0 5.3H15v2.1H4.5v-2.1Z" />
                                            <path d="M4.5 18.2h15v1.8c0 .8-.7 1.5-1.5 1.5H6c-.8 0-1.5-.7-1.5-1.5v-1.8Z"
                                                opacity=".8" />
                                        </svg>
                                        <svg v-else-if="link.icon === 'linkedin'" viewBox="0 0 24 24" width="16"
                                            height="16" fill="currentColor">
                                            <path
                                                d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5ZM3 8.98h4V21H3V8.98ZM9 8.98h3.8v1.64h.05c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.29-.02-2.94-1.8-2.94-1.8 0-2.08 1.4-2.08 2.85V21H9V8.98Z" />
                                        </svg>
                                        <svg v-else viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                            <path
                                                d="M22 12s0-3.2-.4-4.7a2.8 2.8 0 00-2-2C17.9 5 12 5 12 5s-5.9 0-7.6.3a2.8 2.8 0 00-2 2C2 8.8 2 12 2 12s0 3.2.4 4.7a2.8 2.8 0 002 2C6.1 19 12 19 12 19s5.9 0 7.6-.3a2.8 2.8 0 002-2C22 15.2 22 12 22 12ZM10 15.5v-7l6 3.5-6 3.5Z" />
                                        </svg>
                                    </a>
                                </div>

                                <p v-for="(para, i) in bio" :key="i" class="modal-bio">
                                    {{ para }}
                                </p>


                            </div>
                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
/* Full-viewport background photo — the founder's own background, distinct from the panel */
.modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 999;
    width: 100vw;
    height: 100vh;
    height: 100dvh;
    overflow: hidden;
    background-size: cover;
}

/* Thin accent strip across the very top edge, matching the reference */
.modal-topbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    z-index: 2;
    background: var(--accent);
}

.modal-close {
    position: fixed;
    top: max(20px, env(safe-area-inset-top));
    right: max(20px, env(safe-area-inset-right));
    z-index: 3;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: 1px solid color-mix(in srgb, white 25%, transparent);
    background-color: var(--surface);
    color: #fff;
    cursor: pointer;
    transition: color 0.15s, border-color 0.15s;
}

.modal-close:hover {
    color: var(--accent);
    border-color: var(--accent);
}

.modal-panel {
    position: absolute;
    z-index: 1;
    top: 20px;
    left: 20px;
    bottom: 20px;
    width: min(760px, calc(100vw - 40px));
    overflow: hidden;
    padding: clamp(24px, 4vh, 44px) clamp(24px, 3.5vw, 44px);
    box-sizing: border-box;
    background: var(--surface);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    box-shadow: 0 24px 64px color-mix(in srgb, black 45%, transparent);
    display: flex;
    flex-direction: column;
}

.modal-breadcrumb {
    font-family: var(--mono);
    font-size: 12px;
    color: var(--text-1);
    margin-bottom: clamp(14px, 3vh, 26px);
    flex-shrink: 0;
    text-align: center;
    background-color: var(--border-hi);
    padding: 8px;
}

/* Avatar sits beside the text, like the reference layout */
.modal-content {
    flex: 1;
    min-height: 0;
    display: flex;
    align-items: flex-start;
    gap: clamp(16px, 3vw, 32px);
}

.modal-avatar-wrap {
    width: clamp(96px, 26vh, 160px);
    height: clamp(96px, 26vh, 160px);
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
    box-shadow: 0 8px 24px color-mix(in srgb, black 40%, transparent), 0 4px 12px color-mix(in srgb, black 30%, transparent);
    border: 2px solid var(--surface-2);
}

.modal-avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.modal-copy {
    flex: 1;
    min-width: 0;
    min-height: 0;
    display: flex;
    flex-direction: column;
}

.modal-name {
    font-family: var(--serif);
    font-weight: 700;
    font-size: clamp(22px, 3.4vh, 34px);
    color: var(--text-1);
    line-height: 1.15;
    margin-bottom: 4px;
    flex-shrink: 0;
}

.modal-role {
    font-size: clamp(14px, 1.9vh, 17px);
    font-weight: 400;
    color: var(--text-1);
    margin-bottom: clamp(1px, 2.2vh, 1px);
    flex-shrink: 0;
}

.modal-bio {
    font-size: clamp(12px, 1.6vh, 14px);
    line-height: 1.65;
    color: var(--text-1);
    font-weight: 300;
    margin-bottom: clamp(8px, 1.4vh, 12px);

}

.modal-links {
    display: flex;
    gap: 10px;
    margin-top: 10px;
    margin-bottom: 15px;
    padding-top: clamp(10px, 2vh, 18px);
    flex-shrink: 0;
}

.modal-link-btn {
    width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: calc(var(--radius) - 2px);
    background: var(--accent);
    color: var(--text-1);
    transition: transform 0.15s, box-shadow 0.15s, filter 0.15s;
    border: 1px solid transparent;
    box-shadow: 0 4px 14px color-mix(in srgb, black 20%, transparent);
}

.modal-link-btn:hover {
    transform: translateY(-2px);
    filter: brightness(1.06);
    box-shadow: 0 8px 22px color-mix(in srgb, black 22%, transparent);
}

.modal-link-btn--x {
    background: #000000;
    color: #ffffff;
}

.modal-link-btn--github {
    background: #171515;
    color: #ffffff;
}

.modal-link-btn--globe {
    background: color-mix(in srgb, var(--accent) 75%, #ffffff 25%);
    color: var(--text-1);
}

.modal-link-btn--substack {
    background: #ff6719;
    color: #fffaf5;
}

.modal-link-btn--linkedin {
    background: #0a66c2;
    color: #ffffff;
}

.modal-link-btn--youtube {
    background: #ff0000;
    color: #ffffff;
}

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}

.modal-pop-enter-active {
    transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.modal-pop-leave-active {
    transition: opacity 0.15s ease, transform 0.15s ease;
}

.modal-pop-enter-from,
.modal-pop-leave-to {
    opacity: 0;
    transform: translateY(16px);
}

@media (max-width: 720px) {
    .modal-panel {
        top: 68px;
        left: 12px;
        right: 12px;
        bottom: 16px;
        width: auto;
        padding: 20px;
    }

    .modal-content {
        flex-direction: column;
        align-items: center;
        text-align: center;
        overflow-y: auto;
    }

    .modal-avatar-wrap {
        width: 84px;
        height: 84px;
    }

    .modal-links {
        justify-content: center;
        margin-top: 14px;
    }
}

@media (max-width: 720px) and (max-height: 700px) {
    .modal-avatar-wrap {
        width: 64px;
        height: 64px;
    }

    .modal-name {
        font-size: 20px;
    }

    .modal-bio {
        font-size: clamp(12px, 1.6vh, 14px);
        line-height: 1.65;
        color: var(--text-1);
        font-weight: 300;
        margin-bottom: clamp(8px, 1.4vh, 12px);
        text-align: left;
    }
}
</style>