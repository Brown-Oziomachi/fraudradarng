import { db } from "../utils/firebase-admin"
import type { Report, NewReportInput } from '#shared/types/report'
import { FieldValue } from 'firebase-admin/firestore'
import { normalizeByType } from './identifier-normalize'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 40)
}

function buildReportSlug(input: NewReportInput): string {
  if (input.targetType === 'company' && input.companyName) {
    return slugify(input.companyName)
  }
  if (input.targetType === 'website' && (input.websiteName || input.websiteUrl)) {
    return slugify(input.websiteName || input.websiteUrl!)
  }
  if (input.targetType === 'bank_account' && input.accountName) {
    return slugify(input.accountName)
  }
  return 'report'
}

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

export async function getAllReports(
  limit = 30,
  cursorId?: string
): Promise<{ reports: Report[]; nextCursor: string | null }> {
  let query = reportsRef.orderBy('createdAt', 'desc').limit(limit)

  if (cursorId) {
    const cursorDoc = await reportsRef.doc(cursorId).get()
    if (cursorDoc.exists) {
      query = query.startAfter(cursorDoc)
    }
  }

  const snapshot = await query.get()
  const reports = snapshot.docs.map(doc => toPublicReport(doc.id, doc.data()))

  const lastDoc = snapshot.docs[snapshot.docs.length - 1]
  const nextCursor = snapshot.docs.length === limit && lastDoc ? lastDoc.id : null

  return { reports, nextCursor }
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

// Normalize every identifier-bearing field the exact same way lookup.get.ts
// normalizes a search query. If write-side and read-side ever drift apart,
// exact-match Firestore queries silently stop finding real matches.
function normalizeInput(input: NewReportInput) {
  return {
    accountNumber: input.accountNumber ? normalizeByType(input.accountNumber, 'bank_account') : undefined,
    companyName: input.companyName ? normalizeByType(input.companyName, 'company_name') : undefined,
    websiteUrl: input.websiteUrl ? normalizeByType(input.websiteUrl, 'website') : undefined,
    phoneNumber: input.phoneNumber ? normalizeByType(input.phoneNumber, 'phone_number') : undefined,
    walletTag: input.walletTag ? normalizeByType(input.walletTag, 'wallet_tag') : undefined,
  }
}

// Looks for an existing report to merge this submission into. Checks the
// primary field for the target type first (accountNumber / companyName /
// websiteUrl), then falls back to phoneNumber and walletTag — a scammer who
// reuses the same phone number or payment tag across different bank
// accounts should still resolve to one profile, not fragment into several.
async function findExistingReport(
  targetType: NewReportInput['targetType'],
  normalized: ReturnType<typeof normalizeInput>
): Promise<{ field: string; value: string; doc: FirebaseFirestore.QueryDocumentSnapshot } | null> {
  const primaryField =
    targetType === 'bank_account' ? 'accountNumber' :
    targetType === 'company' ? 'companyName' :
    targetType === 'website' ? 'websiteUrl' :
    null

  const primaryValue = primaryField ? normalized[primaryField as keyof typeof normalized] : undefined

  const candidates: Array<{ field: string; value?: string }> = [
    { field: primaryField ?? '', value: primaryValue },
    { field: 'phoneNumber', value: normalized.phoneNumber },
    { field: 'walletTag', value: normalized.walletTag },
  ]

  for (const candidate of candidates) {
    if (!candidate.field || !candidate.value) continue
    const snapshot = await reportsRef.where(candidate.field, '==', candidate.value).limit(1).get()
    if (!snapshot.empty) {
      return { field: candidate.field, value: candidate.value, doc: snapshot.docs[0]! }
    }
  }

  return null
}

export async function createReport(
  input: NewReportInput,
  reporterFingerprint: string,
  reporterIpHash: string
): Promise<Report> {

  const normalized = normalizeInput(input)
  const match = await findExistingReport(input.targetType, normalized)

  if (match) {
    const { doc } = match

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
    if (!existingData.accountNumber && normalized.accountNumber) updatePayload.accountNumber = normalized.accountNumber
    if (input.targetType === 'company' && !existingData.companyName) updatePayload.companyName = normalized.companyName
    if (input.targetType === 'website' && !existingData.websiteUrl) updatePayload.websiteUrl = normalized.websiteUrl
    // Backfill cross-identifiers even when they weren't the field that
    // matched this submission — this is what lets a later phone-number
    // search find a report that was originally filed under a bank account.
    if (!existingData.phoneNumber && normalized.phoneNumber) updatePayload.phoneNumber = normalized.phoneNumber
    if (!existingData.walletTag && normalized.walletTag) updatePayload.walletTag = normalized.walletTag
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

  const createdAt = new Date().toISOString()
  const baseSlug = buildReportSlug(input)

  const dataToSave: Record<string, unknown> = {
    ...input,
    accountNumber: normalized.accountNumber ?? input.accountNumber,
    companyName: normalized.companyName ?? input.companyName,
    websiteUrl: normalized.websiteUrl ?? input.websiteUrl,
    reportCount: 1,
    status: 'pending' as const,
    distinctReporterCount: 1,
    reporterFingerprints: [reporterFingerprint],
    reporterMeta: [{ fingerprint: reporterFingerprint, ipHash: reporterIpHash, submittedAt: createdAt }] as ReporterMetaEntry[],
    createdAt
  }

  // Only store phoneNumber/walletTag when actually provided — omit rather
  // than write empty strings, so lookup queries never match on blanks.
  if (normalized.phoneNumber) dataToSave.phoneNumber = normalized.phoneNumber
  if (normalized.walletTag) dataToSave.walletTag = normalized.walletTag

  let id = baseSlug
  let attempt = 0
  const MAX_ATTEMPTS = 5

  while (attempt < MAX_ATTEMPTS) {
    const docRef = reportsRef.doc(id)
    const existing = await docRef.get()

    if (!existing.exists) {
      await docRef.set(dataToSave)
      return { id, ...dataToSave } as Report
    }

    attempt++
    const suffix = reportsRef.doc().id.slice(0, 6).toLowerCase()
    id = `${baseSlug}_${suffix}`
  }

  // Extremely unlikely fallback: give up on the slug and use a fully random ID.
  const fallbackRef = await reportsRef.add(dataToSave)
  return { id: fallbackRef.id, ...dataToSave } as Report
}

export async function searchReports(query: string): Promise<Report[]> {
  const lowerQuery = query.toLowerCase()
  const { reports } = await getAllReports(1000)

  return reports.filter(report => {
    const additional = (report as any).additionalReports as Array<{ description?: string; reason?: string }> | undefined
    const additionalText = (additional ?? [])
      .map(a => `${a.description ?? ''} ${a.reason ?? ''}`)
      .join(' ')
      .toLowerCase()

    return (
      (report.accountName?.toLowerCase().includes(lowerQuery) ?? false) ||
      (report.accountNumber?.includes(query) ?? false) ||
      (report.bankName?.toLowerCase().includes(lowerQuery) ?? false) ||
      (report.companyName?.toLowerCase().includes(lowerQuery) ?? false) ||
      (report.websiteName?.toLowerCase().includes(lowerQuery) ?? false) ||
      (report.websiteUrl?.toLowerCase().includes(lowerQuery) ?? false) ||
      (report.phoneNumber?.includes(query) ?? false) ||
      (report.walletTag?.toLowerCase().includes(lowerQuery) ?? false) ||
      ((report as any).description?.toLowerCase().includes(lowerQuery) ?? false) ||
      ((report as any).reason?.toLowerCase().includes(lowerQuery) ?? false) ||
      additionalText.includes(lowerQuery)
    )
  })
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
  const docRef = subscribersRef.doc(email)
  const existing = await docRef.get()

  if (existing.exists) {
    return { alreadySubscribed: true }
  }

  await docRef.set({
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

export async function getReportStats(): Promise<{
  totalReports: number
  highRiskCount: number
}> {
  const [totalSnapshot, highRiskSnapshot] = await Promise.all([
    reportsRef.count().get(),
    reportsRef.where('reportCount', '>=', ESCALATION_THRESHOLD).count().get()
  ])

  return {
    totalReports: totalSnapshot.data().count,
    highRiskCount: highRiskSnapshot.data().count
  }
}

export async function deleteReport(id: string): Promise<void> {
  await reportsRef.doc(id).delete()
  // Clean up any flags pointing at this report too, so the review
  // panel doesn't keep showing flags for a report that no longer exists
  const relatedFlags = await flagsRef.where('reportId', '==', id).get()
  const batch = db.batch()
  relatedFlags.docs.forEach(doc => batch.delete(doc.ref))
  if (!relatedFlags.empty) await batch.commit()
}

export async function getPendingFlags(limit = 30): Promise<Array<Record<string, unknown>>> {
  const snapshot = await flagsRef
    .where('status', '==', 'pending')
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .get()

  // Join each flag with its report's display name, so the review panel
  // doesn't need a second round-trip per row
  const flags = await Promise.all(
    snapshot.docs.map(async (doc) => {
      const flag = doc.data()
      let entityName = flag.reportName ?? null
      if (!entityName && flag.reportId) {
        const reportDoc = await reportsRef.doc(flag.reportId).get()
        if (reportDoc.exists) {
          const r = reportDoc.data()!
          entityName = r.companyName ?? r.websiteName ?? r.accountName ?? r.accountNumber ?? 'Unknown'
        }
      }
      return { id: doc.id, ...flag, entityName: entityName ?? 'Report no longer exists' }
    })
  )

  return flags
}

export async function resolveFlag(flagId: string, action: 'dismiss' | 'resolved'): Promise<void> {
  await flagsRef.doc(flagId).update({
    status: action,
    resolvedAt: new Date().toISOString(),
  })
}