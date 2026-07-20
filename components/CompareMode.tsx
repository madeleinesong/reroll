"use client";

// ---------------------------------------------------------------------------
// CompareMode — side-by-side comparison of two story endings.
//
// The reader picks two terminal nodes; we lay their outcomes out across a
// fixed set of comparison rows: the ending itself, per-character fates,
// world-state divergences, distance from canon, the emotional arc, and an
// overall plausibility read (product of edge probabilities along the path).
// ---------------------------------------------------------------------------

import { useStore } from "@/lib/store";
import {
  canonDistance,
  eventById,
  pathTo,
  terminalNodes,
} from "@/lib/story-utils";
import type { StoryEvent, Story, WorldStateEntry } from "@/lib/types";

/** Overall plausibility = product of every edge probability along the path. */
function pathProbability(story: Story, nodeId: string): number {
  const path = pathTo(story, nodeId);
  return path.reduce((acc, e) => acc * e.probability, 1);
}

/**
 * The principal characters to report outcomes for — derived from the story
 * itself (never hardcoded), so this works for any story. Ranks characters by how
 * often they appear across the two compared paths and keeps the top few.
 */
function principalCharacters(
  story: Story,
  leftId: string,
  rightId: string,
): string[] {
  const counts = new Map<string, number>();
  for (const id of [leftId, rightId]) {
    for (const event of pathTo(story, id)) {
      for (const name of event.charactersInvolved) {
        counts.set(name, (counts.get(name) ?? 0) + 1);
      }
    }
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 6)
    .map(([name]) => name);
}

const DEAD_WORDS = ["dead", "dies", "died", "killed", "slain", "lost", "drown", "perish", "executed", "murdered"];
const ALIVE_WORDS = ["alive", "survive", "living", "lives", "saved", "rescued", "spared", "endure"];

/** Map a cumulative path probability to a coarse plausibility label. */
function plausibilityLabel(p: number): { label: string; alt: boolean } {
  if (p >= 0.15) return { label: "faithful", alt: false };
  if (p >= 0.03) return { label: "plausible", alt: false };
  return { label: "tenuous", alt: true };
}

/** Scan a final world state for each named character's fate. */
function characterFates(
  worldState: WorldStateEntry[],
  names: string[],
): { name: string; fate: string }[] {
  return names.map((name) => {
    const needle = name.toLowerCase();
    const hit = worldState.find(
      (entry) =>
        entry.key.toLowerCase().includes(needle) ||
        entry.value.toLowerCase().includes(needle),
    );
    let fate = "unresolved";
    if (hit) {
      const hay = (hit.key + " " + hit.value).toLowerCase();
      if (DEAD_WORDS.some((w) => hay.includes(w))) fate = "dead";
      else if (ALIVE_WORDS.some((w) => hay.includes(w))) fate = "alive";
    }
    return { name, fate };
  });
}

/** Keys whose values differ (or are absent) between two final world states. */
function worldStateDifferences(
  a: WorldStateEntry[],
  b: WorldStateEntry[],
): { key: string; left: string; right: string }[] {
  const mapA = new Map(a.map((e) => [e.key, e.value]));
  const mapB = new Map(b.map((e) => [e.key, e.value]));
  const keys = Array.from(new Set([...mapA.keys(), ...mapB.keys()])).sort();
  const out: { key: string; left: string; right: string }[] = [];
  for (const key of keys) {
    const left = mapA.get(key) ?? "—";
    const right = mapB.get(key) ?? "—";
    if (left !== right) out.push({ key, left, right });
  }
  return out;
}

// --- Story Shape (after Kurt Vonnegut) -------------------------------------
//
// Vonnegut's "shapes of stories": fortune on the vertical axis (Good Fortune
// up, Ill Fortune down), time on the horizontal (Beginning -> Ending). We plot
// each compared ending as a fortune curve using per-event `emotionalValence`.
// The two paths share a past, so the common prefix is drawn once in grey and
// each ending's divergent tail in its own line — the fork is where the
// counterfactual departs from what actually happened.

const SLOT_STYLE = [
  { stroke: "#234f3b", dash: undefined, label: "solid" }, // accent.deep
  { stroke: "#1a1917", dash: "5 4", label: "dashed" }, // ink
] as const;

interface Pt {
  x: number;
  y: number;
}

/** Catmull-Rom -> cubic-bezier smoothing for an organic story curve. */
function smoothPath(pts: Pt[]): string {
  if (pts.length === 0) return "";
  if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d +=
      ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ` +
      `${c2x.toFixed(1)} ${c2y.toFixed(1)}, ` +
      `${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

/** The index of the last event two root->node paths still share. */
function forkIndex(a: StoryEvent[], b: StoryEvent[]): number {
  let i = 0;
  while (i < a.length && i < b.length && a[i].id === b[i].id) i++;
  return i - 1; // last shared index (>= 0 since both share the root)
}

/**
 * The Vonnegut fortune chart for two endings, drawn on one shared axis.
 * Full-width; the divergent tails carry each ending's identity.
 */
function StoryShape({
  story,
  left,
  right,
}: {
  story: Story;
  left: StoryEvent;
  right: StoryEvent;
}) {
  const leftPath = pathTo(story, left.id);
  const rightPath = pathTo(story, right.id);

  const W = 780;
  const H = 340;
  const padL = 96;
  const padR = 28;
  const padT = 30;
  const padB = 44;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  // x-domain over every event's timeIndex on either path.
  const times = [...leftPath, ...rightPath].map((e) => e.timeIndex);
  const tMin = Math.min(...times);
  const tMax = Math.max(...times);
  const x = (t: number) =>
    tMax === tMin ? padL + plotW / 2 : padL + ((t - tMin) / (tMax - tMin)) * plotW;
  // y-domain: valence +1 (good) at top, -1 (ill) at bottom.
  const y = (v: number) => padT + (1 - (v + 1) / 2) * plotH;
  const toPts = (path: StoryEvent[]): Pt[] =>
    path.map((e) => ({ x: x(e.timeIndex), y: y(e.emotionalValence) }));

  const fork = forkIndex(leftPath, rightPath);
  const shared = leftPath.slice(0, fork + 1);
  // Tails include the fork event so each curve visibly continues from it.
  const leftTail = leftPath.slice(fork);
  const rightTail = rightPath.slice(fork);
  const forkEvent = leftPath[fork];

  const baseline = y(0);
  const forkX = x(forkEvent.timeIndex);

  const leftEnd = { x: x(left.timeIndex), y: y(left.emotionalValence) };
  const rightEnd = { x: x(right.timeIndex), y: y(right.emotionalValence) };

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      role="img"
      aria-label="Story-shape chart: fortune over time for the two chosen endings"
    >
      {/* Fortune axis labels (Vonnegut's G / I) */}
      <text x={padL - 12} y={padT + 4} textAnchor="end" className="fill-ink-faint font-mono" fontSize="10" letterSpacing="0.06em">
        GOOD
      </text>
      <text x={padL - 12} y={padT + 16} textAnchor="end" className="fill-ink-faint font-mono" fontSize="10" letterSpacing="0.06em">
        FORTUNE
      </text>
      <text x={padL - 12} y={H - padB - 10} textAnchor="end" className="fill-ink-faint font-mono" fontSize="10" letterSpacing="0.06em">
        ILL
      </text>
      <text x={padL - 12} y={H - padB + 2} textAnchor="end" className="fill-ink-faint font-mono" fontSize="10" letterSpacing="0.06em">
        FORTUNE
      </text>

      {/* Frame: fortune=0 baseline + faint plot border */}
      <line x1={padL} x2={W - padR} y1={baseline} y2={baseline} stroke="#d9d5cb" strokeWidth={1} />
      <line x1={padL} x2={padL} y1={padT} y2={H - padB} stroke="#e7e4dc" strokeWidth={1} />

      {/* Time axis (Beginning -> Ending) */}
      <text x={padL} y={H - padB + 22} textAnchor="start" className="fill-ink-faint font-mono" fontSize="10" letterSpacing="0.06em">
        BEGINNING
      </text>
      <text x={W - padR} y={H - padB + 22} textAnchor="end" className="fill-ink-faint font-mono" fontSize="10" letterSpacing="0.06em">
        ENDING
      </text>

      {/* Divergence marker */}
      {fork < leftPath.length - 1 || fork < rightPath.length - 1 ? (
        <>
          <line
            x1={forkX}
            x2={forkX}
            y1={padT - 6}
            y2={H - padB}
            stroke="#c9c4b8"
            strokeWidth={1}
            strokeDasharray="2 3"
          />
          <text x={forkX + 4} y={padT - 10} textAnchor="middle" className="fill-ink-faint font-mono" fontSize="9" letterSpacing="0.08em">
            DIVERGENCE
          </text>
        </>
      ) : null}

      {/* Shared past — drawn once, neutral */}
      {shared.length > 1 ? (
        <path d={smoothPath(toPts(shared))} fill="none" stroke="#8a857b" strokeWidth={2} strokeLinecap="round" />
      ) : null}

      {/* Divergent tails, one per ending */}
      <path
        d={smoothPath(toPts(rightTail))}
        fill="none"
        stroke={SLOT_STYLE[1].stroke}
        strokeWidth={2}
        strokeDasharray={SLOT_STYLE[1].dash}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={smoothPath(toPts(leftTail))}
        fill="none"
        stroke={SLOT_STYLE[0].stroke}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Fork dot */}
      <circle cx={forkX} cy={y(forkEvent.emotionalValence)} r={3} fill="#8a857b" />

      {/* Endpoints */}
      <circle cx={rightEnd.x} cy={rightEnd.y} r={4.5} fill="#f7f6f2" stroke={SLOT_STYLE[1].stroke} strokeWidth={2} />
      <circle cx={leftEnd.x} cy={leftEnd.y} r={4.5} fill={SLOT_STYLE[0].stroke} />
    </svg>
  );
}

/** One ending's line in the story-shape legend: swatch, title, fortune, fates. */
function ShapeLegendRow({
  story,
  node,
  slot,
  names,
}: {
  story: Story;
  node: StoryEvent;
  slot: 0 | 1;
  names: string[];
}) {
  const style = SLOT_STYLE[slot];
  const fates = characterFates(node.worldState, names).filter(
    (f) => f.fate !== "unresolved",
  );
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <svg width={26} height={8} aria-hidden className="shrink-0">
          <line
            x1={0}
            x2={26}
            y1={4}
            y2={4}
            stroke={style.stroke}
            strokeWidth={slot === 0 ? 2.4 : 2}
            strokeDasharray={style.dash}
          />
        </svg>
        <span className="font-editorial text-sm text-ink leading-tight">
          {node.title}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pl-9">
        <span className="font-mono text-micro uppercase tracking-wide text-ink-faint">
          fortune {node.emotionalValence >= 0 ? "+" : ""}
          {node.emotionalValence.toFixed(2)}
        </span>
        {fates.length > 0 ? (
          fates.map((f) => (
            <span
              key={f.name}
              className={
                "font-mono text-micro " +
                (f.fate === "dead" ? "text-ink-faint" : "text-accent")
              }
            >
              {f.name} {f.fate === "dead" ? "†" : "lives"}
            </span>
          ))
        ) : (
          <span className="font-mono text-micro text-ink-faint">
            no explicit fates
          </span>
        )}
      </div>
    </div>
  );
}

/** Left-hand row label. */
function RowLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono uppercase text-micro tracking-wide text-ink-faint pt-1">
      {children}
    </div>
  );
}

export default function CompareMode() {
  const compareMode = useStore((s) => s.compareMode);
  const story = useStore((s) => s.story);
  const compareSelection = useStore((s) => s.compareSelection);
  const setCompareSlot = useStore((s) => s.setCompareSlot);
  const toggleCompareMode = useStore((s) => s.toggleCompareMode);

  if (!compareMode) return null;

  const endings = terminalNodes(story);
  const leftId = compareSelection[0];
  const rightId = compareSelection[1];
  const left = leftId ? eventById(story, leftId) : undefined;
  const right = rightId ? eventById(story, rightId) : undefined;

  const diffs =
    left && right
      ? worldStateDifferences(left.worldState, right.worldState)
      : [];

  const characterNames =
    left && right ? principalCharacters(story, left.id, right.id) : [];

  const selectClass =
    "w-full rounded-sharp border border-paper-line bg-paper px-2 py-1.5 " +
    "font-mono text-xs text-ink focus:border-accent-line focus:outline-none";

  return (
    <div className="absolute inset-0 z-30 overflow-auto bg-paper p-8">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="font-mono uppercase text-micro tracking-wide text-ink-faint">
            Compare Endings
          </div>
          <h2 className="mt-1 font-editorial text-2xl text-ink">
            Two counterfactual outcomes, side by side
          </h2>
        </div>
        <button
          type="button"
          onClick={toggleCompareMode}
          className="rounded-sharp border border-paper-line px-3 py-1 font-mono text-xs uppercase tracking-wide text-ink hover:bg-paper-sink"
        >
          back to graph
        </button>
      </div>

      {/* Selectors */}
      <div className="mb-8 grid grid-cols-[180px_1fr_1fr] gap-4">
        <div />
        {[0, 1].map((slot) => {
          const value = compareSelection[slot] ?? "";
          return (
            <select
              key={slot}
              value={value}
              onChange={(e) =>
                setCompareSlot(slot as 0 | 1, e.target.value || null)
              }
              className={selectClass}
            >
              <option value="">Select an ending…</option>
              {endings.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.title} ({ev.branchId})
                </option>
              ))}
            </select>
          );
        })}
      </div>

      {/* Body */}
      {!left || !right ? (
        <div className="border border-dashed border-paper-line bg-paper-panel p-10 text-center">
          <p className="font-editorial text-sm text-ink-soft">
            Choose two endings above to compare their character fates, world
            state, distance from canon, and plausibility.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Aligned rows: label | left value | right value */}
          <div className="grid grid-cols-[180px_1fr_1fr] gap-4">
            <div />
            <div>
              <span className="font-mono text-micro uppercase tracking-wide text-accent">
                {left.branchId === "canonical" ? "canonical" : "alternate"}
              </span>
            </div>
            <div>
              <span className="font-mono text-micro uppercase tracking-wide text-accent">
                {right.branchId === "canonical" ? "canonical" : "alternate"}
              </span>
            </div>
          </div>

          {/* Each comparison section is a labelled row spanning both columns. */}
          <ComparisonRow label="Ending" story={story} left={left} right={right} render="ending" />

          {/* Story shape (Vonnegut): fortune-over-time, both endings on one axis. */}
          <div className="grid grid-cols-[180px_1fr] gap-4 border-t border-paper-line pt-6">
            <RowLabel>Story Shape</RowLabel>
            <div>
              <p className="mb-3 max-w-prose font-editorial text-sm text-ink-soft leading-relaxed">
                After Kurt Vonnegut&rsquo;s shapes of stories: fortune rises and
                falls over time. The two endings share a past (grey), then fork
                at the divergence — where each line <em>ends</em> is its outcome.
              </p>
              <StoryShape story={story} left={left} right={right} />
              <div className="mt-3 grid grid-cols-1 gap-4 border-t border-paper-line pt-3 sm:grid-cols-2">
                <ShapeLegendRow story={story} node={left} slot={0} names={characterNames} />
                <ShapeLegendRow story={story} node={right} slot={1} names={characterNames} />
              </div>
            </div>
          </div>

          {/* World-state differences: full-width shared table. */}
          <div className="grid grid-cols-[180px_1fr] gap-4 border-t border-paper-line pt-6">
            <RowLabel>Major World-State Differences</RowLabel>
            <div>
              {diffs.length === 0 ? (
                <p className="font-editorial text-sm text-ink-faint">
                  No differing world-state keys between these endings.
                </p>
              ) : (
                <div className="space-y-2">
                  {diffs.map((d) => (
                    <div
                      key={d.key}
                      className="grid grid-cols-[1fr_1fr] gap-4 border-b border-paper-line pb-2"
                    >
                      <div className="col-span-2 font-mono text-micro uppercase tracking-wide text-ink-faint">
                        {d.key}
                      </div>
                      <div className="font-editorial text-sm text-ink-soft">
                        {d.left}
                      </div>
                      <div className="font-editorial text-sm text-ink-soft">
                        {d.right}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <ComparisonRow label="Canon Distance" story={story} left={left} right={right} render="distance" />
          <ComparisonRow label="Plausibility" story={story} left={left} right={right} render="plausibility" />
        </div>
      )}
    </div>
  );
}

type RenderKind = "ending" | "distance" | "plausibility";

/**
 * One aligned comparison row: a mono label on the left, then a rendered cell
 * for each of the two chosen endings.
 */
function ComparisonRow({
  label,
  story,
  left,
  right,
  render,
}: {
  label: string;
  story: Story;
  left: StoryEvent;
  right: StoryEvent;
  render: RenderKind;
}) {
  return (
    <div className="grid grid-cols-[180px_1fr_1fr] gap-4 border-t border-paper-line pt-6">
      <RowLabel>{label}</RowLabel>
      <Cell story={story} node={left} render={render} />
      <Cell story={story} node={right} render={render} />
    </div>
  );
}

function Cell({
  story,
  node,
  render,
}: {
  story: Story;
  node: StoryEvent;
  render: RenderKind;
}) {
  if (render === "ending") {
    return (
      <div>
        <h3 className="font-editorial text-lg text-ink leading-tight">
          {node.title}
        </h3>
        <p className="mt-1 font-editorial text-sm text-ink-soft leading-relaxed">
          {node.description}
        </p>
      </div>
    );
  }

  if (render === "distance") {
    const dist = canonDistance(story, node.id);
    const pathLen = Math.max(1, pathTo(story, node.id).length - 1);
    const distPct = Math.min(100, Math.round((dist / pathLen) * 100));
    return (
      <div>
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-2xl text-ink">{dist}</span>
          <span className="font-mono text-micro uppercase tracking-wide text-ink-faint">
            non-canonical steps
          </span>
        </div>
        <div className="mt-1 h-1 w-full bg-paper-sink">
          <div className="h-full bg-accent" style={{ width: `${distPct}%` }} />
        </div>
      </div>
    );
  }

  // plausibility
  const prob = pathProbability(story, node.id);
  const plaus = plausibilityLabel(prob);
  return (
    <div className="flex items-baseline gap-2">
      <span
        className={
          "font-mono text-sm uppercase tracking-wide " +
          (plaus.alt ? "text-accent" : "text-ink")
        }
      >
        {plaus.label}
      </span>
      <span className="font-mono text-micro text-ink-faint">
        P {prob.toFixed(3)}
      </span>
    </div>
  );
}
