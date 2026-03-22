"use client";

import { UseFormReturn } from "react-hook-form";
import { QuizForm, QuestionType, defaultQuestion } from "./Quiz.types";

interface QuizEditorPanelProps {
  form: UseFormReturn<QuizForm>;
  appendQuestion: (data: any) => void;
  isEdit: boolean;
  isSubmitting: boolean;
  onSubmit: () => void;
}

export function QuizEditorPanel({
  form,
  appendQuestion,
  isEdit,
  isSubmitting,
  onSubmit,
}: QuizEditorPanelProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const publish = watch("publish");

  return (
    <aside className="w-80 shrink-0 h-full flex flex-col bg-surface border-r-2 border-ink overflow-hidden font-sans">
      {/* Sidebar Header */}
      <div className="p-4 border-b-2 border-ink bg-background/30 space-y-4">
        <div className="flex flex-col gap-2">
           <span className="badge-tape w-fit">Quiz Controls</span>
           <h2 className="text-xl font-black uppercase tracking-tighter">
             {isEdit ? "Edit Blueprint" : "New Blueprint"}
           </h2>
        </div>

        <div className="flex items-center justify-between">
           <span className="text-[10px] font-mono font-black text-dust uppercase tracking-widest">Visibility_Status:</span>
           <button
             type="button"
             onClick={() => setValue("publish", !publish)}
             className={`text-[9px] font-mono font-black px-3 py-1 border-2 transition-all uppercase tracking-widest ${publish ? 'border-teal-primary text-teal-primary bg-teal-primary/5' : 'border-ink/20 text-dust hover:border-ink/40'}`}
           >
             {publish ? "[✓] LIVE_SYNC" : "[DRAFT_ONLY]"}
           </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-8">
        {/* Module Palette (Add Question) */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-mono font-black uppercase text-dust tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 bg-teal-primary" />
            Module Palette
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {([
              { type: "MCQ", label: "Multiple Choice", color: "#38bdf8" },
              { type: "TRUE_OR_FALSE", label: "True / False", color: "#34d399" },
              { type: "ESSAY", label: "Essay / Long Form", color: "#a855f7" },
            ] as { type: QuestionType; label: string; color: string }[]).map(({ type, label, color }) => (
              <button
                key={type} 
                type="button"
                onClick={() => appendQuestion(defaultQuestion(type))}
                className="group flex items-center justify-between border-2 p-3 hover:bg-background/50 transition-all text-left"
                style={{ borderColor: `${color}44` }}
              >
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono font-black uppercase" style={{ color }}>{type}</span>
                  <span className="text-[8px] font-mono font-bold text-dust uppercase">{label}</span>
                </div>
                <span className="text-xl opacity-20 group-hover:opacity-100 transition-opacity" style={{ color }}>+</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quiz Metadata */}
        <div className="space-y-6 pt-6 border-t-2 border-ink/5">
          <h3 className="text-[10px] font-mono font-black uppercase text-dust tracking-widest">Global Configuration</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[9px] font-mono font-black text-dust uppercase tracking-widest pl-1">Title_String</label>
              <input
                {...register("title", { required: true })}
                placeholder="ENTER_QUIZ_TITLE..."
                className={`w-full bg-background border-2 px-3 py-2 text-xs font-bold font-mono outline-none focus:ring-2 focus:ring-teal-primary/20 ${errors.title ? 'border-red-500' : 'border-ink'}`}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-mono font-black text-dust uppercase tracking-widest pl-1">Blueprint_Description</label>
              <textarea
                {...register("description")}
                placeholder="OPTIONAL_SPEC_DESCRIPTION..."
                rows={3}
                className="w-full bg-background border-2 border-ink px-3 py-2 text-xs font-bold font-mono outline-none focus:ring-2 focus:ring-teal-primary/20 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-[8px] font-mono font-black text-dust uppercase tracking-widest pl-1">Pass_Mark (%)</label>
                <input
                  type="number"
                  {...register("passMark", { min: 0, max: 100, valueAsNumber: true })}
                  className="w-full bg-background border-2 border-ink px-3 py-2 text-xs font-bold font-mono outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[8px] font-mono font-black text-dust uppercase tracking-widest pl-1">Time_Limit (m)</label>
                <input
                  type="number"
                  {...register("timeLimit", { min: 0, valueAsNumber: true })}
                  className="w-full bg-background border-2 border-ink px-3 py-2 text-xs font-bold font-mono outline-none"
                />
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer group py-2">
              <input
                type="checkbox"
                {...register("shuffleQuestions")}
                className="w-4 h-4 accent-teal-primary border-2 border-ink"
              />
              <span className="text-[9px] font-mono font-black text-dust uppercase tracking-widest group-hover:text-ink transition-colors">
                Shuffle_Question_Order
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 border-t-2 border-ink bg-background/30">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full btn-wire-teal py-4 text-[10px] font-black tracking-widest uppercase"
        >
          {isSubmitting
            ? "[ SYNCHRONIZING... ]"
            : isEdit
              ? "[ UPDATE_BLUEPRINT ]"
              : "[ INITIALIZE_BLUEPRINT ]"}
        </button>
        {Object.keys(errors).length > 0 && (
           <p className="text-[8px] font-mono font-black text-red-500 uppercase mt-2 text-center">
             System_Error: Required fields missing.
           </p>
        )}
      </div>
    </aside>
  );
}
