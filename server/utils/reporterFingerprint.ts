import { createHash } from 'node:crypto'
import type { H3Event } from 'h3'

// Static app-level salt — hardens the hash against offline brute-forcing
// of IP+UA combos if a leak ever exposed fingerprint values. Does NOT
// solve CGNAT collisions (two people behind the same carrier NAT with the
// same salt still hash identically) — that's handled separately below.
const APP_SALT = process.env.REPORT_SALT || 'fallback-local-salt-change-in-env'

// Full fingerprint: identifies a distinct reporter (IP + UA + salt).
// Used for the "3 distinct reporters" escalation count.
export function getReporterFingerprint(event: H3Event): string {
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown-ip'
  const ua = getHeader(event, 'user-agent') ?? 'unknown-ua'
  return createHash('sha256').update(`${ip}::${ua}::${APP_SALT}`).digest('hex')
}

// IP-only hash (no UA): used purely to detect whether several "distinct"
// fingerprints are actually clustered behind the same network address —
// e.g. CGNAT-shared IP (legitimate) vs. one person cycling browsers/incognito
// windows to fake distinct reporters (suspicious). Never stores a raw IP.
export function getReporterIpHash(event: H3Event): string {
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown-ip'
  return createHash('sha256').update(`${ip}::${APP_SALT}`).digest('hex')
}