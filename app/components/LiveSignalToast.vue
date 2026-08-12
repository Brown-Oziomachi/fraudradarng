<script setup lang="ts">
defineProps<{
    toasts: Array<{ title: string; reportId?: string }>
}>()
const emit = defineEmits<{ dismiss: [] }>()
</script>

<template>
    <Teleport to="body">
        <div v-if="toasts.length" class="toast-stack">
            <div v-for="(t, i) in toasts" :key="i" class="toast">
                <span class="toast-dot" />
                <div class="toast-text">
                    <div class="toast-title">New report just filed</div>
                    <div class="toast-body">{{ t.title }}</div>
                </div>
                <NuxtLink :to="t.reportId ? `/reports/${t.reportId}` : '/reports'" class="toast-link">View</NuxtLink>
                <button type="button" class="toast-close" @click="emit('dismiss')" aria-label="Dismiss">×</button>
            </div>
        </div>
    </Teleport>
</template>

<style scoped>
.toast-stack {
    position: fixed;
    bottom: 24px;
    left: 24px;
    z-index: 900;
    display: flex;
    flex-direction: column-reverse;
    gap: 12px;
    max-width: 340px;
}

@media (max-width: 480px) {
    .toast-stack {
        left: 12px;
        right: 12px;
        max-width: none;
    }
}

.toast {
    display: flex;
    align-items: center;
    gap: 12px;
    background: var(--surface);
    border: 1px solid var(--border-hi);
    border-radius: 14px;
    padding: 14px 16px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
    animation: toastIn 0.4s cubic-bezier(0.2, 0.7, 0.2, 1);
}

@keyframes toastIn {
    from {
        opacity: 0;
        transform: translateY(16px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.toast-dot {
    flex-shrink: 0;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--accent) 55%, transparent);
    animation: tickerPulse 1.6s ease-in-out infinite;
}

@keyframes tickerPulse {
    0% {
        box-shadow: 0 0 0 0 color-mix(in srgb, var(--accent) 55%, transparent);
    }

    70% {
        box-shadow: 0 0 0 7px transparent;
    }

    100% {
        box-shadow: 0 0 0 0 transparent;
    }
}

.toast-text {
    flex: 1;
    min-width: 0;
}

.toast-title {
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 2px;
}

.toast-body {
    font-size: 12.5px;
    color: var(--text-2);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.toast-link {
    flex-shrink: 0;
    font-family: var(--mono);
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--accent);
    text-decoration: none;
}

.toast-close {
    flex-shrink: 0;
    background: none;
    border: none;
    color: var(--text-3);
    font-size: 16px;
    cursor: pointer;
    line-height: 1;
}

.toast-close:hover {
    color: var(--accent);
}

@media (prefers-reduced-motion: reduce) {
    .toast-dot {
        animation: none;
    }
}
</style>