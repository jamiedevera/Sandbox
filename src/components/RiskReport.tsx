'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { getScoreColor, severityColors } from '@/lib/utils'
import type { AIResult } from '@/types'

const typeIcons: Record<string, string> = {
  performance: '⚡',
  security: '🔒',
  architecture: '🏗️',
}

interface RiskReportProps {
  aiResult: AIResult
  stack: string[]
}

export default function RiskReport({ aiResult, stack }: RiskReportProps) {
  const [displayScore, setDisplayScore] = useState(0)
  const [barWidth, setBarWidth] = useState(0)

  const score = aiResult.risk_score ?? 0
  const scoreColor = getScoreColor(score)

  // Debug logging
  console.log('🎯 RiskReport received aiResult:', aiResult)
  console.log('🎯 Risk score value:', score)
  console.log('🎯 Risk score type:', typeof score)

  useEffect(() => {
    // Reset and animate when score changes
    setDisplayScore(0)
    setBarWidth(0)

    let current = 0
    const interval = setInterval(() => {
      current = Math.min(current + 2, score)
      setDisplayScore(current)
      if (current >= score) clearInterval(interval)
    }, 30)

    setTimeout(() => setBarWidth(score), 200)

    return () => clearInterval(interval)
  }, [score])

  const baseCost = score * 150 + 2000

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 pb-2" style={{ borderBottom: '1px solid var(--border2)' }}>
        <div
          className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse-dot"
          style={{ background: 'var(--red)', boxShadow: 'var(--glow-red)' }}
        />
        <span className="font-pixel text-[7px] tracking-widest" style={{ color: 'var(--amber)' }}>
          AI RISK REPORT
        </span>
      </div>

      {/* Score display */}
      <div
        className="text-center py-4 rounded-[2px] relative overflow-hidden"
        style={{
          border: '1px solid var(--border2)',
          background: 'rgba(0,0,0,0.3)',
        }}
      >
        {/* Scan line */}
        <div
          className="absolute top-0 h-[2px] animate-scan-h pointer-events-none"
          style={{
            left: '-100%',
            width: '100%',
            background: 'linear-gradient(90deg, transparent, var(--amber), transparent)',
          }}
        />
        <p className="font-pixel text-[7px] tracking-widest mb-1" style={{ color: 'var(--sand3)' }}>
          RISK SCORE
        </p>
        <p
          className="font-pixel leading-none mb-1 transition-colors"
          style={{ fontSize: 36, color: scoreColor, textShadow: `0 0 16px ${scoreColor}60` }}
        >
          {displayScore}
        </p>
        <p className="font-mono-tech text-[10px] tracking-wide" style={{ color: 'var(--sand3)' }}>
          / 100
        </p>
      </div>

      {/* Score bar */}
      <div
        className="h-[10px] rounded-[1px] overflow-hidden"
        style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border)' }}
      >
        <div
          className="h-full transition-all duration-[1500ms] ease-out"
          style={{
            width: `${barWidth}%`,
            background: `linear-gradient(90deg, var(--green), ${score > 60 ? 'var(--red)' : 'var(--amber)'})`,
          }}
        />
      </div>

      {/* Summary */}
      <div>
        <p className="font-mono-tech text-[10px] tracking-widest uppercase mb-1" style={{ color: 'var(--sand3)' }}>
          Executive Summary
        </p>
        <div
          className="rounded-[2px] p-3 text-[13px] leading-relaxed"
          style={{
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid var(--border)',
            color: 'var(--sand2)',
          }}
        >
          {aiResult.summary}
        </div>
      </div>

      {/* Cost estimate */}
      <div
        className="rounded-[2px] p-3"
        style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border2)' }}
      >
        <p className="font-pixel text-[6px] tracking-wide mb-1" style={{ color: 'var(--sand3)' }}>
          ESTIMATED INCIDENT COST
        </p>
        <p className="font-pixel text-[14px]" style={{ color: 'var(--amber)', textShadow: 'var(--glow-amber)' }}>
          ${baseCost.toLocaleString()}
        </p>
      </div>

      {/* Issues */}
      <div>
        <p className="font-mono-tech text-[10px] tracking-widest uppercase mb-2" style={{ color: 'var(--sand3)' }}>
          Issues Detected
        </p>
        <div className="flex flex-col gap-2">
          {aiResult.issues?.map((issue, i) => (
            <motion.div
              key={i}
              className={`rounded-[2px] p-3 border-l-4 sev-${issue.severity}`}
              style={{ background: 'rgba(0,0,0,0.3)' }}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm">{typeIcons[issue.type] ?? '⚠️'}</span>
                <span className="font-bold text-[13px]" style={{ color: 'var(--sand)' }}>
                  {issue.type.toUpperCase()}
                </span>
                <span
                  className="font-pixel text-[5px] px-1 py-0.5 rounded-[1px] ml-auto tracking-wide"
                  style={{
                    background: `${severityColors[issue.severity]}22`,
                    color: severityColors[issue.severity],
                  }}
                >
                  {issue.severity.toUpperCase()}
                </span>
              </div>
              <p className="text-[12px] leading-snug mb-1" style={{ color: 'var(--sand3)' }}>
                {issue.description}
              </p>
              <p className="font-mono-tech text-[10px] opacity-70" style={{ color: 'var(--sand)' }}>
                → {issue.impact}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stack */}
      <div>
        <p className="font-mono-tech text-[10px] tracking-widest uppercase mb-1" style={{ color: 'var(--sand3)' }}>
          Stack Detected
        </p>
        <div className="flex flex-wrap gap-1 mt-1">
          {stack.map((s) => (
            <span key={s} className="stack-tag">{s}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
