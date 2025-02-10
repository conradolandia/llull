<script lang="ts">
  import type { ToolBarButtonProps } from '../svelte.d';

  export let handleSubmit: ToolBarButtonProps['handleSubmit'];
  export let handleKeydown: ToolBarButtonProps['handleKeydown'];
  export let buttonText: ToolBarButtonProps['buttonText'];
</script>

<div class="user-input-tool-bar">
  <div class="tool-bar-section">
    <button
      on:click={handleSubmit}
      on:keydown={handleKeydown}
      class="user-input-button"
    >
      {buttonText}
    </button>
  </div>
</div>

