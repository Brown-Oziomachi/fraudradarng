// scripts/seed-scam-breakdowns-extended.mjs
//
// Second batch for the FRNG Community Hub's `scamBreakdowns` collection.
//
// This intentionally writes to the SAME collection as
// scripts/seed-scam-breakdowns.mjs, using a distinct `ext-` ID prefix on
// every doc. That means:
//   - Running this script can never collide with or overwrite the first
//     batch (different IDs entirely).
//   - No separate "join" query is needed — /api/community/breakdowns already
//     reads the whole `scamBreakdowns` collection, so these 15 show up
//     automatically on the main /community page alongside the original 8.
//   - The new /community-extension page also reads the same collection/API,
//     so both pages stay in sync with one source of truth.
//
// USAGE
//   GOOGLE_APPLICATION_CREDENTIALS=./firebase-service-account.json node scripts/seed-scam-breakdowns-extended.mjs

import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'
import { readFileSync } from 'node:fs'

const SERVICE_ACCOUNT_PATH =
  process.env.GOOGLE_APPLICATION_CREDENTIALS || './firebase-service-account.json'

let serviceAccount
try {
  serviceAccount = JSON.parse(readFileSync(SERVICE_ACCOUNT_PATH, 'utf-8'))
} catch (err) {
  console.error(
    `\n[seed-scam-breakdowns-extended] Could not read service account key at "${SERVICE_ACCOUNT_PATH}".\n` +
      `Set GOOGLE_APPLICATION_CREDENTIALS to the correct path.\n`
  )
  process.exit(1)
}

initializeApp({ credential: cert(serviceAccount) })
const db = getFirestore()

function daysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return Timestamp.fromDate(d)
}

// ---------------------------------------------------------------------------
// 15 additional entries, distinct `ext-` IDs, spread across all 8 categories.
// Same rule as the first batch: pattern-level modus operandi, concrete red
// flags — enough to recognize it, not enough to run it.
// ---------------------------------------------------------------------------

const breakdowns = [
  {
    id: 'ext-task-based-ponzi-01',
    title: 'Product-Review "Combo" Task Locks Withdrawals Behind Bigger Deposits',
    category: 'Task-Based Ponzi',
    threatLevel: 'critical',
    summary:
      'A task platform pairs simple product-rating jobs with a "combo order" mechanic where the app claims the user picked an item priced above their balance, requiring a top-up deposit to continue or withdraw at all.',
    reportedCount: 187,
    lastSeen: daysAgo(2),
    platformsInvolved: ['Telegram', 'WhatsApp', 'Moniepoint'],
    modusOperandi: [
      { order: 1, description: 'The app or group advertises paid daily tasks with a visible in-app wallet balance that grows with each completed task.' },
      { order: 2, description: 'At a set point, the system claims a randomly assigned "combo" task costs more than the current balance.' },
      { order: 3, description: 'A deposit is required to "complete the combo" before any withdrawal is permitted.' },
      { order: 4, description: 'Further combos or fees repeat the same pattern, and the balance is never actually released.' },
    ],
    redFlags: [
      'A wallet balance you can see but cannot withdraw without paying in first.',
      '"Combo" or "frozen order" messages that only resolve with a deposit.',
      'No customer support outside the same task group chat.',
      'Referral bonuses pushed harder than the actual task pay.',
    ],
  },
  {
    id: 'ext-task-based-ponzi-02',
    title: 'Investment "Study Group" Charges Fees for Signals That Never Pay Out',
    category: 'Task-Based Ponzi',
    threatLevel: 'high',
    summary:
      'A WhatsApp "study group" teaches basic trading concepts for free, then upsells a paid signal service promising daily profit splits that stop arriving once enough members have paid in.',
    reportedCount: 96,
    lastSeen: daysAgo(14),
    platformsInvolved: ['WhatsApp', 'Bank transfer'],
    modusOperandi: [
      { order: 1, description: 'Free lessons build credibility and a sense of community before any payment is requested.' },
      { order: 2, description: 'A paid tier is introduced, promising daily trading signals and a share of group profits.' },
      { order: 3, description: 'A handful of early payouts are shown publicly in the group to encourage more members to join the paid tier.' },
      { order: 4, description: 'Payouts slow and eventually stop once membership fees have grown, with the "mentor" going inactive.' },
    ],
    redFlags: [
      'Payment required to access a "profit-sharing" tier of an informal group.',
      'Screenshots of payouts posted publicly with no way to verify they are real.',
      'No registered investment license or regulator oversight.',
      'Group admin becomes unreachable right as complaints about missed payouts start.',
    ],
  },
  {
    id: 'ext-instagram-fake-vendor-02',
    title: 'Fake "Wholesale" Page Sells Bulk Electronics That Never Arrive',
    category: 'Instagram Fake Vendor',
    threatLevel: 'high',
    summary:
      'A page presenting as a wholesale electronics importer advertises phones and laptops at deep bulk-order discounts, collects a deposit for "bulk pricing," then goes silent.',
    reportedCount: 142,
    lastSeen: daysAgo(8),
    platformsInvolved: ['Instagram', 'WhatsApp', 'Bank transfer'],
    modusOperandi: [
      { order: 1, description: 'A page markets itself as a wholesale importer, using stock photos and reposted unboxing videos as proof of stock.' },
      { order: 2, description: 'Deep discounts are offered specifically for "bulk" or "group buy" orders, encouraging buyers to pay more upfront for a better rate.' },
      { order: 3, description: 'Buyers pay a deposit or full amount to a personal or unverifiable business account.' },
      { order: 4, description: 'Delivery excuses stack up (customs, courier delay, restocking) until the seller stops responding.' },
    ],
    redFlags: [
      'Bulk discounts requiring payment before any single item has been verified as real.',
      'No option to pay on delivery or through an escrow/marketplace system.',
      'Reposted or watermark-removed product photography.',
      'Business account name that does not match the page name or owner.',
    ],
  },
  {
    id: 'ext-romance-relationship-02',
    title: '"Investment Coach" Romance Leads to a Trading Platform Deposit',
    category: 'Romance / Relationship',
    threatLevel: 'critical',
    summary:
      'A romantic connection introduces the victim to a trading platform the "partner" claims to use successfully, walking them through depositing funds that are then impossible to withdraw.',
    reportedCount: 133,
    lastSeen: daysAgo(5),
    platformsInvolved: ['Dating apps', 'WhatsApp', 'Crypto wallets'],
    modusOperandi: [
      { order: 1, description: 'A relationship is built over time on a dating app, with the partner presenting as financially successful.' },
      { order: 2, description: 'The partner introduces a specific trading app or platform they claim generates reliable profit.' },
      { order: 3, description: 'The victim is walked through creating an account and making an initial deposit, sometimes seeing a fake rising "balance" in-app.' },
      { order: 4, description: 'When the victim tries to withdraw, the platform demands a tax, fee, or "unlock" payment, and the partner becomes unreachable soon after.' },
    ],
    redFlags: [
      'A romantic partner who introduces a specific investment or trading platform.',
      'An in-app balance that grows but cannot be withdrawn without an extra payment.',
      'A trading platform not linked to any recognized, regulated brokerage.',
      'The partner deflecting or avoiding a video call throughout the relationship.',
    ],
  },
  {
    id: 'ext-romance-relationship-03',
    title: 'Military/Overseas Persona Requests Money to "Come Home"',
    category: 'Romance / Relationship',
    threatLevel: 'high',
    summary:
      'A profile presenting as military personnel or a professional stationed abroad builds a relationship, then claims they need money for leave approval, flights, or equipment before they can finally meet.',
    reportedCount: 88,
    lastSeen: daysAgo(19),
    platformsInvolved: ['Facebook', 'WhatsApp'],
    modusOperandi: [
      { order: 1, description: 'A profile using a uniformed or professional photo initiates contact and quickly builds an emotional connection.' },
      { order: 2, description: 'Stories of deployment or overseas assignment are used to explain why they cannot meet in person or on video.' },
      { order: 3, description: 'A specific, bureaucratic-sounding obstacle (leave papers, clearance fee, flight booking) is introduced as the final step before they can travel to meet the victim.' },
      { order: 4, description: 'Once paid, a new obstacle appears, repeating the pattern until the victim stops paying or realizes the relationship was never real.' },
    ],
    redFlags: [
      'A partner stationed abroad who consistently cannot do a live video call.',
      'Any request for money tied to leave approval, transport, or clearance to travel.',
      'Photos that reverse-image-search to unrelated public profiles.',
      'A relationship timeline that has moved unusually fast toward talk of marriage or money.',
    ],
  },
  {
    id: 'ext-fake-job-offer-02',
    title: 'Data-Entry Job Requires "Certification Kit" Purchase',
    category: 'Fake Job Offer',
    threatLevel: 'moderate',
    summary:
      'A remote data-entry role is offered after a short chat interview, with the employer requiring the new hire to purchase a "certification kit" or software license before receiving any work.',
    reportedCount: 74,
    lastSeen: daysAgo(10),
    platformsInvolved: ['Telegram', 'Email'],
    modusOperandi: [
      { order: 1, description: 'A job posting or DM offers flexible, well-paid data-entry work with immediate hiring.' },
      { order: 2, description: 'After a brief chat, the candidate is told they are hired pending a small purchase of a "certification kit" or required software.' },
      { order: 3, description: 'Once paid, the promised work either never arrives or is unpaid busywork designed to stall the hire.' },
    ],
    redFlags: [
      'Any new job that requires purchasing a kit, license, or certification before starting.',
      'Immediate hiring with no real screening or portfolio review.',
      'Payment requested to a personal account rather than a company payment system.',
      'Vague company details that don\'t hold up to a quick search.',
    ],
  },
  {
    id: 'ext-fake-job-offer-03',
    title: 'Fake Recruiter Impersonates a Real Company\'s HR Team',
    category: 'Fake Job Offer',
    threatLevel: 'high',
    summary:
      'Scammers impersonate the HR department of a real, well-known company, using a lookalike email domain to offer jobs and request an upfront "processing fee" for work permits or relocation.',
    reportedCount: 119,
    lastSeen: daysAgo(6),
    platformsInvolved: ['Email', 'WhatsApp'],
    modusOperandi: [
      { order: 1, description: 'An email using a real company\'s branding and a near-identical domain name offers a position, often for remote or overseas work.' },
      { order: 2, description: 'An official-looking offer letter with logos and signatures is sent to build legitimacy.' },
      { order: 3, description: 'A processing, visa, or relocation fee is requested to finalize the offer.' },
      { order: 4, description: 'The real company has no record of the posting or the recruiter once contacted directly.' },
    ],
    redFlags: [
      'A company email domain that is close to, but not exactly, the real company\'s domain.',
      'Any request to pay for visa processing, relocation, or onboarding as a new hire.',
      'An offer that arrives without the candidate having applied through the company\'s real careers page.',
      'HR contact only reachable through a personal WhatsApp number.',
    ],
  },
  {
    id: 'ext-crypto-forex-scheme-02',
    title: 'Fake Exchange App Shows Fake Balances That Can Never Be Withdrawn',
    category: 'Crypto / Forex Scheme',
    threatLevel: 'critical',
    summary:
      'A cloned or lookalike crypto exchange app is promoted through ads and referrals, displaying a rising balance as the victim "trades," but every withdrawal attempt is blocked by a new fee or verification step.',
    reportedCount: 201,
    lastSeen: daysAgo(4),
    platformsInvolved: ['Fake exchange apps', 'Crypto wallets'],
    modusOperandi: [
      { order: 1, description: 'An app or website closely mimics a well-known crypto exchange\'s branding and interface.' },
      { order: 2, description: 'Users are directed to deposit crypto or fiat to begin trading on the platform.' },
      { order: 3, description: 'The interface shows a convincingly rising balance regardless of real market movement.' },
      { order: 4, description: 'Withdrawal requests are blocked by an escalating series of fees, taxes, or identity checks that never actually release funds.' },
    ],
    redFlags: [
      'An exchange app not listed on official app stores or not matching the real exchange\'s verified domain.',
      'A balance that only ever goes up regardless of market conditions.',
      'Any fee required specifically to "unlock" or "process" a withdrawal.',
      'Customer support that only exists inside the app itself, with no independent contact method.',
    ],
  },
  {
    id: 'ext-crypto-forex-scheme-03',
    title: 'Forex Signal Seller Vanishes After Bulk Subscription Payment',
    category: 'Crypto / Forex Scheme',
    threatLevel: 'moderate',
    summary:
      'A trader advertises a paid forex signal subscription with cherry-picked winning trade screenshots, collects lump-sum payments for a "lifetime" plan, then disappears or stops posting signals.',
    reportedCount: 61,
    lastSeen: daysAgo(21),
    platformsInvolved: ['Telegram', 'Instagram'],
    modusOperandi: [
      { order: 1, description: 'A public channel shares a stream of winning trade screenshots to build a track record.' },
      { order: 2, description: 'A paid tier is advertised offering "real-time" signals, often with a discounted lifetime option to encourage a larger upfront payment.' },
      { order: 3, description: 'Signal quality drops or stops entirely once a wave of lifetime payments has come in, with the channel eventually going quiet.' },
    ],
    redFlags: [
      'Only winning trades ever shown, with no visible losses.',
      'Pressure toward a discounted lifetime payment instead of a monthly, cancel-anytime plan.',
      'No verifiable, independently audited trading track record.',
      'Refund requests ignored or met with account blocks.',
    ],
  },
  {
    id: 'ext-sim-swap-ussd-02',
    title: 'Phishing Link Harvests BVN and OTP Before a SIM Swap Attempt',
    category: 'SIM Swap / USSD Takeover',
    threatLevel: 'critical',
    summary:
      'A message impersonating a bank or fintech app links to a fake login page that harvests BVN, card, and OTP details, which are then used to attempt a SIM swap and account takeover.',
    reportedCount: 158,
    lastSeen: daysAgo(3),
    platformsInvolved: ['SMS', 'Phishing sites', 'Bank apps'],
    modusOperandi: [
      { order: 1, description: 'An SMS or email impersonating a bank warns of suspicious activity and links to a page designed to look like the real login screen.' },
      { order: 2, description: 'The fake page collects login details, card information, and BVN under the guise of "verifying" the account.' },
      { order: 3, description: 'Collected details are used to attempt a SIM swap or directly authorize transactions, often timed for when the victim is least likely to notice.' },
    ],
    redFlags: [
      'A bank-branded message urging immediate action through a link rather than the official app.',
      'A login page URL that does not exactly match the bank\'s real domain.',
      'Any page or call asking for your BVN, full card number, or OTP directly.',
      'Unexpected loss of phone signal shortly after clicking a suspicious link.',
    ],
  },
  {
    id: 'ext-loan-app-extortion-02',
    title: 'Loan App Doctors Photos to Threaten Public Shaming',
    category: 'Loan App Extortion',
    threatLevel: 'critical',
    summary:
      'An unregistered loan app uses gallery access granted at signup to alter a borrower\'s photos and threatens to share them with contacts unless an inflated "settlement" is paid.',
    reportedCount: 84,
    lastSeen: daysAgo(9),
    platformsInvolved: ['Loan apps', 'WhatsApp'],
    modusOperandi: [
      { order: 1, description: 'Signup requires broad permissions to photos, contacts, and messages, framed as standard "verification."' },
      { order: 2, description: 'A short-term loan is disbursed with a repayment window far shorter than agreed.' },
      { order: 3, description: 'Missing the repayment date triggers threats to alter and distribute the borrower\'s photos to their saved contacts.' },
      { order: 4, description: 'A settlement figure well above the original loan is demanded to stop the threats.' },
    ],
    redFlags: [
      'Any loan app requesting access to your photo gallery to "verify" your identity.',
      'A repayment deadline that is shorter than what was agreed at signup.',
      'Threats involving your photos, contacts, or reputation.',
      'A "settlement" amount that keeps rising the longer you engage with them.',
    ],
  },
  {
    id: 'ext-loan-app-extortion-03',
    title: 'Fake Debt Collector Impersonates Police to Demand Payment',
    category: 'Loan App Extortion',
    threatLevel: 'high',
    summary:
      'A caller claiming to be from the police or EFCC threatens arrest over an old loan app debt, pressuring the target into an immediate transfer to "settle" the matter privately.',
    reportedCount: 57,
    lastSeen: daysAgo(16),
    platformsInvolved: ['Phone calls', 'Bank transfer'],
    modusOperandi: [
      { order: 1, description: 'A call or message claims to be from law enforcement, citing an unpaid loan as grounds for imminent arrest.' },
      { order: 2, description: 'Urgency and fear are used to prevent the target from verifying the claim independently.' },
      { order: 3, description: 'A direct transfer is requested to "resolve" the matter without formal legal process.' },
    ],
    redFlags: [
      'Law enforcement demanding payment over the phone to avoid arrest — this is not how debt enforcement works.',
      'Pressure to pay immediately without any written notice or case reference you can verify.',
      'A request to transfer to a personal account rather than any official channel.',
      'Refusal to let you call back through a verified public police line.',
    ],
  },
  {
    id: 'ext-delivery-package-scam-02',
    title: 'Fake Delivery Rider Requests OTP to "Confirm" a Drop-off',
    category: 'Delivery / Package Scam',
    threatLevel: 'moderate',
    summary:
      'A caller posing as a delivery rider claims an OTP was sent to confirm a package drop-off, but the code is actually a bank or account verification code the scammer needs to complete a takeover.',
    reportedCount: 69,
    lastSeen: daysAgo(13),
    platformsInvolved: ['Phone calls', 'SMS'],
    modusOperandi: [
      { order: 1, description: 'A call claims to be a courier needing to confirm delivery details for a package the victim may not even be expecting.' },
      { order: 2, description: 'The caller asks the victim to read out an OTP that was just sent to them, framing it as a delivery confirmation code.' },
      { order: 3, description: 'The code is actually tied to a bank or account action initiated by the scammer, completing an unauthorized transaction or login.' },
    ],
    redFlags: [
      'Any request to read out an OTP over the phone, for any reason.',
      'A delivery call for a package you don\'t remember ordering.',
      'Pressure to act immediately "before the rider leaves."',
      'Legitimate couriers never need you to read out a bank or account verification code.',
    ],
  },
]

async function seed() {
  const batch = db.batch()
  const collection = db.collection('scamBreakdowns')

  for (const entry of breakdowns) {
    const { id, ...data } = entry
    const docRef = collection.doc(id)
    batch.set(docRef, data, { merge: true })
  }

  await batch.commit()
  console.log(`[seed-scam-breakdowns-extended] Wrote ${breakdowns.length} documents to "scamBreakdowns".`)
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('[seed-scam-breakdowns-extended] Failed:', err)
    process.exit(1)
  })
