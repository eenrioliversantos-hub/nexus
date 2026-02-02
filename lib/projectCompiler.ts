import { generateSingleEntitySql, generateSingleEntityPrisma } from './generation/singleEntityGenerators';
import { generateBillOfMaterials } from './generation/billOfMaterialsGenerator';
import { Entity } from '../components/modeling/steps/Step8Entities';
import { FileTreeItem } from '../components/shared/FileExplorer';

// Helper to create a file item
const createFile = (name: string, content: string, language: string): FileTreeItem => ({
    name,
    type: 'file',
    content,
    language
});

// Helper to create a folder
const createFolder = (name: string, children: FileTreeItem[]): FileTreeItem => ({
    name,
    type: 'folder',
    children
});

const pascalCase = (str: string) => str ? str.replace(/(?:^|[^a-zA-Z0-9])([a-zA-Z0-9])/g, g => g.toUpperCase().charAt(g.length - 1)).replace(/[^a-zA-Z0-9]/g, '') : '';
const camelCase = (str: string) => {
    const pc = pascalCase(str);
    return pc.charAt(0).toLowerCase() + pc.slice(1);
};

function generateGitIgnore(): string {
    return `
# Dependencies
node_modules
.pnp
.pnp.js

# Testing
coverage

# Production
build
dist

# Misc
.DS_Store
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
`.trim();
}

/**
 * Helper to generate folder structure from a path string like "/dashboard/settings"
 */
function createPathStructure(path: string, content: string, rootFolder: FileTreeItem[]) {
    const parts = path.split('/').filter(p => p); // Remove empty strings
    let currentLevel = rootFolder;

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const isFile = i === parts.length - 1;

        if (isFile) {
            // It's the page itself, create page.tsx inside the folder
            // Check if folder exists
            let folder = currentLevel.find(f => f.name === part && f.type === 'folder');
            if (!folder) {
                folder = createFolder(part, []);
                currentLevel.push(folder);
            }
            if (folder.children) {
                folder.children.push(createFile('page.tsx', content, 'typescript'));
            }
        } else {
            // It's a directory
            let folder = currentLevel.find(f => f.name === part && f.type === 'folder');
            if (!folder) {
                folder = createFolder(part, []);
                currentLevel.push(folder);
            }
            currentLevel = folder.children || [];
        }
    }
}

/**
 * Compiles the entire project state into a file system structure.
 * Now supports detailed UI prototypes.
 */
export function compileProjectArtifacts(wizardData: any): FileTreeItem[] {
    if (!wizardData) return [];

    const tree: FileTreeItem[] = [];
    const entities: Entity[] = wizardData.data_modeling?.step8?.entities || [];
    const endpoints = wizardData.data_modeling?.step13?.endpoints || [];
    const planning = wizardData.planning || {};
    
    // Detailed AI Data
    const prototype = wizardData.interface_ux?.prototype || {};
    const devops = wizardData.devops || {};

    // --- 1. DOCUMENTATION & UML ---
    const docsChildren: FileTreeItem[] = [];
    
    docsChildren.push(createFile('VISION.md', `# ${planning.step1?.systemName || 'Projeto'}\n\n${planning.step1?.description || ''}`, 'markdown'));
    docsChildren.push(createFile('TECH_SPECS.md', `# Stack\n\n- Frontend: ${planning.step4?.frontend?.join(', ') || 'N/A'}\n- Backend: ${planning.step4?.backend?.join(', ') || 'N/A'}`, 'markdown'));
    docsChildren.push(createFile('BOM.md', generateBillOfMaterials(wizardData), 'markdown'));
    
    // Add Artifacts if available
    if (wizardData.artifacts?.architecture_design?.mermaidCode) {
        docsChildren.push(createFile('architecture_diagram.mmd', wizardData.artifacts.architecture_design.mermaidCode, 'mermaid'));
    }
    if (wizardData.artifacts?.data_modeling?.sql) {
        docsChildren.push(createFile('full_schema.sql', wizardData.artifacts.data_modeling.sql, 'sql'));
    }

    tree.push(createFolder('docs', docsChildren));

    // --- 2. DATABASE ---
    const dbChildren: FileTreeItem[] = [];
    if (entities.length > 0) {
        // Prisma Schema
        const prismaModels = entities.map(e => generateSingleEntityPrisma(e)).join('\n\n');
        const fullPrisma = `
datasource db {
  provider = "${(devops.databaseProvider || 'postgresql').toLowerCase()}"
  url      = env("DATABASE_URL")
}
generator client {
  provider = "prisma-client-js"
}

${prismaModels}
        `.trim();
        dbChildren.push(createFile('schema.prisma', fullPrisma, 'prisma'));
        
        // Seeds
        const seeds = entities.map(e => 
            createFile(`${e.name.toLowerCase()}.seed.json`, JSON.stringify([{ id: 'uuid-1', created_at: new Date() }], null, 2), 'json')
        );
        dbChildren.push(createFolder('seeds', seeds));
    }
    tree.push(createFolder('database', dbChildren));

    // --- 3. BACKEND (SERVER) ---
    const serverChildren: FileTreeItem[] = [];
    
    // If we have AI generated backend files, use them
    if (wizardData.artifacts?.api_design) {
        const apiFiles = wizardData.artifacts.api_design;
        Object.keys(apiFiles).forEach(path => {
             // Basic flattening for the viewer, ideally we would parse path
             const fileName = path.split('/').pop() || path;
             serverChildren.push(createFile(fileName, apiFiles[path], 'typescript'));
        });
    } else {
        // Fallback to basic structure
        serverChildren.push(createFile('app.ts', '// Basic Express Setup', 'typescript'));
    }
    
    tree.push(createFolder('server', serverChildren));


    // --- 4. FRONTEND (CLIENT) ---
    // This is where the magic happens for the UI
    const clientChildren: FileTreeItem[] = [];
    const appChildren: FileTreeItem[] = [];
    const componentsChildren: FileTreeItem[] = [];
    const hooksChildren: FileTreeItem[] = [];

    // A. Generate Pages (App Router Structure)
    if (prototype.pages && prototype.pages.length > 0) {
        prototype.pages.forEach((page: any) => {
            // Use the actual AI generated code if available, otherwise fallback
            const content = page.tsxCode || `
import React from 'react';

export default function ${pascalCase(page.name)}Page() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">${page.name}</h1>
      <p>${page.description}</p>
    </div>
  );
}
            `.trim();
            
            // Handle root path
            if (page.path === '/') {
                appChildren.push(createFile('page.tsx', content, 'typescript'));
            } else {
                createPathStructure(page.path, content, appChildren);
            }

            // B. Extract and Generate Hooks from Page Logic
            if (page.apiCalls && page.apiCalls.length > 0) {
                page.apiCalls.forEach((api: any) => {
                    const hookName = `use${pascalCase(api.trigger)}Action`;
                    const hookContent = `
import { useState } from 'react';

export const ${hookName} = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const execute = async (payload: any) => {
        setLoading(true);
        try {
            const response = await fetch('${api.endpoint}', {
                method: '${api.method}',
                body: JSON.stringify(payload),
                headers: { 'Content-Type': 'application/json' }
            });
            const result = await response.json();
            setData(result);
            // Success response: ${api.successResponse}
        } catch (err: any) {
            setError(err);
            // Error handling: ${api.errorHandling}
        } finally {
            setLoading(false);
        }
    };

    return { execute, loading, error, data };
};
                    `.trim();
                    hooksChildren.push(createFile(`${hookName}.ts`, hookContent, 'typescript'));
                });
            }
        });
    } else {
        // Fallback if no prototype data
         appChildren.push(createFile('page.tsx', '// Home Page', 'typescript'));
    }

    // C. Generate Components
    // If the prototype has a global list of components or we extract them from pages
    // For now, we will generate standard UI components
    const theme = wizardData.interface_ux?.conference || {};
    componentsChildren.push(createFile('Button.tsx', `
import React from 'react';
// Theme: ${theme.theme}
// Primary Color: ${theme.primaryColor}

export const Button = ({ children, ...props }) => (
  <button className="bg-[${theme.primaryColor || '#000'}] text-white px-4 py-2 rounded" {...props}>
    {children}
  </button>
);
    `.trim(), 'typescript'));
    
    // Add components extracted from pages if they are listed in 'components' array of the page object
    if (prototype.pages) {
         const uniqueComponents = new Set<string>();
         prototype.pages.forEach((page: any) => {
             if (page.components) {
                 page.components.forEach((comp: any) => {
                     if (!uniqueComponents.has(comp.name)) {
                         uniqueComponents.add(comp.name);
                         const compContent = `
import React from 'react';

// Component: ${comp.name}
// Type: ${comp.type}
// Description: ${comp.description}

export const ${pascalCase(comp.name)} = (props: any) => {
  return (
    <div className="border p-4 rounded-lg">
      <h3 className="font-bold">${comp.name}</h3>
      {/* Component logic for ${comp.type} */}
    </div>
  );
};
                         `.trim();
                         componentsChildren.push(createFile(`${pascalCase(comp.name)}.tsx`, compContent, 'typescript'));
                     }
                 });
             }
         });
    }


    clientChildren.push(createFolder('app', appChildren));
    clientChildren.push(createFolder('components', componentsChildren));
    clientChildren.push(createFolder('hooks', hooksChildren));
    
    // Layout file
    const layoutContent = `
import type { Metadata } from "next";
import { ${theme.fontFamily || 'Inter'} } from "next/font/google";
import "./globals.css";

const font = ${theme.fontFamily || 'Inter'}({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "${planning.step1?.systemName || 'App'}",
  description: "${planning.step1?.description || ''}",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>{children}</body>
    </html>
  );
}
    `.trim();
    clientChildren.push(createFile('app/layout.tsx', layoutContent, 'typescript'));

    tree.push(createFolder('client/src', clientChildren));
    tree.push(createFile('client/package.json', `{"name": "${planning.step1?.systemName?.toLowerCase().replace(/\s+/g, '-')}-client", "dependencies": {"next": "14.0.0", "react": "18.0.0"}}`, 'json'));


    // --- 5. ROOT CONFIG ---
    tree.push(createFile('.gitignore', generateGitIgnore(), 'text'));
    tree.push(createFile('README.md', `# ${planning.step1?.systemName}\n\nProject generated by Nexus Platform.\n\n## Structure\n- client/\n- server/\n- database/\n- docs/`, 'markdown'));

    return tree;
}