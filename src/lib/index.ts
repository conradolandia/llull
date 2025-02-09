import * as vscode from 'vscode';
import { Uri } from 'vscode';

const title = '[Llull] asistente de programación';

export const processCommand = async (
  panel: vscode.WebviewPanel,
  message: { command: string; text?: string; messages?: Array<{ role: string; content: string }> },
  provider: any,
  model: string
) => {
  console.log('Received message:', message);
  if (!message || !provider || !model) return;
  if (message.command === 'chat') {
    if (!provider.chat || !message.text || !message.messages) return;

    let responseText = '';

    try {
      // Log the full conversation for debugging
      console.log('Full conversation history:');
      message.messages.forEach((msg, i) => {
        console.log(`${i + 1}. ${msg.role}: ${msg.content.substring(0, 50)}...`);
      });

      const responseStream = await provider.chat({
        model,
        messages: [
          ...message.messages,
          { role: 'user', content: message.text }
        ],
        stream: true,
      });

      for await (const part of responseStream) {
        responseText += part.message.content;
        panel.webview.postMessage({
          command: 'chatResponse',
          text: responseText,
          done: false
        });
      }

      // Send final message
      panel.webview.postMessage({
        command: 'chatResponse',
        text: responseText,
        done: true
      });

    } catch (error) {
      console.error('Error processing command:', error);
      panel.webview.postMessage({
        command: 'chatResponse',
        text: 'Error: Failed to get response from Ollama',
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
  }
};

export const getWebViewContent = (webview: vscode.Webview, extensionUri: vscode.Uri): string => {
  const scriptUri = webview.asWebviewUri(Uri.joinPath(extensionUri, 'out', 'webview', 'main.js'));
  const toolkitUri = webview.asWebviewUri(Uri.joinPath(extensionUri, 'node_modules', '@vscode/webview-ui-toolkit', 'dist', 'toolkit.js'));

  return /* html */ `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src ${webview.cspSource}; style-src ${webview.cspSource} 'unsafe-inline';">
        <title>Llull</title>
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
