<script lang="ts">
  import type { VSCodeAPI } from './types';
  import {
    provideVSCodeDesignSystem,
    vsCodeButton,
    vsCodeTextArea,
    Button,
    TextArea
  } from "@vscode/webview-ui-toolkit";

  // Register the VSCode components
  provideVSCodeDesignSystem().register(
    vsCodeButton(),
    vsCodeTextArea()
  );

  let prompt = '';
  let response: string;
  let textArea: HTMLTextAreaElement;

  const vscode = (window as any).acquireVsCodeApi() as VSCodeAPI;

  function handleSubmit() {
    if (prompt) {
      vscode.postMessage({ command: 'chat', text: prompt });
    }
  }

  function handleInput(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    prompt = target.value;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
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
  {#if response}
  <div class="response" role="region" aria-label="AI Response">
    {response}
  </div>
  {:else}
    Loading...
  {/if}

  <vscode-text-area
    bind:this={textArea}
    value={prompt}
    on:input={handleInput}
    on:keydown={handleKeydown}
    rows="3"
    placeholder="Ask something..."
    role="textbox"
    aria-multiline="true"
    tabindex="0"
  ></vscode-text-area>

  <vscode-button
    on:click={handleSubmit}
    on:keydown={handleKeydown}
    role="button"
    tabindex="0"
  >
    Ask
  </vscode-button>
</div>

<style>
  .container {
    margin: 2rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .response {
    padding: 1rem;
    background: var(--vscode-input-background);
    border-radius: 4px;
  }
</style>