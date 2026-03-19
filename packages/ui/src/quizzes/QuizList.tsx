"use client";
import Link from "next/link";

interface QuizListProps {
  quizzes: any[];
  isAdmin?: boolean;
}

export function QuizList({ quizzes, isAdmin = false }: QuizListProps) {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar relative">
      {/* Grid — responsive layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 sm:p-6 relative z-10">
        {quizzes.map((quiz, i) => (
          <div
            key={quiz.id}
            className="opacity-0 animate-[fadeSlideIn_0.35s_ease_forwards] group"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div className="relative bg-surface-900 border border-surface-800 p-5 transition-all duration-300 hover:border-teal-glow hover:shadow-[0_0_20px_rgba(45,212,191,0.05)] [clip-path:polygon(0_0,calc(100%-15px)_0,100%_15px,100%_100%,15px_100%,0_calc(100%-15px))]">
              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-8 h-8 bg-surface-800 [clip-path:polygon(100%_0,0_0,100%_100%)] opacity-40 group-hover:bg-teal-glow transition-colors" />
              
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <span className="text-[8px] font-digital font-black text-teal-glow/50 uppercase tracking-[0.2em]">
                    ID_{quiz.id.slice(0, 8)}
                  </span>
                  {quiz.publish ? (
                    <span className="text-[7px] font-digital font-black px-1.5 py-0.5 bg-emerald-glow/10 text-emerald-glow border border-emerald-glow/20 uppercase tracking-widest">
                      Live
                    </span>
                  ) : (
                    <span className="text-[7px] font-digital font-black px-1.5 py-0.5 bg-surface-700 text-text-secondary border border-surface-600 uppercase tracking-widest">
                      Draft
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-digital font-black text-text-primary uppercase tracking-wide group-hover:text-teal-glow transition-colors line-clamp-1">
                  {quiz.title}
                </h3>

                <p className="text-[10px] font-terminal text-text-secondary line-clamp-2 min-h-[30px] opacity-70">
                  {quiz.description || "NO_DESCRIPTION_PROVIDED..."}
                </p>

                <div className="flex items-center gap-4 mt-1">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[7px] font-terminal text-text-secondary uppercase tracking-widest opacity-40">Questions</span>
                    <span className="text-[10px] font-digital font-black text-text-primary">
                      {quiz.questions?.length || 0}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[7px] font-terminal text-text-secondary uppercase tracking-widest opacity-40">Pass Mark</span>
                    <span className="text-[10px] font-digital font-black text-purple-glow">
                      {quiz.passMark}%
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-surface-800 flex gap-2">
                  {isAdmin ? (
                    <Link
                      href={{
                        pathname: "/quizzes/quizEditor",
                        query: { editOrCreate: "edit", quizId: quiz.id },
                      }}
                      className="flex-1 text-center py-2 bg-surface-800 border border-surface-700 text-[9px] font-digital font-black text-text-secondary uppercase tracking-widest hover:bg-teal-glow hover:text-black hover:border-teal-glow transition-all active:translate-y-px"
                    >
                      [ Edit_Quiz ]
                    </Link>
                  ) : (
                    <Link
                      href={`/quizzes/${quiz.id}`}
                      className="flex-1 text-center py-2 bg-teal-glow text-black text-[9px] font-digital font-black uppercase tracking-widest hover:bg-white transition-all active:translate-y-px shadow-glow-teal-sm"
                    >
                      [ Start_Sequence ]
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {quizzes.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
          <span className="text-[10px] font-terminal text-text-secondary uppercase tracking-[0.3em] opacity-40">
            // NO_QUIZZES_INITIALIZED
          </span>
          <span className="text-xs font-digital text-teal-glow opacity-20 animate-pulse">_</span>
        </div>
      )}
    </div>
  );
}
