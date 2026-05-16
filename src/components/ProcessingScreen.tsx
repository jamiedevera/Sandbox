'use client'

import { motion } from 'framer-motion'

export interface LogEntry {
  ts: string
  text: string
  type: 'ok' | 'warn' | 'err' | 'info'
}

interface ProcessingScreenProps {
  stage: string
  logs: LogEntry[]
  stackTags: string[]
}

export default function ProcessingScreen({
  stage,
  logs,
  stackTags,
}: ProcessingScreenProps) {
  return (
    <motion.div
      className="flex-1 flex flex-col items-center justify-center px-5 py-10 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Crate SVG */}
      <div className="w-[120px] h-[120px] relative">
        <svg
          className="animate-crate-shake"
          viewBox="0 0 120 120"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Crate body */}
          <rect
            x="20" y="40" width="80" height="70" rx="2"
            fill="rgba(107,66,38,0.8)"
            stroke="var(--amber)"
            strokeWidth="1.5"
          />
          {/* Crate planks */}
          <line x1="20" y1="75" x2="100" y2="75" stroke="var(--amber)" strokeWidth="1" opacity="0.5" />
          <line x1="60" y1="40" x2="60" y2="110" stroke="var(--amber)" strokeWidth="1" opacity="0.5" />
          {/* Lid */}
          <rect
            x="15" y="30" width="90" height="18" rx="2"
            fill="rgba(74,222,128,0.2)"
            stroke="var(--green)"
            strokeWidth="1.5"
            className="animate-lid-open"
          />
          {/* Shine */}
          <rect x="28" y="48" width="8" height="4" fill="var(--amber)" opacity="0.3" />
          <rect x="28" y="56" width="16" height="2" fill="var(--amber)" opacity="0.2" />
        </svg>
      </div>

      {/* Stage label */}
      <p
        className="font-pixel text-[12px] text-center leading-loose"
        style={{
          color: 'var(--cyan)',
          textShadow: '0 0 12px rgba(34,211,238,0.4)',
        }}
      >
        {stage}
      </p>

      {/* Log feed */}
      <div
        className="w-full max-w-[560px] rounded-[2px] px-4 py-3 h-[140px] overflow-y-auto"
        style={{
          background: 'var(--panel)',
          border: '1px solid var(--border)',
        }}
      >
        {logs.map((entry, i) => (
          <div key={i} className="log-entry">
            <span className="log-ts">[{entry.ts}]</span>
            <span className={`log-${entry.type}`}>{entry.text}</span>
          </div>
        ))}
      </div>

      {/* Stack tags */}
      {stackTags.length > 0 && (
        <div className="flex flex-wrap gap-1 justify-center">
          {stackTags.map((tag) => (
            <span key={tag} className="stack-tag">
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  )
}
