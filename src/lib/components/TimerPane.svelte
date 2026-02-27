<script lang="ts">
  import TimerDisplay from './TimerDisplay.svelte';
  import TimerModal from './TimerModal.svelte';

  function getStoredEndTime(): Date | null {
    if (typeof localStorage === 'undefined') return null;
    const stored = localStorage.getItem('exam-timer-end');
    if (!stored) return null;
    const ts = parseInt(stored, 10);
    if (isNaN(ts)) return null;
    const date = new Date(ts);
    return date.getTime() > Date.now() ? date : null;
  }

  function getStoredStartTime(): Date | null {
    if (typeof localStorage === 'undefined') return null;
    const stored = localStorage.getItem('exam-timer-start');
    if (!stored) return null;
    const ts = parseInt(stored, 10);
    if (isNaN(ts)) return null;
    return new Date(ts);
  }

  const initialEndTime = getStoredEndTime();
  let endTime = $state<Date | null>(initialEndTime);
  let startTime = $state<Date | null>(initialEndTime ? getStoredStartTime() : null);
  let showModal = $state(initialEndTime === null);

  $effect(() => {
    if (endTime) {
      localStorage.setItem('exam-timer-end', endTime.getTime().toString());
    } else {
      localStorage.removeItem('exam-timer-end');
    }
  });

  $effect(() => {
    if (startTime) {
      localStorage.setItem('exam-timer-start', startTime.getTime().toString());
    } else {
      localStorage.removeItem('exam-timer-start');
    }
  });

  function handleStart(newEndTime: Date, newStartTime: Date | null) {
    endTime = newEndTime;
    startTime = newStartTime;
    showModal = false;
  }

  function handleCancel() {
    showModal = false;
  }

  function openModal() {
    showModal = true;
  }

  function resetTimer() {
    endTime = null;
    startTime = null;
    showModal = true;
  }
</script>

<section class="pane timer-pane">
  <header class="pane-header">
    <span class="pane-title">Time Remaining</span>
    {#if endTime}
      <button class="header-btn" onclick={resetTimer} title="Reset timer"
        >Reset</button
      >
    {:else}
      <button class="header-btn" onclick={openModal} title="Set timer"
        >Set Timer</button
      >
    {/if}
  </header>

  <div class="pane-body">
    {#if endTime}
      <TimerDisplay {endTime} {startTime} />
    {:else}
      <div class="idle-state">
        <p class="idle-label">No timer running</p>
        <button class="idle-btn" onclick={openModal}> Set Timer </button>
      </div>
    {/if}
  </div>
</section>

{#if showModal}
  <TimerModal
    onstart={handleStart}
    oncancel={handleCancel}
    hasActiveTimer={endTime !== null}
  />
{/if}

<style>
  .timer-pane {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .pane-header {
    height: var(--header-height);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1.5rem;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }

  .pane-title {
    font-family: var(--font-display);
    font-size: 1rem;
    font-weight: 500;
    color: var(--text-secondary);
  }

  .header-btn {
    font-family: var(--font-display);
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-muted);
    padding: 0.3rem 0.8rem;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    transition:
      color 0.15s,
      border-color 0.15s,
      background 0.15s;
  }

  .header-btn:hover {
    color: var(--accent);
    border-color: var(--accent);
    background: var(--accent-dim);
  }

  .pane-body {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .idle-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
  }

  .idle-label {
    font-family: var(--font-display);
    font-size: 1.1rem;
    color: var(--text-muted);
  }

  .idle-btn {
    font-family: var(--font-display);
    font-size: 1rem;
    font-weight: 500;
    color: var(--accent);
    padding: 0.7rem 2rem;
    border: 1px solid var(--accent);
    border-radius: var(--radius);
    background: var(--accent-dim);
    transition:
      background 0.15s,
      color 0.15s;
  }

  .idle-btn:hover {
    background: rgba(160, 112, 40, 0.2);
    color: var(--accent-hover);
  }
</style>
