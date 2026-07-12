import { createHash, randomUUID } from 'node:crypto'
import type { H3Event } from 'h3'

const APP_SALT = process.env.REPORT_SALT || 'fallback-local-salt-change-in-env'
const DEVICE_COOKIE = 'frng_rid'
const DEVICE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

export function getReporterFingerprint(event: H3Event): string {
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown-ip'
  const ua = getHeader(event, 'user-agent') ?? 'unknown-ua'
  return createHash('sha256').update(`${ip}::${ua}::${APP_SALT}`).digest('hex')
}

export function getReporterIpHash(event: H3Event): string {
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown-ip'
  return createHash('sha256').update(`${ip}::${APP_SALT}`).digest('hex')
}

// Persistent, IP-independent identity. Set once, read on every subsequent
// visit. Survives VPN/network changes (unlike fingerprint/ipHash, which are
// both IP-derived and change together). Only reset by clearing cookies or
// switching browsers — an independent axis from the other two.
export function getReporterDeviceId(event: H3Event): string {
  const existing = getCookie(event, DEVICE_COOKIE)
  const raw = existing || randomUUID()

  if (!existing) {
    setCookie(event, DEVICE_COOKIE, raw, {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      maxAge: DEVICE_COOKIE_MAX_AGE,
      path: '/',
    })
  }

  return createHash('sha256').update(`${raw}::${APP_SALT}`).digest('hex')
}