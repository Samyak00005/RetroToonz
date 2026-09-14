# RetroToonz Design Review Workflow

This workflow adapts the useful ideas behind modern design-audit/anti-slop tooling to RetroToonz without adding anything to the production bundle.

## Source of truth

`DESIGN.md` always wins.

External audit tools and design references are advisory. They can identify problems but must not override deliberate RetroToonz decisions such as the protected Hero CTA.

## Review loop

### 1. Audit

Before editing, identify:
- hierarchy problems
- inconsistent spacing
- competing CTAs
- unreadable artwork/text
- small touch targets
- duplicated visual patterns
- avoidable glass/glow/gradients
- motion that does not communicate state

### 2. Simplify

Prefer removing or consolidating UI before adding more UI.

### 3. Reuse

Use existing:
- design tokens
- shared buttons
- IconButton
- PageHeading / SectionHeading
- common card patterns
- standard content containers

### 4. Refine motion

Use motion only for interaction, state change, navigation or hierarchy. See `MOTION_GUIDELINES.md`.

### 5. Responsive review

Check at minimum:
- 390px phone
- 768px tablet
- 1024px tablet/laptop
- 1366px laptop
- 1920px desktop

### 6. Automated design audit

Run:

```bash
npm run design:audit
```

The audit is intentionally conservative. Warnings are prompts for review, not automatic proof that a design is wrong.

Use strict mode when desired:

```bash
node tools/design-audit.mjs --strict
```

## External tools

If using an agent/tool such as Impeccable or Taste Skill, give it `DESIGN.md` first and tell it that protected brand components are exceptions to generic simplification rules.

Do not ship those tools in the viewer-facing React bundle.
