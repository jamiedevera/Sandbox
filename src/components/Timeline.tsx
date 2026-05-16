'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { SimulationEvent } from '@/types'

const eventColors = {
  normal: 'var(--green)',
  warn: 'var(--amber)',
  danger: 'var(--red)',
}

interface TimelineProps {
  events: SimulationEvent[]
  isDemo: boolean
  onStatusChange: (status: string, color: string) => void
  onReset: () => void
}

export default function Timeline({
  events,
  isDemo,
  onStatusChange,
  onReset,
}: TimelineProps) {
  const [visibleEvents, setVisibleEvents] = useState<SimulationEvent[]>([])
  const [index, setIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [damagePercent, setDamagePercent] = useState(0)
  const [damageLabel, setDamageLabel] = useState('SYSTEM INTEGRITY: NOMINAL')
  const [damageLabelColor, setDamageLabelColor] = useState('var(--green)')
  const containerRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const computeDamage = useCallback(
    (upTo: number) => {
      const slice = events.slice(0, upTo + 1)
      const dangerCount = slice.filter((e) => e.type === 'danger').length
      const warnCount = slice.filter((e) => e.type === 'warn').length
      return Math.min(100, dangerCount * 18 + warnCount * 8)
    },
    [events]
  )

  const appendEvent = useCallback(
    (idx: number) => {
      const ev = events[idx]
      if (!ev) return
      setVisibleEvents((prev) => [...prev, ev])
      const dmg = computeDamage(idx)
      setDamagePercent(dmg)

      if (dmg > 70) {
        setDamageLabel('⚠️ SYSTEM INTEGRITY: CRITICAL')
        setDamageLabelColor('var(--red)')
      } else if (dmg > 40) {
        setDamageLabel('⚠️ SYSTEM INTEGRITY: DEGRADED')
        setDamageLabelColor('var(--amber)')
      }

      setTimeout(() => {
        containerRef.current?.scrollTo({
          top: containerRef.current.scrollHeight,
          behavior: 'smooth',
        })
      }, 50)
    },
    [events, computeDamage]
  )

  // Handle status changes in useEffect to avoid setState during render
  useEffect(() => {
    if (damagePercent > 70) {
      onStatusChange('CRITICAL FAILURE', 'var(--red)')
    } else if (damagePercent > 40) {
      onStatusChange('DEGRADING', 'var(--amber)')
    }
  }, [damagePercent, onStatusChange])

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setIndex((prev) => {
        if (prev >= events.length) {
          clearInterval(timerRef.current!)
          setIsPlaying(false)
          return prev
        }
        appendEvent(prev)
        return prev + 1
      })
    }, 1800)
  }, [events.length, appendEvent])

  // Start on mount
  useEffect(() => {
    setVisibleEvents([])
    setIndex(0)
    setIsPlaying(true)
    setDamagePercent(0)
    setDamageLabel('SYSTEM INTEGRITY: NOMINAL')
    setDamageLabelColor('var(--green)')
    startTimer()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events])

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false)
      if (timerRef.current) clearInterval(timerRef.current)
    } else {
      setIsPlaying(true)
      if (index >= events.length) {
        // Replay
        setVisibleEvents([])
        setIndex(0)
        setDamagePercent(0)
        setDamageLabel('SYSTEM INTEGRITY: NOMINAL')
        setDamageLabelColor('var(--green)')
        onStatusChange('ACTIVE', 'var(--amber)')
      }
      startTimer()
    }
  }

  const replay = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setVisibleEvents([])
    setIndex(0)
    setIsPlaying(true)
    setDamagePercent(0)
    setDamageLabel('SYSTEM INTEGRITY: NOMINAL')
    setDamageLabelColor('var(--green)')
    onStatusChange('ACTIVE', 'var(--amber)')
    startTimer()
  }

  return (
    <div
      className="flex flex-col h-full"
      style={{ minHeight: 500 }}
    >
      {/* Header */}
      <div
        className="px-4 pt-[14px] pb-0 shrink-0"
        style={{
          borderBottom: '1px solid var(--border)',
          background: 'var(--panel2)',
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse-dot"
            style={{ background: 'var(--red)', boxShadow: 'var(--glow-red)' }}
          />
          <span
            className="font-pixel text-[7px] tracking-widest"
            style={{ color: 'var(--amber)' }}
          >
            FUTURE FAILURE REPLAY
          </span>
        </div>

        {isDemo && (
          <div
            className="font-mono-tech text-[11px] text-center px-3 py-2 rounded-[2px] mb-2 tracking-wide"
            style={{
              background: 'rgba(96,165,250,0.1)',
              border: '1px solid rgba(96,165,250,0.3)',
              color: 'var(--blue)',
            }}
          >
            ⚡ DEMO MODE — Upload a real .zip to analyze your own project
          </div>
        )}

        {/* Damage bar */}
        <div
          className="h-2 rounded-[1px] overflow-hidden mb-2 relative"
          style={{ background: 'var(--border)' }}
        >
          <div
            className="h-full rounded-[1px] transition-all duration-1000 ease-out relative overflow-hidden"
            style={{
              width: `${damagePercent}%`,
              background: 'linear-gradient(90deg, var(--green), var(--amber), var(--red))',
            }}
          >
            <div className="animate-shimmer" />
          </div>
        </div>
        <p
          className="font-mono-tech text-[10px] mb-2 transition-colors"
          style={{ color: damageLabelColor }}
        >
          {damageLabel}
        </p>
      </div>

      {/* Events list */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 py-4"
      >
        <AnimatePresence>
          {visibleEvents.map((ev, i) => {
            const color = eventColors[ev.type]
            return (
              <motion.div
                key={i}
                className="timeline-event"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* Time */}
                <div
                  className="font-mono-tech text-[10px] shrink-0 pt-[3px] min-w-[50px]"
                  style={{ color: 'var(--sand3)' }}
                >
                  {ev.time}
                </div>

                {/* Bar */}
                <div className="flex flex-col items-center shrink-0">
                  <div
                    className="w-3 h-3 rounded-full border-2 shrink-0"
                    style={{
                      borderColor: color,
                      color,
                      boxShadow: `0 0 6px ${color}60`,
                    }}
                  />
                  {i < visibleEvents.length - 1 && (
                    <div
                      className="w-[2px] flex-1 min-h-[20px]"
                      style={{ background: 'var(--border2)' }}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-1">
                  <p
                    className="font-semibold text-sm mb-1"
                    style={{ color }}
                  >
                    {ev.event}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Playback controls */}
      <div
        className="flex items-center gap-3 px-4 py-3 shrink-0"
        style={{
          borderTop: '1px solid var(--border)',
          background: 'var(--panel2)',
        }}
      >
        <button className="pb-btn" onClick={replay}>
          ⏮ REPLAY
        </button>
        <button
          className={`pb-btn ${isPlaying ? 'active' : ''}`}
          onClick={togglePlay}
        >
          {isPlaying ? '⏸ PAUSE' : '▶ PLAY'}
        </button>
        <span
          className="flex-1 font-mono-tech text-[10px]"
          style={{ color: 'var(--sand3)' }}
        >
          EVENT {visibleEvents.length} / {events.length}
        </span>
        <button
          className="pb-btn"
          style={{ borderColor: 'var(--red2)', color: 'var(--red)' }}
          onClick={onReset}
        >
          ✕ RESET
        </button>
      </div>
    </div>
  )
}
