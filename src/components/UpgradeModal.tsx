import { useEffect, useRef } from 'react';
import { MONETIZATION, formatPremiumPrice } from '../config/monetization';
import { PREMIUM_BENEFITS, type FeatureInfo } from '../lib/entitlements';
import { useApp } from '../state/AppContext';

interface UpgradeModalProps {
  open: boolean;
  feature: FeatureInfo | null;
  onClose: () => void;
}

export function UpgradeModal({ open, feature, onClose }: UpgradeModalProps) {
  const { dispatch } = useApp();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upgrade-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-slate-800">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">
              🔒 Premium feature
            </p>
            <h2
              id="upgrade-modal-title"
              className="mt-1 text-xl font-bold text-slate-900 dark:text-white"
            >
              Upgrade to CVForge Premium
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close upgrade dialog"
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700"
          >
            ✕
          </button>
        </div>

        {feature && (
          <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
            <strong>{feature.label}</strong> — {feature.description}
          </p>
        )}

        <ul className="mt-4 space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
          {PREMIUM_BENEFITS.map((benefit) => (
            <li key={benefit} className="flex items-center gap-2">
              <span aria-hidden="true" className="text-emerald-500">✓</span>
              {benefit}
            </li>
          ))}
        </ul>

        <p className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
          {formatPremiumPrice()}{' '}
          <span className="text-sm font-normal text-slate-500">
            one-time payment
          </span>
        </p>

        <div className="mt-4 flex flex-col gap-2">
          <a
            href={MONETIZATION.upgradeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Continue to checkout →
          </a>
          {MONETIZATION.devUnlockPremium && (
            <button
              type="button"
              onClick={() => {
                dispatch({ type: 'SET_PLAN', plan: 'premium' });
                onClose();
              }}
              className="rounded-lg border border-dashed border-slate-300 px-4 py-2 text-xs text-slate-500 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700"
            >
              Activate Premium (demo mode — no payment)
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Maybe later
          </button>
        </div>
        <p className="mt-3 text-xs text-slate-400">
          Your CV data stays on this device. Checkout opens in a new tab.
        </p>
      </div>
    </div>
  );
}
