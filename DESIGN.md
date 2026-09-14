# RetroToonz Design System

## 1. Design Philosophy

RetroToonz is a dark, premium cartoon streaming experience.

The interface should feel:

- cinematic
- playful
- modern
- focused
- lightweight
- responsive

It should NOT feel:

- overly flashy
- generic SaaS
- AI-generated
- overloaded with gradients
- overloaded with glassmorphism
- animation-heavy

The artwork and content are the visual heroes.

UI elements should support the content rather than compete with it.

---

## 2. Visual Hierarchy

Every screen follows this priority:

1. Content
2. Primary action
3. Secondary action
4. Navigation
5. Utility controls

Only one action should normally have dominant visual weight in a given context.

---

## 3. Brand Colors

Primary brand:

#55D6E8

Strong brand:

#5D8CFF

Accent:

#FFD166

Danger:

#FF637F

Success:

#5EE2A0

Primary text:

#F8FAFC

Muted text:

rgba(248, 250, 252, 0.54)

The existing CSS variables in `src/styles/globals.css` are the source of truth.

Do not introduce new brand colors without a design reason.

---

## 4. Background

RetroToonz uses a dark layered background.

Use:

- page background for major page surfaces
- elevated background for important containers
- soft background for secondary surfaces
- translucent surfaces only where they improve hierarchy

Avoid excessive glass effects.

---

## 5. Typography

Primary font:

Inter

Hierarchy:

Display
→ Page title
→ Section title
→ Heading
→ Body
→ Label
→ Metadata

Large typography should communicate hierarchy, not decoration.

Avoid excessive uppercase text.

---

## 6. Buttons

### Primary

Used for the most important action.

Examples:

- Start Watching
- Watch Episode
- Continue Watching

### Secondary

Used for supporting actions.

Examples:

- More Info
- Add to Watchlist

### Ghost

Used for low-priority actions.

### Icon Button

Used for utility actions and navigation.

Icon buttons must have a comfortable touch target.

### Shape consistency

User-facing action and utility controls should use `rounded-full` pill geometry where practical. This includes account/Guest controls, secondary CTAs such as More Info, and compact player controls such as Previous, Next, Speed and Quality. Cards, panels, text fields and media surfaces should not be forced into pill geometry.

---

## 7. Cards

Cards should:

- prioritize artwork
- maintain consistent aspect ratios
- have readable titles
- use subtle hover feedback
- avoid excessive scaling
- avoid excessive shadows

Card interactions should feel responsive but restrained.

---

## 8. Motion

Motion should communicate:

- interaction
- state change
- navigation
- hierarchy

Motion should NOT exist simply to attract attention.

Preferred behavior:

- fast
- subtle
- predictable
- interruptible

Respect:

`prefers-reduced-motion`

---

## 9. Hero

The Hero has one dominant action.

Priority:

1. Show identity
2. Show title
3. Description
4. Start Watching
5. More Info
6. Carousel navigation

Carousel controls must not visually compete with the primary CTA.

---

## 10. Mobile

Mobile is treated as a first-class layout.

Minimum interactive target:

44 × 44px where practical.

Avoid:

- tiny controls
- overlapping controls
- edge-to-edge text
- unnecessary floating buttons

Content should remain easy to operate with one hand.

---

## 11. Accessibility

All interactive elements should provide:

- visible focus state
- keyboard accessibility
- meaningful accessible labels
- sufficient contrast
- adequate touch targets

Do not rely on color alone to communicate state.

---

## 12. Anti-Slop Rules

Do not add UI simply because it looks impressive.

Avoid:

- unnecessary gradients
- excessive glowing effects
- excessive rounded containers
- excessive glassmorphism
- random floating elements
- giant decorative typography
- unnecessary badges
- excessive animations
- multiple competing CTAs

Every visual element should have a purpose.

---

## 13. Content First

RetroToonz is a media product.

Artwork, show titles, episode information and playback should always have higher visual priority than decorative UI.

---

## 14. DesignMeter Goals

Current baseline:

Overall: 61
UI: 67
UX: 55

Primary improvement areas:

- Conversion clarity
- Cognitive load
- Touch targets
- CTA hierarchy
- Layout spacing
- Card readability
- Navigation clarity

Target after redesign:

Overall: 80+
UI: 80+
UX: 80+

## Protected Brand UI

The Hero **Start Watching** CTA is a protected RetroToonz brand element.

Preserve its original visual identity:

- cyan → strong-blue gradient
- white play icon and label
- fully pill-shaped silhouette
- restrained blue elevation
- do not replace it with the generic primary button style

Other UI may evolve around it, but this CTA should remain visually recognizable.

---

## 15. Design Decision Precedence

When design guidance conflicts, use this order:

1. **RetroToonz `DESIGN.md`** — highest priority and project-specific source of truth.
2. **Explicit protected brand decisions** documented below.
3. Existing product behavior that the user has approved.
4. Accessibility and platform usability requirements.
5. External design-audit guidance (for example Impeccable-style audits or Taste-style anti-slop rules).
6. Generic framework defaults or personal preference.

External design advice may identify a problem, but it must not silently overwrite a deliberate RetroToonz brand decision.

## 16. Protected Brand Components

The following elements are intentionally distinctive and must not be "normalized" by generic design cleanup:

### Hero Start Watching CTA

Preserve the original treatment:

- `rounded-full`
- cyan → blue gradient
- white play icon and label
- subtle `shadow-md`
- `hover:scale-105`
- gradient reversal on hover
- `active:scale-95`
- subtle cyan ping accent

### Surprise Me CTA

Use the same protected visual language as Start Watching.

Its position may change responsively to avoid collisions, but the button's visual identity should remain recognizable.

### Artwork-first rule

Show posters, backdrops, episode thumbnails and playback are allowed to be visually stronger than surrounding UI. Do not dim, blur, glass-cover or decorate artwork unless readability or interaction requires it.

## 17. Motion Quality Rules

Motion quality should follow these principles:

- animate state changes, not decoration
- prefer opacity and small transforms over large movement
- prefer 160–320ms for most UI feedback
- use longer transitions only for cinematic media changes such as Hero crossfades
- avoid perpetual motion unless it communicates active loading/playback
- hover feedback should be reversible immediately
- do not stack scale + glow + blur + rotation on one interaction
- pre-load neighboring Hero artwork where practical to avoid flashes
- never make motion essential to understanding state
- always respect `prefers-reduced-motion`

### Default motion vocabulary

- page/content enter: fade + up to 4px movement
- card hover: subtle artwork scale, usually <= 1.03
- button press: short scale-down feedback
- dropdown/modal: fade + small translate/scale
- Hero media change: restrained crossfade, no continuous zoom
- loading: small spinner, skeleton or progress indicator; no decorative bouncing

## 18. AI / Design-Audit Guardrails

When an AI coding tool proposes UI changes, it must first answer internally:

- Does this improve content hierarchy?
- Is this component already solved by an existing shared component?
- Does this add a new color, radius, shadow or motion pattern unnecessarily?
- Does it preserve protected RetroToonz brand UI?
- Does it work on mobile, tablet and desktop?
- Is the interaction usable with keyboard/touch?
- Would removing this decoration make the product clearer?

Prefer fixing spacing, hierarchy, readability and interaction before adding decoration.

## 19. Design Review Definition of Done

A public-facing UI change is not complete until it has been checked for:

- mobile (~360–430px)
- tablet (~768–1024px)
- laptop (~1280–1366px)
- desktop (~1536–1920px)
- keyboard focus
- touch target size
- loading / empty / error state where relevant
- reduced-motion behavior
- safe-zone / container alignment
- protected brand-component regressions

Run:

```bash
npm run design:audit
```

before considering a design phase ready for visual review.



### Protected Search Bar

The current expanded RetroToonz search bar is a protected brand/UI element. Do not redesign, restyle, resize, replace, or simplify it unless the user explicitly requests a search-bar change. Preserve its pill-shaped dark field, very thin/subtle cyan focus border, cyan search icon/accent, integrated cyan-to-blue Search button, circular close control supplied by the Header, proportions, suggestions behavior, and keyboard interaction.
