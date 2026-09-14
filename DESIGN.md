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
