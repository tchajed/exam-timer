# Exam Timer

A single-page web app for displaying a countdown timer and instructions to students during an exam.

## Features

- **Instructions pane** — left side shows rendered Markdown; click anywhere to edit the source, press `Escape` or click "Done" to return to the preview
- **Timer pane** — right side shows a large countdown; set the timer by entering either a duration (hours + minutes) or a specific end time
- Color transitions as time runs low: amber → orange (< 10 min) → red with pulse (< 5 min) → "Time's Up"
- Both the instructions and the timer end time persist in `localStorage`, so a page reload resumes where you left off

## Development

```bash
bun install
bun run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Scripts

| Script            | Description                    |
| ----------------- | ------------------------------ |
| `bun run dev`     | Start dev server               |
| `bun run build`   | Production build               |
| `bun run preview` | Preview the production build   |
| `bun run check`   | Type-check with `svelte-check` |
| `bun run format`  | Format all files with Prettier |

## Stack

- [SvelteKit](https://svelte.dev/docs/kit) + [Svelte 5](https://svelte.dev/docs/svelte) (runes)
- TypeScript
- [marked](https://marked.js.org/) for Markdown rendering
- [Prettier](https://prettier.io/) with `prettier-plugin-svelte`
