'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface UploadScreenProps {
  onFileSelected: (file: File) => void
  onDemo: () => void
}

export default function UploadScreen({ onFileSelected, onDemo }: UploadScreenProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file && file.name.endsWith('.zip')) {
      onFileSelected(file)
    } else {
      alert('Please drop a .zip file!')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onFileSelected(file)
  }

  return (
    <motion.div
      className="flex-1 flex flex-col items-center justify-center px-5 py-10 gap-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      {/* Title */}
      <div className="text-center">
        <h1
          className="font-pixel text-lg leading-relaxed mb-3"
          style={{
            color: 'var(--amber)',
            textShadow:
              '0 0 20px rgba(251,191,36,0.5), 3px 3px 0 rgba(107,66,38,0.9)',
            fontSize: 'clamp(12px, 2.5vw, 18px)',
          }}
        >
          DROP YOUR
          <br />
          SYSTEM INTO
          <br />
          THE SANDBOX
        </h1>
        <p
          className="font-mono-tech text-xs tracking-widest"
          style={{ color: 'var(--sand3)' }}
        >
          // DEPLOYMENT RISK SIMULATION ENGINE v2.4
        </p>
      </div>

      {/* Drop Zone */}
      <div
        className="relative w-full max-w-[560px] h-[260px] flex flex-col items-center justify-center cursor-pointer rounded-[4px] overflow-hidden transition-all duration-200"
        style={{
          border: `3px solid ${isDragOver ? 'var(--amber)' : 'var(--border2)'}`,
          background: isDragOver
            ? 'rgba(251,191,36,0.05)'
            : 'var(--panel)',
        }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        {/* Scan line */}
        <div
          className="absolute left-0 right-0 h-[2px] animate-scan pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, var(--amber), transparent)',
            opacity: 0.4,
          }}
        />

        {/* Corner decorations */}
        <div className="corner-tl" />
        <div className="corner-tr" />
        <div className="corner-bl" />
        <div className="corner-br" />

        {/* Content */}
        <div
          className="text-4xl mb-4"
          style={{ filter: 'drop-shadow(0 0 8px rgba(251,191,36,0.4))' }}
        >
          📦
        </div>
        <p
          className="font-pixel text-[9px] text-center leading-loose mb-3"
          style={{ color: 'var(--amber)' }}
        >
          DROP .ZIP HERE
          <br />
          TO INITIALIZE
        </p>
        <p
          className="font-mono-tech text-[11px] tracking-wide"
          style={{ color: 'var(--sand3)' }}
        >
          or click to select file
        </p>

        <input
          ref={inputRef}
          type="file"
          accept=".zip"
          className="hidden"
          onChange={handleChange}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-4 flex-wrap justify-center">
        <button className="px-btn" onClick={() => inputRef.current?.click()}>
          ▶ UPLOAD ZIP
        </button>
        <button className="px-btn blue" onClick={onDemo}>
          ◈ RUN DEMO
        </button>
      </div>

      {/* Supported tech */}
      <p
        className="font-mono-tech text-[10px] text-center leading-loose tracking-wide max-w-[480px]"
        style={{ color: 'var(--sand3)' }}
      >
        SUPPORTED: React · Node.js · Python · FastAPI · Express · Next.js
        <br />
        ANALYZES: Dependencies · Routes · Architecture · Security · Scale
      </p>
    </motion.div>
  )
}
