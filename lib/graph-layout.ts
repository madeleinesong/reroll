import type { Node, Edge } from "@xyflow/react";
import type { Story, StoryEvent } from "@/lib/types";

// Node geometry + spacing constants (shared by EventNode / Graph).
export const NODE_W = 208;
export const NODE_H = 92;
export const X_GAP = 272;
export const LANE_H = 150;

// Data payloads carried on each React Flow node/edge.
export interface EventNodeData {
  event: StoryEvent;
  [key: string]: unknown;
}
export interface EventEdgeData {
  probability: number;
  canonical: boolean;
  [key: string]: unknown;
}

export type RFNode = Node<EventNodeData, "event">;
export type RFEdge = Edge<EventEdgeData>;

/**
 * Pure layout pass over a Story.
 *
 * Positions:
 *   x = event.timeIndex * X_GAP   (time flows left -> right)
 *   y = branch.lane   * LANE_H    (lane only separates branches; canonical lane 0 => y 0)
 *
 * Edges connect each event to its parent (root events with parentId === null are skipped).
 */
export function layoutStory(story: Story): { nodes: RFNode[]; edges: RFEdge[] } {
  const laneByBranch = new Map<string, number>();
  for (const branch of story.branches) {
    laneByBranch.set(branch.id, branch.lane);
  }

  const nodes: RFNode[] = story.events.map((event) => {
    const lane = laneByBranch.get(event.branchId) ?? 0;
    return {
      id: event.id,
      type: "event",
      position: {
        x: event.timeIndex * X_GAP,
        y: lane * LANE_H,
      },
      data: { event },
      draggable: false,
    };
  });

  const edges: RFEdge[] = [];
  for (const event of story.events) {
    if (event.parentId === null) continue;
    edges.push({
      id: event.parentId + "__" + event.id,
      source: event.parentId,
      target: event.id,
      type: "smoothstep",
      data: {
        probability: event.probability,
        canonical: event.canonical,
      },
    });
  }

  return { nodes, edges };
}
