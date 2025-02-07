<script lang="ts">
  import type { VSCodeAPI } from './types';

  let prompt = '';
  let response = 'Loading Ollama response...';

  const vscode = (window as any).acquireVsCodeApi() as VSCodeAPI;

  function handleSubmit() {
    if (prompt) {
      vscode.postMessage({ command: 'chat', text: prompt });
    }
  }

  // Handle messages from extension
  window.addEventListener('message', event => {
    const { command, text } = event.data;
    if (command === 'chatResponse') {
      response = text;
    }
  });
</script>

<div class="container">
  <textarea
    class="prompt"
    bind:value={prompt}
    rows="3"
  /><br/>

  <button on:click={handleSubmit}>Ask</button>

  {#if response}
  <div class="response">
    {response}
  </div>
  {/if}
</div>

<style>
  .container {
    margin: 3em;
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
    margin-top: 2rem;
    padding: 1rem 1.5rem;
    border-radius: 4px;
    background-color: var(--vscode-input-background);
    font-family: var(--vscode-editor-font-family);
    font-size: 1em;
  }
</style>