'use client'

import { getRiskBadgeClass } from '@/lib/utils'
import type { StatusType } from '@/types'

interface TopBarProps {
  status: StatusType
  statusColor: string
  projectName: string
  riskScore: number | null
}

export default function TopBar({
  status,
  statusColor,
  projectName,
  riskScore,
}: TopBarProps) {
  const badge = riskScore !== null ? getRiskBadgeClass(riskScore) : null

  return (
    <header
      className="sticky top-0 z-50 flex items-center gap-4 px-5 py-[10px] border-b-2"
      style={{
        background: 'var(--panel)',
        borderColor: 'var(--border2)',
      }}
    >
      {/* Logo */}
      <span
        className="font-pixel text-[10px] shrink-0 tracking-wide"
        style={{
          color: 'var(--amber)',
          textShadow:
            '0 0 12px rgba(251,191,36,0.6), 2px 2px 0 rgba(107,66,38,0.8)',
        }}
      >
        ⬛ SANDBOX
      </span>

      {/* Status dot */}
      <div
        className="w-2 h-2 rounded-full shrink-0 animate-pulse-dot"
        style={{ background: statusColor, boxShadow: `0 0 8px ${statusColor}60` }}
      />

      {/* Status text */}
      <span
        className="font-mono-tech text-[11px] shrink-0 tracking-widest"
        style={{
          color: statusColor,
          textShadow: `0 0 8px ${statusColor}40`,
        }}
      >
        {status}
      </span>

      {/* Project name */}
      <span
        className="flex-1 text-center text-[13px] font-semibold tracking-wide"
        style={{ color: 'var(--sand2)' }}
      >
        {projectName}
      </span>

      {/* Risk badge */}
      {badge && (
        <span className={`risk-badge ${badge.colorClass}`}>{badge.label}</span>
      )}
    </header>
  )
}
