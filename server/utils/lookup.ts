import { db } from './firebase-admin'
import { detectIdentifierType, normalizeByType } from './identifier-normalize'
import type { LookupIdentifierType, LookupResult, LookupRiskLevel, ScamCategory } from '#shared/types/report'

const FIELD_BY_IDENTIFIER: Record<LookupIdentifierType, string> = {
  bank_account: 'accountNumber',
  phone_number: 'phoneNumber',
  wallet_tag: 'walletTag',
  company_name: 'companyName',
  website: 'websiteUrl',
}

function computeRiskLevel(status: string | undefined, reportCount: number): LookupRiskLevel {
  if (status === 'flagged') return 'high-risk'
  if (status === 'pending_review') return 'high-risk'
  if (reportCount > 0) return 'caution'
  return 'none'
}

function isLookupIdentifierType(v: unknown): v is LookupIdentifierType {
  return typeof v === 'string' && v in FIELD_BY_IDENTIFIER
}

// The single source of truth for "does a report exist for this identifier?" —
// used by both /api/community/lookup (the public lookup page) and
// /api/watchlist/check, so a phone/account/etc. matches identically no
// matter which entry point someone uses. Exact-match on the SAME normalized
// form used at write-time (identifier-normalize.ts), not loose substring
// search — this is what makes it reliable across formatting differences
// (e.g. "0701..." vs "+234701...").
export async function performLookup(
  rawInput: string,
  typeOverride?: unknown
): Promise<LookupResult & { reportId: string | null }> {
  const identifierType: LookupIdentifierType = isLookupIdentifierType(typeOverride)
    ? (typeOverride as LookupIdentifierType)
    : (detectIdentifierType(rawInput) as LookupIdentifierType)

  const normalizedIdentifier = normalizeByType(rawInput, identifierType)
  const field = FIELD_BY_IDENTIFIER[identifierType]

  const emptyResult: LookupResult & { reportId: string | null } = {
    query: rawInput,
    normalizedIdentifier,
    identifierType,
    matchFound: false,
    riskLevel: 'none',
    reportCount: 0,
    distinctReporterCount: 0,
    firstReportedAt: null,
    lastReportedAt: null,
    categoriesInvolved: [],
    sampleDescriptions: [],
    reportId: null,
  }

  const snapshot = await db.collection('reports').where(field, '==', normalizedIdentifier).limit(1).get()

  if (snapshot.empty) {
    return emptyResult
  }

  const doc = snapshot.docs[0]
  const data = doc!.data()

  const reportCount: number = data.reportCount ?? 1
  const distinctReporterCount: number = data.distinctReporterCount ?? 1
  const status: string | undefined = data.status
  const category: ScamCategory | undefined = data.category

  const additionalDescriptions: string[] = Array.isArray(data.additionalReports)
    ? data.additionalReports.slice(0, 2).map((r: { description?: string }) => r.description ?? '')
    : []

  const sampleDescriptions = [data.description, ...additionalDescriptions]
    .filter(Boolean)
    .slice(0, 3)

  return {
    query: rawInput,
    normalizedIdentifier,
    identifierType,
    matchFound: true,
    riskLevel: computeRiskLevel(status, reportCount),
    reportCount,
    distinctReporterCount,
    firstReportedAt: data.createdAt ?? null,
    lastReportedAt: data.updatedAt ?? data.createdAt ?? null,
    categoriesInvolved: category ? [category] : [],
    sampleDescriptions,
    reportId: doc!.id,
  }
}