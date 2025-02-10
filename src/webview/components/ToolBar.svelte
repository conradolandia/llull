<script lang="ts">
  import type { ToolBarButtonProps } from '../svelte.d';
  import ToolBarButton from './ToolBarButton.svelte';

  export let buttons: ToolBarButtonProps[] = [];
</script>

<div class="user-input-tool-bar">
  <div class="tool-bar-section">
    {#each buttons as button}
      <ToolBarButton {...button} />
    {/each}
  </div>
</div>
