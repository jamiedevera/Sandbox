import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { prompt, base64Data, fileSize } = await req.json()

    const analysisPrompt = `You are a senior DevOps and security engineer running a deployment simulation.

A user has uploaded a ZIP file of their codebase (${fileSize} KB).

Analyze the codebase and simulate real-world deployment. Return ONLY valid JSON with this exact structure:

{
  "projectName": "detected project name",
  "stack": ["tech1", "tech2"],
  "modules": [
    {"name": "Module Name", "risk": "ok|warn|danger", "files": 10}
  ],
  "risk_score": 0-100,
  "summary": "2-3 sentence executive summary of deployment risks",
  "issues": [
    {
      "type": "performance|security|architecture",
      "severity": "low|medium|high|critical",
      "description": "specific technical issue",
      "impact": "concrete business/technical impact"
    }
  ],
  "simulation": [
    {"time": "T+0s", "event": "description of what happens", "type": "normal|warn|danger"}
  ]
}

Make the simulation realistic - show a step-by-step failure cascade under production load. Include 8-12 simulation events. Make issues specific and technical, not generic. Include cost impact where relevant.`

    const messages: Array<{ role: string; content: unknown }> = [
      {
        role: 'user',
        content: base64Data
          ? [
              {
                type: 'document',
                source: {
                  type: 'base64',
                  media_type: 'application/zip',
                  data: base64Data,
                },
              },
              { type: 'text', text: analysisPrompt },
            ]
          : analysisPrompt,
      },
    ]

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': process.env.ANTHROPIC_API_KEY ?? '',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages,
      }),
    })

    const data = await response.json()
    const text = data.content?.map((i: { text?: string }) => i.text || '').join('') ?? ''
    const clean = text.replace(/```json|```/g, '').trim()

    return NextResponse.json({ result: JSON.parse(clean) })
  } catch (err) {
    console.error('AI analysis error:', err)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
