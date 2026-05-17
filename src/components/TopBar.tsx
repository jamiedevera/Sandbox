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
      className="topbar"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(26, 15, 2, 0.98)',
        borderBottom: '4px solid #6b4226',
        boxShadow: 'inset 0 -2px 0 #2e1a0e, 0 4px 0 #2e1a0e, 0 6px 20px rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Logo - Made Bigger */}
      <div className="topbar-logo" style={{ flexShrink: 0, position: 'relative' }}>
        <Image
          src="/sandbox-logo.png"
          alt="SANDBOX"
          fill
          style={{
            objectFit: 'contain',
            imageRendering: 'pixelated',
            filter: 'drop-shadow(0 0 16px rgba(232, 201, 106, 0.6)) drop-shadow(0 2px 6px rgba(0, 0, 0, 0.9))',
          }}
          priority
        />
      </div>

      {/* Beach-themed divider */}
      <div style={{
        width: '2px',
        height: '32px',
        background: 'linear-gradient(180deg, transparent, #6b4226, transparent)',
        opacity: 0.5,
      }} />

      {/* Status indicator with better UX */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '8px 16px',
        background: 'rgba(0, 0, 0, 0.3)',
        border: '2px solid rgba(232, 201, 106, 0.2)',
        clipPath: 'polygon(0 4px, 4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px))',
      }}>
        {/* Status dot */}
        <div
          style={{
            width: '14px',
            height: '14px',
            flexShrink: 0,
            background: statusColor,
            boxShadow: `0 0 16px ${statusColor}, inset 0 0 4px rgba(255, 255, 255, 0.3)`,
            border: '2px solid rgba(0, 0, 0, 0.6)',
            clipPath: 'polygon(30% 0%, 70% 0%, 85% 15%, 100% 30%, 100% 70%, 85% 85%, 70% 100%, 30% 100%, 15% 85%, 0% 70%, 0% 30%, 15% 15%)',
            animation: 'pulse-glow 1.5s ease-in-out infinite',
          }}
        />

        {/* Status text */}
        <span
          style={{
            fontFamily: "'VT323', monospace",
            fontSize: '18px',
            flexShrink: 0,
            letterSpacing: '2px',
            color: statusColor,
            textShadow: `0 0 10px ${statusColor}80, 2px 2px 0 rgba(0, 0, 0, 0.8)`,
            fontWeight: 'bold',
          }}
        >
          {status}
        </span>
      </div>

      {/* Spacer to push content to the right */}
      <div className="topbar-spacer" style={{ flex: 1 }} />

      {/* Risk badge with better visibility */}
      {badge && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <span style={{
            fontFamily: "'VT323', monospace",
            fontSize: '14px',
            color: '#f5e6a3',
            opacity: 0.7,
            letterSpacing: '1px',
          }}>
            RISK:
          </span>
          <span className={`risk-badge ${badge.colorClass}`} style={{
            fontSize: '8px',
            padding: '8px 16px',
          }}>
            {badge.label}
          </span>
        </div>
      )}

      {/* Beach-themed divider */}
      {badge && (
        <div style={{
          width: '2px',
          height: '32px',
          background: 'linear-gradient(180deg, transparent, #6b4226, transparent)',
          opacity: 0.5,
        }} />
      )}

      {/* Project name - Rightmost position */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        {/* Ring icon */}
        <div style={{
          position: 'relative',
          width: '28px',
          height: '28px',
          flexShrink: 0,
        }}>
          <Image
            src="/ring.png"
            alt="Ring"
            width={28}
            height={28}
            style={{
              imageRendering: 'pixelated',
              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.6))',
            }}
          />
        </div>
        <span
          style={{
            fontSize: '17px',
            fontFamily: "'Rajdhani', sans-serif",
            fontWeight: 700,
            letterSpacing: '1.5px',
            color: '#f5e6a3',
            textShadow: '2px 2px 0 rgba(0, 0, 0, 0.5)',
            textTransform: 'uppercase',
          }}
        >
          {projectName}
        </span>
      </div>

      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(0.95); }
        }
      `}</style>
    </header>
  )
}

// Made with Bob
