export type TargetType = 'bank_account' | 'company' | 'website'
export type ScamCategory = 'fintech_ussd' | 'social_commerce' | 'visa_travel' | 'job_ponzi' | 'other'

// NEW — Pending until enough distinct reporters corroborate it
export type ReportStatus = 'pending' | 'flagged'

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

  description: string
  reason?: 'fake_transfer' | 'romance_scam' | 'job_scam' | 'investment_scam' | 'other'
  amountInvolved?: number
  contactPlatform?: string
  evidenceUrls?: string[]
  sourceUrl?: string          
  additionalReports?: ReportSubmission[]

  reportCount?: number
  status?: ReportStatus          // NEW
  distinctReporterCount?: number // NEW
  createdAt?: string
  updatedAt?: string

  // NOTE: reporterFingerprints is intentionally NOT in this type.
  // It's stored server-side only and stripped before any Report
  // ever reaches the client — see toPublicReport() in db.ts.
}

export type NewReportInput = Pick<
  Report,
  | 'targetType' | 'category'
  | 'bankName' | 'accountName' | 'accountNumber'
  | 'companyName' | 'companyAddress'
  | 'websiteUrl' | 'websiteName'
  | 'description' | 'reason' | 'amountInvolved' | 'contactPlatform' | 'evidenceUrls'
>