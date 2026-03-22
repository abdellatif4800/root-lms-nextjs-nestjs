"use client";
import {
  useMdastNodeUpdater,
  useLexicalNodeRemove,
  usePublisher,
  insertJsx$,
  Button,
  JsxEditorProps,
} from "@mdxeditor/editor";
import { useEffect, useState } from "react";
import { getAllQuizzes, useQuery } from "@repo/gql";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// ─── Quiz Display Component ──────────────────────────────────────────────────
export function QuizComponent({
  quizId,
  title,
}: {
  quizId: string;
  title?: string;
}) {
  const searchParams = useSearchParams();
  const unitId = searchParams.get("unitId");

  if (!quizId) return null;

  return (
    <div className="my-12 w-full max-w-2xl mx-auto px-4">
      <div className="wire-card group p-8 flex flex-col items-center text-center gap-6 border-teal-primary/30 shadow-wire-teal">
        
        <div className="w-16 h-16 border-2 border-ink bg-background flex items-center justify-center text-3xl shadow-wire group-hover:bg-teal-primary group-hover:text-background transition-all">
          ?
        </div>

        <div className="flex flex-col gap-2">
          <span className="badge-tape w-fit mx-auto">Knowledge Check</span>
          <h3 className="text-2xl font-black text-ink uppercase tracking-tighter mt-2">
            {title || "Assessment"}
          </h3>
          <p className="text-xs text-dust font-medium max-w-xs">
            Complete this quiz to test your understanding of the material.
          </p>
        </div>

        <Link
          href={{
            pathname: `/quizzes/${quizId}`,
            query: unitId ? { unitId } : {},
          }}
          className="btn-wire-teal w-full py-4 text-xs font-black uppercase tracking-[0.2em]"
        >
          Start Quiz →
        </Link>
      </div>
    </div>
  );
}

// ─── Quiz Component Editor ────────────────────────────────────────────────────
export const QuizComponentEditor = ({ mdastNode }: JsxEditorProps) => {
  const updateMdastNode = useMdastNodeUpdater();
  const removeNode = useLexicalNodeRemove();

  const getAttr = (name: string) => {
    const attr = mdastNode.attributes.find(
      (a) => a.type === "mdxJsxAttribute" && a.name === name
    );
    return attr?.value?.toString() || "";
  };

  const [quizId, setQuizId] = useState(getAttr("quizId") || "");
  const [title, setTitle] = useState(getAttr("title") || "");

  const { data: quizzes } = useQuery({
    queryKey: ["allQuizzes"],
    queryFn: () => getAllQuizzes(),
  });

  useEffect(() => {
    const otherAttributes = mdastNode.attributes.filter(
      (a) =>
        a.type === "mdxJsxAttribute" &&
        !["quizId", "title"].includes(a.name as string)
    );

    const newAttributes: any[] = [
      ...otherAttributes,
      { type: "mdxJsxAttribute", name: "quizId", value: quizId },
      { type: "mdxJsxAttribute", name: "title", value: title },
    ];

    updateMdastNode({ ...mdastNode, attributes: newAttributes } as any);
  }, [quizId, title]);

  return (
    <div className="border-2 border-ink p-6 bg-surface shadow-wire flex flex-col gap-6 my-4 font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-2 border-ink bg-teal-primary/10 flex items-center justify-center text-lg">?</div>
          <span className="text-[10px] font-black uppercase tracking-widest text-ink">Quiz Selector</span>
        </div>
        <button onClick={removeNode} className="text-red-500 hover:underline text-[10px] font-black uppercase">Remove</button>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-dust uppercase font-black tracking-widest">Select Assessment</label>
          <select
            className="w-full bg-background border-2 border-ink text-ink text-sm font-bold p-2 outline-none focus:ring-2 focus:ring-teal-primary/20"
            value={quizId}
            onChange={(e) => {
              const selected = quizzes?.find((q: any) => q.id === e.target.value);
              setQuizId(e.target.value);
              if (selected) setTitle(selected.title);
            }}
          >
            <option value="">-- Choose from library --</option>
            {quizzes?.map((q: any) => (
              <option key={q.id} value={q.id}>
                {q.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-dust uppercase font-black tracking-widest">Display Title</label>
          <input
            className="w-full bg-background border-2 border-ink p-2 text-sm font-bold text-ink outline-none focus:ring-2 focus:ring-teal-primary/20 placeholder:text-dust/30"
            placeholder="Custom title for the user..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

// ─── Toolbar Insert Button ────────────────────────────────────────────────────
export const InsertQuizComponent = () => {
  const insertJsx = usePublisher(insertJsx$);

  return (
    <Button
      onClick={() =>
        insertJsx({
          name: "QuizComponent",
          kind: "flow",
          props: { quizId: "", title: "" },
        })
      }
      title="Insert Knowledge Check"
    >
      <div className="font-black text-lg leading-none mb-1">Quiz</div>
    </Button>
  );
};
