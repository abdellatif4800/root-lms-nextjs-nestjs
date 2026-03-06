// TutorialCard
"use client"
import { RootState, useAppSelector } from "@repo/reduxSetup";
import Link from "next/link";
import { useEffect } from "react";

export function TutorialCard({ tutorial }: { tutorial: any }) {
  const { isPublic } = useAppSelector((state: RootState) => state.tutorialSlice);

  const displayData = {
    id: tutorial.id,
    title: tutorial.tutorialName || "UNTITLED_MODULE",
    description:
      tutorial.description ||
      (tutorial.units?.length
        ? `Contains ${tutorial.units.length} learning unit(s) ready for access.`
        : "No units initialized in this sector."),
    thumbnail:
      tutorial.thumbnail ||
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=2069&auto=format&fit=crop",
    level: tutorial.level || "CORE_SYSTEM",
    category: tutorial.category || "General_Sector",
    instructorName: tutorial.instructor?.name || "ROOT_ADMIN",
  };

  const actionLink = !isPublic
    ? { pathname: "/tutorials/tutorialEditor", query: { editOrCreate: "edit", tutorialId: tutorial.id } }
    : { pathname: `/tutorials/${displayData.id}` };

  const actionLabel = !isPublic ? "Edit" : "Read_Now";
  return (
    <div className="relative group">
      {/* Hard offset shadow layer */}
      <div
        className="absolute inset-0 transition-all duration-300 group-hover:translate-x-2 group-hover:translate-y-2"
        style={{
          backgroundColor: "var(--surface-700)",
          clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
          transform: "translate(6px, 6px)",
        }}
      />

      <div
        className="h-[340px] flex flex-col bg-surface-900 border border-surface-800 hover:border-teal-glow/60 transition-all duration-300 group relative overflow-hidden"
        style={{
          clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
        }}
      >
        {/* Hover inset glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"
          style={{ background: "linear-gradient(135deg, rgba(45,212,191,0.04) 0%, transparent 60%)" }}
        />

        {/* Bottom accent bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-teal-glow/80 shadow-[0_0_8px_rgba(45,212,191,0.6)] scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left z-20" />

        {/* ── Thumbnail ── */}
        <div className="relative h-36 w-full bg-black overflow-hidden border-b border-surface-800 shrink-0">
          <img
            src={displayData.thumbnail}
            alt={displayData.title}
            className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-700"
          />

          {/* Scanline */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
            }}
          />

          {/* Level badge — top right */}
          <div className="absolute top-0 right-0 z-10">
            <span className="block bg-surface-950/95 text-teal-glow border-l border-b border-teal-glow/40 text-[8px] font-digital font-black px-2.5 py-1 uppercase tracking-wider">
              {displayData.level}
            </span>
          </div>

          {/* Publish status badge — top left */}
          {!isPublic && (
            <div className="absolute top-0 left-0 z-10">
              {tutorial?.publish ? (
                <span
                  className="flex items-center gap-1.5 bg-surface-950/95 border-r border-b border-emerald-glow/40 text-[7px] font-digital font-black px-2 py-1 uppercase tracking-wider text-emerald-glow"
                  style={{ textShadow: "0 0 6px var(--shadow-emerald)" }}
                >
                  <span
                    className="w-1 h-1 bg-emerald-glow animate-pulse shrink-0"
                    style={{ boxShadow: "0 0 4px var(--shadow-emerald)" }}
                  />
                  Live
                </span>
              ) : (
                <span
                  className="flex items-center gap-1.5 bg-surface-950/95 border-r border-b border-surface-600/60 text-[7px] font-digital font-black px-2 py-1 uppercase tracking-wider text-text-secondary"
                >
                  <span className="w-1 h-1 bg-surface-600 shrink-0" />
                  Draft
                </span>
              )}
            </div>
          )}

          {/* Corner bracket bottom-left */}
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-teal-glow/30 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* ── Card Body ── */}
        <div className="p-4 flex flex-col flex-1 overflow-hidden">

          {/* Category */}
          <div className="mb-2 flex items-center gap-1.5">
            <span className="w-1 h-1 bg-purple-glow" />
            <span className="text-[8px] font-terminal font-bold text-purple-glow uppercase tracking-[0.2em]">
              {displayData.category}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-xs font-digital font-black text-text-primary uppercase tracking-wider mb-2 line-clamp-2 group-hover:text-teal-glow transition-colors duration-200 shrink-0 leading-snug">
            {displayData.title}
          </h2>

          {/* Description */}
          <p className="text-[10px] font-terminal text-text-secondary leading-relaxed line-clamp-2 flex-1 opacity-70">
            <span className="text-teal-glow/50 mr-1">{">"}</span>
            {displayData.description}
          </p>

          {/* Footer */}
          <div className="mt-auto pt-3 border-t border-surface-800 flex items-center justify-between shrink-0">
            <div className="flex flex-col gap-0.5">
              <span className="text-[7px] font-terminal text-text-secondary uppercase tracking-[0.2em] opacity-50">
                // instructor
              </span>
              <span className="text-[9px] font-digital font-black text-purple-glow truncate max-w-[90px]">
                {displayData.instructorName}
              </span>
            </div>

            <Link
              href={actionLink}
              className="
                relative group/btn overflow-hidden
                border border-emerald-glow/60 bg-transparent
                text-emerald-glow text-[9px] font-digital font-black uppercase tracking-wider
                px-4 py-1.5
                hover:text-black transition-colors duration-200
                active:scale-95
              "
              style={{
                clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
              }}
            >
              <span className="absolute inset-0 bg-emerald-glow translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-200 z-0" />
              <span className="relative z-10">{actionLabel}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

