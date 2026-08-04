<!-- app/components/DisclaimerModal.vue -->
<script setup lang="ts">
const STORAGE_KEY = 'frng_disclaimer_ack_v2'

const visible = ref(false)
const acknowledged = ref(false)
const modalRef = ref<HTMLElement | null>(null)

let previouslyFocused: HTMLElement | null = null
let openTimer: ReturnType<typeof setTimeout> | null = null

function lockScroll() {
  document.documentElement.style.overflow = 'hidden'
}
function unlockScroll() {
  document.documentElement.style.overflow = ''
}

function openModal() {
  previouslyFocused = document.activeElement as HTMLElement
  visible.value = true
  lockScroll()
  nextTick(() => modalRef.value?.focus())
}

function closeModal(remember: boolean) {
  visible.value = false
  unlockScroll()
  if (remember) {
    try {
      localStorage.setItem(STORAGE_KEY, '1')
    } catch {
      // ignore — worst case it shows again next visit
    }
  }
  previouslyFocused?.focus()
}

function accept() {
  if (!acknowledged.value) return
  closeModal(true)
}

function dismissWithoutAck() {
  closeModal(false)
}

function handleKeydown(e: KeyboardEvent) {
  if (!visible.value) return

  if (e.key === 'Escape') {
    dismissWithoutAck()
    return
  }

  if (e.key === 'Tab' && modalRef.value) {
    const focusables = modalRef.value.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    if (!focusables.length) return
    const first = focusables[0] as HTMLElement
    const last = focusables[focusables.length - 1] as HTMLElement
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }
}

onMounted(() => {
  try {
    const seen = localStorage.getItem(STORAGE_KEY)
    if (!seen) {
      // small delay so it doesn't slam the user the instant the page paints
      openTimer = setTimeout(openModal, 500)
    }
  } catch {
    // localStorage unavailable (e.g. private mode edge cases) — skip gracefully
  }
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  if (openTimer) clearTimeout(openTimer)
  window.removeEventListener('keydown', handleKeydown)
  unlockScroll()
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="visible" class="modal-backdrop" @click.self="dismissWithoutAck">
        <Transition name="modal-pop" appear>
          <div v-if="visible" ref="modalRef" class="modal-card" role="dialog" aria-modal="true"
            aria-labelledby="disclaimer-modal-title" aria-describedby="disclaimer-modal-body" tabindex="-1">
            <button type="button" class="modal-close" aria-label="Close" @click="dismissWithoutAck">×</button>

            <div class="modal-header">
              <div class="modal-icon">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5" />
                  <path d="M12 8v5M12 16h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                </svg>
              </div>
            </div>

            <h2 id="disclaimer-modal-title" class="modal-title">Before you continue</h2>

            <div id="disclaimer-modal-body">
              <p class="modal-body">
                Fraud Radar NG (FRNG) is an <strong>independent, community-driven
                  platform</strong>. We are not affiliated with, endorsed by, or
                acting on behalf of the Nigerian government, the Police, the
                EFCC, the CBN, or any law enforcement agency.
              </p>
              <p class="modal-body">
                Reports on this platform are submitted by the public and are
                <strong>not independently verified</strong>. Read every report
                as one person's account, not a proven legal fact — and never
                use this platform as your sole basis for a legal, financial,
                or safety decision.
              </p>
              <p class="modal-body">
                Filing a report you know to be false may expose you to legal
                liability. If you believe a report about you is inaccurate,
                use the flag option on that report or contact us to request a
                correction.
              </p>
            </div>

            <label class="modal-ack">
              <input v-model="acknowledged" type="checkbox" class="modal-ack-checkbox" />
              <span>I understand these reports are unverified allegations, and I'll use my own judgment before acting on
                them.</span>
            </label>

            <div class="modal-actions">
              <NuxtLink to="/disclaimer" class="btn-link" @click="dismissWithoutAck">
                Read full disclaimer
              </NuxtLink>
              <button type="button" class="btn-accept" :disabled="!acknowledged" @click="accept">
                I understand & continue
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
  inset: 0;
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
  position: relative;
  background: var(--surface, #fff);
  border: 1px solid var(--border, #e2e2e2);
  max-width: 440px;
  width: 100%;
  padding: 32px 28px 28px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  background-image:
    linear-gradient(color-mix(in srgb, var(--surface, #fff) 92%, transparent),
      color-mix(in srgb, var(--surface, #fff) 92%, transparent)),
    url('/def.png');
  background-size: cover;
  background-position: center;
}

.modal-card:focus {
  outline: none;
}

.modal-close {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid var(--border, #e2e2e2);
  background: var(--surface, #fff);
  color: var(--text-2, #444);
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
}

.modal-close:hover {
  color: var(--accent, #dc3333);
  border-color: var(--accent, #dc3333);
}

/* Desktop: full-page takeover instead of a small centered card */
@media (min-width: 1024px) {
  .modal-backdrop {
    padding: 0;
  }

  .modal-card {
    max-width: none;
    width: 70vw;
    height: 95vh;
    max-height: 100vh;
    border-radius: 0;
    border: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 64px 15vw;
  }

  .modal-close {
    top: 28px;
    right: 28px;
  }
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.modal-icon {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 50%;
  background: var(--accent-dim, rgba(220, 51, 51, 0.08));
  color: var(--accent, #dc3333);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-mark {
  height: 22px;
  width: auto;
  display: block;
}

.modal-title {
  font-family: var(--serif, serif);
  font-size: 20px;
  color: var(--text-1, #111);
  margin-bottom: 14px;
}

@media (min-width: 1024px) {
  .modal-title {
    font-size: 30px;
  }
}

.modal-body {
  font-size: 13.5px;
  line-height: 1.7;
  color: var(--text-2, #444);
  font-weight: 300;
  margin-bottom: 14px;
}

.modal-body strong {
  color: var(--text-1, #111);
  font-weight: 600;
}

@media (min-width: 1024px) {
  .modal-body {
    font-size: 15.5px;
    max-width: 640px;
  }
}

.modal-ack {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-top: 8px;
  padding: 14px;
  border: 1px dashed var(--border, #e2e2e2);
  cursor: pointer;
}

.modal-ack-checkbox {
  margin-top: 2px;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  accent-color: var(--accent, #dc3333);
  cursor: pointer;
}

.modal-ack span {
  font-size: 12.5px;
  line-height: 1.55;
  color: var(--text-2, #444);
  font-weight: 400;
}

@media (min-width: 1024px) {
  .modal-ack {
    max-width: 640px;
  }

  .modal-ack span {
    font-size: 13.5px;
  }
}

.modal-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 20px;
  flex-wrap: wrap;
}

@media (min-width: 1024px) {
  .modal-actions {
    margin-top: 32px;
  }
}

.btn-link {
  font-family: var(--mono, monospace);
  font-size: 11.5px;
  letter-spacing: 0.04em;
  color: var(--text-3, #888);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.btn-link:hover {
  color: var(--text-1, #111);
}

.btn-accept {
  font-family: var(--mono, monospace);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  background: var(--accent, #dc3333);
  color: var(--text-2, #fff);
  border: none;
  padding: 12px 22px;
  cursor: pointer;
  transition: filter 0.15s, opacity 0.15s;
}

.btn-accept:hover:not(:disabled) {
  filter: brightness(1.08);
}

.btn-accept:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

@media (min-width: 1024px) {
  .btn-accept {
    padding: 14px 28px;
    font-size: 13px;
  }
}

/* backdrop fade */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* card pop */
.modal-pop-enter-active {
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-pop-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.modal-pop-enter-from {
  opacity: 0;
  transform: scale(0.92) translateY(10px);
}

.modal-pop-leave-to {
  opacity: 0;
  transform: scale(0.96);
}
</style>