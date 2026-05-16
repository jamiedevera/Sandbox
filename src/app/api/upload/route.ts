import { NextRequest, NextResponse } from 'next/server';
import AdmZip from 'adm-zip';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Extract ZIP
    const zip = new AdmZip(buffer);
    const zipEntries = zip.getEntries();

    // Build file tree
    const fileTree: any = {
      name: file.name.replace('.zip', ''),
      type: 'directory',
      children: [],
      path: '/'
    };

    const fileContents: Record<string, string> = {};
    const detectedStack = detectStack(zipEntries);

    zipEntries.forEach((entry) => {
      if (!entry.isDirectory) {
        const entryPath = entry.entryName;
        const parts = entryPath.split('/');
        
        // Store file content for analysis
        try {
          const content = entry.getData().toString('utf8');
          fileContents[entryPath] = content;
        } catch (e) {
          // Binary file, skip content
          fileContents[entryPath] = '[Binary file]';
        }

        // Build tree structure
        let currentLevel = fileTree;
        parts.forEach((part, index) => {
          if (index === parts.length - 1) {
            // File
            currentLevel.children.push({
              name: part,
              type: 'file',
              path: entryPath,
              size: entry.header.size
            });
          } else {
            // Directory
            let existingDir = currentLevel.children.find(
              (child: any) => child.name === part && child.type === 'directory'
            );
            if (!existingDir) {
              existingDir = {
                name: part,
                type: 'directory',
                children: [],
                path: parts.slice(0, index + 1).join('/')
              };
              currentLevel.children.push(existingDir);
            }
            currentLevel = existingDir;
          }
        });
      }
    });

    // Generate project map
    const projectMap = generateProjectMap(fileTree, fileContents, detectedStack);

    return NextResponse.json({
      success: true,
      fileTree,
      projectMap,
      detectedStack,
      fileCount: zipEntries.filter(e => !e.isDirectory).length,
      totalSize: zipEntries.reduce((sum, e) => sum + e.header.size, 0)
    });

  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process ZIP file' },
      { status: 500 }
    );
  }
}

function detectStack(entries: AdmZip.IZipEntry[]): any {
  const files = entries.map(e => e.entryName.toLowerCase());
  const stack: any = {
    frontend: [],
    backend: [],
    database: [],
    infrastructure: []
  };

  // Frontend detection
  if (files.some(f => f.includes('package.json'))) {
    const packageFiles = entries.filter(e => e.entryName.toLowerCase().includes('package.json'));
    packageFiles.forEach(pkg => {
      try {
        const content = pkg.getData().toString('utf8');
        const json = JSON.parse(content);
        if (json.dependencies) {
          if (json.dependencies.react) stack.frontend.push('React');
          if (json.dependencies.next) stack.frontend.push('Next.js');
          if (json.dependencies.vue) stack.frontend.push('Vue');
          if (json.dependencies.angular) stack.frontend.push('Angular');
          if (json.dependencies.express) stack.backend.push('Express');
          if (json.dependencies.fastify) stack.backend.push('Fastify');
        }
      } catch (e) {}
    });
  }

  if (files.some(f => f.includes('requirements.txt') || f.endsWith('.py'))) {
    stack.backend.push('Python');
  }

  if (files.some(f => f.includes('go.mod'))) {
    stack.backend.push('Go');
  }

  if (files.some(f => f.includes('cargo.toml'))) {
    stack.backend.push('Rust');
  }

  // Database detection
  if (files.some(f => f.includes('prisma') || f.includes('schema.prisma'))) {
    stack.database.push('Prisma');
  }

  if (files.some(f => f.includes('mongoose') || f.includes('mongodb'))) {
    stack.database.push('MongoDB');
  }

  // Infrastructure
  if (files.some(f => f.includes('dockerfile'))) {
    stack.infrastructure.push('Docker');
  }

  if (files.some(f => f.includes('docker-compose'))) {
    stack.infrastructure.push('Docker Compose');
  }

  if (files.some(f => f.includes('.github/workflows'))) {
    stack.infrastructure.push('GitHub Actions');
  }

  return stack;
}

function generateProjectMap(fileTree: any, fileContents: Record<string, string>, stack: any): any {
  const nodes: any[] = [];
  const edges: any[] = [];

  // Create main module nodes
  const modules = new Set<string>();
  
  Object.keys(fileContents).forEach(filePath => {
    const parts = filePath.split('/');
    if (parts.length > 1) {
      modules.add(parts[0]);
    }
  });

  let nodeId = 0;
  const moduleNodes: Record<string, number> = {};

  // Create nodes for each module
  modules.forEach(module => {
    const id = nodeId++;
    moduleNodes[module] = id;
    
    // Determine risk level based on module name
    let risk = 'ok';
    if (module.toLowerCase().includes('auth') || module.toLowerCase().includes('payment')) {
      risk = 'danger';
    } else if (module.toLowerCase().includes('api') || module.toLowerCase().includes('database')) {
      risk = 'warn';
    }
    
    nodes.push({
      id: id.toString(),
      type: 'module',
      data: { label: module },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      risk,
      files: Object.keys(fileContents).filter(f => f.startsWith(module + '/')).length
    });
  });

  // Create some edges between nodes
  const nodeArray = Array.from(modules);
  for (let i = 0; i < nodeArray.length - 1; i++) {
    edges.push({
      id: `e${i}`,
      source: moduleNodes[nodeArray[i]].toString(),
      target: moduleNodes[nodeArray[i + 1]].toString(),
    });
  }

  return { nodes, edges };
}

// Made with Bob