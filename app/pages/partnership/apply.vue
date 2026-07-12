<script setup lang="ts">
/**
 * pages/partnership.vue
 * FRNG — Partnership recruitment page.
 * Form lives in a modal, triggered by CTAs across the page.
 * Uses the existing FRNG design tokens (--bg, --surface, --accent, --border,
 * --text-1/2/3, --mono, --serif, --radius) and [data-theme='dark'] theming.
 */

import { ref, reactive, computed, watch, nextTick } from 'vue'

useHead({
  title: 'Partner With FRNG — Fraud Radar NG',
  meta: [
    {
      name: 'description',
      content:
        'Join the coalition building Nigeria\u2019s community fraud intelligence network. For fintechs, journalists, and advocacy groups.',
    },
  ],
})

type PartnerType = 'fintech' | 'journalist' | 'ngo' | ''

interface ObjectiveOption {
  id: string
  label: string
}

const objectivesByType: Record<Exclude<PartnerType, ''>, ObjectiveOption[]> = {
  fintech: [
    { id: 'fintech-data-structures', label: 'Securely sharing internal fraud/mule account data structures' },
    { id: 'fintech-threat-mapping', label: 'Collaborating on threat vector mapping' },
  ],
  journalist: [
    { id: 'journalist-trends', label: 'Accessing aggregated, anonymous threat trends for investigative reporting' },
    { id: 'journalist-expose', label: 'Exposing active digital syndicates to the public' },
  ],
  ngo: [
    { id: 'ngo-campaigns', label: 'Co-launching community anti-fraud education campaigns' },
    { id: 'ngo-toolkits', label: 'Deploying digital literacy training toolkits at the grassroots level' },
  ],
}

const partnerTypeOptions: { value: Exclude<PartnerType, ''>; label: string }[] = [
  { value: 'fintech', label: 'Fintech / Financial Institution' },
  { value: 'journalist', label: 'Journalist / Media House' },
  { value: 'ngo', label: 'NGO / Advocacy Group' },
]

// ---------- Modal state ----------
const isModalOpen = ref(false)
const modalRef = ref<HTMLElement | null>(null)
const firstFieldRef = ref<HTMLInputElement | null>(null)
let lastFocusedEl: HTMLElement | null = null

function openModal(presetType: PartnerType = '') {
  lastFocusedEl = document.activeElement as HTMLElement
  if (presetType) form.partnerType = presetType
  isModalOpen.value = true
  document.body.style.overflow = 'hidden'
  nextTick(() => firstFieldRef.value?.focus())
}

function closeModal() {
  isModalOpen.value = false
  document.body.style.overflow = ''
  lastFocusedEl?.focus()
}

function onKeydown(e: KeyboardEvent) {
  if (!isModalOpen.value) return
  if (e.key === 'Escape') closeModal()
  if (e.key === 'Tab') trapFocus(e)
}

function trapFocus(e: KeyboardEvent) {
  const focusable = modalRef.value?.querySelectorAll<HTMLElement>(
    'input, select, textarea, button, [href]'
  )
  if (!focusable || focusable.length === 0) return
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})

// ---------- Form state ----------
const form = reactive({
  fullName: '',
  email: '',
  orgName: '',
  orgWebsite: '',
  partnerType: '' as PartnerType,
  objectives: [] as string[],
  message: '',
})

const currentObjectives = computed(() =>
  form.partnerType ? objectivesByType[form.partnerType as Exclude<PartnerType, ''>] : []
)

// Reset checked objectives whenever the partner type changes
watch(
  () => form.partnerType,
  () => {
    form.objectives = []
  }
)

function toggleObjective(id: string) {
  const idx = form.objectives.indexOf(id)
  if (idx === -1) form.objectives.push(id)
  else form.objectives.splice(idx, 1)
}

// ---------- Submission ----------
type SubmitState = 'idle' | 'submitting' | 'success' | 'error'
const submitState = ref<SubmitState>('idle')
const errorMessage = ref('')

const isValid = computed(() => {
  return (
    form.fullName.trim().length > 1 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
    form.orgName.trim().length > 1 &&
    form.partnerType !== '' &&
    form.objectives.length > 0
  )
})

async function handleSubmit() {
  if (!isValid.value) {
    errorMessage.value = 'Please fill in all required fields and pick at least one objective.'
    return
  }
  errorMessage.value = ''
  submitState.value = 'submitting'
  try {
    await $fetch('/api/partnership', {
      method: 'POST',
      body: { ...form },
    })
    submitState.value = 'success'
  } catch (err) {
    submitState.value = 'error'
    errorMessage.value = 'Something went wrong sending your request. Please try again.'
  }
}

function resetAndClose() {
  form.fullName = ''
  form.email = ''
  form.orgName = ''
  form.orgWebsite = ''
  form.partnerType = ''
  form.objectives = []
  form.message = ''
  submitState.value = 'idle'
  closeModal()
}
</script>

<template>
  <div class="partnership-page">
    <!-- ============ HERO ============ -->
    <section class="hero">
      <p class="eyebrow">FRNG Coalition &middot; Founding Partners</p>
      <h1>We're building Nigeria's fraud early-warning system &mdash; before the alarms exist.</h1>
      <p class="hero-sub">
        The FRNG Intelligence Engine is still coming. Right now, we're recruiting the
        institutions, reporters, and advocates who will help us gather the first data,
        verify the first patterns, and reach the first communities. This is the ground floor.
      </p>
      <button class="btn-primary" @click="openModal()">Apply to Partner</button>
    </section>

    <!-- ============ WHY COLLABORATE ============ -->
    <section class="why-section">
      <h2>Why work with us</h2>
      <p class="section-lead">
        FRNG isn't a product yet &mdash; it's a coalition. Here's what the partnership
        actually looks like for each group we work with.
      </p>

      <div class="why-grid">
        <article class="why-card">
          <span class="why-tag">Fintechs &amp; Banks</span>
          <h3>Stop watching stolen funds cross your own fence line</h3>
          <p>
            Fraudsters move money between banks faster than any single institution can
            track alone. FRNG acts as a neutral, anonymous clearinghouse: your team
            shares fraud and mule-account patterns without exposing customer data, and
            in exchange you see the same movement other banks are seeing. No one
            institution gets the full picture on its own &mdash; that's the whole problem
            we exist to fix.
          </p>
          <button class="btn-ghost" @click="openModal('fintech')">Partner as a Fintech</button>
        </article>

        <article class="why-card">
          <span class="why-tag">Journalists &amp; Media</span>
          <h3>Report the pattern, not just the headline</h3>
          <p>
            Most fraud coverage reacts to one victim's story. FRNG gives your newsroom
            verified, aggregated trend data across states and scam types &mdash; the kind
            of evidence that turns a single complaint into an investigative piece that
            actually moves the public. You get the receipts; your readers get warned
            before they become the next case file.
          </p>
          <button class="btn-ghost" @click="openModal('journalist')">Partner as Media</button>
        </article>

        <article class="why-card">
          <span class="why-tag">NGOs &amp; Advocacy</span>
          <h3>Put real data behind the communities you already protect</h3>
          <p>
            You know which communities are most exposed. We can show you which scams are
            actually hitting them, right now, in plain terms your field teams can use.
            That means education campaigns and literacy toolkits built on evidence, not
            guesswork &mdash; aimed at the people who need them most, not a generic
            audience.
          </p>
          <button class="btn-ghost" @click="openModal('ngo')">Partner as an NGO</button>
        </article>
      </div>
    </section>

    <!-- ============ CLOSING CTA ============ -->
    <section class="closing-cta">
      <h2>No tools to sell you. Just a network to build.</h2>
      <p>
        There's no API, no dashboard, no pricing tier here yet. Right now this is about
        laying the foundation together &mdash; the data structures, the trust, and the
        first campaigns that make the Intelligence Engine worth launching.
      </p>
      <button class="btn-primary" @click="openModal()">Start the Conversation</button>
    </section>

    <!-- ============ MODAL ============ -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="isModalOpen" class="modal-overlay" @mousedown.self="closeModal">
          <div
            ref="modalRef"
            class="modal-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="partnership-modal-title"
          >
            <button class="modal-close" type="button" aria-label="Close form" @click="closeModal">
              &times;
            </button>

            <!-- Success state -->
            <div v-if="submitState === 'success'" class="modal-success">
              <div class="success-icon" aria-hidden="true">&#10003;</div>
              <h2>Request received</h2>
              <p>
                Thanks for reaching out. A member of the FRNG team will review your
                application and follow up at the email you provided.
              </p>
              <button class="btn-primary" type="button" @click="resetAndClose">Done</button>
            </div>

            <!-- Form state -->
            <form v-else class="partnership-form" novalidate @submit.prevent="handleSubmit">
              <h2 id="partnership-modal-title">Apply to Partner</h2>
              <p class="form-lead">
                Tell us who you are and where you'd like to plug in. We read every
                application ourselves.
              </p>

              <div class="field">
                <label for="fullName">Full Name</label>
                <input
                  id="fullName"
                  ref="firstFieldRef"
                  v-model="form.fullName"
                  type="text"
                  autocomplete="name"
                  required
                />
              </div>

              <div class="field">
                <label for="email">Official Work Email</label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  autocomplete="email"
                  required
                />
              </div>

              <div class="field-row">
                <div class="field">
                  <label for="orgName">Organization Name</label>
                  <input id="orgName" v-model="form.orgName" type="text" required />
                </div>

                <div class="field">
                  <label for="orgWebsite">Organization Website</label>
                  <input
                    id="orgWebsite"
                    v-model="form.orgWebsite"
                    type="url"
                    placeholder="https://"
                  />
                </div>
              </div>

              <div class="field">
                <label for="partnerType">Partner Type</label>
                <select id="partnerType" v-model="form.partnerType" required>
                  <option value="" disabled>Select one</option>
                  <option
                    v-for="opt in partnerTypeOptions"
                    :key="opt.value"
                    :value="opt.value"
                  >
                    {{ opt.label }}
                  </option>
                </select>
              </div>

              <div v-if="form.partnerType" class="field">
                <label class="group-label">Collaboration Objectives</label>
                <div class="checkbox-group">
                  <label
                    v-for="obj in currentObjectives"
                    :key="obj.id"
                    class="checkbox-option"
                  >
                    <input
                      type="checkbox"
                      :value="obj.id"
                      :checked="form.objectives.includes(obj.id)"
                      @change="toggleObjective(obj.id)"
                    />
                    <span>{{ obj.label }}</span>
                  </label>
                </div>
              </div>

              <div class="field">
                <label for="message">Message / Use Case</label>
                <textarea
                  id="message"
                  v-model="form.message"
                  rows="4"
                  placeholder="Tell us a bit about what you're hoping to build with us."
                ></textarea>
              </div>

              <p v-if="errorMessage" class="form-error" role="alert">{{ errorMessage }}</p>

              <button
                class="btn-primary btn-submit"
                type="submit"
                :disabled="submitState === 'submitting'"
              >
                {{ submitState === 'submitting' ? 'Sending…' : 'Submit Application' }}
              </button>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.partnership-page {
  background: var(--bg);
  color: var(--text-1);
  font-family: var(--sans, sans-serif);
}

section {
  max-width: 1080px;
  margin: 0 auto;
  padding: 4rem 1.5rem;
}

/* ---------- Hero ---------- */
.hero {
  text-align: center;
  padding-top: 5rem;
  padding-bottom: 3.5rem;
}

.eyebrow {
  font-family: var(--mono);
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 1rem;
}

.hero h1 {
  font-family: var(--serif);
  font-size: clamp(2.9rem, 4.5vw, 7rem);
  line-height: 1.15;
  max-width: 28ch;
  margin: 0 auto 1.25rem;
}

.hero-sub {
  color: var(--text-2);
  max-width: 56ch;
  margin: 0 auto 2rem;
  font-size: 1.05rem;
  line-height: 1.6;
}

/* ---------- Buttons ---------- */
.btn-primary {
  background: var(--accent);
  color: #0b0d08;
  border: none;
  border-radius: var(--radius);
  padding: 0.85rem 1.75rem;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: transform 0.15s ease, filter 0.15s ease;
}

.btn-primary:hover {
  filter: brightness(1.08);
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-ghost {
  background: transparent;
  color: var(--accent);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 0.65rem 1.25rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease;
}

.btn-ghost:hover {
  border-color: var(--accent);
  background: rgba(232, 255, 71, 0.06);
}

/* ---------- Why section ---------- */
.why-section h2 {
  font-family: var(--serif);
  font-size: clamp(1.5rem, 3vw, 2rem);
  margin-bottom: 0.5rem;
}

.section-lead {
  color: var(--text-2);
  max-width: 60ch;
  margin-bottom: 2.5rem;
}

.why-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.why-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.why-tag {
  font-family: var(--mono);
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--accent);
}

.why-card h3 {
  font-size: 1.15rem;
  line-height: 1.35;
  margin: 0;
}

.why-card p {
  color: var(--text-2);
  font-size: 0.92rem;
  line-height: 1.6;
  flex: 1;
}

.why-card .btn-ghost {
  align-self: flex-start;
  margin-top: 0.5rem;
}

/* ---------- Closing CTA ---------- */
.closing-cta {
  text-align: center;
  border-top: 1px solid var(--border);
}

.closing-cta h2 {
  font-family: var(--serif);
  font-size: clamp(1.4rem, 3vw, 1.9rem);
  margin-bottom: 0.75rem;
}

.closing-cta p {
  color: var(--text-2);
  max-width: 52ch;
  margin: 0 auto 1.75rem;
  line-height: 1.6;
}

/* ---------- Modal ---------- */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(4, 5, 3, 0.72);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 100;
}

.modal-panel {
  position: relative;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 2rem 1.75rem;
}

.modal-close {
  position: absolute;
  top: 0.75rem;
  right: 0.9rem;
  background: transparent;
  border: none;
  color: var(--text-2);
  font-size: 1.6rem;
  line-height: 1;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
}

.modal-close:hover {
  color: var(--text-1);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.18s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* ---------- Form ---------- */
.partnership-form h2 {
  font-family: var(--serif);
  font-size: 1.4rem;
  margin: 0 0 0.4rem;
}

.form-lead {
  color: var(--text-2);
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.field {
  margin-bottom: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 520px) {
  .field-row {
    grid-template-columns: 1fr;
  }
}

label {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-1);
}

.group-label {
  margin-bottom: 0.2rem;
}

input[type='text'],
input[type='email'],
input[type='url'],
select,
textarea {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: calc(var(--radius) - 2px);
  color: var(--text-1);
  padding: 0.65rem 0.75rem;
  font-size: 0.95rem;
  font-family: inherit;
  width: 100%;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(232, 255, 71, 0.15);
}

textarea {
  resize: vertical;
  min-height: 90px;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.checkbox-option {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  font-size: 0.88rem;
  font-weight: 400;
  color: var(--text-2);
  cursor: pointer;
}

.checkbox-option input {
  margin-top: 0.2rem;
  accent-color: var(--accent);
}

.form-error {
  color: #ff6b6b;
  font-size: 0.85rem;
  margin-bottom: 1rem;
}

.btn-submit {
  width: 100%;
  margin-top: 0.5rem;
}

/* ---------- Success state ---------- */
.modal-success {
  text-align: center;
  padding: 1.5rem 0.5rem;
}

.success-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--accent);
  color: #0b0d08;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  margin: 0 auto 1.25rem;
}

.modal-success h2 {
  font-family: var(--serif);
  margin-bottom: 0.6rem;
}

.modal-success p {
  color: var(--text-2);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}
</style>