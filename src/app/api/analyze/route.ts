import { NextRequest, NextResponse } from 'next/server';
import {
  buildSystemSnapshot,
  simpleHash,
  generateDeterministicAnalysis,
  generateDeterministicRiskScore,
  extractFirstJsonObject,
} from '@/lib/analysis';

export async function POST(request: NextRequest) {
  try {
    const { fileSize, base64Data } = await request.json();

    // Decode and build system snapshot
    const buffer = Buffer.from(base64Data, 'base64');
    const snapshot = buildSystemSnapshot(buffer, fileSize);

    // Create hash for deterministic seed
    const fileHash = simpleHash(JSON.stringify(snapshot.folder_structure));

    // Build AI prompt with structured snapshot
    const prompt = `You are ShadowMerge AI, a software system failure simulator.

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
${snapshot.folder_structure.folders.slice(0, 10).map(f => `- ${f}`).join('\n')}

Key Files:
${snapshot.folder_structure.key_files.map(f => `- ${f}`).join('\n')}

Dependency Graph:
${snapshot.dependency_graph.relationships.slice(0, 8).map(r => `- ${r}`).join('\n')}

Risk Signals Detected:
${snapshot.risk_signals.length > 0 ? snapshot.risk_signals.map(r => `- ${r}`).join('\n') : '- None detected'}

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

Make the simulation realistic - show a step-by-step failure cascade under production load. Include 8-12 simulation events. Make issues specific and technical, not generic. Include cost impact where relevant.`;

    // Check if Watson credentials are configured
    const hasWatsonConfig = process.env.WATSONX_API_KEY &&
                           process.env.WATSONX_API_KEY !== 'your_api_key_here';

    console.log('=== WATSONX API CHECK ===');
    console.log('API Key exists:', !!process.env.WATSONX_API_KEY);
    console.log('API Key value:', process.env.WATSONX_API_KEY?.substring(0, 10) + '...');
    console.log('Project ID exists:', !!process.env.WATSONX_PROJECT_ID);
    console.log('Has valid config:', hasWatsonConfig);
    console.log('========================');

    let result;
    let usedWatson = false;

    const hasSecurityIssues = snapshot.risk_signals.some(s => s.includes('Sensitive') || s.includes('Insecure'));
    const hasPerformanceIssues = snapshot.risk_signals.some(s => s.includes('Dangerous'));

    if (hasWatsonConfig) {
      // Use IBM Watsonx.ai
      console.log('🚀 Attempting to call Watsonx.ai API...');
      try {
        result = await analyzeWithWatson(prompt, fileHash, base64Data);
        usedWatson = true;
        console.log('✅ Watsonx.ai API call successful!');
        console.log('Response risk_score:', result.risk_score);

        // Ensure risk_score is set and valid (not 0, not null, not undefined)
        if (typeof result.risk_score !== 'number' || result.risk_score === 0 || isNaN(result.risk_score)) {
          console.log('⚠️ Risk score invalid (' + result.risk_score + '), generating deterministic score');
          result.risk_score = generateDeterministicRiskScore(fileHash, hasSecurityIssues, hasPerformanceIssues);
          console.log('✅ Using deterministic risk score:', result.risk_score);
        }
      } catch (error: any) {
        console.error('❌ Watson analysis failed:', error.message);
        console.error('Full error:', error);
        console.log('📊 Falling back to deterministic analysis');
        result = generateDeterministicAnalysis(fileHash, fileSize, snapshot.project_name, snapshot.stack, snapshot.file_stats.total_files, hasSecurityIssues, hasPerformanceIssues);
      }
    } else {
      // Use deterministic analysis for development
      console.warn('⚠️ Watson credentials not configured. Using deterministic analysis.');
      console.log('To use Watsonx.ai, set WATSONX_API_KEY and WATSONX_PROJECT_ID in .env.local');
      result = generateDeterministicAnalysis(fileHash, fileSize, snapshot.project_name, snapshot.stack, snapshot.file_stats.total_files, hasSecurityIssues, hasPerformanceIssues);
    }

    // Add metadata to response
    result._meta = {
      usedWatson,
      timestamp: new Date().toISOString(),
      fileHash,
      detectedStack: snapshot.stack,
      totalFiles: snapshot.file_stats.total_files,
      snapshot: snapshot
    };

    return NextResponse.json({ result });

  } catch (error: any) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze project' },
      { status: 500 }
    );
  }
}

async function analyzeWithWatson(prompt: string, fileHash: number, base64Data?: string): Promise<any> {
  const apiKey = process.env.WATSONX_API_KEY;
  const projectId = process.env.WATSONX_PROJECT_ID;
  const url = process.env.WATSONX_URL || 'https://us-south.ml.cloud.ibm.com';
  const modelId = process.env.WATSONX_MODEL_ID || 'ibm/granite-13b-chat-v2';

  console.log('📡 Watsonx API Configuration:');
  console.log('  URL:', url);
  console.log('  Model:', modelId);
  console.log('  Project ID:', projectId?.substring(0, 10) + '...');

  // Get IAM token
  console.log('🔑 Requesting IAM token...');
  const tokenResponse = await fetch('https://iam.cloud.ibm.com/identity/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${apiKey}`,
  });

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text();
    console.error('❌ IAM token request failed:', tokenResponse.status, errorText);
    throw new Error(`IAM authentication failed: ${tokenResponse.status}`);
  }

  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;
  console.log('✅ IAM token received');

  // Use file hash as seed for consistent but unique results per file
  const seed = Math.abs(fileHash) % 10000;
  console.log('🎲 Using seed based on file hash:', seed);

  // Format prompt for chat API with system and user messages
  const systemMessage = "You are ShadowMerge AI, a software system failure simulator. Analyze codebases and predict deployment failures. Always respond with valid JSON only, no markdown formatting.";

  const userMessage = prompt;

  // Call Watsonx.ai using the new chat API
  console.log('🤖 Calling Watsonx.ai chat API...');
  const response = await fetch(`${url}/ml/v1/text/chat?version=2023-05-29`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      model_id: modelId,
      messages: [
        {
          role: "system",
          content: systemMessage
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      parameters: {
        max_tokens: 3000,
        temperature: 0.7,  // Increased for better generation
        top_p: 0.9,        // Increased for more diverse responses
        random_seed: seed,
        stop_sequences: ["```\n\n", "\n\nHuman:", "\n\nUser:"],
      },
      project_id: projectId,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Watsonx API request failed:', response.status, errorText);
    throw new Error(`Watsonx API failed: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  console.log('📦 Watsonx response received');

  // Parse the generated text as JSON
  try {
    // Handle both chat and generation API response formats
    const generatedText = data.choices?.[0]?.message?.content || data.results?.[0]?.generated_text || '';
    console.log('📝 Generated text length:', generatedText?.length);
    console.log('📝 First 200 chars:', generatedText?.substring(0, 200));

    // Pull the JSON object out of the model response.
    const parsed = extractFirstJsonObject(generatedText);
    console.log('✅ Successfully parsed JSON response');
    return parsed;
  } catch (e) {
    console.error('❌ Failed to parse Watson response:', e);
    console.error('Raw response:', JSON.stringify(data, null, 2));
    throw e;
  }
}
