import { db } from './firebase-admin'
import type { H3Event } from 'h3'
import { getReporterFingerprint, getReporterIpHash } from './reporterFingerprint'

const incidentsRef = db.collection('security_incidents')

const INJECTION_PATTERN =
  /<script[\s>]|javascript:|on\w+\s*=\s*["']|union\s+select|drop\s+table|;\s*--|\bignore\s+previous\s+instructions\b/i

export function looksLikeInjectionAttempt(value: unknown): boolean {
  if (typeof value !== 'string' || !value) return false
  return INJECTION_PATTERN.test(value)
}

interface IncidentInput {
  type: 'injection_attempt' | 'block_evasion' | 'rate_limit_abuse' | 'malformed_payload' | 'other'
  route: string
  payload?: unknown
  notes?: string
}

export async function logSecurityIncident(event: H3Event, input: IncidentInput): Promise<void> {
  try {
    const rawIp = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
    const userAgent = getHeader(event, 'user-agent') ?? 'unknown'
    const forwardedFor = getHeader(event, 'x-forwarded-for') ?? null

    await incidentsRef.add({
      ...input,
      rawIp,
      userAgent,
      forwardedFor,
      detectedAt: new Date().toISOString(),
      fingerprint: getReporterFingerprint(event),
      ipHash: getReporterIpHash(event),
    })
  } catch (err) {
    console.error('[security-incidents] failed to log incident:', err)
  }
}