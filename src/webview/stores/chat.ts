import { writable, get } from 'svelte/store';
import { VectorStore } from '../../lib/services/vectorStore';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatState {
  prompt: string;
  messages: Message[];
  waitingForResponse: boolean;
  currentExchange: {
    prompt: string;
    response: string;
  } | null;
  contextMemory: string[];
}

const createChatStore = () => {
  const vectorStore = new VectorStore();
  const { subscribe, set, update } = writable<ChatState>({
    prompt: '',
    messages: [],
    waitingForResponse: false,
    currentExchange: null,
    contextMemory: []
  });

  return {
    subscribe,
    setPrompt: (prompt: string) => update(state => ({ ...state, prompt })),
    startChat: async (prompt: string) => {
      // Get relevant context
      const relevantContext = await vectorStore.getRelevantContext(prompt);

      update(state => {
        const newMessage: Message = { role: 'user', content: prompt };
        return {
          ...state,
          prompt: '',
          messages: [...state.messages, newMessage],
          contextMemory: relevantContext,
          waitingForResponse: true,
          currentExchange: { prompt, response: '' }
        };
      });
    },
    addResponse: (response: string) => update(state => ({
      ...state,
      waitingForResponse: false,
      currentExchange: state.currentExchange ? {
        ...state.currentExchange,
        response: response.trim()
      } : null
    })),
    finalizeResponse: async (response: string) => {
      // Store the exchange in vector memory
      await vectorStore.addToMemory(
        `User: ${prompt}\nAssistant: ${response}`,
        { timestamp: Date.now() }
      );

      update(state => {
        const newMessage: Message = { role: 'assistant', content: response.trim() };
        return {
          ...state,
          messages: [...state.messages, newMessage],
          waitingForResponse: false,
          currentExchange: state.currentExchange ? {
            ...state.currentExchange,
            response: response.trim()
          } : null
        };
      });
    },
    getMessages: () => {
      const state = get(chatStore);
      return state.messages;
    },
    reset: () => set({
      prompt: '',
      messages: [],
      waitingForResponse: false,
      currentExchange: null,
      contextMemory: []
    })
  };
};

export const chatStore = createChatStore();
