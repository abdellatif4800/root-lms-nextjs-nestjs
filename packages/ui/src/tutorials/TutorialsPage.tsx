"use client";
import { TutorialsFilter } from "./TutorialsFilter";
import { TutorialsList } from "./TutorialsList";
import { TutorialsHeader } from "./TutorialsHeader";
import { useEffect, useState } from "react";
import { getTutorials, useQuery } from "@repo/gql";
import { setIsPublic, useAppDispatch } from "@repo/reduxSetup";
import TutorialsListLoading from "./TutorialsListLoading";
import TutorialsListError from "./TutorialsListError";

const DEFAULT_FILTERS = { publish: true };
const ITEMS_PER_BATCH = 8;

function cleanFilters(raw: Record<string, any>) {
  // FIX: __showAll sentinel means admin wants to see everything — no publish filter
  const showAll = raw.__showAll === true;

  const cleaned = Object.fromEntries(
    Object.entries(raw).filter(([k, v]) => {
      if (k === "__showAll") return false; // strip sentinel
      if (v === undefined || v === null) return false;
      if (typeof v === "string" && v.trim() === "") return false;
      if (Array.isArray(v) && v.length === 0) return false;
      return true;
    })
  );

  // Only default publish to true if:
  // - not a "show all" request AND
  // - publish wasn't explicitly set
  if (!showAll && cleaned.publish === undefined) {
    cleaned.publish = true;
  }

  return cleaned;
}

export function TutorialsPage({ isPublic }: { isPublic: boolean }) {
  const dispatch = useAppDispatch();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const { data, isLoading, error } = useQuery({
    queryKey: ["tutorials", filters],
    queryFn: () => getTutorials(filters),
  });

  const [loadedTutorials, setLoadedTutorials] = useState(data?.tutorialList || []);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_BATCH);

  const visibleTutorials = loadedTutorials.slice(0, visibleCount);
  const hasMoreItems = visibleCount < loadedTutorials.length;
  const tutorialsLength = loadedTutorials.length;

  const handleLoadMore = () => setVisibleCount((prev) => prev + ITEMS_PER_BATCH);

  const handleLoadFilterdData = (filterFields: any) => {
    const cleaned = cleanFilters(filterFields);
    setFilters(cleaned);
  };

  useEffect(() => {
    dispatch(setIsPublic(isPublic));
    if (data) {
      setLoadedTutorials(data?.tutorialList ?? data);
      setVisibleCount(ITEMS_PER_BATCH);
    }
  }, [data]);

  return (
    <div className="h-full w-full font-terminal text-text-primary flex flex-row gap-5 overflow-hidden">
      <TutorialsFilter loadFilterdData={handleLoadFilterdData} />
      <div
        className="flex-1 flex flex-col overflow-hidden relative w-full transition-colors duration-300"
        style={{ boxShadow: "4px 4px 0px var(--surface-800)" }}
      >
        {isLoading ? (
          <TutorialsListLoading />
        ) : error ? (
          <TutorialsListError error={error} />
        ) : (
          <>
            <TutorialsHeader
              hasMore={hasMoreItems}
              loadMore={handleLoadMore}
              tutorialsLength={tutorialsLength}
            />
            <TutorialsList tutorials={visibleTutorials} />
          </>
        )}
      </div>
    </div>
  );
}
