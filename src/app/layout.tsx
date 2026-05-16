import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SANDBOX — Deployment Risk Simulation Engine',
  description: 'Drop your system into the sandbox. Predict failure before it ships.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
