// server/utils/identifier-normalize.ts
//
// Single source of truth for turning "however a person typed it" into
// "however it's stored in Firestore" — used by both createReport's dedup
// logic and the lookup search route, so the two never drift apart.

import type { LookupIdentifierType } from '#shared/types/report'

export function normalizePhoneNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  // Normalize Nigerian numbers to a consistent 234-prefixed form:
  // 08012345678 -> 2348012345678, +2348012345678 -> 2348012345678
  if (digits.startsWith('234')) return digits
  if (digits.startsWith('0')) return `234${digits.slice(1)}`
  return digits
}

export function normalizeWalletTag(raw: string): string {
  return raw.trim().toLowerCase().replace(/^@/, '')
}

export function normalizeAccountNumber(raw: string): string {
  return raw.replace(/\D/g, '')
}

export function normalizeCompanyName(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, ' ')
}

export function normalizeWebsiteUrl(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/+$/, '')
}

/**
 * Guesses the identifier type from shape alone, so the lookup UI can offer
 * a single search box instead of forcing the user to pick a category first.
 * Order matters: check the most specific/constrained shapes first.
 */
export function detectIdentifierType(raw: string): LookupIdentifierType {
  const trimmed = raw.trim()

  const digitsOnly = trimmed.replace(/\D/g, '')
  const isMostlyDigits = digitsOnly.length >= 7 && digitsOnly.length / trimmed.replace(/\s/g, '').length > 0.7

  if (isMostlyDigits) {
    // Nigerian phone numbers: 11 digits starting with 0, or 13 with 234 prefix.
    if (digitsOnly.length === 11 && digitsOnly.startsWith('0')) return 'phone_number'
    if (digitsOnly.length === 13 && digitsOnly.startsWith('234')) return 'phone_number'
    // Nigerian bank account numbers are 10 digits (NUBAN standard).
    if (digitsOnly.length === 10) return 'bank_account'
    // Fall back to phone if it's long and digit-heavy but doesn't match NUBAN.
    if (digitsOnly.length >= 10) return 'phone_number'
  }

  if (trimmed.startsWith('@')) return 'wallet_tag'

  if (/\.(com|ng|net|org|store|shop)$/i.test(trimmed) || trimmed.includes('.')) {
    return 'website'
  }

  return 'company_name'
}

export function normalizeByType(raw: string, type: LookupIdentifierType): string {
  switch (type) {
    case 'phone_number':
      return normalizePhoneNumber(raw)
    case 'wallet_tag':
      return normalizeWalletTag(raw)
    case 'bank_account':
      return normalizeAccountNumber(raw)
    case 'website':
      return normalizeWebsiteUrl(raw)
    case 'company_name':
      return normalizeCompanyName(raw)
  }
}