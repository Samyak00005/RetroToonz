# RetroToonz Motion Guidelines

Motion should make the product easier to understand, not louder.

## Preferred timing

- micro interaction: 120–180ms
- button/card feedback: 160–240ms
- dropdown/modal: 180–280ms
- page content: 180–300ms
- Hero artwork crossfade: roughly 400–550ms

These are guidelines, not fixed constants.

## Preferred properties

Prefer:
- opacity
- transform

Use layout animation only when it materially improves comprehension.

Avoid animating expensive paint-heavy properties unless necessary.

## Scale

- poster/card artwork hover: <= 1.03 normally
- protected brand CTA hover: 1.05 by explicit design decision
- press feedback: around 0.95–0.98

## Continuous motion

Avoid continuous floating, bouncing, spinning and pulsing unless representing an active system state such as loading.

The protected Hero CTA may use its subtle hover ping accent because it is an explicit brand decision.

## Reduced motion

Every non-essential animation must have a sensible reduced-motion state.
