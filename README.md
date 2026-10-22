# The Dispatch — Stories That Matter

An independent digital journalism publication and multimedia reporting platform dedicated to in-depth investigative reporting, documentary fieldwork, and narrative craft.

---

## 1. Product Overview

**The Dispatch** is a responsive digital newsroom founded by student journalists. The publication emphasizes format-driven reporting where long-form prose, audio documentaries, photographic sequences, and broadcast packages serve as distinct, rigorous investigative instruments.

### Key Architectural Characteristics
- **Strict Separation of Concerns:** Public components only import public domain models (`Story`, `Contributor`, `StoryCover`, `StoryMedia`). All internal academic and assessment records are segregated under `/editorial/internal` (accessible only to admin accounts).
- **Zero Heavy Animation Dependencies:** All spatial and kinetic interactions (the 3D Story Orbit, vertical-to-horizontal Reporting Rail, and scroll-linked hero transition) are engineered with vanilla CSS 3D transforms, CSS custom properties, and requestAnimationFrame loops writing directly to DOM element refs.
- **Privacy & Byline Integrity:** Bylines adhere to verified newsroom attribution without unconfirmed personal details.
- **Honest Demo Architecture:** Explicitly labelled browser-local demo mode (`localStorage`) with role-based permissions, client-side image downscaling, and JSON export/import utilities.

---

## 2. Technology Stack

- **Framework:** React 19, TypeScript 6, Vite 8
- **Routing:** React Router v7 with SPA redirect fallback (`public/_redirects`)
- **Styling:** Vanilla Tailwind CSS 3.4 with a consolidated warm newsprint design system
- **Icons:** Lucide React
- **Testing:** Vitest for unit testing
- **Linting:** Oxlint for high-performance static analysis

---

## 3. Editorial Design System ("Dispatch Stamp")

The visual identity is founded on a traditional newsprint palette and editorial discipline:
- **Paper Palette:** Deep warm ivory paper tones (`#FAF7F2`, `#F4EFEA`) with hairline structural borders (`#D8D1C5`, `#ECE7DE`).
- **Ink Palette:** High-contrast archival charcoal (`#111113`, `#18181A`, `#2C2C30`).
- **Signal Red:** Single deliberate accent (`#9E1B1B`) applied to category registrations, hairline datestamps, and focal micro-interactions.
- **Dispatch Stamp Motif:** A signature double hairline rule with a 6px red square registration mark preceding section labels, cards, and datestamp metadata lines.
- **Proof Corner Crop Marks:** Image containers incorporate printed-proof corner crop marks (`.proof-frame`), grounding photography in darkroom materiality.
- **Typography:** Webfont scale pairing *Newsreader* (editorial serif headlines and pullquotes) with *Plus Jakarta Sans* (reading copy and UI controls) and *JetBrains Mono* (datelines, audio timecodes, and telemetry).

---

## 4. Public Navigation & Page Hierarchy

- `/`: Homepage featuring the scroll-linked lead investigation, horizontal reporting rail, spatial story orbit, and editorial desks.
- `/latest`: Chronological repository of all published dispatches with keyword search and format filters reflected in URL query parameters (`?q=`, `?format=`).
- `/long-reads`: In-depth investigative features exceeding 1,000 words.
- `/short-stories`: Scannable visual dispatches, short video packages, and photo features.
- `/section/:category`: Desk pages for *Campus*, *Society*, *Culture*, and *Investigations* (including source-verification and methodology notes).
- `/multimedia`: Audio podcast documentaries, video reports, and documentary photo sequences.
- `/story/:slug`: Clean single-column article template with reading progress indicator, drop caps, pull quotes, transcript viewer, source list, and team credits.
- `/about`: Newsroom mission statement, masthead roster, and demonstrative reporting disclosure.
- `/standards`: Editorial code of practice, right of reply protocol, and human-authorship ethics charter.
- `/look-closer`: Interactive journalism lab with annotated photo hotspot pins, nocturnal reporting timeline, and source literacy exercise.
- `/search`: Dedicated search page supporting full-text query matching across headlines, summaries, categories, and deep body text.
- `/editorial/login`: Quietly placed in the footer for newsroom staff and reviewers.

---

## 5. Motion System & Spatial Engineering

### Scroll-Linked Lead Story Transition
The opening viewport displays a full-bleed documentary photograph. As the reader scrolls down, a passive scroll listener throttled by `requestAnimationFrame` calculates a single normalized progress scalar ($0.0 \rightarrow 1.0$) across $120\text{vh}$. The hero image contracts smoothly into a framed editorial card while revealing the deck, byline, reading time, and read link.

### Vertical-to-Horizontal Reporting Rail
- Pinned section where vertical scroll translates linearly to horizontal travel.
- Story cards enter from the lower-right viewport along a gentle parabolic curve (subtle Y translation and rotational tilt).
- Enclosed card anatomy: all headlines, summaries, bylines, and read links sit strictly within card borders with clamped line counts.
- Mobile and reduced-motion fallback: native horizontal scroll with `scroll-snap`.

### Spatial Story Orbit
- Pure CSS 3D perspective (`perspective: 1200px`, `rotateY`, `translate3d`).
- Elliptical coordinate loop derived from a single angular phase value that writes directly to DOM element refs (avoiding React state re-renders during 60 FPS animation).
- Interaction robustness: watchdog timer automatically recovers rotation if pointer events are interrupted; 6px movement threshold prevents accidental clicks while dragging.
- Pauses automatically when off-screen via `IntersectionObserver` or when the tab is hidden.

---

## 6. Editorial CMS & Persistence Architecture

The newsroom suite operates behind an `AuthProvider` and an `IContentRepository` interface:
- **Demo Mode Transparency:** Persists data strictly in browser `localStorage`. Quota errors are handled gracefully, and image uploads are downscaled client-side to maximum 1280px.
- **Role Permissions:**
  - `contributor`: Draft and edit own stories; cannot publish or delete.
  - `editor`: Edit all dispatches, publish/unpublish, and designate homepage lead story.
  - `admin`: Full editorial control, manage contributor roster, and access internal assessment dossier.
- **Story Editor:** Real-time word counter, automated reading time calculation, status transitions (Draft $\rightarrow$ Review $\rightarrow$ Published), and live article preview tab.
- **Portability:** Export and import entire newsroom databases as JSON backups.
- **Internal Assessment Dossier (`/editorial/internal`):** Restricted admin-only area containing syllabus compliance matrices, word-count audits, and printable assessment sheets.

> **Note on Security:** In demo mode, authentication is simulated locally without a server. A production deployment requires a server-side session/JWT store and an authenticated SQL/NoSQL database.

---

## 7. Local Setup & Verification

```bash
# Install dependencies
npm install

# Start local development server (Vite)
npm run dev

# Run unit test suite (Vitest)
npm test

# Run static linter (Oxlint)
npm run lint

# Build production bundle with strict TypeScript checking
npm run build

# Preview production build locally
npm run preview
```

### Test Coverage Summary
The automated test suite (`npm test`) exercises:
1. **Search Matching:** Headline, author, category, and body text queries with case-insensitivity.
2. **Slug Lookup & 404:** Exact slug retrieval, ID fallback, non-existent slugs returning 404, and hiding unpublished drafts from public readers.
3. **Role Permissions:** Contributor draft restrictions, editor publishing privileges, admin roster management.
4. **Reading Time Calculation:** Word count tokenization and 225 wpm reading speed benchmarks.
5. **Orbit Drag vs. Click Threshold:** Validating that micro-movements $\le 6\text{px}$ trigger navigation while gestures $> 6\text{px}$ scrub the orbit.

---

## 8. License & Attribution

Published by *The Dispatch* student reporting team under student press independence. All photographic assets and fieldwork documentation are created for demonstrative educational purposes.
