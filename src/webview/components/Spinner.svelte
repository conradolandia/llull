<script lang="ts">
  export let size: number = 16;
  export let color: string = 'currentColor';
  export let className: string = '';
  export let opacity: number = 0.7;
</script>

<div
  class={`spinner ${className}`}
  style={`
    width: ${size}px;
    height: ${size}px;
    border-width: ${Math.max(2, size / 8)}px;
    border-color: ${color};
    border-top-color: transparent;
    opacity: ${opacity};
  `}
  role="progressbar"
  aria-label="Loading"
/>

<style>
  .spinner {
    display: inline-block;
    border-style: solid;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
