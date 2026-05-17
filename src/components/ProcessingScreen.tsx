'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useRef } from 'react'

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
  const logContainerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new logs are added
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTo({
        top: logContainerRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [logs])
  return (
    <motion.div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Animated Waves GIF Background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        opacity: 0.25,
        overflow: 'hidden',
      }}>
        <img
          src="/waves.gif"
          alt="Waves Background"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>

      {/* Content Container - Fixed Width with Max Width */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '32px',
        width: '100%',
        maxWidth: '700px',
      }}>
        {/* Castle Image */}
        <div style={{
          width: '140px',
          height: '140px',
          position: 'relative',
          animation: 'float-up 3s ease-in-out infinite',
          marginBottom: '8px',
        }}>
          <Image
            src="/castle.png"
            alt="Castle"
            width={140}
            height={140}
            style={{
              imageRendering: 'pixelated',
              filter: 'drop-shadow(0 6px 16px rgba(0, 0, 0, 0.6))',
            }}
            priority
          />
        </div>

        {/* Stage Label - Beach Themed */}
        <div style={{
          padding: '12px 32px',
          background: 'rgba(107, 66, 38, 0.7)',
          border: '2px solid rgba(232, 201, 106, 0.5)',
          clipPath: 'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.6)',
        }}>
          <p style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '10px',
            textAlign: 'center',
            lineHeight: '1.8',
            color: '#f5e6a3',
            textShadow: '2px 2px 0 #2e1a0e, 0 0 16px rgba(245, 230, 163, 0.5)',
            letterSpacing: '2px',
            margin: 0,
          }}>
            {stage}
          </p>
        </div>

        {/* Log Feed Panel - Fixed Size with Auto-scroll */}
        <div
          ref={logContainerRef}
          style={{
            width: '100%',
            height: '200px',
            padding: '20px 24px',
            background: 'rgba(26, 15, 2, 0.95)',
            border: '3px solid rgba(232, 201, 106, 0.5)',
            clipPath: 'polygon(0 12px, 12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px))',
            boxShadow: '0 6px 24px rgba(0, 0, 0, 0.7), inset 0 0 0 1px rgba(232, 201, 106, 0.2)',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          {logs.map((entry, i) => (
            <div key={i} style={{
              fontFamily: "'VT323', monospace",
              fontSize: '17px',
              marginBottom: '8px',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start',
            }}>
              <span style={{
                color: '#d4a843',
                opacity: 0.8,
                flexShrink: 0,
                fontWeight: 'bold',
              }}>[{entry.ts}]</span>
              <span style={{
                color: entry.type === 'ok' ? '#4ade80' :
                       entry.type === 'warn' ? '#fbbf24' :
                       entry.type === 'err' ? '#ef4444' :
                       '#f5e6a3',
                textShadow: entry.type === 'ok' ? '0 0 10px rgba(74, 222, 128, 0.5)' :
                           entry.type === 'warn' ? '0 0 10px rgba(251, 191, 36, 0.5)' :
                           entry.type === 'err' ? '0 0 10px rgba(239, 68, 68, 0.5)' :
                           '0 0 8px rgba(245, 230, 163, 0.4)',
                lineHeight: '1.4',
              }}>{entry.text}</span>
            </div>
          ))}
        </div>

        {/* Stack Tags - Enhanced Readability */}
        {stackTags.length > 0 && (
          <div style={{
            width: '100%',
            minHeight: '56px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '14px',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '12px 0',
          }}>
            {stackTags.map((tag) => (
              <span key={tag} style={{
                fontFamily: "'VT323', monospace",
                fontSize: '20px',
                fontWeight: 'bold',
                padding: '10px 22px',
                background: 'rgba(232, 201, 106, 0.25)',
                border: '3px solid rgba(232, 201, 106, 0.7)',
                color: '#f5e6a3',
                textShadow: '2px 2px 0 rgba(0, 0, 0, 0.9), 0 0 12px rgba(245, 230, 163, 0.4)',
                clipPath: 'polygon(0 6px, 6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px))',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.6), inset 0 0 0 1px rgba(232, 201, 106, 0.3)',
                whiteSpace: 'nowrap',
                letterSpacing: '1px',
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
