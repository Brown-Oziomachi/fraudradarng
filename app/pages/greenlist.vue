<script setup lang="ts">
useHead({ title: "How Scammers Fake a Domain — Fraud Radar NG" })

/* ---------------------------------------------------------------
   TOUCH DETECTION — hover reveals on desktop, tap reveals on mobile
--------------------------------------------------------------- */
const isTouch = ref(false)
onMounted(() => {
  isTouch.value = !window.matchMedia("(hover: hover) and (pointer: fine)").matches
})

/* ---------------------------------------------------------------
   ANATOMY OF A URL — hover on desktop, tap on mobile
--------------------------------------------------------------- */
const urlParts = [
  {
    id: "protocol",
    label: "https://",
    title: "Protocol",
    body: "Means the connection is encrypted. That's all it means. Scammers can and do get a free padlock on their fake sites in minutes — HTTPS is not proof of legitimacy, it's just proof of encryption.",
  },
  {
    id: "sub",
    label: "secure-login.",
    title: "Subdomain (or fake prefix)",
    body: "Anything sitting to the left of the real domain. This is the part scammers abuse most — they can type absolutely anything here, including the real bank's name, to make the address look right at a glance.",
  },
  {
    id: "domain",
    label: "gtbank",
    title: "The domain — this is the only part that matters",
    body: "The actual registered owner of the website. This is the one piece that must match the real institution exactly, letter for letter. Everything else in the address can be decoration.",
  },
  {
    id: "tld",
    label: ".com",
    title: "TLD (top-level domain)",
    body: "The suffix after the last dot. Real Nigerian banks and fintechs stick to one or two TLDs for years. A sudden .xyz, .online, .support, .top, or .club on a bank site is one of the strongest red flags there is.",
  },
  {
    id: "path",
    label: "/verify",
    title: "Path",
    body: "Whatever comes after the first single slash. It can say /login, /secure, /verify-account — anything. It has zero bearing on who actually owns the site. Ignore it when judging legitimacy.",
  },
]
const hoveredPart = ref<string | null>(null)
function enterPart(id: string) { if (!isTouch.value) hoveredPart.value = id }
function leavePart() { if (!isTouch.value) hoveredPart.value = null }
function tapPart(id: string) { hoveredPart.value = hoveredPart.value === id ? null : id }

/* ---------------------------------------------------------------
   SAME NAME, DIFFERENT ADDRESS
--------------------------------------------------------------- */
const lookalikes = [
  {
    real: "fraudradar.ng",
    fake: "fraudradar.com",
    risk: "medium",
    why: ".com is the most trusted TLD on earth — which is exactly why scammers buy it. A Nigerian organisation that only ever announced an .ng address suddenly showing up on .com should make you stop and check, not assume it's the international version.",
  },
  {
    real: "fraudradar.ng",
    fake: "fraudradar.xyz",
    risk: "high",
    why: ".xyz domains cost as little as N1,500 a year, need no proof of identity, and are disposable — register today, scam for a week, abandon it, register a new one tomorrow. Legitimate Nigerian institutions almost never use .xyz for anything customer-facing.",
  },
  {
    real: "fraudradar.ng",
    fake: "fraudradar.online",
    risk: "high",
    why: ".online is another near-zero-verification TLD, cheap and instantly available, popular for throwaway phishing pages because there is no registration history to build trust — and none needed to buy it.",
  },
]
const activeLookalike = ref<number | null>(null)
function enterLookalike(i: number) { if (!isTouch.value) activeLookalike.value = i }
function leaveLookalike() { if (!isTouch.value) activeLookalike.value = null }
function tapLookalike(i: number) { activeLookalike.value = activeLookalike.value === i ? null : i }

/* ---------------------------------------------------------------
   TRICKS — click/tap to expand on both desktop and mobile
--------------------------------------------------------------- */
const tricks = [
  {
    id: "subdomain-trick",
    title: "The subdomain trick",
    example: "gtbank.com.verify-secure.xyz",
    breakdown: [
      { part: "gtbank.com", note: "Looks exactly like the real bank. It is NOT the domain — it's just text the scammer typed in the subdomain slot, which can say anything at all." },
      { part: "verify-secure", note: "This is the actual domain — the part that is registered, and the part whoever owns this site actually controls." },
      { part: ".xyz", note: "The real TLD. A cheap, disposable one — exactly the kind a scam operation reaches for." },
    ],
    lesson: "Read every address backwards from the last dot. The domain is always the word immediately before the final TLD — never the word that merely looks familiar near the front.",
  },
  {
    id: "char-swap",
    title: "Character substitution",
    example: "gtbank.com, with a capital I swapped for a lowercase l, or a zero swapped for the letter O",
    breakdown: [
      { part: "Capital I vs lowercase l", note: "In most fonts these render almost identically. gtbank can be quietly rewritten with a capital I where an l should be, and your eye reads it as correct." },
      { part: "Zero vs letter O", note: "A 0 dropped into a brand name where an O belongs is invisible at a glance, especially on a small phone screen." },
    ],
    lesson: "When in doubt, do not trust your eyes on a link you did not type yourself. Type the address you know by heart, or use a saved bookmark — never re-type a URL you were just shown.",
  },
  {
    id: "extra-words",
    title: "Extra words and hyphens",
    example: "gtbank-secure-verification-portal.com",
    breakdown: [
      { part: "gtbank", note: "The familiar name, included specifically so a nervous or rushed reader latches onto it." },
      { part: "-secure-verification-portal", note: "Padding. None of this is part of the real bank's name. A genuine bank domain is short and has been the same for years — it does not grow new words during a security alert." },
    ],
    lesson: "Urgency plus a long, hyphenated domain is close to a guarantee that you are looking at a fake. Real banks do not need six extra words to prove who they are.",
  },
  {
    id: "tld-swap",
    title: "Swapping the ending only",
    example: "gtbank.com becomes gtbank.support, gtbank.info, or gtbank.top",
    breakdown: [
      { part: "gtbank", note: "Correct — and that is the problem. The name being right is exactly what makes this pattern effective." },
      { part: ".support / .info / .top", note: "None of these are GTBank's real TLD. Newer, less-monitored TLDs are cheap and easy to register with a name that is already taken on .com." },
    ],
    lesson: "Getting the name right means nothing if the ending is wrong. Confirm the exact TLD too — not just the brand name in the middle.",
  },
]
const activeTrick = ref<string | null>(null)

/* ---------------------------------------------------------------
   VERIFIED REAL DOMAINS
--------------------------------------------------------------- */
const officialDomains = [
  { name: "GTBank / GTWorld", domain: "gtbank.com", category: "Bank" },
  { name: "Access Bank", domain: "accessbankplc.com", category: "Bank" },
  { name: "Zenith Bank", domain: "zenithbank.com", category: "Bank" },
  { name: "UBA", domain: "ubagroup.com", category: "Bank" },
  { name: "First Bank of Nigeria", domain: "firstbanknigeria.com", category: "Bank" },
  { name: "OPay", domain: "opayweb.com", category: "Fintech / MMO" },
  { name: "Kuda", domain: "kuda.com", category: "Digital bank" },
  { name: "Moniepoint", domain: "moniepoint.com", category: "Fintech / MMO" },
  { name: "PalmPay", domain: "palmpay.com", category: "Fintech / MMO" },
]

/* ---------------------------------------------------------------
   SCROLL-TRIGGERED POPUP — appears once, mid-page
--------------------------------------------------------------- */
const scrollTriggerEl = ref<HTMLElement | null>(null)
const showScrollPopup = ref(false)
const scrollPopupSeen = ref(false)
let scrollObserver: IntersectionObserver | null = null

function dismissScrollPopup() {
  showScrollPopup.value = false
}

function riskLabel(risk: string) {
  return risk === "high" ? "High risk pattern" : "Watch closely"
}

/* ---------------------------------------------------------------
   SCAM QUIZ — floating tab, slide-out panel, 10 real scenarios
--------------------------------------------------------------- */
type QuizOption = { text: string; risky: boolean; feedback: string }
type QuizQuestion = { scenario: string; prompt: string; options: QuizOption[] }

const quizQuestions: QuizQuestion[] = [
  {
    scenario: "A text arrives: Dear customer, your GTBank account will be blocked in 2 hours. Verify now: gtbank-secure-verify.com",
    prompt: "What do you do?",
    options: [
      { text: "Click the link and enter my login details right away to stop the block", risky: true, feedback: "That domain is not gtbank.com. Entering your details there hands your login straight to whoever built the page." },
      { text: "Ignore the link, open my real banking app instead, and check if there is really an issue", risky: false, feedback: "Correct instinct. Go to the source yourself instead of following a link that was sent to you." },
      { text: "Call the phone number the text was sent from, to confirm", risky: true, feedback: "Scam texts are often sent from spoofed or rented numbers. Calling back usually reaches the scammer, not the bank." },
    ],
  },
  {
    scenario: "You search online for a bank's customer care number and call the top result. The person who answers asks you to read out the OTP you just received to confirm your identity.",
    prompt: "What do you do?",
    options: [
      { text: "Read out the OTP so they can verify me", risky: true, feedback: "No bank agent ever needs an OTP read aloud. An OTP given out loud goes straight to whoever is on the other end of that call." },
      { text: "Refuse, hang up, and find the real number from my bank's app or the back of my card instead", risky: false, feedback: "Exactly right. The number you searched was never verified in the first place." },
      { text: "Ask them to text me their staff ID first, then decide", risky: true, feedback: "A fake ID number is trivial to send. Engaging further just gives a convincing talker more room to work." },
    ],
  },
  {
    scenario: "An investment platform promises a guaranteed 5% return every single day, paid in USDT, no matter what the market does.",
    prompt: "What do you do?",
    options: [
      { text: "Invest a small amount first, just to test if it really pays", risky: true, feedback: "This is exactly the pattern behind schemes like CBEX. Early withdrawals are paid smoothly on purpose, to build trust before the real losses happen." },
      { text: "Check the platform against the SEC's public register of licensed operators before sending anything", risky: false, feedback: "Right move. No real investment can guarantee a fixed daily return, and this step would confirm it is not registered." },
      { text: "Ask friends who already invested and are getting paid, then join too", risky: true, feedback: "Their payouts do not prove the platform is real. Ponzi schemes need early investors to be paid, specifically so they will recruit people like you." },
    ],
  },
  {
    scenario: "Someone you have been talking to online for three weeks, and never met in person, says they need money urgently for a flight to finally come see you.",
    prompt: "What do you do?",
    options: [
      { text: "Send the money right away — waiting could mean losing the relationship", risky: true, feedback: "Urgency plus money requests from someone you have never met in person is close to a textbook romance scam pattern." },
      { text: "Ask for a video call first, in real time, before sending anything", risky: false, feedback: "Good call. A real-time video call is hard for a scammer using stolen photos to fake convincingly." },
      { text: "Send a smaller amount first, as a show of good faith", risky: true, feedback: "Any amount sent to someone whose identity you have not confirmed is money a scammer can simply keep." },
    ],
  },
  {
    scenario: "A recruiter offers you a well-paid remote job, but says you must first pay a fee for security clearance before you can start.",
    prompt: "What do you do?",
    options: [
      { text: "Pay the fee — the salary being offered makes it worth the risk", risky: true, feedback: "Legitimate employers do not charge candidates money before employment starts. This fee is the entire scam." },
      { text: "Decline, since real employers never ask a candidate to pay to get hired", risky: false, feedback: "Correct. If a job requires payment from you before it begins, it is not a real job offer." },
      { text: "Ask if the fee can be deducted from my first salary instead", risky: true, feedback: "Negotiating the terms of a fake fee does not make the job real. There should be no fee to negotiate in the first place." },
    ],
  },
  {
    scenario: "A text says a package is being held and asks you to pay a small clearance fee through a link to release it.",
    prompt: "What do you do?",
    options: [
      { text: "Pay through the link, since the fee is small", risky: true, feedback: "Small individual amounts add up across thousands of people. The size of the fee has nothing to do with whether the message is real." },
      { text: "Contact the courier company directly, using their official app or the number on a past receipt", risky: false, feedback: "Exactly right. Verifying through a channel you already trust, not the one the message gave you, is the safe move." },
      { text: "Reply to the text asking for more details", risky: true, feedback: "Replying just confirms your number is active and worth targeting again. It does not verify anything." },
    ],
  },
  {
    scenario: "Your phone suddenly loses all signal, with no explanation, no roaming notice, nothing.",
    prompt: "What do you do?",
    options: [
      { text: "Wait a few hours — network issues happen all the time", risky: true, feedback: "A sudden, total loss of signal can mean your SIM has just been swapped onto someone else's device. Waiting gives them more time with your line." },
      { text: "Contact my bank immediately to freeze large transactions, then contact my telecom provider", risky: false, feedback: "Correct order. Your bank can act fast on a possible SIM swap, and this protects your money first." },
      { text: "Restart the phone a few times to see if it fixes itself", risky: true, feedback: "Restarting will not undo a SIM swap that has already happened on the network side." },
    ],
  },
  {
    scenario: "An Instagram seller with a well-designed page offers a phone at half the market price, and asks for full payment by bank transfer before shipping.",
    prompt: "What do you do?",
    options: [
      { text: "Pay in full — the page has a lot of followers and comments", risky: true, feedback: "Followers and comments can be bought or faked, and even a real-looking page can vanish the moment payment clears." },
      { text: "Insist on part-payment on delivery, or an escrow arrangement I choose myself", risky: false, feedback: "Good instinct. Never accept an escrow the seller proposes and controls — choose your own, or pay on delivery." },
      { text: "Send a smaller deposit first to secure the deal", risky: true, feedback: "A deposit to an unverified seller is still money that can simply disappear, just like a full payment would." },
    ],
  },
  {
    scenario: "An SMS says you have won 2,000,000 naira in a promo you do not remember entering, and asks for a small processing fee to release the winnings.",
    prompt: "What do you do?",
    options: [
      { text: "Pay the processing fee — 2 million naira is worth risking a few thousand", risky: true, feedback: "Real promotions never require the winner to pay a fee to collect a prize. The fee itself is the entire scam." },
      { text: "Delete the message, since legitimate winnings are never released by paying a fee first", risky: false, feedback: "Exactly right. This is one of the oldest scam patterns there is, just updated for SMS." },
      { text: "Ask them to deduct the fee from the winnings instead", risky: true, feedback: "There are no real winnings to deduct from. Negotiating with a fake premise does not make it real." },
    ],
  },
  {
    scenario: "A travel agent guarantees approval for a Canadian visa for a large flat fee, and says no embassy interview will even be needed.",
    prompt: "What do you do?",
    options: [
      { text: "Pay the full fee — the agent seems confident and has an office", risky: true, feedback: "No legitimate agent can ever guarantee an embassy's decision. A guarantee like this is the clearest possible warning sign." },
      { text: "Verify the agent against NANTA's public member portal, and apply directly through the embassy's own listed visa centre", risky: false, feedback: "Correct. The visa fee is fixed regardless of who you go through, so there is no real discount an unofficial agent can offer." },
      { text: "Pay half now and the rest after approval", risky: true, feedback: "Splitting the payment still funds a claim that was false from the start. A guaranteed approval was never on offer." },
    ],
  },
]

const quizOpen = ref(false)
const quizStep = ref(0)
const quizAnswers = ref<QuizOption[]>([])
const quizFinished = computed(() => quizStep.value >= quizQuestions.length)
const quizScore = computed(() => quizAnswers.value.filter((a) => !a.risky).length)
type QuizMissedRow = { answer: QuizOption; question: QuizQuestion }

const quizMissed = computed<QuizMissedRow[]>(() =>
  quizAnswers.value
    .map((a, i) => ({ answer: a, question: quizQuestions[i] }))
    .filter(
      (row): row is QuizMissedRow => row.question !== undefined && row.answer.risky
    )
)

function openQuiz() {
  quizOpen.value = true
}
function closeQuiz() {
  quizOpen.value = false
}
function pickAnswer(option: QuizOption) {
  quizAnswers.value.push(option)
  quizStep.value += 1
}
function restartQuiz() {
  quizStep.value = 0
  quizAnswers.value = []
}

function resultHeadline() {
  const score = quizScore.value
  if (score === quizQuestions.length) return "Every single answer was the safe one."
  if (score >= 7) return "You caught most of them."
  if (score >= 4) return "About half of these would have cost you."
  return "Several of these would have gone very badly."
}
function resultBody() {
  const score = quizScore.value
  if (score === quizQuestions.length) return "That is not luck. That is a habit — the same one this whole page is trying to build. Keep using it."
  if (score >= 7) return "The ones you missed below are exactly where real Nigerians lose real money. Read through what would have happened."
  return "This is not about feeling bad — it is about knowing exactly which instinct to change. Walk through each one below."
}

onMounted(() => {
  scrollObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !scrollPopupSeen.value) {
          showScrollPopup.value = true
          scrollPopupSeen.value = true
        }
      })
    },
    { threshold: 0.4 }
  )
  if (scrollTriggerEl.value) scrollObserver.observe(scrollTriggerEl.value)
})

onBeforeUnmount(() => {
  scrollObserver?.disconnect()
})
</script>

<template>
  <div class="dpage">

    <!-- ===================== HERO ===================== -->
    <section class="hero">
      <p class="eyebrow"><span class="dot" /> Domain literacy</p>
      <h1 class="hero-title">
        One extra letter<br />can cost you<br />everything.
      </h1>
      <p class="hero-sub">
        Scammers do not need to hack your bank. They just need you to type your
        PIN into a website that looks close enough. This page teaches you to read
        a web address the way a fraud investigator does — in a few seconds, every time.
      </p>
      <p class="hero-hint">{{ isTouch ? "Tap the address below. Scroll for more." : "Hover the address below. Scroll for more." }}</p>

      <div class="url-anatomy" aria-label="Interactive breakdown of a web address">
        <span
          v-for="part in urlParts"
          :key="part.id"
          class="url-part"
          :class="{ active: hoveredPart === part.id }"
          @mouseenter="enterPart(part.id)"
          @mouseleave="leavePart()"
          @click="tapPart(part.id)"
          >{{ part.label }}</span>
      </div>

      <Transition name="tooltip-fade">
        <div v-if="hoveredPart" class="anatomy-tooltip">
          <span class="anatomy-tooltip-label">{{ urlParts.find(p => p.id === hoveredPart)?.title }}</span>
          <p>{{ urlParts.find(p => p.id === hoveredPart)?.body }}</p>
        </div>
        <div v-else class="anatomy-tooltip anatomy-tooltip--idle">
          <p>{{ isTouch ? "Tap each piece of the address above." : "Hover or click each piece of the address above." }}</p>
        </div>
      </Transition>
    </section>

    <!-- ===================== SAME NAME, DIFFERENT ADDRESS ===================== -->
    <section class="lookalike-section">
      <div class="section-head">
        <span class="section-tag">Same name. Different address.</span>
        <h2>The name can be identical. The danger is in the ending.</h2>
        <p class="section-sub">
          {{ isTouch ? "Tap each pair." : "Hover or click each pair." }}
          The name in the middle never changes — that is the whole trick. What changes
          is the part almost nobody checks.
        </p>
      </div>

      <div class="lookalike-grid">
        <div
          v-for="(pair, i) in lookalikes"
          :key="pair.fake"
          class="lookalike-card"
          :class="[`risk-${pair.risk}`, { open: activeLookalike === i }]"
          @mouseenter="enterLookalike(i)"
          @mouseleave="leaveLookalike()"
          @click="tapLookalike(i)"
        >
          <div class="lookalike-real">
            <span class="lookalike-tag">The real one</span>
            <span class="lookalike-url">{{ pair.real }}</span>
          </div>
          <div class="lookalike-arrow">vs</div>
          <div class="lookalike-fake">
            <span class="lookalike-tag lookalike-tag--danger">{{ riskLabel(pair.risk) }}</span>
            <span class="lookalike-url lookalike-url--fake">{{ pair.fake }}</span>
          </div>

          <Transition name="expand">
            <p v-if="activeLookalike === i" class="lookalike-why">{{ pair.why }}</p>
          </Transition>
        </div>
      </div>
    </section>

    <!-- ===================== SCROLL TRIGGER TARGET ===================== -->
    <div ref="scrollTriggerEl" class="scroll-trigger-marker" aria-hidden="true" />

    <!-- ===================== TRICKS — CLICK/TAP TO OPEN ===================== -->
    <section class="tricks-section">
      <div class="section-head">
        <span class="section-tag">Tap each one open</span>
        <h2>Four ways a fake address is built</h2>
        <p class="section-sub">
          These are the actual mechanics, not just warnings. Understanding how
          each trick is constructed is what makes it recognisable next time —
          on WhatsApp, in an SMS, or in an email that looks perfect otherwise.
        </p>
      </div>

      <div class="tricks-list">
        <article
          v-for="trick in tricks"
          :key="trick.id"
          class="trick-card"
          :class="{ open: activeTrick === trick.id }"
        >
          <button
            type="button"
            class="trick-head"
            :aria-expanded="activeTrick === trick.id"
            @click="activeTrick = activeTrick === trick.id ? null : trick.id"
          >
            <span class="trick-title">{{ trick.title }}</span>
            <code class="trick-example">{{ trick.example }}</code>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" class="trick-chevron">
              <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>

          <Transition name="expand">
            <div v-if="activeTrick === trick.id" class="trick-body">
              <div class="trick-breakdown">
                <div v-for="b in trick.breakdown" :key="b.part" class="breakdown-row">
                  <code class="breakdown-part">{{ b.part }}</code>
                  <p class="breakdown-note">{{ b.note }}</p>
                </div>
              </div>
              <div class="trick-lesson">
                <span class="trick-lesson-label">The takeaway</span>
                <p>{{ trick.lesson }}</p>
              </div>
            </div>
          </Transition>
        </article>
      </div>
    </section>

    <!-- ===================== VERIFIED REAL DOMAINS ===================== -->
    <section class="registry-section">
      <div class="section-head">
        <span class="section-tag">Verified against each institution's own site</span>
        <h2>What the real address actually is</h2>
        <p class="section-sub">
          Screenshot this. Save it. The single most reliable way to avoid a fake
          bank site is knowing the real one before you ever need it under pressure.
        </p>
      </div>

      <ul class="registry-grid">
        <li v-for="d in officialDomains" :key="d.name" class="registry-card">
          <span class="registry-category">{{ d.category }}</span>
          <span class="registry-name">{{ d.name }}</span>
          <code class="registry-domain">{{ d.domain }}</code>
        </li>
      </ul>

      <p class="registry-note">
        These are correct as of verification, but domains can occasionally change
        after a merger or rebrand. If one of these ever looks different from what
        an institution announces on its own official social pages, trust the
        institution's announcement — not this list, and not a link someone sent you.
      </p>
    </section>

    <!-- ===================== 5 SECOND CHECK ===================== -->
    <section class="checklist-section">
      <div class="checklist-inner">
        <h2>Before you type your PIN, take five seconds</h2>
        <ol class="checklist">
          <li>
            <span class="check-num">01</span>
            <div>
              <h3>Hover, or press and hold, before you click</h3>
              <p>On a computer, hover over any link without clicking — the real destination shows in the bottom-left corner of the browser. On mobile, press and hold instead of tapping.</p>
            </div>
          </li>
          <li>
            <span class="check-num">02</span>
            <div>
              <h3>Read backwards from the last dot</h3>
              <p>The real domain is always the word directly before the TLD at the very end — not the word that merely looks familiar earlier in the address.</p>
            </div>
          </li>
          <li>
            <span class="check-num">03</span>
            <div>
              <h3>Type it yourself, or use a bookmark</h3>
              <p>Never follow a banking link from an SMS, email, or WhatsApp message. Type the address you already know, or open a bookmark you saved yourself, months ago, when nothing was urgent.</p>
            </div>
          </li>
          <li>
            <span class="check-num">04</span>
            <div>
              <h3>Urgency is the tell, not the TLD</h3>
              <p>Your account will be locked in 1 hour is designed to make you skip every step above. A real bank's security team has never once needed you to panic.</p>
            </div>
          </li>
          <li>
            <span class="check-num">05</span>
            <div>
              <h3>When unsure, verify through a channel you already trust</h3>
              <p>Call the number on your card, open the app you already have installed, or visit a branch. Never the number or link the message itself gave you.</p>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <!-- ===================== CTA ===================== -->
    <section class="cta-section">
      <div class="cta-inner">
        <h2>Seen a fake domain pretending to be a bank?</h2>
        <p>Report it here so the next person searching that link sees your warning before they lose anything.</p>
        <div class="cta-actions">
          <NuxtLink to="/report/new" class="btn-primary">Report a fake domain</NuxtLink>
          <NuxtLink to="/lookupsearch" class="btn-secondary">Check a domain first</NuxtLink>
        </div>
      </div>
    </section>

    <!-- ===================== SCROLL-TRIGGERED POPUP ===================== -->
    <Transition name="popup-fade">
      <div v-if="showScrollPopup" class="scroll-popup-overlay" @click.self="dismissScrollPopup">
        <div class="scroll-popup" role="dialog" aria-label="Quick tip">
          <button type="button" class="scroll-popup-close" aria-label="Close" @click="dismissScrollPopup">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
          <span class="scroll-popup-tag">Quick check</span>
          <h3>You just read a fake bank domain without a single alarm going off.</h3>
          <p>
            Fake domains are designed to pass a glance. The only thing that beats
            them is a habit — hover, press and hold, or type it yourself, every
            single time, even when you are in a hurry.
          </p>
          <button type="button" class="scroll-popup-btn" @click="dismissScrollPopup">Keep reading</button>
        </div>
      </div>
    </Transition>

    <!-- ===================== FLOATING QUIZ TAB ===================== -->
    <button
      type="button"
      class="quiz-tab"
      :class="{ hidden: quizOpen }"
      aria-label="Open the scam test"
      @click="openQuiz"
    >
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>
        <path d="M9.1 9a3 3 0 0 1 5.83 1c0 2-3 2-3 4M12 17h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <!-- ===================== SLIDE-OUT QUIZ PANEL ===================== -->
    <div class="quiz-overlay" :class="{ open: quizOpen }" @click.self="closeQuiz">
      <aside class="quiz-panel" :class="{ open: quizOpen }" role="dialog" aria-label="Scam recognition test">
        <div class="quiz-panel-head">
          <span class="quiz-panel-tag">{{ quizFinished ? "Your result" : `Question ${quizStep + 1} of ${quizQuestions.length}` }}</span>
          <button type="button" class="quiz-close" aria-label="Close" @click="closeQuiz">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <div v-if="!quizFinished" class="quiz-progress">
          <div class="quiz-progress-fill" :style="{ width: (quizStep / quizQuestions.length) * 100 + '%' }" />
        </div>

        <!-- QUESTION VIEW -->
        <div v-if="!quizFinished" class="quiz-body">
          <p class="quiz-scenario">{{ quizQuestions[quizStep]?.scenario }}</p>
          <p class="quiz-prompt">{{ quizQuestions[quizStep]?.prompt }}</p>
          <div class="quiz-options">
            <button
              v-for="(opt, oi) in (quizQuestions[quizStep]?.options || [])"
              :key="oi"
              type="button"
              class="quiz-option"
              @click="pickAnswer(opt)"
            >
              {{ opt.text }}
            </button>
          </div>
        </div>

        <!-- RESULT VIEW -->
        <div v-else class="quiz-body">
          <div class="quiz-result-score">{{ quizScore }} / {{ quizQuestions.length }}</div>
          <h3 class="quiz-result-headline">{{ resultHeadline() }}</h3>
          <p class="quiz-result-body">{{ resultBody() }}</p>

          <div v-if="quizMissed.length" class="quiz-missed-list">
            <div v-for="(row, i) in quizMissed" :key="i" class="quiz-missed-item">
              <span class="quiz-missed-tag">How this would have gone</span>
              <p class="quiz-missed-scenario">{{ row.question.scenario }}</p>
              <p class="quiz-missed-choice">You chose: {{ row.answer.text }}</p>
              <p class="quiz-missed-feedback">{{ row.answer.feedback }}</p>
            </div>
          </div>

          <button type="button" class="quiz-restart" @click="restartQuiz">Take it again</button>
        </div>
      </aside>
    </div>

  </div>
</template>

<style scoped>
.dpage { width: 100%; background: var(--bg); color: var(--text-1); position: relative; }

.eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: var(--mono); font-size: 11px; letter-spacing: 0.12em;
  text-transform: uppercase; color: var(--accent); margin-bottom: 20px;
}
.dot { width: 6px; height: 6px; background: var(--accent); border-radius: 50%; }

/* ============ HERO ============ */
.hero {
  max-width: 900px;
  margin: 0 auto;
  padding: 96px 24px 64px;
  text-align: left;
}
@media (max-width: 720px) { .hero { padding: 64px 20px 48px; } }

.hero-title {
  font-family: var(--serif);
  font-size: clamp(40px, 6vw, 72px);
  line-height: 1.08;
  letter-spacing: -0.02em;
  margin-bottom: 24px;
}
.hero-sub {
  font-size: clamp(15px, 1.6vw, 18px);
  line-height: 1.7;
  font-weight: 300;
  color: var(--text-2);
  max-width: 620px;
  margin-bottom: 12px;
}
.hero-hint {
  font-family: var(--mono);
  font-size: 11.5px;
  letter-spacing: 0.04em;
  color: var(--text-3);
  margin-bottom: 32px;
}

.url-anatomy {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 2px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px 22px;
  font-family: var(--mono);
  font-size: clamp(16px, 2.6vw, 22px);
}
.url-part {
  cursor: pointer;
  padding: 3px 2px;
  border-radius: 4px;
  transition: background 0.15s, color 0.15s;
  color: var(--text-2);
}
.url-part.active {
  background: var(--accent);
  color: #0a0a0b;
}

.anatomy-tooltip {
  margin-top: 16px;
  padding: 16px 18px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-left: 3px solid var(--accent);
  border-radius: var(--radius);
  min-height: 76px;
}
.anatomy-tooltip--idle {
  border-left-color: var(--border);
  display: flex;
  align-items: center;
}
.anatomy-tooltip--idle p { color: var(--text-3); font-size: 13px; }
.anatomy-tooltip-label {
  display: block;
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 8px;
}
.anatomy-tooltip p {
  font-size: 13.5px;
  line-height: 1.65;
  color: var(--text-2);
  font-weight: 300;
}

.tooltip-fade-enter-active, .tooltip-fade-leave-active { transition: opacity 0.15s ease; }
.tooltip-fade-enter-from, .tooltip-fade-leave-to { opacity: 0; }

/* ============ SECTION HEADS (shared) ============ */
.section-head { max-width: 680px; margin: 0 auto 40px; padding: 0 24px; }
.section-tag {
  display: inline-block;
  font-family: var(--mono); font-size: 10.5px; letter-spacing: 0.08em;
  text-transform: uppercase; color: var(--accent); margin-bottom: 12px;
}
.section-head h2 {
  font-family: var(--serif);
  font-size: clamp(24px, 3.4vw, 34px);
  line-height: 1.25;
  margin-bottom: 12px;
}
.section-sub {
  font-size: 14.5px;
  line-height: 1.7;
  color: var(--text-2);
  font-weight: 300;
}

/* ============ LOOKALIKE GRID ============ */
.lookalike-section { padding: 72px 0; border-top: 1px solid var(--border); }
.lookalike-grid {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.lookalike-card {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 22px 24px;
  cursor: pointer;
  transition: border-color 0.2s;
}
.lookalike-card:hover, .lookalike-card.open { border-color: var(--border-hi); }
.lookalike-card.risk-high.open { border-color: #d64545; }
@media (max-width: 620px) {
  .lookalike-card { grid-template-columns: 1fr; text-align: left; gap: 8px; }
  .lookalike-arrow { display: none; }
}

.lookalike-real, .lookalike-fake { display: flex; flex-direction: column; gap: 6px; }
.lookalike-fake { text-align: right; }
@media (max-width: 620px) { .lookalike-fake { text-align: left; } }

.lookalike-tag {
  font-family: var(--mono); font-size: 10px; letter-spacing: 0.05em;
  text-transform: uppercase; color: #3fae6a;
}
.lookalike-tag--danger { color: #d64545; }
.lookalike-url {
  font-family: var(--mono); font-size: 17px; color: var(--text-1);
}
.lookalike-url--fake { color: #d64545; }
.lookalike-arrow {
  font-family: var(--mono); font-size: 11px; color: var(--text-3);
  text-transform: uppercase;
}

.lookalike-why {
  grid-column: 1 / -1;
  margin-top: 6px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
  font-size: 13.5px;
  line-height: 1.7;
  color: var(--text-2);
  font-weight: 300;
}

.expand-enter-active, .expand-leave-active { transition: opacity 0.2s ease; }
.expand-enter-from, .expand-leave-to { opacity: 0; }

/* ============ SCROLL TRIGGER ============ */
.scroll-trigger-marker { height: 1px; }

/* ============ TRICKS ============ */
.tricks-section { padding: 72px 0; border-top: 1px solid var(--border); }
.tricks-list {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.trick-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  transition: border-color 0.2s;
}
.trick-card.open { border-color: var(--accent); }

.trick-head {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 22px;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
}
.trick-title {
  font-family: var(--serif);
  font-size: 16px;
  color: var(--text-1);
  flex-shrink: 0;
  width: 220px;
}
@media (max-width: 720px) {
  .trick-head { flex-wrap: wrap; }
  .trick-title { width: 100%; }
}
.trick-example {
  font-family: var(--mono);
  font-size: 12.5px;
  color: var(--text-3);
  flex: 1;
  overflow-wrap: anywhere;
}
.trick-chevron {
  color: var(--text-3);
  flex-shrink: 0;
  transition: transform 0.2s;
}
.trick-card.open .trick-chevron { transform: rotate(180deg); color: var(--accent); }

.trick-body { padding: 0 22px 24px; }
.trick-breakdown {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 18px;
  padding: 16px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: calc(var(--radius) - 2px);
}
.breakdown-row { display: flex; flex-direction: column; gap: 4px; }
.breakdown-part {
  font-family: var(--mono);
  font-size: 13px;
  color: var(--accent);
  width: fit-content;
}
.breakdown-note {
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-2);
  font-weight: 300;
}
.trick-lesson {
  padding: 14px 16px;
  border-left: 3px solid var(--accent);
  background: var(--surface);
}
.trick-lesson-label {
  display: block;
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 6px;
}
.trick-lesson p { font-size: 13px; line-height: 1.65; color: var(--text-2); font-weight: 300; }

/* ============ REGISTRY ============ */
.registry-section { padding: 72px 0; border-top: 1px solid var(--border); background: var(--surface); }
.registry-grid {
  list-style: none;
  margin: 0 auto;
  padding: 0 24px;
  max-width: 1000px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}
@media (max-width: 800px) { .registry-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 520px) { .registry-grid { grid-template-columns: 1fr; } }

.registry-card {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.registry-category {
  font-family: var(--mono);
  font-size: 9.5px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-3);
}
.registry-name { font-family: var(--serif); font-size: 15px; color: var(--text-1); }
.registry-domain { font-family: var(--mono); font-size: 13px; color: #3fae6a; }

.registry-note {
  max-width: 1000px;
  margin: 24px auto 0;
  padding: 0 24px;
  font-family: var(--mono);
  font-size: 11px;
  line-height: 1.7;
  color: var(--text-3);
}

/* ============ CHECKLIST ============ */
.checklist-section { padding: 80px 0; border-top: 1px solid var(--border); }
.checklist-inner { max-width: 720px; margin: 0 auto; padding: 0 24px; }
.checklist-inner > h2 {
  font-family: var(--serif);
  font-size: clamp(24px, 3.4vw, 32px);
  margin-bottom: 36px;
  line-height: 1.25;
}
.checklist { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 28px; }
.checklist li { display: flex; gap: 18px; }
.check-num {
  font-family: var(--mono);
  font-size: 17px;
  font-weight: 700;
  color: var(--accent);
  flex-shrink: 0;
  padding-top: 2px;
}
.checklist h3 {
  font-family: var(--serif);
  font-size: 17px;
  color: var(--text-1);
  margin-bottom: 6px;
}
.checklist p { font-size: 13.5px; line-height: 1.7; color: var(--text-2); font-weight: 300; }

/* ============ CTA ============ */
.cta-section { padding: 72px 24px 96px; border-top: 1px solid var(--border); }
.cta-inner { max-width: 640px; margin: 0 auto; text-align: center; }
.cta-inner h2 { font-family: var(--serif); font-size: clamp(22px, 3vw, 28px); margin-bottom: 12px; }
.cta-inner p { font-size: 14.5px; color: var(--text-2); font-weight: 300; margin-bottom: 28px; }
.cta-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
.btn-primary {
  display: inline-flex; align-items: center; background: var(--accent);
  color: #0a0a0b; font-weight: 600; font-family: var(--mono); font-size: 12.5px;
  letter-spacing: 0.03em; padding: 14px 24px; border-radius: var(--radius); text-decoration: none;
}
.btn-primary:hover { background: #d4eb3c; }
.btn-secondary {
  display: inline-flex; align-items: center; font-family: var(--mono); font-size: 12.5px;
  letter-spacing: 0.03em; color: var(--text-2); border: 1px solid var(--border-hi);
  border-radius: var(--radius); padding: 14px 22px; text-decoration: none;
  transition: border-color 0.15s, color 0.15s;
}
.btn-secondary:hover { border-color: var(--accent); color: var(--text-1); }

/* ============ SCROLL POPUP ============ */
.scroll-popup-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(10,10,11,0.6);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 24px;
}
@media (min-width: 720px) {
  .scroll-popup-overlay { align-items: center; }
}

.scroll-popup {
  position: relative;
  width: 100%;
  max-width: 440px;
  background: var(--surface);
  border: 1px solid var(--accent);
  border-radius: calc(var(--radius) + 6px);
  padding: 28px 26px 26px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.35);
}
.scroll-popup-close {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: 1px solid var(--border);
  border-radius: 50%;
  color: var(--text-2);
  cursor: pointer;
}
.scroll-popup-tag {
  display: inline-block;
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 12px;
}
.scroll-popup h3 {
  font-family: var(--serif);
  font-size: 19px;
  line-height: 1.35;
  color: var(--text-1);
  margin-bottom: 12px;
}
.scroll-popup p {
  font-size: 13.5px;
  line-height: 1.7;
  color: var(--text-2);
  font-weight: 300;
  margin-bottom: 20px;
}
.scroll-popup-btn {
  width: 100%;
  background: var(--accent);
  color: #0a0a0b;
  font-family: var(--mono);
  font-weight: 700;
  font-size: 12.5px;
  letter-spacing: 0.04em;
  padding: 13px;
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
}
.scroll-popup-btn:hover { background: #d4eb3c; }

.popup-fade-enter-active { transition: opacity 0.25s ease; }
.popup-fade-leave-active { transition: opacity 0.15s ease; }
.popup-fade-enter-from, .popup-fade-leave-to { opacity: 0; }

/* ============ FLOATING QUIZ TAB ============ */
.quiz-tab {
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 150;
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--accent);
  color: #0a0a0b;
  border: none;
  border-radius: 10px 0 0 10px;
  padding: 14px 12px;
  cursor: pointer;
  font-family: var(--mono);
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.02em;
  box-shadow: -4px 0 16px rgba(0,0,0,0.2);
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.quiz-tab:hover { background: #d4eb3c; }
.quiz-tab.hidden { opacity: 0; pointer-events: none; transform: translateY(-50%) translateX(20px); }
.quiz-tab svg { writing-mode: horizontal-tb; }

/* ============ SLIDE-OUT QUIZ PANEL ============ */
.quiz-overlay {
  position: fixed;
  inset: 0;
  z-index: 250;
  background: rgba(10,10,11,0);
  pointer-events: none;
  transition: background 0.3s ease;
}
.quiz-overlay.open {
  background: rgba(10,10,11,0.55);
  pointer-events: auto;
}

.quiz-panel {
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  width: 100%;
  max-width: 440px;
  background: var(--surface);
  border-left: 1px solid var(--border);
  transform: translateX(100%);
  transition: transform 0.32s cubic-bezier(0.22, 1, 0.36, 1);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}
.quiz-panel.open { transform: translateX(0); }

.quiz-panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 22px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}
.quiz-panel-tag {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--accent);
}
.quiz-close {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: 1px solid var(--border);
  border-radius: 50%;
  color: var(--text-2);
  cursor: pointer;
}

.quiz-progress {
  height: 3px;
  background: var(--border);
  flex-shrink: 0;
}
.quiz-progress-fill {
  height: 100%;
  background: var(--accent);
  transition: width 0.25s ease;
}

.quiz-body { padding: 24px 22px 40px; }

.quiz-scenario {
  font-family: var(--serif);
  font-size: 17px;
  line-height: 1.5;
  color: var(--text-1);
  margin-bottom: 18px;
}
.quiz-prompt {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--text-3);
  margin-bottom: 16px;
}
.quiz-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.quiz-option {
  text-align: left;
  padding: 14px 16px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--text-1);
  font-size: 13.5px;
  line-height: 1.5;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.quiz-option:hover {
  border-color: var(--accent);
  background: var(--surface);
}

.quiz-result-score {
  font-family: var(--serif);
  font-size: 44px;
  color: var(--accent);
  margin-bottom: 8px;
}
.quiz-result-headline {
  font-family: var(--serif);
  font-size: 20px;
  color: var(--text-1);
  margin-bottom: 10px;
  line-height: 1.35;
}
.quiz-result-body {
  font-size: 13.5px;
  line-height: 1.7;
  color: var(--text-2);
  font-weight: 300;
  margin-bottom: 26px;
}

.quiz-missed-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}
.quiz-missed-item {
  padding: 16px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-left: 3px solid #d64545;
  border-radius: calc(var(--radius) - 2px);
}
.quiz-missed-tag {
  display: block;
  font-family: var(--mono);
  font-size: 9.5px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #d64545;
  margin-bottom: 8px;
}
.quiz-missed-scenario {
  font-size: 12.5px;
  line-height: 1.6;
  color: var(--text-3);
  margin-bottom: 8px;
  font-style: italic;
}
.quiz-missed-choice {
  font-size: 12.5px;
  color: var(--text-1);
  font-weight: 600;
  margin-bottom: 6px;
}
.quiz-missed-feedback {
  font-size: 12.5px;
  line-height: 1.65;
  color: var(--text-2);
  font-weight: 300;
}

.quiz-restart {
  width: 100%;
  background: var(--accent);
  color: #0a0a0b;
  font-family: var(--mono);
  font-weight: 700;
  font-size: 12.5px;
  letter-spacing: 0.04em;
  padding: 14px;
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
}
.quiz-restart:hover { background: #d4eb3c; }

@media (max-width: 480px) {
  .quiz-panel { max-width: 100%; }
}

@media (prefers-reduced-motion: reduce) {
  .tooltip-fade-enter-active, .tooltip-fade-leave-active,
  .expand-enter-active, .expand-leave-active,
  .popup-fade-enter-active, .popup-fade-leave-active,
  .quiz-panel, .quiz-overlay, .quiz-tab {
    transition: none !important;
  }
}
</style>