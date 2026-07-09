// scripts/seed-scam-breakdowns.mjs
//
// One-time / re-runnable seed script for the FRNG Community Hub's
// `scamBreakdowns` Firestore collection.
//
// USAGE
//   1. Place your Firebase service account key JSON somewhere local, e.g.
//        ./serviceAccountKey.json
//      (never commit this file — add it to .gitignore)
//   2. Run:
//        GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json node scripts/seed-scam-breakdowns.mjs
//      OR set the path inline below (see SERVICE_ACCOUNT_PATH).
//   3. Re-running is safe: it upserts by a fixed doc ID per entry, so you
//      won't get duplicates if you run it more than once.
//
// This matches the ScamBreakdown shape in types/community.ts exactly.

import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'
import { readFileSync } from 'node:fs'

// ---------------------------------------------------------------------------
// 1. Init
// ---------------------------------------------------------------------------

const SERVICE_ACCOUNT_PATH =
  process.env.GOOGLE_APPLICATION_CREDENTIALS || './serviceAccountKey.json'

let serviceAccount
try {
  serviceAccount = JSON.parse(readFileSync(SERVICE_ACCOUNT_PATH, 'utf-8'))
} catch (err) {
  console.error(
    `\n[seed-scam-breakdowns] Could not read service account key at "${SERVICE_ACCOUNT_PATH}".\n` +
      `Set GOOGLE_APPLICATION_CREDENTIALS to the path of your Firebase service account JSON, or\n` +
      `place the file at ./serviceAccountKey.json next to this script.\n`
  )
  process.exit(1)
}

initializeApp({ credential: cert(serviceAccount) })
const db = getFirestore()

// ---------------------------------------------------------------------------
// 2. Helper: days-ago -> ISO-ish "recent" date, converted to Firestore Timestamp
// ---------------------------------------------------------------------------

function daysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return Timestamp.fromDate(d)
}

// ---------------------------------------------------------------------------
// 3. Seed data — one real, common pattern per ScamCategory.
//
// Written at the level a protective reader needs: named pattern, the general
// arc of how it unfolds, and the signals that give it away. Deliberately
// avoids the granular, step-by-step detail (exact scripts, specific account
// setups, named tools) that would double as a playbook for someone running
// the scam rather than someone trying to recognize it.
// ---------------------------------------------------------------------------

const breakdowns = [
  {
    id: 'task-based-ponzi-01',
    title: 'Daily "Task" Job Turns Into a Deposit Trap',
    category: 'Task-Based Ponzi',
    threatLevel: 'critical',
    summary:
      'Victims are recruited to do simple online "tasks" (liking videos, rating products) for small daily payouts, then told they must deposit their own money to unlock bigger commissions — deposits that are never returned.',
    reportedCount: 412,
    lastSeen: daysAgo(3),
    platformsInvolved: ['Telegram', 'WhatsApp', 'OPay'],
    modusOperandi: [
      { order: 1, description: 'Recruitment starts with an unsolicited message advertising easy pay for small daily online tasks.' },
      { order: 2, description: 'Early payouts are genuinely small but real, to build trust in the platform.' },
      { order: 3, description: 'Once trust is established, the platform claims a "VIP" or bulk task tier requires the user to deposit funds first.' },
      { order: 4, description: 'Withdrawals stall behind new fees or requirements once a large deposit has been made, and the account is eventually locked.' },
    ],
    redFlags: [
      'Any job that asks you to pay in before you can be paid out.',
      'Payout tiers that keep requiring a bigger deposit to "unlock".',
      'No registered company name, and support only reachable through a personal chat handle.',
      'Pressure to recruit friends into the same task group for referral bonuses.',
    ],
  },
  {
    id: 'instagram-fake-vendor-01',
    title: 'Instagram Store Disappears After Payment',
    category: 'Instagram Fake Vendor',
    threatLevel: 'high',
    summary:
      'A well-presented Instagram page sells in-demand items at prices below market rate, collects payment via a personal transfer, and either ships nothing or disappears entirely.',
    reportedCount: 268,
    lastSeen: daysAgo(6),
    platformsInvolved: ['Instagram', 'WhatsApp', 'PalmPay'],
    modusOperandi: [
      { order: 1, description: 'A page is built up with reposted product photos and paid or bought engagement to look established.' },
      { order: 2, description: 'Prices are set noticeably below what the item sells for elsewhere, to create urgency.' },
      { order: 3, description: 'The buyer is moved off Instagram into a DM or WhatsApp chat and asked to pay directly to a personal account.' },
      { order: 4, description: 'After payment, the page either stalls with excuses or blocks the buyer and is deleted shortly after.' },
    ],
    redFlags: [
      'Prices significantly below what the same product costs anywhere else.',
      'Payment requested to a personal account name rather than a registered business account.',
      'No verifiable physical store, reviews, or delivery track record outside the page itself.',
      'Seller insists on moving the conversation off-platform before any payment is made.',
    ],
  },
  {
    id: 'romance-relationship-01',
    title: 'Long-Distance "Relationship" Builds to a Financial Ask',
    category: 'Romance / Relationship',
    threatLevel: 'high',
    summary:
      'A romantic connection is built over weeks or months on a dating app or social media, almost always without the two people ever meeting or video-calling, before a financial emergency is introduced.',
    reportedCount: 189,
    lastSeen: daysAgo(9),
    platformsInvolved: ['Facebook', 'WhatsApp', 'Dating apps'],
    modusOperandi: [
      { order: 1, description: 'Contact begins on a dating app or social platform with a profile presenting as based abroad or in a prestigious role.' },
      { order: 2, description: 'Conversation moves quickly to daily messaging and affectionate language, but video calls are consistently avoided or excused.' },
      { order: 3, description: 'A believable emergency is introduced — customs, medical, travel, or business trouble — that only money can resolve.' },
      { order: 4, description: 'Requests escalate gradually rather than all at once, with each payment framed as "the last one" before reuniting.' },
    ],
    redFlags: [
      'A partner who has never appeared on a live video call despite months of contact.',
      'Any request for money, gift cards, or crypto tied to travel, customs, or a sudden emergency.',
      'Inconsistent details about their job, location, or family when asked directly.',
      'Urgency and secrecy — being asked not to mention the relationship or the requests to friends or family.',
    ],
  },
  {
    id: 'fake-job-offer-01',
    title: 'Remote Job Offer Requires "Training Fee" Upfront',
    category: 'Fake Job Offer',
    threatLevel: 'high',
    summary:
      'A recruiter reaches out unprompted with a high-paying remote role and, after a brief informal "interview," asks for a fee to cover training materials, a work laptop, or onboarding before the job can start.',
    reportedCount: 231,
    lastSeen: daysAgo(4),
    platformsInvolved: ['LinkedIn', 'Telegram', 'Email'],
    modusOperandi: [
      { order: 1, description: 'Contact arrives as an unsolicited message offering a well-paid remote position with minimal qualifications required.' },
      { order: 2, description: 'A short, informal interview over chat replaces any real vetting process.' },
      { order: 3, description: 'The candidate is told they are hired, then asked to pay for equipment, a background check, or training material before starting.' },
      { order: 4, description: 'After payment, onboarding stalls indefinitely or the recruiter stops responding.' },
    ],
    redFlags: [
      'A job offer that arrives before any application was submitted.',
      'Any request to pay for training, equipment, or a background check as a new hire.',
      'A company with no verifiable website, registration, or independent employee reviews.',
      'Interviews conducted entirely over chat, never a call or video meeting.',
    ],
  },
  {
    id: 'crypto-forex-scheme-01',
    title: '"Guaranteed Returns" Investment Group Collapses',
    category: 'Crypto / Forex Scheme',
    threatLevel: 'critical',
    summary:
      'An investment group promises fixed daily or weekly returns on crypto or forex trading far above what any legitimate market offers, pays early investors from new deposits, then shuts down once inflows slow.',
    reportedCount: 356,
    lastSeen: daysAgo(2),
    platformsInvolved: ['Telegram', 'WhatsApp', 'Crypto wallets'],
    modusOperandi: [
      { order: 1, description: 'A group or "mentor" advertises consistent, fixed returns from crypto or forex trading, often shown through screenshots of past payouts.' },
      { order: 2, description: 'New members are encouraged to start small, and early withdrawals are honored to build confidence.' },
      { order: 3, description: 'Members are pushed to deposit larger amounts and recruit others, since new deposits are what fund existing payouts.' },
      { order: 4, description: 'Withdrawals slow, then stop, usually blamed on a "system upgrade" or regulatory issue, shortly before the group disappears.' },
    ],
    redFlags: [
      'Fixed or "guaranteed" daily returns — real trading and investing carry risk and variable returns.',
      'Pressure to recruit others as a condition of higher payouts.',
      'No independently verifiable trading license, fund registration, or audited track record.',
      'Sudden platform downtime or excuses right as large numbers of members try to withdraw.',
    ],
  },
  {
    id: 'sim-swap-ussd-01',
    title: 'SIM Swap Used to Drain Bank and Wallet Apps',
    category: 'SIM Swap / USSD Takeover',
    threatLevel: 'critical',
    summary:
      'An attacker who has gathered enough personal information convinces a telecom agent to reissue a victim\'s number onto a new SIM, then uses that number to intercept OTPs and take over banking and wallet apps.',
    reportedCount: 174,
    lastSeen: daysAgo(5),
    platformsInvolved: ['Telecom agents', 'Bank USSD', 'Fintech apps'],
    modusOperandi: [
      { order: 1, description: 'Personal details are gathered beforehand, often through phishing links, data leaks, or social engineering.' },
      { order: 2, description: 'Those details are used to impersonate the victim at a telecom point of sale and request a replacement SIM for the number.' },
      { order: 3, description: 'Once the number is active on the attacker\'s device, they use it to receive one-time passcodes for banking and fintech apps.' },
      { order: 4, description: 'Funds are moved out quickly across multiple accounts before the victim regains control of their line.' },
    ],
    redFlags: [
      'Your phone suddenly loses network signal with no explanation, especially after being asked for personal details.',
      'Unexpected "SIM registration" or "number reactivated" SMS notifications you did not request.',
      'OTP messages arriving for logins or transactions you did not initiate.',
      'Any unsolicited call asking to "verify" your SIM, BVN, or bank details.',
    ],
  },
  {
    id: 'loan-app-extortion-01',
    title: 'Loan App Threatens Contacts Over Small Debt',
    category: 'Loan App Extortion',
    threatLevel: 'high',
    summary:
      'An unregistered loan app grants a small, high-interest loan after requesting full contact-list and photo access, then uses that access to harass and threaten the borrower and their contacts if repayment is late.',
    reportedCount: 203,
    lastSeen: daysAgo(7),
    platformsInvolved: ['Loan apps', 'SMS', 'WhatsApp'],
    modusOperandi: [
      { order: 1, description: 'A loan app advertises fast approval with minimal documentation, requiring broad permissions to contacts, gallery, and messages during signup.' },
      { order: 2, description: 'A small loan is disbursed quickly, with interest and fees far above formal lending rates and a very short repayment window.' },
      { order: 3, description: 'If repayment is late by even a day, the app begins messaging the borrower\'s saved contacts with manipulated images or false claims.' },
      { order: 4, description: 'Continued harassment is used to pressure the borrower into repaying inflated amounts to make it stop.' },
    ],
    redFlags: [
      'An app that requests access to your full contact list, gallery, or messages to approve a loan.',
      'No visible registration with the relevant financial regulator.',
      'Interest and fees that are unclear or change after the loan is disbursed.',
      'Any threat to contact your family, friends, or employer over a debt.',
    ],
  },
  {
    id: 'delivery-package-scam-01',
    title: '"Customs Clearance Fee" for a Package That Doesn\'t Exist',
    category: 'Delivery / Package Scam',
    threatLevel: 'moderate',
    summary:
      'A message claims a package or gift is being held at customs or a courier depot and requests a "clearance fee" before it can be released — the package does not exist.',
    reportedCount: 121,
    lastSeen: daysAgo(11),
    platformsInvolved: ['SMS', 'WhatsApp', 'Email'],
    modusOperandi: [
      { order: 1, description: 'An unsolicited message claims a parcel addressed to the victim is being held, often citing a courier or customs office by name.' },
      { order: 2, description: 'A small "clearance", "storage", or "verification" fee is requested to release the item.' },
      { order: 3, description: 'Once paid, a new fee is often introduced, or the sender goes silent and no delivery ever arrives.' },
    ],
    redFlags: [
      'A package notification for an item you never ordered or were not expecting.',
      'Any request to pay a fee via personal transfer to release a delivery.',
      'Courier or customs contact that only exists through a chat app, not an official tracking portal.',
      'Urgency to pay quickly to avoid the package being "returned" or "destroyed".',
    ],
  },
]

// ---------------------------------------------------------------------------
// 4. Write to Firestore
// ---------------------------------------------------------------------------

async function seed() {
  const batch = db.batch()
  const collection = db.collection('scamBreakdowns')

  for (const entry of breakdowns) {
    const { id, ...data } = entry
    const docRef = collection.doc(id)
    batch.set(docRef, data, { merge: true })
  }

  await batch.commit()
  console.log(`[seed-scam-breakdowns] Wrote ${breakdowns.length} documents to "scamBreakdowns".`)
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('[seed-scam-breakdowns] Failed:', err)
    process.exit(1)
  })
