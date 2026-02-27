# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev        # dev server
bun run build      # production build (static, BASE_PATH env var for sub-path deploys)
bun run check      # svelte-check type checking
bun run format     # prettier
```

## Architecture

Single-page SvelteKit app with `adapter-static`. Two-pane layout: left pane for markdown instructions (click-to-edit), right pane for countdown timer.

**State flow:** `TimerPane` owns `endTime`/`startTime` state, persists to `localStorage`, conditionally renders `TimerModal` (via `{#if showModal}`) or `TimerDisplay`. Modal communicates via callback props (`onstart`, `oncancel`, `onclear`).

**Svelte 5 patterns used:** `$state`, `$derived`, `$derived.by`, `$effect`, `$props()`. Use plain computed initialization (not `$effect`) for reading `localStorage` on startup to avoid SSR issues.

**Styling:** CSS variables in `app.css`; scoped styles per component. Light academic theme — bg `#f6f2eb`, accent `#a07028`. Timer digits color-transitions: amber → orange (<10min) → red (<5min, pulsing).
