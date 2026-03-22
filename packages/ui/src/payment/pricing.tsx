'use client';

import { RootState, useAppSelector, useAppDispatch, toggleAuthModal } from '@repo/reduxSetup';
import { useMutation } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

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
    name: 'Standard',
    price: 9,
    interval: 'mo',
    highlight: false,
    features: [
      'Access all free lessons',
      'Track your progress',
      'Guided study paths',
      'Community forums',
    ],
  },
  {
    id: 'pro',
    lookupKey: 'pro',
    name: 'Professional',
    price: 19,
    interval: 'mo',
    highlight: true,
    badge: 'RECOMMENDED',
    features: [
      'Everything in Standard',
      'All premium lessons',
      'Offline reading source',
      'Priority assistance',
      'Early access to new content',
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
  userId?: string;
  isLoading: boolean;
  activeLookupKey: string | null;
  onSelect: (lookupKey: string) => void;
}) {
  const isThisLoading = isLoading && activeLookupKey === plan.lookupKey;

  return (
    <div
      className={`
        wire-card relative flex flex-col p-8 w-full max-w-[340px]
        ${plan.highlight ? 'border-teal-primary shadow-wire-teal scale-105 z-10' : ''}
      `}
    >
      {/* Badge */}
      {plan.badge && (
        <div className="absolute top-4 right-4 badge-tape">
          {plan.badge}
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <span className="text-[10px] font-mono text-dust uppercase font-bold tracking-widest">
          {plan.id} membership
        </span>
        <h2 className="text-3xl font-black mt-1 text-ink uppercase tracking-tighter leading-none">
          {plan.name}
        </h2>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-1 mb-8 pb-8 border-b-2 border-dashed border-ink/10">
        <span className="text-xl font-bold text-dust">$</span>
        <span className="text-5xl font-black text-ink">{plan.price}</span>
        <span className="text-sm font-mono text-dust font-bold ml-2">/month</span>
      </div>

      {/* Features */}
      <ul className="flex-1 flex flex-col gap-4 mb-10">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-xs font-bold text-dust group-hover:text-ink transition-colors">
            <span className="text-teal-primary font-black mt-[-2px]">✓</span>
            {f}
          </li>
        ))}
      </ul>

      {/* Action Button */}
      <button
        disabled={isLoading}
        onClick={() => onSelect(plan.lookupKey)}
        className={`
          ${plan.highlight ? 'btn-wire-teal' : 'btn-wire'}
          w-full py-4 text-xs font-black tracking-widest
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        <span className="relative z-10 flex items-center justify-center gap-3 uppercase">
          {isThisLoading ? (
            <>
              <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            'Choose This Plan'
          )}
        </span>
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function PricingPage() {
  const { user, isAuth } = useAppSelector((state: RootState) => state.authSlice);
  const userId = user?.sub;
  const dispatch = useAppDispatch();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [activeLookupKey, setActiveLookupKey] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: createCheckoutSession,
    onSuccess: (data) => {
      window.location.href = data.url;
    },
    onError: (err: Error) => {
      setErrorMsg(err.message);
      setActiveLookupKey(null);
    },
  });

  const handleSelect = (lookupKey: string) => {
    if (!isAuth) {
      dispatch(toggleAuthModal());
      return;
    }
    setErrorMsg(null);
    setActiveLookupKey(lookupKey);
    mutation.mutate({ lookupKey, userId: userId! });
  };

  if (!mounted) {
    return (
      <div className="min-h-full w-full flex items-center justify-center p-20">
        <div className="font-mono text-xs uppercase opacity-50 animate-pulse">
          Loading pricing options...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full w-full flex flex-col items-center">
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-10 items-center py-16 px-6 relative z-10">

        {/* Header */}
        <header className="text-center mb-16 max-w-2xl flex flex-col items-center">
          <div className="badge-tape mb-6">Subscription Plans</div>

          <h1 className="text-5xl md:text-7xl font-black text-ink mb-6 tracking-tighter uppercase leading-none">
            Upgrade your <span className="text-teal-primary">Access</span>
          </h1>

          <p className="text-lg text-dust font-medium leading-relaxed">
            Get more out of your learning journey. Unlock premium lessons,
            exclusive paths, and professional-grade insights.
          </p>
        </header>

        {/* Plans Grid */}
        <div className="flex flex-row sm:flex-col justify-center gap-10 items-stretch w-full max-w-5xl">
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

        {/* Error Message */}
        {errorMsg && (
          <div className="mt-12 p-6 border-2 border-ink border-dashed text-ink font-mono text-xs uppercase bg-surface">
            <span className="font-black text-teal-primary mr-2">Notice:</span>
            {errorMsg}
          </div>
        )}

        {/* Footer annotations */}
        <div className="mt-20 flex flex-col items-center gap-2 opacity-30">
          <div className="w-px h-12 bg-ink" />
          <span className="font-mono text-[8px] uppercase font-bold">Secure Payment via Stripe</span>
        </div>
      </div>
    </div>
  );
}
