import { get } from 'svelte/store';
import type { VSCodeAPI } from '../svelte.d';
import { chatStore } from '../stores/chat';
import { modelStore } from '../stores/modelStore';

export function handleSubmit(
  vscode: VSCodeAPI,
  textArea: HTMLTextAreaElement
): void {
  if (!textArea) return;

  const state = get(chatStore);
  if (state.prompt) {
    const prompt = state.prompt;
    chatStore.startChat(prompt);
    const messages = [...state.messages];

    vscode.postMessage({
      command: 'chat',
      text: prompt,
      messages,
      includeWorkspaceContext: state.includeWorkspaceContext
    });

    adjustTextareaHeight(textArea);
  }
}

export function adjustTextareaHeight(textArea: HTMLTextAreaElement): void {
  if (textArea) {
    textArea.style.height = 'auto';
    textArea.style.height = `${textArea.scrollHeight}px`;
  }
}

export function handleInput(e: Event): void {
  const target = e.target as HTMLTextAreaElement;
  chatStore.setPrompt(target.value);
  adjustTextareaHeight(target);
}

export function handleKeydown(
  event: KeyboardEvent,
  vscode: VSCodeAPI,
  textArea: HTMLTextAreaElement
): void {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    handleSubmit(vscode, textArea);
  }
}

export function handleMessageEvent(event: MessageEvent): void {
  const { command, text, done, config, models, model } = event.data;
  if (command === 'chatResponse') {
    if (done) {
      chatStore.finalizeResponse(text);
    } else {
      chatStore.addResponse(text);
    }
  } else if (command === 'modelConfig') {
    console.log('Model configuration:', config);
  } else if (command === 'modelList') {
    console.log('Received models:', models);
    modelStore.setModels(models);
  } else if (command === 'modelChanged') {
    modelStore.setSelectedModel(model);
  }
}

export function getModelConfig(vscode: VSCodeAPI): void {
  vscode.postMessage({
    command: 'getConfig'
  });
}