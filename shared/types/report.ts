// #shared/types/report.ts

export type TargetType =
  | 'bank_account'
  | 'company'
  | 'website'
  | 'phone_number'   
  | 'digital_wallet' 

export type ScamCategory = 'fintech_ussd' | 'social_commerce' | 'visa_travel' | 'job_ponzi' | 'other'

export type ReportStatus = 'pending' | 'flagged' | 'pending_review'

export interface ReportSubmission {
  description: string
  reason?: 'fake_transfer' | 'romance_scam' | 'job_scam' | 'investment_scam' | 'other'
  amountInvolved?: number
  contactPlatform?: string
  evidenceUrls?: string[]
  createdAt: string
}

export interface Report {
  id: string
  targetType: TargetType
  category?: ScamCategory

  bankName?: string
  accountName?: string
  accountNumber?: string
  companyName?: string
  companyAddress?: string
  websiteUrl?: string
  websiteName?: string

  // NEW LOOKUP — phone_number target type
  phoneNumber?: string

  // NEW LOOKUP — digital_wallet target type (OPay/PalmPay/Moniepoint tags)
  walletProvider?: 'opay' | 'palmpay' | 'moniepoint' | 'other'
  walletTag?: string

  description: string
  reason?: 'fake_transfer' | 'romance_scam' | 'job_scam' | 'investment_scam' | 'other'
  amountInvolved?: number
  contactPlatform?: string
  evidenceUrls?: string[]
  sourceUrl?: string
  additionalReports?: ReportSubmission[]

  reportCount?: number
  status?: ReportStatus
  distinctReporterCount?: number
  createdAt?: string
  updatedAt?: string
}

export type NewReportInput = Pick<
  Report,
  | 'targetType' | 'category'
  | 'bankName' | 'accountName' | 'accountNumber'
  | 'companyName' | 'companyAddress'
  | 'websiteUrl' | 'websiteName'
  | 'phoneNumber'                    // NEW LOOKUP
  | 'walletProvider' | 'walletTag'   // NEW LOOKUP
  | 'description' | 'reason' | 'amountInvolved' | 'contactPlatform' | 'evidenceUrls'
>

// ---------------------------------------------------------------------------
// NEW LOOKUP — types for the "check before you pay" search feature
// ---------------------------------------------------------------------------

export type LookupIdentifierType =
  | 'bank_account'
  | 'phone_number'
  | 'wallet_tag'
  | 'company_name'
  | 'website'

export type LookupRiskLevel = 'none' | 'caution' | 'high-risk'

export interface LookupResult {
  query: string
  normalizedIdentifier: string
  identifierType: LookupIdentifierType
  matchFound: boolean
  riskLevel: LookupRiskLevel
  reportCount: number
  distinctReporterCount: number
  firstReportedAt: string | null
  lastReportedAt: string | null
  categoriesInvolved: ScamCategory[]
  sampleDescriptions: string[] // redacted, capped, no reporter PII
}