<script lang="ts">
  let {
    onstart,
    oncancel,
    onclear,
    hasActiveTimer,
  }: {
    onstart: (endTime: Date, startTime: Date | null) => void;
    oncancel: () => void;
    onclear: () => void;
    hasActiveTimer: boolean;
  } = $props();

  let mode = $state<'duration' | 'endtime'>('duration');

  // Duration mode
  let durationHours = $state(1);
  let durationMinutes = $state(30);

  // End time mode — default to 1 hour from now
  function defaultEndTimeStr(): string {
    const d = new Date(Date.now() + 60 * 60 * 1000);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }

  let endTimeStr = $state(defaultEndTimeStr());

  // Start time (optional)
  let useStartTime = $state(false);

  function defaultStartTimeStr(): string {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }

  let startTimeStr = $state(defaultStartTimeStr());

  let isValid = $derived.by(() => {
    if (mode === 'duration') {
      return durationHours > 0 || durationMinutes > 0;
    }
    return endTimeStr.length > 0;
  });

  function handleStart() {
    let startTime: Date | null = null;

    if (useStartTime && startTimeStr) {
      const [sh, sm] = startTimeStr.split(':').map(Number);
      startTime = new Date();
      startTime.setHours(sh, sm, 0, 0);
    }

    let endTime: Date;

    if (mode === 'duration') {
      const base = startTime ?? new Date();
      endTime = new Date(base.getTime());
      if (!startTime) endTime.setSeconds(0, 0);
      endTime.setMinutes(endTime.getMinutes() + durationMinutes);
      endTime.setHours(endTime.getHours() + durationHours);
    } else {
      const [hours, minutes] = endTimeStr.split(':').map(Number);
      endTime = new Date();
      endTime.setHours(hours, minutes, 0, 0);
      // If the time is in the past, assume next day
      if (endTime.getTime() < Date.now()) {
        endTime.setDate(endTime.getDate() + 1);
      }
    }

    onstart(endTime, startTime);
  }

  function handleOverlayClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      oncancel();
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') oncancel();
    if (e.key === 'Enter' && isValid) handleStart();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="overlay" onclick={handleOverlayClick} role="presentation">
  <div class="modal" role="dialog" aria-modal="true" aria-label="Set Timer">
    <header class="modal-header">
      <h2>Set Timer</h2>
      <button class="close-btn" onclick={oncancel} aria-label="Close">×</button>
    </header>

    <div class="modal-body">
      <!-- Mode tabs -->
      <div class="mode-tabs" role="tablist">
        <button
          role="tab"
          class="tab"
          class:active={mode === 'duration'}
          onclick={() => (mode = 'duration')}
          aria-selected={mode === 'duration'}
        >
          Duration
        </button>
        <button
          role="tab"
          class="tab"
          class:active={mode === 'endtime'}
          onclick={() => (mode = 'endtime')}
          aria-selected={mode === 'endtime'}
        >
          End Time
        </button>
      </div>

      <!-- Duration inputs -->
      {#if mode === 'duration'}
        <div class="inputs-row">
          <div class="input-group">
            <label for="hours">Hours</label>
            <input
              id="hours"
              type="number"
              min="0"
              max="23"
              bind:value={durationHours}
              class="number-input"
            />
          </div>
          <div class="input-sep">:</div>
          <div class="input-group">
            <label for="minutes">Minutes</label>
            <input
              id="minutes"
              type="number"
              min="0"
              max="59"
              bind:value={durationMinutes}
              class="number-input"
            />
          </div>
        </div>
        <p class="hint">
          {useStartTime
            ? 'Duration from the scheduled start time.'
            : 'Timer starts immediately from now.'}
        </p>
      {/if}

      <!-- End time input -->
      {#if mode === 'endtime'}
        <div class="inputs-row">
          <div class="input-group wide">
            <label for="endtime">Time</label>
            <input
              id="endtime"
              type="time"
              bind:value={endTimeStr}
              class="time-input"
            />
          </div>
        </div>
        <p class="hint">
          If this time has already passed today, tomorrow is assumed.
        </p>
      {/if}

      <!-- Optional start time -->
      <div class="start-section">
        <label class="start-toggle">
          <input
            type="checkbox"
            bind:checked={useStartTime}
            class="start-check"
          />
          <span>Schedule start time</span>
        </label>
        {#if useStartTime}
          <input
            type="time"
            bind:value={startTimeStr}
            class="time-input start-time-input"
          />
        {/if}
      </div>
    </div>

    <footer class="modal-footer">
      {#if hasActiveTimer}
        <button class="btn-clear" onclick={onclear}>Clear</button>
        <div class="footer-right">
          <button class="btn-cancel" onclick={oncancel}>Cancel</button>
          <button class="btn-start" onclick={handleStart} disabled={!isValid}>
            Start Timer →
          </button>
        </div>
      {:else}
        <button class="btn-start" onclick={handleStart} disabled={!isValid}>
          Start Timer →
        </button>
      {/if}
    </footer>
  </div>
</div>

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    animation: fade-in 0.15s ease;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .modal {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    width: min(420px, 90vw);
    box-shadow:
      0 24px 64px rgba(0, 0, 0, 0.2),
      0 0 0 1px rgba(0, 0, 0, 0.04);
    animation: slide-up 0.18s ease;
  }

  @keyframes slide-up {
    from {
      transform: translateY(12px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid var(--border);
  }

  .modal-header h2 {
    font-family: var(--font-display);
    font-size: 1.15rem;
    font-weight: 600;
    color: var(--text-secondary);
  }

  .close-btn {
    font-size: 1.5rem;
    line-height: 1;
    color: var(--text-muted);
    padding: 0.1rem 0.4rem;
    border-radius: var(--radius);
    transition: color 0.15s;
  }

  .close-btn:hover {
    color: var(--text-primary);
  }

  .modal-body {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .mode-tabs {
    display: flex;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
  }

  .tab {
    flex: 1;
    padding: 0.55rem 1rem;
    font-family: var(--font-display);
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--text-muted);
    background: transparent;
    border-right: 1px solid var(--border);
    transition:
      color 0.15s,
      background 0.15s;
  }

  .tab:last-child {
    border-right: none;
  }

  .tab.active {
    color: var(--accent);
    background: var(--accent-dim);
  }

  .tab:hover:not(.active) {
    color: var(--text-secondary);
    background: rgba(0, 0, 0, 0.03);
  }

  .inputs-row {
    display: flex;
    align-items: flex-end;
    gap: 0.75rem;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .input-group.wide {
    flex: 1;
  }

  label {
    font-family: var(--font-display);
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--text-muted);
  }

  .number-input,
  .time-input {
    background: var(--surface-raised);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    color: var(--text-primary);
    font-family: var(--font-mono);
    font-size: 1.6rem;
    padding: 0.6rem 0.8rem;
    outline: none;
    transition: border-color 0.15s;
    width: 90px;
    text-align: center;
    -moz-appearance: textfield;
    appearance: textfield;
  }

  .number-input::-webkit-outer-spin-button,
  .number-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  .time-input {
    width: 100%;
    font-size: 1.4rem;
    text-align: left;
  }

  .number-input:focus,
  .time-input:focus {
    border-color: var(--accent);
  }

  .input-sep {
    font-family: var(--font-mono);
    font-size: 1.8rem;
    color: var(--text-muted);
    padding-bottom: 0.4rem;
    line-height: 1;
  }

  .hint {
    font-size: 0.85rem;
    color: var(--text-muted);
    font-style: italic;
  }

  .start-section {
    border-top: 1px solid var(--border-subtle);
    padding-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .start-toggle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-family: var(--font-display);
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--text-muted);
    user-select: none;
  }

  .start-toggle:hover {
    color: var(--text-secondary);
  }

  .start-check {
    width: 14px;
    height: 14px;
    accent-color: var(--accent);
    cursor: pointer;
  }

  .start-time-input {
    font-size: 1.4rem;
    width: 100%;
  }

  .modal-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 1.25rem 1.5rem;
    border-top: 1px solid var(--border);
  }

  .footer-right {
    display: flex;
    gap: 0.75rem;
  }

  .btn-clear {
    padding: 0.6rem 1.25rem;
    font-family: var(--font-display);
    font-size: 0.9rem;
    color: var(--text-muted);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    transition:
      color 0.15s,
      border-color 0.15s;
  }

  .btn-clear:hover {
    color: #c0392b;
    border-color: #c0392b;
  }

  .btn-cancel {
    padding: 0.6rem 1.25rem;
    font-family: var(--font-display);
    font-size: 0.9rem;
    color: var(--text-muted);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    transition: color 0.15s;
  }

  .btn-cancel:hover {
    color: var(--text-secondary);
  }

  .btn-start {
    padding: 0.6rem 1.5rem;
    font-family: var(--font-display);
    font-size: 0.95rem;
    font-weight: 500;
    color: #fff;
    background: var(--accent);
    border-radius: var(--radius);
    transition:
      background 0.15s,
      opacity 0.15s;
  }

  .btn-start:hover:not(:disabled) {
    background: var(--accent-hover);
  }

  .btn-start:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
</style>
