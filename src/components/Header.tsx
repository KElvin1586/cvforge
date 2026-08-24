import { useApp } from '../state/AppContext';
import { useUpgrade } from '../state/UpgradeContext';
import { formatPremiumPrice } from '../config/monetization';

export function Header({ onPrint }: { onPrint: () => void }) {
  const { state, dispatch } = useApp();
  const { openUpgrade, isPremium } = useUpgrade();

  return (
    <header className="no-print sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-700 dark:bg-slate-900/90">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="text-xl">🛠️</span>
          <h1 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
            CVForge
          </h1>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
              isPremium
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
            }`}
          >
            {isPremium ? 'Premium' : 'Free'}
          </span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={onPrint}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
          >
            🖨 Print / PDF
          </button>
          <button
            type="button"
            onClick={() =>
              dispatch({
                type: 'SET_THEME',
                theme: state.theme === 'dark' ? 'light' : 'dark',
              })
            }
            aria-label={
              state.theme === 'dark'
                ? 'Switch to light mode'
                : 'Switch to dark mode'
            }
            className="rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600"
          >
            {state.theme === 'dark' ? '☀️' : '🌙'}
          </button>
          {!isPremium && (
            <button
              type="button"
              onClick={() => openUpgrade()}
              className="rounded-md bg-amber-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-amber-600"
            >
              Upgrade — {formatPremiumPrice()}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
