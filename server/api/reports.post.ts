import { createReport, checkRateLimit, recordSubmission } from '../utils/db'
import { getReporterFingerprint, getReporterIpHash } from '../utils/reporterFingerprint'
import type { NewReportInput } from '#shared/types/report'

export default defineEventHandler(async (event) => {
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'

  const allowed = await checkRateLimit(ip)
  if (!allowed) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Too many reports submitted. Please try again later.'
    })
  }

  const body = await readBody<Partial<NewReportInput>>(event)

  if (!body.targetType || !body.description) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required field' })
  }

  if (body.targetType === 'bank_account') {
    if (!body.bankName || !body.accountName || !body.accountNumber) {
      throw createError({ statusCode: 400, statusMessage: 'Missing bank account details' })
    }
  } else if (body.targetType === 'company') {
    if (!body.companyName) {
      throw createError({ statusCode: 400, statusMessage: 'Missing company name' })
    }
  } else if (body.targetType === 'website') {
    if (!body.websiteUrl) {
      throw createError({ statusCode: 400, statusMessage: 'Missing website URL' })
    }
  } else {
    throw createError({ statusCode: 400, statusMessage: 'Invalid target type' })
  }

  const MAX_IMAGES = 5
  const evidenceUrls = body.evidenceUrls?.slice(0, MAX_IMAGES)

  const reporterFingerprint = getReporterFingerprint(event)
  const reporterIpHash = getReporterIpHash(event)

  const report = await createReport(
    {
      targetType: body.targetType,
      category: body.category,
      bankName: body.bankName,
      accountName: body.accountName,
      accountNumber: body.accountNumber,
      companyName: body.companyName,
      companyAddress: body.companyAddress,
      websiteUrl: body.websiteUrl,
      websiteName: body.websiteName,
      description: body.description,
      reason: body.reason,
      amountInvolved: body.amountInvolved,
      contactPlatform: body.contactPlatform,
      evidenceUrls
    },
    reporterFingerprint,
    reporterIpHash
  )

  await recordSubmission(ip)

  setResponseStatus(event, 201)
  return report
})