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
    background: var(--border);
    flex-shrink: 0;
    width: 1px;
  }

  @media (max-width: 640px) {
    .layout {
      flex-direction: column;
    }

    /* Timer moves to top, divider between, instructions below */
    .layout :global(.timer-pane) {
      order: -2;
    }

    .divider {
      order: -1;
      width: 100%;
      height: 1px;
    }
  }
</style>
