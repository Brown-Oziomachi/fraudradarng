import { searchReports } from '~~/server/utils/db'
import { db } from '~~/server/utils/firebase-admin'
import { sendTelegramMessage } from '~~/server/utils/telegram'
import { getReportDisplayName, getTypeLabel, getCategoryLabel } from '~~/shared/utils/reportDisplay'

const rateLimitRef = db.collection('telegram_rate_limits')
const MAX_LOOKUPS_PER_HOUR = 15 // generous — this is a lookup tool, not a submission form

async function checkTelegramRateLimit(chatId: number): Promise<boolean> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const snap = await rateLimitRef
    .where('chatId', '==', chatId)
    .where('timestamp', '>', oneHourAgo)
    .get()
  return snap.size < MAX_LOOKUPS_PER_HOUR
}

async function recordTelegramLookup(chatId: number): Promise<void> {
  await rateLimitRef.add({ chatId, timestamp: new Date().toISOString() })
}

const WELCOME_MESSAGE =
  `👋 <b>Welcome to Fraud Radar NG</b>\n\n` +
  `Send me an account number, phone number, company name, or website — I'll check it against reports filed on fraudradar.ng.\n\n` +
  `Example: <code>0123456789</code> or <code>john-scam.com</code>`

const HELP_MESSAGE =
  `Just type or paste any of these and I'll check it:\n` +
  `• A bank account number\n` +
  `• A phone number\n` +
  `• A company or website name\n\n` +
  `I'll reply with what's been reported, if anything.`

function formatResults(results: Awaited<ReturnType<typeof searchReports>>, query: string): string {
  if (!results.length) {
    return (
      `✅ No reports found for "<b>${escapeHtml(query)}</b>".\n\n` +
      `This doesn't guarantee it's safe — always verify independently. ` +
      `You can also check the full record at fraudradar.ng.`
    )
  }

  const lines = results.slice(0, 5).map((r) => {
    const name = getReportDisplayName(r)
    const type = getTypeLabel(r)
    const category = getCategoryLabel(r)
    const count = (r as any).reportCount ?? 1
    const isFlagged = (r as any).status === 'flagged'
    const icon = isFlagged ? '🚨' : '⚠️'
    const riskLine = isFlagged
      ? `${count} independent reports — high risk`
      : `${count} report${count === 1 ? '' : 's'} filed — unverified`

    return (
      `${icon} <b>${escapeHtml(name)}</b> (${escapeHtml(type)}${category ? ` · ${escapeHtml(category)}` : ''})\n` +
      `${riskLine}\n` +
      `fraudradar.ng/reports/${r.id}`
    )
  })

  const header = results.length > 5
    ? `Found ${results.length} matching reports — showing the top 5:\n\n`
    : `Found ${results.length} matching report${results.length === 1 ? '' : 's'}:\n\n`

  return header + lines.join('\n\n')
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export default defineEventHandler(async (event) => {
  const configuredSecret = useRuntimeConfig().telegramWebhookSecret
  const incomingSecret = getHeader(event, 'x-telegram-bot-api-secret-token')
  if (configuredSecret && incomingSecret !== configuredSecret) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid webhook secret' })
  }

  const update = await readBody<any>(event)
  const message = update?.message
  if (!message?.text || !message?.chat?.id) {
    return { ok: true }
  }

  const chatId: number = message.chat.id
  const text: string = message.text.trim()

  if (text === '/start') {
    await sendTelegramMessage(chatId, WELCOME_MESSAGE)
    return { ok: true }
  }
  if (text === '/help') {
    await sendTelegramMessage(chatId, HELP_MESSAGE)
    return { ok: true }
  }

  const allowed = await checkTelegramRateLimit(chatId)
  if (!allowed) {
    await sendTelegramMessage(chatId, `⏳ You've checked a lot of items recently. Please wait a bit before checking more.`)
    return { ok: true }
  }

  try {
    const results = await searchReports(text)
    await recordTelegramLookup(chatId)
    await sendTelegramMessage(chatId, formatResults(results, text))
  } catch (err) {
    console.error('[telegram/webhook] search failed:', err)
    await sendTelegramMessage(chatId, `Something went wrong checking that. Please try again shortly.`)
  }

  return { ok: true }
})