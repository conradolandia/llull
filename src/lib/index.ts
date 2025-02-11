import * as vscode from 'vscode';
import { Uri } from 'vscode';
import type { Message } from './types';
import { VectorStore } from './services/vectorStore';

const title = '[Llull] asistente de programación';

export interface CommandMessage {
  command: string;
  text?: string;
  messages?: Message[];
  context?: string;
  model?: string;
  includeWorkspaceContext?: boolean;
}

export const processCommand = async (
  panel: vscode.WebviewPanel,
  message: CommandMessage,
  provider: any,
  model: string,
  context: vscode.ExtensionContext
) => {
  console.log('Extension context:', context);
  const vectorStore = new VectorStore(context);

  console.log('Received message:', message);
  if (!message || !provider || !model) return;
  if (message.command === 'chat') {
    const messages = message.messages;
    if (!provider.chat || !message.text || !messages || !Array.isArray(messages)) return;

    try {
      const relevantContext = message.context || await vectorStore.getRelevantContext(message.text);
      const systemPrompt = relevantContext
        ? `Previous relevant context: ${relevantContext}\nBe concise and focus on the current question.`
        : 'Be concise and direct in your responses.';

      let responseText = '';
      let retries = 3;
      let streamFailed = false;

      while (retries > 0) {
        try {
          console.log(`Attempt ${4 - retries}, message length: ${message.text.length}`);

          // Try streaming first
          const responseStream = await provider.chat({
            model,
            messages: [
              { role: 'system', content: systemPrompt },
              ...messages.slice(-2),
              { role: 'user', content: message.text }
            ],
            stream: true,
          });

          // Process stream with immediate updates
          for await (const part of responseStream) {
            if (part.message?.content) {
              responseText += part.message.content;
              panel.webview.postMessage({
                command: 'chatResponse',
                text: responseText,
                done: false
              });
            }
          }

          // If we get here, streaming worked
          await vectorStore.addToMemory(`User: ${message.text}\nAssistant: ${responseText.trim()}`);

          panel.webview.postMessage({
            command: 'chatResponse',
            text: responseText.trim(),
            done: true
          });

          break;
        } catch (error) {
          console.error(`Attempt ${4 - retries} failed:`, error);
          retries--;
          streamFailed = true;

          if (retries === 0) {
            // If streaming failed completely, try one last time without streaming
            try {
              const response = await provider.chat({
                model,
                messages: [
                  { role: 'system', content: systemPrompt },
                  ...messages.slice(-2),
                  { role: 'user', content: message.text }
                ],
                stream: false,
              });

              responseText = response.message.content;
              await vectorStore.addToMemory(`User: ${message.text}\nAssistant: ${responseText}`);

              panel.webview.postMessage({
                command: 'chatResponse',
                text: responseText,
                done: true
              });
              break;
            } catch (finalError) {
              throw finalError;
            }
          }

          responseText = '';
          const delay = Math.pow(2, 3 - retries) * 1000 + Math.random() * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    } catch (error: any) {
      console.error('Operation failed:', error);
      const errorMessage = error.message?.toLowerCase() || '';

      let userMessage = 'An error occurred. Please try again.';
      if (errorMessage.includes('eof')) {
        userMessage = 'The response was interrupted. Please try again.';
      } else if (errorMessage.includes('timeout')) {
        userMessage = 'The response took too long. Please try a shorter question.';
      }

      panel.webview.postMessage({
        command: 'chatResponse',
        text: userMessage,
        done: true
      });
    }
  } else if (message.command === 'getConfig') {
    const config = await getModelConfig(provider, model);
    panel.webview.postMessage({
      command: 'modelConfig',
      config
    });
    return;
  } else if (message.command === 'getModelList') {
    try {
      console.log('Getting model list...');
      const models = await getModelList(provider);
      console.log('Sending models to webview:', models);
      panel.webview.postMessage({
        command: 'modelList',
        models
      });
    } catch (error) {
      console.error('Error getting model list:', error);
      panel.webview.postMessage({
        command: 'modelList',
        models: []
      });
    }
    return;
  }
};

export const getWebViewContent = (webview: vscode.Webview, extensionUri: vscode.Uri): string => {
  const scriptUri = webview.asWebviewUri(Uri.joinPath(extensionUri, 'out', 'webview', 'main.js'));
  const codiconsUri = webview.asWebviewUri(Uri.joinPath(extensionUri, 'node_modules', '@vscode/codicons', 'dist', 'codicon.css'));

  return /* html */ `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; font-src ${webview.cspSource}; script-src ${webview.cspSource}; style-src ${webview.cspSource} 'unsafe-inline';">
        <title>${title}</title>
        <link href="${codiconsUri}" rel="stylesheet" />
        <style>
          html, body {
            height: 100%;
            margin: 0;
            padding: 0;
          }
          #app {
            height: 100%;
          }
        </style>
    </head>
    <body>
        <div id="app"></div>
        <script type="module" src="${scriptUri}"></script>
    </body>
    </html>
  `;
};

export const getModelConfig = async (
  provider: any,
  model: string
) => {
  try {
    const modelInfo = await provider.show({ name: model });
    return modelInfo;
  } catch (error) {
    console.error('Error getting model config:', error);
    return null;
  }
};

export const getModelList = async (provider: any) => {
  try {
    console.log('Provider methods:', Object.keys(provider));
    console.log('Testing provider.list exists:', typeof provider.list === 'function');

    const response = await provider.list();
    console.log('Raw Ollama response:', response);

    // Test the response structure
    console.log('Response type:', typeof response);
    console.log('Response has models:', response?.models);

    if (response && Array.isArray(response.models)) {
      return response.models;
    }
    // If response structure is different, try to handle it
    if (response && typeof response === 'object') {
      const models = Array.isArray(response) ? response : [response];
      console.log('Returning processed models:', models);
      return models;
    }
    console.warn('Unexpected model list format:', response);
    return [];
  } catch (error: any) {
    console.error('Error getting model list:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    return [];
  }
};
