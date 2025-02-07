import * as vscode from 'vscode';
import ollama from 'ollama';
import { getWebViewContent, processCommand } from './lib/index';

const model: string = 'deepseek-coder-v2:16b';

export function activate(context: vscode.ExtensionContext) {
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
      processCommand(panel, message, ollama, model);
      console.log('[llull] processed message');
    });
  });

  context.subscriptions.push(disposable);
  console.log('[llull] is active');
}

export function deactivate() {}
