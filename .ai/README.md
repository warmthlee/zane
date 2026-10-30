# AI-native project blueprint

This folder captures the project-level AI operating model for this repository. It is intentionally tool-agnostic so that Claude Code, Codex, Copilot, or other agent-based tools can all use the same working contract.

## Core principles
- Human owns scope and release decisions.
- AI owns execution, iteration, and documentation support.
- All tasks should have clear acceptance criteria.
- Validation should be repeatable and easy to rerun.

## Session archive policy
- Save task intent, implementation notes, and verification output.
- Store exportable artifacts in a structured directory or external sync target.
- Treat chat history as supporting context, not the only source of truth.

## Sync recommendation
For a future multi-device workflow, the recommended pattern is:
1. local repo as source of truth
2. git-based versioning for code history
3. structured notes or task exports in a shared archive
4. optional cloud sync for artifacts and deployment records

This keeps the system portable even when the active AI tool changes.
