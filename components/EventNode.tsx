"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { StoryEvent } from "@/lib/types";
import { useStore } from "@/lib/store";

/**
 * Custom React Flow node rendering a single StoryEvent.
 *
 * Live UI state is read from the store so nodes react to selection, the
 * timeline scrubber and the branch filter without React Flow re-instantiating
 * the node type. Encoding rules follow the EventNode contract:
 *  - size scales gently with downstreamImpact
 *  - opacity drops with uncertainty, muting (after scrub point) and filtering
 *  - canonical nodes read stronger than alternate (dashed) nodes
 *  - emotional valence appears ONLY as a small top-right badge
 */
export default function EventNode({ data }: NodeProps) {
  const event = data.event as StoryEvent;

  const selectedNodeId = useStore((s) => s.selectedNodeId);
  const scrubIndex = useStore((s) => s.scrubIndex);
  const branchFilter = useStore((s) => s.branchFilter);
  const lastCreatedBranchId = useStore((s) => s.lastCreatedBranchId);
  const selectedBranchId = useStore((s) =>
    s.selectedNodeId
      ? s.story.events.find((e) => e.id === s.selectedNodeId)?.branchId ?? null
      : null,
  );

  const selected = selectedNodeId === event.id;
  const muted = event.timeIndex > scrubIndex;

  // Branch-filter visibility (mirrors Graph's dimming logic).
  let filteredOut = false;
  if (branchFilter === "canonical") {
    filteredOut = !event.canonical;
  } else if (branchFilter === "selected") {
    filteredOut = !event.canonical && event.branchId !== selectedBranchId;
  }

  // Size scales gently with downstream impact (0.9 .. 1.12).
  const impact = clamp01(event.downstreamImpact / 100);
  const scale = 0.9 + impact * 0.22;

  // Opacity: uncertainty knocks it down, muting/filtering knock it further.
  let opacity = 1 - clamp01(event.uncertainty) * 0.5;
  if (filteredOut) {
    opacity = Math.min(opacity, 0.25);
  } else if (muted) {
    opacity = Math.min(opacity, 0.4);
  }

  const canonical = event.canonical;
  const isEntering = event.branchId === lastCreatedBranchId;

  const valenceBadge = renderValenceBadge(event.emotionalValence);

  const containerClass = [
    "reroll-node",
    isEntering ? "reroll-node--enter" : "",
    "relative flex h-full w-full flex-col justify-between rounded-sharp px-3 py-2",
    "transition-[opacity,box-shadow] duration-200",
    canonical
      ? "border-2 border-ink bg-paper-panel shadow-node"
      : "border border-dashed border-accent-line bg-paper",
    selected ? "ring-2 ring-accent" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={containerClass}
      style={{
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: "center",
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!h-2 !w-2 !border !border-paper-line !bg-paper-sink"
      />

      {/* Header: phase + valence badge */}
      <div className="flex items-start justify-between gap-2">
        <span className="font-mono text-micro uppercase tracking-wide text-ink-faint">
          {event.phase}
        </span>
        {valenceBadge}
      </div>

      {/* Title */}
      <h3 className="line-clamp-2 font-editorial text-sm leading-tight text-ink">
        {event.title}
      </h3>

      {/* Metric chips */}
      <div className="flex items-center justify-between gap-2 font-mono text-micro text-ink-soft">
        <span className="rounded-sharp bg-paper-sink px-1.5 py-0.5">
          P {event.probability.toFixed(2)}
        </span>
        <span className="flex items-center gap-1">
          <span className="text-ink-faint">IMP</span>
          <span className="h-1 w-8 overflow-hidden rounded-sharp bg-paper-sink">
            <span
              className="block h-full bg-accent"
              style={{ width: `${Math.round(impact * 100)}%` }}
            />
          </span>
          <span>{Math.round(event.downstreamImpact)}</span>
        </span>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!h-2 !w-2 !border !border-paper-line !bg-paper-sink"
      />
    </div>
  );
}

/** Clamp a number into the 0..1 range. */
function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

/**
 * Emotional valence rendered as a small top-right badge only — never as a
 * whole-node recolor.
 *  - positive (> 0.15)  => filled accent dot
 *  - neutral            => faint filled dot
 *  - negative (< -0.15) => hollow dark ring
 */
function renderValenceBadge(valence: number) {
  if (valence > 0.15) {
    return (
      <span
        className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-accent"
        title={`valence ${valence.toFixed(2)}`}
        aria-hidden
      />
    );
  }
  if (valence < -0.15) {
    return (
      <span
        className="mt-0.5 h-2 w-2 shrink-0 rounded-full border border-ink bg-transparent"
        title={`valence ${valence.toFixed(2)}`}
        aria-hidden
      />
    );
  }
  return (
    <span
      className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-ink-faint"
      title={`valence ${valence.toFixed(2)}`}
      aria-hidden
    />
  );
}
