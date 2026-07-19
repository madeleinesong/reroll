"use client";

import { useStore } from "@/lib/store";
import { branchOfNode, eventById } from "@/lib/story-utils";
import type { StoryEvent } from "@/lib/types";

/** A labelled section wrapper with a mono micro heading. */
function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6">
      <div className="font-mono uppercase text-micro tracking-wide text-ink-faint">
        {label}
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

/** A single small metric readout: mono label over an editorial value. */
function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono uppercase text-micro tracking-wide text-ink-faint">
        {label}
      </div>
      <div className="mt-0.5 font-mono text-sm text-ink">{value}</div>
    </div>
  );
}

export default function Inspector() {
  const selectedNodeId = useStore((s) => s.selectedNodeId);
  const compareMode = useStore((s) => s.compareMode);
  const rerollEditorOpen = useStore((s) => s.rerollEditorOpen);
  const story = useStore((s) => s.story);
  const selectNode = useStore((s) => s.selectNode);
  const openReroll = useStore((s) => s.openReroll);

  if (!selectedNodeId || compareMode || rerollEditorOpen) return null;

  const event: StoryEvent | undefined = eventById(story, selectedNodeId);
  if (!event) return null;

  const isCanonical = event.canonical;
  const impact = Math.round(event.downstreamImpact);
  const impactPct = Math.max(0, Math.min(100, impact));
  const branchId = branchOfNode(story, event.id);

  const valence = event.emotionalValence;
  const valenceSigned = `${valence >= 0 ? "+" : ""}${valence.toFixed(2)}`;

  return (
    <div className="absolute right-0 top-0 z-20 h-full w-[360px] overflow-y-auto border-l border-paper-line bg-paper-panel p-5 shadow-panel">
      {/* Top row: tag + close */}
      <div className="flex items-center justify-between">
        <span
          className={
            "font-mono uppercase text-micro tracking-wide " +
            (isCanonical ? "text-ink-faint" : "text-accent")
          }
        >
          {isCanonical ? "Canonical" : "Alternate"}
          {!isCanonical && (
            <span className="ml-2 text-ink-faint">{branchId}</span>
          )}
        </span>
        <button
          type="button"
          onClick={() => selectNode(null)}
          aria-label="Close inspector"
          className="flex h-6 w-6 items-center justify-center rounded-sharp border border-paper-line font-mono text-sm text-ink-soft hover:bg-paper-sink"
        >
          ×
        </button>
      </div>

      {/* Title + phase */}
      <h2 className="mt-4 font-editorial text-xl leading-tight text-ink">
        {event.title}
      </h2>
      <div className="mt-1 font-mono text-micro uppercase tracking-wide text-ink-faint">
        {event.phase}
      </div>

      {/* Description */}
      <p className="mt-3 font-editorial text-sm leading-relaxed text-ink-soft">
        {event.description}
      </p>

      {/* Current world state */}
      <Section label="Current World State">
        {event.worldState.length === 0 ? (
          <div className="font-editorial text-sm text-ink-faint">
            No recorded state.
          </div>
        ) : (
          <ul className="space-y-1.5">
            {event.worldState.map((entry) => (
              <li
                key={entry.key}
                className="flex items-baseline justify-between gap-3 border-b border-paper-line pb-1.5 last:border-b-0"
              >
                <span className="font-mono text-micro uppercase tracking-wide text-ink-faint">
                  {entry.key}
                </span>
                <span className="text-right font-sans text-xs text-ink">
                  {entry.value}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      {/* Characters */}
      <Section label="Characters">
        {event.charactersInvolved.length === 0 ? (
          <div className="font-editorial text-sm text-ink-faint">—</div>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {event.charactersInvolved.map((name) => (
              <span
                key={name}
                className="rounded-sharp border border-paper-line bg-paper px-2 py-0.5 font-sans text-xs text-ink-soft"
              >
                {name}
              </span>
            ))}
          </div>
        )}
      </Section>

      {/* Why it matters */}
      <Section label="Why This Event Matters">
        <p className="font-editorial text-sm leading-relaxed text-ink-soft">
          {event.whyItMatters}
        </p>
      </Section>

      {/* Downstream impact */}
      <Section label="Downstream Impact">
        <div className="flex items-baseline gap-1">
          <span className="font-mono text-2xl text-ink">{impact}</span>
          <span className="font-mono text-sm text-ink-faint">/100</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-sharp bg-paper-sink">
          <div
            className="h-full bg-accent"
            style={{ width: `${impactPct}%` }}
          />
        </div>
      </Section>

      {/* Metric row */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        <Metric label="Prob" value={event.probability.toFixed(2)} />
        <Metric label="Valence" value={valenceSigned} />
        <Metric label="Uncert" value={event.uncertainty.toFixed(2)} />
      </div>

      {/* Primary action */}
      <button
        type="button"
        onClick={openReroll}
        className="mt-8 w-full rounded-sharp bg-accent px-4 py-2.5 font-mono text-xs uppercase tracking-wide text-paper hover:bg-accent-deep"
      >
        Reroll from here
      </button>
    </div>
  );
}
