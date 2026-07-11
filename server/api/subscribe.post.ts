import { addSubscriber, checkRateLimit, recordSubmission } from '../utils/db'

interface SubscribeBody {
  email?: string
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default defineEventHandler(async (event) => {
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'

  let allowed: boolean
  try {
    allowed = await checkRateLimit(ip, 'subscribe')
  } catch (err) {
    console.error('Rate limit check failed:', err)
    throw createError({
      statusCode: 500,
      statusMessage: 'Something went wrong. Please try again.'
    })
  }

  if (!allowed) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Too many requests. Please try again later.'
    })
  }

  const body = await readBody<SubscribeBody>(event)
  const email = body?.email?.trim().toLowerCase()

  if (!email || !EMAIL_REGEX.test(email)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'A valid email address is required.'
    })
  }

  try {
    const { alreadySubscribed } = await addSubscriber(email)
    await recordSubmission(ip, 'subscribe')

    return {
      success: true,
      message: alreadySubscribed ? 'Already subscribed.' : 'Subscribed successfully.'
    }
  } catch (err) {
    console.error('Subscribe error:', err)
    throw createError({
      statusCode: 500,
      statusMessage: 'Something went wrong. Please try again.'
    })
  }
})