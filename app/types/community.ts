// types/community.ts
// Shared data models for the FRNG Community Hub

// ---------------------------------------------------------------------------
// Section 1 — Scam Breakdown Feed
// ---------------------------------------------------------------------------

export type ScamCategory =
  | 'Task-Based Ponzi'
  | 'Instagram Fake Vendor'
  | 'Romance / Relationship'
  | 'Fake Job Offer'
  | 'Crypto / Forex Scheme'
  | 'SIM Swap / USSD Takeover'
  | 'Loan App Extortion'
  | 'Delivery / Package Scam'

export type ThreatLevel = 'critical' | 'high' | 'moderate'

export interface ModusOperandiStep {
  order: number
  description: string
}

export interface ScamBreakdown {
  id: string
  title: string
  category: ScamCategory
  threatLevel: ThreatLevel
  summary: string
  reportedCount: number
  lastSeen: string // ISO date
  platformsInvolved: string[] // e.g. ['WhatsApp', 'OPay', 'Instagram']
  modusOperandi: ModusOperandiStep[]
  redFlags: string[]
}

// ---------------------------------------------------------------------------
// Section 2 — Account Hardening Checklist
// ---------------------------------------------------------------------------

export type HardeningGroupId = 'ussd' | 'fintech' | 'social'

export interface HardeningTask {
  id: string
  groupId: HardeningGroupId
  label: string
  description: string
  actionHint: string // short "how to do it" tip shown inline
  weight: number // contribution to overall score
}

export interface HardeningGroup {
  id: HardeningGroupId
  title: string
  icon: 'signal' | 'wallet' | 'shield'
  tasks: HardeningTask[]
}

export interface HardeningState {
  completedTaskIds: string[]
  updatedAt: string
}

// ---------------------------------------------------------------------------
// Section 3 — "Am I Being Scammed?" Wizard
// ---------------------------------------------------------------------------

export interface WizardQuestion {
  id: string
  order: number
  prompt: string
  helperText?: string
}

export type WizardAnswer = 'yes' | 'no'

export interface WizardResult {
  yesCount: number
  verdict: 'high-risk' | 'caution' | 'low-risk'
  headline: string
  message: string
}