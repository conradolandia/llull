<script lang="ts">
  export let name: string;
  export let size: number = 16;
  export let className: string = '';

  const icons = {
    send: 'codicon codicon-arrow-right',
    clear: 'codicon codicon-clear-all',
    copy: 'codicon codicon-copy',
    settings: 'codicon codicon-gear',
    refresh: 'codicon codicon-refresh',
    down: 'codicon codicon-chevron-down',
    up: 'codicon codicon-chevron-up',
    stop: 'codicon codicon-stop',
    check: 'codicon codicon-check',
    files: 'codicon codicon-files',
    info: 'codicon codicon-info'
  } as const;

  type IconName = keyof typeof icons;

  $: iconClass = icons[name as IconName] || '';
</script>

<span
  class={`icon ${iconClass} ${className}`}
  style={`font-size: ${size}px; line-height: ${size}px;`}
  aria-hidden="true"
></span>

<style>
  .icon {
    display: inline-block;
    font-family: codicon;
    font-style: normal;
    font-weight: normal;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
</style>
