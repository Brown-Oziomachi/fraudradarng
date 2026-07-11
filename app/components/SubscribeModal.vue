<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  modelValue: boolean
  privacyNoticeUrl?: string
}

const props = withDefaults(defineProps<Props>(), {
  privacyNoticeUrl: '',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'subscribed', email: string): void
}>()

const email = ref('')
const loading = ref(false)
const error = ref('')
const submitted = ref(false)
const alreadySubscribed = ref(false)

function close() {
  emit('update:modelValue', false)
}

async function handleSubmit() {
  if (loading.value) return
  error.value = ''
  loading.value = true

  try {
    const res = await $fetch<{ success: boolean; alreadySubscribed: boolean; message: string }>(
      '/api/subscribe',
      {
        method: 'POST',
        body: { email: email.value },
      }
    )

    alreadySubscribed.value = res.alreadySubscribed
    submitted.value = true
    emit('subscribed', email.value)

    setTimeout(() => {
      close()
    }, 2500)
  } catch (e: any) {
    error.value =
      e?.data?.message || 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}

// Reset state whenever the modal is reopened
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      email.value = ''
      error.value = ''
      submitted.value = false
      alreadySubscribed.value = false
      loading.value = false
    }
  }
)
</script>

<template>
  <Teleport to="body">
    <Transition name="overlay-fade">
      <div
        v-if="modelValue"
        class="modal-overlay"
        @click.self="close"
      >
        <Transition name="modal-pop">
          <div
            v-if="modelValue"
            class="modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="subscribe-modal-title"
          >
            <button
              class="close-btn"
              type="button"
              aria-label="Close"
              @click="close"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M1 1L17 17M17 1L1 17"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
            </button>

            <template v-if="!submitted">
              <h2 id="subscribe-modal-title" class="modal-title">
                Subscribe to<br />Fraud Radar NG
              </h2>
              <p class="modal-subtitle">
                Fraud alerts and safety tips delivered right to your inbox
              </p>

              <form class="subscribe-form" @submit.prevent="handleSubmit">
                <input
                  v-model="email"
                  type="email"
                  name="email"
                  placeholder="Email *"
                  required
                  class="email-input"
                  :class="{ 'has-error': error }"
                  :disabled="loading"
                  @input="error = ''"
                />

                <button
                  type="submit"
                  class="subscribe-btn"
                  :disabled="loading"
                >
                  {{ loading ? 'Subscribing…' : 'Subscribe' }}
                </button>

                <p v-if="error" class="error-text">{{ error }}</p>

                <p class="consent-text">
                  By submitting this form, you agree to receive fraud alert
                  communications at the email address you provided.
                  <template v-if="privacyNoticeUrl">
                    Your personal data will be processed following
                    <NuxtLink :to="privacyNoticeUrl" class="privacy-link" v-on:click="close">
                      the Privacy Notice
                    </NuxtLink>.
                  </template>
                </p>
              </form>
            </template>

            <template v-else-if="alreadySubscribed">
              <div class="success-state">
                <div class="success-icon already-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 8v4m0 4h.01M12 3l9 16H3L12 3z"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
                <h2 class="modal-title success-title">You're already subscribed</h2>
                <p class="modal-subtitle">
                  This email is already on our list — keep an eye on your inbox for fraud alerts and safety tips.
                </p>
              </div>
            </template>

            <template v-else>
              <div class="success-state">
                <div class="success-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M20 6L9 17L4 12"
                      stroke="currentColor"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
                <h2 class="modal-title success-title">You're subscribed!</h2>
                <p class="modal-subtitle">
                  Watch your inbox for fraud alerts and safety tips.
                </p>
              </div>
            </template>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>



<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(6px);
}

.modal-card {
  position: relative;
  width: 100%;
  max-width: 34rem;
  background: var(--card-bg, #ffffff);
  color: var(--text, #111111);
  border-radius: 1.25rem;
  padding: 3rem 2.5rem 2.25rem;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.25);
  text-align: center;
}

.close-btn {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--text, #111111);
  cursor: pointer;
  border-radius: 50%;
  transition: background 0.15s ease;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.06);
}

.modal-title {
  font-size: 2.25rem;
  font-weight: 800;
  line-height: 1.15;
  margin: 0 0 1rem;
  letter-spacing: -0.02em;
}

.modal-subtitle {
  font-size: 1rem;
  color: var(--text-muted, #555555);
  margin: 0 0 1.75rem;
}

.subscribe-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.email-input {
  width: 100%;
  padding: 0.9rem 1.1rem;
  font-size: 1rem;
  border-radius: 0.6rem;
  border: 1px solid var(--border, #dddddd);
  background: var(--input-bg, #f2f2f2);
  color: var(--text, #111111);
  outline: none;
  transition: border-color 0.15s ease, background 0.15s ease;
  box-sizing: border-box;
}

.email-input::placeholder {
  color: var(--text-muted, #8a8a8a);
}

.email-input:focus {
  border-color: var(--accent, #111111);
  background: var(--card-bg, #ffffff);
}

.email-input.has-error {
  border-color: #e04747;
}

.subscribe-btn {
  width: 100%;
  padding: 0.95rem 1rem;
  font-size: 1rem;
  font-weight: 700;
  border: none;
  border-radius: 0.6rem;
  background: var(--accent, #17181c);
  color: #ffffff;
  cursor: pointer;
  transition: opacity 0.15s ease, transform 0.1s ease;
}

.subscribe-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.subscribe-btn:active:not(:disabled) {
  transform: scale(0.99);
}

.subscribe-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-text {
  color: #e04747;
  font-size: 0.85rem;
  margin: -0.25rem 0 0;
}

.consent-text {
  font-size: 0.8rem;
  line-height: 1.5;
  color: var(--text-muted, #666666);
  margin: 0.5rem 0 0;
}

.privacy-link {
  color: inherit;
  text-decoration: underline;
}

.privacy-link:hover {
  color: var(--accent, #111111);
}

.success-state {
  padding: 0.5rem 0 1rem;
}

.success-icon {
  width: 3.5rem;
  height: 3.5rem;
  margin: 0 auto 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #e7f8ee;
  color: #1e9e5a;
}

.success-icon.already-icon {
  background: #fdf3e0;
  color: #b8791f;
}

.success-title {
  font-size: 1.75rem;
}

/* Transitions */
.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.2s ease;
}
.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}

.modal-pop-enter-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.modal-pop-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.modal-pop-enter-from,
.modal-pop-leave-to {
  opacity: 0;
  transform: scale(0.96) translateY(8px);
}

@media (max-width: 480px) {
  .modal-card {
    padding: 2.25rem 1.5rem 1.75rem;
  }
  .modal-title {
    font-size: 1.75rem;
  }
}
</style>