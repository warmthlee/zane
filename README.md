# Zane Blog

A lightweight personal blog homepage built with React + TypeScript + Vite, designed to support AI-assisted development without being locked to a single agent tool.

## Project direction

This project is intentionally structured so that Claude Code, Codex, Copilot, and similar AI agents can operate on the same workflow contract.

- Shared project rules live in `AGENTS.md`
- Claude Code project instructions live in `CLAUDE.md`
- AI-specific workflow notes live in `.ai/`
- Design and process documentation live in `docs/development/`
- Long-term AI engineering practices are captured in `docs/development/ai-engineering-lessons.md`
- Deployment checklists are recorded in `docs/development/site-launch-checklist.md`
- Product boundaries are explicit: the project should stay focused on personal blogging and knowledge publishing

## Features

- Elegant dark editorial landing page
- Featured writing section
- About / focus summary
- Recent notes archive
- Responsive layout for desktop and mobile
- GitHub Pages deployment workflow for static publishing

## Getting started

```bash
npm install
npm run dev -- --host 0.0.0.0
```

Then open the local Vite URL in your browser.

## Validation and release

```bash
npm run build
npm run lint
npm run release:check
npm run release:deploy
npm run release:rollback
```

`release:deploy` publishes the static `dist/` output to the repository's GitHub Pages branch (`gh-pages`), while `release:check` and `release:rollback` keep the release flow auditable.

## AI-native workflow notes

- `AGENTS.md`: source of truth for working rules and project guardrails
- `.ai/session-state-template.json`: recommended structure for persisting task context across sessions
- `docs/development/ai-agent-compatibility.md`: compatibility design
- `docs/development/session-persistence-sync.md`: session storage and multi-device sync model
- `docs/development/release-operations.md`: release and rollback workflow
- `docs/development/ai-engineering-lessons.md`: summary of practical AI programming experience
