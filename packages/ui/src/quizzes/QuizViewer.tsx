"use client";
import { useState } from "react";
import { QuestionType } from "./Quiz.types";

interface QuizViewerProps {
  quiz: any;
  onComplete: (results: { score: number; answers: any[] }) => void;
}

export function QuizViewer({ quiz, onComplete }: QuizViewerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [quizFinished, setQuizFinished] = useState(false);

  const questions = quiz.questions || [];
  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswer = (answer: any) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answer;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      finishQuiz();
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const finishQuiz = () => {
    // Calculate score
    let totalPoints = 0;
    let earnedPoints = 0;

    questions.forEach((q: any, i: number) => {
      totalPoints += q.points;
      const studentAnswer = answers[i];

      if (q.type === "MCQ") {
        const correctOption = q.options?.find((o: any) => o.isCorrect);
        if (correctOption && studentAnswer === correctOption.id) {
          earnedPoints += q.points;
        }
      } else if (q.type === "TRUE_OR_FALSE") {
        if (studentAnswer === q.correctBooleanAnswer) {
          earnedPoints += q.points;
        }
      }
      // Essay is usually manually graded or compared to model answer
      // For now, let's just mark it as 0 until graded or handled differently
    });

    const finalScore = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    setQuizFinished(true);
    onComplete({ score: finalScore, answers });
  };

  if (questions.length === 0) {
    return (
      <div className="p-10 text-center border border-dashed border-surface-700">
        <span className="text-xs font-terminal text-text-secondary uppercase">
          // NO_QUESTIONS_IN_THIS_SEQUENCE
        </span>
      </div>
    );
  }

  if (quizFinished) {
    return (
      <div className="flex flex-col items-center justify-center p-10 gap-6 bg-surface-900 border border-teal-glow/30 [clip-path:polygon(0_0,calc(100%-20px)_0,100%_20px,100%_100%,20px_100%,0_calc(100%-20px))]">
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] font-terminal text-teal-glow uppercase tracking-[0.3em]">
            // SEQUENCE_COMPLETE
          </span>
          <h2 className="text-2xl font-digital font-black text-text-primary uppercase">
            Assessment Results
          </h2>
        </div>

        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="64" cy="64" r="60"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="4"
              className="text-surface-800"
            />
            <circle
              cx="64" cy="64" r="60"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="4"
              strokeDasharray={377}
              strokeDashoffset={377 - (377 * 80) / 100} // Placeholder for score
              className="text-teal-glow shadow-glow-teal"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-digital font-black text-white">??%</span>
            <span className="text-[8px] font-terminal text-text-secondary uppercase">Final_Score</span>
          </div>
        </div>

        <p className="text-xs font-terminal text-text-secondary text-center max-w-xs opacity-70">
          Your response data has been encrypted and transmitted to the central processing unit.
        </p>

        <button
          onClick={() => window.location.href = "/progress"}
          className="px-8 py-3 bg-teal-glow text-black text-[10px] font-digital font-black uppercase tracking-widest hover:bg-white transition-all shadow-glow-teal-sm"
        >
          [ Return_To_Progress ]
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
      {/* ── Progress Bar ── */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-end">
          <span className="text-[9px] font-terminal text-text-secondary uppercase tracking-[0.2em]">
            Processing Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span className="text-[10px] font-digital font-black text-teal-glow">
            {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
          </span>
        </div>
        <div className="h-1 bg-surface-800 w-full overflow-hidden">
          <div
            className="h-full bg-teal-glow transition-all duration-300 shadow-glow-teal-sm"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* ── Question Card ── */}
      <div className="bg-surface-900 border border-surface-800 p-8 relative overflow-hidden [clip-path:polygon(0_0,calc(100%-20px)_0,100%_20px,100%_100%,20px_100%,0_calc(100%-20px))]">
        {/* Left accent */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-glow shadow-glow-purple-sm" />
        
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-start">
            <span className="px-2 py-0.5 bg-surface-800 border border-surface-700 text-[8px] font-digital font-black text-purple-glow uppercase tracking-widest">
              Type: {currentQuestion.type}
            </span>
            <span className="text-[9px] font-terminal text-text-secondary uppercase">
              Weight: {currentQuestion.points} pts
            </span>
          </div>

          <h2 className="text-lg font-terminal text-text-primary leading-relaxed">
            {currentQuestion.text}
          </h2>

          {/* ── Options ── */}
          <div className="flex flex-col gap-3 mt-4">
            {currentQuestion.type === "MCQ" && currentQuestion.options?.map((option: any) => (
              <button
                key={option.id}
                onClick={() => handleAnswer(option.id)}
                className={`
                  w-full text-left p-4 border transition-all duration-200 font-terminal text-sm relative group
                  ${answers[currentQuestionIndex] === option.id
                    ? "bg-teal-glow/10 border-teal-glow text-teal-glow"
                    : "bg-surface-950 border-surface-700 text-text-secondary hover:border-surface-500 hover:text-text-primary"
                  }
                `}
              >
                <div className={`
                  absolute left-0 top-0 bottom-0 w-1 transition-all
                  ${answers[currentQuestionIndex] === option.id ? "bg-teal-glow" : "bg-transparent group-hover:bg-surface-700"}
                `} />
                {option.text}
              </button>
            ))}

            {currentQuestion.type === "TRUE_OR_FALSE" && (
              <div className="flex gap-4">
                {["true", "false"].map((val) => (
                  <button
                    key={val}
                    onClick={() => handleAnswer(val)}
                    className={`
                      flex-1 py-4 border transition-all duration-200 font-digital font-black uppercase tracking-widest text-sm relative group
                      ${answers[currentQuestionIndex] === val
                        ? "bg-teal-glow/10 border-teal-glow text-teal-glow"
                        : "bg-surface-950 border-surface-700 text-text-secondary hover:border-surface-500 hover:text-text-primary"
                      }
                    `}
                  >
                    {val}
                  </button>
                ))}
              </div>
            )}

            {currentQuestion.type === "ESSAY" && (
              <textarea
                className="w-full bg-surface-950 border border-surface-700 p-4 font-terminal text-sm text-white outline-none focus:border-teal-glow h-32 resize-none"
                placeholder="Initialize response stream..."
                value={answers[currentQuestionIndex] || ""}
                onChange={(e) => handleAnswer(e.target.value)}
              />
            )}
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={prevQuestion}
          disabled={currentQuestionIndex === 0}
          className="px-6 py-2 border border-surface-700 text-[10px] font-digital font-black text-text-secondary uppercase tracking-widest hover:text-teal-glow hover:border-teal-glow disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          [ PREV_QUERY ]
        </button>

        <button
          onClick={nextQuestion}
          disabled={!answers[currentQuestionIndex]}
          className="px-10 py-3 bg-teal-glow text-black text-[10px] font-digital font-black uppercase tracking-widest hover:bg-white transition-all active:translate-y-px shadow-glow-teal-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {currentQuestionIndex === questions.length - 1 ? "[ FINALIZE_DATA ]" : "[ NEXT_QUERY ]"}
        </button>
      </div>
    </div>
  );
}
