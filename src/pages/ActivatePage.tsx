import { useState, type FormEvent } from 'react';
import { useApp } from '../state/AppContext';
import { useUpgrade } from '../state/UpgradeContext';
import { LicenseError } from '../lib/license';
import {
  formatPremiumPriceFull,
  resolveUpgradeHref,
  MONETIZATION,
} from '../config/monetization';

/**
 * Premium activation screen (#/activate).
 *
 * A customer who bought Premium at the Lemon Squeezy checkout receives a
 * license key by email and pastes it here. The key is verified against
 * Lemon Squeezy's real license API (activate → device instance). Only a
 * genuine, in-limit, non-expired key unlocks Premium.
 */
export function ActivatePage() {
  const { state, activatePremium, deactivatePremium } = useApp();
  const { isPremium } = useUpgrade();
  const [key, setKey] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const buyHref = resolveUpgradeHref();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setBusy(true);
    try {
      await activatePremium(key);
      setSuccess(true);
      setKey('');
    } catch (err) {
      setError(
        err instanceof LicenseError
          ? err.message
          : 'Activation failed. Please try again.',
      );
    } finally {
      setBusy(false);
    }
  }

  async function onDeactivate() {
    setBusy(true);
    setError(null);
    try {
      await deactivatePremium();
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-100 p-6 dark:bg-slate-900">
      <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-lg dark:bg-slate-800">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          CVForge Premium
        </h1>

        {isPremium ? (
          <div className="mt-4">
            <p
              role="status"
              className="rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200"
            >
              ✓ Premium is active on this device.
            </p>
            {state.license?.customerEmail && (
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                Licensed to{' '}
                <strong className="text-slate-900 dark:text-white">
                  {state.license.customerEmail}
                </strong>
              </p>
            )}
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Activated{' '}
              {state.license?.activatedAt
                ? new Date(state.license.activatedAt).toLocaleString()
                : ''}
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <a
                href="#/app"
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700"
              >
                Open the app →
              </a>
              <button
                type="button"
                onClick={onDeactivate}
                disabled={busy}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Deactivate this device
              </button>
            </div>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              Deactivating releases this device so the key can be used on
              another one.
            </p>
          </div>
        ) : (
          <div className="mt-4">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Already bought Premium? Enter the license key from your Lemon
              Squeezy receipt email to activate it on this device.
            </p>

            {buyHref && (
              <a
                href={buyHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block rounded-lg bg-amber-400 px-4 py-3 text-center text-sm font-bold text-slate-900 hover:bg-amber-300"
              >
                Buy Premium — {formatPremiumPriceFull(MONETIZATION)} one-time →
              </a>
            )}

            <form onSubmit={onSubmit} className="mt-5">
              <label
                htmlFor="license-key"
                className="block text-sm font-semibold text-slate-900 dark:text-white"
              >
                License key
              </label>
              <input
                id="license-key"
                type="text"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
                autoComplete="off"
                spellCheck={false}
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-mono text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
              />
              {error && (
                <p
                  role="alert"
                  className="mt-3 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-700 dark:bg-red-900/30 dark:text-red-300"
                >
                  {error}
                </p>
              )}
              {success && (
                <p
                  role="status"
                  className="mt-3 rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200"
                >
                  ✓ Premium activated. Enjoy!
                </p>
              )}
              <button
                type="submit"
                disabled={busy || !key.trim()}
                className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {busy ? 'Verifying…' : 'Activate Premium'}
              </button>
            </form>

            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
              The key is verified with Lemon Squeezy and bound to this device.
              Nothing is shared with any third party besides Lemon Squeezy's
              license server.
            </p>
          </div>
        )}

        <a
          href="#/app"
          className="mt-6 inline-block text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400"
        >
          ← Back to the app
        </a>
      </div>
    </main>
  );
}
