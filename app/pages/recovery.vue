<script setup lang="ts">
useHead({ title: 'Naira Recovery Pipeline — Fraud Radar NG' })

const STEPS = [
  { id: 'details', number: 1, label: 'Details', hint: 'What happened' },
  { id: 'letter', number: 2, label: 'Freeze letter', hint: 'Generate & send' },
  { id: 'police', number: 3, label: 'Police report', hint: 'Get it filed' },
  { id: 'court', number: 4, label: 'Court order', hint: 'Long-term lock' },
  { id: 'agencies', number: 5, label: 'Agencies', hint: 'Where to submit' }
] as const
type StepId = typeof STEPS[number]['id']
const currentStep = ref<StepId>('details')
const currentIndex = computed(() => STEPS.findIndex(s => s.id === currentStep.value))

function goToStep(id: StepId) {
  currentStep.value = id
}
function nextStep() {
  const i = currentIndex.value
  if (i < STEPS.length - 1) currentStep.value = STEPS[i + 1]!.id
}
function prevStep() {
  const i = currentIndex.value
  if (i > 0) currentStep.value = STEPS[i - 1]!.id
}

// ===================== FORM STATE =====================
const form = reactive({
  victimName: '',
  victimAccountNumber: '',
  victimBankName: '',
  suspectBankName: '',
  suspectAccountName: '',
  suspectAccountNumber: '',
  amount: '',
  transactionDate: '',
  transactionRef: '',
  description: ''
})

const errorMessage = ref('')

function validateAndContinue() {
  errorMessage.value = ''
  if (!form.victimName || !form.victimBankName || !form.suspectBankName ||
      !form.suspectAccountNumber || !form.amount || !form.transactionDate) {
    errorMessage.value = 'Please fill in your name, your bank, the suspect account details, the amount, and the transaction date — these are what the letter needs.'
    return
  }
  nextStep()
}

function formatAmount(val: string) {
  const n = Number(val)
  if (!val || Number.isNaN(n)) return val
  return n.toLocaleString('en-NG')
}

const today = computed(() => new Date().toLocaleDateString('en-NG', {
  day: 'numeric', month: 'long', year: 'numeric'
}))

const reportLinkSuffix = ref('')

// ===================== LETTER GENERATION =====================
const letterTemplate = computed(() => {
  return `Date: ${today.value}

The Branch Manager / Fraud Desk,
${form.victimBankName || '[Your Bank Name]'}

Subject: URGENT REQUEST FOR POST-NO-DEBIT (PND) RESTRICTION ON A SUSPECT ACCOUNT — FRAUD COMPLAINT

Dear Sir/Madam,

I, ${form.victimName || '[Your Full Name]'}, am a customer of your bank holding account number ${form.victimAccountNumber || '[Your Account Number]'}. I am writing to formally report that I was defrauded and to request your urgent assistance in accordance with the CBN Circular on the Establishment of Fraud Desks (2015), which empowers banks to place a Post-No-Debit restriction on an account upon receipt of a fraud complaint.

Details of the fraudulent transaction:

  Amount involved: ₦${formatAmount(form.amount) || '[Amount]'}
  Date of transaction: ${form.transactionDate || '[Date]'}
  Transaction reference / session ID: ${form.transactionRef || '[Reference number, if available]'}
  Receiving bank: ${form.suspectBankName || '[Suspect\u2019s Bank Name]'}
  Receiving account name: ${form.suspectAccountName || '[Suspect\u2019s Account Name, if known]'}
  Receiving account number: ${form.suspectAccountNumber || '[Suspect\u2019s Account Number]'}

What happened:
${form.description || '[Briefly describe how the fraud occurred — e.g. fake transfer alert, romance scam, investment scam, impersonation, etc.]'}

I respectfully request that you:

1. Immediately notify ${form.suspectBankName || 'the receiving bank'} of this fraud complaint and request that a Post-No-Debit restriction be placed on the account stated above, to prevent further dissipation of funds.
2. Provide me with a reference or tracking number for this complaint.
3. Advise me on any additional documentation required to support a formal fraud dispute and potential reversal.
I am also filing a report with the Nigeria Police Force and/or the Economic and Financial Crimes Commission (EFCC), and have documented this incident publicly on Fraud Radar NG (fraudradar.ng${reportLinkSuffix.value}) to warn others against the same account. I am prepared to provide any further evidence, including transaction alerts and correspondence with the suspect, to support this request.
I would appreciate your urgent attention to this matter, as delays significantly reduce the likelihood of recovering the funds.

Thank you for your cooperation.

Yours faithfully,

${form.victimName || '[Your Full Name]'}
Phone: [Your phone number]
Account Number: ${form.victimAccountNumber || '[Your Account Number]'}`
})

const route = useRoute()

onMounted(() => {
  const q = route.query
  if (typeof q.bank === 'string') form.suspectBankName = q.bank
  if (typeof q.accountName === 'string') form.suspectAccountName = q.accountName
  if (typeof q.accountNumber === 'string') form.suspectAccountNumber = q.accountNumber
  if (typeof q.amount === 'string') form.amount = q.amount
})

const editableLetter = ref('')

const hasEditedLetter = ref(false)

watch(letterTemplate, (val) => {

  if (!hasEditedLetter.value) editableLetter.value = val
}, { immediate: true })

function onLetterInput() {
  hasEditedLetter.value = true
}
function resetLetterToTemplate() {
  editableLetter.value = letterTemplate.value
  hasEditedLetter.value = false
}

const copyStatus = ref('')
async function copyLetter() {
  try {
    await navigator.clipboard.writeText(editableLetter.value)
    copyStatus.value = 'Copied to clipboard'
  } catch {
    copyStatus.value = 'Could not copy — please select and copy manually'
  }
  setTimeout(() => (copyStatus.value = ''), 2500)
}

function downloadLetter() {
  const blob = new Blob([editableLetter.value], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `freeze-request-letter-${form.victimName.replace(/\s+/g, '_') || 'draft'}.txt`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

// ===================== POLICE REPORT CHECKLIST =====================
const policeChecklist = [
  'A valid means of ID (National ID, voter\u2019s card, driver\u2019s license, or international passport)',
  'Your bank account statement showing the disputed transaction',
  'Screenshots of any alerts, chats, or messages connected to the fraud',
  'The suspect\u2019s account details (bank name, account name, account number) if known',
  'A written, dated statement describing exactly what happened, in your own words',
  'The reference number from your bank\u2019s fraud desk, if you\u2019ve already contacted them'
]

// ===================== COURT ORDER GUIDANCE =====================
const courtSteps = [
  {
    title: 'Understand what a PND already covers',
    body: 'Once your bank places a Post-No-Debit restriction, the account is typically frozen for an initial period while the bank investigates — this does not need a court order. If the receiving bank cooperates quickly, this alone can stop the funds from being withdrawn.'
  },
  {
    title: 'Know when a court order becomes necessary',
    body: 'A PND from the bank, or a short temporary restriction from EFCC, is not indefinite. If the case needs the funds locked for a longer period — through investigation, prosecution, or dispute resolution — a Magistrate or High Court order is generally required to keep the restriction in place long-term or to compel a fintech/tier-3 platform to maintain it.'
  },
  {
    title: 'Who applies for the order',
    body: 'In practice, this is almost always done through the Police (via the DPO or Legal Department) or the EFCC, who apply to the court — often ex parte — for a restraining or freezing order once they have opened an investigation. Individual victims typically do not apply directly; a lawyer can also assist you in petitioning the court or pressing the investigating agency to do so.'
  },
  {
    title: 'What you can do to help this move faster',
    body: 'Provide the police or EFCC with your PND reference number, transaction evidence, and a clear written statement. Politely but persistently follow up — ask for the name of the investigating officer and a case number, and check in every few days rather than waiting passively.'
  }
]

// ===================== AGENCY DIRECTORY =====================
const agencies = [
  {
    name: 'CBN Consumer Protection Department',
    shortName: 'CBN',
    role: 'For when your bank fails to resolve a fraud dispute, reversal request, or PND-related complaint within a reasonable time (the CBN\u2019s guideline is generally two weeks after you\u2019ve first escalated to your bank).',
    phone: '0700 225 5226',
    email: 'cpd@cbn.gov.ng',
    website: 'https://www.cbn.gov.ng/supervision/cpdcomgt.html'
  },
  {
    name: 'Federal Competition and Consumer Protection Commission',
    shortName: 'FCCPC',
    role: 'For vendor, product, or service scams — fake goods, undelivered orders, predatory digital lenders — rather than a direct bank account fraud.',
    phone: '0805 600 2020 · 0805 600 3030',
    email: 'contact@fccpc.gov.ng',
    website: 'https://complaints.fccpc.gov.ng'
  },
  {
    name: 'EFCC — Economic and Financial Crimes Commission',
    shortName: 'EFCC',
    role: 'For financial crime with an identifiable suspect or receiving account — fake transfers, investment scams, advance fee fraud.',
    phone: '+234 809 332 2644',
    email: 'info@efcc.gov.ng',
    website: 'https://efcc.gov.ng'
  },
  {
    name: 'Nigeria Police Force — National Cybercrime Centre',
    shortName: 'NPF-NCCC',
    role: 'For filing the official police report needed to support a freeze request, dispute, or eventual court order.',
    phone: '+234 707 848 9293',
    email: 'support@nccc.npf.gov.ng',
    website: 'https://nccc.npf.gov.ng/ereport'
  }
]
</script>

<template>
  <div class="recovery-page">

    <!-- ===================== HERO ===================== -->
    <section class="hero">
      <p class="hero-eyebrow"><span class="dot" /> Naira Recovery Pipeline</p>
      <h1 class="hero-title">Turn "I've been scammed" into a paper trail that actually moves.</h1>
      <p class="hero-sub">
        A step-by-step tool to generate your bank freeze-request letter, understand
        what a police report and court order each actually do, and find the right
        agency to escalate to.
      </p>

      <div class="disclaimer-box">
        <strong>This is a starting template, not legal advice.</strong>
        Fraud Radar NG is not a law firm, bank, or government agency. Processes and
        contact details can change — always confirm the current requirements with
        your bank, the police, or a lawyer before relying on this.
      </div>
    </section>

    <!-- ===================== STEP RAIL ===================== -->
    <div class="rail-row">
      <button
        v-for="(step, i) in STEPS"
        :key="step.id"
        type="button"
        class="rail-pill"
        :class="{
          'rail-pill--active': step.id === currentStep,
          'rail-pill--done': i < currentIndex
        }"
        @click="goToStep(step.id)"
      >
        <span class="rail-pill-num">{{ i < currentIndex ? '✓' : step.number }}</span>
        <span class="rail-pill-text">
          <span class="rail-pill-label">{{ step.label }}</span>
          <span class="rail-pill-hint">{{ step.hint }}</span>
        </span>
      </button>
    </div>

    <!-- ===================== STEP CONTENT ===================== -->
    <div class="step-card">

      <!-- STEP 1: DETAILS -->
      <div v-if="currentStep === 'details'" class="step">
        <h2 class="step-heading">Tell us what happened</h2>
        <p class="step-sub">These details go straight into your freeze-request letter in the next step.</p>

        <div class="field-grid">
          <div class="form-group">
            <label>Your full name *</label>
            <input v-model="form.victimName" class="input" placeholder="e.g. Chukwuemeka Okafor" />
          </div>
          <div class="form-group">
            <label>Your bank *</label>
            <input v-model="form.victimBankName" class="input" placeholder="e.g. GTBank" />
          </div>
        </div>

        <div class="form-group">
          <label>Your account number</label>
          <input v-model="form.victimAccountNumber" class="input" placeholder="0123456789" />
        </div>

        <div class="section-divider">Where the money went</div>

        <div class="field-grid">
          <div class="form-group">
            <label>Suspect's bank *</label>
            <input v-model="form.suspectBankName" class="input" placeholder="e.g. OPay" />
          </div>
          <div class="form-group">
            <label>Suspect's account name</label>
            <input v-model="form.suspectAccountName" class="input" placeholder="Name on the account" />
          </div>
        </div>

        <div class="form-group">
          <label>Suspect's account number *</label>
          <input v-model="form.suspectAccountNumber" class="input" placeholder="0123456789" />
        </div>

        <div class="field-grid">
          <div class="form-group">
            <label>Amount involved (₦) *</label>
            <input v-model="form.amount" type="number" class="input" placeholder="150000" />
          </div>
          <div class="form-group">
            <label>Date of transaction *</label>
            <input v-model="form.transactionDate" type="date" class="input" />
          </div>
        </div>

        <div class="form-group">
          <label>Transaction reference / session ID (optional)</label>
          <input v-model="form.transactionRef" class="input" placeholder="From your alert or statement" />
        </div>

        <div class="form-group">
          <label>Briefly, what happened?</label>
          <textarea
            v-model="form.description"
            class="input textarea"
            rows="4"
            placeholder="e.g. Was told to pay for a job onboarding fee, contact stopped responding after payment..."
          />
        </div>

        <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>

        <div class="step-actions">
          <button type="button" class="btn-primary" @click="validateAndContinue">
            Generate my letter →
          </button>
        </div>
      </div>

      <!-- STEP 2: LETTER -->
      <div v-else-if="currentStep === 'letter'" class="step">
        <h2 class="step-heading">Your bank freeze-request letter</h2>
        <p class="step-sub">
          Edit anything below, then copy or download it to send to your bank's
          fraud desk — by email, in branch, or through their app's support channel.
        </p>

        <textarea
          v-model="editableLetter"
          class="input letter-textarea"
          rows="22"
          @input="onLetterInput"
        />

        <div class="letter-actions">
          <button type="button" class="btn-primary" @click="copyLetter">Copy letter</button>
          <button type="button" class="btn-secondary" @click="downloadLetter">Download as .txt</button>
          <button v-if="hasEditedLetter" type="button" class="btn-ghost" @click="resetLetterToTemplate">
            Reset to generated version
          </button>
          <span v-if="copyStatus" class="copy-status">{{ copyStatus }}</span>
        </div>

        <div class="tip-box">
          Send this to your bank's official fraud email or hotline — never a number
          given to you by the suspect. Ask for a written acknowledgment and a
          reference number before you hang up or leave the branch.
        </div>

        <div class="step-actions step-actions--split">
          <button type="button" class="btn-ghost" @click="prevStep">← Back</button>
          <button type="button" class="btn-primary" @click="nextStep">Next: File a police report →</button>
        </div>
      </div>

      <!-- STEP 3: POLICE REPORT -->
      <div v-else-if="currentStep === 'police'" class="step">
        <h2 class="step-heading">Filing a police report</h2>
        <p class="step-sub">
          A police report is what gives your case official standing — it's usually
          required before a bank or court will act beyond an initial short freeze.
        </p>

        <h3 class="sub-heading">Bring these with you</h3>
        <ul class="checklist">
          <li v-for="item in policeChecklist" :key="item">{{ item }}</li>
        </ul>

        <h3 class="sub-heading">Where to file it</h3>
        <p class="body-text">
          File at your nearest police station (a "divisional report" is usually enough
          to start), or directly with the Nigeria Police Force's National Cybercrime
          Centre if the fraud happened online — see the Agencies step for their
          contact details and reporting portal.
        </p>

        <div class="tip-box">
          Ask for the case/reference number before you leave, and the name of the
          investigating officer if one is assigned. You'll need both to follow up
          or to support a freeze/court order request later.
        </div>

        <div class="step-actions step-actions--split">
          <button type="button" class="btn-ghost" @click="prevStep">← Back</button>
          <button type="button" class="btn-primary" @click="nextStep">Next: Court order →</button>
        </div>
      </div>

      <!-- STEP 4: COURT ORDER -->
      <div v-else-if="currentStep === 'court'" class="step">
        <h2 class="step-heading">Understanding the court order step</h2>
        <p class="step-sub">
          This is the part most people skip, mainly because no one explains it.
          Here's the honest, general shape of it.
        </p>

        <div class="court-steps">
          <div v-for="(c, i) in courtSteps" :key="c.title" class="court-step">
            <span class="court-step-num">{{ i + 1 }}</span>
            <div>
              <h4 class="court-step-title">{{ c.title }}</h4>
              <p class="court-step-body">{{ c.body }}</p>
            </div>
          </div>
        </div>

        <div class="tip-box tip-box--warn">
          Court procedures and thresholds can vary by state and by the specifics of
          your case. If real money is on the line, it is worth briefly consulting a
          lawyer — some state Legal Aid Councils and NGOs offer free or low-cost
          consultations for fraud victims.
        </div>

        <div class="step-actions step-actions--split">
          <button type="button" class="btn-ghost" @click="prevStep">← Back</button>
          <button type="button" class="btn-primary" @click="nextStep">Next: Where to submit →</button>
        </div>
      </div>

      <!-- STEP 5: AGENCIES -->
      <div v-else-if="currentStep === 'agencies'" class="step">
        <h2 class="step-heading">Where to submit, depending on your case</h2>
        <p class="step-sub">
          Pick based on what actually happened — sending to the wrong agency just
          costs you time.
        </p>

        <div class="agency-list">
          <div v-for="agency in agencies" :key="agency.shortName" class="agency-card">
            <div class="agency-top">
              <span class="agency-badge">{{ agency.shortName }}</span>
              <h4 class="agency-name">{{ agency.name }}</h4>
            </div>
            <p class="agency-role">{{ agency.role }}</p>
            <div class="agency-details">
              <div class="detail-row">
                <span class="detail-label">Phone</span>
                <span class="detail-value">{{ agency.phone }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Email</span>
                <a :href="`mailto:${agency.email}`" class="detail-value detail-link">{{ agency.email }}</a>
              </div>
              <div class="detail-row">
                <span class="detail-label">Website</span>
                <a :href="agency.website" target="_blank" rel="noopener" class="detail-value detail-link">
                  {{ agency.website.replace('https://', '') }}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="step-actions step-actions--split">
          <button type="button" class="btn-ghost" @click="prevStep">← Back</button>
          <NuxtLink to="/report/form" class="btn-primary">Also file a report on Fraud Radar NG →</NuxtLink>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.recovery-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 48px 24px 90px;
}

/* ============ HERO ============ */
.hero-eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: var(--mono); font-size: 11px; letter-spacing: 0.12em;
  text-transform: uppercase; color: var(--accent); margin-bottom: 18px;
}
.dot { width: 6px; height: 6px; background: var(--accent); border-radius: 50%; }

.hero-title {
  font-family: var(--serif);
  font-size: clamp(28px, 4.2vw, 60px);
  color: var(--text-1);
  line-height: 1.2;
  margin-bottom: 16px;
  max-width: 680px;
}
.hero-sub {
  font-size: 15px;
  color: var(--text-2);
  line-height: 1.7;
  font-weight: 300;
  max-width: 620px;
  margin-bottom: 24px;
}

.disclaimer-box {
  background: var(--surface);
  border: 1px solid var(--border);
  border-left: 4px solid var(--accent);
  border-radius: var(--radius);
  padding: 16px 20px;
  font-size: 13px;
  color: var(--text-2);
  line-height: 1.65;
  font-weight: 300;
  margin-bottom: 40px;
}
.disclaimer-box strong { color: var(--text-1); font-weight: 600; }

/* ============ STEP RAIL ============ */
.rail-row {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  margin-bottom: 28px;
}
.rail-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 8px 14px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.rail-pill:hover { border-color: var(--border-hi); }
.rail-pill--active {
  border-color: var(--accent);
  background: var(--accent-dim, rgba(232,255,71,0.08));
}
.rail-pill--done {
  border-color: var(--accent);
}
.rail-pill-num {
  width: 20px; height: 20px; border-radius: 50%;
  background: var(--bg); border: 1px solid var(--border-hi);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--mono); font-size: 10px; color: var(--text-2);
  flex-shrink: 0;
}
.rail-pill--active .rail-pill-num,
.rail-pill--done .rail-pill-num {
  background: var(--accent); border-color: var(--accent); color: #0a0a0b; font-weight: 700;
}
.rail-pill-text { display: flex; flex-direction: column; line-height: 1.2; }
.rail-pill-label { font-family: var(--mono); font-size: 11.5px; color: var(--text-1); }
.rail-pill-hint { font-size: 10px; color: var(--text-3); }

/* ============ STEP CARD ============ */
.step-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 40px;
}
@media (max-width: 640px) {
  .step-card { padding: 24px 20px; }
}

.step-heading {
  font-family: var(--serif);
  font-size: 24px;
  color: var(--text-1);
  margin-bottom: 8px;
}
.step-sub {
  font-size: 14px;
  color: var(--text-3);
  font-weight: 300;
  line-height: 1.6;
  margin-bottom: 28px;
}

.section-divider {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-3);
  margin: 28px 0 16px;
  padding-top: 20px;
  border-top: 1px solid var(--border);
}

.field-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
@media (max-width: 560px) {
  .field-grid { grid-template-columns: 1fr; }
}

.form-group {
  margin-bottom: 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
label {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--text-3);
}
.input {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 13px 15px;
  color: var(--text-1);
  font-family: var(--sans);
  font-size: 14.5px;
  width: 100%;
}
.input:focus { outline: none; border-color: var(--accent-bdr, var(--accent)); }
.textarea { resize: vertical; line-height: 1.6; }

.error-text {
  font-family: var(--mono);
  font-size: 12px;
  color: #f87171;
  margin: 8px 0 16px;
}

.step-actions {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
}
.step-actions--split {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  background: var(--accent);
  color: #0a0a0b;
  font-weight: 600;
  font-family: var(--mono);
  font-size: 12.5px;
  letter-spacing: 0.03em;
  border: none;
  border-radius: var(--radius);
  padding: 14px 22px;
  cursor: pointer;
  text-decoration: none;
}
.btn-primary:hover { background: #d4eb3c; }

.btn-secondary {
  display: inline-flex;
  align-items: center;
  font-family: var(--mono);
  font-size: 12.5px;
  color: var(--text-1);
  background: none;
  border: 1px solid var(--border-hi);
  border-radius: var(--radius);
  padding: 14px 20px;
  cursor: pointer;
}
.btn-secondary:hover { border-color: var(--accent); }

.btn-ghost {
  display: inline-flex;
  align-items: center;
  font-family: var(--mono);
  font-size: 12px;
  color: var(--text-3);
  background: none;
  border: none;
  cursor: pointer;
  padding: 14px 4px;
}
.btn-ghost:hover { color: var(--text-1); }

/* ============ LETTER STEP ============ */
.letter-textarea {
  font-family: var(--mono);
  font-size: 13px;
  line-height: 1.7;
  white-space: pre-wrap;
}
.letter-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 16px;
}
.copy-status {
  font-family: var(--mono);
  font-size: 11.5px;
  color: #4ade80;
}

.tip-box {
  margin-top: 20px;
  padding: 14px 18px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-size: 13px;
  color: var(--text-2);
  line-height: 1.65;
  font-weight: 300;
}
.tip-box--warn {
  border-left: 3px solid #f87171;
}

/* ============ POLICE STEP ============ */
.sub-heading {
  font-family: var(--serif);
  font-size: 16px;
  color: var(--text-1);
  margin: 24px 0 12px;
}
.checklist {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-left: 20px;
  font-size: 13.5px;
  color: var(--text-2);
  line-height: 1.6;
  font-weight: 300;
}
.body-text {
  font-size: 13.5px;
  color: var(--text-2);
  line-height: 1.7;
  font-weight: 300;
}

/* ============ COURT STEP ============ */
.court-steps {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.court-step {
  display: flex;
  gap: 16px;
}
.court-step-num {
  width: 28px; height: 28px; flex-shrink: 0;
  border-radius: 50%;
  background: var(--bg); border: 1px solid var(--border-hi);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--mono); font-size: 12px; color: var(--accent);
}
.court-step-title {
  font-family: var(--serif);
  font-size: 15.5px;
  color: var(--text-1);
  margin-bottom: 6px;
}
.court-step-body {
  font-size: 13.5px;
  color: var(--text-2);
  line-height: 1.65;
  font-weight: 300;
}

/* ============ AGENCIES STEP ============ */
.agency-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.agency-card {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px 22px;
}
.agency-top {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.agency-badge {
  font-family: var(--mono);
  font-size: 9.5px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: var(--accent-dim, rgba(232,255,71,0.1));
  color: var(--accent);
  border: 1px solid rgba(232,255,71,0.25);
  padding: 3px 8px;
  border-radius: 3px;
}
.agency-name {
  font-family: var(--serif);
  font-size: 16px;
  color: var(--text-1);
}
.agency-role {
  font-size: 13px;
  color: var(--text-2);
  line-height: 1.6;
  font-weight: 300;
  margin-bottom: 14px;
}
.agency-details {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.detail-row { display: flex; gap: 10px; font-size: 12.5px; }
.detail-label {
  font-family: var(--mono); font-size: 9.5px; letter-spacing: 0.05em;
  text-transform: uppercase; color: var(--text-3); width: 50px; flex-shrink: 0;
}
.detail-value { color: var(--text-1); }
.detail-link { text-decoration: underline; }
.detail-link:hover { color: var(--accent); }
</style>