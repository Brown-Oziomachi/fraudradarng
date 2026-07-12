// server/api/partnership.post.ts

import { checkRateLimit, recordSubmission } from '../utils/db'
type PartnerType = 'fintech' | 'journalist' | 'ngo' | ''

interface PartnershipPayload {
  fullName: string
  email: string
  orgName: string
  orgWebsite?: string
  partnerType: PartnerType
  objectives: string[]
  message?: string
}

const VALID_PARTNER_TYPES: PartnerType[] = ['fintech', 'journalist', 'ngo']
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default defineEventHandler(async (event) => {
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'

  const allowed = await checkRateLimit(ip, 'partnership')
  if (!allowed) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Too many applications submitted. Please try again later.',
    })
  }

  const body = await readBody<PartnershipPayload>(event)

  // ---------- Validation ----------
  const errors: string[] = []

  if (!body?.fullName?.trim()) errors.push('Full name is required.')
  if (!body?.email?.trim() || !EMAIL_RE.test(body.email.trim())) {
    errors.push('A valid email is required.')
  }
  if (!body?.orgName?.trim()) errors.push('Organization name is required.')
  if (!body?.partnerType || !VALID_PARTNER_TYPES.includes(body.partnerType)) {
    errors.push('A valid partner type is required.')
  }
  if (!Array.isArray(body?.objectives) || body.objectives.length === 0) {
    errors.push('At least one collaboration objective is required.')
  }

  if (errors.length > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: errors.join(' '),
    })
  }

  // ---------- Persist ----------
try {
    const docRef = await db.collection('partnershipApplications').add({
      fullName: body.fullName.trim(),
      email: body.email.trim().toLowerCase(),
      orgName: body.orgName.trim(),
      orgWebsite: body.orgWebsite?.trim() || '',
      partnerType: body.partnerType,
      objectives: body.objectives,
      message: body.message?.trim() || '',
      status: 'new',
      source: 'partnership-page',
      createdAt: new Date().toISOString(),
    })

    await db.collection('adminNotifications').add({
      type: 'partnership_application',
      title: '🤝 New Partnership Application',
      message: `${body.fullName.trim()} (${body.orgName.trim()}) applied as a ${body.partnerType} partner.`,
      applicationId: docRef.id,
      createdAt: new Date().toISOString(),
      read: false,
    })

    await recordSubmission(ip, 'partnership')

    return { success: true, id: docRef.id }
  } catch (err: any) {
    console.error('POST /api/partnership failed:', err)
    throw createError({
      statusCode: 500,
      statusMessage: 'Could not save your application. Please try again shortly.',
    })
  }
})