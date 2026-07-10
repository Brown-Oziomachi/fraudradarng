<script setup lang="ts">
import { computed, ref } from 'vue'
import type { WizardAnswer, WizardQuestion, WizardResult } from '~/types/community'

const REPORT_FORM_ROUTE = '/report/form'

const questions: WizardQuestion[] = [
  {
    id: 'unsolicited-contact',
    order: 1,
    prompt: 'Did this person or company approach you out of nowhere via Telegram, WhatsApp, or Instagram?',
    helperText: 'Cold DMs, unsolicited "investment opportunities" or job offers count.',
  },
  {
    id: 'upfront-payment',
    order: 2,
    prompt: 'Are they asking you to pay money upfront before you can unlock a larger withdrawal, clear a package, or finalize a job?',
    helperText: 'Legitimate platforms never require payment to release your own funds.',
  },
  {
    id: 'personal-wallet',
    order: 3,
    prompt: 'Is the destination account they provided a personal digital wallet/fintech number instead of a verified corporate bank account?',
    helperText: 'Real businesses settle to registered corporate accounts, not personal OPay/PalmPay tags.',
  },
]

const answers = ref<Record<string, WizardAnswer | null>>({
  'unsolicited-contact': null,
  'upfront-payment': null,
  'personal-wallet': null,
})

const currentStep = ref(0)
const isComplete = computed(() => currentStep.value >= questions.length)
const activeQuestion = computed(() => questions[currentStep.value])

function answer(value: WizardAnswer) {
  if (activeQuestion.value) {
    answers.value[activeQuestion.value.id] = value
  }
  currentStep.value += 1
}

function goBack() {
  if (currentStep.value === 0) return
  currentStep.value -= 1
}

function restart() {
  currentStep.value = 0
  answers.value = {
    'unsolicited-contact': null,
    'upfront-payment': null,
    'personal-wallet': null,
  }
}

const yesCount = computed(
  () => Object.values(answers.value).filter((a) => a === 'yes').length
)

const result = computed<WizardResult>(() => {
  const count = yesCount.value
  if (count >= 2) {
    return {
      yesCount: count,
      verdict: 'high-risk',
      headline: 'Consistent with a known scam pattern',
      message:
        'Two or more classic fraud signals are present. Do not send money or personal details. File a report so the community is warned before anyone else is targeted.',
    }
  }
  if (count === 1) {
    return {
      yesCount: count,
      verdict: 'caution',
      headline: 'One signal flagged — verify before proceeding',
      message:
        'Confirm the person or business independently, through official channels, not links they sent you, before taking any action.',
    }
  }
  return {
    yesCount: count,
    verdict: 'low-risk',
    headline: 'No major fraud indicators found',
    message:
      'Nothing here matches common scam patterns. Still confirm any unfamiliar account before sending money.',
  }
})

const verdictLabel = computed(() => {
  if (result.value.verdict === 'high-risk') return 'HIGH RISK'
  if (result.value.verdict === 'caution') return 'CAUTION'
  return 'LOW RISK'
})
</script>

<template>
  <section class="wizard-section">
    <header class="wizard-header">
      <div class="eyebrow">
        <span class="pulse" />
        <span class="eyebrow-text">Diagnostic Tool</span>
      </div>
      <h2 class="wizard-title">Am I Being Scammed?</h2>
      <p class="wizard-subtitle">
        Run a three-point scan on the situation. Nothing you enter here is stored or transmitted.
      </p>
    </header>

    <div class="wizard-card">
      <div class="scan-header">
        <span class="scan-label">Scan progress</span>
        <span class="scan-count">{{ Math.min(currentStep, questions.length) }} / {{ questions.length }}</span>
      </div>

      <div class="progress-row">
        <div
          v-for="(q, i) in questions"
          :key="q.id"
          class="progress-segment"
          :class="{
            'segment-done': i < currentStep || isComplete,
            'segment-active': i === currentStep && !isComplete,
          }"
        />
      </div>

      <div v-if="!isComplete && activeQuestion" :key="activeQuestion.id" class="question-block">
        <p class="step-label">Check {{ String(activeQuestion.order).padStart(2, '0') }}</p>
        <h3 class="question-prompt">{{ activeQuestion.prompt }}</h3>
        <p v-if="activeQuestion.helperText" class="question-helper">{{ activeQuestion.helperText }}</p>

        <div class="answer-row">
          <button type="button" class="answer-btn answer-yes" @click="answer('yes')">
            Yes
          </button>
          <button type="button" class="answer-btn answer-no" @click="answer('no')">
            No
          </button>
        </div>

        <button v-if="currentStep > 0" type="button" class="back-btn" @click="goBack">← Previous check</button>
      </div>

      <div v-else class="verdict-block">
        <div class="reticle" :class="`reticle-${result.verdict}`">
          <span class="reticle-scan-ring" />
          <span class="reticle-ring reticle-ring-outer" />
          <span class="reticle-ring reticle-ring-inner" />
          <span class="reticle-crosshair reticle-crosshair-v" />
          <span class="reticle-crosshair reticle-crosshair-h" />
          <span class="reticle-tick tick-tl" />
          <span class="reticle-tick tick-tr" />
          <span class="reticle-tick tick-bl" />
          <span class="reticle-tick tick-br" />
          <div class="reticle-center">
            <span class="reticle-label">{{ verdictLabel }}</span>
            <span class="reticle-sub">{{ result.yesCount }}/3 signals</span>
          </div>
        </div>

        <div class="verdict-text">
          <h3 class="verdict-headline">{{ result.headline }}</h3>
          <p class="verdict-message">{{ result.message }}</p>
        </div>

        <NuxtLink v-if="result.verdict === 'high-risk'" :to="REPORT_FORM_ROUTE" class="report-btn">
          Report to FRNG
        </NuxtLink>

        <button type="button" class="restart-btn" @click="restart">Run another check</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.wizard-section {
  width: 100%;
}

.wizard-header {
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

.wizard-title {
  font-family: var(--serif);
  font-size: 2rem;
  font-weight: 400;
  color: var(--text-1);
  letter-spacing: -0.01em;
}

.wizard-subtitle {
  max-width: 38rem;
  font-size: 0.9375rem;
  line-height: 1.55;
  color: var(--text-2);
}

.wizard-card {
  max-width: 30rem;
  border-radius: 2px;
  border: 1px solid var(--border);
  background: var(--surface);
  padding: 1.75rem;
}

.scan-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.625rem;
  font-family: var(--mono);
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-3);
}

.progress-row {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-bottom: 1.75rem;
}

.progress-segment {
  height: 3px;
  flex: 1;
  background: var(--border);
  transition: background 0.3s ease;
}

.segment-active {
  background: var(--text-2);
}

.segment-done {
  background: var(--accent);
}

.step-label {
  margin-bottom: 0.625rem;
  font-family: var(--mono);
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--accent);
}

.question-prompt {
  margin-bottom: 0.5rem;
  font-family: var(--serif);
  font-size: 1.3125rem;
  font-weight: 400;
  line-height: 1.4;
  color: var(--text-1);
}

.question-helper {
  margin-bottom: 1.75rem;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--text-3);
}

.answer-row {
  display: flex;
  gap: 0.75rem;
}

.answer-btn {
  flex: 1;
  border-radius: 2px;
  padding: 0.8rem;
  font-family: var(--mono);
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
  border: 1px solid;
  background: transparent;
}

.answer-yes {
  border-color: rgba(255, 59, 48, 0.4);
  color: #ff6b60;
}

.answer-yes:hover {
  background: rgba(255, 59, 48, 0.08);
}

.answer-no {
  border-color: var(--accent-bdr);
  color: var(--accent);
}

.answer-no:hover {
  background: var(--accent-dim);
}

.back-btn {
  margin-top: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--mono);
  font-size: 0.75rem;
  color: var(--text-3);
  padding: 0;
}

.back-btn:hover {
  color: var(--text-2);
}

/* ---------- Verdict: target-lock reticle ---------- */

.verdict-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  text-align: center;
}

.reticle {
  position: relative;
  width: 152px;
  height: 152px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.reticle-scan-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px dashed currentColor;
  opacity: 0.35;
  animation: reticle-spin 6s linear infinite;
}

.reticle-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid currentColor;
}

.reticle-ring-outer {
  inset: 10px;
  opacity: 0.5;
}

.reticle-ring-inner {
  inset: 34px;
  opacity: 0.8;
}

.reticle-crosshair {
  position: absolute;
  background: currentColor;
  opacity: 0.4;
}

.reticle-crosshair-v {
  top: 0;
  bottom: 0;
  left: 50%;
  width: 1px;
  transform: translateX(-50%);
}

.reticle-crosshair-h {
  left: 0;
  right: 0;
  top: 50%;
  height: 1px;
  transform: translateY(-50%);
}

.reticle-tick {
  position: absolute;
  width: 7px;
  height: 7px;
  border: 1px solid currentColor;
}

.tick-tl { top: -1px; left: -1px; border-right: none; border-bottom: none; }
.tick-tr { top: -1px; right: -1px; border-left: none; border-bottom: none; }
.tick-bl { bottom: -1px; left: -1px; border-right: none; border-top: none; }
.tick-br { bottom: -1px; right: -1px; border-left: none; border-top: none; }

.reticle-center {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.125rem;
}

.reticle-label {
  font-family: var(--mono);
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.06em;
}

.reticle-sub {
  font-family: var(--mono);
  font-size: 0.625rem;
  letter-spacing: 0.06em;
  opacity: 0.75;
}

.reticle-high-risk { color: #ff3b30; }
.reticle-caution { color: #ffb020; }
.reticle-low-risk { color: var(--accent); }

@keyframes reticle-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.verdict-text {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.verdict-headline {
  font-family: var(--serif);
  font-size: 1.3125rem;
  font-weight: 400;
  color: var(--text-1);
}

.verdict-message {
  font-size: 0.875rem;
  line-height: 1.55;
  color: var(--text-2);
}

.report-btn {
  display: block;
  width: 100%;
  border-radius: 2px;
  background: #ff3b30;
  padding: 0.8rem;
  text-align: center;
  font-family: var(--mono);
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #ffffff;
  text-decoration: none;
  transition: background 0.15s ease;
}

.report-btn:hover {
  background: #ff544a;
}

.restart-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--mono);
  font-size: 0.75rem;
  color: var(--text-3);
  padding: 0;
}

.restart-btn:hover {
  color: var(--text-2);
}

@media (prefers-reduced-motion: reduce) {
  .reticle-scan-ring {
    animation: none;
  }
}
</style>