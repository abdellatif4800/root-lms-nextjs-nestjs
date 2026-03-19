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

// ─── Quiz Display Component (Web & Editor Preview) ────────────────────────────
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
    <div className="my-8 w-full max-w-xl mx-auto">
      <div className="relative group bg-surface-900 border border-purple-glow/30 p-6 [clip-path:polygon(0_0,calc(100%-20px)_0,100%_20px,100%_100%,20px_100%,0_calc(100%-20px))] hover:border-purple-glow transition-all duration-300 shadow-[0_0_30px_rgba(168,85,247,0.05)]">
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-10 h-10 bg-purple-glow/10 [clip-path:polygon(100%_0,0_0,100%_100%)] group-hover:bg-purple-glow/20 transition-colors" />
        
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-surface-950 border border-purple-glow/50 flex items-center justify-center text-purple-glow shadow-glow-purple-sm">
              <span className="text-xs font-digital font-black">?</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] font-terminal text-purple-glow uppercase tracking-[0.3em] opacity-60 leading-none">
                // ASSESSMENT_REQUIRED
              </span>
              <h3 className="text-sm font-digital font-black text-text-primary uppercase tracking-wider mt-1">
                {title || "Untitled Assessment"}
              </h3>
            </div>
          </div>

          <Link
            href={{
              pathname: `/quizzes/${quizId}`,
              query: unitId ? { unitId } : {},
            }}
            className="w-full text-center py-3 bg-purple-glow text-black text-[10px] font-digital font-black uppercase tracking-widest hover:bg-white transition-all active:translate-y-px shadow-glow-purple-sm"
          >
            [ Launch_Quiz_Sequence ]
          </Link>
        </div>
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

  // ─── Sync mdast whenever attrs change ───
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
    <div
      className="border p-4 rounded-md flex flex-col gap-4 shadow-lg"
      style={{ background: "#0d1117", borderColor: "#1e2a38" }}
    >
      <div className="flex items-center gap-2">
        <span style={{ color: "#a855f7", fontSize: 16 }}>?</span>
        <span
          className="text-xs font-semibold tracking-wide"
          style={{ color: "#94a3b8" }}
        >
          Quiz Selector
        </span>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-surface-500 uppercase font-bold">Select Quiz</label>
          <select
            className="w-full bg-surface-950 border border-surface-700 text-white text-xs p-2 outline-none focus:border-purple-glow"
            value={quizId}
            onChange={(e) => {
              const selected = quizzes?.find((q: any) => q.id === e.target.value);
              setQuizId(e.target.value);
              if (selected) setTitle(selected.title);
            }}
          >
            <option value="">-- Choose a quiz --</option>
            {quizzes?.map((q: any) => (
              <option key={q.id} value={q.id}>
                {q.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-surface-500 uppercase font-bold">Display Title</label>
          <input
            className="w-full bg-transparent border px-2 py-1.5 text-sm text-white outline-none rounded"
            style={{ borderColor: "#1e2a38" }}
            placeholder="Title to show on the button..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <button
          onClick={removeNode}
          className="text-red-500 hover:text-white border px-2 py-1 rounded text-[10px] uppercase font-bold w-fit mt-2"
          style={{ background: "#0d1117", borderColor: "#2d2020" }}
        >
          ✕ Remove Quiz Component
        </button>
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
      title="Insert Quiz"
    >
      <div className="font-bold text-lg leading-none mb-1">Quiz</div>
    </Button>
  );
};
