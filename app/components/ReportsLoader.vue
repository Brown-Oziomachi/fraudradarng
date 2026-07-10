<script setup lang="ts">
const messages = [
  'Loading reports…',
  'Getting community reports…',
  'Cross-checking flagged accounts…',
  'Scanning for repeat offenders…',
  'Matching accounts to known scams…',
  'Pulling in evidence…',
  'Verifying reporter counts…',
  'Sorting by risk level…',
  'Checking bank account patterns…',
  'Loading testimonies…',
  'Building the fraud map…',
  'Syncing with the database…',
  'Almost ready…'
]

const index = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timer = setInterval(() => {
    index.value = (index.value + 1) % messages.length
  }, 1300)

  // lock page scroll while the modal is up
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="loader-overlay" @click.stop @wheel.prevent @touchmove.prevent>
    <div class="loader-modal">
      <div class="loader-spinner">
        <span v-for="n in 3" :key="n" class="loader-dot" :style="{ animationDelay: `${n * 0.15}s` }" />
      </div>
      <Transition name="fade" mode="out-in">
        <p :key="index" class="loader-text">{{ messages[index] }}</p>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.loader-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(10, 10, 11, 0.55);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  /* blocks all pointer interaction with content behind it */
  pointer-events: all;
  overscroll-behavior: contain;
}

.loader-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 32px 40px;
  background: var(--surface);
  border: 1px solid var(--border-hi);
  border-radius: 12px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
  min-width: 220px;
}

.loader-spinner {
  display: flex;
  gap: 6px;
}
.loader-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  animation: pulse 1s ease-in-out infinite;
}
@keyframes pulse {
  0%, 80%, 100% { opacity: 0.25; transform: scale(0.85); }
  40% { opacity: 1; transform: scale(1); }
}

.loader-text {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-2);
  text-align: center;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>