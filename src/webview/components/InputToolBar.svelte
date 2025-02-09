<script lang="ts">
  export let handleSubmit: () => void;
  export let handleKeydown: (event: KeyboardEvent) => void;
  export let buttonText: string = 'Submit';
</script>

<div class="user-input-tool-bar">
  <div class="tool-bar-section">
    <button
      on:click={handleSubmit}
      on:keydown={handleKeydown}
      class="user-input-button"
    >
      {buttonText}
    </button>
  </div>
</div>

