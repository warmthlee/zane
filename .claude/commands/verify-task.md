# /verify-task

Use this command before considering a task complete.

## Required checks
- Confirm the change matches the agreed scope.
- Run project validation commands relevant to the change.
- Confirm build or lint still passes if the change affects runtime or project config.
- Ensure docs and project rules remain aligned.
- Check that the task outcome is easy to review and explain.

## Minimum validation
```bash
npm run build
npm run lint
```

## Completion rule
Only mark the task complete when the scope, validation results, and documentation are all consistent.
