"use client";


import { RootState, useAppSelector } from "@repo/reduxSetup";
import { useState } from "react";

export function TutorialsFilter({ loadFilterdData }: any) {
  const [tutorialName, setTutorialName] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<"PUBLISHED" | "DRAFT" | null>("PUBLISHED");

  const { isPublic } = useAppSelector((state: RootState) => state.tutorialSlice);

  const handleLevelsChange = (level: string) => {
    setLevels((prev) =>
      prev.includes(level) ? prev.filter((c) => c !== level) : [...prev, level]
    );
  };

  const handleCategoryChange = (topic: string) => {
    setCategories((prev) =>
      prev.includes(topic) ? prev.filter((c) => c !== topic) : [...prev, topic]
    );
  };

  // FIX 1: Status buttons only update local state — Apply fires the query
  const handleStatusChange = (status: "PUBLISHED" | "DRAFT") => {
    setStatusFilter((prev) => (prev === status ? null : status));
  };

  // FIX 2: Build publish value from current statusFilter state correctly
  const buildPublishValue = (status: "PUBLISHED" | "DRAFT" | null) => {
    if (status === "PUBLISHED") return true;
    if (status === "DRAFT") return false;
    return undefined; // null = show all (no publish filter)
  };

  const handleApply = () => {
    const publishValue = buildPublishValue(statusFilter);
    const filters: Record<string, any> = {};

    if (tutorialName.trim()) filters.tutorialName = tutorialName.trim();
    if (categories.length > 0) filters.categories = categories;
    if (levels.length > 0) filters.levels = levels;

    // FIX 3: Only set publish if it's not "show all" — let parent/cleanFilters
    // default it, but don't force true when user wants all
    if (publishValue !== undefined) {
      filters.publish = publishValue;
    }
    // When publishValue is undefined (null status = show all),
    // don't include publish key — parent cleanFilters will default to true
    // UNLESS we explicitly want to show all. Pass a sentinel:
    if (status === null && !isPublic) {
      filters.__showAll = true; // handled in parent cleanFilters
    }

    loadFilterdData(filters);
  };

  const handleReset = () => {
    setTutorialName("");
    setCategories([]);
    setLevels([]);
    setStatusFilter("PUBLISHED");
    loadFilterdData({ publish: true });
  };

  const activeFilterCount =
    categories.length +
    levels.length +
    (tutorialName ? 1 : 0) +
    (statusFilter !== "PUBLISHED" ? 1 : 0);

  return (
    <aside className="w-64 lg:w-72 border border-surface-800 bg-surface-900 shrink-0 flex flex-col transition-colors duration-300 custom-shadow">

      {/* ── Header ── */}
      <header className="px-5 py-4 border-b border-surface-800 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="block w-0.5 h-5 bg-purple-glow shadow-[0_0_6px_rgba(168,85,247,0.6)]" />
            <h2 className="text-sm font-digital font-bold text-purple-glow tracking-wider uppercase leading-none">
              System_Filters
            </h2>
          </div>
          {activeFilterCount > 0 && (
            <span className="text-[8px] font-digital font-black text-black bg-teal-glow px-1.5 py-0.5 min-w-[18px] text-center">
              {activeFilterCount}
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleApply}
            className="
              flex-1 relative overflow-hidden group/apply
              border border-teal-glow/50 bg-transparent
              text-teal-glow text-[9px] font-digital font-black uppercase tracking-wider
              py-2 transition-colors duration-200 hover:text-black
            "
          >
            <span className="absolute inset-0 bg-teal-glow translate-x-[-100%] group-hover/apply:translate-x-0 transition-transform duration-200 z-0" />
            <span className="relative z-10">[ Apply ]</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="
              flex-1 relative overflow-hidden group/reset
              border border-red-500/40 bg-transparent
              text-red-500 text-[9px] font-digital font-black uppercase tracking-wider
              py-2 transition-colors duration-200 hover:text-black
            "
          >
            <span className="absolute inset-0 bg-red-500 translate-x-[-100%] group-hover/reset:translate-x-0 transition-transform duration-200 z-0" />
            <span className="relative z-10">[ Reset ]</span>
          </button>
        </div>
      </header>

      {/* ── Scrollable filter body ── */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-5 py-5 flex flex-col gap-7">

        {/* Module Status (admin only) */}
        {!isPublic && (
          <FilterSection label="Module_Status" accent="emerald">
            <div className="flex gap-2">
              {(["PUBLISHED", "DRAFT"] as const).map((s) => {
                const isActive = statusFilter === s;
                const isPublishedBtn = s === "PUBLISHED";
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleStatusChange(s)}
                    className={`
                      flex-1 py-2 text-[9px] font-digital font-black uppercase tracking-wider
                      border transition-all duration-200
                      ${isActive && isPublishedBtn
                        ? "bg-emerald-glow text-black border-emerald-glow shadow-[0_0_10px_rgba(16,185,129,0.25)]"
                        : ""}
                      ${isActive && !isPublishedBtn
                        ? "bg-surface-700 text-white border-surface-600 shadow-[0_0_8px_rgba(38,42,51,0.5)]"
                        : ""}
                      ${!isActive && isPublishedBtn
                        ? "bg-transparent text-emerald-glow border-emerald-glow/30 hover:border-emerald-glow hover:bg-emerald-glow/10"
                        : ""}
                      ${!isActive && !isPublishedBtn
                        ? "bg-transparent text-text-secondary border-surface-700 hover:border-surface-500 hover:text-white"
                        : ""}
                    `}
                  >
                    {isActive
                      ? `[✓] ${isPublishedBtn ? "Live" : "Draft"}`
                      : isPublishedBtn ? "Live" : "Draft"}
                  </button>
                );
              })}
            </div>
            {/* "Show all" hint when neither is active */}
            {statusFilter === null && (
              <p className="text-[8px] font-terminal text-text-secondary opacity-40 uppercase tracking-wider text-center">
                // showing all statuses
              </p>
            )}
          </FilterSection>
        )}

        {/* Search */}
        <FilterSection label="Query_Protocol" accent="teal">
          <div className="border border-surface-700 bg-surface-950 flex items-center gap-2 px-3 py-2.5 focus-within:border-teal-glow transition-colors">
            <span className="text-teal-glow/50 text-xs font-terminal">{">"}</span>
            <input
              type="text"
              placeholder="Search_Modules..."
              value={tutorialName}
              onChange={(e) => setTutorialName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleApply()}
              className="bg-transparent border-none outline-none w-full placeholder:text-surface-700 text-teal-glow font-terminal text-[11px] p-0 focus:ring-0"
            />
            <span className="text-teal-glow animate-pulse text-xs">_</span>
          </div>
        </FilterSection>

        {/* Categories */}
        <FilterSection label="Sector_Category" accent="teal">
          <div className="flex flex-col gap-0.5">
            {["Frontend", "Backend", "DevOps", "Systems", "Security"].map((topic) => (
              <CheckRow
                key={topic}
                label={topic}
                checked={categories.includes(topic)}
                onChange={() => handleCategoryChange(topic)}
                color="teal"
              />
            ))}
          </div>
        </FilterSection>

        {/* Access Level */}
        <FilterSection label="Access_Level" accent="purple">
          <div className="flex flex-col gap-0.5">
            {["Beginner", "Intermediate", "Advanced", "Expert"].map((lvl) => (
              <CheckRow
                key={lvl}
                label={lvl}
                checked={levels.includes(lvl)}
                onChange={() => handleLevelsChange(lvl)}
                color="purple"
              />
            ))}
          </div>
        </FilterSection>

        {/* Timeline */}
        <FilterSection label="Timeline_Range" accent="teal" topBorder>
          <div className="flex flex-col gap-2">
            <div className="relative">
              <span className="absolute left-0 top-0 bottom-0 flex items-center px-2.5 text-[9px] font-terminal text-text-secondary opacity-40 pointer-events-none">
                FROM
              </span>
              <input
                type="date"
                className="w-full bg-surface-950 border border-surface-700 text-text-secondary text-[10px] font-terminal pl-12 pr-2 py-2 focus:border-teal-glow focus:outline-none"
              />
            </div>
            <div className="relative">
              <span className="absolute left-0 top-0 bottom-0 flex items-center px-2.5 text-[9px] font-terminal text-text-secondary opacity-40 pointer-events-none">
                TO
              </span>
              <input
                type="date"
                className="w-full bg-surface-950 border border-surface-700 text-text-secondary text-[10px] font-terminal pl-12 pr-2 py-2 focus:border-teal-glow focus:outline-none"
              />
            </div>
          </div>
        </FilterSection>
      </div>
    </aside>
  );
}

/* ── Sub-components ── */

function FilterSection({
  label,
  children,
  topBorder = false,
}: {
  label: string;
  accent?: string;
  children: React.ReactNode;
  topBorder?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-2.5 ${topBorder ? "pt-5 border-t border-surface-800" : ""}`}>
      <div className="flex items-center gap-2">
        <span className="w-3 h-px bg-text-secondary opacity-40" />
        <span className="text-[9px] font-terminal font-bold text-text-secondary uppercase tracking-[0.25em]">
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}

function CheckRow({
  label,
  checked,
  onChange,
  color,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  color: "teal" | "purple";
}) {
  const isTeal = color === "teal";

  return (
    <label className="flex items-center gap-3 px-2 py-1.5 cursor-pointer group hover:bg-surface-800 transition-colors">
      <span
        className="w-3.5 h-3.5 shrink-0 border flex items-center justify-center transition-colors duration-150"
        style={{
          background: checked
            ? isTeal ? "var(--teal-glow)" : "var(--purple-glow)"
            : "var(--surface-950)",
          borderColor: checked
            ? isTeal ? "var(--teal-glow)" : "var(--purple-glow)"
            : "var(--surface-600)",
        }}
      >
        {checked && (
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M1.5 4L3 5.5L6.5 2" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
      <span
        className="text-[10px] font-terminal font-bold uppercase tracking-wider leading-none transition-colors duration-150"
        style={{
          color: checked ? (isTeal ? "var(--teal-glow)" : "var(--purple-glow)") : undefined,
        }}
      >
        {!checked
          ? <span className="text-text-secondary group-hover:text-text-primary transition-colors">{label}</span>
          : label
        }
      </span>
      {checked && (
        <span
          className="ml-auto w-1 h-1 shrink-0"
          style={{ background: isTeal ? "var(--teal-glow)" : "var(--purple-glow)" }}
        />
      )}
    </label>
  );
}
