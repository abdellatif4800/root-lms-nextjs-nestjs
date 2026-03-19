"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
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

  // ─── Mutations ───
  const createMutation = useMutation({
    mutationFn: (input: any) => createQuiz(input),
    onSuccess: (res: any) => {
      qc.invalidateQueries({ queryKey: ["allQuizzes"] });
      // redirect to list after create
      router.replace(
        `/quizzes/list`
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: (input: any) => updateQuiz(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["quizById", quizId] });
      qc.invalidateQueries({ queryKey: ["allQuizzes"] });
    },
  });

  // ─── Form ───
  const form = useForm<QuizForm>({
    defaultValues: {
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      passMark: initialData?.passMark ?? 70,
      timeLimit: initialData?.timeLimit ?? 0,
      shuffleQuestions: initialData?.shuffleQuestions ?? false,
      publish: initialData?.publish ?? false,
      questions: initialData?.questions ?? [],
    },
  });

  // ─── Submit ───
  const handleSubmit: SubmitHandler<QuizForm> = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        ...(isEdit && { id: quizId }),
        questions: data.questions.map((q: QuestionForm, i: number) => ({
          ...q,
          order: i,
          points: parseInt(String(q.points), 10), // ✅ string → Int
          options: q.options.map((o: OptionForm, oi: number) => ({ ...o, order: oi })),
        })),
      };

      if (isEdit) {
        await updateMutation.mutateAsync(payload);
      } else {
        await createMutation.mutateAsync(payload);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-surface-950 p-8">
      <div className="w-full max-w-6xl mx-auto flex gap-6 items-start">
        {/* ── Left: meta panel ── */}
        <QuizEditorPanel
          form={form}
          isEdit={isEdit}
          isSubmitting={isSubmitting}
          onSubmit={form.handleSubmit(handleSubmit)}
        />

        {/* ── Right: questions editor ── */}
        <div className="flex-1 min-w-0">
          <QuizEditor form={form} />
        </div>
      </div>
    </div>
  );
}
