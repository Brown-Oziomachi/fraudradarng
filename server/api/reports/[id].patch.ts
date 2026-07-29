import { getReportById, updateReport, updateSubmission, getMainSubmissionFingerprint } from '../../utils/db'
import { getReporterFingerprint } from '../../utils/reporterFingerprint'
import type { NewReportInput } from '#shared/types/report'

const MAX_IMAGES = 8

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing report id' })
  }

  const body = await readBody<Partial<NewReportInput> & { submissionId?: string }>(event)
  const fingerprint = getReporterFingerprint(event)


  if (body.submissionId) {
    if (!body.description) {
      throw createError({ statusCode: 400, statusMessage: 'Missing required field' })
    }

    try {
      const updated = await updateSubmission(id, body.submissionId, fingerprint, {
        description: body.description,
        amountInvolved: body.amountInvolved,
        contactPlatform: body.contactPlatform,
        evidenceUrls: body.evidenceUrls?.slice(0, MAX_IMAGES)
      })
      if (!updated) {
        throw createError({ statusCode: 404, statusMessage: 'Submission not found' })
      }
      return updated
    } catch (err: any) {
      if (err?.message === 'FORBIDDEN') {
        throw createError({ statusCode: 403, statusMessage: 'You can only edit your own submission.' })
      }
      throw err
    }
  }

  // ---- Legacy path: full-entity edit, reserved for the main reporter ----
  const existing = await getReportById(id)
  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'Report not found' })
  }

  const ownerFingerprint = await getMainSubmissionFingerprint(id)
  if (ownerFingerprint && ownerFingerprint !== fingerprint) {
    throw createError({ statusCode: 403, statusMessage: 'You can only edit your own report.' })
  }

  if (!body.targetType || !body.description) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required field' })
  }

  // Same per-target validation as create, re-checked server-side
  // since the client can't be trusted alone.
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

  const evidenceUrls = body.evidenceUrls?.slice(0, MAX_IMAGES)

  const updated = await updateReport(id, {
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
    state: body.state,
    amountInvolved: body.amountInvolved,
    contactPlatform: body.contactPlatform,
    evidenceUrls
  })

  if (!updated) {
    throw createError({ statusCode: 404, statusMessage: 'Report not found' })
  }

  return updated
})