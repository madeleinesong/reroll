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
  emotionalTrajectory,
  eventById,
  pathTo,
  terminalNodes,
} from "@/lib/story-utils";
import type { StoryEvent, Story, WorldStateEntry } from "@/lib/types";

const CHARACTERS = ["Romeo", "Juliet", "Mercutio", "Tybalt"] as const;

/** Overall plausibility = product of every edge probability along the path. */
function pathProbability(story: Story, nodeId: string): number {
  const path = pathTo(story, nodeId);
  return path.reduce((acc, e) => acc * e.probability, 1);
}

/** Map a cumulative path probability to a coarse plausibility label. */
function plausibilityLabel(p: number): { label: string; alt: boolean } {
  if (p >= 0.15) return { label: "faithful", alt: false };
  if (p >= 0.03) return { label: "plausible", alt: false };
  return { label: "tenuous", alt: true };
}

/** Scan a final world state for each principal character's fate. */
function characterFates(
  worldState: WorldStateEntry[],
): { name: string; fate: string }[] {
  return CHARACTERS.map((name) => {
    const hit = worldState.find(
      (entry) =>
        entry.key.toLowerCase().includes(name.toLowerCase()) ||
        entry.value.toLowerCase().includes(name.toLowerCase()),
    );
    let fate = "unresolved";
    if (hit) {
      const hay = (hit.key + " " + hit.value).toLowerCase();
      if (hay.includes("dead") || hay.includes("dies") || hay.includes("killed")) {
        fate = "dead";
      } else if (hay.includes("alive") || hay.includes("survives") || hay.includes("living")) {
        fate = "alive";
      } else {
        fate = hit.value;
      }
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

/** Inline sparkline of an emotional trajectory across -1..1. */
function Sparkline({ values }: { values: number[] }) {
  const w = 132;
  const h = 34;
  const pad = 3;
  if (values.length === 0) {
    return <span className="font-mono text-micro text-ink-faint">no data</span>;
  }
  const n = values.length;
  const x = (i: number) =>
    n === 1 ? w / 2 : pad + (i / (n - 1)) * (w - pad * 2);
  const y = (v: number) => {
    const t = (v + 1) / 2; // -1..1 -> 0..1
    return h - pad - t * (h - pad * 2);
  };
  const points = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`);
  const mid = h / 2;
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className="overflow-visible"
      aria-hidden
    >
      <line
        x1={0}
        x2={w}
        y1={mid}
        y2={mid}
        stroke="#e7e4dc"
        strokeWidth={1}
      />
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke="#234f3b"
        strokeWidth={1.5}
      />
      {values.map((v, i) => (
        <circle
          key={i}
          cx={x(i)}
          cy={y(v)}
          r={1.8}
          fill={v >= 0 ? "#2f6b4f" : "#7c7469"}
        />
      ))}
    </svg>
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
          <ComparisonRow label="Character Outcomes" story={story} left={left} right={right} render="fates" />

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
          <ComparisonRow label="Emotional Trajectory" story={story} left={left} right={right} render="trajectory" />
          <ComparisonRow label="Plausibility" story={story} left={left} right={right} render="plausibility" />
        </div>
      )}
    </div>
  );
}

type RenderKind =
  | "ending"
  | "fates"
  | "distance"
  | "trajectory"
  | "plausibility";

/**
 * One aligned comparison row: a mono label on the left, then a rendered cell
 * for each of the two chosen endings. Reuses EndingColumn's sub-renderers by
 * slicing the same logic per `render` kind.
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

  if (render === "fates") {
    const fates = characterFates(node.worldState);
    return (
      <ul className="space-y-1">
        {fates.map((f) => (
          <li
            key={f.name}
            className="flex items-baseline justify-between border-b border-paper-line pb-1"
          >
            <span className="font-editorial text-sm text-ink">{f.name}</span>
            <span
              className={
                "font-mono text-micro uppercase tracking-wide " +
                (f.fate === "dead"
                  ? "text-ink"
                  : f.fate === "alive"
                    ? "text-accent"
                    : "text-ink-faint")
              }
            >
              {f.fate}
            </span>
          </li>
        ))}
      </ul>
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

  if (render === "trajectory") {
    return <Sparkline values={emotionalTrajectory(story, node.id)} />;
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
