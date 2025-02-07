/// <reference types="svelte" />
/// <reference types="vite/client" />

declare global {
  interface Window {
    acquireVsCodeApi(): {
      postMessage(message: any): void;
      getState(): any;
      setState(state: any): void;
    }
  }

  namespace svelteHTML {
    interface HTMLAttributes<T> {
      'on:click'?: (event: CustomEvent<any> | MouseEvent) => void;
      'bind:value'?: any;
    }
  }
}

declare module "*.svelte" {
  import type { ComponentType } from "svelte";
  const component: ComponentType<any>;
  export default component;
}

export {};
