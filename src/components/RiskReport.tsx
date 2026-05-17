'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getScoreColor, severityColors, estimateIncidentCost, getRecommendation } from '@/lib/utils'
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
  const [expandedIssue, setExpandedIssue] = useState<number | null>(null)
  const [hoveredStack, setHoveredStack] = useState<string | null>(null)

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

  const baseCost = estimateIncidentCost(score)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        paddingBottom: '14px',
        borderBottom: '2px solid rgba(232, 201, 106, 0.3)',
      }}>
        <div style={{
          width: '10px',
          height: '10px',
          background: '#ef4444',
          clipPath: 'polygon(30% 0%, 70% 0%, 85% 15%, 100% 30%, 100% 70%, 85% 85%, 70% 100%, 30% 100%, 15% 85%, 0% 70%, 0% 30%, 15% 15%)',
          boxShadow: '0 0 12px rgba(239, 68, 68, 0.6)',
          animation: 'pulse-glow 1.5s ease-in-out infinite',
        }} />
        <span style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: '10px',
          letterSpacing: '2px',
          color: '#f5e6a3',
          textShadow: '2px 2px 0 #2e1a0e',
        }}>
          AI RISK REPORT
        </span>
      </div>

      {/* Score Display - Enhanced */}
      <div style={{
        textAlign: 'center',
        padding: '28px 20px',
        background: 'rgba(0, 0, 0, 0.4)',
        border: '2px solid rgba(232, 201, 106, 0.3)',
        clipPath: 'polygon(0 8px, 8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px))',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <p style={{
          fontFamily: "'VT323', monospace",
          fontSize: '18px',
          letterSpacing: '2px',
          color: '#d4a843',
          marginBottom: '12px',
        }}>
          RISK SCORE
        </p>
        <p style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: '52px',
          lineHeight: '1',
          color: scoreColor,
          textShadow: `0 0 20px ${scoreColor}80, 2px 2px 0 #2e1a0e`,
          marginBottom: '10px',
          transition: 'color 0.3s',
        }}>
          {displayScore}
        </p>
        <p style={{
          fontFamily: "'VT323', monospace",
          fontSize: '18px',
          color: '#d4a843',
          opacity: 0.8,
        }}>
          / 100
        </p>
      </div>

      {/* Score Bar - Enhanced */}
      <div style={{
        height: '16px',
        background: 'rgba(0, 0, 0, 0.5)',
        border: '2px solid rgba(232, 201, 106, 0.3)',
        clipPath: 'polygon(0 4px, 4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px))',
        overflow: 'hidden',
        position: 'relative',
      }}>
        <div style={{
          height: '100%',
          width: `${barWidth}%`,
          background: score > 70 ? 'linear-gradient(90deg, #fbbf24, #ef4444)' :
                     score > 40 ? 'linear-gradient(90deg, #4ade80, #fbbf24)' :
                     'linear-gradient(90deg, #4ade80, #22c55e)',
          transition: 'width 1.5s ease-out',
          boxShadow: `0 0 12px ${scoreColor}60`,
        }} />
      </div>

      {/* Executive Summary */}
      <div>
        <p style={{
          fontFamily: "'VT323', monospace",
          fontSize: '16px',
          letterSpacing: '2px',
          color: '#d4a843',
          marginBottom: '14px',
          textTransform: 'uppercase',
        }}>
          Executive Summary
        </p>
        <div style={{
          padding: '18px',
          background: 'rgba(0, 0, 0, 0.4)',
          border: '2px solid rgba(232, 201, 106, 0.3)',
          clipPath: 'polygon(0 6px, 6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px))',
        }}>
          <p style={{
            fontFamily: "'VT323', monospace",
            fontSize: '18px',
            lineHeight: '1.7',
            color: '#f5e6a3',
          }}>
            {aiResult.summary}
          </p>
        </div>
      </div>

      {/* Cost Estimate */}
      <div style={{
        padding: '18px',
        background: 'rgba(107, 66, 38, 0.4)',
        border: '2px solid rgba(232, 201, 106, 0.5)',
        clipPath: 'polygon(0 6px, 6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px))',
      }}>
        <p style={{
          fontFamily: "'VT323', monospace",
          fontSize: '14px',
          letterSpacing: '2px',
          color: '#d4a843',
          marginBottom: '10px',
        }}>
          ESTIMATED INCIDENT COST
        </p>
        <p style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: '24px',
          color: '#fbbf24',
          textShadow: '0 0 16px rgba(251, 191, 36, 0.6), 2px 2px 0 #2e1a0e',
        }}>
          ${baseCost.toLocaleString()}
        </p>
      </div>

      {/* Issues Detected with Actionable Insights */}
      <div>
        <p style={{
          fontFamily: "'VT323', monospace",
          fontSize: '16px',
          letterSpacing: '2px',
          color: '#d4a843',
          marginBottom: '14px',
          textTransform: 'uppercase',
        }}>
          Issues & Recommendations
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {aiResult.issues?.map((issue, i) => (
            <motion.div
              key={i}
              style={{
                padding: '16px',
                background: expandedIssue === i ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.4)',
                border: expandedIssue === i
                  ? `3px solid ${severityColors[issue.severity]}`
                  : `2px solid ${severityColors[issue.severity]}60`,
                borderLeft: `4px solid ${severityColors[issue.severity]}`,
                clipPath: 'polygon(0 6px, 6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px))',
                cursor: 'pointer',
              }}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ x: 4, scale: 1.01 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setExpandedIssue(expandedIssue === i ? null : i)}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '12px',
              }}>
                <span style={{ fontSize: '20px' }}>{typeIcons[issue.type] ?? '⚠️'}</span>
                <span style={{
                  fontFamily: "'VT323', monospace",
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#f5e6a3',
                  flex: 1,
                }}>
                  {issue.type.toUpperCase()}
                </span>
                <span style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: '8px',
                  padding: '5px 10px',
                  background: `${severityColors[issue.severity]}30`,
                  color: severityColors[issue.severity],
                  border: `1px solid ${severityColors[issue.severity]}`,
                  clipPath: 'polygon(0 2px, 2px 0, calc(100% - 2px) 0, 100% 2px, 100% calc(100% - 2px), calc(100% - 2px) 100%, 2px 100%, 0 calc(100% - 2px))',
                }}>
                  {issue.severity.toUpperCase()}
                </span>
              </div>
              <p style={{
                fontFamily: "'VT323', monospace",
                fontSize: '17px',
                lineHeight: '1.6',
                color: '#f5e6a3',
                marginBottom: '10px',
              }}>
                {issue.description}
              </p>
              <p style={{
                fontFamily: "'VT323', monospace",
                fontSize: '16px',
                color: '#d4a843',
                marginBottom: '12px',
                opacity: 0.95,
              }}>
                💥 Impact: {issue.impact}
              </p>
              {/* Actionable Recommendation */}
              <div style={{
                padding: '12px',
                background: 'rgba(74, 222, 128, 0.1)',
                border: '2px solid rgba(74, 222, 128, 0.3)',
                clipPath: 'polygon(0 4px, 4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px))',
                marginTop: '8px',
              }}>
                <p style={{
                  fontFamily: "'VT323', monospace",
                  fontSize: '15px',
                  color: '#4ade80',
                  marginBottom: '6px',
                  fontWeight: 'bold',
                }}>
                  ✓ RECOMMENDED ACTION:
                </p>
                <p style={{
                  fontFamily: "'VT323', monospace",
                  fontSize: '16px',
                  lineHeight: '1.5',
                  color: '#f5e6a3',
                }}>
                  {getRecommendation(issue.type, issue.severity)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stack Detected */}
      <div>
        <p style={{
          fontFamily: "'VT323', monospace",
          fontSize: '16px',
          letterSpacing: '2px',
          color: '#d4a843',
          marginBottom: '14px',
          textTransform: 'uppercase',
        }}>
          Stack Detected
        </p>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          {stack.map((s) => (
            <span key={s} style={{
              fontFamily: "'VT323', monospace",
              fontSize: '18px',
              padding: '10px 18px',
              background: 'rgba(232, 201, 106, 0.15)',
              border: '2px solid rgba(232, 201, 106, 0.6)',
              color: '#f5e6a3',
              textShadow: '1px 1px 0 rgba(0, 0, 0, 0.8)',
              clipPath: 'polygon(0 4px, 4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px))',
            }}>
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
