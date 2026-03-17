'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

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

// ─── Animated counter for the redirect countdown ──────────────────────────────

function useCountdown(start: number, onDone: () => void) {
  const [count, setCount] = useState(start);
  useEffect(() => {
    if (count <= 0) { onDone(); return; }
    const t = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count, onDone]);
  return count;
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

  const countdown = useCountdown(
    isComplete ? 5 : 0,
    () => isComplete && router.push('/tutorials/list'),
  );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=JetBrains+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --teal:    #00f5d4;
          --emerald: #00e676;
          --purple:  #b388ff;
          --red:     #ff5252;
          --bg:      #050a0e;
          --surface: #0d1b24;
          --border:  #1a3040;
          --text:    #c8d8e0;
          --muted:   #4a6070;
        }

        .page {
          min-height: 100vh;
          background: var(--bg);
          font-family: 'JetBrains Mono', monospace;
          color: var(--text);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          position: relative;
          overflow: hidden;
        }

        /* grid */
        .page::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(0,245,212,.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,245,212,.03) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        /* scanlines */
        .page::after {
          content: '';
          position: fixed;
          inset: 0;
          background: repeating-linear-gradient(
            0deg, transparent, transparent 2px,
            rgba(0,0,0,.07) 2px, rgba(0,0,0,.07) 4px
          );
          pointer-events: none;
        }

        /* ── Card ──────────────────────────────── */
        .card {
          width: 100%;
          max-width: 480px;
          background: var(--surface);
          border: 1px solid var(--border);
          clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%);
          padding: 48px 40px;
          position: relative;
          z-index: 1;
          animation: fadeUp .5s ease both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .card--success { border-color: var(--teal); box-shadow: 0 0 40px rgba(0,245,212,.12); }
        .card--error   { border-color: var(--red);  box-shadow: 0 0 40px rgba(255,82,82,.1); }

        /* ── Icon ──────────────────────────────── */
        .icon-wrap {
          width: 72px;
          height: 72px;
          margin: 0 auto 32px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2px solid var(--teal);
          animation: pulse 2s ease infinite;
        }

        @keyframes pulse {
          0%,100% { transform: scale(1);   opacity: 1; }
          50%      { transform: scale(1.1); opacity: .5; }
        }

        .icon-inner {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: rgba(0,245,212,.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .icon-wrap--error .icon-ring  { border-color: var(--red); animation: none; }
        .icon-wrap--error .icon-inner { background: rgba(255,82,82,.1); }

        /* ── Text ──────────────────────────────── */
        .eyebrow {
          text-align: center;
          font-size: 10px;
          letter-spacing: .2em;
          color: var(--teal);
          margin-bottom: 10px;
        }

        .eyebrow--error { color: var(--red); }

        .title {
          font-family: 'Orbitron', sans-serif;
          font-size: 26px;
          font-weight: 900;
          text-align: center;
          color: #fff;
          margin-bottom: 12px;
          line-height: 1.2;
        }

        .subtitle {
          text-align: center;
          font-size: 12px;
          color: var(--muted);
          line-height: 1.7;
          margin-bottom: 32px;
        }

        /* ── Info rows ─────────────────────────── */
        .info-block {
          background: rgba(0,0,0,.3);
          border: 1px solid var(--border);
          padding: 16px 20px;
          margin-bottom: 28px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
        }

        .info-label { color: var(--muted); }

        .info-value { color: var(--text); }

        .badge-active {
          background: rgba(0,230,118,.12);
          border: 1px solid rgba(0,230,118,.3);
          color: var(--emerald);
          font-size: 10px;
          letter-spacing: .1em;
          padding: 3px 10px;
        }

        /* ── Countdown ─────────────────────────── */
        .countdown-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          margin-bottom: 24px;
        }

        .countdown-text {
          font-size: 11px;
          color: var(--muted);
          letter-spacing: .08em;
        }

        .countdown-bar-bg {
          width: 100%;
          height: 2px;
          background: var(--border);
          overflow: hidden;
        }

        .countdown-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--teal), var(--emerald));
          transition: width 1s linear;
        }

        /* ── Buttons ───────────────────────────── */
        .btn {
          display: block;
          width: 100%;
          padding: 14px;
          text-align: center;
          font-family: 'Orbitron', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .12em;
          cursor: pointer;
          text-decoration: none;
          border: none;
          clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%);
          transition: all .2s;
        }

        .btn-primary {
          background: var(--teal);
          color: var(--bg);
        }

        .btn-primary:hover {
          background: var(--emerald);
          box-shadow: 0 0 20px rgba(0,230,118,.3);
        }

        .btn-ghost {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--muted);
          margin-top: 12px;
        }

        .btn-ghost:hover {
          border-color: var(--teal);
          color: var(--teal);
        }

        /* ── Loading skeleton ──────────────────── */
        .loading-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 2px solid var(--border);
          border-top-color: var(--teal);
          border-radius: 50%;
          animation: spin .8s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .loading-label {
          font-size: 11px;
          letter-spacing: .15em;
          color: var(--muted);
        }

        /* blinking cursor */
        .loading-label::after {
          content: '_';
          animation: blink .8s step-end infinite;
        }

        @keyframes blink { 50% { opacity: 0; } }
      `}</style>

      <div className="page">

        {/* ── Loading ── */}
        {isLoading && (
          <div className="card" style={{ textAlign: 'center' }}>
            <div className="loading-wrap">
              <div className="loading-spinner" />
              <span className="loading-label">VERIFYING_PAYMENT</span>
            </div>
          </div>
        )}

        {/* ── Error ── */}
        {isError && (
          <div className="card card--error">
            <div className={`icon-wrap icon-wrap--error`}>
              <div className="icon-ring" />
              <div className="icon-inner">✗</div>
            </div>
            <p className="eyebrow eyebrow--error">// PAYMENT_ERROR</p>
            <h1 className="title">VERIFICATION FAILED</h1>
            <p className="subtitle">
              We couldn&apos;t verify your payment session.<br />
              If you were charged, contact support.
            </p>
            <button className="btn btn-primary" onClick={() => router.push('/pricing')}>
              BACK_TO_PRICING
            </button>
            <button className="btn btn-ghost" onClick={() => router.push('/')}>
              GO_HOME
            </button>
          </div>
        )}

        {/* ── Success ── */}
        {isComplete && data && (
          <div className="card card--success">
            <div className="icon-wrap">
              <div className="icon-ring" />
              <div className="icon-inner">✓</div>
            </div>

            <p className="eyebrow">// PAYMENT_CONFIRMED</p>
            <h1 className="title">ACCESS GRANTED</h1>
            <p className="subtitle">
              Your subscription is now active.<br />
              Welcome to the terminal.
            </p>

            <div className="info-block">
              <div className="info-row">
                <span className="info-label">ACCOUNT</span>
                <span className="info-value">{data.customerEmail}</span>
              </div>
              <div className="info-row">
                <span className="info-label">PLAN</span>
                <span className="info-value">{data.planName?.toUpperCase() ?? 'PRO'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">STATUS</span>
                <span className="badge-active">● {data.subscriptionStatus.toUpperCase()}</span>
              </div>
            </div>

            <div className="countdown-wrap">
              <span className="countdown-text">
                REDIRECTING IN {countdown}s
              </span>
              <div className="countdown-bar-bg">
                <div
                  className="countdown-bar-fill"
                  style={{ width: `${(countdown / 5) * 100}%` }}
                />
              </div>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => router.push('/tutorials/list')}
            >
              START_LEARNING →
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => router.push('/')}
            >
              GO_HOME
            </button>
          </div>
        )}

        {/* ── Session not complete (open/expired) ── */}
        {!isLoading && !isError && data && !isComplete && (
          <div className="card card--error">
            <div className="icon-wrap icon-wrap--error">
              <div className="icon-ring" />
              <div className="icon-inner">!</div>
            </div>
            <p className="eyebrow eyebrow--error">// PAYMENT_INCOMPLETE</p>
            <h1 className="title">NOT COMPLETED</h1>
            <p className="subtitle">
              Your payment session is <strong>{data.status}</strong>.<br />
              Please try again or contact support.
            </p>
            <button className="btn btn-primary" onClick={() => router.push('/pricing')}>
              TRY_AGAIN
            </button>
          </div>
        )}

      </div>
    </>
  );
}

