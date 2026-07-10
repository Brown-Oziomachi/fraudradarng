<script setup lang="ts">
import { reactive, ref, computed, watch, onMounted } from 'vue'
import type { Report, TargetType, ScamCategory } from '#shared/types/report'

interface FormState {
  targetType: TargetType
  category: '' | ScamCategory
  bankName: string
  accountName: string
  accountNumber: string
  companyName: string
  companyAddress: string
  websiteUrl: string
  websiteName: string
  // Cross-identifiers — collected regardless of targetType, since the same
  // scammer often reuses one phone number or wallet/payment tag across
  // different bank accounts, companies, or sites.
  phoneNumber: string
  walletTag: string
  reason: '' | 'fake_transfer' | 'romance_scam' | 'job_scam' | 'investment_scam' | 'other'
  description: string
  amountInvolved: string
  contactPlatform: string
}

const props = defineProps<{
  report?: Report | null
}>()

const isEditMode = computed(() => !!props.report)

const PLATFORM_OPTIONS = [
  'WhatsApp',
  'Instagram',
  'Facebook',
  'Telegram',
  'Phone call / SMS',
  'Dating app',
  'Email',
  'In person',
  'Other'
] as const

function buildForm(report?: Report | null): FormState {
  return {
    targetType: report?.targetType ?? 'bank_account',
    category: (report?.category as FormState['category']) ?? '',
    bankName: report?.bankName ?? '',
    accountName: report?.accountName ?? '',
    accountNumber: report?.accountNumber ?? '',
    companyName: report?.companyName ?? '',
    companyAddress: report?.companyAddress ?? '',
    websiteUrl: report?.websiteUrl ?? '',
    websiteName: report?.websiteName ?? '',
    phoneNumber: report?.phoneNumber ?? '',
    walletTag: report?.walletTag ?? '',
    reason: (report?.reason as FormState['reason']) ?? '',
    description: report?.description ?? '',
    amountInvolved: report?.amountInvolved != null ? String(report.amountInvolved) : '',
    contactPlatform: report?.contactPlatform ?? ''
  }
}

const form = reactive<FormState>(buildForm(props.report))

// Whether the current contactPlatform is a free-typed value (i.e. not one of
// the preset chips), so we know whether to show the "Other" text input.
const isCustomPlatform = computed(
  () => !!form.contactPlatform && !PLATFORM_OPTIONS.includes(form.contactPlatform as any)
)
const showCustomPlatformInput = ref(isCustomPlatform.value)

const evidencePreviews = ref<string[]>(
  props.report?.evidenceUrls ? [...props.report.evidenceUrls] : []
)

watch(
  () => props.report,
  (report) => {
    if (!report) return
    Object.assign(form, buildForm(report))
    showCustomPlatformInput.value = isCustomPlatform.value
    evidencePreviews.value = report.evidenceUrls ? [...report.evidenceUrls] : []
  }
)

function selectPlatform(value: (typeof PLATFORM_OPTIONS)[number]) {
  if (value === 'Other') {
    showCustomPlatformInput.value = true
    form.contactPlatform = ''
  } else {
    showCustomPlatformInput.value = false
    form.contactPlatform = value
  }
}

const showSuccessModal = ref(false)
const successReport = ref<Report | null>(null)

const isSubmitting = ref(false)
const errorMessage = ref('')
onMounted(() => {
  const route = useRoute()
  const q = route.query.category
  if (typeof q === 'string' && categoryOptions.some(o => o.value === q)) {
    form.category = q as ScamCategory
  }
})
const emit = defineEmits<{ submitted: [reportId: string] }>()

const MAX_IMAGES = 8
const MAX_SIZE_KB = 150

const STEPS = [
  { id: 'target', number: 1, label: 'Target', hint: 'What you\'re reporting' },
  { id: 'category', number: 2, label: 'Category', hint: 'Nigerian scam type' },
  { id: 'reason', number: 3, label: 'Reason', hint: 'Type of fraud' },
  { id: 'details', number: 4, label: 'Details', hint: 'Identifying info' },
  { id: 'story', number: 5, label: 'Story', hint: 'What happened' },
  { id: 'review', number: 6, label: 'Review', hint: 'Confirm & submit' }
] as const
type StepId = typeof STEPS[number]['id']
const currentStep = ref<StepId>('target')
const currentStepIndex = computed(() => STEPS.findIndex(s => s.id === currentStep.value))
const progressPercent = computed(() =>
  Math.round((currentStepIndex.value / (STEPS.length - 1)) * 100)
)

const targetOptions: { value: TargetType; label: string; hint: string }[] = [
  { value: 'bank_account', label: 'A bank account', hint: 'Account name, number, and bank' },
  { value: 'company', label: 'company', hint: 'Business name and registration details' },
  { value: 'website', label: 'website', hint: 'A URL or domain used to defraud people' }
]

const categoryOptions: { value: ScamCategory; label: string; hint: string }[] = [
  { value: 'fintech_ussd', label: 'Fintech & USSD exploit', hint: 'OPay/PalmPay/Moniepoint impersonation, SIM swap, USSD fraud' },
  { value: 'social_commerce', label: 'Social commerce scam', hint: 'Instagram/Twitter/TikTok vendor who took payment and vanished' },
  { value: 'visa_travel', label: 'Visa / travel logistics fraud', hint: 'Fake agent promising a Canada, UK, or other visa' },
  { value: 'job_ponzi', label: 'Job or Ponzi scheme', hint: 'Task-based app or investment platform promising daily returns' },
  { value: 'other', label: 'None of the above', hint: 'A different kind of fraud' }
]

function selectCategory(value: ScamCategory) {
  form.category = value
  goNext()
}

const reasonOptions: { value: FormState['reason']; label: string }[] = [
  { value: 'fake_transfer', label: 'Fake transfer / "sent by mistake" alert' },
  { value: 'romance_scam', label: 'Romance scam' },
  { value: 'job_scam', label: 'Fake job offer' },
  { value: 'investment_scam', label: 'Investment / "double your money" scam' },
  { value: 'other', label: 'Other fraud' }
]

function selectTarget(value: TargetType) {
  form.targetType = value
  goNext()
}

function selectReason(value: FormState['reason']) {
  form.reason = value
  goNext()
}

function goToStep(id: StepId) {
  const targetIndex = STEPS.findIndex(s => s.id === id)
  if (targetIndex <= currentStepIndex.value) {
    currentStep.value = id
  }
}

function goNext() {
  const idx = currentStepIndex.value
  if (idx < STEPS.length - 1) {
    currentStep.value = STEPS[idx + 1]!.id
  }
}

function goBack() {
  const idx = currentStepIndex.value
  if (idx > 0) {
    currentStep.value = STEPS[idx - 1]!.id
  }
}

function validateTargetFields(): string | null {
  if (form.targetType === 'bank_account') {
    if (!form.bankName || !form.accountName || !form.accountNumber) {
      return 'Please fill in the bank name, account name, and account number.'
    }
  }
  if (form.targetType === 'company') {
    if (!form.companyName) {
      return 'Please provide the company name.'
    }
  }
  if (form.targetType === 'website') {
    if (!form.websiteUrl) {
      return 'Please provide the website URL.'
    }
  }
  return null
}

function continueFromDetails() {
  errorMessage.value = ''
  const err = validateTargetFields()
  if (err) {
    errorMessage.value = err
    return
  }
  goNext()
}

function continueFromStory() {
  errorMessage.value = ''
  if (!form.description) {
    errorMessage.value = 'Please describe what happened.'
    return
  }
  if (form.amountInvolved && Number(form.amountInvolved) < 0) {
    errorMessage.value = 'Amount involved can\'t be negative.'
    return
  }
  goNext()
}

function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const files = input.files
  if (!files || files.length === 0) return

  errorMessage.value = ''

  const remainingSlots = MAX_IMAGES - evidencePreviews.value.length
  if (remainingSlots <= 0) {
    errorMessage.value = `You can attach up to ${MAX_IMAGES} images.`
    input.value = ''
    return
  }

  const filesToProcess = Array.from(files).slice(0, remainingSlots)

  for (const file of filesToProcess) {
    if (file.size > MAX_SIZE_KB * 1024) {
      errorMessage.value = `"${file.name}" is over ${MAX_SIZE_KB}KB and was skipped. Try a smaller screenshot.`
      continue
    }
    const reader = new FileReader()
    reader.onload = () => {
      evidencePreviews.value.push(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  input.value = ''
}

function removeEvidence(index: number) {
  evidencePreviews.value.splice(index, 1)
}

function resetForm() {
  Object.assign(form, buildForm(null))
  showCustomPlatformInput.value = false
  evidencePreviews.value = []
  currentStep.value = 'target'
}

const targetLabel = computed(() =>
  targetOptions.find(o => o.value === form.targetType)?.label ?? ''
)
const reasonLabel = computed(() =>
  reasonOptions.find(o => o.value === form.reason)?.label ?? ''
)
const formattedAmount = computed(() => {
  const n = Number(form.amountInvolved)
  if (!form.amountInvolved || Number.isNaN(n)) return ''
  return `₦${n.toLocaleString()}`
})

async function submitReport() {
  errorMessage.value = ''
  isSubmitting.value = true

  const body = {
    targetType: form.targetType,
    category: form.category || undefined,
    bankName: form.bankName || undefined,
    accountName: form.accountName || undefined,
    accountNumber: form.accountNumber || undefined,
    companyName: form.companyName || undefined,
    companyAddress: form.companyAddress || undefined,
    websiteUrl: form.websiteUrl || undefined,
    websiteName: form.websiteName || undefined,
    phoneNumber: form.phoneNumber || undefined,
    walletTag: form.walletTag || undefined,
    description: form.description,
    reason: form.reason,
    amountInvolved: form.amountInvolved ? Number(form.amountInvolved) : undefined,
    contactPlatform: form.contactPlatform || undefined,
    evidenceUrls: evidencePreviews.value.length ? evidencePreviews.value : undefined
  }

  try {
    if (isEditMode.value && props.report) {
      const updated = await $fetch<Report>(`/api/reports/${props.report.id}`, {
        method: 'PATCH' as any,
        body
      })
      emit('submitted', updated.id ?? props.report.id)
    } else {
      const report = await $fetch<Report>('/api/reports', {
        method: 'POST',
        body
      })

      try {
        const mine = JSON.parse(localStorage.getItem('myReportIds') || '[]')
        mine.push(report.id)
        localStorage.setItem('myReportIds', JSON.stringify(mine))
      } catch {
      }

      successReport.value = report
      showSuccessModal.value = true
    }
  } catch (err: any) {
    if (err?.statusCode === 429) {
      errorMessage.value = 'You\'ve submitted too many reports recently. Please try again in an hour.'
    } else {
      errorMessage.value = err?.data?.statusMessage || 'Something went wrong. Please try again.'
    }
  } finally {
    isSubmitting.value = false
  }
}

function finishSuccess() {
  showSuccessModal.value = false
  const id = successReport.value?.id
  resetForm()
  if (id) emit('submitted', id)
}
</script>

<template>
  <div class="report-form-container">

    <!-- ===================== EDIT MODE — sectioned single page ===================== -->
    <template v-if="isEditMode">
      <div class="edit-card">
        <div class="edit-card-header">
          <span class="dot" /> Edit report
        </div>
        <p class="subtitle">Update the details below — changes are public immediately after saving.</p>

        <form @submit.prevent="submitReport">

          <section class="section-block">
            <div class="section-heading">
              <span class="section-number">01</span>
              <div>
                <h3 class="section-title">What are you reporting</h3>
                <p class="section-desc">Choose the target type and the reason for this report.</p>
              </div>
            </div>

            <div class="form-group">
              <label>Target type *</label>
              <div class="type-tabs">
                <button
                  v-for="opt in targetOptions"
                  :key="opt.value"
                  type="button"
                  class="type-tab"
                  :class="{ active: form.targetType === opt.value }"
                  @click="form.targetType = opt.value"
                >
                  {{ opt.label }}
                </button>
              </div>
            </div>

            <div class="form-group">
              <label for="reason">Reason *</label>
              <select id="reason" v-model="form.reason" class="input" required>
                <option value="" disabled>Select a reason...</option>
                <option v-for="opt in reasonOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
              </select>
            </div>
          </section>

          <section class="section-block">
            <div class="section-heading">
              <span class="section-number">02</span>
              <div>
                <h3 class="section-title">Identifying details</h3>
                <p class="section-desc">The exact information people will search against.</p>
              </div>
            </div>

            <template v-if="form.targetType === 'bank_account'">
              <div class="field-grid">
                <div class="form-group">
                  <label for="bankName">Bank name *</label>
                  <input id="bankName" v-model="form.bankName" class="input" />
                </div>
                <div class="form-group">
                  <label for="accountName">Account name *</label>
                  <input id="accountName" v-model="form.accountName" class="input" />
                </div>
              </div>
              <div class="form-group">
                <label for="accountNumber">Account number *</label>
                <input id="accountNumber" v-model="form.accountNumber" class="input" />
              </div>
            </template>

            <template v-if="form.targetType === 'company'">
              <div class="form-group">
                <label for="companyName">Company name *</label>
                <input id="companyName" v-model="form.companyName" class="input" />
              </div>
              <div class="form-group">
                <label for="companyAddress">Company address / registration info (optional)</label>
                <input id="companyAddress" v-model="form.companyAddress" class="input" />
              </div>
            </template>

            <template v-if="form.targetType === 'website'">
              <div class="form-group">
                <label for="websiteUrl">Website URL *</label>
                <input id="websiteUrl" v-model="form.websiteUrl" class="input" placeholder="https://example.com" />
              </div>
              <div class="form-group">
                <label for="websiteName">Site name / what it claims to be (optional)</label>
                <input id="websiteName" v-model="form.websiteName" class="input" />
              </div>
            </template>

            <div class="field-grid">
              <div class="form-group">
                <label for="phoneNumber">Phone number used (optional)</label>
                <input id="phoneNumber" v-model="form.phoneNumber" class="input" placeholder="e.g. 08012345678" />
              </div>
              <div class="form-group">
                <label for="walletTag">Wallet / payment tag (optional)</label>
                <input id="walletTag" v-model="form.walletTag" class="input" placeholder="e.g. @quickcash, OPay tag" />
              </div>
            </div>
          </section>

          <section class="section-block">
            <div class="section-heading">
              <span class="section-number">03</span>
              <div>
                <h3 class="section-title">Your story</h3>
                <p class="section-desc">Context helps the next reader recognize the same pattern.</p>
              </div>
            </div>

            <div class="field-grid">
              <div class="form-group">
                <label for="amountInvolved">Amount involved (optional)</label>
                <div class="amount-input-wrap">
                  <span class="amount-prefix">₦</span>
                  <input
                    id="amountInvolved"
                    v-model="form.amountInvolved"
                    type="number"
                    min="0"
                    step="0.01"
                    inputmode="decimal"
                    class="input amount-input"
                    placeholder="Leave blank if no money changed hands"
                  />
                </div>
              </div>

              <div class="form-group">
                <label>Contact platform (optional)</label>
                <div class="platform-chips">
                  <button
                    v-for="opt in PLATFORM_OPTIONS"
                    :key="opt"
                    type="button"
                    class="platform-chip"
                    :class="{
                      active: opt === 'Other' ? showCustomPlatformInput : form.contactPlatform === opt
                    }"
                    @click="selectPlatform(opt)"
                  >
                    {{ opt }}
                  </button>
                </div>
                <input
                  v-if="showCustomPlatformInput"
                  v-model="form.contactPlatform"
                  class="input"
                  placeholder="Tell us where contact happened"
                  style="margin-top: 10px;"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="description">What happened? *</label>
              <textarea
                id="description"
                v-model="form.description"
                class="input textarea"
                placeholder="Provide context — what were you told, what happened, how you found out it was a scam"
                rows="6"
              />
            </div>
          </section>

          <section class="section-block section-block--last">
            <div class="section-heading">
              <span class="section-number">04</span>
              <div>
                <h3 class="section-title">Evidence</h3>
                <p class="section-desc">Optional, but screenshots make a report far more credible.</p>
              </div>
            </div>

            <div class="form-group">
              <div v-if="evidencePreviews.length < MAX_IMAGES" class="upload-box">
                <input id="evidence" type="file" accept="image/*" multiple class="file-input" @change="handleFileUpload" />
                <span class="upload-hint">
                  Click to attach screenshots — max {{ MAX_SIZE_KB }}KB each, {{ MAX_IMAGES - evidencePreviews.length }} slot(s) left
                </span>
              </div>
              <div v-if="evidencePreviews.length" class="preview-grid">
                <div v-for="(preview, index) in evidencePreviews" :key="index" class="preview-item">
                  <img :src="preview" alt="Evidence preview" class="preview-img" />
                  <button type="button" class="remove-btn" @click="removeEvidence(index)">✕</button>
                </div>
              </div>
            </div>
          </section>

          <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>

          <div class="edit-actions">
            <button type="submit" class="btn-submit" :disabled="isSubmitting">
              {{ isSubmitting ? 'Saving...' : 'Save changes' }}
            </button>
          </div>
        </form>
      </div>
    </template>

    <!-- ===================== CREATE MODE — rail + card wizard ===================== -->
    <template v-else>
      <div class="wizard-shell">

        <!-- Step rail — desktop -->
        <aside class="step-rail">
          <div
            v-for="(step, index) in STEPS"
            :key="step.id"
            class="rail-step"
            :class="{
              'rail-step--active': step.id === currentStep,
              'rail-step--done': index < currentStepIndex,
              'rail-step--clickable': index <= currentStepIndex
            }"
            @click="goToStep(step.id)"
          >
            <span class="rail-marker">
              <span v-if="index < currentStepIndex">✓</span>
              <span v-else>{{ step.number }}</span>
            </span>
            <span class="rail-line" v-if="index < STEPS.length - 1" />
            <div class="rail-text">
              <span class="rail-label">{{ step.label }}</span>
              <span class="rail-hint">{{ step.hint }}</span>
            </div>
          </div>
        </aside>

        <!-- Mobile progress bar -->
        <div class="progress-row">
          <span class="progress-label">Step {{ currentStepIndex + 1 }} of {{ STEPS.length }}</span>
          <div class="progress-track">
            <div class="progress-fill" :style="{ width: progressPercent + '%' }" />
          </div>
        </div>

        <!-- Step content card -->
        <div class="step-card">

          <!-- STEP 1 — target type -->
          <div v-if="currentStep === 'target'" class="step">
            <h2 class="step-title">What are you reporting?</h2>
            <p class="step-sub">Choose the option that's closest to what happened.</p>
            <div class="card-grid">
              <button
                v-for="opt in targetOptions"
                :key="opt.value"
                type="button"
                class="option-card"
                @click="selectTarget(opt.value)"
              >
                <span class="option-radio" />
                <div class="option-text">
                  <span class="option-label">{{ opt.label }}</span>
                  <span class="option-hint">{{ opt.hint }}</span>
                </div>
              </button>
            </div>
          </div>

          <!-- STEP 2 — Nigeria-specific category -->
<div v-else-if="currentStep === 'category'" class="step">
  <button type="button" class="back-link" @click="goBack">← Back</button>
  <h2 class="step-title">Which of these matches what happened?</h2>
  <p class="step-sub">This groups your report with similar scams so patterns are easier to spot.</p>
  <div class="card-grid">
    <button
      v-for="opt in categoryOptions"
      :key="opt.value"
      type="button"
      class="option-card"
      @click="selectCategory(opt.value)"
    >
      <span class="option-radio" />
      <div class="option-text">
        <span class="option-label">{{ opt.label }}</span>
        <span class="option-hint">{{ opt.hint }}</span>
      </div>
    </button>
  </div>
</div>

          <!-- STEP 3 — reason -->
          <div v-else-if="currentStep === 'reason'" class="step">
            <button type="button" class="back-link" @click="goBack">← Back</button>
            <h2 class="step-title">Why are you reporting this?</h2>
            <p class="step-sub">Pick the closest match — you'll be able to add details next.</p>
            <div class="card-grid">
              <button
                v-for="opt in reasonOptions"
                :key="opt.value"
                type="button"
                class="option-card"
                @click="selectReason(opt.value)"
              >
                <span class="option-radio" />
                <div class="option-text">
                  <span class="option-label">{{ opt.label }}</span>
                </div>
              </button>
            </div>
          </div>

          <!-- STEP 4 — target-specific details -->
          <div v-else-if="currentStep === 'details'" class="step">
            <button type="button" class="back-link" @click="goBack">← Back</button>
            <h2 class="step-title">Tell us about the {{ targetLabel.toLowerCase() }}</h2>
            <p class="step-sub">The more accurate this is, the more useful your report is to others.</p>

            <template v-if="form.targetType === 'bank_account'">
              <div class="field-grid">
                <div class="form-group">
                  <label for="bankName">Bank name *</label>
                  <input id="bankName" v-model="form.bankName" class="input" />
                </div>
                <div class="form-group">
                  <label for="accountName">Account name *</label>
                  <input id="accountName" v-model="form.accountName" class="input" />
                </div>
              </div>
              <div class="form-group">
                <label for="accountNumber">Account number *</label>
                <input id="accountNumber" v-model="form.accountNumber" class="input" />
              </div>
            </template>

            <template v-if="form.targetType === 'company'">
              <div class="form-group">
                <label for="companyName">Company name *</label>
                <input id="companyName" v-model="form.companyName" class="input" />
              </div>
              <div class="form-group">
                <label for="companyAddress">Company address / registration info (optional)</label>
                <input id="companyAddress" v-model="form.companyAddress" class="input" />
              </div>
            </template>

            <template v-if="form.targetType === 'website'">
              <div class="form-group">
                <label for="websiteUrl">Website URL *</label>
                <input id="websiteUrl" v-model="form.websiteUrl" class="input" placeholder="https://example.com" />
              </div>
              <div class="form-group">
                <label for="websiteName">Site name / what it claims to be (optional)</label>
                <input id="websiteName" v-model="form.websiteName" class="input" />
              </div>
            </template>

            <!-- Cross-identifiers: captured no matter which target type was
                 picked above, since these are often the detail that links
                 this scam to another report under a different account. -->
            <div class="field-grid">
              <div class="form-group">
                <label for="phoneNumberWizard">Phone number used (optional)</label>
                <input id="phoneNumberWizard" v-model="form.phoneNumber" class="input" placeholder="e.g. 08012345678" />
              </div>
              <div class="form-group">
                <label for="walletTagWizard">Wallet / payment tag (optional)</label>
                <input id="walletTagWizard" v-model="form.walletTag" class="input" placeholder="e.g. @quickcash, OPay tag" />
              </div>
            </div>

            <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>

            <div class="form-actions">
              <button type="button" class="btn-submit" @click="continueFromDetails">Continue →</button>
            </div>
          </div>

          <!-- STEP 5 — story + evidence -->
          <div v-else-if="currentStep === 'story'" class="step">
            <button type="button" class="back-link" @click="goBack">← Back</button>
            <h2 class="step-title">What happened?</h2>
            <p class="step-sub">Describe it in your own words. Include what tipped you off.</p>

            <div class="field-grid">
              <div class="form-group">
                <label for="amountInvolved">Amount involved (optional)</label>
                <div class="amount-input-wrap">
                  <span class="amount-prefix">₦</span>
                  <input
                    id="amountInvolved"
                    v-model="form.amountInvolved"
                    type="number"
                    min="0"
                    step="0.01"
                    inputmode="decimal"
                    class="input amount-input"
                    placeholder="Leave blank if no money changed hands"
                  />
                </div>
              </div>

              <div class="form-group">
                <label>Contact platform (optional)</label>
                <div class="platform-chips">
                  <button
                    v-for="opt in PLATFORM_OPTIONS"
                    :key="opt"
                    type="button"
                    class="platform-chip"
                    :class="{
                      active: opt === 'Other' ? showCustomPlatformInput : form.contactPlatform === opt
                    }"
                    @click="selectPlatform(opt)"
                  >
                    {{ opt }}
                  </button>
                </div>
                <input
                  v-if="showCustomPlatformInput"
                  v-model="form.contactPlatform"
                  class="input"
                  placeholder="Tell us where contact happened"
                  style="margin-top: 10px;"
                />
              </div>
            </div>

            <div class="form-group">
              <textarea
                v-model="form.description"
                class="input textarea"
                placeholder="What were you told, what happened, how you found out it was a scam..."
                rows="6"
              />
            </div>

            <div class="form-group">
              <label for="evidence">Evidence / screenshots (optional — up to {{ MAX_IMAGES }})</label>
              <div v-if="evidencePreviews.length < MAX_IMAGES" class="upload-box">
                <input id="evidence" type="file" accept="image/*" multiple class="file-input" @change="handleFileUpload" />
                <span class="upload-hint">
                  Click to attach screenshots — max {{ MAX_SIZE_KB }}KB each, {{ MAX_IMAGES - evidencePreviews.length }} slot(s) left
                </span>
              </div>
              <div v-if="evidencePreviews.length" class="preview-grid">
                <div v-for="(preview, index) in evidencePreviews" :key="index" class="preview-item">
                  <img :src="preview" alt="Evidence preview" class="preview-img" />
                  <button type="button" class="remove-btn" @click="removeEvidence(index)">✕</button>
                </div>
              </div>
            </div>

            <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>

            <div class="form-actions">
              <button type="button" class="btn-submit" @click="continueFromStory">Continue →</button>
            </div>
          </div>

          <!-- STEP 6 — review + submit -->
          <div v-else-if="currentStep === 'review'" class="step">
            <button type="button" class="back-link" @click="goBack">← Back</button>
            <h2 class="step-title">Review before you submit</h2>
            <p class="step-sub">Once submitted, this report is public immediately.</p>

            <div class="review-list">
              <div class="review-row">
                <span class="review-label">Reporting</span>
                <span class="review-value">{{ targetLabel }}</span>
              </div>
              <div class="review-row">
                <span class="review-label">Reason</span>
                <span class="review-value">{{ reasonLabel }}</span>
              </div>
              <div v-if="form.targetType === 'bank_account'" class="review-row">
                <span class="review-label">Bank details</span>
                <span class="review-value">{{ form.bankName }} · {{ form.accountName }} · {{ form.accountNumber }}</span>
              </div>
              <div v-if="form.targetType === 'company'" class="review-row">
                <span class="review-label">Company</span>
                <span class="review-value">{{ form.companyName }}</span>
              </div>
              <div v-if="form.targetType === 'website'" class="review-row">
                <span class="review-label">Website</span>
                <span class="review-value">{{ form.websiteUrl }}</span>
              </div>
              <div v-if="form.phoneNumber" class="review-row">
                <span class="review-label">Phone number</span>
                <span class="review-value">{{ form.phoneNumber }}</span>
              </div>
              <div v-if="form.walletTag" class="review-row">
                <span class="review-label">Wallet / payment tag</span>
                <span class="review-value">{{ form.walletTag }}</span>
              </div>
              <div v-if="formattedAmount" class="review-row">
                <span class="review-label">Amount involved</span>
                <span class="review-value">{{ formattedAmount }}</span>
              </div>
              <div v-if="form.contactPlatform" class="review-row">
                <span class="review-label">Contact platform</span>
                <span class="review-value">{{ form.contactPlatform }}</span>
              </div>
              <div class="review-row review-row--desc">
                <span class="review-label">What happened</span>
                <span class="review-value">{{ form.description }}</span>
              </div>
              <div v-if="evidencePreviews.length" class="review-row">
                <span class="review-label">Evidence</span>
                <span class="review-value">{{ evidencePreviews.length }} file(s) attached</span>
              </div>
            </div>

            <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>

            <div class="form-actions">
              <button type="button" class="btn-submit" :disabled="isSubmitting" @click="submitReport">
                {{ isSubmitting ? 'Submitting...' : 'Submit report' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <Teleport to="body">
 <div v-if="showSuccessModal" class="success-overlay">
  <div class="success-modal">
    <div class="success-icon">✓</div>
    <h3 class="success-title">Report submitted</h3>
    <p class="success-body">
      Thanks — this is now public and searchable. It could help someone else avoid the same thing.
    </p>
    <ShareableWarningCard
      v-if="successReport"
      :report="{ ...successReport, bankName: successReport.bankName || '', accountName: successReport.accountName || '', accountNumber: successReport.accountNumber || '' }"
    />
    <button type="button" class="btn-submit" @click="finishSuccess">
      View reports →
    </button>
  </div>
</div>
</Teleport>
  </div>
</template>

<style scoped>
.report-form-container {
  background: transparent;
  border: none;
  padding: 0;
}

/* ============ SHARED ============ */
.dot { width: 6px; height: 6px; background: var(--accent); border-radius: 50%; }

.form-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}
@media (max-width: 640px) {
  .field-grid { grid-template-columns: 1fr; }
}

label {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-3);
}

.type-tabs {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.type-tab {
  font-family: var(--mono);
  font-size: 12px;
  letter-spacing: 0.04em;
  background: var(--bg);
  color: var(--text-3);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 10px 18px;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
}
.type-tab:hover {
  border-color: var(--border-hi);
  color: var(--text-1);
}
.type-tab.active {
  background: var(--accent);
  border-color: var(--accent);
  color: #0a0a0b;
  font-weight: 600;
}

.input {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 14px 16px;
  color: var(--text-1);
  font-family: var(--sans);
  font-size: 15px;
  width: 100%;
}
.input:focus { outline: none; border-color: var(--accent-bdr); }
.textarea { resize: vertical; line-height: 1.6; }

select.input {
  appearance: none;
  cursor: pointer;
}

/* Amount input with ₦ prefix */
.amount-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.amount-prefix {
  position: absolute;
  left: 16px;
  font-family: var(--mono);
  font-size: 15px;
  color: var(--text-3);
  pointer-events: none;
}
.amount-input {
  padding-left: 34px;
}
.amount-input::-webkit-outer-spin-button,
.amount-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.amount-input[type='number'] {
  -moz-appearance: textfield;
}

/* Contact platform chips */
.platform-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.platform-chip {
  font-family: var(--mono);
  font-size: 11.5px;
  letter-spacing: 0.02em;
  background: var(--bg);
  color: var(--text-3);
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 9px 16px;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
}
.platform-chip:hover {
  border-color: var(--border-hi);
  color: var(--text-1);
}
.platform-chip.active {
  background: var(--accent);
  border-color: var(--accent);
  color: #0a0a0b;
  font-weight: 600;
}

.upload-box {
  position: relative;
  border: 1px dashed var(--border-hi);
  border-radius: var(--radius);
  padding: 26px;
  text-align: center;
  margin-bottom: 14px;
}
.file-input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}
.upload-hint {
  font-family: var(--mono);
  font-size: 12px;
  color: var(--text-3);
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 10px;
}
.preview-item {
  position: relative;
  border-radius: var(--radius);
  overflow: hidden;
  border: 1px solid var(--border-hi);
  aspect-ratio: 1;
}
.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.remove-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--mono);
  font-size: 11px;
  background: rgba(10,10,11,0.85);
  color: #f87171;
  border: 1px solid rgba(248,113,113,0.3);
  border-radius: 50%;
  cursor: pointer;
  padding: 0;
}

.error-text {
  font-family: var(--mono);
  font-size: 12px;
  color: #f87171;
  margin-bottom: 14px;
}

.btn-submit {
  background: var(--accent);
  color: #0a0a0b;
  font-weight: 600;
  font-family: var(--mono);
  font-size: 12.5px;
  letter-spacing: 0.06em;
  border: none;
  border-radius: var(--radius);
  padding: 16px 32px;
  cursor: pointer;
  min-height: 50px;
}
.btn-submit:hover { background: #d4eb3c; }
.btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

.back-link {
  background: none;
  border: none;
  color: var(--text-3);
  font-family: var(--mono);
  font-size: 12px;
  cursor: pointer;
  padding: 0;
  margin-bottom: 20px;
}
.back-link:hover { color: var(--text-1); }

/* ============ EDIT MODE ============ */
.edit-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 44px;
  max-width: 820px;
  margin: 0 auto;
}
@media (max-width: 640px) {
  .edit-card { padding: 24px; }
}

.edit-card-header {
  display: flex; align-items: center; gap: 8px;
  font-family: var(--mono); font-size: 11px; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--text-3);
  margin-bottom: 8px;
}
.subtitle {
  font-size: 14px;
  color: var(--text-3);
  font-weight: 300;
  margin-bottom: 32px;
}

.section-block {
  padding: 28px 0;
  border-bottom: 1px solid var(--border);
}
.section-block--last {
  border-bottom: none;
  padding-bottom: 0;
}

.section-heading {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 20px;
}
.section-number {
  font-family: var(--mono);
  font-size: 12px;
  color: var(--accent);
  border: 1px solid rgba(232,255,71,0.25);
  background: var(--accent-dim, rgba(232,255,71,0.08));
  border-radius: 4px;
  padding: 4px 8px;
  flex-shrink: 0;
  margin-top: 2px;
}
.section-title {
  font-family: var(--serif);
  font-size: 19px;
  color: var(--text-1);
  margin-bottom: 5px;
}
.section-desc {
  font-size: 13.5px;
  color: var(--text-3);
  font-weight: 300;
  line-height: 1.5;
}

.edit-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 28px;
  padding-top: 28px;
  border-top: 1px solid var(--border);
}

/* ============ CREATE MODE — WIZARD SHELL ============ */
.wizard-shell {
  display: flex;
  flex-direction: column;
  gap: 32px;
  max-width: 100%;   /* let the card use full available width */
  width: 100%;
  margin: 0 auto;
}

@media (max-width: 900px) {   /* was 760px */
  .wizard-shell {
    grid-template-columns: 1fr;
    gap: 0;
    max-width: 100%;
  }
}

@media (max-width: 900px) {
  .step-rail { display: none; }
}
@media (max-width: 900px) {
  .progress-row { display: flex; }
}

.rail-step {
  flex-direction: column;      
  align-items: center;
  text-align: center;
  gap: 8px;
  padding-bottom: 0;
  flex: 1;
  min-width: 100px;
}

.rail-step--clickable { cursor: pointer; }
.rail-step:last-child { padding-bottom: 0; }

.rail-marker {
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  border-radius: 50%;
  border: 1px solid var(--border-hi);
  background: var(--bg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--mono);
  font-size: 12px;
  color: var(--text-3);
  z-index: 1;
  transition: border-color 0.2s, background 0.2s, color 0.2s;
}
.rail-step--active .rail-marker {
  border-color: var(--accent);
  background: var(--accent);
  color: #0a0a0b;
  font-weight: 700;
}
.rail-step--done .rail-marker {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--accent-dim, rgba(232,255,71,0.08));
}

.rail-line {
  display: none;  
}

.rail-step--done .rail-line {
  background: var(--accent);
  opacity: 0.4;
}

.rail-text {
  padding-top: 0;
  align-items: center;
}

.rail-label {
  font-family: var(--mono);
  font-size: 13px;
  letter-spacing: 0.03em;
  color: var(--text-2);
}
.rail-step--active .rail-label {
  color: var(--text-1);
  font-weight: 600;
}
.rail-hint {
  display: none;   /* keep the horizontal strip compact — hint text can crowd it */
}

/* Mobile progress bar */
.progress-row {
  display: none;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 24px;
  padding: 0 4px;
}
@media (max-width: 760px) {
  .progress-row { display: flex; }
}
.progress-label {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-3);
}
.progress-track {
  height: 7px;
  background: var(--surface-2, var(--border));
  border-radius: 999px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: var(--accent);
  border-radius: 999px;
  transition: width 0.3s ease;
}

/* Step content card */
.step-card {
  order: 1;
  width: 100%;
}

.step-rail {
  order: 2;
  display: flex;              /* was: flex-direction: column */
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24px;
  padding-top: 0;
  position: static;           /* drop sticky, it doesn't make sense below content */
}

@media (max-width: 640px) {
  .step-card { padding: 26px 22px; min-height: 0; }
}

.step {
  animation: step-in 0.25s ease;
}
@keyframes step-in {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

.step-title {
  font-family: var(--serif);
  font-size: 27px;
  color: var(--text-1);
  margin-bottom: 10px;
  line-height: 1.25;
}
@media (max-width: 640px) {
  .step-title { font-size: 23px; }
}
.step-sub {
  font-size: 14.5px;
  color: var(--text-3);
  font-weight: 300;
  margin-bottom: 30px;
  line-height: 1.5;
}

/* Option cards */
.card-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-card {
  display: flex;
  align-items: center;
  gap: 16px;
  text-align: left;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px 22px;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}
.option-card:hover {
  border-color: var(--accent-bdr, var(--accent));
  background: var(--accent-dim, rgba(232,255,71,0.06));
}
.option-radio {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid var(--text-3);
  flex-shrink: 0;
}
.option-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.option-label {
  font-size: 15.5px;
  color: var(--text-1);
  line-height: 1.4;
}
.option-hint {
  font-size: 12.5px;
  color: var(--text-3);
  font-weight: 300;
}

.form-actions {
  display: flex;
  justify-content: flex-start;
  margin-top: 10px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
}

/* Review step */
.review-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-bottom: 24px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
}
.review-row {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  background: var(--bg);
}
.review-row:last-child { border-bottom: none; }
.review-row--desc {
  flex-direction: column;
  gap: 8px;
}
.review-label {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-3);
  flex-shrink: 0;
}
.review-value {
  font-size: 14px;
  color: var(--text-1);
  text-align: right;
}
.review-row--desc .review-value {
  text-align: left;
  line-height: 1.65;
  font-weight: 300;
}

@media (max-width: 640px) {
  .step-rail { display: none; }
  .progress-row { display: flex; }
}
@media (min-width: 641px) {
  .progress-row { display: none; }
}

.success-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 10, 11, 0.75);
  z-index: 300;
  padding: 20px;
  display: flex;
  align-items: flex-start;   /* was: center — flex-start avoids the clip-with-no-scroll bug */
  justify-content: center;
  overflow-y: auto;          /* was missing — this is what actually lets it scroll */
}

.success-modal {
  background: var(--surface);
  border: 1px solid var(--border-hi);
  border-radius: var(--radius);
  padding: 36px 32px;
  max-width: 380px;   /* mobile default stays narrow */
  width: 100%;
  text-align: center;
  margin: auto 20;
}

@media (min-width: 640px) {
  .success-modal {
    max-width: 780px;   /* a bit more breathing room on desktop, not a big jump */
    padding: 10px 70px;
  }
}

.success-icon {
  width: 52px;
  height: 52px;
  margin: 0 auto 18px;
  border-radius: 50%;
  background: rgba(74, 222, 128, 0.1);
  border: 1px solid rgba(74, 222, 128, 0.3);
  color: #4ade80;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.success-title {
  font-family: var(--serif);
  font-size: 20px;
  color: var(--text-1);
  margin-bottom: 10px;
}
.success-body {
  font-size: 13.5px;
  color: var(--text-3);
  line-height: 1.6;
  font-weight: 300;
  margin-bottom: 22px;
}
</style>