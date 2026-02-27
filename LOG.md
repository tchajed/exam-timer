# Initial prompt

I want to create a web application for showing a timer to students during an exam. This will be a
single page with two side-by-side panes.

## Instruction pane

The left pane should have whatever instructions need to be shown. This should be a markdown editor
when clicked, then the rendered version otherwise.

## Timer pane

The right pane should have a timer. It needs a modal to set up the timer, which should support either
inputting an end time or a duration. The timer should take up most of the pane, display mm:ss or
hh:mm:ss, and also show the end time in a smaller font below.

## Implementation

Use Svelte, TypeScript, and prettier. Use components to make the code modular.

(I interrupted and told it to use bun and sveltekit)

# Next major steps

1. Switch to a light theme.
2. Support a start time. If there's a start time, show the duration but don't start timing until the start. Also show a progress bar.
3. Support esc and command-enter in the instructions pane to stop editing.
4. Make the rendered markdown larger.

Change the serif font to something softer and sans serif. Don't use all caps.

# Deployment

> Add a github CI workflow, with build and format jobs. Also add a dependabot config.

> Add a github pages deployment on push to main as well

(the response even told me the setup that is required on github.com)

# Favicon

(three separate prompts because I didn't test and forgot about deployment issues)

> Add a basic Favicon

> It doesn't seem like the new favicon is used

> The favicon is still not working in github pages, where I'm deploying to https://tchajed.github.io/exam-timer/
