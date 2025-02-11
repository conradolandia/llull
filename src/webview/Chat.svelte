<script lang="ts">
  import type { VSCodeAPI, ToolBarButtonProps } from './svelte.d';
  import { onMount } from 'svelte';
  import {
    handleSubmit,
    handleKeydown,
    handleMessageEvent,
    adjustTextareaHeight,
  } from './utils/chatUtils';

  import './styles/chat.css';

  import ToolBar from './components/ToolBar.svelte';
  import ExchangeArea from './components/ExchangeArea.svelte';
  import ChatInput from './components/ChatInput.svelte';
  import ModelSelector from './components/ModelSelector.svelte';

  const vscode = (window as any).acquireVsCodeApi() as VSCodeAPI;

  let fixedWidth: boolean = false;
  let textArea: HTMLTextAreaElement;
  let responseArea: HTMLDivElement;

  let buttons: ToolBarButtonProps[] = [
    {
      handleSubmit: () => handleSubmit(vscode, textArea),
      handleKeydown: (event) => handleKeydown(event, vscode, textArea),
      buttonText: 'Submit',
      buttonIcon: 'send'
    }
  ];

  let auxiliaryButtons: ToolBarButtonProps[] = [];

  onMount(() => {
    textArea.focus();
    adjustTextareaHeight(textArea);
  });

  window.addEventListener('message', handleMessageEvent);
</script>

<div class="container" class:fixed-width={fixedWidth}>
  <ExchangeArea bind:responseArea />

  <div class="user-input-container">
    <ChatInput {vscode} bind:textArea />
    <ToolBar {buttons} {auxiliaryButtons}>
      <ModelSelector {vscode} />
    </ToolBar>
  </div>
</div>
