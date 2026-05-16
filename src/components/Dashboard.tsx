'use client'

import { motion } from 'framer-motion'
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

  return (
    <motion.div
      className="flex-1 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div
        className="grid flex-1 min-h-0"
        style={{
          gridTemplateColumns: '280px 1fr 300px',
          gap: 1,
          background: 'var(--border)',
        }}
      >
        {/* ── LEFT: System Map ── */}
        <div
          className="overflow-y-auto px-4 py-4 panel-grid"
          style={{ background: 'var(--panel)' }}
        >
          <div className="flex items-center gap-2 pb-2 mb-3" style={{ borderBottom: '1px solid var(--border2)' }}>
            <div
              className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse-dot"
              style={{ background: 'var(--amber)', boxShadow: 'var(--glow-amber)' }}
            />
            <span className="font-pixel text-[7px] tracking-widest" style={{ color: 'var(--amber)' }}>
              SYSTEM MAP
            </span>
          </div>

          <SystemMap modules={modules} />

          {/* Module list */}
          <div className="flex items-center gap-2 pb-2 mt-3 mb-2" style={{ borderBottom: '1px solid var(--border2)' }}>
            <div
              className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse-dot"
              style={{ background: 'var(--amber)', boxShadow: 'var(--glow-amber)' }}
            />
            <span className="font-pixel text-[7px] tracking-widest" style={{ color: 'var(--amber)' }}>
              MODULES
            </span>
          </div>
          <div className="flex flex-col">
            {modules.map((mod, i) => (
              <div
                key={i}
                className="flex items-center gap-2 py-1.5 cursor-pointer hover:opacity-80 transition-opacity text-[13px] font-medium"
                style={{ borderBottom: '1px solid var(--border)' }}
              >
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{
                    background: riskColors[mod.risk],
                    boxShadow: `0 0 6px ${riskColors[mod.risk]}60`,
                  }}
                />
                <span style={{ color: 'var(--sand)' }}>{mod.name}</span>
                <span
                  className="ml-auto font-mono-tech text-[10px]"
                  style={{ color: riskColors[mod.risk] }}
                >
                  {mod.files}f
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── CENTER: Timeline ── */}
        <div
          className="flex flex-col panel-grid overflow-hidden"
          style={{ background: 'var(--panel)' }}
        >
          <Timeline
            events={aiResult.simulation}
            isDemo={isDemo}
            onStatusChange={onStatusChange}
            onReset={onReset}
          />
        </div>

        {/* ── RIGHT: Risk Report ── */}
        <div
          className="overflow-y-auto px-4 py-4 panel-grid"
          style={{ background: 'var(--panel)' }}
        >
          <RiskReport aiResult={aiResult} stack={stack} />
        </div>
      </div>
    </motion.div>
  )
}
