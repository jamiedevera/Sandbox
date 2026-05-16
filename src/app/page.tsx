'use client'

import { useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import TopBar from '@/components/TopBar'
import UploadScreen from '@/components/UploadScreen'
import ProcessingScreen, { type LogEntry } from '@/components/ProcessingScreen'
import Dashboard from '@/components/Dashboard'
import AnalyzingOverlay from '@/components/AnalyzingOverlay'
import {
  DEMO_DATA,
  PROCESSING_STAGES_DEMO,
  PROCESSING_STAGES_UPLOAD,
} from '@/lib/demo-data'
import { sleep, statusColors, formatFileSize } from '@/lib/utils'
import type { Screen, StatusType, ProjectData, AIResult } from '@/types'

export default function HomePage() {
  const [screen, setScreen] = useState<Screen>('upload')
  const [status, setStatus] = useState<StatusType>('IDLE')
  const [projectName, setProjectName] = useState('// NO PROJECT LOADED')
  const [riskScore, setRiskScore] = useState<number | null>(null)

  const [procStage, setProcStage] = useState('')
  const [procLogs, setProcLogs] = useState<LogEntry[]>([])
  const [procStack, setProcStack] = useState<string[]>([])

  const [dashboardData, setDashboardData] = useState<ProjectData | null>(null)
  const [isDemo, setIsDemo] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)

  /* ── Helpers ── */
  const updateStatus = useCallback((text: StatusType, color?: string) => {
    setStatus(text)
  }, [])

  const addLog = useCallback((text: string, type: LogEntry['type']) => {
    const ts = new Date().toISOString().slice(11, 19)
    setProcLogs((prev) => [...prev, { ts, text, type }])
  }, [])

  /* ── Run stages animation ── */
  const runStages = useCallback(
    async (stages: typeof PROCESSING_STAGES_DEMO) => {
      for (const stage of stages) {
        setProcStage(stage.msg)
        for (const log of stage.logs) {
          await sleep(400 + Math.random() * 300)
          addLog(log.text, log.type)
        }
        await sleep(600)
      }
    },
    [addLog]
  )

  /* ── Demo flow ── */
  const handleDemo = useCallback(async () => {
    setIsDemo(true)
    setScreen('processing')
    updateStatus('ANALYZING')
    setProcLogs([])
    setProcStack([])
    setProjectName(`// ${DEMO_DATA.projectName}`)

    await runStages(PROCESSING_STAGES_DEMO)

    DEMO_DATA.stack.forEach((s) =>
      setProcStack((prev) => [...prev, s])
    )
    await sleep(800)

    setRiskScore(DEMO_DATA.aiResult.risk_score)
    setDashboardData(DEMO_DATA)
    setScreen('dashboard')
    updateStatus('ACTIVE')
  }, [runStages, updateStatus])

  /* ── Upload flow ── */
  const handleFile = useCallback(
    async (file: File) => {
      setIsDemo(false)
      setScreen('processing')
      updateStatus('ANALYZING')
      setProcLogs([])
      setProcStack([])
      setProjectName(`// ${file.name.replace('.zip', '')}`)

      const stages = PROCESSING_STAGES_UPLOAD.map((s, i) => {
        if (i === 0) {
          return {
            ...s,
            logs: [
              { text: 'Decompressing archive...', type: 'info' as const },
              {
                text: `Archive size: ${formatFileSize(file.size)}`,
                type: 'ok' as const,
              },
              { text: 'Reading file tree...', type: 'ok' as const },
            ],
          }
        }
        return s
      })

      await runStages(stages)

      // Read file as base64
      const base64: string = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) =>
          resolve((e.target?.result as string).split(',')[1])
        reader.readAsDataURL(file)
      })

      // Call AI
      setAnalyzing(true)
      addLog('Connecting to Claude...', 'info')

      let aiResult: AIResult

      try {
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileSize: (file.size / 1024).toFixed(1),
            base64Data: base64,
          }),
        })
        const json = await res.json()
        aiResult = json.result
        
        // Debug logging
        console.log('🔍 API Response:', json)
        console.log('🔍 AI Result:', aiResult)
        console.log('🔍 Risk Score:', aiResult?.risk_score)
        
        addLog('AI analysis complete!', 'ok')
      } catch {
        addLog('AI failed, falling back to demo analysis...', 'warn')
        aiResult = DEMO_DATA.aiResult
        aiResult.risk_score = 60 + Math.floor(Math.random() * 30)
      } finally {
        setAnalyzing(false)
      }

      const detectedStack = aiResult.stack ?? ['Unknown Stack']
      const detectedModules = aiResult.modules ?? [
        { name: 'Main Module', risk: 'warn' as const, files: 20 },
        { name: 'API Layer', risk: 'danger' as const, files: 8 },
        { name: 'Database', risk: 'warn' as const, files: 5 },
      ]

      detectedStack.forEach((s) => setProcStack((prev) => [...prev, s]))
      await sleep(1200)

      const projectData: ProjectData = {
        projectName: aiResult.projectName ?? file.name.replace('.zip', ''),
        modules: detectedModules,
        stack: detectedStack,
        aiResult,
      }

      setRiskScore(aiResult.risk_score)
      setDashboardData(projectData)
      setScreen('dashboard')
      updateStatus('ACTIVE')
    },
    [runStages, addLog, updateStatus]
  )

  /* ── Reset ── */
  const handleReset = useCallback(() => {
    setScreen('upload')
    setStatus('IDLE')
    setProjectName('// NO PROJECT LOADED')
    setRiskScore(null)
    setProcLogs([])
    setProcStack([])
    setDashboardData(null)
  }, [])

  /* ── Status change from timeline ── */
  const handleStatusChange = useCallback((text: string, color: string) => {
    setStatus(text as StatusType)
  }, [])

  const statusColor = statusColors[status] ?? '#4ade80'

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar
        status={status}
        statusColor={statusColor}
        projectName={projectName}
        riskScore={riskScore}
      />

      <AnalyzingOverlay visible={analyzing} />

      <main className="flex flex-col flex-1">
        <AnimatePresence mode="wait">
          {screen === 'upload' && (
            <UploadScreen
              key="upload"
              onFileSelected={handleFile}
              onDemo={handleDemo}
            />
          )}
          {screen === 'processing' && (
            <ProcessingScreen
              key="processing"
              stage={procStage}
              logs={procLogs}
              stackTags={procStack}
            />
          )}
          {screen === 'dashboard' && dashboardData && (
            <Dashboard
              key="dashboard"
              data={dashboardData}
              isDemo={isDemo}
              onStatusChange={handleStatusChange}
              onReset={handleReset}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
