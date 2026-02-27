<script lang="ts">
  import InstructionPane from '$lib/components/InstructionPane.svelte';
  import TimerPane from '$lib/components/TimerPane.svelte';
</script>

<main class="layout">
  <InstructionPane />
  <div class="divider" aria-hidden="true"></div>
  <TimerPane />
</main>

<style>
  .layout {
    height: 100vh;
    display: flex;
    flex-direction: row;
    overflow: hidden;
    background: var(--bg);
  }

  .divider {
    width: 1px;
    background: var(--border);
    flex-shrink: 0;
  }
</style>
