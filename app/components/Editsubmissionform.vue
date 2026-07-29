<script setup lang="ts">
interface OwnSubmission {
  submissionId: string
  description: string
  amountInvolved?: number | null
  contactPlatform?: string
  evidenceUrls?: string[]
}

const props = defineProps<{
  reportId: string
  submissionId: string
  submission: OwnSubmission
}>()

const emit = defineEmits<{ submitted: [reportId: string] }>()

const description = ref(props.submission.description ?? '')
const amountInvolved = ref(props.submission.amountInvolved != null ? String(props.submission.amountInvolved) : '')
const contactPlatform = ref(props.submission.contactPlatform ?? '')
const evidencePreviews = ref<string[]>(props.submission.evidenceUrls ? [...props.submission.evidenceUrls] : [])

const MAX_IMAGES = 8
const MAX_SIZE_KB = 150

const isSubmitting = ref(false)
const errorMessage = ref('')

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

async function submitEdit() {
  errorMessage.value = ''
  if (!description.value.trim()) {
    errorMessage.value = 'Please describe what happened.'
    return
  }

  isSubmitting.value = true
  try {
    const updated = await $fetch<{ id: string }>(`/api/reports/${props.reportId}`, {
      method: 'PATCH' as any,
      body: {
        submissionId: props.submissionId,
        description: description.value,
        amountInvolved: amountInvolved.value ? Number(amountInvolved.value) : undefined,
        contactPlatform: contactPlatform.value || undefined,
        evidenceUrls: evidencePreviews.value.length ? evidencePreviews.value : undefined
      }
    })
    emit('submitted', updated.id ?? props.reportId)
  } catch (err: any) {
    if (err?.statusCode === 403) {
      errorMessage.value = "You can only edit your own submission."
    } else {
      errorMessage.value = err?.data?.statusMessage || 'Something went wrong. Please try again.'
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="esf-card">
    <div class="esf-header">
      <span class="dot" /> Edit your submission
    </div>
    <p class="esf-subtitle">
      You're only editing your own contribution to this report — the shared account/company/website
      details were provided by the original reporter and aren't editable here.
    </p>

    <form @submit.prevent="submitEdit">
      <div class="form-group">
        <label for="description">What happened? *</label>
        <textarea
          id="description"
          v-model="description"
          class="input textarea"
          rows="6"
        />
      </div>

      <div class="field-grid">
        <div class="form-group">
          <label for="amountInvolved">Amount involved (optional)</label>
          <div class="amount-input-wrap">
            <span class="amount-prefix">₦</span>
            <input
              id="amountInvolved"
              v-model="amountInvolved"
              type="number"
              min="0"
              step="0.01"
              class="input amount-input"
            />
          </div>
        </div>
        <div class="form-group">
          <label for="contactPlatform">Contact platform (optional)</label>
          <input id="contactPlatform" v-model="contactPlatform" class="input" placeholder="e.g. WhatsApp" />
        </div>
      </div>

      <div class="form-group">
        <label>Evidence ({{ evidencePreviews.length }}/{{ MAX_IMAGES }})</label>
        <div v-if="evidencePreviews.length < MAX_IMAGES" class="upload-box">
          <input type="file" accept="image/*" multiple class="file-input" @change="handleFileUpload" />
          <span class="upload-hint">Click to attach screenshots — max {{ MAX_SIZE_KB }}KB each</span>
        </div>
        <div v-if="evidencePreviews.length" class="preview-grid">
          <div v-for="(preview, index) in evidencePreviews" :key="index" class="preview-item">
            <img :src="preview" alt="Evidence preview" class="preview-img" />
            <button type="button" class="remove-btn" @click="removeEvidence(index)">✕</button>
          </div>
        </div>
      </div>

      <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>

      <div class="esf-actions">
        <button type="submit" class="btn-submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Saving...' : 'Save changes' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.esf-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius, 8px);
  padding: 36px;
}

.esf-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-3);
  margin-bottom: 8px;
}

.dot {
  width: 6px;
  height: 6px;
  background: var(--accent);
  border-radius: 50%;
}

.esf-subtitle {
  font-size: 13.5px;
  color: var(--text-3);
  font-weight: 300;
  line-height: 1.6;
  margin-bottom: 28px;
}

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

@media (max-width: 560px) {
  .field-grid {
    grid-template-columns: 1fr;
  }
}

label {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-3);
}

.input {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius, 8px);
  padding: 14px 16px;
  color: var(--text-1);
  font-family: var(--sans);
  font-size: 15px;
  width: 100%;
}

.input:focus {
  outline: none;
  border-color: var(--accent-bdr, var(--accent));
}

.textarea {
  resize: vertical;
  line-height: 1.6;
}

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

.upload-box {
  position: relative;
  border: 1px dashed var(--border-hi);
  border-radius: var(--radius, 8px);
  padding: 22px;
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
  border-radius: var(--radius, 8px);
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
  background: rgba(10, 10, 11, 0.85);
  color: #f87171;
  border: 1px solid rgba(248, 113, 113, 0.3);
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

.esf-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
  padding-top: 20px;
  border-top: 1px solid var(--border);
}

.btn-submit {
  background: var(--accent);
  color: #0a0a0b;
  font-weight: 600;
  font-family: var(--mono);
  font-size: 12.5px;
  letter-spacing: 0.06em;
  border: none;
  border-radius: var(--radius, 8px);
  padding: 14px 28px;
  cursor: pointer;
}

.btn-submit:hover {
  background: #d4eb3c;
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>