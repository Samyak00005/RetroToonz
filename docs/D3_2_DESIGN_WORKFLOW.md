# D3.2 — Design Quality Workflow

This pass adds design-quality tooling to the development workflow without changing the production UI or adding viewer-facing dependencies.

## Added

- project design precedence and protected-brand rules in `DESIGN.md`
- `AGENTS.md` for AI coding tools
- `.github/copilot-instructions.md`
- `docs/DESIGN_REVIEW_WORKFLOW.md`
- `docs/MOTION_GUIDELINES.md`
- `tools/design-audit.mjs`
- `npm run design:audit`
- `npm run design:audit:strict`

The audit checks obvious anti-slop regressions and verifies that the protected Hero/Surprise Me CTA tokens remain present.

Warnings require human judgement. `DESIGN.md` remains the source of truth.
