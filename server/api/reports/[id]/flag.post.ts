// server/api/reports/[id]/flag.post.ts
import { flagReport } from '../../../utils/db'

interface FlagBody {
  reason?: string
  reportName?: string
  details?: string
  evidenceLink?: string | null
  evidenceImages?: string[]
  reporterEmail?: string | null
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing report id' })
  }

  const body = await readBody<FlagBody>(event)
  if (!body.reason) {
    throw createError({ statusCode: 400, statusMessage: 'Missing reason' })
  }

  await flagReport(id, {
    reason: body.reason,
    reportName: body.reportName ?? null,
    details: body.details?.trim() || null,
    evidenceLink: body.evidenceLink?.trim() || null,
    evidenceImages: Array.isArray(body.evidenceImages) ? body.evidenceImages : [],
    reporterEmail: body.reporterEmail?.trim() || null
  })

  setResponseStatus(event, 201)
  return { success: true }
})