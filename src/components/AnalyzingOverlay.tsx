'use client'

import { AnimatePresence, motion } from 'framer-motion'

interface AnalyzingOverlayProps {
  visible: boolean
}

export default function AnalyzingOverlay({ visible }: AnalyzingOverlayProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-6"
          style={{ background: 'rgba(15,10,4,0.85)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Spinner */}
          <div
            className="w-12 h-12 rounded-full spin"
            style={{
              border: '3px solid var(--border2)',
              borderTopColor: 'var(--amber)',
              boxShadow: '0 0 16px rgba(251,191,36,0.3)',
            }}
          />

        </motion.div>
      )}
    </AnimatePresence>
  )
}
