<script lang="ts">
  let { endTime }: { endTime: Date } = $props();

  let remaining = $state(0);

  $effect(() => {
    // Re-run whenever endTime changes
    const target = endTime;

    function tick() {
      remaining = Math.max(0, target.getTime() - Date.now());
    }

    tick();
    const id = setInterval(tick, 500);
    return () => clearInterval(id);
  });

  let totalSeconds = $derived(Math.floor(remaining / 1000));

  let displayTime = $derived.by(() => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    const mm = String(m).padStart(2, '0');
    const ss = String(s).padStart(2, '0');
    if (h > 0) {
      return `${String(h).padStart(2, '0')}:${mm}:${ss}`;
    }
    return `${mm}:${ss}`;
  });

  let isExpired = $derived(remaining === 0);

  let timerClass = $derived.by(() => {
    if (isExpired) return 'expired';
    if (remaining < 5 * 60 * 1000) return 'danger';
    if (remaining < 10 * 60 * 1000) return 'warning';
    return 'ok';
  });

  let endTimeLabel = $derived(
    endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );

  let isShort = $derived(totalSeconds < 3600 && !isExpired);
</script>

<div class="timer-display">
  {#if isExpired}
    <div class="expired-label">Time's Up</div>
    <div class="ended-at">Ended at {endTimeLabel}</div>
  {:else}
    <div class="digits {timerClass}" class:short={isShort}>
      {displayTime}
    </div>
    <div class="end-time-row">
      <span class="end-time-label">Ends at</span>
      <span class="end-time-value">{endTimeLabel}</span>
    </div>
  {/if}
</div>

<style>
  .timer-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    flex: 1;
  }

  .digits {
    font-family: var(--font-mono);
    font-weight: 700;
    font-size: clamp(3rem, 8vw, 9rem);
    letter-spacing: -0.02em;
    line-height: 1;
    font-variant-numeric: tabular-nums;
    transition: color 1s ease;
  }

  /* Larger size when showing only mm:ss */
  .digits.short {
    font-size: clamp(3.5rem, 11vw, 12rem);
  }

  .digits.ok {
    color: var(--timer-ok);
    text-shadow: 0 0 60px rgba(200, 148, 58, 0.25);
  }

  .digits.warning {
    color: var(--timer-warn);
    text-shadow: 0 0 60px rgba(212, 119, 58, 0.3);
  }

  .digits.danger {
    color: var(--timer-danger);
    text-shadow: 0 0 60px rgba(212, 64, 64, 0.35);
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.85;
    }
  }

  .end-time-row {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    color: var(--text-muted);
  }

  .end-time-label {
    font-family: var(--font-display);
    font-size: 1rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .end-time-value {
    font-family: var(--font-mono);
    font-size: 1.1rem;
    color: var(--text-secondary);
  }

  .expired-label {
    font-family: var(--font-display);
    font-size: clamp(3rem, 7vw, 7rem);
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--timer-danger);
    text-shadow: 0 0 80px rgba(212, 64, 64, 0.5);
    animation: pulse 1.5s ease-in-out infinite;
  }

  .ended-at {
    font-family: var(--font-mono);
    font-size: 1rem;
    color: var(--text-muted);
  }
</style>
