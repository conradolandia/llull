<script lang="ts">
  import type { ToolBarButtonProps } from '../svelte.d';
  import Icon from './Icon.svelte';

  export let handleSubmit: ToolBarButtonProps['handleSubmit'];
  export let handleKeydown: ToolBarButtonProps['handleKeydown'];
  export let buttonText: ToolBarButtonProps['buttonText'];
  export let buttonType: ToolBarButtonProps['buttonType'] = 'button';
  export let buttonIcon: ToolBarButtonProps['buttonIcon'] = null;
</script>

<button
  on:click={handleSubmit}
  on:keydown={handleKeydown}
  class="user-input-button"
  class:button-link={buttonType === 'link'}
  title={buttonText}
  >
  <span class="button-text">{buttonText}</span>
  {#if buttonIcon}
    <Icon name={buttonIcon} size={14} className="button-icon" />
  {/if}
</button>

