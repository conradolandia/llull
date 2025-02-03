import * as vscode from 'vscode';

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

export const getWebViewContent = (): string => /* html */ `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' vscode-resource:; style-src 'unsafe-inline' vscode-resource:;">
    <title>${title}</title>
    <style>
        body {
            font-family: var(--vscode-editor-font-family);
            padding: 1rem;
            color: var(--vscode-editor-foreground);
            background-color: var(--vscode-editor-background);
        }
        h1 {
            color: var(--vscode-terminal-ansiBrightBlue);
            font-size: 1.2em;
            margin-bottom: 1rem;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        .prompt {
            width: 100%;
            box-sizing: border-box;
            border-radius: 4px;
            background-color: var(--vscode-input-background);
            font-family: var(--vscode-editor-font-family);
            color: var(--vscode-editor-foreground);
        }
        .response {
            white-space: pre-wrap;
            margin-top: 1rem;
            padding: 1rem;
            border-radius: 4px;
            background-color: var(--vscode-input-background);
            font-family: var(--vscode-editor-font-family);
            font-size: 0.9em;
        }
        .button {
            background-color: var(--vscode-button-background);
            color: var(--vscode-editor-foreground);
            border: 1px solid;
            border-radius: 4px;
            padding: 0.5rem 1rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>${title}</h1>
        <textarea class="prompt" id="prompt" rows="3" placeholder="Ask something..."></textarea><br/>
        <button id="askBtn">Ask</button>
        <div class="response" id="response">
            Loading Ollama response...
        </div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        const btn = document.getElementById('askBtn');
        const prompt = document.getElementById('prompt');
        const response = document.getElementById('response');

        // Handle messages from the extension
        window.addEventListener('message', event => {
            const { command, text } = event.data;
            if (command === 'chatResponse') {
                response.innerText = text;
            }
            console.log("Received message from extension:", event.data);
        });

        // Expose function to send messages back to extension
        function sendMessageToExtension(message) {
            console.log('Sending message to extension:', message);
            vscode.postMessage(message);
        }

        btn.addEventListener('click', () => {
            const promptValue = prompt.value;
            if (promptValue) {
                sendMessageToExtension({ command: 'chat', text: promptValue });
            } else {
                console.log('Prompt is empty, not sending message.');
            }
        });
    </script>
</body>
</html>

`;
