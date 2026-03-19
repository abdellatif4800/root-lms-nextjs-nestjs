"use client";

import { useFieldArray, UseFormReturn } from "react-hook-form";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  QuizForm,
  QuestionType,
  defaultQuestion,
  questionTypeColors,
} from "./Quiz.types";

// ─── Sortable wrapper ─────────────────────────────────────────────────────────

function SortableQuestion({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className="relative"
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute left-0 top-0 bottom-0 w-6 flex items-center justify-center cursor-grab active:cursor-grabbing z-10"
        style={{ color: "#334155" }}
      >
        <svg width="10" height="16" viewBox="0 0 10 16" fill="currentColor">
          <circle cx="3" cy="2" r="1.5" /><circle cx="7" cy="2" r="1.5" />
          <circle cx="3" cy="8" r="1.5" /><circle cx="7" cy="8" r="1.5" />
          <circle cx="3" cy="14" r="1.5" /><circle cx="7" cy="14" r="1.5" />
        </svg>
      </div>
      {children}
    </div>
  );
}

// ─── MCQ Options ──────────────────────────────────────────────────────────────

function MCQOptions({ questionIndex, form }: { questionIndex: number; form: UseFormReturn<QuizForm> }) {
  const { register, watch, setValue } = form;
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `questions.${questionIndex}.options`,
  });
  const options = watch(`questions.${questionIndex}.options`);

  const handleSetCorrect = (optionIndex: number) => {
    options.forEach((_, i) => {
      setValue(`questions.${questionIndex}.options.${i}.isCorrect`, i === optionIndex);
    });
  };

  return (
    <div className="flex flex-col gap-2 mt-2">
      <span className="text-[9px] font-terminal text-text-secondary uppercase tracking-widest">
        Options — click circle to mark correct
      </span>
      {fields.map((field, oi) => {
        const isCorrect = watch(`questions.${questionIndex}.options.${oi}.isCorrect`);
        return (
          <div key={field.id} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSetCorrect(oi)}
              className="w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all"
              style={{ borderColor: isCorrect ? "#2dd4bf" : "#334155", background: isCorrect ? "#2dd4bf" : "transparent" }}
            >
              {isCorrect && (
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M1.5 4L3 5.5L6.5 2" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              )}
            </button>
            <input
              {...register(`questions.${questionIndex}.options.${oi}.text`, { required: true })}
              placeholder={`Option ${oi + 1}...`}
              className="flex-1 bg-transparent border px-2 py-1 text-xs text-white outline-none rounded"
              style={{ borderColor: isCorrect ? "#2dd4bf44" : "#1e2a38" }}
            />
            {fields.length > 2 && (
              <button type="button" onClick={() => remove(oi)} className="text-red-500 text-xs px-1 hover:text-white transition-colors">✕</button>
            )}
          </div>
        );
      })}
      {fields.length < 6 && (
        <button
          type="button"
          onClick={() => append({ text: "", isCorrect: false })}
          className="text-[9px] font-terminal text-teal-glow border border-teal-glow/30 px-3 py-1 w-fit hover:bg-teal-glow/10 transition-colors"
        >
          + Add Option
        </button>
      )}
    </div>
  );
}

// ─── Single Question Editor ───────────────────────────────────────────────────

function QuestionEditor({
  questionIndex,
  form,
  onRemove,
}: {
  questionIndex: number;
  form: UseFormReturn<QuizForm>;
  onRemove: () => void;
}) {
  const { register, watch, setValue } = form;
  const questionType = watch(`questions.${questionIndex}.type`);

  const handleTypeChange = (type: QuestionType) => {
    setValue(`questions.${questionIndex}.type`, type);
    setValue(
      `questions.${questionIndex}.options`,
      type === "MCQ"
        ? [{ text: "", isCorrect: false }, { text: "", isCorrect: false }, { text: "", isCorrect: false }, { text: "", isCorrect: false }]
        : []
    );
  };

  return (
    <div className="ml-6 border p-4 rounded-md flex flex-col gap-3" style={{ background: "#0d1117", borderColor: "#1e2a38" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="text-[8px] font-digital font-black px-2 py-0.5 rounded-full"
            style={{ color: questionTypeColors[questionType], border: `1px solid ${questionTypeColors[questionType]}44`, background: `${questionTypeColors[questionType]}11` }}
          >
            {questionType}
          </span>
          <span className="text-[8px] font-terminal text-text-secondary">Q{questionIndex + 1}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-digital font-bold text-teal-glow uppercase tracking-tighter">Points:</span>
          <input
            type="number"
            {...register(`questions.${questionIndex}.points`, { min: 1, valueAsNumber: true, })}
            className="w-14 bg-surface-950 border border-surface-700 text-teal-glow text-xs text-center outline-none px-1 py-1 font-digital focus:border-teal-glow transition-colors"
            min={1}
          />
          <button 
            type="button" 
            onClick={onRemove} 
            className="text-surface-600 hover:text-red-500 text-xs transition-colors ml-1"
            title="Remove Question"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Type selector */}
      <div className="flex gap-1">
        {(["MCQ", "TRUE_OR_FALSE", "ESSAY"] as QuestionType[]).map((t) => (
          <button
            key={t} type="button" onClick={() => handleTypeChange(t)}
            className="text-[8px] font-digital font-black px-2 py-1 border transition-all"
            style={{
              borderColor: questionType === t ? questionTypeColors[t] : "#1e2a38",
              color: questionType === t ? questionTypeColors[t] : "#475569",
              background: questionType === t ? `${questionTypeColors[t]}11` : "transparent",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Question text */}
      <textarea
        {...register(`questions.${questionIndex}.text`, { required: true })}
        placeholder="Question text..."
        rows={2}
        className="bg-transparent border px-2 py-1.5 text-sm text-white outline-none rounded resize-none"
        style={{ borderColor: "#1e2a38" }}
      />

      {/* MCQ */}
      {questionType === "MCQ" && <MCQOptions questionIndex={questionIndex} form={form} />}

      {/* True/False */}
      {questionType === "TRUE_OR_FALSE" && (
        <div className="flex flex-col gap-1">
          <span className="text-[9px] font-terminal text-text-secondary uppercase tracking-widest">Correct Answer</span>
          <div className="flex gap-2">
            {["true", "false"].map((val) => {
              const isSelected = watch(`questions.${questionIndex}.correctBooleanAnswer`) === val;
              return (
                <button
                  key={val} type="button"
                  onClick={() => setValue(`questions.${questionIndex}.correctBooleanAnswer`, val)}
                  className="flex-1 py-1.5 text-[9px] font-digital font-black uppercase tracking-wider border transition-all"
                  style={{ borderColor: isSelected ? "#34d399" : "#1e2a38", color: isSelected ? "#34d399" : "#475569", background: isSelected ? "#34d39911" : "transparent" }}
                >
                  {isSelected ? `[✓] ${val}` : val}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Essay */}
      {questionType === "ESSAY" && (
        <div className="flex flex-col gap-1">
          <span className="text-[9px] font-terminal text-text-secondary uppercase tracking-widest">Model Answer (admin reference only)</span>
          <textarea
            {...register(`questions.${questionIndex}.modelAnswer`)}
            placeholder="Expected answer..."
            rows={3}
            className="bg-transparent border px-2 py-1.5 text-xs text-white outline-none rounded resize-none"
            style={{ borderColor: "#1e2a3866" }}
          />
        </div>
      )}
    </div>
  );
}

// ─── Quiz Editor (exported) ───────────────────────────────────────────────────

export function QuizEditor({ form }: { form: UseFormReturn<QuizForm> }) {
  const { control } = form;
  const { fields, append, remove, move } = useFieldArray({ control, name: "questions" });
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      move(
        fields.findIndex((f) => f.id === active.id),
        fields.findIndex((f) => f.id === over.id)
      );
    }
  };

  return (
    <div className="flex flex-col gap-4 flex-1">
      <div className="flex items-center gap-2">
        <span className="w-3 h-px bg-text-secondary opacity-40" />
        <span className="text-[9px] font-terminal text-text-secondary uppercase tracking-widest">
          Questions ({fields.length})
        </span>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-3">
            {fields.map((field, index) => (
              <SortableQuestion key={field.id} id={field.id}>
                <QuestionEditor questionIndex={index} form={form} onRemove={() => remove(index)} />
              </SortableQuestion>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {fields.length === 0 && (
        <div className="text-center py-10 border border-dashed text-text-secondary text-xs font-terminal" style={{ borderColor: "#1e2a38" }}>
          No questions yet — add one below
        </div>
      )}

      {/* Add question buttons */}
      <div className="flex gap-2 flex-wrap">
        {([
          { type: "MCQ", label: "MCQ", color: "#38bdf8" },
          { type: "TRUE_OR_FALSE", label: "True/False", color: "#34d399" },
          { type: "ESSAY", label: "Essay", color: "#a855f7" },
        ] as { type: QuestionType; label: string; color: string }[]).map(({ type, label, color }) => (
          <button
            key={type} type="button"
            onClick={() => append(defaultQuestion(type))}
            className="text-[9px] font-digital font-black px-3 py-1.5 border transition-all hover:opacity-80"
            style={{ borderColor: `${color}44`, color, background: `${color}0d` }}
          >
            + {label}
          </button>
        ))}
      </div>
    </div>
  );
}
