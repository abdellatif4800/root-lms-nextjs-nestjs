"use client";

import { UseFormReturn } from "react-hook-form";
import { QuizForm } from "./Quiz.types";

interface QuizEditorPanelProps {
  form: UseFormReturn<QuizForm>;
  isEdit: boolean;
  isSubmitting: boolean;
  onSubmit: () => void;
}

export function QuizEditorPanel({
  form,
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
    <aside
      className="w-72 shrink-0 flex flex-col gap-5 p-5 border rounded-md h-fit sticky top-6"
      style={{ background: "#060a0f", borderColor: "#1e2a38" }}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="block w-0.5 h-5 bg-teal-glow" />
          <h2 className="text-sm font-digital font-bold text-teal-glow tracking-wider uppercase leading-none">
            {isEdit ? "Edit_Quiz" : "New_Quiz"}
          </h2>
        </div>

        {/* Publish toggle */}
        <button
          type="button"
          onClick={() => setValue("publish", !publish)}
          className="text-[9px] font-digital font-black px-2 py-1 border transition-all"
          style={{
            borderColor: publish ? "#34d399" : "#475569",
            color: publish ? "#34d399" : "#475569",
            background: publish ? "#34d39911" : "transparent",
          }}
        >
          {publish ? "[✓] Live" : "Draft"}
        </button>
      </div>

      {/* ── Title ── */}
      <div className="flex flex-col gap-1">
        <label className="text-[9px] font-terminal text-text-secondary uppercase tracking-widest">
          Title
        </label>
        <input
          {...register("title", { required: true })}
          placeholder="Quiz title..."
          className="bg-transparent border px-2 py-1.5 text-sm text-white outline-none rounded"
          style={{ borderColor: errors.title ? "#f87171" : "#1e2a38" }}
        />
        {errors.title && (
          <span className="text-[9px] text-red-400 font-terminal">Required</span>
        )}
      </div>

      {/* ── Description ── */}
      <div className="flex flex-col gap-1">
        <label className="text-[9px] font-terminal text-text-secondary uppercase tracking-widest">
          Description
        </label>
        <textarea
          {...register("description")}
          placeholder="Optional description..."
          rows={3}
          className="bg-transparent border px-2 py-1.5 text-sm text-white outline-none rounded resize-none"
          style={{ borderColor: "#1e2a38" }}
        />
      </div>

      {/* ── Pass Mark ── */}
      <div className="flex flex-col gap-1">
        <label className="text-[9px] font-terminal text-text-secondary uppercase tracking-widest">
          Pass Mark (%)
        </label>
        <input
          type="number"
          {...register("passMark", { min: 0, max: 100, valueAsNumber: true })}
          className="bg-transparent border px-2 py-1.5 text-sm text-white outline-none rounded"
          style={{ borderColor: "#1e2a38" }}
        />
      </div>

      {/* ── Time Limit ── */}
      <div className="flex flex-col gap-1">
        <label className="text-[9px] font-terminal text-text-secondary uppercase tracking-widest">
          Time Limit (min — 0 = none)
        </label>
        <input
          type="number"
          {...register("timeLimit", { min: 0, valueAsNumber: true })}
          className="bg-transparent border px-2 py-1.5 text-sm text-white outline-none rounded"
          style={{ borderColor: "#1e2a38" }}
        />
      </div>

      {/* ── Shuffle ── */}
      <label className="flex items-center gap-3 cursor-pointer group">
        <input
          type="checkbox"
          {...register("shuffleQuestions")}
          className="w-3 h-3 accent-teal-500"
        />
        <span className="text-[10px] font-terminal text-text-secondary uppercase tracking-widest group-hover:text-white transition-colors">
          Shuffle Questions
        </span>
      </label>

      {/* ── Divider ── */}
      <div className="border-t" style={{ borderColor: "#1e2a38" }} />

      {/* ── Submit ── */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitting}
        className="relative overflow-hidden group border border-teal-glow/50 bg-transparent text-teal-glow text-[9px] font-digital font-black uppercase tracking-wider py-3 transition-colors hover:text-black disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <span className="absolute inset-0 bg-teal-glow -translate-x-full group-hover:translate-x-0 transition-transform duration-200 z-0" />
        <span className="relative z-10">
          {isSubmitting
            ? "[ Saving... ]"
            : isEdit
              ? "[ Update_Quiz ]"
              : "[ Create_Quiz ]"}
        </span>
      </button>
    </aside>
  );
}
