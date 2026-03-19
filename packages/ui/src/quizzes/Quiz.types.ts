export type QuestionType = "MCQ" | "TRUE_OR_FALSE" | "ESSAY";

export interface OptionForm {
  id?: string;
  text: string;
  isCorrect: boolean;
  order?: number;
}

export interface QuestionForm {
  id?: string;
  text: string;
  type: QuestionType;
  points: number;
  order?: number;
  modelAnswer?: string;
  correctBooleanAnswer?: string;
  options: OptionForm[];
}

export interface QuizForm {
  title: string;
  description?: string;
  passMark: number;
  timeLimit: number;
  shuffleQuestions: boolean;
  publish: boolean;
  questions: QuestionForm[];
}

export const defaultQuestion = (type: QuestionType = "MCQ"): QuestionForm => ({
  text: "",
  type,
  points: 1,
  options:
    type === "MCQ"
      ? [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ]
      : [],
  modelAnswer: "",
  correctBooleanAnswer: "true",
});

export const questionTypeColors: Record<QuestionType, string> = {
  MCQ: "#38bdf8",
  TRUE_OR_FALSE: "#34d399",
  ESSAY: "#a855f7",
};
