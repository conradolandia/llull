<script lang="ts">
  import type { VSCodeAPI } from './types';
  import { chatStore } from './stores/chat';
  import './styles/chat.css';
  import { onMount } from 'svelte';

  let textArea: HTMLTextAreaElement;
  let responseArea: HTMLDivElement;

  const vscode = (window as any).acquireVsCodeApi() as VSCodeAPI;

  function handleSubmit() {
    if ($chatStore.prompt) {
      const prompt = $chatStore.prompt;

      // First update the store
      chatStore.startChat(prompt);

      // Then get the updated messages that include the new prompt
      const messages = [...$chatStore.messages];
      console.log('Current conversation state:', messages);

      // Send the message with updated conversation history
      vscode.postMessage({
        command: 'chat',
        text: prompt,
        messages
      });

      adjustTextareaHeight();
    }
  }

  function adjustTextareaHeight() {
    if (textArea) {
      // Reset height to calculate proper scrollHeight
      textArea.style.height = 'auto';
      // Set new height based on content
      textArea.style.height = `${textArea.scrollHeight}px`;
    }
  }

  function handleInput(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    chatStore.setPrompt(target.value);
    adjustTextareaHeight();
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  }

  function scrollToBottom() {
    if (responseArea) {
      responseArea.scrollTop = responseArea.scrollHeight;
    }
  }

  function getModelConfig() {
    vscode.postMessage({
      command: 'getConfig'
    });
  }

  onMount(() => {
    textArea.focus();
    adjustTextareaHeight();
  });

  window.addEventListener('message', event => {
    const { command, text, done, config } = event.data;
    if (command === 'chatResponse') {
      if (done) {
        chatStore.finalizeResponse(text);
      } else {
        chatStore.addResponse(text);
      }
      setTimeout(scrollToBottom, 0);
    } else if (command === 'modelConfig') {
      console.log('Model configuration:', config);
      // Handle config data
    }
  });
</script>

<div class="container">
  <div class="exchange-area" bind:this={responseArea}>
    {#if $chatStore.currentExchange}
      <div class="exchange">
        <div class="prompt-message">
          {$chatStore.currentExchange.prompt}
        </div>
        <div class="response" role="region" aria-label="AI Response">
          {$chatStore.currentExchange.response || 'Loading...'}
        </div>
      </div>
    {:else if $chatStore.waitingForResponse}
      Loading...
    {/if}
  </div>

  <div class="user-input-container">
    <div class="user-input">
      <textarea
        bind:this={textArea}
        on:input={handleInput}
        on:keydown={handleKeydown}
        value={$chatStore.prompt}
        aria-multiline="true"
        class="user-input-textarea"
        rows="1"
      ></textarea>
    </div>

    <div class="user-input-tool-bar">
      <button
        on:click={handleSubmit}
        on:keydown={handleKeydown}
        class="user-input-button"
      >
        Submit
      </button>
    </div>
  </div>
</div>
