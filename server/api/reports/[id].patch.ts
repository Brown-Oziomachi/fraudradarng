import { getReportById, updateReport } from '../../utils/db'
import type { NewReportInput } from '#shared/types/report'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing report id' })
  }

  const existing = await getReportById(id)
  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'Report not found' })
  }

  const body = await readBody<Partial<NewReportInput>>(event)

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

 const MAX_IMAGES = 8
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
    amountInvolved: body.amountInvolved,
    contactPlatform: body.contactPlatform,
    evidenceUrls
  })

  if (!updated) {
    throw createError({ statusCode: 404, statusMessage: 'Report not found' })
  }

  return updated
})