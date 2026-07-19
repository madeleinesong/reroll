"use client";

import { useState } from "react";
import type { Plausibility } from "@/lib/types";
import { useStore } from "@/lib/store";
import { eventById } from "@/lib/story-utils";
import { suggestPerturbations } from "@/lib/reroll-engine";

const PLAUSIBILITIES: Plausibility[] = ["faithful", "balanced", "wild"];
const MIN_FUTURE = 3;
const MAX_FUTURE = 6;

export default function RerollEditor() {
  const rerollEditorOpen = useStore((s) => s.rerollEditorOpen);
  const selectedNodeId = useStore((s) => s.selectedNodeId);
  const story = useStore((s) => s.story);
  const closeReroll = useStore((s) => s.closeReroll);
  const commitReroll = useStore((s) => s.commitReroll);

  const [premise, setPremise] = useState("");
  const [plausibility, setPlausibility] = useState<Plausibility>("balanced");
  const [preserveCharacterConsistency, setPreserveCharacterConsistency] =
    useState(true);
  const [futureEventCount, setFutureEventCount] = useState(4);

  if (!rerollEditorOpen || !selectedNodeId) return null;

  const source = eventById(story, selectedNodeId);
  if (!source) return null;

  const suggestions = suggestPerturbations(story, selectedNodeId);
  const trimmedPremise = premise.trim();

  const handleGenerate = () => {
    if (!trimmedPremise) return;
    commitReroll({
      premise: trimmedPremise,
      plausibility,
      preserveCharacterConsistency,
      futureEventCount,
    });
  };

  return (
    <div className="absolute right-0 top-0 z-30 flex h-full w-[360px] flex-col border-l border-paper-line bg-paper-panel shadow-panel">
      {/* Header */}
      <div className="border-b border-paper-line p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="font-mono text-micro uppercase tracking-wide text-accent">
            Reroll From
          </div>
          <button
            type="button"
            onClick={closeReroll}
            aria-label="Cancel reroll"
            className="-mr-1 -mt-1 rounded-sharp border border-paper-line px-2 py-0.5 font-mono text-xs text-ink-faint hover:text-ink"
          >
            ×
          </button>
        </div>
        <h2 className="mt-2 font-editorial text-xl leading-tight text-ink">
          {source.title}
        </h2>
        <p className="mt-1 font-mono text-micro uppercase tracking-wide text-ink-faint">
          {source.phase}
        </p>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-5">
        {/* Premise */}
        <label className="block">
          <span className="font-mono text-micro uppercase tracking-wide text-ink-faint">
            Changed Premise
          </span>
          <textarea
            value={premise}
            onChange={(e) => setPremise(e.target.value)}
            rows={3}
            placeholder="mercutio survives the duel"
            className="mt-2 w-full resize-none rounded-sharp border border-paper-line bg-paper px-3 py-2 font-editorial text-sm text-ink placeholder:text-ink-faint focus:border-accent-line focus:outline-none"
          />
        </label>

        {/* Suggested perturbations */}
        <div className="mt-5">
          <span className="font-mono text-micro uppercase tracking-wide text-ink-faint">
            Suggested Perturbations
          </span>
          <div className="mt-2 flex flex-col gap-2">
            {suggestions.map((p, i) => (
              <button
                key={`${p.premise}-${i}`}
                type="button"
                onClick={() => setPremise(p.premise)}
                className="rounded-sharp border border-paper-line bg-paper px-3 py-1.5 text-left font-editorial text-sm text-ink-soft hover:border-accent-line hover:text-ink"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Plausibility */}
        <div className="mt-6">
          <span className="font-mono text-micro uppercase tracking-wide text-ink-faint">
            Plausibility
          </span>
          <div className="mt-2 flex overflow-hidden rounded-sharp border border-paper-line">
            {PLAUSIBILITIES.map((p, i) => {
              const active = plausibility === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlausibility(p)}
                  className={[
                    "flex-1 px-2 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors",
                    i > 0 ? "border-l border-paper-line" : "",
                    active
                      ? "bg-accent text-paper"
                      : "bg-paper text-ink-soft hover:text-ink",
                  ].join(" ")}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        {/* Preserve character consistency */}
        <div className="mt-6 flex items-center justify-between gap-3">
          <span className="font-mono text-micro uppercase tracking-wide text-ink-faint">
            Preserve Character Consistency
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={preserveCharacterConsistency}
            onClick={() =>
              setPreserveCharacterConsistency((v) => !v)
            }
            className={[
              "relative h-5 w-9 shrink-0 rounded-sharp border transition-colors",
              preserveCharacterConsistency
                ? "border-accent-line bg-accent"
                : "border-paper-line bg-paper-sink",
            ].join(" ")}
          >
            <span
              className={[
                "absolute top-0.5 h-3.5 w-3.5 rounded-sharp transition-all",
                preserveCharacterConsistency
                  ? "left-[18px] bg-paper"
                  : "left-0.5 bg-ink-faint",
              ].join(" ")}
            />
          </button>
        </div>

        {/* Future events */}
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <span className="font-mono text-micro uppercase tracking-wide text-ink-faint">
              Future Events
            </span>
            <span className="font-mono text-sm text-ink">{futureEventCount}</span>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <button
              type="button"
              aria-label="Fewer future events"
              onClick={() =>
                setFutureEventCount((c) => Math.max(MIN_FUTURE, c - 1))
              }
              disabled={futureEventCount <= MIN_FUTURE}
              className="rounded-sharp border border-paper-line px-2.5 py-0.5 font-mono text-sm text-ink-soft hover:text-ink disabled:opacity-40"
            >
              −
            </button>
            <input
              type="range"
              min={MIN_FUTURE}
              max={MAX_FUTURE}
              step={1}
              value={futureEventCount}
              onChange={(e) => setFutureEventCount(Number(e.target.value))}
              className="flex-1 accent-accent"
            />
            <button
              type="button"
              aria-label="More future events"
              onClick={() =>
                setFutureEventCount((c) => Math.min(MAX_FUTURE, c + 1))
              }
              disabled={futureEventCount >= MAX_FUTURE}
              className="rounded-sharp border border-paper-line px-2.5 py-0.5 font-mono text-sm text-ink-soft hover:text-ink disabled:opacity-40"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex gap-2 border-t border-paper-line p-5">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={!trimmedPremise}
          className="flex-1 rounded-sharp bg-accent px-4 py-2 font-mono text-xs uppercase tracking-wide text-paper transition-opacity hover:bg-accent-deep disabled:cursor-not-allowed disabled:opacity-40"
        >
          Generate Branch
        </button>
        <button
          type="button"
          onClick={closeReroll}
          className="rounded-sharp border border-paper-line px-4 py-2 font-mono text-xs uppercase tracking-wide text-ink-soft hover:text-ink"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
