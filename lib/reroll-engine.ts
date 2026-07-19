// ---------------------------------------------------------------------------
// reroll — deterministic perturbation + branch generator
//
// Everything here is pure and deterministic: given the same story, source node,
// and config, generateBranch always returns the same branch and events. No
// Math.random, no Date. Pseudo-variation is derived from a small integer hash
// of (sourceNodeId + premise), so different premises fork differently while
// staying reproducible across reloads.
// ---------------------------------------------------------------------------

import type {
  Branch,
  Perturbation,
  Plausibility,
  RerollConfig,
  Story,
  StoryEvent,
  WorldStateEntry,
} from "@/lib/types";
import { eventById } from "@/lib/story-utils";

// --- deterministic hashing --------------------------------------------------

/** Stable non-negative 31-bit hash of a string (djb2-ish, char-code based). */
function hashString(input: string): number {
  let h = 5381;
  for (let i = 0; i < input.length; i++) {
    h = (h * 33) ^ input.charCodeAt(i);
  }
  // Force to unsigned 31-bit range.
  return (h >>> 0) % 0x7fffffff;
}

/**
 * Small deterministic pseudo-random sequence seeded from an int. Returns a
 * function yielding floats in [0, 1). Used purely for stable variation.
 */
function seededSequence(seed: number): () => number {
  let state = (seed % 2147483647) + 1;
  if (state <= 0) state += 2147483646;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

/** Clamp a number into [min, max]. */
function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

/** Round to two decimals to keep metrics tidy. */
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

// --- perturbation catalogue -------------------------------------------------

/**
 * Concrete, literary "what if" perturbations keyed by canonical event id.
 * Every canonical beat (c0..c11) offers at least three.
 */
export const PERTURBATIONS: Record<string, Perturbation[]> = {
  c0: [
    { label: "The Prince executes the brawlers", premise: "The Prince hangs the brawling servants and the feud turns cold with fear" },
    { label: "Benvolio brokers a truce", premise: "Benvolio talks both houses down before a single blade is drawn" },
    { label: "A Montague is killed in the street", premise: "The opening brawl leaves a Montague dead and the feud past all mending" },
  ],
  c1: [
    { label: "Romeo is recognized and thrown out", premise: "Tybalt exposes Romeo at the feast and he is cast into the street" },
    { label: "The feast is cancelled after a brawl", premise: "A brawl erupts before the dancing and the Capulet feast never happens" },
    { label: "Rosaline returns his affection", premise: "Rosaline meets Romeo's eyes at the feast and he never looks away" },
  ],
  c2: [
    { label: "Juliet is already betrothed", premise: "Juliet is bound to Paris that very night and dares not look at Romeo" },
    { label: "The Nurse keeps them apart", premise: "The Nurse spirits Juliet away before a single word can pass" },
    { label: "Romeo says nothing", premise: "Romeo loses his nerve and lets the moment with Juliet pass in silence" },
  ],
  c3: [
    { label: "Capulet overhears the vow", premise: "Capulet hears the balcony vows and locks Juliet away at once" },
    { label: "Juliet refuses to commit", premise: "Juliet, wary of haste, sends Romeo away to prove himself first" },
    { label: "Romeo is caught in the orchard", premise: "Capulet's men seize Romeo beneath the balcony as a trespasser" },
  ],
  c4: [
    { label: "Friar Laurence refuses", premise: "Friar Laurence refuses to marry them and counsels patience instead" },
    { label: "The marriage is discovered", premise: "The secret marriage is exposed the same day it is sworn" },
    { label: "They elope from Verona", premise: "Romeo and Juliet flee Verona together the night they wed" },
  ],
  c5: [
    { label: "Mercutio survives the duel", premise: "Benvolio and Romeo break the duel before Mercutio takes the fatal thrust" },
    { label: "Romeo refuses the challenge", premise: "Romeo, newly kin to Tybalt, walks away and Mercutio never fights" },
    { label: "The Prince arrives in time", premise: "The Prince's watch arrives before Tybalt and Mercutio can cross swords" },
  ],
  c6: [
    { label: "Romeo spares Tybalt", premise: "Grief-struck though he is, Romeo stays his hand and spares Tybalt" },
    { label: "Tybalt is arrested instead", premise: "The watch seizes Tybalt for Mercutio's death before Romeo can strike" },
    { label: "Romeo is killed in turn", premise: "Tybalt's blade finds Romeo and it is he who falls in the square" },
  ],
  c7: [
    { label: "Romeo is pardoned", premise: "The Prince pardons Romeo as Mercutio's avenger and lets him stay" },
    { label: "Romeo is sentenced to death", premise: "The Prince condemns Romeo to death rather than mere banishment" },
    { label: "Juliet flees with him", premise: "Juliet slips from Verona to follow Romeo into exile" },
  ],
  c8: [
    { label: "Juliet refuses the potion", premise: "Juliet cannot bring herself to drink and agrees to marry Paris" },
    { label: "Juliet confesses to her father", premise: "Juliet tells Capulet of the marriage instead of taking the potion" },
    { label: "The potion is a true poison", premise: "The Friar's draught is stronger than promised and Juliet does not wake" },
  ],
  c9: [
    { label: "The Friar's message reaches Romeo", premise: "Friar John's letter finds Romeo in Mantua in time to learn the truth" },
    { label: "Balthasar is intercepted", premise: "Balthasar is stopped on the road and no word of Juliet reaches Romeo at all" },
    { label: "The Friar comes in person", premise: "Friar Laurence rides to Mantua himself rather than trust a letter" },
  ],
  c10: [
    { label: "Romeo waits for word", premise: "Romeo distrusts the rumor and waits for the Friar before acting" },
    { label: "Romeo returns openly", premise: "Romeo rides back to Verona in daylight, past all caution, to reach the tomb" },
    { label: "Balthasar tells the whole truth", premise: "Balthasar somehow learns the plan and warns Romeo that Juliet only sleeps" },
  ],
  c11: [
    { label: "Juliet wakes in time", premise: "Juliet stirs before Romeo drinks and stays his hand at the tomb" },
    { label: "The Watch arrives first", premise: "The Watch enters the vault before either lover can die" },
    { label: "Friar Laurence intervenes", premise: "Friar Laurence reaches the tomb in time to stop the double death" },
  ],
};

const GENERIC_PERTURBATIONS: Perturbation[] = [
  { label: "A key choice is reversed", premise: "The central figure of this moment chooses the opposite course" },
  { label: "Chance intervenes", premise: "A stroke of chance interrupts this event before it can play out" },
  { label: "An ally arrives too late", premise: "Someone who might have changed this moment arrives just too late" },
];

/**
 * Suggest three perturbations for a node. Preference order:
 *   1. perturbations authored inline on the event (per-story data)
 *   2. the engine's PERTURBATIONS map (keyed by event id — Romeo & Juliet)
 *   3. three generic fallbacks
 */
export function suggestPerturbations(story: Story, nodeId: string): Perturbation[] {
  const event = eventById(story, nodeId);
  const inline = event?.perturbations;
  if (inline && inline.length >= 3) return inline.slice(0, 3);

  const authored = PERTURBATIONS[nodeId];
  if (authored && authored.length >= 3) return authored.slice(0, 3);
  return GENERIC_PERTURBATIONS;
}

// --- branch generation ------------------------------------------------------

const BEAT_TITLES: string[] = [
  "Immediate fallout",
  "The town reacts",
  "A new alliance forms",
  "Consequences ripple outward",
  "An uneasy resolution",
  "The new ending",
];

interface PlausibilityProfile {
  probLow: number;
  probHigh: number;
  uncLow: number;
  uncHigh: number;
  valenceSwing: number;
}

const PROFILES: Record<Plausibility, PlausibilityProfile> = {
  faithful: { probLow: 0.6, probHigh: 0.8, uncLow: 0.15, uncHigh: 0.3, valenceSwing: 0.25 },
  balanced: { probLow: 0.4, probHigh: 0.65, uncLow: 0.3, uncHigh: 0.5, valenceSwing: 0.45 },
  wild: { probLow: 0.15, probHigh: 0.4, uncLow: 0.5, uncHigh: 0.8, valenceSwing: 0.85 },
};

/** Turn a free-text premise into a compact Title Case branch label. */
function labelFromPremise(premise: string): string {
  const trimmed = premise.trim().replace(/\s+/g, " ");
  const fallback = "New Branch";
  const source = trimmed.length > 0 ? trimmed : fallback;
  const titled = source
    .split(" ")
    .map((w) => (w.length > 0 ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
  const MAX = 48;
  if (titled.length <= MAX) return titled;
  return titled.slice(0, MAX - 1).trimEnd() + "…";
}

/** Short lowercase clause form of the premise for weaving into prose. */
function premiseClause(premise: string): string {
  const trimmed = premise.trim().replace(/\s+/g, " ");
  if (trimmed.length === 0) return "the altered premise";
  const lowered = trimmed[0].toLowerCase() + trimmed.slice(1);
  return lowered.replace(/[.!?]+$/, "");
}

const BEAT_DESCRIPTIONS: string[] = [
  "In the hours after {clause}, the immediate consequences take shape — {prior} gives way to something the old story never allowed.",
  "Word spreads through Verona that {clause}. The households, the Prince, and the street each recalculate what {prior} now means.",
  "Out of the new circumstance — {clause} — an unexpected alliance forms, binding people the canonical path kept apart.",
  "The change works outward: because {clause}, the pressures that once drove the tragedy redirect, and {prior} no longer leads where it did.",
  "An uneasy settling begins. With {clause} now fact, the survivors reach for a resolution the original ending foreclosed.",
  "This is where the counterfactual comes to rest: {clause}, and so the story ends on a note the canon could never sound.",
];

/** Very small prior-beat summary used to thread descriptions together. */
function priorSummary(index: number, sourceTitle: string): string {
  if (index === 0) return `the moment of “${sourceTitle}”`;
  return `the previous beat`;
}

/**
 * Generate a counterfactual branch of `config.futureEventCount` events (clamped
 * 3..6) forking off `sourceNodeId`. Fully deterministic.
 */
export function generateBranch(
  story: Story,
  sourceNodeId: string,
  config: RerollConfig,
  branchOrder: number,
): { branch: Branch; events: StoryEvent[] } {
  const source = eventById(story, sourceNodeId);
  if (!source) {
    throw new Error(`generateBranch: unknown source node "${sourceNodeId}"`);
  }

  const count = clamp(Math.round(config.futureEventCount), 3, 6);
  const seed = hashString(sourceNodeId + "::" + config.premise);
  const rand = seededSequence(seed);
  const profile = PROFILES[config.plausibility];

  const branchId = "gen-" + seed + "-" + branchOrder;

  // Lane placement: keep generated branches clear of seeded lanes (-1..2).
  const magnitude = Math.floor(branchOrder / 2) + 3;
  const sign = branchOrder % 2 === 0 ? 1 : -1;
  const lane = sign * magnitude;

  const clause = premiseClause(config.premise);
  const preserve = config.preserveCharacterConsistency;

  const events: StoryEvent[] = [];
  let prevId = sourceNodeId;
  let impact = source.downstreamImpact * 0.7;
  let valence = source.emotionalValence;

  for (let i = 0; i < count; i++) {
    const isLast = i === count - 1;
    const id = branchId + "-" + i;

    // Metrics ---------------------------------------------------------------
    const probability = round2(
      clamp(profile.probLow + rand() * (profile.probHigh - profile.probLow), 0, 1),
    );
    const uncertainty = round2(
      clamp(profile.uncLow + rand() * (profile.uncHigh - profile.uncLow), 0, 1),
    );

    // Emotional valence drifts from the source; swing scaled by plausibility
    // and halved when preserving character consistency.
    let swing = profile.valenceSwing;
    if (preserve) swing *= 0.5;
    const drift = (rand() * 2 - 1) * swing;
    valence = round2(clamp(valence + drift, -1, 1));

    impact = impact * (i === 0 ? 1 : 0.85);
    const downstreamImpact = Math.round(clamp(impact, 0, 100));

    // Prose -----------------------------------------------------------------
    const title = BEAT_TITLES[Math.min(i, BEAT_TITLES.length - 1)];
    const descTemplate = BEAT_DESCRIPTIONS[Math.min(i, BEAT_DESCRIPTIONS.length - 1)];
    const description = descTemplate
      .replace("{clause}", clause)
      .replace("{prior}", priorSummary(i, source.title));

    // Characters ------------------------------------------------------------
    const charactersInvolved = preserve
      ? [...source.charactersInvolved]
      : source.charactersInvolved.length > 0
        ? [...source.charactersInvolved]
        : ["Verona"];

    // World state -----------------------------------------------------------
    const premiseEntry: WorldStateEntry = {
      key: "divergence",
      value: config.premise.trim() || "an altered premise",
    };
    const beatEntry: WorldStateEntry = {
      key: "alt beat " + (i + 1),
      value: title,
    };
    const worldState: WorldStateEntry[] = [
      ...source.worldState,
      premiseEntry,
      beatEntry,
    ];
    const worldStateDiff =
      i === 0
        ? { added: [premiseEntry, beatEntry], changed: [] as WorldStateEntry[] }
        : { changed: [beatEntry] };

    const whyItMatters =
      i === 0
        ? `This is the first beat where the change bites: because ${clause}, the causal chain leaves the canonical track here.`
        : isLast
          ? `The branch resolves here — the accumulated effect of ${clause} settles into a new outcome.`
          : `The consequences of ${clause} compound, steering events further from the original story.`;

    events.push({
      id,
      title,
      description,
      phase: "Alt · beat " + (i + 1),
      timeIndex: source.timeIndex + 1 + i,
      parentId: prevId,
      branchId,
      canonical: false,
      probability,
      emotionalValence: valence,
      uncertainty,
      downstreamImpact,
      charactersInvolved,
      whyItMatters,
      worldState,
      worldStateDiff,
      terminal: isLast ? true : undefined,
    });

    prevId = id;
  }

  const branch: Branch = {
    id: branchId,
    label: labelFromPremise(config.premise),
    canonical: false,
    sourceNodeId,
    premise: config.premise.trim(),
    plausibility: config.plausibility,
    lane,
    createdOrder: branchOrder + 3,
  };

  return { branch, events };
}
