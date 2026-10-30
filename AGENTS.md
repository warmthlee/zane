# AGENTS.md

This repository is designed to work with multiple AI coding agents without locking onto one vendor-specific workflow. The goal is to keep commands, conventions, and quality gates portable across Claude Code, Codex, Copilot, and similar tools.

This repository explicitly supports Claude Code through the root-level `CLAUDE.md` file, while keeping the generic `AGENTS.md` contract for other agent tools.

## 1. Scope and guardrails

### In scope
- Maintain a lightweight personal blog built with React + TypeScript + Vite.
- Keep the product boundary clear: blogging, notes, learning records, and editorial presentation.
- Support AI-assisted development with explicit quality gates and review checkpoints.
- Preserve project context in a way that is recoverable across sessions and devices.

### Out of scope
- Do not introduce heavy CMS, database-backed SaaS, or enterprise auth systems unless the product direction clearly changes.
- Do not add broad feature sprawl just because an AI agent can generate it quickly.
- Do not rely on a single AI tool's proprietary conventions as the only source of truth.

## 2. Working rules for AI agents

- Prefer repository-native commands over tool-specific ones.
- Use the same validation sequence for every change: install dependencies when needed, run lint/build, and check the changed behavior.
- Document design choices and trade-offs in the `docs/` tree instead of keeping them only in chat history.
- Keep human review in the loop for product decisions, release decisions, and scope changes.

## 3. Portable commands

```bash
npm install
npm run dev -- --host 0.0.0.0
npm run build
npm run lint
```

## 4. Quality gates

Before closing a task, confirm:
- the change matches the agreed scope
- the relevant docs are updated
- the target commands still pass
- the implementation is easy to explain and review

## 5. Session persistence policy

This project should treat AI sessions as durable artifacts rather than ephemeral chat logs. Keep the following in the workflow:
- task intent and acceptance criteria
- code change summary
- verification command output
- release or deployment notes
- follow-up tasks and open risks

Store records in the repository docs and any external session archive used by the team. Do not depend on a single runtime system for recovery.

## 6. Release and operations policy

- Build and validate before merging or publishing.
- Keep deployment steps simple and reversible.
- Record rollback steps and failure analysis.
- Do not treat AI-generated changes as exempt from human sign-off.

## 7. Ownership

The product owner decides scope. The engineering workflow is responsible for execution quality, validation, and maintainability. AI agents help accelerate implementation, but they do not replace judgment or operational review.
