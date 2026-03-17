'use client';

import { getMe } from '@repo/gql';
import { RootState, useAppSelector } from '@repo/reduxSetup';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Plan = {
  id: string;
  lookupKey: string;
  name: string;
  price: number;
  interval: string;
  features: string[];
  highlight: boolean;
  badge?: string;
};

// ─── API call ─────────────────────────────────────────────────────────────────

async function createCheckoutSession(payload: {
  lookupKey: string;
  userId: string;
}): Promise<{ url: string }> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/payment/create-checkout-session`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    },
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message ?? 'Failed to create checkout session');
  }

  return res.json();
}

// ─── Plans data ───────────────────────────────────────────────────────────────

const PLANS: Plan[] = [
  {
    id: 'plus',
    lookupKey: 'plus',
    name: 'PLUS',
    price: 9,
    interval: 'mo',
    highlight: false,
    features: [
      'Access all free tutorials',
      'Roadmap viewer',
      'Progress tracking',
      'Community access',
    ],
  },
  {
    id: 'pro',
    lookupKey: 'pro',
    name: 'PRO',
    price: 19,
    interval: 'mo',
    highlight: true,
    badge: 'MOST POPULAR',
    features: [
      'Everything in Plus',
      'All paid tutorials',
      'MDX source download',
      'Priority support',
      'Early access content',
    ],
  },
];

// ─── Plan Card ────────────────────────────────────────────────────────────────

function PlanCard({
  plan,
  userId,
  isLoading,
  activeLookupKey,
  onSelect,
}: {
  plan: Plan;
  userId: string;
  isLoading: boolean;
  activeLookupKey: string | null;
  onSelect: (lookupKey: string) => void;
}) {
  const isThisLoading = isLoading && activeLookupKey === plan.lookupKey;

  return (
    <div
      className={`plan-card ${plan.highlight ? 'plan-card--highlight' : ''}`}
    >
      {plan.badge && <div className="plan-badge">{plan.badge}</div>}

      <div className="plan-header">
        <span className="plan-label">// PLAN</span>
        <h2 className="plan-name">{plan.name}</h2>
      </div>

      <div className="plan-price">
        <span className="plan-currency">$</span>
        <span className="plan-amount">{plan.price}</span>
        <span className="plan-interval">/{plan.interval}</span>
      </div>

      <ul className="plan-features">
        {plan.features.map((f) => (
          <li key={f} className="plan-feature">
            <span className="feature-icon">▸</span>
            {f}
          </li>
        ))}
      </ul>

      <button
        className={`plan-btn ${plan.highlight ? 'plan-btn--highlight' : ''}`}
        disabled={isLoading}
        onClick={() => onSelect(plan.lookupKey)}
      >
        {isThisLoading ? (
          <span className="btn-loading">
            <span className="spinner" />
            REDIRECTING...
          </span>
        ) : (
          'SUBSCRIBE_NOW'
        )}
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function PricingPage() {
  const { user, isAuth } = useAppSelector((state: RootState) => state.authSlice);
  const userId = user?.sub
  console.log(user);

  const [activeLookupKey, setActiveLookupKey] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: createCheckoutSession,
    onSuccess: (data) => {
      window.location.href = data.url; // redirect to Stripe hosted checkout
    },
    onError: (err: Error) => {
      setErrorMsg(err.message);
      setActiveLookupKey(null);
    },
  });

  const handleSelect = (lookupKey: string) => {
    setErrorMsg(null);
    setActiveLookupKey(lookupKey);
    mutation.mutate({ lookupKey, userId });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=JetBrains+Mono:wght@400;500&display=swap');

        :root {
          --teal:    #00f5d4;
          --emerald: #00e676;
          --purple:  #b388ff;
          --bg:      #050a0e;
          --surface: #0d1b24;
          --surface2:#122030;
          --border:  #1a3040;
          --text:    #c8d8e0;
          --muted:   #4a6070;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .pricing-root {
          min-height: 100vh;
          background: var(--bg);
          font-family: 'JetBrains Mono', monospace;
          color: var(--text);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 80px 24px 60px;
          position: relative;
          overflow: hidden;
        }

        /* grid bg */
        .pricing-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(0,245,212,.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,245,212,.03) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        /* scanline */
        .pricing-root::after {
          content: '';
          position: fixed;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,.08) 2px,
            rgba(0,0,0,.08) 4px
          );
          pointer-events: none;
        }

        /* ── Header ─────────────────────────── */
        .pricing-header {
          text-align: center;
          margin-bottom: 64px;
          position: relative;
          z-index: 1;
        }

        .pricing-eyebrow {
          font-size: 11px;
          letter-spacing: .2em;
          color: var(--teal);
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .pricing-eyebrow::before,
        .pricing-eyebrow::after {
          content: '';
          width: 40px;
          height: 1px;
          background: var(--teal);
          opacity: .5;
        }

        .pricing-title {
          font-family: 'Orbitron', sans-serif;
          font-size: clamp(32px, 5vw, 56px);
          font-weight: 900;
          line-height: 1.1;
          background: linear-gradient(135deg, var(--teal) 0%, var(--emerald) 60%, var(--purple) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 16px;
        }

        .pricing-subtitle {
          font-size: 13px;
          color: var(--muted);
          max-width: 420px;
          line-height: 1.7;
        }

        /* ── Cards grid ──────────────────────── */
        .plans-grid {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
          justify-content: center;
          position: relative;
          z-index: 1;
        }

        .plan-card {
          width: 300px;
          background: var(--surface);
          border: 1px solid var(--border);
          clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%);
          padding: 32px 28px;
          position: relative;
          transition: border-color .25s, box-shadow .25s;
        }

        .plan-card:hover {
          border-color: var(--teal);
          box-shadow: 0 0 24px rgba(0,245,212,.1);
        }

        .plan-card--highlight {
          border-color: var(--teal);
          background: var(--surface2);
          box-shadow: 0 0 32px rgba(0,245,212,.12);
        }

        .plan-badge {
          position: absolute;
          top: -1px;
          right: 24px;
          background: var(--teal);
          color: var(--bg);
          font-family: 'Orbitron', sans-serif;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: .12em;
          padding: 4px 10px;
        }

        .plan-header {
          margin-bottom: 24px;
        }

        .plan-label {
          font-size: 10px;
          color: var(--muted);
          letter-spacing: .15em;
        }

        .plan-name {
          font-family: 'Orbitron', sans-serif;
          font-size: 28px;
          font-weight: 900;
          color: #fff;
          margin-top: 4px;
        }

        .plan-card--highlight .plan-name {
          color: var(--teal);
        }

        .plan-price {
          display: flex;
          align-items: baseline;
          gap: 2px;
          margin-bottom: 28px;
          border-bottom: 1px solid var(--border);
          padding-bottom: 24px;
        }

        .plan-currency {
          font-family: 'Orbitron', sans-serif;
          font-size: 18px;
          color: var(--muted);
        }

        .plan-amount {
          font-family: 'Orbitron', sans-serif;
          font-size: 48px;
          font-weight: 900;
          color: #fff;
          line-height: 1;
        }

        .plan-interval {
          font-size: 13px;
          color: var(--muted);
          margin-left: 4px;
        }

        .plan-features {
          list-style: none;
          margin-bottom: 32px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .plan-feature {
          font-size: 12px;
          color: var(--text);
          display: flex;
          align-items: center;
          gap: 10px;
          line-height: 1.4;
        }

        .feature-icon {
          color: var(--teal);
          font-size: 10px;
          flex-shrink: 0;
        }

        .plan-btn {
          width: 100%;
          padding: 13px;
          background: transparent;
          border: 1px solid var(--muted);
          color: var(--text);
          font-family: 'Orbitron', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .12em;
          cursor: pointer;
          clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%);
          transition: all .2s;
        }

        .plan-btn:hover:not(:disabled) {
          border-color: var(--teal);
          color: var(--teal);
          box-shadow: 0 0 16px rgba(0,245,212,.15);
        }

        .plan-btn--highlight {
          background: var(--teal);
          border-color: var(--teal);
          color: var(--bg);
        }

        .plan-btn--highlight:hover:not(:disabled) {
          background: var(--emerald);
          border-color: var(--emerald);
          color: var(--bg);
          box-shadow: 0 0 20px rgba(0,230,118,.3);
        }

        .plan-btn:disabled {
          opacity: .6;
          cursor: not-allowed;
        }

        .btn-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .spinner {
          width: 12px;
          height: 12px;
          border: 2px solid currentColor;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin .7s linear infinite;
          display: inline-block;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Error ───────────────────────────── */
        .pricing-error {
          margin-top: 24px;
          padding: 12px 20px;
          background: rgba(255,60,60,.08);
          border: 1px solid rgba(255,60,60,.3);
          color: #ff6b6b;
          font-size: 12px;
          letter-spacing: .05em;
          clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%);
          position: relative;
          z-index: 1;
        }

        .pricing-error::before {
          content: 'ERR ▸ ';
          opacity: .6;
        }
      `}</style>

      <div className="pricing-root">
        <header className="pricing-header">
          <p className="pricing-eyebrow">ROOT_LMS // SUBSCRIPTION</p>
          <h1 className="pricing-title">CHOOSE YOUR PLAN</h1>
          <p className="pricing-subtitle">
            Unlock the full terminal. Access every paid tutorial, roadmap, and resource.
          </p>
        </header>

        <div className="plans-grid">
          {PLANS.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              userId={userId}
              isLoading={mutation.isPending}
              activeLookupKey={activeLookupKey}
              onSelect={handleSelect}
            />
          ))}
        </div>

        {errorMsg && (
          <div className="pricing-error">{errorMsg}</div>
        )}
      </div>
    </>
  );
}

