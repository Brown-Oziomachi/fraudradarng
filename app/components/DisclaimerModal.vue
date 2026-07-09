<!-- app/components/DisclaimerModal.vue -->
<script setup lang="ts">
const STORAGE_KEY = 'frng_disclaimer_ack_v1'

const visible = ref(false)

onMounted(() => {
  try {
    const seen = localStorage.getItem(STORAGE_KEY)
    if (!seen) {
      // small delay so it doesn't slam the user the instant the page paints
      setTimeout(() => { visible.value = true }, 500)
    }
  } catch {
    // localStorage unavailable (e.g. private mode edge cases) — skip gracefully
  }
})

function dismiss() {
  visible.value = false
  try {
    localStorage.setItem(STORAGE_KEY, '1')
  } catch {
    // ignore — worst case it shows again next visit
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="visible" class="modal-backdrop" @click.self="dismiss">
        <Transition name="modal-pop" appear>
          <div v-if="visible" class="modal-card" role="dialog" aria-modal="true" aria-labelledby="disclaimer-modal-title">
            <div class="modal-icon">
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
                <path d="M12 8v5M12 16h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>

            <h2 id="disclaimer-modal-title" class="modal-title">Before you continue</h2>

            <p class="modal-body">
              Fraud Radar NG (FRNG) is an <strong>independent, community-driven
              platform</strong>. We are not affiliated with, endorsed by, or
              acting on behalf of the Nigerian government, the Police, the
              EFCC, the CBN, or any law enforcement agency.
            </p>
            <p class="modal-body">
              Reports on this platform are submitted by the public and are
              <strong>not independently verified</strong>. Read every report
              as one person's account, not a proven legal fact.
            </p>

            <div class="modal-actions">
              <NuxtLink to="/disclaimer" class="btn-link" @click="dismiss">
                Read full disclaimer
              </NuxtLink>
              <button type="button" class="btn-accept" @click="dismiss">
                I understand
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 99999;
  background: rgba(10, 10, 11, 0.6);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow-y: auto;
}

.modal-card {
  background: var(--surface, #fff);
  border: 1px solid var(--border, #e2e2e2);
  border-radius: 16px;
  max-width: 440px;
  width: 100%;
  padding: 32px 28px 28px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
  max-height: calc(100vh - 40px);
  overflow-y: auto;
}

/* Desktop: full-page takeover instead of a small centered card */
@media (min-width: 1024px) {
  .modal-backdrop { padding: 0; }
  .modal-card {
    max-width: none;
    width: 70vw;
    height: 80vh;
    max-height: 100vh;
    border-radius: 0;
    border: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 64px 15vw;
  }
}

.modal-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--accent-dim, rgba(220, 51, 51, 0.08));
  color: var(--accent, #dc3333);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.modal-title {
  font-family: var(--serif, serif);
  font-size: 20px;
  color: var(--text-1, #111);
  margin-bottom: 14px;
}

@media (min-width: 1024px) {
  .modal-title { font-size: 30px; }
}

.modal-body {
  font-size: 13.5px;
  line-height: 1.7;
  color: var(--text-2, #444);
  font-weight: 300;
  margin-bottom: 14px;
}
.modal-body strong { color: var(--text-1, #111); font-weight: 600; }

@media (min-width: 1024px) {
  .modal-body { font-size: 15.5px; max-width: 640px; }
}

.modal-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.btn-link {
  font-family: var(--mono, monospace);
  font-size: 11.5px;
  letter-spacing: 0.04em;
  color: var(--text-3, #888);
  text-decoration: underline;
  text-underline-offset: 3px;
}
.btn-link:hover { color: var(--text-1, #111); }

.btn-accept {
  font-family: var(--mono, monospace);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  background: var(--accent, #dc3333);
  color: #0a0a0b;
  border: none;
  border-radius: var(--radius, 8px);
  padding: 12px 22px;
  cursor: pointer;
  transition: filter 0.15s;
}
.btn-accept:hover { filter: brightness(1.08); }

@media (min-width: 1024px) {
  .modal-actions { margin-top: 32px; }
  .btn-accept { padding: 14px 28px; font-size: 13px; }
}

/* backdrop fade */
.modal-fade-enter-active,
.modal-fade-leave-active { transition: opacity 0.25s ease; }
.modal-fade-enter-from,
.modal-fade-leave-to { opacity: 0; }

/* card pop */
.modal-pop-enter-active { transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-pop-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.modal-pop-enter-from { opacity: 0; transform: scale(0.92) translateY(10px); }
.modal-pop-leave-to { opacity: 0; transform: scale(0.96); }
</style>