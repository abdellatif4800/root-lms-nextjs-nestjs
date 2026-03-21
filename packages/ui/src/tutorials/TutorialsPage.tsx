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
  if (!showAll && cleaned.publish === undefined) cleaned.publish = true;
  return cleaned;
}

export function TutorialsPage({ isPublic }: { isPublic: boolean }) {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const filterParam = searchParams.get("filter");
    if (filterParam === "paid") setFilters((prev) => ({ ...prev, isPaid: true }));
    else if (filterParam === "free") setFilters((prev) => ({ ...prev, isPaid: false }));
  }, [searchParams]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["tutorials", filters],
    queryFn: () => getTutorials(filters),
  });

  // data from getTutorials is the list itself
  const [loadedTutorials, setLoadedTutorials] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_BATCH);

  const visibleTutorials = loadedTutorials.slice(0, visibleCount);
  const hasMoreItems = visibleCount < loadedTutorials.length;

  const handleLoadMore = () => setVisibleCount((prev) => prev + ITEMS_PER_BATCH);

  const handleLoadFilterdData = (filterFields: any) => {
    const cleaned = cleanFilters(filterFields);
    setFilters(cleaned);
    setFilterOpen(false);
  };

  useEffect(() => {
    dispatch(setIsPublic(isPublic));
  }, [isPublic, dispatch]);

  useEffect(() => {
    if (data) {
      // If getTutorials returns the list directly, use data. If it returns an object, use tutorialList.
      const list = Array.isArray(data) ? data : data.tutorialList || [];
      setLoadedTutorials(list);
      setVisibleCount(ITEMS_PER_BATCH);
    }
  }, [data]);

  return (
    <div className="relative w-full flex flex-col font-sans min-h-full h-full">

      {filterOpen && (
        <div className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm" onClick={() => setFilterOpen(false)} />
      )}

      <div className={`
        absolute top-0 left-0 h-full z-50
        transition-transform duration-300 ease-in-out
        ${filterOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <TutorialsFilter loadFilterdData={handleLoadFilterdData} onClose={() => setFilterOpen(false)} />
      </div>

      <div className="w-full flex-1 flex flex-col">
        {isLoading ? (
          <TutorialsListLoading />
        ) : error ? (
          <TutorialsListError error={error} />
        ) : (
          <>
            <div className="sticky top-0 z-20">
              <TutorialsHeader
                hasMore={hasMoreItems}
                loadMore={handleLoadMore}
                tutorialsLength={loadedTutorials.length}
                onOpenFilter={() => setFilterOpen(true)}
                filters={filters}
              />
            </div>
            <TutorialsList tutorials={visibleTutorials} />
          </>
        )}
      </div>
    </div>
  );
}
