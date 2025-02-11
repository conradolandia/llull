<script lang="ts">
  import type { VSCodeAPI } from '../svelte.d';
  import { chatStore } from '../stores/chat';
  import {
    handleInput,
    handleKeydown,
  } from '../utils/chatUtils';

  export let vscode: VSCodeAPI;
  export let textArea: HTMLTextAreaElement;
</script>

<div class="user-input">
  <textarea
    bind:this={textArea}
    on:input={handleInput}
    on:keydown={(e) => handleKeydown(e, vscode, textArea)}
    value={$chatStore.prompt}
    aria-multiline="true"
    class="user-input-textarea"
    rows="1"
    disabled={$chatStore.waitingForResponse}
  ></textarea>
</div>