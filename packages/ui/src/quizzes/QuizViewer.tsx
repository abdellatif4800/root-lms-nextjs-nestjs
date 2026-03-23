"use client";
import { useState } from "react";
import Link from "next/link";

interface QuizViewerProps {
  quiz: any;
  onComplete: (results: { score: number; answers: any[] }) => void;
  userId: string
}

export function QuizViewer({ quiz, onComplete, userId }: QuizViewerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [quizFinished, setQuizFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

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
    });

    const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    setFinalScore(score);
    setQuizFinished(true);
    onComplete({ score, answers });
  };

  if (questions.length === 0) {
    return (
      <div className="py-20 text-center border-2 border-ink border-dashed">
        <span className="text-xs font-bold text-dust uppercase tracking-widest">
          No questions found in this assessment.
        </span>
      </div>
    );
  }

  if (quizFinished) {
    const isPassed = finalScore >= (quiz.passMark || 70);

    return (
      <div className="wire-card flex flex-col items-center justify-center p-12 gap-8 text-center animate-[fadeSlideIn_0.4s_ease_forwards]">
        <div className="flex flex-col items-center gap-3">
          <div className={`w-16 h-16 border-2 border-ink flex items-center justify-center text-3xl shadow-wire ${isPassed ? 'bg-teal-primary/10' : 'bg-red-500/5'}`}>
            {isPassed ? '✓' : '!'}
          </div>
          <span className="badge-tape mt-2">{isPassed ? 'Assessment Passed' : 'Needs Review'}</span>
          <h2 className="text-3xl font-black text-ink uppercase tracking-tighter mt-2">
            Your Results
          </h2>
        </div>

        <div className="flex flex-col items-center">
          <span className={`text-7xl font-black ${isPassed ? 'text-teal-primary' : 'text-ink'}`}>
            {finalScore}%
          </span>
          <span className="text-[10px] font-mono font-bold text-dust uppercase tracking-widest mt-2">Final Score</span>
        </div>

        <p className="text-sm text-dust font-medium max-w-sm leading-relaxed">
          Your progress has been recorded. {isPassed
            ? "Great job! You've mastered this section."
            : "You might want to review the material and try again to improve your score."}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm mt-4">
          <Link href={{
            pathname: '/progress',
            query: { userId: userId }
          }}
            className="btn-wire-teal flex-1 py-4 text-[10px] font-black uppercase">
            View My Progress
          </Link>
          <button onClick={() => window.location.reload()} className="btn-wire flex-1 py-4 text-[10px] font-black uppercase">
            Retry Quiz
          </button>
        </div>
      </div>
    );
  }

  const progressPct = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);

  return (
    <div className="flex flex-col gap-10 animate-[fadeSlideIn_0.3s_ease_forwards]">

      {/* ── Progress ── */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-end">
          <span className="text-[10px] font-mono font-black text-dust uppercase tracking-widest">
            Question {currentQuestionIndex + 1} / {questions.length}
          </span>
          <span className="text-sm font-black text-teal-primary">
            {progressPct}%
          </span>
        </div>
        <div className="relative h-4 w-full bg-background border-2 border-ink p-[2px] overflow-hidden">
          <div
            className="h-full bg-teal-primary transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
          <div className="absolute inset-0 flex justify-between pointer-events-none px-4">
            <div className="w-px h-full bg-ink/10" />
            <div className="w-px h-full bg-ink/10" />
            <div className="w-px h-full bg-ink/10" />
          </div>
        </div>
      </div>

      {/* ── Question Card ── */}
      <div className="wire-card min-h-[400px] flex flex-col">
        <div className="p-10 flex flex-col gap-8 flex-1">
          <div className="flex justify-between items-center pb-6 border-b-2 border-ink/5">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-teal-primary border border-ink" />
              <span className="text-[10px] font-mono font-black text-ink uppercase tracking-widest">
                Ref: {currentQuestion.type}
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold text-dust uppercase">
              Value: {currentQuestion.points} pts
            </span>
          </div>

          <h2 className="text-2xl font-bold text-ink leading-tight">
            {currentQuestion.text}
          </h2>

          <div className="flex flex-col gap-3 mt-4">
            {currentQuestion.type === "MCQ" && currentQuestion.options?.map((option: any) => {
              const isSelected = answers[currentQuestionIndex] === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => handleAnswer(option.id)}
                  className={`
                    w-full text-left p-5 border-2 transition-all duration-200 flex items-center gap-4 group
                    ${isSelected
                      ? "bg-background border-ink shadow-wire translate-x-1"
                      : "bg-transparent border-transparent hover:border-ink/20"
                    }
                  `}
                >
                  <div className={`w-4 h-4 border-2 border-ink flex items-center justify-center shrink-0 ${isSelected ? 'bg-teal-primary' : 'bg-background'}`}>
                    {isSelected && <div className="w-1.5 h-1.5 bg-background" />}
                  </div>
                  <span className={`text-sm font-bold transition-colors ${isSelected ? 'text-ink' : 'text-dust group-hover:text-ink'}`}>
                    {option.text}
                  </span>
                </button>
              );
            })}

            {currentQuestion.type === "TRUE_OR_FALSE" && (
              <div className="grid grid-cols-2 gap-6 mt-4">
                {["true", "false"].map((val) => {
                  const isSelected = answers[currentQuestionIndex] === val;
                  return (
                    <button
                      key={val}
                      onClick={() => handleAnswer(val)}
                      className={`
                        py-6 border-2 transition-all duration-200 font-black uppercase tracking-widest text-sm
                        ${isSelected
                          ? "bg-background border-ink shadow-wire"
                          : "bg-transparent border-ink/10 text-dust hover:border-ink hover:text-ink"
                        }
                      `}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
            )}

            {currentQuestion.type === "ESSAY" && (
              <div className="relative group">
                <textarea
                  className="w-full bg-background border-2 border-ink p-6 font-sans text-sm text-ink outline-none focus:ring-2 focus:ring-teal-primary/20 h-48 resize-none placeholder:text-dust/30 font-medium"
                  placeholder="Type your answer here..."
                  value={answers[currentQuestionIndex] || ""}
                  onChange={(e) => handleAnswer(e.target.value)}
                />
                <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-ink opacity-20 group-focus-within:opacity-100 transition-opacity" />
              </div>
            )}
          </div>
        </div>

        {/* ── Footer / Nav ── */}
        <div className="mt-auto p-6 bg-surface border-t-2 border-ink flex items-center justify-between gap-4">
          <button
            onClick={prevQuestion}
            disabled={currentQuestionIndex === 0}
            className="btn-wire px-6 py-2.5 text-[10px] disabled:opacity-30"
          >
            ← Previous
          </button>

          <button
            onClick={nextQuestion}
            disabled={!answers[currentQuestionIndex]}
            className="btn-wire-teal px-10 py-3 text-[10px] disabled:opacity-40"
          >
            {currentQuestionIndex === questions.length - 1 ? "Finish Assessment →" : "Next Question →"}
          </button>
        </div>
      </div>
    </div>
  );
}
