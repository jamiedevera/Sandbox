'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import Timeline from './Timeline'
import RiskReport from './RiskReport'
import { riskColors } from '@/lib/utils'
import type { ProjectData } from '@/types'

// SSR-safe: React Flow uses browser APIs
const SystemMap = dynamic(() => import('./SystemMap'), { ssr: false })

interface DashboardProps {
  data: ProjectData
  isDemo: boolean
  onStatusChange: (text: string, color: string) => void
  onReset: () => void
}

export default function Dashboard({
  data,
  isDemo,
  onStatusChange,
  onReset,
}: DashboardProps) {
  const { modules, stack, aiResult } = data
  const [hoveredModule, setHoveredModule] = useState<number | null>(null)
  const [selectedModule, setSelectedModule] = useState<number | null>(null)

  return (
    <motion.div
      className="dashboard-root"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Three Column Layout */}
      <div className="dashboard-grid">
        {/* ── LEFT: System Map & Modules ── */}
        <div className="dashboard-col">
          {/* System Map Panel - Compact */}
          <div className="dash-panel dash-panel-map">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '12px',
              paddingBottom: '10px',
              borderBottom: '2px solid rgba(232, 201, 106, 0.3)',
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                background: '#e8c96a',
                clipPath: 'polygon(30% 0%, 70% 0%, 85% 15%, 100% 30%, 100% 70%, 85% 85%, 70% 100%, 30% 100%, 15% 85%, 0% 70%, 0% 30%, 15% 15%)',
                boxShadow: '0 0 12px rgba(232, 201, 106, 0.6)',
                animation: 'pulse-glow 1.5s ease-in-out infinite',
              }} />
              <span style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '9px',
                letterSpacing: '2px',
                color: '#f5e6a3',
                textShadow: '2px 2px 0 #2e1a0e',
              }}>
                SYSTEM MAP
              </span>
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <SystemMap modules={modules} />
            </div>
          </div>

          {/* Modules List Panel - Fills Remaining Space */}
          <div className="dash-panel dash-panel-modules">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '12px',
              paddingBottom: '10px',
              borderBottom: '2px solid rgba(232, 201, 106, 0.3)',
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                background: '#e8c96a',
                clipPath: 'polygon(30% 0%, 70% 0%, 85% 15%, 100% 30%, 100% 70%, 85% 85%, 70% 100%, 30% 100%, 15% 85%, 0% 70%, 0% 30%, 15% 15%)',
                boxShadow: '0 0 12px rgba(232, 201, 106, 0.6)',
                animation: 'pulse-glow 1.5s ease-in-out infinite',
              }} />
              <span style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '9px',
                letterSpacing: '2px',
                color: '#f5e6a3',
                textShadow: '2px 2px 0 #2e1a0e',
              }}>
                MODULES
              </span>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              overflowY: 'auto',
              flex: 1,
              minHeight: 0,
            }}>
              {modules.map((mod, i) => (
                <motion.div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    background: selectedModule === i
                      ? `${riskColors[mod.risk]}20`
                      : hoveredModule === i
                        ? 'rgba(0, 0, 0, 0.5)'
                        : 'rgba(0, 0, 0, 0.3)',
                    border: selectedModule === i
                      ? `3px solid ${riskColors[mod.risk]}`
                      : `2px solid ${riskColors[mod.risk]}40`,
                    clipPath: 'polygon(0 4px, 4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px))',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                  whileHover={{ x: 6, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  onMouseEnter={() => setHoveredModule(i)}
                  onMouseLeave={() => setHoveredModule(null)}
                  onClick={() => setSelectedModule(selectedModule === i ? null : i)}
                >
                  <motion.div
                    style={{
                      width: '10px',
                      height: '10px',
                      flexShrink: 0,
                      background: riskColors[mod.risk],
                      clipPath: 'polygon(30% 0%, 70% 0%, 85% 15%, 100% 30%, 100% 70%, 85% 85%, 70% 100%, 30% 100%, 15% 85%, 0% 70%, 0% 30%, 15% 15%)',
                      boxShadow: `0 0 10px ${riskColors[mod.risk]}80`,
                    }}
                    animate={{
                      scale: hoveredModule === i ? [1, 1.3, 1] : 1,
                      rotate: selectedModule === i ? 180 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  <span style={{
                    fontFamily: "'VT323', monospace",
                    fontSize: '18px',
                    color: '#f5e6a3',
                    flex: 1,
                    textShadow: hoveredModule === i ? '0 0 8px rgba(245, 230, 163, 0.6)' : 'none',
                  }}>
                    {mod.name}
                  </span>
                  <motion.span
                    style={{
                      fontFamily: "'VT323', monospace",
                      fontSize: '16px',
                      color: riskColors[mod.risk],
                      fontWeight: 'bold',
                    }}
                    animate={{
                      scale: hoveredModule === i ? 1.1 : 1,
                    }}
                  >
                    {mod.files}f
                  </motion.span>
                  
                  {/* Tooltip on hover */}
                  {hoveredModule === i && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        marginTop: '8px',
                        padding: '8px 12px',
                        background: 'rgba(26, 15, 2, 0.98)',
                        border: `2px solid ${riskColors[mod.risk]}`,
                        clipPath: 'polygon(0 3px, 3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px))',
                        zIndex: 1000,
                        whiteSpace: 'nowrap',
                        pointerEvents: 'none',
                      }}
                    >
                      <div style={{
                        fontFamily: "'VT323', monospace",
                        fontSize: '14px',
                        color: '#f5e6a3',
                      }}>
                        Risk Level: {mod.risk.toUpperCase()}
                      </div>
                      <div style={{
                        fontFamily: "'VT323', monospace",
                        fontSize: '13px',
                        color: '#d4a843',
                        marginTop: '2px',
                      }}>
                        {mod.files} files detected
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ── CENTER: Timeline - Full Height ── */}
        <div className="dash-panel dash-panel-timeline">
          <Timeline
            events={aiResult.simulation}
            isDemo={isDemo}
            onStatusChange={onStatusChange}
            onReset={onReset}
          />
        </div>

        {/* ── RIGHT: Risk Report - Full Height Scrollable ── */}
        <div className="dash-panel dash-panel-report">
          <RiskReport aiResult={aiResult} stack={stack} />
        </div>
      </div>
    </motion.div>
  )
}
