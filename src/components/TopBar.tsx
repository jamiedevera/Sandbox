'use client'

import Image from 'next/image'
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
      <div className="shrink-0 relative h-[28px] w-[120px]">
        <Image
          src="/sandbox-logo.png"
          alt="SANDBOX"
          fill
          className="object-contain"
          style={{
            filter: 'brightness(0) saturate(100%) invert(79%) sepia(27%) saturate(1234%) hue-rotate(359deg) brightness(102%) contrast(96%) drop-shadow(0 0 8px rgba(251,191,36,0.4))',
            imageRendering: 'pixelated',
          }}
          priority
        />
      </div>

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
