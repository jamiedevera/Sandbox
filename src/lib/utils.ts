import type { RiskLevel, Severity, StatusType } from '@/types'

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export const riskColors: Record<RiskLevel, string> = {
  ok: '#4ade80',
  warn: '#fbbf24',
  danger: '#f87171',
}

export const riskGlows: Record<RiskLevel, string> = {
  ok: '0 0 8px rgba(74,222,128,0.5)',
  warn: '0 0 8px rgba(251,191,36,0.5)',
  danger: '0 0 8px rgba(248,113,113,0.6)',
}

export const severityColors: Record<Severity, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#fbbf24',
  low: '#4ade80',
}

export const statusColors: Record<StatusType, string> = {
  IDLE: '#4ade80',
  ANALYZING: '#fbbf24',
  ACTIVE: '#fbbf24',
  DEGRADING: '#f97316',
  'CRITICAL FAILURE': '#f87171',
}

export function getRiskBadgeClass(score: number): {
  label: string
  colorClass: string
} {
  if (score >= 80) return { label: 'CRITICAL', colorClass: 'badge-critical' }
  if (score >= 60) return { label: 'HIGH', colorClass: 'badge-high' }
  if (score >= 40) return { label: 'MEDIUM', colorClass: 'badge-medium' }
  return { label: 'LOW', colorClass: 'badge-low' }
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'var(--red)'
  if (score >= 60) return '#f97316'
  if (score >= 40) return 'var(--amber)'
  return 'var(--green)'
}

export function formatFileSize(bytes: number): string {
  return (bytes / 1024).toFixed(1) + ' KB'
}
