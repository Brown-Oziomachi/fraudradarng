<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { HardeningGroup, HardeningState } from '~/types/community'

const STORAGE_KEY = 'frng_hardening_state_v1'

const groups: HardeningGroup[] = [
  {
    id: 'ussd',
    title: 'USSD Security',
    icon: 'signal',
    tasks: [
      {
        id: 'ussd-mtn-pin',
        groupId: 'ussd',
        label: 'MTN line locked with a USSD PIN',
        description: 'Prevents anyone with a stolen/swapped SIM from dialing your bank USSD codes.',
        actionHint: 'Dial *901*911# on MTN to set your USSD PIN.',
        weight: 1,
      },
      {
        id: 'ussd-airtel-pin',
        groupId: 'ussd',
        label: 'Airtel line locked with a USSD PIN',
        description: 'Blocks unauthorized balance checks and transfers via USSD.',
        actionHint: 'Dial *326*911# on Airtel to set your USSD PIN.',
        weight: 1,
      },
      {
        id: 'ussd-glo-pin',
        groupId: 'ussd',
        label: 'Glo line locked with a USSD PIN',
        description: 'Adds a PIN layer before any USSD banking code can be run.',
        actionHint: 'Contact your bank to enable USSD PIN protection for Glo lines.',
        weight: 1,
      },
    ],
  },
  {
    id: 'fintech',
    title: 'Fintech Isolation',
    icon: 'wallet',
    tasks: [
      {
        id: 'fintech-opay-limit',
        groupId: 'fintech',
        label: 'Daily transaction limit set on OPay',
        description: 'Caps how much a thief can move even if they unlock your phone.',
        actionHint: 'OPay app -> Settings -> Security -> Transaction Limit.',
        weight: 1,
      },
      {
        id: 'fintech-palmpay-limit',
        groupId: 'fintech',
        label: 'Daily transaction limit set on PalmPay',
        description: 'Reduces device-theft exposure by limiting single-session transfers.',
        actionHint: 'PalmPay app -> Me -> Security Center -> Transaction Limit.',
        weight: 1,
      },
      {
        id: 'fintech-moniepoint-limit',
        groupId: 'fintech',
        label: 'Daily transaction limit set on Moniepoint',
        description: 'Keeps large sums out of reach for a single unauthorized session.',
        actionHint: 'Moniepoint app -> Settings -> Limits -> set a conservative daily cap.',
        weight: 1,
      },
      {
        id: 'fintech-app-lock',
        groupId: 'fintech',
        label: 'Biometric/PIN app-lock enabled on all wallet apps',
        description: 'Stops anyone who unlocks your phone from opening your wallets directly.',
        actionHint: "Enable fingerprint/Face ID lock in each app's security settings.",
        weight: 1,
      },
    ],
  },
  {
    id: 'social',
    title: 'Social Takeover Protection',
    icon: 'shield',
    tasks: [
      {
        id: 'social-whatsapp-2fa',
        groupId: 'social',
        label: 'WhatsApp two-step verification enabled',
        description: 'Stops attackers from hijacking your number onto a new device.',
        actionHint: 'WhatsApp -> Settings -> Account -> Two-step verification.',
        weight: 1.5,
      },
      {
        id: 'social-email-recovery',
        groupId: 'social',
        label: 'Recovery email added to WhatsApp 2FA',
        description: 'Lets you reset your 2FA PIN if you ever forget it — closes a common bypass.',
        actionHint: 'Add and confirm an email address under two-step verification.',
        weight: 1,
      },
      {
        id: 'social-ig-2fa',
        groupId: 'social',
        label: 'Instagram/Facebook two-factor authentication enabled',
        description: 'Protects the accounts scammers most often clone to run fake-vendor scams.',
        actionHint: 'Settings -> Accounts Center -> Password and Security -> 2FA.',
        weight: 1,
      },
    ],
  },
]

const allTasks = groups.flatMap((g) => g.tasks)
const totalWeight = allTasks.reduce((sum, t) => sum + t.weight, 0)

const completed = ref<Set<string>>(new Set())
const hydrated = ref(false)

onMounted(() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed: HardeningState = JSON.parse(raw)
      completed.value = new Set(parsed.completedTaskIds)
    }
  } catch {
    // corrupt or missing state — start fresh
  } finally {
    hydrated.value = true
  }
})

function persist() {
  const state: HardeningState = {
    completedTaskIds: Array.from(completed.value),
    updatedAt: new Date().toISOString(),
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function toggleTask(id: string) {
  if (completed.value.has(id)) {
    completed.value.delete(id)
  } else {
    completed.value.add(id)
  }
  completed.value = new Set(completed.value)
  persist()
}

const score = computed(() => {
  const earned = allTasks
    .filter((t) => completed.value.has(t.id))
    .reduce((sum, t) => sum + t.weight, 0)
  return Math.round((earned / totalWeight) * 100)
})

const displayScore = computed(() => (hydrated.value ? score.value : 0))

const scoreStatus = computed(() => {
  if (displayScore.value === 100) return { label: 'Hardened', class: 'status-hardened' }
  if (displayScore.value >= 60) return { label: 'Improving', class: 'status-improving' }
  return { label: 'Exposed', class: 'status-exposed' }
})

// ---- Radar geometry ----
const CENTER = 60
const OUTER_R = 54
const RANGE_RINGS = [18, 32, 46, 54]

const CIRCUMFERENCE = 2 * Math.PI * OUTER_R
const dashOffset = computed(() => CIRCUMFERENCE * (1 - displayScore.value / 100))

// One blip per task, plotted around the radar face at its own angle.
const blips = computed(() =>
  allTasks.map((task, i) => {
    const angle = (i / allTasks.length) * Math.PI * 2 - Math.PI / 2
    const r = 46
    return {
      id: task.id,
      label: task.label,
      done: completed.value.has(task.id),
      x: CENTER + r * Math.cos(angle),
      y: CENTER + r * Math.sin(angle),
    }
  })
)

function groupStatus(group: HardeningGroup) {
  const done = group.tasks.filter((t) => completed.value.has(t.id)).length
  const total = group.tasks.length
  if (done === total) return { text: 'ARMED', class: 'module-armed', done, total }
  if (done === 0) return { text: 'EXPOSED', class: 'module-exposed', done, total }
  return { text: 'PARTIAL', class: 'module-partial', done, total }
}

const icons: Record<string, string> = {
  signal: 'M2 20h.01M7 20v-4M12 20v-8M17 20v-12M22 20V4',
  wallet: 'M3 7a2 2 0 012-2h11a2 2 0 012 2v1h1a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z M16 13h.01',
  shield: 'M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z',
}
</script>

<template>
  <section class="hardening">
    <header class="hardening-header">
      <div class="eyebrow">
        <span class="pulse" />
        <span class="eyebrow-text">Self-Audit Console</span>
      </div>
      <h2 class="hardening-title">Account Hardening Radar</h2>
      <p class="hardening-subtitle">
        Every safeguard you arm shows up as a blip on the scope. Nothing here leaves this device —
        no account, no server record, just your own exposure map.
      </p>
    </header>

    <div class="score-panel">
      <div class="radar-wrap">
        <div class="radar-sweep" :class="scoreStatus.class" />

        <svg viewBox="0 0 120 120" class="radar">
          <circle
            v-for="ring in RANGE_RINGS"
            :key="ring"
            :cx="CENTER"
            :cy="CENTER"
            :r="ring"
            class="range-ring"
          />
          <line :x1="CENTER" :y1="6" :x2="CENTER" :y2="114" class="crosshair" />
          <line :x1="6" :y1="CENTER" :x2="114" :y2="CENTER" class="crosshair" />

          <circle
            :cx="CENTER"
            :cy="CENTER"
            :r="OUTER_R"
            class="gauge-fill"
            :class="scoreStatus.class"
            :style="{ strokeDasharray: CIRCUMFERENCE, strokeDashoffset: dashOffset }"
          />

          <circle
            v-for="blip in blips"
            :key="blip.id"
            :cx="blip.x"
            :cy="blip.y"
            r="3.2"
            class="blip"
            :class="blip.done ? 'blip-armed' : 'blip-exposed'"
          >
            <title>{{ blip.label }}</title>
          </circle>
        </svg>

        <div class="radar-center">
          <span class="radar-value">{{ displayScore }}</span>
          <span class="radar-percent">%</span>
        </div>
      </div>

      <div class="score-detail">
        <p class="score-caption">Exposure scan result</p>
        <p class="score-status" :class="scoreStatus.class">{{ scoreStatus.label }}</p>
        <p class="score-count">{{ completed.size }} of {{ allTasks.length }} safeguards armed</p>
        <div class="module-strip">
          <span
            v-for="group in groups"
            :key="group.id"
            class="module-tag"
            :class="groupStatus(group).class"
          >
            {{ group.title }} — {{ groupStatus(group).done }}/{{ groupStatus(group).total }}
          </span>
        </div>
      </div>
    </div>

    <div class="group-grid">
      <div v-for="group in groups" :key="group.id" class="module-card">
        <span class="corner corner-tl" />
        <span class="corner corner-tr" />
        <span class="corner corner-bl" />
        <span class="corner corner-br" />

        <div class="module-header">
          <div class="module-title-row">
            <svg class="module-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path :d="icons[group.icon]" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <h3 class="module-title">{{ group.title }}</h3>
          </div>
          <span class="module-badge" :class="groupStatus(group).class">{{ groupStatus(group).text }}</span>
        </div>

        <ul class="task-list">
          <li v-for="task in group.tasks" :key="task.id">
            <label class="task" :class="{ 'task-active': completed.has(task.id) }">
              <span class="toggle" :class="{ 'toggle-on': completed.has(task.id) }">
                <input
                  type="checkbox"
                  class="toggle-input"
                  :checked="completed.has(task.id)"
                  @change="toggleTask(task.id)"
                />
                <span class="toggle-knob" />
              </span>
              <span class="task-content">
                <span class="task-label">{{ task.label }}</span>
                <span class="task-description">{{ task.description }}</span>
                <span class="task-hint">{{ task.actionHint }}</span>
              </span>
            </label>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hardening {
  width: 100%;
}

.hardening-header {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin-bottom: 2rem;
}

.eyebrow {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pulse {
  position: relative;
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: var(--accent);
}

.pulse::after {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 999px;
  border: 1px solid var(--accent);
  animation: pulse-ring 2.2s ease-out infinite;
}

@keyframes pulse-ring {
  0% { transform: scale(0.6); opacity: 0.8; }
  100% { transform: scale(2.2); opacity: 0; }
}

.eyebrow-text {
  font-family: var(--mono);
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--text-2);
}

.hardening-title {
  font-family: var(--serif);
  font-size: 2rem;
  font-weight: 400;
  color: var(--text-1);
  letter-spacing: -0.01em;
}

.hardening-subtitle {
  max-width: 38rem;
  font-size: 0.9375rem;
  line-height: 1.55;
  color: var(--text-2);
}

/* ---------- Score panel / radar ---------- */

.score-panel {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1.75rem;
  border: 1px solid var(--border);
  border-radius: 2px;
  background: var(--surface);
}

.radar-wrap {
  position: relative;
  width: 132px;
  height: 132px;
  flex-shrink: 0;
  border-radius: 50%;
}

.radar-sweep {
  position: absolute;
  inset: 6px;
  border-radius: 50%;
  overflow: hidden;
  background: conic-gradient(from 0deg, transparent 0deg, var(--accent-dim) 26deg, transparent 70deg);
  animation: sweep-rotate 4.5s linear infinite;
  opacity: 0.9;
}

.radar-sweep.status-improving { background: conic-gradient(from 0deg, transparent 0deg, rgba(255, 176, 32, 0.28) 26deg, transparent 70deg); }
.radar-sweep.status-exposed { background: conic-gradient(from 0deg, transparent 0deg, rgba(255, 59, 48, 0.28) 26deg, transparent 70deg); }

@keyframes sweep-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.radar {
  position: relative;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.range-ring {
  fill: none;
  stroke: var(--border);
  stroke-width: 0.75;
  stroke-dasharray: 1.5 2.5;
}

.crosshair {
  stroke: var(--border);
  stroke-width: 0.5;
  opacity: 0.6;
}

.gauge-fill {
  fill: none;
  stroke-width: 3.5;
  stroke-linecap: butt;
  transition: stroke-dashoffset 0.6s ease-out, stroke 0.3s ease;
}

.gauge-fill.status-hardened { stroke: var(--accent); filter: drop-shadow(0 0 6px var(--accent-bdr)); }
.gauge-fill.status-improving { stroke: #ffb020; }
.gauge-fill.status-exposed { stroke: #ff3b30; }

.blip {
  transition: fill 0.25s ease;
}

.blip-armed {
  fill: var(--accent);
  filter: drop-shadow(0 0 3px var(--accent-bdr));
}

.blip-exposed {
  fill: var(--text-3);
  opacity: 0.55;
}

.radar-center {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.125rem;
  pointer-events: none;
}

.radar-value {
  font-family: var(--serif);
  font-size: 2.125rem;
  color: var(--text-1);
}

.radar-percent {
  font-family: var(--mono);
  font-size: 0.875rem;
  color: var(--text-3);
}

.score-detail {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 220px;
  flex: 1;
}

.score-caption {
  font-family: var(--mono);
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-3);
}

.score-status {
  font-family: var(--serif);
  font-size: 1.375rem;
}

.score-status.status-hardened { color: var(--accent); }
.score-status.status-improving { color: #ffb020; }
.score-status.status-exposed { color: #ff6b60; }

.score-count {
  font-size: 0.8125rem;
  color: var(--text-2);
  margin-bottom: 0.75rem;
}

.module-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.module-tag {
  font-family: var(--mono);
  font-size: 0.625rem;
  letter-spacing: 0.02em;
  padding: 0.2rem 0.5rem;
  border-radius: 2px;
  border: 1px solid var(--border);
  color: var(--text-3);
}

.module-tag.module-armed { border-color: var(--accent-bdr); color: var(--accent); }
.module-tag.module-partial { border-color: rgba(255, 176, 32, 0.35); color: #ffb020; }
.module-tag.module-exposed { border-color: rgba(255, 59, 48, 0.35); color: #ff6b60; }

/* ---------- Module cards ---------- */

.group-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .group-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.module-card {
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 2px;
  border: 1px solid var(--border);
  background: var(--surface);
}

.corner {
  position: absolute;
  width: 9px;
  height: 9px;
  border: 1px solid var(--accent-bdr);
  opacity: 0.7;
  pointer-events: none;
}

.corner-tl { top: -1px; left: -1px; border-right: none; border-bottom: none; }
.corner-tr { top: -1px; right: -1px; border-left: none; border-bottom: none; }
.corner-bl { bottom: -1px; left: -1px; border-right: none; border-top: none; }
.corner-br { bottom: -1px; right: -1px; border-left: none; border-top: none; }

.module-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1rem;
  border-bottom: 1px solid var(--border);
}

.module-title-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.module-icon {
  width: 14px;
  height: 14px;
  color: var(--text-3);
}

.module-title {
  font-family: var(--mono);
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-1);
}

.module-badge {
  font-family: var(--mono);
  font-size: 0.5625rem;
  letter-spacing: 0.08em;
  padding: 0.125rem 0.4rem;
  border-radius: 2px;
  border: 1px solid var(--border);
  color: var(--text-3);
}

.module-badge.module-armed { border-color: var(--accent-bdr); color: var(--accent); }
.module-badge.module-partial { border-color: rgba(255, 176, 32, 0.35); color: #ffb020; }
.module-badge.module-exposed { border-color: rgba(255, 59, 48, 0.35); color: #ff6b60; }

.task-list {
  display: flex;
  flex-direction: column;
  list-style: none;
}

.task {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.875rem 1rem;
  border-bottom: 1px solid var(--border);
  transition: background 0.15s ease;
}

.task:last-child {
  border-bottom: none;
}

.task:hover {
  background: var(--surface-2);
}

.toggle {
  position: relative;
  flex-shrink: 0;
  width: 30px;
  height: 17px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--bg);
  margin-top: 0.125rem;
  transition: border-color 0.15s ease, background 0.15s ease;
}

.toggle-on {
  border-color: var(--accent-bdr);
  background: var(--accent-dim);
}

.toggle-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  margin: 0;
  cursor: pointer;
}

.toggle-knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 11px;
  height: 11px;
  border-radius: 999px;
  background: var(--text-3);
  transition: transform 0.15s ease, background 0.15s ease;
}

.toggle-on .toggle-knob {
  transform: translateX(13px);
  background: var(--accent);
}

.task-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.task-label {
  font-size: 0.8125rem;
  line-height: 1.4;
  color: var(--text-1);
}

.task-active .task-label {
  color: var(--text-2);
}

.task-description {
  font-size: 0.75rem;
  line-height: 1.4;
  color: var(--text-3);
}

.task-hint {
  margin-top: 0.125rem;
  font-family: var(--mono);
  font-size: 0.6875rem;
  color: var(--accent);
}

@media (prefers-reduced-motion: reduce) {
  .radar-sweep {
    animation: none;
  }
}
</style>