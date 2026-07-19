"use client";

import "@xyflow/react/dist/style.css";

import Graph from "@/components/Graph";
import TopBar from "@/components/TopBar";
import Inspector from "@/components/Inspector";
import RerollEditor from "@/components/RerollEditor";
import CompareMode from "@/components/CompareMode";
import TimelineScrubber from "@/components/TimelineScrubber";

export default function Page() {
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-paper text-ink">
      <TopBar />
      <div className="relative flex-1 min-h-0">
        <div className="absolute inset-0">
          <Graph />
        </div>
        <Inspector />
        <RerollEditor />
        <CompareMode />
      </div>
      <TimelineScrubber />
    </div>
  );
}
