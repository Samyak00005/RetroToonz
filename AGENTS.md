# RetroToonz Agent Instructions

Before changing UI or UX, read `DESIGN.md` completely.

## Priority

`DESIGN.md` is the project-specific source of truth and outranks generic design advice.

Do not "improve away" approved brand identity. In particular, preserve the protected Start Watching and Surprise Me CTA treatment unless the user explicitly asks to change it.

## Working method

1. Audit the current component before editing it.
2. Reuse shared tokens/components before adding new styles.
3. Fix hierarchy, spacing, readability and interaction before decoration.
4. Design every change for mobile, tablet and desktop.
5. Keep motion subtle, fast and interruptible.
6. Respect `prefers-reduced-motion`.
7. Avoid generic AI-design patterns: excessive glass, glow, gradients, nested cards, badges, giant headings and decorative motion.
8. Run `npm run design:audit` after UI work.

## Change discipline

- Prefer small, reviewable changes.
- Do not modify unrelated screens during a focused design phase.
- Do not add runtime dependencies for design-audit tooling unless there is a clear product need.
- Never move or rename media paths casually; media conventions are part of the product architecture.

- The current expanded Search Bar is protected; do not redesign, resize, restyle, or replace it unless the user explicitly asks.

- The SearchBar in `src/components/common/SearchBar.jsx` is protected brand UI. Preserve the user-approved implementation and its very thin/subtle cyan focus border. Do not redesign it without explicit user approval.

- Preserve pill consistency for user-facing action/utility controls (`rounded-full`) unless a control is intentionally circular or a card/input surface.
