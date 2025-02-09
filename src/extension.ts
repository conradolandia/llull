import * as vscode from 'vscode';
import { default as ollama } from 'ollama';
import { getWebViewContent, processCommand } from './lib/index';

const model: string = 'deepseek-coder-v2:16b';

export function activate(context: vscode.ExtensionContext) {
  // Ensure storage is initialized
  if (!context.storageUri && !context.globalStorageUri) {
    console.error('No storage available');
    return;
  }

  console.log('Storage path:', context.storageUri?.fsPath || context.globalStorageUri.fsPath);

  const disposable = vscode.commands.registerCommand('llull.start', () => {
    const panel = vscode.window.createWebviewPanel(
      'llull',
      'llull',
      vscode.ViewColumn.Two,
      { enableScripts: true }
    );

    panel.webview.html = getWebViewContent(panel.webview, context.extensionUri);

    panel.webview.onDidReceiveMessage(async (message: { command: string; prompt: string }) => {
      console.log('[llull] received message:', message);
      try {
        await processCommand(panel, message, ollama, model, context);
        console.log('[llull] processed message');
      } catch (error) {
        console.error('[llull] error processing message:', error);
      }
    });
  });

  context.subscriptions.push(disposable);
  console.log('[llull] is active');
}

export function deactivate() {}
