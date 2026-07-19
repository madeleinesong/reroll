// ---------------------------------------------------------------------------
// reroll — domain model
//
// A story is a directed graph of causally-linked events. One canonical path
// runs through the graph; alternate branches fork off it (or off each other)
// as counterfactual simulations rooted at a single changed premise.
// ---------------------------------------------------------------------------

export type Plausibility = "faithful" | "balanced" | "wild";

/** A single fact about the world, tracked across events as a compact diff. */
export interface WorldStateEntry {
  key: string;
  value: string;
}

/** How one event changes the world relative to its parent. */
export interface WorldStateDiff {
  added?: WorldStateEntry[];
  changed?: WorldStateEntry[];
  removed?: string[];
}

export interface StoryEvent {
  id: string;
  title: string;
  description: string;
  /** Human-readable story phase, e.g. "Act I · Scene 1". Drives left→right order. */
  phase: string;
  /** Monotonic ordering key used for x-position on the canvas. */
  timeIndex: number;

  parentId: string | null;
  branchId: string;
  canonical: boolean;

  // Simulation metrics -------------------------------------------------------
  /** Likelihood of this event given its parent, 0..1. Drives edge thickness. */
  probability: number;
  /** Emotional valence, -1 (tragic) .. +1 (hopeful). Subtle badge only. */
  emotionalValence: number;
  /** Model uncertainty, 0 (certain) .. 1 (speculative). Lowers node opacity. */
  uncertainty: number;
  /** Downstream causal leverage, 0..100. Loosely drives node size. */
  downstreamImpact: number;

  // Inspector detail ---------------------------------------------------------
  charactersInvolved: string[];
  whyItMatters: string;
  /** Full readable world state at this event (for the inspector). */
  worldState: WorldStateEntry[];
  /** Compact diff vs. parent (for the node + graph reasoning). */
  worldStateDiff: WorldStateDiff;

  /** Terminal = a story ending. Used by compare mode. */
  terminal?: boolean;

  /** Optional per-event suggested perturbations (self-contained stories). */
  perturbations?: Perturbation[];
}

export interface Branch {
  id: string;
  label: string;
  canonical: boolean;
  /** Node the branch forked from (null for the canonical spine). */
  sourceNodeId: string | null;
  /** The premise that was changed to create this branch. */
  premise: string;
  plausibility: Plausibility;
  /** Vertical lane offset. 0 = canonical center; ± lanes stack above/below. */
  lane: number;
  createdOrder: number;
}

export interface Story {
  id: string;
  title: string;
  author: string;
  blurb: string;
  events: StoryEvent[];
  branches: Branch[];
}

/** A suggested one-line perturbation offered on a given node. */
export interface Perturbation {
  label: string;
  premise: string;
}

export interface RerollConfig {
  premise: string;
  plausibility: Plausibility;
  preserveCharacterConsistency: boolean;
  futureEventCount: number; // 3..6
}

export type BranchFilter = "all" | "canonical" | "selected";
