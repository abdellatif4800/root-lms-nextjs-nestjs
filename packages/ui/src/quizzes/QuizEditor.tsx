"use client";

import { UseFormReturn, FieldArrayWithId, useFieldArray } from "react-hook-form";
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
        className="absolute left-[-24px] top-0 bottom-0 w-6 flex items-center justify-center cursor-grab active:cursor-grabbing z-10 opacity-30 hover:opacity-100"
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
  const { register, watch, setValue, control } = form;
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${questionIndex}.options`,
  });

  const handleSetCorrect = (optionIndex: number) => {
    fields.forEach((_, i) => {
      setValue(`questions.${questionIndex}.options.${i}.isCorrect`, i === optionIndex);
    });
  };

  return (
    <div className="flex flex-col gap-3 mt-4 border-l-2 border-ink/10 pl-4 py-1">
      <span className="text-[9px] font-mono font-black text-dust uppercase tracking-widest flex items-center gap-2">
        <span className="w-1.5 h-px bg-dust" />
        Option_Config — [Mark Correct]
      </span>
      <div className="grid grid-cols-1 gap-2">
        {fields.map((field, oi) => {
          const isCorrect = watch(`questions.${questionIndex}.options.${oi}.isCorrect`);
          return (
            <div key={field.id} className="flex items-center gap-3 group">
              <button
                type="button"
                onClick={() => handleSetCorrect(oi)}
                className={`w-5 h-5 border-2 flex items-center justify-center shrink-0 transition-all ${isCorrect ? 'border-teal-primary bg-teal-primary text-background' : 'border-ink/20 hover:border-ink/40'}`}
              >
                {isCorrect && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M2 6L5 9L10 3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
              <div className="flex-1 flex items-center bg-background/50 border-2 border-ink/10 hover:border-ink/20 transition-all">
                 <input
                   {...register(`questions.${questionIndex}.options.${oi}.text`, { required: true })}
                   placeholder={`OPTION_STRING_${oi + 1}...`}
                   className="flex-1 bg-transparent px-3 py-1.5 text-xs text-ink font-mono outline-none"
                 />
                 {fields.length > 2 && (
                   <button 
                     type="button" 
                     onClick={() => remove(oi)} 
                     className="px-3 text-red-500 hover:bg-red-500/10 h-full text-xs font-black transition-all"
                   >
                     ✕
                   </button>
                 )}
              </div>
            </div>
          );
        })}
      </div>
      {fields.length < 6 && (
        <button
          type="button"
          onClick={() => append({ text: "", isCorrect: false })}
          className="text-[9px] font-mono font-black text-teal-primary uppercase tracking-widest border-2 border-teal-primary/20 px-3 py-1.5 w-fit hover:bg-teal-primary/5 transition-all mt-1"
        >
          + ADD_OPTION_SLOT
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
    <div className="border-2 border-ink p-5 bg-surface shadow-sm relative animate-[fadeSlideIn_0.3s_ease_forwards]">
      {/* Drafting Corner Decor */}
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-ink/20" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span
            className="text-[9px] font-mono font-black px-2 py-1 uppercase tracking-widest"
            style={{ 
              color: 'white', 
              backgroundColor: questionTypeColors[questionType] 
            }}
          >
            {questionType}
          </span>
          <span className="text-[10px] font-mono font-black text-dust uppercase tracking-widest">Question_Ref: Q{questionIndex + 1}</span>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2">
             <label className="text-[9px] font-mono font-black text-dust uppercase tracking-widest opacity-60">Weight:</label>
             <input
               type="number"
               {...register(`questions.${questionIndex}.points`, { min: 1, valueAsNumber: true, })}
               className="w-20 bg-background border-2 border-ink text-ink text-[10px] text-center font-mono py-1 focus:outline-none focus:ring-2 focus:ring-teal-primary/20"
               min={1}
             />
           </div>
           <button 
             type="button" 
             onClick={onRemove} 
             className="text-dust hover:text-red-500 text-xs font-black transition-colors"
           >
             [ DISCARD ]
           </button>
        </div>
      </div>

      {/* Type Switcher */}
      <div className="flex gap-1 mb-4">
        {(["MCQ", "TRUE_OR_FALSE", "ESSAY"] as QuestionType[]).map((t) => (
          <button
            key={t} 
            type="button" 
            onClick={() => handleTypeChange(t)}
            className={`text-[8px] font-mono font-black px-2 py-1 border-2 transition-all uppercase tracking-widest ${questionType === t ? 'border-teal-primary text-teal-primary bg-teal-primary/5' : 'border-ink/10 text-dust hover:border-ink/30'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Question Text */}
      <div className="space-y-2">
        <label className="block text-[9px] font-mono font-black text-dust uppercase tracking-widest opacity-60">Content_Prompt</label>
        <textarea
          {...register(`questions.${questionIndex}.text`, { required: true })}
          placeholder="ENTER_QUESTION_TEXT_PROMPT..."
          rows={2}
          className="w-full bg-background border-2 border-ink px-3 py-2 text-sm text-ink font-mono outline-none focus:ring-2 focus:ring-teal-primary/20 resize-none transition-all"
        />
      </div>

      {/* MCQ */}
      {questionType === "MCQ" && <MCQOptions questionIndex={questionIndex} form={form} />}

      {/* True/False */}
      {questionType === "TRUE_OR_FALSE" && (
        <div className="mt-4 space-y-3">
          <span className="text-[9px] font-mono font-black text-dust uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-px bg-dust" />
            Boolean_Logic_Setting
          </span>
          <div className="grid grid-cols-2 gap-3">
            {["true", "false"].map((val) => {
              const isSelected = watch(`questions.${questionIndex}.correctBooleanAnswer`) === val;
              return (
                <button
                  key={val} 
                  type="button"
                  onClick={() => setValue(`questions.${questionIndex}.correctBooleanAnswer`, val)}
                  className={`py-2 text-[10px] font-mono font-black uppercase tracking-widest border-2 transition-all ${isSelected ? 'border-teal-primary text-teal-primary bg-teal-primary/5' : 'border-ink/10 text-dust'}`}
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
        <div className="mt-4 space-y-2">
          <span className="text-[9px] font-mono font-black text-dust uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-px bg-dust" />
            Structural_Key_Reference
          </span>
          <textarea
            {...register(`questions.${questionIndex}.modelAnswer`)}
            placeholder="ENTER_EXPECTED_SOLUTION_KEY..."
            rows={3}
            className="w-full bg-background border-2 border-ink px-3 py-2 text-xs text-ink font-mono outline-none focus:ring-2 focus:ring-teal-primary/20 resize-none transition-all"
          />
        </div>
      )}
    </div>
  );
}

// ─── Quiz Editor (exported) ───────────────────────────────────────────────────

interface QuizEditorProps {
  form: UseFormReturn<QuizForm>;
  fields: FieldArrayWithId<QuizForm, "questions", "id">[];
  removeQuestion: (index: number) => void;
  moveQuestion: (from: number, to: number) => void;
}

export function QuizEditor({ form, fields, removeQuestion, moveQuestion }: QuizEditorProps) {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      moveQuestion(
        fields.findIndex((f) => f.id === active.id),
        fields.findIndex((f) => f.id === over.id)
      );
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-between border-b-2 border-ink pb-4">
        <h2 className="text-xl font-mono font-black text-ink uppercase tracking-tighter">
          Blueprint_Questions
        </h2>
        <div className="flex items-center gap-3 text-[10px] font-mono font-black text-dust uppercase tracking-widest">
           <span className="flex items-center gap-1">
             <span className="w-2 h-2 bg-ink" />
             Count: {fields.length}
           </span>
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-6 pl-6">
            {fields.map((field, index) => (
              <SortableQuestion key={field.id} id={field.id}>
                <QuestionEditor questionIndex={index} form={form} onRemove={() => removeQuestion(index)} />
              </SortableQuestion>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {fields.length === 0 && (
        <div className="text-center py-32 border-2 border-ink border-dashed flex flex-col items-center justify-center gap-4 bg-background/50">
          <span className="text-3xl opacity-20">📝</span>
          <span className="text-[10px] font-mono font-black uppercase text-dust tracking-widest">Workspace_Empty — Initialize questions via sidebar palette.</span>
        </div>
      )}

      {/* Bottom Padding */}
      <div className="h-20" />
    </div>
  );
}
