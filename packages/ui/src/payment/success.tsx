'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────

type SessionStatus = {
  status: 'complete' | 'open' | 'expired';
  customerEmail: string;
  subscriptionStatus: string; // 'active' | 'trialing' etc.
  planName: string;
};

// ─── API ──────────────────────────────────────────────────────────────────────

async function fetchSessionStatus(sessionId: string): Promise<SessionStatus> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/payment/session-status?session_id=${sessionId}`,
    { credentials: 'include' },
  );
  if (!res.ok) throw new Error('Failed to verify session');
  return res.json();
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function PaymentSuccessPage() {
  const params = useSearchParams();
  const router = useRouter();
  const sessionId = params.get('session_id') ?? '';

  const { data, isLoading, isError } = useQuery({
    queryKey: ['session-status', sessionId],
    queryFn: () => fetchSessionStatus(sessionId),
    enabled: !!sessionId,
    retry: 2,
  });

  const isComplete = data?.status === 'complete';

  return (
    <div className="min-h-full w-full flex items-center justify-center p-6 py-20 font-sans text-ink">
      
      {/* Main Success/Error Container */}
      <div className="w-full max-w-lg flex flex-col items-center">
        
        {/* Loading State */}
        {isLoading && (
          <div className="wire-card p-12 w-full flex flex-col items-center gap-6">
            <div className="w-12 h-12 border-4 border-ink border-t-teal-primary rounded-full animate-spin" />
            <span className="font-mono text-xs font-bold uppercase tracking-widest opacity-50">Verifying Payment...</span>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="wire-card p-10 w-full border-red-500/30 flex flex-col items-center text-center gap-6">
            <div className="w-16 h-16 border-2 border-ink flex items-center justify-center text-3xl shadow-[4px_4px_0px_0px_rgba(239,68,68,1)]">
              ✗
            </div>
            <div className="badge-tape bg-red-500 text-white">Payment Error</div>
            <h1 className="text-3xl font-black uppercase tracking-tighter">Verification Failed</h1>
            <p className="text-dust text-sm font-medium">
              We couldn&apos;t verify your payment session. If you were charged, please contact support with your session ID.
            </p>
            <div className="w-full flex flex-col gap-3 mt-4">
              <button onClick={() => router.push('/pricing')} className="btn-wire-teal w-full py-3">Back to Pricing</button>
              <button onClick={() => router.push('/')} className="btn-wire w-full py-3">Go Home</button>
            </div>
          </div>
        )}

        {/* Success State */}
        {isComplete && data && (
          <div className="wire-card p-10 w-full border-teal-primary shadow-wire-teal flex flex-col items-center text-center gap-6">
            <div className="w-16 h-16 border-2 border-ink bg-teal-primary/10 flex items-center justify-center text-3xl shadow-wire">
              ✓
            </div>
            <div className="badge-tape">Access Granted</div>
            <h1 className="text-4xl font-black uppercase tracking-tighter">Welcome Aboard</h1>
            
            <p className="text-dust text-sm font-medium leading-relaxed">
              Your subscription is now active! <br />
              <span className="text-teal-primary font-bold">Important:</span> Please logout and login again to refresh your session.
            </p>

            {/* Info Table */}
            <div className="w-full border-2 border-ink bg-surface mt-4 overflow-hidden">
              <div className="flex justify-between px-4 py-3 border-b-2 border-ink/5">
                <span className="font-mono text-[10px] font-bold uppercase text-dust">Account</span>
                <span className="text-xs font-bold">{data.customerEmail}</span>
              </div>
              <div className="flex justify-between px-4 py-3 border-b-2 border-ink/5">
                <span className="font-mono text-[10px] font-bold uppercase text-dust">Plan</span>
                <span className="text-xs font-bold uppercase">{data.planName || 'Professional'}</span>
              </div>
              <div className="flex justify-between px-4 py-3">
                <span className="font-mono text-[10px] font-bold uppercase text-dust">Status</span>
                <span className="text-[10px] font-black uppercase text-teal-primary">Active</span>
              </div>
            </div>

            <div className="w-full flex flex-col gap-3 mt-6">
              <Link href="/tutorials/list" className="btn-wire-teal w-full py-4 uppercase font-black tracking-widest text-xs">
                Start Learning →
              </Link>
              <button onClick={() => router.push('/')} className="btn-wire w-full py-3 uppercase font-black tracking-widest text-xs">
                Go to Home
              </button>
            </div>
          </div>
        )}

        {/* Incomplete / Pending */}
        {!isLoading && !isError && data && !isComplete && (
          <div className="wire-card p-10 w-full flex flex-col items-center text-center gap-6">
            <div className="w-16 h-16 border-2 border-ink flex items-center justify-center text-3xl shadow-wire">
              !
            </div>
            <div className="badge-tape bg-dust text-white">Pending</div>
            <h1 className="text-3xl font-black uppercase tracking-tighter">Not Completed</h1>
            <p className="text-dust text-sm">
              Your payment session is <strong>{data.status}</strong>. Please try again or wait for confirmation.
            </p>
            <button onClick={() => router.push('/pricing')} className="btn-wire-teal w-full py-3 mt-4 uppercase">Try Again</button>
          </div>
        )}

        {/* Footer annotations */}
        <div className="mt-12 flex flex-col items-center gap-2 opacity-20">
           <div className="w-px h-8 bg-ink" />
           <span className="font-mono text-[8px] uppercase font-bold tracking-[0.3em]">Confirmation ID: {sessionId.slice(0, 8)}...</span>
        </div>
      </div>
    </div>
  );
}
