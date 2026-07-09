import type { Report } from '#shared/types/report'

export const CATEGORY_LABELS: Record<string, string> = {
  fintech_ussd: 'Fintech & USSD exploit',
  social_commerce: 'Social commerce scam',
  visa_travel: 'Visa / travel logistics fraud',
  job_ponzi: 'Job or Ponzi scheme',
  other: 'Other fraud'
}

export interface DisplayField {
  label: string
  value: string
}

export function getReportDisplayName(r: Partial<Report>): string {
  if (r.targetType === 'company') return r.companyName || 'Company report'
  if (r.targetType === 'website') return r.websiteName || r.websiteUrl || 'Website report'
  if (r.targetType === 'bank_account') return r.accountName || r.bankName || 'Bank account report'
  return r.description?.slice(0, 40) || 'Untitled report'
}

export function getTypeLabel(r: Partial<Report>): string {
  if (r.targetType === 'company') return 'Company'
  if (r.targetType === 'website') return 'Website'
  return 'Bank Account'
}

export function getCategoryLabel(r: Partial<Report>): string {
  if (!r.category) return ''
  return CATEGORY_LABELS[r.category] ?? ''
}

export function getDetailFields(r: Partial<Report>): DisplayField[] {
  if (r.targetType === 'company') {
    return [
      { label: 'Company name', value: r.companyName ?? '' },
      { label: 'Address', value: r.companyAddress ?? '' }
    ].filter(f => f.value)
  }
  if (r.targetType === 'website') {
    return [
      { label: 'Website name', value: r.websiteName ?? '' },
      { label: 'Website URL', value: r.websiteUrl ?? '' }
    ].filter(f => f.value)
  }
  return [
    { label: 'Account name', value: r.accountName ?? '' },
    { label: 'Bank name', value: r.bankName ?? '' },
    { label: 'Account number', value: r.accountNumber ?? '' }
  ].filter(f => f.value)
}

export function getSharedFields(r: Partial<Report>): DisplayField[] {
  const fields: DisplayField[] = []
  if (r.amountInvolved != null) {
    fields.push({ label: 'Amount involved', value: `₦${Number(r.amountInvolved).toLocaleString()}` })
  }
  if (r.contactPlatform) {
    fields.push({ label: 'Contact platform', value: r.contactPlatform })
  }
  return fields
}