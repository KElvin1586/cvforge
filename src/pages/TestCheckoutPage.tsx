import { useApp } from '../state/AppContext';
import { MONETIZATION, formatPremiumPrice } from '../config/monetization';
import { PLAN_LABELS } from '../lib/entitlements';

/**
 * Internal test checkout — DEVELOPMENT/TEST BUILDS ONLY.
 *
 * This page exists so developers and QA can exercise the full upgrade flow
 * (modal → checkout → unlocked premium, and back) without any payment.
 * It never claims a payment happened, stores no credentials, and makes no
 * network calls. In production builds (testMode disabled) it renders a
 * "not available" notice instead.
 */
export function TestCheckoutPage() {
  const { state, dispatch } = useApp();
  const plan = state.plan;

  if (!MONETIZATION.testMode) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-100 p-6 text-center dark:bg-slate-900">
        <div className="max-w-md rounded-xl bg-white p-8 shadow dark:bg-slate-800">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Test checkout unavailable
          </h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            The internal test checkout is only available in development or
            test builds. This build has test mode disabled.
          </p>
          <a
            href="#/"
            className="mt-6 inline-block rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900"
          >
            ← Back to CVForge
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-100 p-6 dark:bg-slate-900">
      <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-lg dark:bg-slate-800">
        <p
          role="alert"
          className="rounded-lg border-2 border-dashed border-amber-400 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900 dark:bg-amber-900/30 dark:text-amber-200"
        >
          ⚠ DEVELOPMENT / TEST MODE — No real payment is processed on this
          page. Nothing is charged, collected, sent, or stored.
        </p>

        <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
          Test checkout
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          This internal page exists only to test the upgrade flow. It flips
          the local entitlement flag in this browser — it does not process,
          simulate, or record any payment.
        </p>

        <div className="mt-5 rounded-lg border border-slate-200 p-4 dark:border-slate-600">
          <div className="flex items-baseline justify-between">
            <h2 className="font-semibold text-slate-900 dark:text-white">
              CVForge Premium
            </h2>
            <p className="text-xl font-bold text-slate-900 dark:text-white">
              {formatPremiumPrice()}
            </p>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            One-time · price displayed from centralized configuration
          </p>
        </div>

        <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
          Current plan in this browser:{' '}
          <strong
            className={
              plan === 'premium'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-slate-900 dark:text-white'
            }
          >
            {PLAN_LABELS[plan]}
          </strong>
        </p>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => dispatch({ type: 'SET_PLAN', plan: 'premium' })}
            disabled={plan === 'premium'}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Test Premium entitlement
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: 'SET_PLAN', plan: 'free' })}
            disabled={plan === 'free'}
            className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Test Free entitlement
          </button>
        </div>

        <a
          href="#/app"
          className="mt-6 inline-block rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900"
        >
          Open the app →
        </a>
      </div>
    </main>
  );
}
