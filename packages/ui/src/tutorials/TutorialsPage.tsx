"use client";
import { TutorialsFilter } from "./TutorialsFilter";
import { TutorialsList } from "./TutorialsList";
import { TutorialsHeader } from "./TutorialsHeader";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getTutorials, useQuery } from "@repo/gql";
import { setIsPublic, useAppDispatch } from "@repo/reduxSetup";
import TutorialsListLoading from "./TutorialsListLoading";
import TutorialsListError from "./TutorialsListError";

const DEFAULT_FILTERS: Record<string, any> = { publish: true };
const ITEMS_PER_BATCH = 8;

function cleanFilters(raw: Record<string, any>) {
  const showAll = raw.__showAll === true;

  const cleaned = Object.fromEntries(
    Object.entries(raw).filter(([k, v]) => {
      if (k === "__showAll") return false;
      if (v === undefined || v === null) return false;
      if (typeof v === "string" && v.trim() === "") return false;
      if (Array.isArray(v) && v.length === 0) return false;
      return true;
    })
  );

  if (!showAll && cleaned.publish === undefined) {
    cleaned.publish = true;
  }

  return cleaned;
}

export function TutorialsPage({ isPublic }: { isPublic: boolean }) {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const filterParam = searchParams.get("filter");
    if (filterParam === "paid") {
      setFilters((prev) => ({ ...prev, isPaid: true }));
    } else if (filterParam === "free") {
      setFilters((prev) => ({ ...prev, isPaid: false }));
    }
  }, [searchParams]);

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
    setFilterOpen(false);
  };

  useEffect(() => {
    dispatch(setIsPublic(isPublic));
    if (data) {
      setLoadedTutorials(data?.tutorialList ?? data);
      setVisibleCount(ITEMS_PER_BATCH);
    }
  }, [data]);

  return (
    <div className="relative h-full w-full font-terminal text-text-primary flex flex-col overflow-hidden relative">

      {/* ── Backdrop (all screen sizes) ── */}
      {filterOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setFilterOpen(false)}
        />
      )}

      {/* ── Filter — always fixed overlay from left ── */}
      <div className={`
        absolute top-0 left-0 h-full z-50
        transition-transform duration-300 ease-in-out
        ${filterOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <TutorialsFilter
          loadFilterdData={handleLoadFilterdData}
          onClose={() => setFilterOpen(false)}
        />
      </div>

      {/* ── Main content — always full width ── */}
      <div className="flex-1 flex flex-col overflow-hidden w-full shadow-card transition-colors duration-300">
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
              onOpenFilter={() => setFilterOpen(true)}
              filters={filters}
            />
            <TutorialsList tutorials={visibleTutorials} />
          </>
        )}
      </div>
    </div>
  );
}
