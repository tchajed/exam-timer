<script lang="ts">
  import { marked } from 'marked';
  import { tick } from 'svelte';

  const DEFAULT_INSTRUCTIONS = `## Exam Instructions

Please read carefully before you begin.

- This is a **closed-book** examination
- All electronic devices must be **silenced and stored away**
- Write your **name and student ID** on every answer sheet
- Show all work — answers without supporting work may not receive full credit
- Raise your hand **quietly** if you have a question
- When time is called, **stop writing immediately** and remain seated

*Good luck.*`;

  const stored =
    typeof localStorage !== 'undefined'
      ? (localStorage.getItem('exam-instructions') ?? DEFAULT_INSTRUCTIONS)
      : DEFAULT_INSTRUCTIONS;

  let markdown = $state(stored);
  let isEditing = $state(false);
  let textareaEl = $state<HTMLTextAreaElement | null>(null);

  $effect(() => {
    localStorage.setItem('exam-instructions', markdown);
  });

  let rendered = $derived(marked.parse(markdown, { breaks: true }) as string);

  async function startEditing() {
    isEditing = true;
    await tick();
    textareaEl?.focus();
  }

  function stopEditing() {
    isEditing = false;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      stopEditing();
    } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      stopEditing();
    }
  }
</script>

<section class="pane instruction-pane">
  <header class="pane-header">
    <span class="pane-title">Instructions</span>
    <button
      class="header-btn"
      onclick={isEditing ? stopEditing : startEditing}
      title={isEditing ? 'Save and preview' : 'Edit instructions'}
    >
      {isEditing ? 'Done' : 'Edit'}
    </button>
  </header>

  <div class="pane-body">
    {#if isEditing}
      <textarea
        bind:this={textareaEl}
        bind:value={markdown}
        onkeydown={handleKeydown}
        class="markdown-editor"
        placeholder="Enter exam instructions in Markdown…"
        spellcheck="false"
      ></textarea>
    {:else}
      <div
        class="markdown-preview"
        onclick={startEditing}
        onkeydown={(e) => e.key === 'Enter' && startEditing()}
        role="button"
        tabindex="0"
        title="Click to edit"
      >
        {#if markdown.trim()}
          {@html rendered}
        {:else}
          <p class="placeholder">Click to add exam instructions…</p>
        {/if}
      </div>
    {/if}
  </div>
</section>

<style>
  .instruction-pane {
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
    overflow: hidden;
    position: relative;
  }

  .markdown-editor {
    width: 100%;
    height: 100%;
    background: var(--surface);
    color: var(--text-primary);
    font-family: var(--font-mono);
    font-size: 0.85rem;
    line-height: 1.7;
    padding: 1.75rem 2rem;
    border: none;
    outline: none;
    resize: none;
    caret-color: var(--accent);
  }

  .markdown-preview {
    height: 100%;
    overflow-y: auto;
    padding: 1.75rem 2rem;
    cursor: text;
    outline: none;
    scrollbar-width: thin;
    scrollbar-color: var(--border) transparent;
  }

  .markdown-preview:hover {
    background: rgba(0, 0, 0, 0.02);
  }

  .placeholder {
    color: var(--text-muted);
    font-style: italic;
  }

  /* Markdown content styles */
  .markdown-preview {
    font-size: 1.15rem;
  }

  .markdown-preview :global(h1),
  .markdown-preview :global(h2),
  .markdown-preview :global(h3) {
    font-family: var(--font-display);
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.5em;
    margin-top: 1.4em;
    line-height: 1.3;
  }

  .markdown-preview :global(h1) {
    font-size: 2.2rem;
    border-bottom: 1px solid var(--border);
    padding-bottom: 0.4em;
  }

  .markdown-preview :global(h2) {
    font-size: 1.7rem;
  }

  .markdown-preview :global(h3) {
    font-size: 1.4rem;
  }

  .markdown-preview :global(h1:first-child),
  .markdown-preview :global(h2:first-child),
  .markdown-preview :global(h3:first-child) {
    margin-top: 0;
  }

  .markdown-preview :global(p) {
    margin-bottom: 0.9em;
    color: var(--text-primary);
  }

  .markdown-preview :global(ul),
  .markdown-preview :global(ol) {
    padding-left: 1.6em;
    margin-bottom: 0.9em;
  }

  .markdown-preview :global(li) {
    margin-bottom: 0.3em;
    color: var(--text-primary);
  }

  .markdown-preview :global(li::marker) {
    color: var(--accent);
  }

  .markdown-preview :global(strong) {
    font-weight: 600;
    color: var(--text-primary);
  }

  .markdown-preview :global(em) {
    font-style: italic;
    color: var(--text-secondary);
  }

  .markdown-preview :global(code) {
    font-family: var(--font-mono);
    font-size: 0.82em;
    background: var(--surface-raised);
    border: 1px solid var(--border);
    border-radius: 3px;
    padding: 0.1em 0.35em;
  }

  .markdown-preview :global(hr) {
    border: none;
    border-top: 1px solid var(--border);
    margin: 1.5em 0;
  }

  .markdown-preview :global(blockquote) {
    border-left: 3px solid var(--accent);
    padding-left: 1em;
    color: var(--text-secondary);
    margin: 0.9em 0;
  }
</style>
