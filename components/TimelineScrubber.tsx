"use client";

import { useMemo } from "react";
import type { BranchFilter } from "@/lib/types";
import { useStore } from "@/lib/store";

const FILTERS: { value: BranchFilter; label: string }[] = [
  { value: "all", label: "all" },
  { value: "canonical", label: "canonical" },
  { value: "selected", label: "selected" },
];

export default function TimelineScrubber() {
  const story = useStore((s) => s.story);
  const scrubIndex = useStore((s) => s.scrubIndex);
  const maxTimeIndex = useStore((s) => s.maxTimeIndex);
  const branchFilter = useStore((s) => s.branchFilter);
  const setScrubIndex = useStore((s) => s.setScrubIndex);
  const setBranchFilter = useStore((s) => s.setBranchFilter);

  // Phase label: the canonical event sitting at the current scrub position.
  const currentPhase = useMemo(() => {
    const atIndex = story.events.find(
      (e) => e.canonical && e.timeIndex === scrubIndex,
    );
    if (atIndex) return atIndex.phase;
    // Fall back to the nearest earlier canonical beat so the label is never empty.
    const earlier = story.events
      .filter((e) => e.canonical && e.timeIndex <= scrubIndex)
      .sort((a, b) => b.timeIndex - a.timeIndex)[0];
    return earlier ? earlier.phase : "—";
  }, [story.events, scrubIndex]);

  const eventCount = story.events.length;
  const branchCount = story.branches.length;

  return (
    <div className="flex items-center gap-4 border-t border-paper-line bg-paper-panel px-4 py-2">
      {/* Scrubber */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="shrink-0 font-mono text-micro uppercase tracking-wide text-ink-faint">
          time
        </span>
        <input
          type="range"
          min={0}
          max={maxTimeIndex}
          step={1}
          value={scrubIndex}
          onChange={(e) => setScrubIndex(Number(e.target.value))}
          title="Drag to scrub through story time. Events after this point are muted."
          aria-label="Story timeline position"
          className="reroll-scrub h-1 w-full max-w-[320px] cursor-pointer appearance-none rounded-sharp bg-paper-sink accent-accent"
        />
        <span className="shrink-0 font-mono text-xs text-ink-soft">
          t{scrubIndex}
          <span className="text-ink-faint">/{maxTimeIndex}</span>
        </span>
        <span
          className="min-w-0 shrink truncate font-mono text-micro uppercase tracking-wide text-ink-faint"
          title="Current phase at the scrub position"
        >
          {currentPhase}
        </span>
      </div>

      {/* Counts */}
      <span className="hidden shrink-0 font-mono text-micro uppercase tracking-wide text-ink-faint sm:inline">
        {eventCount} events · {branchCount} branches
      </span>

      {/* Branch filter */}
      <div
        className="flex shrink-0 items-center overflow-hidden rounded-sharp border border-paper-line"
        title="Filter which branches are highlighted in the graph"
      >
        {FILTERS.map((f) => {
          const active = branchFilter === f.value;
          return (
            <button
              key={f.value}
              type="button"
              onClick={() => setBranchFilter(f.value)}
              aria-pressed={active}
              className={[
                "border-l border-paper-line px-3 py-1 font-mono text-micro uppercase tracking-wide transition-colors first:border-l-0",
                active
                  ? "bg-accent text-paper"
                  : "bg-paper-panel text-ink-soft hover:bg-paper-sink",
              ].join(" ")}
            >
              {f.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
