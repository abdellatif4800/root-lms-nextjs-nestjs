"use client";

import { RootState, useAppSelector } from "@repo/reduxSetup";
import { useState } from "react";

export function TutorialsFilter({ loadFilterdData, onClose }: any) {
  const [tutorialName, setTutorialName] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<"PUBLISHED" | "DRAFT" | null>("PUBLISHED");
  const [accessFilter, setAccessFilter] = useState<boolean | null>(null);

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

  const handleStatusChange = (status: "PUBLISHED" | "DRAFT") => {
    setStatusFilter((prev) => (prev === status ? null : status));
  };

  const handleAccessChange = (val: boolean) => {
    setAccessFilter((prev) => (prev === val ? null : val));
  };

  const buildPublishValue = (status: "PUBLISHED" | "DRAFT" | null) => {
    if (status === "PUBLISHED") return true;
    if (status === "DRAFT") return false;
    return undefined;
  };

  const handleApply = () => {
    const publishValue = buildPublishValue(statusFilter);
    const filters: Record<string, any> = {};

    if (tutorialName.trim()) filters.tutorialName = tutorialName.trim();
    if (categories.length > 0) filters.categories = categories;
    if (levels.length > 0) filters.levels = levels;
    if (publishValue !== undefined) filters.publish = publishValue;
    if (accessFilter !== null) filters.isPaid = accessFilter;

    loadFilterdData(filters);
  };

  const handleReset = () => {
    setTutorialName("");
    setCategories([]);
    setLevels([]);
    setStatusFilter("PUBLISHED");
    setAccessFilter(null);
    loadFilterdData({ publish: true });
  };

  return (
    <aside className="w-80 h-full border-2 border-ink bg-surface shrink-0 flex flex-col relative z-[100] ">

      {/* ── Header ── */}
      <header className="px-6 py-6 border-b-2 border-ink flex flex-col gap-6 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-ink uppercase tracking-tighter">
              Filter Lessons
            </h2>
            <span className="font-mono text-[10px] text-teal-primary opacity-40">OPTIONS</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 border-2 border-ink flex items-center justify-center hover:bg-ink hover:text-background transition-colors shadow-[2px_2px_0px_0px_rgba(19,21,22,1)]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex gap-3 py-3">
          <button onClick={handleApply} className="btn-wire-teal flex-1 text-[10px] py-2">
            Show Results
          </button>
          <button onClick={handleReset} className="btn-wire flex-1 text-[10px] py-2">
            Reset All
          </button>
        </div>
      </header>

      {/* ── Scrollable Body ── */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-8 flex flex-col gap-10">

        {/* Access Type */}
        <FilterSection label="Price">
          <div className="grid grid-cols-2 gap-2">
            {[{ label: "FREE", value: false }, { label: "PAID", value: true }].map(({ label, value }) => {
              const isActive = accessFilter === value;
              return (
                <button
                  key={label}
                  onClick={() => handleAccessChange(value)}
                  className={`py-2 text-[10px] font-bold border-2 transition-all ${isActive ? "bg-teal-primary text-background border-ink" : "bg-background border-ink/10 hover:border-ink"}`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </FilterSection>

        {/* Search */}
        <FilterSection label="Search by Name">
          <div className="border-2 border-ink bg-background px-3 py-2 flex items-center gap-2">
            <input
              type="text"
              placeholder="Type lesson name..."
              value={tutorialName}
              onChange={(e) => setTutorialName(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-xs font-bold placeholder:text-dust/50 focus:ring-0 p-0"
            />
          </div>
        </FilterSection>

        {/* Categories */}
        <FilterSection label="Topics">
          <div className="flex flex-col gap-1">
            {["Frontend", "Backend", "DevOps", "Systems"].map((topic) => (
              <CheckRow key={topic} label={topic} checked={categories.includes(topic)} onChange={() => handleCategoryChange(topic)} />
            ))}
          </div>
        </FilterSection>

        {/* Status (Admin) */}
        {!isPublic && (
          <FilterSection label="Lesson Status">
            <div className="flex gap-2">
              {(["PUBLISHED", "DRAFT"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className={`flex-1 py-2 text-[10px] font-bold border-2 ${statusFilter === s ? "bg-teal-primary text-background border-ink" : "bg-background border-ink/10"}`}
                >
                  {s === "PUBLISHED" ? "LIVE" : "DRAFT"}
                </button>
              ))}
            </div>
          </FilterSection>
        )}
      </div>

      {/* Footer annotation */}
      <div className="p-4 border-t-2 border-ink/5 text-center">
        <span className="font-mono text-[8px] uppercase text-dust opacity-30">Selection Panel V1</span>
      </div>
    </aside>
  );
}

function FilterSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <h3 className="text-[10px] font-black uppercase text-ink tracking-widest">{label}</h3>
        <div className="flex-1 h-px bg-ink/10" />
      </div>
      {children}
    </div>
  );
}

function CheckRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-3 py-1 cursor-pointer group">
      <div className={`w-4 h-4 border-2 border-ink transition-all flex items-center justify-center ${checked ? "bg-teal-primary shadow-[1px_1px_0px_0px_rgba(19,21,22,1)]" : "bg-background"}`}>
        {checked && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M20 6L9 17L4 12" /></svg>
        )}
      </div>
      <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
      <span className={`text-xs font-bold uppercase transition-colors ${checked ? "text-ink" : "text-dust group-hover:text-ink"}`}>
        {label}
      </span>
    </label>
  );
}
