'use client';

import { getMe } from '@repo/gql';
import { RootState, useAppSelector, useAppDispatch, toggleAuthModal } from '@repo/reduxSetup';
import { useMutation, useQuery } from '@tanstack/react-query';
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
  color: 'teal' | 'emerald' | 'purple';
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
    color: 'teal',
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
    color: 'purple',
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
  userId?: string;
  isLoading: boolean;
  activeLookupKey: string | null;
  onSelect: (lookupKey: string) => void;
}) {
  const isThisLoading = isLoading && activeLookupKey === plan.lookupKey;
  
  const COLOR_MAP = {
    teal: {
      text: 'text-teal-glow',
      border: 'border-teal-glow/50',
      hoverBorder: 'hover:border-teal-glow',
      shadow: 'shadow-glow-teal',
      bg: 'bg-teal-glow/5',
      accent: 'bg-teal-glow',
      glow: 'text-glow-teal',
    },
    emerald: {
      text: 'text-emerald-glow',
      border: 'border-emerald-glow/50',
      hoverBorder: 'hover:border-emerald-glow',
      shadow: 'shadow-glow-emerald',
      bg: 'bg-emerald-glow/5',
      accent: 'bg-emerald-glow',
      glow: 'text-glow-emerald',
    },
    purple: {
      text: 'text-purple-glow',
      border: 'border-purple-glow/50',
      hoverBorder: 'hover:border-purple-glow',
      shadow: 'shadow-glow-purple',
      bg: 'bg-purple-glow/5',
      accent: 'bg-purple-glow',
      glow: 'text-glow-purple',
    }
  };

  const c = COLOR_MAP[plan.color];

  return (
    <div
      className={`
        group relative flex flex-col p-8 w-full max-w-[340px]
        bg-surface-900 border border-surface-800
        ${plan.highlight ? c.border : 'hover:border-surface-700'}
        ${c.hoverBorder}
        transition-all duration-300
        [clip-path:polygon(0_0,calc(100%-20px)_0,100%_20px,100%_100%,20px_100%,0_calc(100%-20px))]
        ${plan.highlight ? 'scale-105 z-10 shadow-card-lg' : 'shadow-card'}
      `}
    >
      {/* Badge */}
      {plan.badge && (
        <div className={`absolute top-0 right-10 px-3 py-1 text-[9px] font-digital font-bold ${c.accent} text-black z-20`}>
          {plan.badge}
        </div>
      )}

      {/* Top Accent Bar */}
      <div className={`absolute top-0 left-0 right-0 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left ${c.accent}`} />

      {/* Header */}
      <div className="mb-8">
        <span className="text-[10px] font-terminal text-text-secondary opacity-50 uppercase tracking-[0.2em]">
          {"//"} {plan.id}_PLAN
        </span>
        <h2 className={`text-3xl font-digital font-black mt-2 ${c.text} ${c.glow}`}>
          {plan.name}
        </h2>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-1 mb-8 pb-8 border-b border-surface-800">
        <span className="text-xl font-digital text-text-secondary">$</span>
        <span className="text-5xl font-digital font-black text-text-primary">{plan.price}</span>
        <span className="text-sm font-terminal text-text-secondary opacity-50 ml-2">/{plan.interval}</span>
      </div>

      {/* Features */}
      <ul className="flex-1 flex flex-col gap-4 mb-10">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-xs font-terminal text-text-secondary group-hover:text-text-primary transition-colors">
            <span className={`${c.text} mt-0.5`}>▸</span>
            {f}
          </li>
        ))}
      </ul>

      {/* Action Button */}
      <button
        disabled={isLoading}
        onClick={() => onSelect(plan.lookupKey)}
        className={`
          relative w-full py-4 font-digital font-bold text-xs tracking-[0.2em]
          border transition-all duration-300 overflow-hidden
          [clip-path:polygon(0_0,calc(100%-10px)_0,100%_10px,100%_100%,10px_100%,0_calc(100%-10px))]
          ${plan.highlight 
            ? `${c.accent} border-transparent text-black hover:brightness-110` 
            : `bg-transparent border-surface-700 text-text-secondary ${c.hoverBorder} ${c.text}`
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        <div className={`absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 -z-10 ${plan.highlight ? '' : c.bg}`} />
        <span className="relative z-10 flex items-center justify-center gap-3">
          {isThisLoading ? (
            <>
              <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
              EXECUTING...
            </>
          ) : (
            'INITIALIZE_ACCESS'
          )}
        </span>
      </button>

      {/* Corner bracket */}
      <div className={`absolute bottom-0 right-0 w-6 h-6 border-b border-r transition-colors duration-300 ${plan.highlight ? c.border : 'border-surface-800'}`} />
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
      <div className="h-screen w-full home-root flex items-center justify-center">
        <div className="text-teal-glow font-terminal animate-pulse uppercase tracking-[0.4em]">
          INITIALIZING_PRICING_MODULE...
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full home-root overflow-hidden p-0 flex flex-col items-center">
      {/* Ambient glow orbs */}
      <div className="home-orb home-orb-teal opacity-20" />
      <div className="home-orb home-orb-emerald opacity-10" />

      <div className="home-content h-full w-full overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex flex-col items-center py-20 px-6">
        
        {/* Header */}
        <header className="text-center mb-16 max-w-2xl">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-12 bg-teal-glow opacity-30" />
            <span className="text-[10px] font-terminal text-teal-glow uppercase tracking-[0.4em]">
              ROOT_LMS // SUBSCRIPTION_MODELS
            </span>
            <div className="h-px w-12 bg-teal-glow opacity-30" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-digital font-black text-text-primary mb-6 tracking-tight">
            UPGRADE_YOUR_<span className="text-teal-glow text-glow-teal">SYSTEM</span>
          </h1>
          
          <p className="text-xs md:text-sm font-terminal text-text-secondary leading-relaxed uppercase tracking-wider opacity-70">
            Unlock premium data streams. Access restricted tutorials, 
            exclusive roadmaps, and high-level architectural insights.
          </p>
        </header>

        {/* Plans Grid */}
        <div className="flex flex-wrap justify-center gap-8 items-center w-full max-w-5xl">
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
          <div className="mt-12 p-4 border border-red-500/30 bg-red-500/5 text-red-500 text-[10px] font-terminal uppercase tracking-widest [clip-path:polygon(0_0,calc(100%-10px)_0,100%_10px,100%_100%,10px_100%,0_calc(100%-10px))]">
            <span className="opacity-50 mr-2">ERR ▸</span>
            {errorMsg}
          </div>
        )}
      </div>
    </div>
  );
}

