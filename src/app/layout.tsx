import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sandbox — Deployment Risk Simulation Engine',
  description:
    'A retro pixel beach-inspired AI simulation platform that analyzes codebases and predicts deployment risks through simulated system behavior.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&family=Rajdhani:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
