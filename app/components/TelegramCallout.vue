<!-- app/components/TelegramCallout.vue -->
<script setup lang="ts">
withDefaults(defineProps<{
    botUsername?: string
    compact?: boolean
}>(), {
    botUsername: 'YourBotUsername', // TODO: replace with your real @username (no @ symbol needed here)
    compact: false,
})
</script>

<template>
    <div class="telegram-cta" :class="{ 'telegram-cta--compact': compact }">
        <div class="telegram-cta-icon">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
                <path
                    d="M21.5 4.5 2.7 11.9c-1.2.5-1.2 1.2-.2 1.5l4.8 1.5 1.8 5.6c.2.6.4.8.9.8.4 0 .6-.2.9-.5l2.2-2.1 4.6 3.4c.8.5 1.4.2 1.6-.8l3-14c.3-1.3-.4-1.9-1.7-1.8Z"
                    fill="currentColor" opacity="0.15" />
                <path
                    d="M21.5 4.5 2.7 11.9c-1.2.5-1.2 1.2-.2 1.5l4.8 1.5 1.8 5.6c.2.6.4.8.9.8.4 0 .6-.2.9-.5l2.2-2.1 4.6 3.4c.8.5 1.4.2 1.6-.8l3-14c.3-1.3-.4-1.9-1.7-1.8Zm-3.4 3.6-7.6 6.9c-.3.3-.5.5-.6.9l-.2 2.7-1.4-4.3c-.1-.4 0-.6.3-.8l9-6c.3-.2.6-.1.5.3-.1.1-.1.2 0 .3Z"
                    stroke="currentColor" stroke-width="0.4" fill="currentColor" />
            </svg>
        </div>

        <div class="telegram-cta-text">
            <span class="telegram-cta-title">Check an account without opening the site</span>
            <p class="telegram-cta-body">
                Message our Telegram bot with any account number, phone number, or company name —
                it checks it against every report on FRNG and replies in seconds.
            </p>
        </div>

        <a :href="`https://t.me/${botUsername}`" target="_blank" rel="noopener noreferrer" class="telegram-cta-btn">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none">
                <path
                    d="M21.5 4.5 2.7 11.9c-1.2.5-1.2 1.2-.2 1.5l4.8 1.5 1.8 5.6c.2.6.4.8.9.8.4 0 .6-.2.9-.5l2.2-2.1 4.6 3.4c.8.5 1.4.2 1.6-.8l3-14c.3-1.3-.4-1.9-1.7-1.8Z"
                    fill="currentColor" />
            </svg>
            Open in Telegram
        </a>
    </div>
</template>

<style scoped>
.telegram-cta {
    display: flex;
    align-items: center;
    gap: 16px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-left: 3px solid #229ed9;
    border-radius: var(--radius, 10px);
    padding: 18px 20px;
    flex-wrap: wrap;
    max-width: 640px;
    margin: 0 auto;
    margin-bottom: 34px;
}

.telegram-cta-icon {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    border-radius: 50%;
    background: rgba(34, 158, 217, 0.1);
    border: 1px solid rgba(34, 158, 217, 0.3);
    color: #229ed9;
    display: flex;
    align-items: center;
    justify-content: center;
}

.telegram-cta-text {
    flex: 1;
    min-width: 200px;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.telegram-cta-title {
    font-family: var(--serif);
    font-size: 15.5px;
    color: var(--text-1);
    line-height: 1.35;
}

.telegram-cta-body {
    font-size: 12.5px;
    color: var(--text-3);
    line-height: 1.6;
    font-weight: 300;
}

.telegram-cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #229ed9;
    color: #fff;
    font-weight: 600;
    font-family: var(--mono);
    font-size: 12px;
    letter-spacing: 0.03em;
    padding: 11px 18px;
    border-radius: var(--radius, 6px);
    text-decoration: none;
    white-space: nowrap;
    flex-shrink: 0;
    transition: background 0.15s ease;
}

.telegram-cta-btn:hover {
    background: #1b87bd;
}

/* Compact variant — for tighter spots like a footer or sidebar,
   stacks vertically and drops the icon circle. */
.telegram-cta--compact {
    flex-direction: column;
    align-items: flex-start;
    padding: 16px 18px;
}

.telegram-cta--compact .telegram-cta-icon {
    display: none;
}

.telegram-cta--compact .telegram-cta-btn {
    width: 100%;
    justify-content: center;
}

@media (max-width: 480px) {
    .telegram-cta {
        flex-direction: column;
        align-items: flex-start;
    }

    .telegram-cta-btn {
        width: 100%;
        justify-content: center;
    }
}
</style>