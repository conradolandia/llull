import * as vscode from 'vscode';
import { Uri } from 'vscode';

const title = '[Llull] asistente de programación';

export const processCommand = async (
  panel: vscode.WebviewPanel,
  message: { command: string; text?: string },
  provider: any,
  model: string
) => {
  console.log('Received message:', message);
  if (!message || !provider || !model) return;
  if (message.command === 'chat') {
    if (!provider.chat || !message.text) return;

    let responseText = '';

    try {
      const responseStream = await provider.chat({
        model,
        messages: [{ role: 'user', content: message.text }],
        stream: true,
      });

      for await (const part of responseStream) {
        responseText += part.message.content;
        panel.webview.postMessage({ command: 'chatResponse', text: responseText });
      }
    } catch (error) {
      console.error('Error processing command:', error);
    }
  }
};

export const getWebViewContent = (webview: vscode.Webview, extensionUri: vscode.Uri): string => {
  const scriptUri = webview.asWebviewUri(Uri.joinPath(extensionUri, 'out', 'webview', 'main.js'));

  console.log('Loading script from:', scriptUri.toString());

  return /* html */ `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src ${webview.cspSource} 'unsafe-inline'; style-src ${webview.cspSource} 'unsafe-inline';">
        <title>Llull</title>
    </head>
    <body>
        <div id="app"></div>
        <script>
          console.log('Webview starting...');
          window.addEventListener('error', (event) => {
            console.error('Script error:', event.error);
          });
          window.addEventListener('load', () => {
            console.log('Window loaded');
          });
        </script>
        <script type="module" src="${scriptUri}"></script>
    </body>
    </html>
  `;
};
