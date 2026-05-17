import { NextRequest, NextResponse } from 'next/server'
import {
  buildSystemSnapshot,
  extractFirstJsonObject,
  generateDeterministicAnalysis,
  generateDeterministicRiskScore,
  simpleHash,
} from '@/lib/analysis'

export async function POST(request: NextRequest) {
  try {
    const { fileSize, base64Data } = await request.json()

    if (!base64Data) {
      return NextResponse.json(
        { error: 'No uploaded zip data was provided.' },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(base64Data, 'base64')

    let snapshot
    try {
      snapshot = buildSystemSnapshot(buffer, fileSize || '0')
    } catch (error: any) {
      return NextResponse.json(
        {
          error: `Uploaded zip could not be parsed: ${error?.message || 'invalid archive'}`,
        },
        { status: 400 }
      )
    }

    const fileHash = simpleHash(JSON.stringify(snapshot.folder_structure))
    const prompt = buildPrompt(snapshot)

    const hasWatsonConfig =
      process.env.WATSONX_API_KEY &&
      process.env.WATSONX_PROJECT_ID &&
      process.env.WATSONX_API_KEY !== 'your_api_key_here'

    let result
    let usedWatson = false

    const hasSecurityIssues = snapshot.risk_signals.some(
      signal => signal.includes('Sensitive') || signal.includes('Insecure')
    )
    const hasPerformanceIssues = snapshot.risk_signals.some(signal =>
      signal.includes('Dangerous')
    )

    if (hasWatsonConfig) {
      try {
        result = await analyzeWithWatson(prompt, fileHash)
        usedWatson = true

        if (
          typeof result.risk_score !== 'number' ||
          result.risk_score === 0 ||
          Number.isNaN(result.risk_score)
        ) {
          result.risk_score = generateDeterministicRiskScore(
            fileHash,
            hasSecurityIssues,
            hasPerformanceIssues
          )
        }
      } catch (error: any) {
        console.error('Watson analysis failed:', error?.message || error)
        result = generateDeterministicAnalysis(
          fileHash,
          fileSize || '0',
          snapshot.project_name,
          snapshot.stack,
          snapshot.file_stats.total_files,
          hasSecurityIssues,
          hasPerformanceIssues
        )
      }
    } else {
      result = generateDeterministicAnalysis(
        fileHash,
        fileSize || '0',
        snapshot.project_name,
        snapshot.stack,
        snapshot.file_stats.total_files,
        hasSecurityIssues,
        hasPerformanceIssues
      )
    }

    result._meta = {
      usedWatson,
      timestamp: new Date().toISOString(),
      fileHash,
      detectedStack: snapshot.stack,
      totalFiles: snapshot.file_stats.total_files,
      snapshot,
    }

    return NextResponse.json({ result })
  } catch (error: any) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to analyze project' },
      { status: 500 }
    )
  }
}

function buildPrompt(snapshot: ReturnType<typeof buildSystemSnapshot>) {
  return `You are ShadowMerge AI, a software system failure simulator.

Your job: Given a structured software system snapshot, predict how the system will behave under real-world deployment conditions.

You must:
1. Identify performance risks
2. Identify security vulnerabilities
3. Identify scaling issues
4. Simulate user behavior under load
5. Produce a step-by-step failure scenario timeline

IMPORTANT:
- Do NOT ask for more files
- Do NOT request clarification
- Work only from provided system snapshot
- Be precise, technical, and realistic
- Return response in JSON format only

=== SYSTEM SNAPSHOT ===

Project: ${snapshot.project_name}
Summary: ${snapshot.project_summary}
Stack: ${snapshot.stack.join(', ')}
Entry Points: ${snapshot.entry_points.join(', ')}
Total Files: ${snapshot.file_stats.total_files}
Code Files: ${snapshot.file_stats.code_files}
Size: ${snapshot.file_stats.size_kb} KB

Key Folders:
${snapshot.folder_structure.folders.slice(0, 10).map(folder => `- ${folder}`).join('\n')}

Key Files:
${snapshot.folder_structure.key_files.map(file => `- ${file}`).join('\n')}

Dependency Graph:
${snapshot.dependency_graph.relationships.slice(0, 8).map(relationship => `- ${relationship}`).join('\n')}

Risk Signals Detected:
${snapshot.risk_signals.length > 0 ? snapshot.risk_signals.map(signal => `- ${signal}`).join('\n') : '- None detected'}

=== END SNAPSHOT ===

Analyze the codebase and simulate real-world deployment. Return ONLY valid JSON with this exact structure:

{
  "projectName": "${snapshot.project_name}",
  "stack": ${JSON.stringify(snapshot.stack)},
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
}

async function analyzeWithWatson(prompt: string, fileHash: number): Promise<any> {
  const apiKey = process.env.WATSONX_API_KEY
  const projectId = process.env.WATSONX_PROJECT_ID
  const url = process.env.WATSONX_URL || 'https://us-south.ml.cloud.ibm.com'
  const modelId = process.env.WATSONX_MODEL_ID || 'ibm/granite-13b-chat-v2'

  const tokenResponse = await fetch('https://iam.cloud.ibm.com/identity/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${apiKey}`,
  })

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text()
    throw new Error(`IAM authentication failed: ${tokenResponse.status} - ${errorText}`)
  }

  const tokenData = await tokenResponse.json()
  const accessToken = tokenData.access_token
  const seed = Math.abs(fileHash) % 10000

  const response = await fetch(`${url}/ml/v1/text/chat?version=2023-05-29`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      model_id: modelId,
      messages: [
        {
          role: 'system',
          content:
            'You are ShadowMerge AI, a software system failure simulator. Analyze codebases and predict deployment failures. Always respond with valid JSON only, no markdown formatting.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      parameters: {
        max_tokens: 3000,
        temperature: 0.7,
        top_p: 0.9,
        random_seed: seed,
        stop_sequences: ['```\n\n', '\n\nHuman:', '\n\nUser:'],
      },
      project_id: projectId,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Watsonx API failed: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  const generatedText = data.choices?.[0]?.message?.content || data.results?.[0]?.generated_text || ''
  return extractFirstJsonObject(generatedText)
}
