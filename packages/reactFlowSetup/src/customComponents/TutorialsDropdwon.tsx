'use client'
import { useState } from "react";
import { useDispatch } from "@repo/reduxSetup";
import { addTutorialNode } from "@repo/reduxSetup";
import { getTutorials, useQuery } from "@repo/gql";

// 1. Define the shape of your tutorial data
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

  // 2. Tell useQuery what type of data to expect
  const { data, isLoading } = useQuery({
    queryKey: ['tutorials', query],
    // Cast the response so TypeScript knows it's an array of Tutorials
    queryFn: async () => {
      const response = await getTutorials({ tutorialName: query, publish: true, isPaud: false });
      return response as Tutorial[];
    },
    // 3. The React Query v5 way to keep previous data
    placeholderData: (previousData) => previousData,
  });

  // Default to an empty array to map over safely
  const tutorials: Tutorial[] = data || [];

  const handleSelect = (tutorialId: string) => {
    const tutorial = tutorials.find((t) => t.id === tutorialId);
    if (!tutorial) return;

    dispatch(addTutorialNode({
      tutorial,
      position: { x: 200, y: 200 },
    }));
    setQuery(""); // clear input
    setOpen(false); // close dropdown
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onFocus={() => setOpen(true)}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search tutorials..."
        className="w-full p-2 rounded border border-surface-800 bg-surface-800 text-text-primary"
      />

      {open && (
        <ul className="absolute w-full max-h-40 overflow-y-auto border border-surface-700 bg-surface-900 rounded mt-1 z-50 shadow-lg">
          {isLoading && <li className="p-2 text-xs text-text-secondary">Loading...</li>}
          {!isLoading && tutorials.length === 0 && (
            <li className="p-2 text-xs text-text-secondary">No tutorials found</li>
          )}
          {!isLoading && tutorials.map(t => (
            <li
              key={t.id}
              onClick={() => handleSelect(t.id)}
              className="p-2 cursor-pointer hover:bg-teal-glow/20"
            >
              {t.tutorialName} ({t.level})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
