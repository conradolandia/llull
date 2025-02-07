import type { ComponentType } from 'svelte';
import App from './Chat.svelte';

console.log('Main.ts starting...');

try {
  const target = document.getElementById('app');
  console.log('Target element:', target);

  if (!target) {
    throw new Error('Target element not found');
  }

  console.log('Mounting Svelte app...');
  const app = new (App as unknown as ComponentType<any>)({
    target
  });
  console.log('Svelte app mounted');

} catch (error) {
  console.error('Failed to mount Svelte app:', error);
}
