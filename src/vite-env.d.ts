/// <reference types="vite/client" />
/// <reference types="@sveltejs/vite-plugin-svelte" />

declare function acquireVsCodeApi(): {
  postMessage(message: any): void;
  getState(): any;
  setState(state: any): void;
};
