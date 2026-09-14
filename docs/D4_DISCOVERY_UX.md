# D4 — Discovery UX

D4 refines Search and All Shows around the RetroToonz content-first design system.

## Goals

- Reduce filter-form/SaaS visual weight.
- Make common discovery actions immediately available.
- Keep mobile discovery first-class.
- Preserve relevance for search queries.
- Make discovery state shareable and back-button friendly.
- Avoid duplicate headings/result counts.

## All Shows

- Uses the shared `PageHeading` hierarchy.
- Quick genre chips expose the most common genres without opening a panel.
- Secondary controls cover era and sort.
- Language is only shown when the catalog actually contains more than one language.
- Active filters are removable chips.
- Mobile uses a bottom-sheet filter panel.
- Filter/sort state is stored in URL search parameters.

Examples:

```text
/all-shows?genre=Comedy&decade=2000&sort=views-desc
/all-shows?genre=Adventure&sort=rating-desc
```

## Search

- Search suggestions remain keyboard navigable.
- Recent searches remain local to the browser.
- The suggestion panel always provides a final `See all results for …` action.
- Search results default to relevance order.
- Genre/era filters can refine the current search without replacing relevance.
- Users can explicitly switch to most watched, highest rated, newest, oldest or alphabetical sorting.
- Section pages such as Newly Added and Retro Classics reuse the same discovery controls.

## Shared discovery controls

New shared files:

```text
src/components/discovery/DiscoveryToolbar.jsx
src/components/discovery/useDiscoveryState.js
```

`DiscoveryToolbar` is intentionally a low-visual-weight control strip, not a large card.

## Responsive behavior

- Mobile: quick genre rail + Filters button + bottom sheet.
- Tablet/Desktop: quick genre rail + compact inline selects.
- Touch targets remain practical and horizontal chip rails can be swiped naturally.

## Design audit

D4 introduces no new protected-brand violations. The project-local design audit remains the post-change review layer:

```bash
npm run design:audit
```
