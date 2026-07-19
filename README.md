# reroll

**A counterfactual story explorer.** `reroll` lets you take a known story, treat
it as a causal graph, and ask: *what if one fact had been different?* Click any
event, change a single premise, and generate a plausible alternate branch that
forks from that point onward.

It is **not** a choose-your-own-adventure game. It is a tool for inspecting the
**causal structure** of a story — where the leverage points are, how far a
counterfactual drifts from canon, and what the world looks like at each ending.

The canonical path runs left-to-right through the center of the canvas. Alternate
branches fork above and below it. Time is the horizontal axis; vertical position
only separates branches (it carries no meaning).

Ships with three demo stories: **Romeo and Juliet**, **Macbeth**, and **Titanic**.

---

## Quick start

```bash
npm install
npm run dev
# open http://localhost:3000  (or the port Next prints)
```

Other scripts:

```bash
npm run build      # production build
npm run start      # serve the production build
npm run typecheck  # tsc --noEmit (strict)
```

No environment variables, no auth, no database, no backend. Everything —
including branch generation — runs in the browser against local mock data.

---

## Using it

- **Explore** — pan/zoom the graph; use the controls (bottom-left) or minimap.
- **Inspect** — click any node to open the right-side inspector: description,
  current world state, characters, why the event matters, and its downstream
  impact score, plus probability / valence / uncertainty.
- **Reroll** — from the inspector, hit **Reroll from here**. Edit one premise
  (or pick a suggested perturbation), choose a plausibility (faithful / balanced
  / wild), toggle character-consistency, pick how many future events to generate,
  and **Generate branch**. The new branch animates into the graph, connected to
  the source node. You can reroll from alternate nodes too.
- **Scrub time** — the bottom slider moves a time cutoff; events after it mute.
- **Filter** — show *all branches*, *canonical only*, or *the selected branch*.
- **Compare** — toggle **compare** in the top bar, pick any two terminal nodes,
  and see endings, character outcomes, world-state differences, canon distance,
  emotional trajectory, and plausibility side by side.
- **Reset** — restores the pristine story (drops any generated branches).

---

## Visual encoding

| Signal | Encoding |
| --- | --- |
| Time | Horizontal position (`timeIndex`) |
| Branch | Vertical lane (no semantic meaning beyond separation) |
| Canonical vs. alternate | Solid, heavier border vs. dashed, lighter |
| Probability | Edge thickness |
| Downstream impact | Node size (gentle scale) |
| Uncertainty | Lowered node opacity |
| Emotional valence | A small top-right badge only — never a whole-node recolor |

The palette is deliberately restrained: warm-gray paper, near-black ink, a single
forest-green accent. No gradients, no rainbow scales — the aim is a serious
research tool with an editorial feel.

---

## Architecture

```
app/
  layout.tsx          Root layout, fonts, metadata
  page.tsx            Composes TopBar + Graph + overlays + TimelineScrubber
  globals.css         Tailwind layers, React Flow theming, entrance animation
  icon.svg            Favicon (branching-graph glyph)

components/
  Graph.tsx           React Flow canvas: layout, edge styling, filter/scrub dimming, fit-view
  EventNode.tsx       Custom node — reads live UI state; owns all visual encoding
  Inspector.tsx       Right-side event detail panel
  RerollEditor.tsx    Premise editor + perturbations + controls
  TimelineScrubber.tsx  Bottom time slider + branch filter
  TopBar.tsx          App name, story picker, compare + reset
  CompareMode.tsx     Two-ending side-by-side comparison

lib/
  types.ts            Domain model (Story, StoryEvent, Branch, ...)
  store.ts            Zustand store — the single source of UI + story state
  reroll-engine.ts    Deterministic branch generation + perturbation catalogue
  graph-layout.ts     Pure Story -> React Flow {nodes, edges} layout
  story-utils.ts      Pure graph traversal (paths, descendants, terminals, canon distance...)
  stories/
    index.ts          Story registry (add a story here)
    romeo-and-juliet.ts
    macbeth.ts
    titanic.ts
```

### Data model

A `Story` is a set of `StoryEvent`s forming a forest: one canonical spine plus
alternate branches. Each event records both **narrative** fields (title,
description, world state, characters, why-it-matters) and **simulation metrics**
(probability, emotional valence, uncertainty, downstream impact, a compact
world-state diff vs. its parent). See `lib/types.ts`.

### State

All UI and story state lives in one Zustand store (`lib/store.ts`): the current
(cloned, mutable) story, selection, branch filter, scrub position, compare
selection, and editor visibility. Generating a branch is an immutable update that
appends the engine's output to the story. Components subscribe to just the slices
they need; `EventNode` reads selection/scrub/filter directly so the graph reacts
without React Flow re-instantiating node types.

### The reroll engine

`generateBranch` is **fully deterministic** — no `Math.random`, no `Date`. It
seeds a small PRNG from a hash of the source node id + premise, so the same
premise always yields the same branch. Plausibility (faithful / balanced / wild)
shapes probability, uncertainty, and how far valence is allowed to swing;
`preserveCharacterConsistency` carries the source cast forward and damps swings.
Output metrics decay along the beats. Perturbation suggestions come from
per-event `perturbations` (authored in the story data), falling back to a
built-in catalogue, then to generic prompts.

### Layout

`layoutStory` is a pure function: `x = timeIndex * X_GAP`,
`y = lane * LANE_H`. React Flow handles rendering, pan/zoom, fit-view, and the
minimap. Edge thickness and node dimming are computed at render time from store
state, not baked into the layout.

---

## Adding a story

1. Create `lib/stories/<id>.ts` exporting a `Story` (12 canonical events plus a
   few seeded branches is the demo shape; each canonical event should carry 3+
   `perturbations`).
2. Import it in `lib/stories/index.ts` and add it to `ALL_STORIES`.

The picker, store, compare mode, and reroll engine pick it up automatically.

---

## Known limitations (v0)

- Generated branches are composed from deterministic **templates**, so their
  prose is serviceable rather than bespoke — the seeded example branches are the
  hand-authored, polished ones. World-state diffs on generated branches record
  the divergence but don't fully re-derive every downstream fact.
- Layout is a simple lane assignment; many rerolls from nearby nodes can place
  branches close together. There's no automatic collision resolution beyond
  spacing lanes apart.
- Mock data only — there is no model in the loop. The metrics are authored/derived
  estimates, not measurements.

## Stack

Next.js 14 (App Router) · TypeScript (strict) · Tailwind CSS · React Flow
(`@xyflow/react`) · Zustand. No backend.
