"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  useReactFlow,
  type Node,
  type Edge,
} from "@xyflow/react";

import { useStore } from "@/lib/store";
import { layoutStory, type EventNodeData } from "@/lib/graph-layout";
import EventNode from "@/components/EventNode";
import type { StoryEvent, Story, BranchFilter } from "@/lib/types";

// Defined once, outside the component, to keep React Flow from warning about
// a new object identity on every render.
const nodeTypes = { event: EventNode };

const proOptions = { hideAttribution: true } as const;

// ---------------------------------------------------------------------------
// Visible-branch computation
//   all       => every branch visible
//   canonical => only the canonical branch is fully visible
//   selected  => canonical + the branch containing the selected node
// ---------------------------------------------------------------------------
function computeVisibleBranchIds(
  story: Story,
  filter: BranchFilter,
  selectedNodeId: string | null
): Set<string> {
  const visible = new Set<string>();

  if (filter === "all") {
    for (const branch of story.branches) visible.add(branch.id);
    return visible;
  }

  // Canonical is always visible in the remaining modes.
  for (const branch of story.branches) {
    if (branch.canonical) visible.add(branch.id);
  }

  if (filter === "selected" && selectedNodeId) {
    const selected = story.events.find((e) => e.id === selectedNodeId);
    if (selected) visible.add(selected.branchId);
  }

  return visible;
}

function GraphInner() {
  const story = useStore((s) => s.story);
  const selectedNodeId = useStore((s) => s.selectedNodeId);
  const branchFilter = useStore((s) => s.branchFilter);
  const scrubIndex = useStore((s) => s.scrubIndex);
  const lastCreatedBranchId = useStore((s) => s.lastCreatedBranchId);
  const selectNode = useStore((s) => s.selectNode);

  const { fitView } = useReactFlow();

  // Base layout — pure function of the story graph only.
  const { nodes: baseNodes, edges: baseEdges } = useMemo(
    () => layoutStory(story),
    [story]
  );

  // Fast lookup from event id -> event for edge decoration.
  const eventById = useMemo(() => {
    const map = new Map<string, StoryEvent>();
    for (const e of story.events) map.set(e.id, e);
    return map;
  }, [story]);

  const visibleBranchIds = useMemo(
    () => computeVisibleBranchIds(story, branchFilter, selectedNodeId),
    [story, branchFilter, selectedNodeId]
  );

  // Nodes: identity is stable per layout; the node component itself reads live
  // UI state from the store, so nothing extra is injected here.
  const nodes: Node<EventNodeData>[] = baseNodes;

  // Edges: decorated each render based on probability + mute/filter state.
  const edges: Edge[] = useMemo(() => {
    return baseEdges.map((edge) => {
      const probability = edge.data?.probability ?? 0.5;
      const canonical = edge.data?.canonical ?? false;

      const target = eventById.get(edge.target);
      const muted = target ? target.timeIndex > scrubIndex : false;
      const filteredOut = target ? !visibleBranchIds.has(target.branchId) : false;
      const dimmed = muted || filteredOut;

      return {
        ...edge,
        style: {
          strokeWidth: 1 + probability * 3.5,
          stroke: canonical ? "#234f3b" : "#8a857b",
          strokeDasharray: canonical ? undefined : "5 4",
          opacity: dimmed ? 0.2 : canonical ? 0.85 : 0.65,
        },
      };
    });
  }, [baseEdges, eventById, scrubIndex, visibleBranchIds]);

  // Re-fit the view whenever a new branch is generated.
  const prevBranchRef = useRef<string | null>(lastCreatedBranchId);
  useEffect(() => {
    if (lastCreatedBranchId && lastCreatedBranchId !== prevBranchRef.current) {
      fitView({ duration: 600, padding: 0.2 });
    }
    prevBranchRef.current = lastCreatedBranchId;
  }, [lastCreatedBranchId, fitView]);

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => selectNode(node.id)}
        onPaneClick={() => selectNode(null)}
        fitView
        minZoom={0.3}
        maxZoom={1.5}
        proOptions={proOptions}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={22}
          size={1}
          color="#e7e4dc"
        />
        <Controls
          showInteractive={false}
          className="!border !border-paper-line !bg-paper-panel !shadow-panel"
        />
        <MiniMap
          pannable
          zoomable
          className="!border !border-paper-line !bg-paper-panel"
          maskColor="rgba(231, 228, 220, 0.6)"
          nodeColor={(node) => {
            const data = node.data as EventNodeData | undefined;
            const ev = data?.event;
            return ev?.canonical ? "#234f3b" : "#c9c4ba";
          }}
          nodeStrokeColor="#8a857b"
        />
      </ReactFlow>
    </div>
  );
}

export default function Graph() {
  return (
    <ReactFlowProvider>
      <GraphInner />
    </ReactFlowProvider>
  );
}
