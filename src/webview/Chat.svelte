<script lang="ts">
  import type { VSCodeAPI, ToolBarButtonProps } from './svelte.d';
  import { chatStore } from './stores/chat';
  import { onMount } from 'svelte';

  import './styles/chat.css';

  import ToolBar from './components/ToolBar.svelte';

  const vscode = (window as any).acquireVsCodeApi() as VSCodeAPI;

  let buttons: ToolBarButtonProps[] = [
    {
      handleSubmit,
      handleKeydown,
      buttonText: 'Submit'
    }
  ];

  let fixedWidth: boolean = false;
  let textArea: HTMLTextAreaElement;
  let responseArea: HTMLDivElement;


  function handleSubmit(): void {
    if ($chatStore.prompt) {
      const prompt = $chatStore.prompt;
      chatStore.startChat(prompt);
      const messages = [...$chatStore.messages];
      console.log('Current conversation state:', messages);

      vscode.postMessage({
        command: 'chat',
        text: prompt,
        messages
      });

      adjustTextareaHeight();
    }
  }

  function adjustTextareaHeight(): void {
    if (textArea) {
      textArea.style.height = 'auto';
      textArea.style.height = `${textArea.scrollHeight}px`;
    }
  }

  function handleInput(e: Event): void {
    const target = e.target as HTMLTextAreaElement;
    chatStore.setPrompt(target.value);
    adjustTextareaHeight();
  }

  function handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  }

  function scrollToBottom(): void {
    if (responseArea) {
      responseArea.scrollTop = responseArea.scrollHeight;
    }
  }

  function getModelConfig(): void {
    vscode.postMessage({
      command: 'getConfig'
    });
  }

  $: if ($chatStore.currentExchange?.isStreaming) {
    scrollToBottom();
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
    } else if (command === 'modelConfig') {
      console.log('Model configuration:', config);
      // Handle config data
    }
  });
</script>

<div class="container" class:fixed-width={fixedWidth}>
  <div class="exchange-area" bind:this={responseArea}>
    {#if $chatStore.messages.length >= 2}
      {#each $chatStore.messages.slice(0, -2) as message, i}
        {@const nextMessage = $chatStore.messages[i + 1]}
        {#if i % 2 === 0 && nextMessage}
          <div class="exchange past-exchange">
            <div class="prompt-message">
              {message.content}
            </div>
            <div class="response">
              {nextMessage.content}
            </div>
          </div>
        {/if}
      {/each}
    {/if}

    {#if $chatStore.currentExchange}
      <div class="exchange current-exchange">
        <div class="prompt-message">
          {$chatStore.currentExchange.prompt}
        </div>
        <div class="response" role="region" aria-label="AI Response">
          {#if $chatStore.currentExchange.isStreaming}
            <div class="streaming">
              {$chatStore.currentExchange.response || 'Thinking...'}
              {#if $chatStore.currentExchange.response}
                <span class="cursor">▋</span>
              {/if}
            </div>
          {:else}
            {$chatStore.currentExchange.response}
          {/if}
        </div>
      </div>
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
        disabled={$chatStore.waitingForResponse}
      ></textarea>
    </div>

    <ToolBar {buttons} />
  </div>
</div>
