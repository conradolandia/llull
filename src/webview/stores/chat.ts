import { writable, get } from 'svelte/store';
import type { Message } from '../../lib/types';

export interface ChatState {
  prompt: string;
  messages: Message[];
  waitingForResponse: boolean;
  includeWorkspaceContext: boolean;
  currentExchange: {
    prompt: string;
    response: string;
    isStreaming: boolean;
    context?: string;
  } | null;
}

const createChatStore = () => {
  const { subscribe, set, update } = writable<ChatState>({
    prompt: '',
    messages: [],
    waitingForResponse: false,
    includeWorkspaceContext: false,
    currentExchange: null
  });

  return {
    subscribe,
    setPrompt: (prompt: string) => update(state => ({ ...state, prompt })),
    startChat: (prompt: string) => update(state => {
      const newMessage: Message = { role: 'user', content: prompt };
      return {
        ...state,
        prompt: '',
        messages: [...state.messages, newMessage],
        waitingForResponse: true,
        currentExchange: {
          prompt,
          response: '',
          isStreaming: true
        }
      };
    }),
    addResponse: (response: string) => update(state => {
      if (!state.currentExchange) return state;

      return {
        ...state,
        currentExchange: {
          ...state.currentExchange,
          response,
          isStreaming: true
        }
      };
    }),
    finalizeResponse: (response: string) => update(state => {
      const newMessage: Message = { role: 'assistant', content: response.trim() };
      return {
        ...state,
        messages: [...state.messages, newMessage],
        waitingForResponse: false,
        currentExchange: state.currentExchange ? {
          ...state.currentExchange,
          response: response.trim(),
          isStreaming: false
        } : null
      };
    }),
    reset: () => set({
      prompt: '',
      messages: [],
      waitingForResponse: false,
      includeWorkspaceContext: false,
      currentExchange: null
    }),
    setIncludeWorkspaceContext: (include: boolean) =>
      update(state => ({ ...state, includeWorkspaceContext: include })),
  };
};

export const chatStore = createChatStore();
