// ---------------------------------------------------------------------------
// reroll — pure graph-traversal helpers
//
// The story is a forest of causally-linked events. Every event points at its
// parent via `parentId` (root events have `parentId === null`). These helpers
// walk that structure. They are pure, side-effect free, and defensive: an
// unknown id yields an empty result rather than throwing.
// ---------------------------------------------------------------------------

import type { Story, StoryEvent } from "@/lib/types";

/** Look up a single event by id. Returns undefined if not present. */
export function eventById(story: Story, id: string): StoryEvent | undefined {
  return story.events.find((e) => e.id === id);
}

/**
 * The causal path from the root down to (and including) `nodeId`, ordered
 * root → node. Returns [] if the id is unknown. Guards against malformed
 * parent chains (missing parents / cycles) so it always terminates.
 */
export function pathTo(story: Story, nodeId: string): StoryEvent[] {
  const path: StoryEvent[] = [];
  const seen = new Set<string>();
  let current = eventById(story, nodeId);
  while (current && !seen.has(current.id)) {
    seen.add(current.id);
    path.push(current);
    current = current.parentId ? eventById(story, current.parentId) : undefined;
  }
  return path.reverse();
}

/** Direct children of `nodeId` (events whose parentId === nodeId). */
export function childrenOf(story: Story, nodeId: string): StoryEvent[] {
  return story.events.filter((e) => e.parentId === nodeId);
}

/**
 * All transitive descendants of `nodeId` (children, grandchildren, ...),
 * excluding the node itself. Order is a breadth-first traversal. Cycle-safe.
 */
export function descendantsOf(story: Story, nodeId: string): StoryEvent[] {
  const result: StoryEvent[] = [];
  const seen = new Set<string>([nodeId]);
  const queue: string[] = [nodeId];
  while (queue.length > 0) {
    const currentId = queue.shift() as string;
    for (const child of childrenOf(story, currentId)) {
      if (seen.has(child.id)) continue;
      seen.add(child.id);
      result.push(child);
      queue.push(child.id);
    }
  }
  return result;
}

/** Events with no children — the terminal outcomes of every branch. */
export function terminalNodes(story: Story): StoryEvent[] {
  const parentIds = new Set<string>();
  for (const e of story.events) {
    if (e.parentId) parentIds.add(e.parentId);
  }
  return story.events.filter((e) => !parentIds.has(e.id));
}

/** The branchId that `nodeId` belongs to (empty string if unknown). */
export function branchOfNode(story: Story, nodeId: string): string {
  return eventById(story, nodeId)?.branchId ?? "";
}

/**
 * How far the node has strayed from canon: the count of non-canonical events
 * on the path from root to `nodeId`. 0 for a fully-canonical node.
 */
export function canonDistance(story: Story, nodeId: string): number {
  return pathTo(story, nodeId).filter((e) => !e.canonical).length;
}

/** The sequence of emotional valences along the path root → nodeId. */
export function emotionalTrajectory(story: Story, nodeId: string): number[] {
  return pathTo(story, nodeId).map((e) => e.emotionalValence);
}
