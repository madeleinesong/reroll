"use client";

import { create } from "zustand";
import type { BranchFilter, RerollConfig, Story } from "@/lib/types";
import { stories } from "@/lib/stories";
import { generateBranch } from "@/lib/reroll-engine";

const DEFAULT_STORY_ID = "romeo-and-juliet";

/** Deep clone a story so store mutations never touch the pristine seed data. */
function cloneStory(story: Story): Story {
  return typeof structuredClone === "function"
    ? structuredClone(story)
    : (JSON.parse(JSON.stringify(story)) as Story);
}

/** Largest timeIndex across all events (falls back to 0 for an empty story). */
function computeMaxTimeIndex(story: Story): number {
  return story.events.reduce(
    (max, event) => (event.timeIndex > max ? event.timeIndex : max),
    0,
  );
}

/** Number of non-canonical branches seeded in a story (initial branch order counter). */
function countSeededBranches(story: Story): number {
  return story.branches.filter((branch) => !branch.canonical).length;
}

export interface State {
  story: Story;
  selectedNodeId: string | null;
  branchFilter: BranchFilter;
  scrubIndex: number;
  maxTimeIndex: number;
  compareMode: boolean;
  compareSelection: [string | null, string | null];
  rerollEditorOpen: boolean;
  lastCreatedBranchId: string | null;
  branchOrderCounter: number;

  selectNode: (id: string | null) => void;
  setBranchFilter: (f: BranchFilter) => void;
  setScrubIndex: (n: number) => void;
  resetStory: () => void;
  loadStory: (id: string) => void;
  openReroll: () => void;
  closeReroll: () => void;
  commitReroll: (config: RerollConfig) => void;
  toggleCompareMode: () => void;
  setCompareSlot: (slot: 0 | 1, nodeId: string | null) => void;
}

const initialStory = cloneStory(stories[DEFAULT_STORY_ID]);
const initialMaxTimeIndex = computeMaxTimeIndex(initialStory);

export const useStore = create<State>()((set, get) => ({
  story: initialStory,
  selectedNodeId: null,
  branchFilter: "all",
  scrubIndex: initialMaxTimeIndex,
  maxTimeIndex: initialMaxTimeIndex,
  compareMode: false,
  compareSelection: [null, null],
  rerollEditorOpen: false,
  lastCreatedBranchId: null,
  branchOrderCounter: countSeededBranches(initialStory),

  selectNode: (id) => set({ selectedNodeId: id }),

  setBranchFilter: (f) => set({ branchFilter: f }),

  setScrubIndex: (n) => {
    const { maxTimeIndex } = get();
    const clamped = Math.max(0, Math.min(Math.round(n), maxTimeIndex));
    set({ scrubIndex: clamped });
  },

  resetStory: () => {
    const { story } = get();
    const pristine = cloneStory(stories[story.id] ?? stories[DEFAULT_STORY_ID]);
    const maxTimeIndex = computeMaxTimeIndex(pristine);
    set({
      story: pristine,
      selectedNodeId: null,
      branchFilter: "all",
      scrubIndex: maxTimeIndex,
      maxTimeIndex,
      compareMode: false,
      compareSelection: [null, null],
      rerollEditorOpen: false,
      lastCreatedBranchId: null,
      branchOrderCounter: countSeededBranches(pristine),
    });
  },

  loadStory: (id) => {
    const source = stories[id];
    if (!source) return;
    const pristine = cloneStory(source);
    const maxTimeIndex = computeMaxTimeIndex(pristine);
    set({
      story: pristine,
      selectedNodeId: null,
      branchFilter: "all",
      scrubIndex: maxTimeIndex,
      maxTimeIndex,
      compareMode: false,
      compareSelection: [null, null],
      rerollEditorOpen: false,
      lastCreatedBranchId: null,
      branchOrderCounter: countSeededBranches(pristine),
    });
  },

  openReroll: () => set({ rerollEditorOpen: true }),

  closeReroll: () => set({ rerollEditorOpen: false }),

  commitReroll: (config) => {
    const { story, selectedNodeId, branchOrderCounter } = get();
    if (!selectedNodeId) return;

    const { branch, events } = generateBranch(
      story,
      selectedNodeId,
      config,
      branchOrderCounter,
    );

    const nextStory: Story = {
      ...story,
      branches: [...story.branches, branch],
      events: [...story.events, ...events],
    };

    const maxTimeIndex = computeMaxTimeIndex(nextStory);
    const firstNewEventId = events.length > 0 ? events[0].id : selectedNodeId;

    set({
      story: nextStory,
      branchOrderCounter: branchOrderCounter + 1,
      lastCreatedBranchId: branch.id,
      maxTimeIndex,
      scrubIndex: maxTimeIndex,
      selectedNodeId: firstNewEventId,
      rerollEditorOpen: false,
    });
  },

  toggleCompareMode: () =>
    set((state) => ({ compareMode: !state.compareMode })),

  setCompareSlot: (slot, nodeId) =>
    set((state) => {
      const next: [string | null, string | null] = [
        state.compareSelection[0],
        state.compareSelection[1],
      ];
      next[slot] = nodeId;
      return { compareSelection: next };
    }),
}));
