# The Dispatch — Design System & Editorial Identity Notes

## 1. Editorial Philosophy & Art Direction
The Dispatch is an independent student-led digital journalism publication with a calm, tactile, and dignified presence. It draws inspiration from print broadsheets, archival photographic proofs, and high-contrast editorial magazines.

### Core Foundation Palette
- **Warm Editorial Paper (`#FAF7F2`)**: Off-white newsprint paper surface that reduces eye strain and establishes an authentic literary physical presence.
- **Deep Ink (`#111113`, `#18181A`)**: Deep charcoal and carbon ink typography with high contrast.
- **Signal Editorial Red (`#9E1B1B`)**: One deliberate signal red used sparingly for the masthead dot, category anchors, pullquote borders, and active status indicators.
- **Hairline Rules (`#D8D1C5`, `#ECE7DE`)**: Clean, delicate physical dividing rules (0.5px and 1px borders) instead of boxy cards.

## 2. Signature Motif: The "Dispatch Stamp" System
The signature motif across The Dispatch is a unified **Dispatch Stamp** applied consistently to four key touchpoints:

1. **Datestamp & Registration Mark**:
   - A datestamp-style monospace slug (`DISPATCH • 20 OCT 2026 • 11:30`) paired with a 4px signal-red square registration mark (`■`).
   - Sits above category headers and section transitions.

2. **Printed-Proof Corner Crop Marks**:
   - Image frames feature subtle corner registration lines (hairline L-marks) mimicking physical darkroom contact sheets and editorial print proofing.

3. **Thin Double Rule Dividers**:
   - A refined dual rule (`1px solid #18181A` + `0.5px solid #D8D1C5` with 2px gap) used on the masthead and article chapter breaks.

4. **Honest Editorial Metadata Line**:
   - Monospace uppercase captions for publication date, verified reading time, and author references. No artificial slot IDs or internal project jargon on the public site.

## 3. Typography Hierarchy
- **Headline Serif**: *Newsreader* (optical size optical-variant serif designed specifically for continuous editorial reading and monumental display headlines).
- **Interface & Text Sans**: *Plus Jakarta Sans* (geometric, highly legible modern grotesque sans-serif for decks, UI navigation, and long-read body passages).
- **Metadata Mono**: *JetBrains Mono* (used sparingly for timestamps, bylines, word metrics, and registration tags).

## 4. Motion Tokens
Defined centrally in `src/utils/motion.ts`:
- **Fast / Micro**: 150ms `cubic-bezier(0.16, 1, 0.3, 1)` (hover states, buttons, focus rings).
- **Medium / Content**: 250ms `cubic-bezier(0.16, 1, 0.3, 1)` (drawers, modal fades, section transitions).
- **Deliberate / Spatial**: 500ms `cubic-bezier(0.25, 1, 0.5, 1)` (spatial orbit step transitions, hero contracting).
- Motion is strictly applied to `transform` and `opacity`. Never animating layout properties (`width`, `height`, `top`, `left`).
- Strict support for `prefers-reduced-motion: reduce`.
