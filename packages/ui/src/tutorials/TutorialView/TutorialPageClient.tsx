"use client";
import { useState } from "react";
import { UnitsList } from "./UnitsList";
import { ContentArea } from "./ContentArea";

export function TutorialPageClient({
  tutorialData,
}: {
  tutorialData: any;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-full w-full flex overflow-hidden font-sans text-ink min-h-0 relative">

      {/* ── Backdrop (mobile only) ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── UnitsList — overlay on mobile, in-flow on lg+ ── */}
      <div className={`
        lg:relative lg:flex lg:shrink-0
        absolute top-0 left-0 h-full z-50
        transition-all duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:-ml-80"}
      `}>
        <UnitsList
          firstUnit={tutorialData?.units?.[0]?.id}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* ── ContentArea — always full width on mobile ── */}
      <ContentArea
        tutorialData={tutorialData}
        sidebarOpen={sidebarOpen}
        onOpenUnits={() => setSidebarOpen(true)}
      />
    </div>
  );
}
