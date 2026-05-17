'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface UploadScreenProps {
  onFileSelected: (file: File) => void
  onDemo: () => void
}

interface Particle {
  id: number
  x: number
  y: number
  color: string
  size: number
  velocityX: number
  velocityY: number
}

export default function UploadScreen({ onFileSelected, onDemo }: UploadScreenProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [dropError, setDropError] = useState<string | null>(null)
  const [particles, setParticles] = useState<Particle[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const createParticles = (x: number, y: number) => {
    const colors = ['#f5e6a3', '#e8c96a', '#d4a843', '#3db9f5', '#4ade80']
    const newParticles: Particle[] = []
    
    for (let i = 0; i < 30; i++) {
      newParticles.push({
        id: Date.now() + i,
        x,
        y,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        velocityX: (Math.random() - 0.5) * 400,
        velocityY: (Math.random() - 0.5) * 400 - 100,
      })
    }
    
    setParticles(newParticles)
    setTimeout(() => setParticles([]), 1000)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    // Create particles at drop position
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    createParticles(x, y)
    
    const file = e.dataTransfer.files[0]
    if (file && file.name.toLowerCase().endsWith('.zip')) {
      setDropError(null)
      setTimeout(() => onFileSelected(file), 300)
    } else {
      setDropError('That file is not a .zip archive. Drop a .zip to continue.')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.zip')) {
      setDropError('That file is not a .zip archive. Choose a .zip to continue.')
      return
    }
    setDropError(null)
    onFileSelected(file)
  }

  return (
    <motion.div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '32px 32px 32px',
        gap: '28px',
        position: 'relative',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      {/* Large SANDBOX Logo at top with overlaid text */}
      <div style={{
        textAlign: 'center',
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        width: '100%',
      }}>
        <div style={{
          position: 'relative',
          height: '140px',
          width: '700px',
          maxWidth: '90vw',
          marginBottom: '4px',
        }}>
          <Image
            src="/sandbox-logo.png"
            alt="SANDBOX"
            fill
            sizes="(max-width: 700px) 90vw, 700px"
            style={{
              objectFit: 'contain',
            }}
            className="pixelated-image"
            priority
          />
          
          {/* Overlaid subtitle text */}
          <div
            style={{
              position: 'absolute',
              bottom: '-20px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontFamily: "'VT323', monospace",
              fontSize: 'clamp(11px, 3.4vw, 20px)',
              letterSpacing: 'clamp(0.5px, 0.4vw, 2px)',
              color: '#f5e6a3',
              textShadow: '2px 2px 0 #2e1a0e, 0 0 12px rgba(245, 230, 163, 0.4)',
              whiteSpace: 'nowrap',
              maxWidth: '96vw',
            }}
          >
            🏖️ DEPLOYMENT RISK SIMULATOR v2.4 🏖️
          </div>
        </div>

        <div style={{
          display: 'inline-block',
          padding: '10px 28px',
          background: 'rgba(107, 66, 38, 0.7)',
          border: '2px solid rgba(232, 201, 106, 0.5)',
          clipPath: 'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.6)',
        }}>
          <div
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: '15px',
              fontWeight: 600,
              color: '#f5e6a3',
              textShadow: '2px 2px 0 rgba(0, 0, 0, 0.8)',
              lineHeight: '1.4',
            }}
          >
            Test your code in a safe sandbox before it hits production
          </div>
        </div>
      </div>

      {/* Drop Zone with enhanced beach theme */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload a .zip archive: press Enter to browse for a file, or drop one here"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '700px',
          height: '260px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          background: (isDragOver || isFocused)
            ? 'linear-gradient(135deg, rgba(61, 185, 245, 0.08) 0%, rgba(232, 201, 106, 0.08) 100%)'
            : 'rgba(46, 26, 14, 0.85)',
          border: `4px solid ${(isDragOver || isFocused) ? '#3db9f5' : '#6b4226'}`,
          clipPath: 'polygon(0 12px, 12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px))',
          boxShadow: (isDragOver || isFocused)
            ? 'inset 0 0 0 2px #2e1a0e, inset 6px 6px 0 rgba(61, 185, 245, 0.2), 0 0 40px rgba(61, 185, 245, 0.4), 0 8px 24px rgba(0, 0, 0, 0.6)'
            : 'inset 0 0 0 2px #2e1a0e, inset 6px 6px 0 rgba(107, 66, 38, 0.4), inset -6px -6px 0 rgba(0, 0, 0, 0.4), 0 8px 24px rgba(0, 0, 0, 0.6)',
          transition: 'all 0.3s ease',
          overflow: 'hidden',
        }}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        {/* Particle Effects */}
        <AnimatePresence>
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              style={{
                position: 'absolute',
                left: particle.x,
                top: particle.y,
                width: particle.size,
                height: particle.size,
                background: particle.color,
                borderRadius: '50%',
                pointerEvents: 'none',
                boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
              }}
              initial={{ opacity: 1, scale: 0 }}
              animate={{
                opacity: 0,
                scale: 1,
                x: particle.velocityX,
                y: particle.velocityY,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          ))}
        </AnimatePresence>
        {/* CRT Scanlines */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.1) 2px, rgba(0, 0, 0, 0.1) 3px)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {/* Animated scan line */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: '4px',
            background: isDragOver
              ? 'linear-gradient(90deg, transparent 0%, #3db9f5 30%, #7dd4f8 50%, #3db9f5 70%, transparent 100%)'
              : 'linear-gradient(90deg, transparent 0%, #e8c96a 30%, #f5e6a3 50%, #e8c96a 70%, transparent 100%)',
            boxShadow: isDragOver ? '0 0 12px #3db9f5' : '0 0 10px #e8c96a',
            animation: 'scan-sweep 4s linear infinite',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        />

        {/* Enhanced pixel corner brackets */}
        <div style={{ position: 'absolute', top: '16px', left: '16px', width: '32px', height: '32px', borderLeft: '5px solid #e8c96a', borderTop: '5px solid #e8c96a', opacity: 0.8, zIndex: 3 }} />
        <div style={{ position: 'absolute', top: '16px', right: '16px', width: '32px', height: '32px', borderRight: '5px solid #e8c96a', borderTop: '5px solid #e8c96a', opacity: 0.8, zIndex: 3 }} />
        <div style={{ position: 'absolute', bottom: '16px', left: '16px', width: '32px', height: '32px', borderLeft: '5px solid #e8c96a', borderBottom: '5px solid #e8c96a', opacity: 0.8, zIndex: 3 }} />
        <div style={{ position: 'absolute', bottom: '16px', right: '16px', width: '32px', height: '32px', borderRight: '5px solid #e8c96a', borderBottom: '5px solid #e8c96a', opacity: 0.8, zIndex: 3 }} />

        {/* Bucket icon */}
        <div style={{
          marginBottom: '16px',
          position: 'relative',
          zIndex: 10,
          width: '80px',
          height: '80px',
          animation: isDragOver ? 'crate-shake 0.5s ease-in-out' : 'none',
          transform: isDragOver ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 0.3s ease',
        }}>
          <Image
            src="/bucket.png"
            alt="Bucket"
            width={80}
            height={80}
            style={{
              imageRendering: 'pixelated',
            }}
          />
        </div>

        <div
          style={{
            fontFamily: "'Press Start 2P', monospace",
            textAlign: 'center',
            lineHeight: '2',
            marginBottom: '14px',
            position: 'relative',
            zIndex: 10,
            color: isDragOver ? '#3db9f5' : '#e8c96a',
            fontSize: '11px',
            textShadow: '2px 2px 0 #2e1a0e',
            transition: 'color 0.3s ease',
          }}
        >
          {isDragOver ? 'RELEASE TO DEPLOY' : 'DROP .ZIP HERE'}
          <br />
          {isDragOver ? 'INTO SANDBOX' : 'TO INITIALIZE'}
        </div>
        
        <div
          style={{
            fontFamily: "'VT323', monospace",
            fontSize: '16px',
            letterSpacing: '1px',
            position: 'relative',
            zIndex: 10,
            color: '#f5e6a3',
            opacity: 0.8,
            marginBottom: '8px',
          }}
        >
          or click to select file
        </div>

        <div
          style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: '13px',
            position: 'relative',
            zIndex: 10,
            color: '#d4a843',
            opacity: 0.7,
          }}
        >
          Accepts .zip archives up to 50MB
        </div>

        {dropError && (
          <div
            role="alert"
            style={{
              fontFamily: "'VT323', monospace",
              fontSize: '16px',
              position: 'relative',
              zIndex: 10,
              marginTop: '6px',
              color: '#ff7070',
              textShadow: '1px 1px 0 #2e1a0e',
              letterSpacing: '0.5px',
            }}
          >
            ⚠ {dropError}
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept=".zip"
          style={{ display: 'none' }}
          onChange={handleChange}
        />
      </div>

      {/* Buttons and Tech Section Combined */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: '850px',
      }}>
        {/* Buttons */}
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            className="px-btn"
            onClick={() => inputRef.current?.click()}
            style={{
              fontSize: '10px',
              padding: '16px 36px',
            }}
          >
            UPLOAD ZIP
          </button>
          <button
            className="px-btn blue"
            onClick={onDemo}
            style={{
              fontSize: '10px',
              padding: '16px 36px',
            }}
          >
            RUN DEMO
          </button>
        </div>

        {/* Enhanced supported tech section */}
        <div style={{
          width: '100%',
          textAlign: 'center',
          padding: '24px 32px',
          background: 'rgba(26, 15, 2, 0.85)',
          border: '3px solid rgba(232, 201, 106, 0.5)',
          clipPath: 'polygon(0 10px, 10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px))',
          boxShadow: '0 6px 24px rgba(0, 0, 0, 0.7), inset 0 0 0 1px rgba(232, 201, 106, 0.3)',
        }}>
          <p
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '9px',
              color: '#f5e6a3',
              letterSpacing: '3px',
              marginBottom: '16px',
              textShadow: '3px 3px 0 #2e1a0e, 0 0 20px rgba(245, 230, 163, 0.4)',
            }}
          >
            🏖️ SUPPORTED TECHNOLOGIES 🏖️
          </p>
          <p
            style={{
              fontFamily: "'VT323', monospace",
              fontSize: '19px',
              lineHeight: '1.8',
              letterSpacing: '2px',
              color: '#f5e6a3',
              textShadow: '2px 2px 0 #2e1a0e',
              marginBottom: '14px',
            }}
          >
            React · Node.js · Python · FastAPI · Express · Next.js · Django · Flask
          </p>
          <p
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: '15px',
              fontWeight: 500,
              color: '#e8c96a',
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
              lineHeight: '1.6',
            }}
          >
            Analyzes: Dependencies · Routes · Architecture · Security · Scalability · Performance
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-up {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes scan-sweep {
          0% { top: -5px; opacity: 0.8; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { top: 105%; opacity: 0; }
        }
        @keyframes crate-shake {
          0%, 100% { transform: rotate(0deg) translateY(0); }
          25% { transform: rotate(-3deg) translateY(-4px); }
          75% { transform: rotate(3deg) translateY(-4px); }
        }
        @keyframes wave-flow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </motion.div>
  )
}

/* ============================================================
   PIXEL ART SVG COMPONENTS
   ============================================================ */

function CrateSVG() {
  return (
    <svg width="90" height="90" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }}>
      {/* Crate body */}
      <rect x="12" y="20" width="56" height="48" fill="#d4a843" />
      <rect x="16" y="24" width="48" height="40" fill="#e8c96a" />
      
      {/* Wood planks */}
      <rect x="16" y="28" width="48" height="4" fill="#6b4226" opacity="0.3" />
      <rect x="16" y="40" width="48" height="4" fill="#6b4226" opacity="0.3" />
      <rect x="16" y="52" width="48" height="4" fill="#6b4226" opacity="0.3" />
      
      {/* Vertical planks */}
      <rect x="28" y="24" width="4" height="40" fill="#6b4226" opacity="0.2" />
      <rect x="48" y="24" width="4" height="40" fill="#6b4226" opacity="0.2" />
      
      {/* Highlights */}
      <rect x="16" y="24" width="48" height="2" fill="#f5e6a3" opacity="0.6" />
      <rect x="16" y="24" width="2" height="40" fill="#f5e6a3" opacity="0.4" />
      
      {/* Shadows */}
      <rect x="62" y="26" width="2" height="38" fill="#2e1a0e" opacity="0.6" />
      <rect x="18" y="62" width="44" height="2" fill="#2e1a0e" opacity="0.6" />
      
      {/* Lid (top) */}
      <rect x="10" y="16" width="60" height="8" fill="#d4a843" />
      <rect x="12" y="18" width="56" height="4" fill="#e8c96a" />
      <rect x="12" y="18" width="56" height="1" fill="#f5e6a3" opacity="0.8" />
    </svg>
  )
}

function SandcastleSVG() {
  return (
    <svg width="72" height="72" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated', filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))' }}>
      {/* Base */}
      <rect x="8" y="44" width="48" height="16" fill="#d4a843" />
      <rect x="10" y="46" width="44" height="12" fill="#e8c96a" />
      
      {/* Middle tower */}
      <rect x="20" y="28" width="24" height="20" fill="#d4a843" />
      <rect x="22" y="30" width="20" height="16" fill="#e8c96a" />
      
      {/* Top tower */}
      <rect x="26" y="16" width="12" height="16" fill="#d4a843" />
      <rect x="28" y="18" width="8" height="12" fill="#e8c96a" />
      
      {/* Battlements */}
      <rect x="26" y="12" width="3" height="4" fill="#d4a843" />
      <rect x="32" y="12" width="3" height="4" fill="#d4a843" />
      
      {/* Windows */}
      <rect x="30" y="22" width="4" height="6" fill="#2e1a0e" opacity="0.6" />
      <rect x="28" y="36" width="4" height="6" fill="#2e1a0e" opacity="0.6" />
      <rect x="36" y="36" width="4" height="6" fill="#2e1a0e" opacity="0.6" />
      
      {/* Highlights */}
      <rect x="10" y="46" width="44" height="2" fill="#f5e6a3" opacity="0.5" />
      <rect x="22" y="30" width="20" height="2" fill="#f5e6a3" opacity="0.5" />
      <rect x="28" y="18" width="8" height="2" fill="#f5e6a3" opacity="0.5" />
    </svg>
  )
}

function BeachBallSVG() {
  return (
    <svg width="56" height="56" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated', filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))' }}>
      {/* Ball base */}
      <circle cx="24" cy="24" r="18" fill="#3db9f5" />
      
      {/* Segments */}
      <path d="M24 6 L24 42" stroke="#e8402a" strokeWidth="3" />
      <path d="M6 24 L42 24" stroke="#f5e6a3" strokeWidth="3" />
      <path d="M12 12 L36 36" stroke="#e8402a" strokeWidth="3" />
      <path d="M36 12 L12 36" stroke="#f5e6a3" strokeWidth="3" />
      
      {/* Highlight */}
      <circle cx="18" cy="16" r="4" fill="#ffffff" opacity="0.6" />
      <circle cx="16" cy="14" r="2" fill="#ffffff" opacity="0.8" />
      
      {/* Shadow */}
      <ellipse cx="24" cy="38" rx="14" ry="3" fill="#2e1a0e" opacity="0.3" />
    </svg>
  )
}

function ShovelSVG() {
  return (
    <svg width="64" height="64" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated', filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))' }}>
      {/* Handle */}
      <rect x="38" y="4" width="4" height="36" fill="#6b4226" />
      <rect x="39" y="4" width="2" height="36" fill="#d4a843" />
      
      {/* Grip */}
      <rect x="34" y="6" width="12" height="4" fill="#e8402a" />
      <rect x="35" y="7" width="10" height="2" fill="#ff7070" />
      
      {/* Shovel blade */}
      <path d="M20 32 L36 40 L36 52 L20 48 Z" fill="#4a90d9" />
      <path d="M22 34 L34 40 L34 50 L22 46 Z" fill="#7dd4f8" />
      
      {/* Blade highlight */}
      <path d="M24 36 L32 40 L32 42 L24 38 Z" fill="#ffffff" opacity="0.4" />
      
      {/* Blade edge */}
      <path d="M20 48 L36 52 L36 54 L20 50 Z" fill="#2a6fb0" />
      
      {/* Shadow */}
      <ellipse cx="28" cy="54" rx="12" ry="2" fill="#2e1a0e" opacity="0.3" />
    </svg>
  )
}

function FlagSVG() {
  return (
    <svg width="56" height="72" viewBox="0 0 48 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated', filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))' }}>
      {/* Pole */}
      <rect x="8" y="4" width="4" height="56" fill="#6b4226" />
      <rect x="9" y="4" width="2" height="56" fill="#d4a843" />
      
      {/* Flag */}
      <path d="M12 8 L40 8 L40 28 L12 28 Z" fill="#e8402a" />
      <path d="M14 10 L38 10 L38 26 L14 26 Z" fill="#ff7070" />
      
      {/* Flag wave effect */}
      <path d="M38 10 L40 8 L40 12 Z" fill="#c42a18" />
      <path d="M38 18 L40 16 L40 20 Z" fill="#c42a18" />
      <path d="M38 26 L40 24 L40 28 Z" fill="#c42a18" />
      
      {/* Pole top */}
      <circle cx="10" cy="6" r="3" fill="#e8c96a" />
      <circle cx="10" cy="5" r="2" fill="#f5e6a3" />
      
      {/* Sand base */}
      <ellipse cx="10" cy="60" rx="8" ry="3" fill="#d4a843" />
      <ellipse cx="10" cy="59" rx="6" ry="2" fill="#e8c96a" />
    </svg>
  )
}

// Made with Bob
