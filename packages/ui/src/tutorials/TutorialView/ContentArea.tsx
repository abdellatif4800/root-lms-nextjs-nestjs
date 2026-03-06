"use client"
import dynamic from 'next/dynamic';
import { TipTapLeasonViewer } from '@repo/ui';
import { getUnitById, useQuery } from '@repo/gql';
import { ImageComponent, SimpleSeparator } from '@repo/mdxSetup';
import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from "next/navigation";

const MDXRemote = dynamic(() => import('@repo/mdxSetup').then(mod => mod.MDXRemote), { ssr: false });

export function ContentArea({ tutorialData }: { tutorialData?: any }) {
  const searchParams = useSearchParams();
  const unitIdParam = searchParams.get("unitId");
  const currentUnitId = unitIdParam || tutorialData.units[0].id;

  const { data, isLoading, error } = useQuery({
    queryKey: ['unitById', currentUnitId],
    queryFn: () => getUnitById(currentUnitId!),
    enabled: !!currentUnitId,
  });

  return (
    <main className="
      flex-1 flex flex-col h-full min-h-0 relative
      border border-surface-800
      overflow-hidden overflow-y-auto custom-scrollbar p-5
    "
    >

      {/* Loading state */}
      {isLoading && (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 h-full">
          <div className="flex gap-1">
            {[0, 1, 2].map(i => (
              <span key={i} className="w-1.5 h-1.5 bg-teal-glow animate-pulse"
                style={{ animationDelay: `${i * 200}ms`, boxShadow: "0 0 4px var(--shadow-teal)" }} />
            ))}
          </div>
          <span className="text-[9px] font-terminal text-text-secondary uppercase tracking-[0.3em] animate-pulse">
            Loading_Unit...
          </span>
        </div>
      )}

      {/* Error state */}
      {!isLoading && (error || !data) && (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="border border-red-500/30 bg-red-500/5 px-6 py-4 max-w-sm w-full"
            style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))" }}>
            <p className="text-[10px] font-terminal text-red-400">
              <span className="opacity-50 mr-1">{">"}</span>
              Failed to load unit data.
            </p>
          </div>
        </div>
      )}

      {/* Content */}
      {!isLoading && data && (
        <div className="max-w-3xl mx-auto w-full flex flex-col gap-0 pb-20 px-6 lg:px-10 pt-8">

          {/* Unit title header */}
          <div className="mb-8 pb-4 border-b border-surface-800 relative">

            <div className="flex items-start gap-4">
              {/* Purple left border accent */}
              <div className="w-1 shrink-0 mt-1 self-stretch bg-purple-glow"
                style={{ boxShadow: "0 0 8px var(--shadow-purple)", minHeight: "1.5rem" }} />
              <h3 className="text-2xl font-digital font-black text-text-primary uppercase leading-tight tracking-wide">
                {data.unitTitle}
              </h3>
            </div>
          </div>

          {/* MDX Content */}
          <div>
            {data.content ? (
              <div className="mdxContent">
                <MDXRemote
                  source={data.content}
                  components={{ SimpleSeparator, ImageComponent }}
                />
              </div>
            ) : (
              <div
                className="flex items-center gap-3 p-5 border border-dashed border-surface-700"
                style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))" }}
              >
                <span className="text-[9px] font-digital font-black text-teal-glow tracking-wider">[EMPTY]</span>
                <span className="text-[10px] font-terminal text-text-secondary opacity-60">
                  Data stream is void.
                </span>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Fallback loading indicator (right panel) */}
      {!isLoading && !data && !error && (
        <div className="h-full flex items-center justify-center">
          <span className="text-[9px] font-terminal text-text-secondary uppercase tracking-[0.3em] animate-pulse opacity-40">
            LOADING_UNIT_DATA...
          </span>
        </div>
      )}
    </main>
  );
}
