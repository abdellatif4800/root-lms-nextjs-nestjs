"use client";
import { useRouter } from "next/navigation";

export const QuizHeader = () => {
  const router = useRouter();

  return (
    <div className="w-full shrink-0 flex items-center gap-3 px-4 sm:px-6 py-3 border-b-2 border-ink bg-surface shadow-wire relative z-20">
      <div className="w-full  pb-4 border-b-2 border-ink flex items-center justify-between font-sans">

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 border-2 border-ink bg-surface flex items-center justify-center text-xl shadow-[2px_2px_0px_0px_rgba(19,21,22,1)]">
            📋
          </div>
          <div className="flex flex-col">
            <span className="badge-tape w-fit">Active Session</span>
            <span className="text-[10px] font-mono font-black uppercase text-dust tracking-widest mt-1">
              Knowledge_Assessment_V1
            </span>
          </div>
        </div>

        <button
          onClick={() => router.back()}
          className="btn-wire flex items-center gap-2 px-6 py-2.5 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/10 hover:text-red-500 hover:border-red-500 transition-all shadow-[4px_4px_0px_0px_rgba(19,21,22,1)] active:translate-y-0.5 active:shadow-none"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
          Cancel Assessment
        </button>
      </div>
    </div>
  );
};
