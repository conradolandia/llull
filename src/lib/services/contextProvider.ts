import * as vscode from 'vscode';
import { getWorkspaceFiles, getFilesContext } from '../utils/fileUtils';

export class ContextProvider {
  constructor(private context: vscode.ExtensionContext) {}

  async getContextFromSelection(): Promise<string | null> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return null;

    const selection = editor.selection;
    const selectedText = editor.document.getText(selection);
    if (!selectedText) return null;

    const relativePath = vscode.workspace.asRelativePath(editor.document.uri);
    return `Selected code from ${relativePath}:\n\`\`\`\n${selectedText}\n\`\`\`\n`;
  }

  async getContextFromWorkspace(pattern: string = '**/*.{ts,js,json}'): Promise<string | null> {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) return null;

    const files = await getWorkspaceFiles(workspaceFolder, pattern);
    return await getFilesContext(files);
  }

  async getContextFromFiles(files: vscode.Uri[]): Promise<string | null> {
    return await getFilesContext(files);
  }
}
