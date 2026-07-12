import { createReport, checkRateLimit, recordSubmission } from '../utils/db'
import { getReporterFingerprint, getReporterIpHash, getReporterDeviceId } from '../utils/reporterFingerprint'
import { checkBlocked, getStrikeCount, WARN_AT } from '../utils/abuse-tracking'
import type { NewReportInput } from '#shared/types/report'

export default defineEventHandler(async (event) => {
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'

  const allowed = await checkRateLimit(ip, 'partnership')
  if (!allowed) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Too many applications submitted. Please try again later.',
    })
  }

  const identity = {
    fingerprint: getReporterFingerprint(event),
    ipHash: getReporterIpHash(event),
    deviceId: getReporterDeviceId(event),
  }

  const blockStatus = await checkBlocked(identity)
  if (blockStatus.blocked) {
    throw createError({ statusCode: 403, statusMessage: blockStatus.reason })
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
      evidenceUrls,
    },
    identity.fingerprint,
    identity.ipHash,
    identity.deviceId
  )

  await recordSubmission(ip)

  const strikeCount = await getStrikeCount(identity)
  const warned = strikeCount >= WARN_AT

  setResponseStatus(event, 201)
  return {
    ...report,
    warned,
    strikeCount,
    ...(warned && {
      warningMessage: `You've received ${strikeCount} strike${strikeCount === 1 ? '' : 's'} for past inaccurate or misleading reports. Continued violations may restrict your ability to submit reports.`
    })
  }
})