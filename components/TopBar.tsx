"use client";

import { useStore } from "@/lib/store";
import { storyList } from "@/lib/stories";

export default function TopBar() {
  const story = useStore((s) => s.story);
  const compareMode = useStore((s) => s.compareMode);
  const loadStory = useStore((s) => s.loadStory);
  const toggleCompareMode = useStore((s) => s.toggleCompareMode);
  const resetStory = useStore((s) => s.resetStory);

  return (
    <header className="flex h-12 items-center gap-4 border-b border-paper-line bg-paper-panel px-4">
      <div className="flex items-baseline gap-2">
        <span className="font-editorial lowercase text-lg text-ink">reroll</span>
        <span className="font-mono text-micro text-ink-faint">
          · counterfactual story explorer
        </span>
      </div>

      <label className="flex items-center gap-2">
        <span className="sr-only">Story</span>
        <select
          value={story.id}
          onChange={(e) => loadStory(e.target.value)}
          className="rounded-sharp border border-paper-line bg-paper px-2 py-1 font-mono text-xs text-ink focus:border-accent-line focus:outline-none"
        >
          {storyList.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title} — {s.author}
            </option>
          ))}
        </select>
      </label>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={toggleCompareMode}
          aria-pressed={compareMode}
          className={
            "rounded-sharp border px-3 py-1 font-mono text-xs uppercase tracking-wide transition-colors " +
            (compareMode
              ? "border-accent-line bg-accent text-paper"
              : "border-paper-line text-ink hover:bg-paper-sink")
          }
        >
          compare
        </button>
        <button
          type="button"
          onClick={resetStory}
          className="rounded-sharp border border-paper-line px-3 py-1 font-mono text-xs uppercase tracking-wide text-ink hover:bg-paper-sink"
        >
          reset
        </button>
      </div>
    </header>
  );
}
