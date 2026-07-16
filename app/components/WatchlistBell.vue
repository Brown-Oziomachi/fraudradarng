<script setup lang="ts">
const { totalNewCount, refreshAll, loadFromStorage } = useWatchlist()

onMounted(() => {
    loadFromStorage()
    refreshAll()
})
</script>

<template>
    <NuxtLink to="/watchlist" class="watchlist-bell" aria-label="Your watchlist">
        <svg viewBox="0 0 24 24" width="17" height="17" fill="none">
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
        <span v-if="totalNewCount > 0" class="watchlist-badge">{{ totalNewCount > 9 ? '9+' : totalNewCount }}</span>
    </NuxtLink>
</template>

<style scoped>
.watchlist-bell {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    color: var(--text-2);
    text-decoration: none;
    transition: border-color 0.15s, background 0.15s, color 0.15s;
}

.watchlist-bell:hover {
    border-color: var(--border-hi);
    background: var(--surface-2);
    color: var(--text-1);
}

.watchlist-badge {
    position: absolute;
    top: -5px;
    right: -5px;
    min-width: 16px;
    height: 16px;
    padding: 0 3px;
    border-radius: 999px;
    background: #f87171;
    color: #fff;
    font-family: var(--mono);
    font-size: 9px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
}
</style>