<script lang="ts">
  import { modelStore, type Model } from '../stores/modelStore';
  import type { VSCodeAPI } from '../svelte.d';
  import Icon from './Icon.svelte';
  import Spinner from './Spinner.svelte';
  import { onMount, onDestroy } from 'svelte';
  import { formatBytes, formatDate } from '../utils/formatUtils';

  export let vscode: VSCodeAPI;
  export let showSelector: boolean = false;

  function toggleSelector() {
    showSelector = !showSelector;
    if (showSelector && $modelStore.models.length === 0) {
      refreshModels();
    }
  }

  function refreshModels() {
    modelStore.setLoading(true);
    vscode.postMessage({ command: 'getModelList' });
  }

  function selectModel(model: Model) {
    modelStore.setSelectedModel(model.name);
    showSelector = false;
    vscode.postMessage({
      command: 'setModel',
      model: model.name
    });
  }

  function handleMessage(event: MessageEvent) {
    console.log('ModelSelector received message:', event.data);
    const { command, models, model } = event.data;

    // Only handle modelList and modelChanged commands
    if (command === 'modelList') {
      console.log('Processing modelList command with models:', models);
      if (!models) {
        console.warn('No models received in modelList command');
        return;
      }
      modelStore.setModels(models);
      modelStore.setLoading(false);
    } else if (command === 'modelChanged') {
      console.log('Processing modelChanged command with model:', model);
      modelStore.setSelectedModel(model);
    }
  }

  // Only request models once on mount
  onMount(() => {
    console.log('ModelSelector mounted, requesting models...');
    window.addEventListener('message', handleMessage);
    // Initial model list request
    vscode.postMessage({ command: 'getModelList' });
    modelStore.setLoading(true);
  });

  onDestroy(() => {
    window.removeEventListener('message', handleMessage);
  });
</script>

<div class="model-selector">
  <button
    class="button-link model-selector-button"
    on:click={toggleSelector}
    title="Select model"
  >
    {#if $modelStore.selectedModel}
      <div class="selected-model">
        <Icon name="check" size={14} className="selected-icon" />
        <span class="model-name">{$modelStore.selectedModel}</span>
      </div>
    {:else}
      <span class="model-name">Select model</span>
    {/if}
    <Icon
      name={showSelector ? 'down' : 'up'}
      size={14}
      className="button-icon"
    />
  </button>

  {#if showSelector}
    <div class="model-list">
      <div class="model-list-header">
        <span>Available Models</span>
        <button
          class="refresh-button"
          on:click|stopPropagation={refreshModels}
          title="Refresh model list"
          disabled={$modelStore.loading}
        >
          <Icon
            name="refresh"
            size={14}
            className={$modelStore.loading ? 'spinning' : ''}
          />
        </button>
      </div>

      {#if $modelStore.loading}
        <div class="model-list-item loading">
          <Spinner size={14} className="loading-spinner" />
          <span>Loading models...</span>
        </div>
      {:else if $modelStore.models.length === 0}
        <div class="model-list-item empty">
          No models available
        </div>
      {:else}
        {#each $modelStore.models as model}
          <button
            class="model-list-item"
            class:selected={$modelStore.selectedModel === model.name}
            on:click={() => selectModel(model)}
          >
            <div class="model-info">
              <span class="model-name">{model.name}</span>
              <div class="model-details">
                <span class="model-size">{formatBytes(model.size)}</span>
                <span class="model-date">Updated {formatDate(model.modified_at)}</span>
              </div>
            </div>
            {#if $modelStore.selectedModel === model.name}
              <Icon
                name="check"
                size={14}
                className="check-icon"
              />
            {/if}
          </button>
        {/each}
      {/if}
    </div>
  {/if}
</div>
