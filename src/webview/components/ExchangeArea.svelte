<script lang="ts">
  import { chatStore } from '../stores/chat';
  import Spinner from './Spinner.svelte';

  export let responseArea: HTMLDivElement;

  function scrollToBottom(): void {
    if (responseArea) {
      responseArea.scrollTop = responseArea.scrollHeight;
    }
  }

  $: if ($chatStore.currentExchange?.isStreaming) {
    scrollToBottom();
  }
</script>

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
            {#if !$chatStore.currentExchange.response}
              <div class="thinking">
                <Spinner size={14} className="thinking-spinner" />
                <span>Thinking...</span>
              </div>
            {:else}
              {$chatStore.currentExchange.response}
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

<style>
  .thinking {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    opacity: 0.7;
  }
</style>
