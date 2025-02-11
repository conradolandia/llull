import { writable, get } from 'svelte/store';

export interface Model {
  name: string;
  size: number;
  digest: string;
  modified_at: string;
}

interface ModelState {
  models: Model[];
  selectedModel: string | null;
  loading: boolean;
}

const createModelStore = () => {
  const { subscribe, set, update } = writable<ModelState>({
    models: [],
    selectedModel: null,
    loading: false
  });

  return {
    subscribe,
    setModels: (models: Model[]) => {
      console.log('Setting models:', models);
      update(state => {
        if (models.length === 0) return state;

        // If we have a selected model, verify it exists in the new list
        const currentModel = state.selectedModel;
        const validModel = models.find(m => m.name === currentModel);

        return {
          ...state,
          models,
          // Use current model if valid, otherwise use first available
          selectedModel: validModel ? currentModel : models[0].name
        };
      });
    },
    setSelectedModel: (model: string | null) => update(state => {
      // If model is null or doesn't exist in our list, use first available
      if (!model || !state.models.find(m => m.name === model)) {
        return {
          ...state,
          selectedModel: state.models.length > 0 ? state.models[0].name : null
        };
      }
      return { ...state, selectedModel: model };
    }),
    setLoading: (loading: boolean) => update(state => ({ ...state, loading }))
  };
};

export const modelStore = createModelStore();
