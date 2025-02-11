import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs/promises';

const MAX_FILE_SIZE = 1024 * 1024; // 1MB
const SUPPORTED_EXTENSIONS = new Set([
  '.ts', '.js', '.jsx', '.tsx',
  '.html', '.css', '.scss', '.less',
  '.json', '.md', '.txt', '.yml', '.yaml',
  '.py', '.rb', '.php', '.java', '.c', '.cpp',
  '.h', '.hpp', '.cs', '.go', '.rs', '.swift'
]);

export async function readFileContent(uri: vscode.Uri): Promise<string | null> {
  try {
    const stat = await fs.stat(uri.fsPath);

    // Skip if file is too large
    if (stat.size > MAX_FILE_SIZE) {
      console.warn(`File ${uri.fsPath} is too large (${stat.size} bytes)`);
      return null;
    }

    // Skip if extension not supported
    const ext = path.extname(uri.fsPath).toLowerCase();
    if (!SUPPORTED_EXTENSIONS.has(ext)) {
      console.warn(`File extension ${ext} not supported`);
      return null;
    }

    const content = await fs.readFile(uri.fsPath, 'utf-8');
    return content;
  } catch (error) {
    console.error(`Error reading file ${uri.fsPath}:`, error);
    return null;
  }
}

export async function getWorkspaceFiles(
  workspaceFolder: vscode.WorkspaceFolder,
  pattern: string
): Promise<vscode.Uri[]> {
  const files = await vscode.workspace.findFiles(
    new vscode.RelativePattern(workspaceFolder, pattern),
    '**/node_modules/**'
  );
  return files;
}

export function formatFileContext(
  filePath: string,
  content: string,
  maxLength: number = 1000
): string {
  const truncatedContent = content.length > maxLength
    ? content.slice(0, maxLength) + '...(truncated)'
    : content;

  return `File: ${filePath}\n\`\`\`\n${truncatedContent}\n\`\`\`\n`;
}

export async function getFilesContext(
  files: vscode.Uri[],
  maxTotalLength: number = 10000
): Promise<string> {
  let context = '';
  let totalLength = 0;

  for (const file of files) {
    const content = await readFileContent(file);
    if (!content) continue;

    const relativePath = vscode.workspace.asRelativePath(file);
    const fileContext = formatFileContext(relativePath, content);

    if (totalLength + fileContext.length > maxTotalLength) {
      console.warn('Max context length reached');
      break;
    }

    context += fileContext + '\n';
    totalLength += fileContext.length;
  }

  return context;
}
