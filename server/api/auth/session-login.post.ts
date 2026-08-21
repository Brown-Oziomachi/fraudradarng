// server/api/auth/session-login.post.ts
import { getAuth } from 'firebase-admin/auth'

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody<{ email: string; password: string }>(event)

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Email and password required' })
  }

  const apiKey = process.env.FIREBASE_WEB_API_KEY
  if (!apiKey) {
    throw createError({ statusCode: 500, statusMessage: 'Server misconfigured' })
  }

  // This call happens from Vercel's network, not the user's device —
  // this is the request that was getting killed on-device.
  const signInRes = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true })
    }
  )

  if (!signInRes.ok) {
    const err = await signInRes.json().catch(() => null)
    throw createError({
      statusCode: 401,
      statusMessage: err?.error?.message ?? 'Invalid credentials'
    })
  }

  const { idToken } = await signInRes.json()

  // Confirm this user actually has the admin claim before minting a session
  const decoded = await getAuth().verifyIdToken(idToken)
  if (decoded.admin !== true) {
    throw createError({ statusCode: 403, statusMessage: 'Admin access required' })
  }

  const expiresIn = 60 * 60 * 24 * 5 * 1000 // 5 days
  const sessionCookie = await getAuth().createSessionCookie(idToken, { expiresIn })

  setCookie(event, '__session', sessionCookie, {
    maxAge: expiresIn / 1000,
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/'
  })

  return { ok: true }
})