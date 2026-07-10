// server/api/community/lookup.get.ts
import { db } from '../../utils/firebase-admin'
import { detectIdentifierType, normalizeByType } from '../../utils/identifier-normalize'
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

export default defineEventHandler(async (event): Promise<LookupResult> => {
  const query = getQuery(event)
  const rawInput = typeof query.q === 'string' ? query.q.trim() : ''

  if (!rawInput) {
    throw createError({ statusCode: 400, statusMessage: 'A search query is required.' })
  }

  function isLookupIdentifierType(v: unknown): v is LookupIdentifierType {
    return typeof v === 'string' && v in FIELD_BY_IDENTIFIER
  }

  const identifierType: LookupIdentifierType = isLookupIdentifierType(query.type)
    ? (query.type as LookupIdentifierType)
    : (detectIdentifierType(rawInput) as LookupIdentifierType)

  const normalizedIdentifier = normalizeByType(rawInput, identifierType)
  const field = FIELD_BY_IDENTIFIER[identifierType]

  const emptyResult: LookupResult = {
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
  }

  try {
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
    }
  } catch (error) {
    console.error('[api/community/lookup] Firestore query failed:', error)
    // Do NOT return "no match" here — for a fraud-checking tool, a database
    // error must never look identical to "this identifier is clean." Fail
    // loudly with a 503 so the frontend shows "search unavailable, try
    // again" instead of implying false safety.
    throw createError({
      statusCode: 503,
      statusMessage: 'Lookup search is temporarily unavailable. Please try again shortly.',
    })
  }
})