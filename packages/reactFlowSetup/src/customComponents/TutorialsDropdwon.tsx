'use client'
import { useState, useRef, useEffect } from "react";
import { useDispatch } from "@repo/reduxSetup";
import { addTutorialNode } from "@repo/reduxSetup";
import { getTutorials, useQuery } from "@repo/gql";

export interface Tutorial {
  id: string;
  tutorialName: string;
  level?: string;
  description?: string;
  category?: string;
}

export function TutorialDropdown() {
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['tutorials', query],
    queryFn: async () => {
      const response = await getTutorials({ tutorialName: query, publish: true });
      return response as Tutorial[];
    },
    placeholderData: (previousData) => previousData,
  });

  const tutorials: Tutorial[] = data || [];

  const handleSelect = (tutorialId: string) => {
    const tutorial = tutorials.find((t) => t.id === tutorialId);
    if (!tutorial) return;

    dispatch(addTutorialNode({
      tutorial,
      position: { x: 200, y: 200 },
    }));
    setQuery("");
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <input
        type="text"
        value={query}
        onFocus={() => setOpen(true)}
        onChange={e => setQuery(e.target.value)}
        placeholder="Find module by name..."
        className="w-full bg-background border-2 border-ink p-2 text-xs font-bold uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-teal-primary/20 placeholder:text-dust/30"
      />

      {open && (
        <ul className="absolute w-full max-h-60 overflow-y-auto border-2 border-ink bg-surface mt-1 z-[100] shadow-wire custom-scrollbar divide-y-2 divide-ink/5">
          {isLoading && <li className="p-3 text-[10px] font-bold text-dust uppercase animate-pulse">Scanning...</li>}
          {!isLoading && tutorials.length === 0 && (
            <li className="p-3 text-[10px] font-bold text-dust uppercase">No matches found</li>
          )}
          {!isLoading && tutorials.map(t => (
            <li
              key={t.id}
              onClick={() => handleSelect(t.id)}
              className="p-3 cursor-pointer hover:bg-background flex flex-col gap-1 transition-colors group"
            >
              <span className="text-[10px] font-black text-ink uppercase group-hover:text-teal-primary">{t.tutorialName}</span>
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-mono text-dust uppercase">{t.level || 'Beginner'}</span>
                <span className="text-[8px] font-mono text-dust opacity-0 group-hover:opacity-100">+ INSERT</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
