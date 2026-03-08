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
    <div className="h-full w-full bg-surface-950 flex overflow-hidden font-terminal text-text-primary min-h-0 relative">

      {/* ── Backdrop (mobile only) ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── UnitsList — overlay on mobile, in-flow on lg+ ── */}
      <div className={`
        lg:relative lg:translate-x-0 lg:flex lg:shrink-0
        fixed top-0 left-0 h-full z-50
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <UnitsList
          firstUnit={tutorialData?.units?.[0]?.id}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* ── ContentArea — always full width on mobile ── */}
      <ContentArea
        tutorialData={tutorialData}
        onOpenUnits={() => setSidebarOpen(true)}
      />
    </div>
  );
}
