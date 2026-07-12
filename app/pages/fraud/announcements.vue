<script setup lang="ts">
/**
 * pages/admin/announcements.vue
 * Publish / hide the site-wide announcement bar.
 * Writes to Firestore doc: siteSettings/announcement
 *
 * ⚠️ This page has no auth guard yet. Wrap it with your admin middleware, e.g.:
 * definePageMeta({ middleware: 'admin' })
 */

import { ref, onMounted, onUnmounted } from 'vue'
import { initializeApp, getApps } from 'firebase/app'
import { doc, getFirestore, onSnapshot, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { useRuntimeConfig } from '#imports'

const config = useRuntimeConfig()
const firebaseApp = getApps().length
  ? getApps()[0]!
  : initializeApp({
      apiKey: config.public.firebaseApiKey,
      authDomain: config.public.firebaseAuthDomain,
      projectId: config.public.firebaseProjectId,
      storageBucket: config.public.firebaseStorageBucket,
      appId: config.public.firebaseAppId
    })
const db = getFirestore(firebaseApp)

definePageMeta({ middleware: 'admin-only', hideFooter: true })

useHead({ title: 'Announcement Bar — FRNG Admin' })

const current = ref<any>(null)
const loading = ref(true)
const saving = ref(false)

const message = ref('')
const label = ref('NOTICE')
const linkUrl = ref('')
const linkText = ref('')
const bgColor = ref('#0d1b12')
const textColor = ref('#e8ff47')
const active = ref(true)

const PRESET_LABELS = ['NOTICE', 'NEW', 'UPDATE', 'ALERT', 'ADVISORY', 'PARTNER']
const BG_SWATCHES = ['#0d1b12', '#12331f', '#1a1a1a', '#3a1414', '#0d2244']
const TEXT_SWATCHES = ['#e8ff47', '#ffffff', '#fbbf24', '#86efac', '#f5f0e8']

let unsub: (() => void) | null = null

onMounted(() => {
  const announcementRef = doc(db, 'siteSettings', 'announcement')
  unsub = onSnapshot(announcementRef, (snap) => {
    if (snap.exists()) {
      const data = snap.data()
      current.value = data
      message.value = data.message || ''
      label.value = data.label || 'NOTICE'
      linkUrl.value = data.linkUrl || ''
      linkText.value = data.linkText || ''
      bgColor.value = data.bgColor || '#0d1b12'
      textColor.value = data.textColor || '#e8ff47'
      active.value = data.active !== false
    }
    loading.value = false
  })
})

onUnmounted(() => unsub?.())

async function handleSave() {
  if (!message.value.trim()) {
    alert('Message cannot be empty')
    return
  }
  saving.value = true
  try {
    await setDoc(doc(db, 'siteSettings', 'announcement'), {
      message: message.value.trim(),
      label: (label.value.trim() || 'NOTICE').toUpperCase(),
      linkUrl: linkUrl.value.trim(),
      linkText: linkText.value.trim(),
      bgColor: bgColor.value,
      textColor: textColor.value,
      active: active.value,
      updatedAt: serverTimestamp(),
      // updatedBy: wire this to your admin auth/user state
    })
    alert('✅ Announcement published!')
  } catch (e: any) {
    alert('❌ Failed: ' + e.message)
  } finally {
    saving.value = false
  }
}

async function handleDeactivate() {
  if (!confirm('Hide the announcement bar from the site?')) return
  try {
    await updateDoc(doc(db, 'siteSettings', 'announcement'), { active: false })
  } catch (e: any) {
    alert('Failed: ' + e.message)
  }
}
</script>

<template>
  <div class="announce-admin">
    <div class="header">
      <h1>Announcement Bar</h1>
      <p class="sub">Publish a scrolling message across the top of every FRNG page.</p>
    </div>

    <div v-if="loading" class="loading">Loading…</div>

    <template v-else>
      <!-- Live preview -->
      <div class="preview-block">
        <div class="preview-label">Live Preview</div>
        <div class="preview-bar" :style="{ background: bgColor, opacity: active ? 1 : 0.4 }">
          <span class="preview-tag">
            <span class="preview-dot" />
            {{ label || 'NOTICE' }}
          </span>
          <span class="preview-text" :style="{ color: textColor }">
            {{ message || 'Your announcement text will appear here…' }}
            <span v-if="linkUrl" class="preview-link">{{ linkText || 'Learn more →' }}</span>
          </span>
        </div>
        <div v-if="!active" class="preview-hidden-note">
          ⚠ Announcement is currently hidden from the site
        </div>
      </div>

      <!-- Form -->
      <div class="form-card">
        <div class="field">
          <label for="message">Announcement Message *</label>
          <textarea
            id="message"
            v-model="message"
            rows="3"
            placeholder="e.g. New scam pattern flagged in Lagos — check the latest guide before you send money."
          ></textarea>
          <div class="hint">Scrolls across the top of every page. Keep it under 150 characters.</div>
        </div>

        <div class="field">
          <label>Label Badge</label>
          <div class="preset-row">
            <button
              v-for="l in PRESET_LABELS"
              :key="l"
              type="button"
              class="preset-btn"
              :class="{ active: label === l }"
              @click="label = l"
            >
              {{ l }}
            </button>
            <input
              v-model="label"
              maxlength="10"
              placeholder="CUSTOM"
              class="preset-input"
              @input="label = label.toUpperCase()"
            />
          </div>
        </div>

        <div class="field-row">
          <div class="field">
            <label for="linkUrl">Link URL (optional)</label>
            <input id="linkUrl" v-model="linkUrl" placeholder="/guides/verify-before-you-pay" />
          </div>
          <div class="field">
            <label for="linkText">Link Text (optional)</label>
            <input id="linkText" v-model="linkText" placeholder="Read the guide →" />
          </div>
        </div>

        <div class="field-row">
          <div class="field">
            <label>Bar Background</label>
            <div class="color-row">
              <input v-model="bgColor" type="color" class="color-swatch-input" />
              <input v-model="bgColor" class="color-text" />
            </div>
            <div class="swatch-row">
              <button
                v-for="c in BG_SWATCHES"
                :key="c"
                type="button"
                class="swatch"
                :style="{ background: c, borderColor: bgColor === c ? '#fff' : 'transparent' }"
                @click="bgColor = c"
              />
            </div>
          </div>
          <div class="field">
            <label>Text Color</label>
            <div class="color-row">
              <input v-model="textColor" type="color" class="color-swatch-input" />
              <input v-model="textColor" class="color-text" />
            </div>
            <div class="swatch-row">
              <button
                v-for="c in TEXT_SWATCHES"
                :key="c"
                type="button"
                class="swatch"
                :style="{ background: c, borderColor: textColor === c ? '#fff' : 'transparent' }"
                @click="textColor = c"
              />
            </div>
          </div>
        </div>

        <div class="toggle-row">
          <button type="button" class="toggle" :class="{ on: active }" @click="active = !active">
            <span class="toggle-knob" />
          </button>
          <div>
            <div class="toggle-title">{{ active ? 'Visible on site' : 'Hidden from site' }}</div>
            <div class="toggle-sub">Toggle to show or hide the announcement bar</div>
          </div>
        </div>

        <div class="actions">
          <button class="btn-primary" type="button" :disabled="saving" @click="handleSave">
            {{ saving ? 'Publishing…' : '📢 Publish Announcement' }}
          </button>
          <button v-if="current?.active" class="btn-danger" type="button" @click="handleDeactivate">
            Hide Bar
          </button>
        </div>
      </div>

      <div v-if="current" class="meta-note">
        Last published {{ current.updatedAt?.toDate?.()?.toLocaleString?.() || '' }}
      </div>
    </template>
  </div>
</template>

<style scoped>
.announce-admin {
  max-width: 720px;
  margin: 0 auto;
  padding: 48px 24px 80px;
  color: var(--text-1);
}

.header h1 {
  font-family: var(--serif);
  font-size: 1.8rem;
  margin-bottom: 0.4rem;
}

.sub {
  color: var(--text-2);
  font-size: 0.9rem;
  margin-bottom: 2rem;
}

.loading {
  color: var(--text-2);
  padding: 3rem 0;
  text-align: center;
}

/* ---------- Preview ---------- */
.preview-block {
  margin-bottom: 2rem;
}

.preview-label {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-3);
  margin-bottom: 10px;
}

.preview-bar {
  border-radius: 8px;
  overflow: hidden;
  height: 34px;
  display: flex;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.preview-tag {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--accent);
  color: #0b0d08;
  font-family: var(--mono);
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 3px 10px;
  margin: 0 16px;
  border-radius: 3px;
}

.preview-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #0b0d08;
  display: inline-block;
}

.preview-text {
  font-family: var(--mono);
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.preview-link {
  color: var(--accent);
  font-weight: 700;
  margin-left: 12px;
}

.preview-hidden-note {
  font-size: 11px;
  color: var(--text-3);
  margin-top: 6px;
  font-style: italic;
}

/* ---------- Form ---------- */
.form-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 560px) {
  .field-row {
    grid-template-columns: 1fr;
  }
}

label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-3);
}

input[type='text'],
input:not([type]),
textarea {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: calc(var(--radius) - 2px);
  color: var(--text-1);
  padding: 0.6rem 0.75rem;
  font-size: 0.9rem;
  font-family: inherit;
  width: 100%;
}

textarea {
  resize: vertical;
  line-height: 1.6;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(232, 255, 71, 0.15);
}

.hint {
  font-size: 10.5px;
  color: var(--text-3);
}

.preset-row {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.preset-btn {
  padding: 5px 12px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  cursor: pointer;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--bg);
  color: var(--text-2);
  transition: 0.15s ease;
}

.preset-btn.active {
  background: var(--accent);
  color: #0b0d08;
  border-color: var(--accent);
}

.preset-input {
  width: 100px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 5px 10px;
}

.color-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.color-swatch-input {
  width: 36px;
  height: 36px;
  padding: 0;
  cursor: pointer;
  border: none;
  background: none;
  border-radius: 4px;
}

.color-text {
  flex: 1;
  font-family: var(--mono);
}

.swatch-row {
  display: flex;
  gap: 6px;
  margin-top: 6px;
}

.swatch {
  width: 22px;
  height: 22px;
  border-radius: 4px;
  border: 2px solid transparent;
  cursor: pointer;
}

.toggle-row {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 12px 14px;
}

.toggle {
  width: 44px;
  height: 24px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  background: var(--border);
  position: relative;
  transition: background 0.2s ease;
  flex-shrink: 0;
  padding: 0;
}

.toggle.on {
  background: #34d399;
}

.toggle-knob {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  display: block;
  transition: left 0.2s ease;
}

.toggle.on .toggle-knob {
  left: 23px;
}

.toggle-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-1);
}

.toggle-sub {
  font-size: 11px;
  color: var(--text-3);
}

.actions {
  display: flex;
  gap: 10px;
}

.btn-primary {
  flex: 1;
  background: var(--accent);
  color: #0b0d08;
  border: none;
  border-radius: var(--radius);
  padding: 0.75rem;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-danger {
  background: rgba(239, 68, 68, 0.12);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: var(--radius);
  padding: 0.75rem 1.25rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
}

.meta-note {
  margin-top: 1rem;
  font-size: 11px;
  color: var(--text-3);
  text-align: center;
}
</style>