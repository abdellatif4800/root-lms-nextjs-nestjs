"use client";

import { QuizContent } from "@repo/ui";
import { Suspense } from "react";


export default function StudentQuizPage() {
  return (
    <Suspense fallback={
      <div className="min-h-full flex flex-col items-center justify-center p-20">
        <div className="w-12 h-12 border-4 border-ink border-t-teal-primary rounded-full animate-spin mb-4" />
        <span className="text-[10px] font-mono font-black text-dust uppercase tracking-[0.3em]">
          Preparing Environment...
        </span>
      </div>
    }>
      <QuizContent />
    </Suspense>
  );
}
