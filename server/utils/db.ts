import { db } from "../utils/firebase-admin"
import type { Report, NewReportInput } from '#shared/types/report'
import { FieldValue } from 'firebase-admin/firestore'

const reportsRef = db.collection('reports')

const ESCALATION_THRESHOLD = 3
// If 3+ distinct fingerprints escalate a report but they all share the same
// ipHash within this window, treat it as suspicious clustering rather than
// confirmed independent reporters — route to manual review instead of
// auto-flagging.
const SUSPICIOUS_WINDOW_MS = 15 * 60 * 1000 // 15 minutes

function toPublicReport(id: string, data: FirebaseFirestore.DocumentData): Report {
  const { reporterFingerprints, reporterMeta, ...rest } = data
  return { id, ...rest } as Report
}

export async function getAllReports(): Promise<Report[]> {
  const snapshot = await reportsRef.orderBy('createdAt', 'desc').get()
  return snapshot.docs.map(doc => toPublicReport(doc.id, doc.data()))
}

interface ReporterMetaEntry {
  fingerprint: string
  ipHash: string
  submittedAt: string
}

// Returns true if the distinct fingerprints backing this escalation all
// cluster around a single ipHash within the suspicious window — i.e. it
// looks like one actor cycling identity rather than genuinely independent
// reporters.
function looksLikeSuspiciousClustering(meta: ReporterMetaEntry[]): boolean {
  if (meta.length < ESCALATION_THRESHOLD) return false

  const recent = meta.filter(
    m => Date.now() - new Date(m.submittedAt).getTime() <= SUSPICIOUS_WINDOW_MS
  )
  if (recent.length < ESCALATION_THRESHOLD) return false

  const uniqueIpHashes = new Set(recent.map(m => m.ipHash))
  // All recent distinct-fingerprint submissions came from the same network —
  // could be legitimate CGNAT, could be one person. Flag for review rather
  // than deciding automatically either way.
  return uniqueIpHashes.size === 1
}

export async function createReport(
  input: NewReportInput,
  reporterFingerprint: string,
  reporterIpHash: string
): Promise<Report> {

  let dedupField: string | null = null
  let dedupValue: string | undefined

  if (input.targetType === 'bank_account' && input.accountNumber) {
    dedupField = 'accountNumber'
    dedupValue = input.accountNumber
  } else if (input.targetType === 'company' && input.companyName) {
    dedupField = 'companyName'
    dedupValue = input.companyName
  } else if (input.targetType === 'website' && input.websiteUrl) {
    dedupField = 'websiteUrl'
    dedupValue = input.websiteUrl
  }

  if (dedupField && dedupValue) {
    const existing = await reportsRef
      .where(dedupField, '==', dedupValue)
      .limit(1)
      .get()

    if (!existing.empty) {
      const doc = existing.docs[0]

      if (!doc) {
        throw createError({ statusCode: 500, statusMessage: 'Unexpected empty result' })
      }

      const existingData = doc.data()
      const existingFingerprints: string[] = existingData.reporterFingerprints ?? []
      const existingMeta: ReporterMetaEntry[] = existingData.reporterMeta ?? []
      const isNewReporter = !existingFingerprints.includes(reporterFingerprint)

      const submission: Record<string, unknown> = {
        description: input.description,
        createdAt: new Date().toISOString()
      }
      if (input.reason !== undefined) submission.reason = input.reason
      if (input.amountInvolved !== undefined) submission.amountInvolved = input.amountInvolved
      if (input.contactPlatform !== undefined) submission.contactPlatform = input.contactPlatform
      if (input.evidenceUrls?.length) submission.evidenceUrls = input.evidenceUrls

      const newDistinctCount = (existingData.distinctReporterCount ?? 1) + (isNewReporter ? 1 : 0)
      const alreadyFlagged = existingData.status === 'flagged'
      const alreadyInReview = existingData.status === 'pending_review'
      const meetsThreshold = newDistinctCount >= ESCALATION_THRESHOLD

      const updatedMeta: ReporterMetaEntry[] = isNewReporter
        ? [...existingMeta, { fingerprint: reporterFingerprint, ipHash: reporterIpHash, submittedAt: new Date().toISOString() }]
        : existingMeta

      let nextStatus: string = existingData.status ?? 'pending'
      if (!alreadyFlagged && !alreadyInReview && meetsThreshold) {
        nextStatus = looksLikeSuspiciousClustering(updatedMeta) ? 'pending_review' : 'flagged'
      }

      const updatePayload: Record<string, unknown> = {
        reportCount: FieldValue.increment(1),
        additionalReports: FieldValue.arrayUnion(submission),
        status: nextStatus
      }

      if (!existingData.createdAt) updatePayload.createdAt = new Date().toISOString()
      if (!existingData.targetType) updatePayload.targetType = input.targetType
      if (!existingData.description) updatePayload.description = input.description
      if (input.targetType === 'bank_account' && !existingData.bankName) updatePayload.bankName = input.bankName
      if (input.targetType === 'company' && !existingData.companyName) updatePayload.companyName = input.companyName
      if (input.targetType === 'website' && !existingData.websiteUrl) updatePayload.websiteUrl = input.websiteUrl
      if (existingData.reportCount == null) updatePayload.reportCount = 1

      if (input.evidenceUrls?.length) {
        updatePayload.evidenceUrls = FieldValue.arrayUnion(...input.evidenceUrls)
      }

      if (isNewReporter) {
        updatePayload.reporterFingerprints = FieldValue.arrayUnion(reporterFingerprint)
        updatePayload.reporterMeta = updatedMeta
        updatePayload.distinctReporterCount = newDistinctCount
      }

      await doc.ref.update(updatePayload)
      const refreshed = await doc.ref.get()
      return toPublicReport(refreshed.id, refreshed.data()!)
    }
  }

  const createdAt = new Date().toISOString()
  const docRef = await reportsRef.add({
    ...input,
    reportCount: 1,
    status: 'pending' as const,
    distinctReporterCount: 1,
    reporterFingerprints: [reporterFingerprint],
    reporterMeta: [{ fingerprint: reporterFingerprint, ipHash: reporterIpHash, submittedAt: createdAt }] as ReporterMetaEntry[],
    createdAt
  })

  return {
    id: docRef.id,
    ...input,
    reportCount: 1,
    status: 'pending',
    distinctReporterCount: 1,
    createdAt
  } as Report
}

export async function searchReports(query: string): Promise<Report[]> {
  const lowerQuery = query.toLowerCase()
  const all = await getAllReports()

  return all.filter(report =>
    (report.accountName?.toLowerCase().includes(lowerQuery) ?? false) ||
    (report.accountNumber?.includes(query) ?? false) ||
    (report.bankName?.toLowerCase().includes(lowerQuery) ?? false) ||
    (report.companyName?.toLowerCase().includes(lowerQuery) ?? false) ||
    (report.websiteName?.toLowerCase().includes(lowerQuery) ?? false) ||
    (report.websiteUrl?.toLowerCase().includes(lowerQuery) ?? false)
  )
}

export async function getReportById(id: string): Promise<Report | null> {
  const doc = await reportsRef.doc(id).get()
  if (!doc.exists) return null
  return toPublicReport(doc.id, doc.data()!)
}

// ... checkRateLimit, recordSubmission, flagReport, addContactMessage,
// addSubscriber, updateReport — unchanged, keep exactly as you have them

const rateLimitRef = db.collection('rate_limits')

export async function checkRateLimit(ip: string, action: string = 'report'): Promise<boolean> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()

  const recentSubmissions = await rateLimitRef
    .where('ip', '==', ip)
    .where('action', '==', action)
    .where('submittedAt', '>', oneHourAgo)
    .get()

  const MAX_PER_HOUR = 5

  return recentSubmissions.size < MAX_PER_HOUR
}

export async function recordSubmission(ip: string, action: string = 'report'): Promise<void> {
  await rateLimitRef.add({
    ip,
    action,
    submittedAt: new Date().toISOString()
  })
}

const flagsRef = db.collection('report_flags')

interface FlagInput {
  reason: string
  reportName?: string | null
  details?: string | null
  evidenceLink?: string | null
  evidenceImages?: string[]
  reporterEmail?: string | null
}

export async function flagReport(reportId: string, input: FlagInput): Promise<void> {
  await flagsRef.add({
    reportId,
    reason: input.reason,
    reportName: input.reportName ?? null,
    details: input.details ?? null,
    evidenceLink: input.evidenceLink ?? null,
    evidenceImages: input.evidenceImages ?? [],
    reporterEmail: input.reporterEmail ?? null,
    createdAt: new Date().toISOString(),
    status: 'pending'
  })
}

const contactMessagesRef = db.collection('contact_messages')

export async function addContactMessage(data: { name: string; email: string; message: string }): Promise<void> {
  await contactMessagesRef.add({
    ...data,
    createdAt: new Date().toISOString()
  })
}

const subscribersRef = db.collection('subscribers')

export async function addSubscriber(email: string): Promise<{ alreadySubscribed: boolean }> {
  // Avoid adding the same email twice.
  const existing = await subscribersRef.where('email', '==', email).limit(1).get()

  if (!existing.empty) {
    return { alreadySubscribed: true }
  }

  await subscribersRef.add({
    email,
    subscribedAt: new Date().toISOString()
  })

  return { alreadySubscribed: false }
}

export async function updateReport(
  id: string,
  updates: Partial<NewReportInput>
): Promise<Report | null> {
  const docRef = reportsRef.doc(id)
  const doc = await docRef.get()

  if (!doc.exists) {
    return null
  }

  const updatedAt = new Date().toISOString()

  const payload: Record<string, unknown> = { updatedAt }
  for (const [key, value] of Object.entries(updates)) {
    payload[key] = value === null ? FieldValue.delete() : value
  }

  await docRef.update(payload)

  const refreshed = await docRef.get()
  return { id: refreshed.id, ...refreshed.data() } as Report
}