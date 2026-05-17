'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { computeDamage } from '@/lib/utils'
import type { SimulationEvent } from '@/types'

const eventColors = {
  normal: '#5ddb6a',
  warn: '#f5c842',
  danger: '#e8402a',
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
  const [damageLabelColor, setDamageLabelColor] = useState('#5ddb6a')
  const containerRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const appendEvent = useCallback(
    (idx: number) => {
      const ev = events[idx]
      if (!ev) return
      setVisibleEvents((prev) => [...prev, ev])
      const dmg = computeDamage(events, idx)
      setDamagePercent(dmg)

      if (dmg > 70) {
        setDamageLabel('⚠️ SYSTEM INTEGRITY: CRITICAL')
        setDamageLabelColor('#e8402a')
      } else if (dmg > 40) {
        setDamageLabel('⚠️ SYSTEM INTEGRITY: DEGRADED')
        setDamageLabelColor('#f5c842')
      }

      setTimeout(() => {
        containerRef.current?.scrollTo({
          top: containerRef.current.scrollHeight,
          behavior: 'smooth',
        })
      }, 50)
    },
    [events]
  )

  // Handle status changes in useEffect to avoid setState during render
  useEffect(() => {
    if (damagePercent > 70) {
      onStatusChange('CRITICAL FAILURE', '#e8402a')
    } else if (damagePercent > 40) {
      onStatusChange('DEGRADING', '#f5c842')
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
    setDamageLabelColor('#5ddb6a')
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
        setDamageLabelColor('#5ddb6a')
        onStatusChange('ACTIVE', '#f5c842')
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
    setDamageLabelColor('#5ddb6a')
    onStatusChange('ACTIVE', '#f5c842')
    startTimer()
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      minHeight: '500px',
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        borderBottom: '2px solid rgba(232, 201, 106, 0.3)',
        flexShrink: 0,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px',
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            background: '#ef4444',
            clipPath: 'polygon(30% 0%, 70% 0%, 85% 15%, 100% 30%, 100% 70%, 85% 85%, 70% 100%, 30% 100%, 15% 85%, 0% 70%, 0% 30%, 15% 15%)',
            boxShadow: '0 0 12px rgba(239, 68, 68, 0.6)',
            animation: 'pulse-glow 1.5s ease-in-out infinite',
          }} />
          <span style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '9px',
            letterSpacing: '2px',
            color: '#f5e6a3',
            textShadow: '2px 2px 0 #2e1a0e',
          }}>
            FUTURE FAILURE REPLAY
          </span>
        </div>

        {isDemo && (
          <div style={{
            fontFamily: "'VT323', monospace",
            fontSize: '15px',
            textAlign: 'center',
            padding: '10px 16px',
            background: 'rgba(61, 185, 245, 0.15)',
            border: '2px solid rgba(61, 185, 245, 0.4)',
            color: '#3db9f5',
            clipPath: 'polygon(0 4px, 4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px))',
            marginBottom: '12px',
          }}>
            ⚡ DEMO MODE — Upload a real .zip to analyze your own project
          </div>
        )}

        {/* Damage Bar */}
        <div style={{
          height: '14px',
          background: 'rgba(0, 0, 0, 0.5)',
          border: '2px solid rgba(232, 201, 106, 0.3)',
          clipPath: 'polygon(0 4px, 4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px))',
          overflow: 'hidden',
          marginBottom: '10px',
        }}>
          <div style={{
            height: '100%',
            width: `${damagePercent}%`,
            background: 'linear-gradient(90deg, #4ade80, #fbbf24, #ef4444)',
            transition: 'width 1s ease-out',
            boxShadow: `0 0 12px ${damageLabelColor}60`,
          }} />
        </div>
        <p style={{
          fontFamily: "'VT323', monospace",
          fontSize: '14px',
          color: damageLabelColor,
          textShadow: `0 0 10px ${damageLabelColor}60`,
          transition: 'color 0.3s',
        }}>
          {damageLabel}
        </p>
      </div>

      {/* Events List */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
        }}
      >
        <AnimatePresence>
          {visibleEvents.map((ev, i) => {
            const color = eventColors[ev.type]
            return (
              <motion.div
                key={i}
                style={{
                  display: 'flex',
                  gap: '16px',
                  marginBottom: '20px',
                }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* Time */}
                <div style={{
                  fontFamily: "'VT323', monospace",
                  fontSize: '14px',
                  color: '#d4a843',
                  flexShrink: 0,
                  minWidth: '60px',
                  paddingTop: '2px',
                }}>
                  {ev.time}
                </div>

                {/* Timeline Bar */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flexShrink: 0,
                }}>
                  <div style={{
                    width: '14px',
                    height: '14px',
                    background: color,
                    clipPath: 'polygon(30% 0%, 70% 0%, 85% 15%, 100% 30%, 100% 70%, 85% 85%, 70% 100%, 30% 100%, 15% 85%, 0% 70%, 0% 30%, 15% 15%)',
                    boxShadow: `0 0 12px ${color}80`,
                    flexShrink: 0,
                  }} />
                  {i < visibleEvents.length - 1 && (
                    <div style={{
                      width: '2px',
                      flex: 1,
                      minHeight: '24px',
                      background: 'rgba(232, 201, 106, 0.3)',
                    }} />
                  )}
                </div>

                {/* Event Content */}
                <div style={{ flex: 1, paddingBottom: '4px' }}>
                  <p style={{
                    fontFamily: "'VT323', monospace",
                    fontSize: '17px',
                    fontWeight: 'bold',
                    color: color,
                    textShadow: `0 0 10px ${color}60`,
                    lineHeight: '1.4',
                  }}>
                    {ev.event}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Playback Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px 20px',
        borderTop: '2px solid rgba(232, 201, 106, 0.3)',
        flexShrink: 0,
      }}>
        <button
          onClick={replay}
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '8px',
            padding: '10px 16px',
            background: 'rgba(232, 201, 106, 0.1)',
            border: '2px solid rgba(232, 201, 106, 0.5)',
            color: '#f5e6a3',
            clipPath: 'polygon(0 4px, 4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px))',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(232, 201, 106, 0.2)'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(232, 201, 106, 0.1)'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          ⏮ REPLAY
        </button>
        <button
          onClick={togglePlay}
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '8px',
            padding: '10px 16px',
            background: isPlaying ? 'rgba(74, 222, 128, 0.2)' : 'rgba(232, 201, 106, 0.1)',
            border: `2px solid ${isPlaying ? 'rgba(74, 222, 128, 0.6)' : 'rgba(232, 201, 106, 0.5)'}`,
            color: isPlaying ? '#4ade80' : '#f5e6a3',
            clipPath: 'polygon(0 4px, 4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px))',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          {isPlaying ? '⏸ PAUSE' : '▶ PLAY'}
        </button>
        <span style={{
          flex: 1,
          fontFamily: "'VT323', monospace",
          fontSize: '14px',
          color: '#d4a843',
        }}>
          EVENT {visibleEvents.length} / {events.length}
        </span>
        <button
          onClick={onReset}
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '8px',
            padding: '10px 16px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '2px solid rgba(239, 68, 68, 0.5)',
            color: '#ef4444',
            clipPath: 'polygon(0 4px, 4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px))',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          ✕ RESET
        </button>
      </div>
    </div>
  )
}
