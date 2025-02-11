import * as vscode from 'vscode';
import { default as ollama } from 'ollama';
import { getWebViewContent, processCommand, getModelList } from './lib/index';
import type { Message } from './lib/types';
import { isOllamaRunning } from './lib/utils';
import { ContextProvider } from './lib/services/contextProvider';

interface ExtensionState {
  currentModel: string | null;
}

interface ChatMessage {
  command: string;
  text?: string;
  model?: string;
  includeWorkspaceContext?: boolean;
  context?: string;
  messages?: Message[];
}

export function activate(context: vscode.ExtensionContext) {
  // Initialize state with stored model
  const state: ExtensionState = {
    currentModel: context.globalState.get('currentModel') || null
  };

  // Ensure storage is initialized
  if (!context.storageUri && !context.globalStorageUri) {
    console.error('No storage available');
    return;
  }

  console.log('Storage path:', context.storageUri?.fsPath || context.globalStorageUri.fsPath);

  const disposable = vscode.commands.registerCommand('llull.start', async () => {
    // Check if Ollama is running before creating the panel
    if (!await isOllamaRunning()) {
      vscode.window.showErrorMessage('Ollama is not running. Please start Ollama and try again.');
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      'llull',
      'llull',
      vscode.ViewColumn.Two,
      { enableScripts: true }
    );

    panel.webview.html = getWebViewContent(panel.webview, context.extensionUri);

    // Handle model selection and persistence
    panel.webview.onDidReceiveMessage(async (message: ChatMessage) => {
      console.log('[llull] received message:', message);
      try {
        if (message.command === 'getModelList') {
          console.log('[llull] Requesting model list from Ollama...');
          try {
            const response = await ollama.list();
            console.log('[llull] Raw Ollama response:', response);

            // Ensure we have a valid response
            if (!response || !response.models) {
              throw new Error('Invalid response from Ollama');
            }

            console.log('[llull] Sending models to webview:', response.models);
            panel.webview.postMessage({
              command: 'modelList',
              models: response.models
            });
          } catch (error) {
            console.error('[llull] Error getting models:', error);
            panel.webview.postMessage({
              command: 'modelList',
              models: []
            });
          }
          return;
        }

        // Don't process other commands until we have a model
        if (!state.currentModel && message.command !== 'setModel') {
          panel.webview.postMessage({
            command: 'chatResponse',
            text: 'Please select a model first.',
            done: true
          });
          return;
        }

        if (message.command === 'setModel' && message.model) {
          state.currentModel = message.model;
          await context.globalState.update('currentModel', message.model);
          panel.webview.postMessage({
            command: 'modelChanged',
            model: message.model
          });
          return;
        }

        if (message.command === 'chat') {
          const contextProvider = new ContextProvider(context);
          let additionalContext = '';

          // Get context from selection if any
          const selectionContext = await contextProvider.getContextFromSelection();
          if (selectionContext) {
            additionalContext += selectionContext;
          }

          // Add workspace context if requested
          if (message.includeWorkspaceContext) {
            const workspaceContext = await contextProvider.getContextFromWorkspace();
            if (workspaceContext) {
              additionalContext += '\nRelevant workspace files:\n' + workspaceContext;
            }
          }

          // Create a new message object with the context
          const messageWithContext: ChatMessage = {
            ...message,
            context: additionalContext || undefined,
            messages: message.messages
          };

          // At this point we know currentModel is not null because of the check above
          if (state.currentModel) {  // TypeScript guard
            await processCommand(panel, messageWithContext, ollama, state.currentModel, context);
            console.log('[llull] processed message');
          }
        }
      } catch (error) {
        console.error('[llull] error processing message:', error);
      }
    });

    // If we have a stored model, send it to the webview
    if (state.currentModel) {
      panel.webview.postMessage({
        command: 'modelChanged',
        model: state.currentModel
      });
    }
  });

  context.subscriptions.push(disposable);
  console.log('[llull] is active');
}

export function deactivate() {}
