<script lang="ts">
  let { endTime, startTime = null }: { endTime: Date; startTime: Date | null } =
    $props();

  let remaining = $state(0);
  let nowMs = $state(Date.now());

  $effect(() => {
    const target = endTime;

    function tick() {
      nowMs = Date.now();
      remaining = Math.max(0, target.getTime() - nowMs);
    }

    tick();
    const id = setInterval(tick, 300);
    return () => clearInterval(id);
  });

  let totalSeconds = $derived(Math.floor(remaining / 1000));

  function formatDuration(secs: number): string {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    const mm = String(m).padStart(2, '0');
    const ss = String(s).padStart(2, '0');
    if (h > 0) return `${String(h).padStart(2, '0')}:${mm}:${ss}`;
    return `${mm}:${ss}`;
  }

  let displayTime = $derived(formatDuration(totalSeconds));

  let isExpired = $derived(remaining === 0);
  let isWaiting = $derived(startTime !== null && startTime.getTime() > nowMs);

  let timerClass = $derived.by(() => {
    if (remaining < 5 * 60 * 1000) return 'danger';
    if (remaining < 10 * 60 * 1000) return 'warning';
    return 'ok';
  });

  let endTimeLabel = $derived(
    endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );

  let startTimeLabel = $derived(
    startTime
      ? startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : ''
  );

  let isShort = $derived(totalSeconds < 3600 && !isExpired);

  // Static duration display for the waiting state
  let totalDurationDisplay = $derived(
    startTime
      ? formatDuration(
          Math.floor((endTime.getTime() - startTime.getTime()) / 1000)
        )
      : ''
  );

  // Progress 0–1 (null when no start time)
  let progress = $derived.by((): number | null => {
    if (!startTime) return null;
    if (isExpired) return 1;
    if (isWaiting) return 0;
    const total = endTime.getTime() - startTime.getTime();
    const elapsed = nowMs - startTime.getTime();
    return Math.max(0, Math.min(1, elapsed / total));
  });
</script>

<div class="timer-display">
  {#if isExpired}
    <div class="expired-label">Time's Up</div>
    <div class="ended-at">Ended at {endTimeLabel}</div>
  {:else if isWaiting}
    <div class="digits ok waiting">{totalDurationDisplay}</div>
    <div class="start-info-row">
      <span class="time-label">Starts at</span>
      <span class="time-value">{startTimeLabel}</span>
      <span class="time-sep">·</span>
      <span class="time-label">Ends at</span>
      <span class="time-value">{endTimeLabel}</span>
    </div>
    <div class="progress-bar">
      <div class="progress-fill" style="width: 0%"></div>
    </div>
  {:else}
    <div class="digits {timerClass}" class:short={isShort}>
      {displayTime}
    </div>
    <div class="end-time-row">
      <span class="end-time-label">Ends at</span>
      <span class="end-time-value">{endTimeLabel}</span>
    </div>
    {#if progress !== null}
      <div class="progress-bar">
        <div class="progress-fill" style="width: {progress * 100}%"></div>
      </div>
    {/if}
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

  .digits.waiting {
    opacity: 0.5;
  }

  .digits.ok {
    color: var(--timer-ok);
  }

  .digits.warning {
    color: var(--timer-warn);
  }

  .digits.danger {
    color: var(--timer-danger);
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.75;
    }
  }

  .end-time-row,
  .start-info-row {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    color: var(--text-muted);
  }

  .end-time-label,
  .time-label {
    font-family: var(--font-display);
    font-size: 0.9rem;
    font-weight: 500;
  }

  .end-time-value,
  .time-value {
    font-family: var(--font-mono);
    font-size: 1.1rem;
    color: var(--text-secondary);
  }

  .time-sep {
    color: var(--border);
    font-size: 1rem;
  }

  .expired-label {
    font-family: var(--font-display);
    font-size: clamp(3rem, 7vw, 7rem);
    font-weight: 600;
    color: var(--timer-danger);
    animation: pulse 1.5s ease-in-out infinite;
  }

  .ended-at {
    font-family: var(--font-mono);
    font-size: 1rem;
    color: var(--text-muted);
  }

  .progress-bar {
    width: 70%;
    max-width: 360px;
    height: 5px;
    background: var(--border);
    border-radius: 3px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: var(--accent);
    border-radius: 3px;
    transition: width 0.5s ease;
  }
</style>
