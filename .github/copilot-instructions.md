# RetroToonz Copilot Instructions

Read `/DESIGN.md` before suggesting or editing UI.

RetroToonz is a dark, cinematic, content-first cartoon streaming product. Preserve the existing product identity rather than generating generic SaaS UI.

Key constraints:
- Artwork and playback outrank decorative UI.
- Use existing CSS variables and shared components.
- Do not introduce new brand colors casually.
- Avoid excessive gradients, glassmorphism, glow, shadows, badges, rounded containers and animation.
- Keep interactions responsive but restrained.
- Minimum interactive target is about 44x44px where practical.
- Check mobile, tablet and desktop behavior.
- Respect reduced motion.
- The Hero Start Watching CTA and Surprise Me CTA are protected brand components; do not normalize their original cyan-to-blue pill treatment.

After UI changes, run `npm run design:audit` and review warnings rather than blindly suppressing them.

- The current expanded Search Bar is protected; do not redesign, resize, restyle, or replace it unless the user explicitly asks.
