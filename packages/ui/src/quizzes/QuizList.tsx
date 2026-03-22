"use client";
import Link from "next/link";

interface QuizListProps {
  quizzes: any[];
  isAdmin?: boolean;
}

export function QuizList({ quizzes, isAdmin = false }: QuizListProps) {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar relative font-sans">
      {/* Grid — responsive layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-6 relative z-10">
        {quizzes.map((quiz, i) => (
          <div
            key={quiz.id}
            className="opacity-0 animate-[fadeSlideIn_0.35s_ease_forwards] flex"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div className="wire-card group flex flex-col w-full h-full hover:border-teal-primary hover:shadow-wire-teal transition-all overflow-hidden relative">
              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-ink opacity-10 group-hover:opacity-30 transition-opacity" />
              
              <div className="p-6 flex flex-col gap-4 flex-1">
                {/* ID & Status */}
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono font-black text-dust uppercase tracking-widest">
                    ID_{quiz.id.slice(0, 8)}
                  </span>
                  {quiz.publish ? (
                    <span className="badge-tape bg-teal-primary">Live</span>
                  ) : (
                    <span className="badge-tape opacity-40">Draft</span>
                  )}
                </div>

                {/* Title & Description */}
                <div className="space-y-2">
                  <h3 className="text-lg font-black text-ink uppercase tracking-tighter leading-none group-hover:text-teal-primary transition-colors line-clamp-2">
                    {quiz.title}
                  </h3>
                  <p className="text-[11px] font-mono font-medium text-dust line-clamp-3 leading-relaxed opacity-80">
                    {quiz.description || "NO_SPEC_DESCRIPTION_AVAILABLE..."}
                  </p>
                </div>

                {/* Technical Specs */}
                <div className="mt-auto pt-6 border-t-2 border-dashed border-ink/5 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-mono font-black text-dust uppercase tracking-[0.2em] opacity-40">Questions</span>
                    <span className="text-[11px] font-mono font-black text-ink">
                      {quiz.questions?.length || 0} MODULES
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[8px] font-mono font-black text-dust uppercase tracking-[0.2em] opacity-40">Pass_Threshold</span>
                    <span className="text-[11px] font-mono font-black text-teal-primary">
                      {quiz.passMark}%
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4">
                  {isAdmin ? (
                    <Link
                      href={{
                        pathname: "/quizzes/quizEditor",
                        query: { editOrCreate: "edit", quizId: quiz.id },
                      }}
                      className="btn-wire block w-full text-center text-[10px] py-2.5"
                    >
                      [ EDIT_BLUEPRINT ]
                    </Link>
                  ) : (
                    <Link
                      href={`/quizzes/${quiz.id}`}
                      className="btn-wire-teal block w-full text-center text-[10px] py-2.5"
                    >
                      [ INITIALIZE_SEQUENCE → ]
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
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
          <div className="wire-card border-dashed p-12 max-w-md w-full flex flex-col items-center gap-4 bg-background/50">
            <span className="text-3xl opacity-20">📭</span>
            <div className="text-center space-y-1">
              <span className="block text-[10px] font-mono font-black text-ink uppercase tracking-[0.3em]">
                // NO_DATA_INITIALIZED
              </span>
              <span className="block text-[10px] font-mono font-bold text-dust uppercase">
                System_Status: Awaiting_Input
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
