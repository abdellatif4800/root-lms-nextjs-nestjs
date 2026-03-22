"use client";

import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getQuizById, createQuiz, updateQuiz } from "@repo/gql";
import { QuizForm, QuestionForm, OptionForm } from "./Quiz.types";
import { QuizEditor } from "./QuizEditor";
import { QuizEditorPanel } from "./QuizEditorPanel";

interface QuizEditorRootProps {
  editOrCreate: "edit" | "create";
  quizId?: string;
}

export function QuizEditorRoot({
  editOrCreate,
  quizId,
}: QuizEditorRootProps) {
  const isEdit = editOrCreate === "edit" && !!quizId;
  const router = useRouter();
  const qc = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ─── Fetch existing quiz (edit mode) ───
  const { data: quizData } = useQuery({
    queryKey: ["quizById", quizId],
    queryFn: () => getQuizById(quizId!),
    enabled: isEdit,
  });

  const initialData = isEdit ? (quizData as any) : undefined;

  // ─── Form ───
  const form = useForm<QuizForm>({
    defaultValues: {
      title: "",
      description: "",
      passMark: 70,
      timeLimit: 0,
      shuffleQuestions: false,
      publish: false,
      questions: [],
    },
  });

  const { reset, control, handleSubmit } = form;

  // Manage Field Array at the Root to ensure sync between Panel (append) and Editor (display)
  const fieldArray = useFieldArray({
    control,
    name: "questions",
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title ?? "",
        description: initialData.description ?? "",
        passMark: initialData.passMark ?? 70,
        timeLimit: initialData.timeLimit ?? 0,
        shuffleQuestions: initialData.shuffleQuestions ?? false,
        publish: initialData.publish ?? false,
        questions: initialData.questions ?? [],
      });
    }
  }, [initialData, reset]);

  // ─── Mutations ───
  const createMutation = useMutation({
    mutationFn: (input: any) => createQuiz(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allQuizzes"] });
      router.replace(`/quizzes/list`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (input: any) => updateQuiz(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["quizById", quizId] });
      qc.invalidateQueries({ queryKey: ["allQuizzes"] });
    },
  });

  // ─── Submit ───
  const onFormSubmit: SubmitHandler<QuizForm> = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        ...(isEdit && { id: quizId }),
        questions: data.questions.map((q: QuestionForm, i: number) => ({
          ...q,
          order: i,
          points: parseInt(String(q.points), 10),
          options: q.options.map((o: OptionForm, oi: number) => ({ ...o, order: oi })),
        })),
      };

      if (isEdit) {
        await updateMutation.mutateAsync(payload);
      } else {
        await createMutation.mutateAsync(payload);
      }
    } catch (error) {
       console.error("Submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-row h-[calc(100vh-10rem)] w-full p-2 bg-background gap-4 overflow-hidden">
      {/* ── Sidebar: Config & Palette ── */}
      <QuizEditorPanel
        form={form}
        appendQuestion={fieldArray.append}
        isEdit={isEdit}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit(onFormSubmit)}
      />

      {/* ── Main: Workspace ── */}
      <div className="flex-1 min-h-0 border-2 border-ink bg-surface shadow-wire relative overflow-hidden flex flex-col">
        <div className="p-3 border-b-2 border-ink bg-surface/50 flex justify-between items-center z-10">
          <h3 className="font-mono font-black text-teal-primary text-sm tracking-widest uppercase">
             Architectural_Questionnaire
          </h3>
          <span className="text-[10px] font-mono font-black text-dust uppercase tracking-[0.2em] opacity-60">
            Mode: Interactive_Drafting
          </span>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <QuizEditor 
            form={form} 
            fields={fieldArray.fields} 
            removeQuestion={fieldArray.remove} 
            moveQuestion={fieldArray.move} 
          />
        </div>

        {/* Bottom Decoration */}
        <div className="absolute bottom-4 right-4 z-10 pointer-events-none text-right">
          <span className="block text-[8px] font-mono font-black text-dust uppercase tracking-[0.3em]">
            SYSTEM: QUIZ_CORE_V2.0
          </span>
          <span className="block text-[8px] font-mono font-bold text-dust/30 uppercase">
            Data_Sync: Active
          </span>
        </div>
      </div>
    </div>
  );
}
