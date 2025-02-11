<script lang="ts">
  import Icon from './Icon.svelte';
  import { chatStore } from '../stores/chat';

  let showMenu = false;
  let includeWorkspaceContext = false;

  function toggleMenu() {
    showMenu = !showMenu;
  }

  function updateContext(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    includeWorkspaceContext = checkbox.checked;
    chatStore.setIncludeWorkspaceContext(includeWorkspaceContext);
  }

  // Close menu when clicking outside
  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.context-menu-container')) {
      showMenu = false;
    }
  }
</script>

<svelte:window on:click={handleClickOutside} />

<div class="context-menu-container">
  <button
    class="button-link context-button"
    on:click|stopPropagation={toggleMenu}
    title="Context options"
  >
    <Icon name="files" size={16} />
  </button>

  {#if showMenu}
    <div class="context-menu">
      <div class="menu-header">Context Options</div>
      <div class="menu-item">
        <label class="checkbox-label">
          <input
            type="checkbox"
            bind:checked={includeWorkspaceContext}
            on:change={updateContext}
          />
          <span>Include workspace files</span>
        </label>
      </div>
      {#if includeWorkspaceContext}
        <div class="menu-info">
          <Icon name="info" size={14} />
          <span>Will include relevant files from workspace</span>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .context-menu-container {
    position: relative;
  }

  .context-button {
    opacity: 0.6;
  }

  .context-button:hover {
    opacity: 1;
  }

  .context-menu {
    position: absolute;
    bottom: 100%;
    right: 0;
    margin-bottom: 0.5rem;
    background: var(--vscode-input-background);
    border: 1px solid var(--vscode-input-border);
    border-radius: var(--chat-border-radius);
    min-width: 200px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    z-index: 1000;
  }

  .menu-header {
    padding: 0.5rem;
    border-bottom: 1px solid var(--vscode-input-border);
    font-size: 0.8rem;
    opacity: 0.8;
  }

  .menu-item {
    padding: 0.5rem;
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }

  .menu-info {
    padding: 0.5rem;
    font-size: 0.8rem;
    opacity: 0.7;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
</style>
