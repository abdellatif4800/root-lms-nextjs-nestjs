"use client";
import { RootState, useAppSelector } from "@repo/reduxSetup";
import Link from "next/link";

export function TutorialCard({ tutorial }: { tutorial: any }) {
  const { isPublic } = useAppSelector((state: RootState) => state.tutorialSlice);
  const { isAuth, user } = useAppSelector((state: RootState) => state.authSlice);

  const displayData = {
    id: tutorial.id,
    title: tutorial.tutorialName || "Untitled Lesson",
    description:
      tutorial.description ||
      (tutorial.units?.length
        ? `Contains ${tutorial.units.length} parts to learn.`
        : "No lessons available yet."),
    thumbnail:
      tutorial.thumbnail ||
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=2069&auto=format&fit=crop",
    level: tutorial.level || "BEGINNER",
    category: tutorial.category || "General",
    instructorName: tutorial.author?.username || tutorial.instructor?.name || "Teacher",
    isPaid: tutorial.isPaid,
    price: tutorial.price || 0,
  };

  const actionLink = !isPublic
    ? { pathname: "/tutorials/tutorialEditor", query: { editOrCreate: "edit", tutorialId: tutorial.id } }
    : { pathname: `/tutorials/${displayData.id}` };

  const hasAccess = isAuth && user?.subscriptionStatus === "active";
  const showActionBtn = !isPublic || !displayData.isPaid || hasAccess;

  return (
    <div className="wire-card group relative h-full flex flex-col overflow-hidden">
      
      {/* Thumbnail with "Sketch" border */}
      <div className="relative h-32 w-full overflow-hidden border-b-2 border-ink">
        <img
          src={displayData.thumbnail}
          alt={displayData.title}
          className="w-full h-full object-cover grayscale opacity-50 contrast-125 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
        />
        
        {/* Difficulty Label */}
        <div className="absolute top-2 left-2">
          <span className="badge-tape">
            {displayData.level}
          </span>
        </div>

        {/* Diagonal "Price" tape for premium */}
        {displayData.isPaid && !hasAccess && (
          <div className="absolute top-4 -right-10 bg-teal-primary text-background font-mono text-[10px] px-10 py-1 rotate-45 border-y border-ink uppercase font-bold">
            Premium
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-6 flex flex-col flex-1 gap-4">
        
        <div className="flex items-center justify-between font-mono text-[10px] text-teal-primary uppercase font-bold tracking-tighter">
          <span>{displayData.category}</span>
          <span className="opacity-30"># {displayData.id.slice(0, 4)}</span>
        </div>

        <h3 className="text-lg font-black uppercase leading-tight group-hover:text-teal-primary transition-colors">
          {displayData.title}
        </h3>

        <p className="text-xs text-dust leading-relaxed font-medium line-clamp-2">
          {displayData.description}
        </p>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t-2 border-dashed border-ink/10 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[8px] font-mono text-dust uppercase">Teacher</span>
            <span className="text-[10px] font-bold uppercase">{displayData.instructorName}</span>
          </div>

          {showActionBtn ? (
            <Link href={actionLink} className="btn-wire text-[10px] px-4 py-1.5 shadow-[2px_2px_0px_0px_rgba(19,21,22,1)]">
              Start
            </Link>
          ) : (
            <Link href="/pricing" className="btn-wire-teal text-[10px] px-4 py-1.5 shadow-[2px_2px_0px_0px_rgba(19,21,22,1)]">
              Unlock ${displayData.price}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
