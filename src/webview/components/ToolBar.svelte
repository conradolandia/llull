<script lang="ts">
  import type { ToolBarButtonProps } from '../svelte.d';
  import ToolBarButton from './ToolBarButton.svelte';
  import ContextMenu from './ContextMenu.svelte';

  export let buttons: ToolBarButtonProps[] = [];
  export let auxiliaryButtons: ToolBarButtonProps[] = [];
</script>

<div class="user-input-tool-bar">
  <div class="tool-bar-section">
    <slot />
    {#each auxiliaryButtons as button}
      <ToolBarButton {...button} />
    {/each}
  </div>
  <div class="tool-bar-section">
    <ContextMenu />
    {#each buttons as button}
      <ToolBarButton {...button} />
    {/each}
  </div>
</div>
