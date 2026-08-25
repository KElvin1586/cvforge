import { useState, Suspense, lazy } from 'react';
import { AppProvider, useApp } from './state/AppContext';
import { UpgradeProvider } from './state/UpgradeContext';
import { Header } from './components/Header';
import { CvToolbar } from './components/CvToolbar';
import { EditorPanel } from './components/editor/EditorPanel';
import { StylePanel } from './components/editor/StylePanel';
import { CvPreview } from './components/preview/CvPreview';
import { CoverLetterEditor } from './components/CoverLetterEditor';
import { AtsPanel } from './components/AtsPanel';
import { createEmptyCv, createSampleCv } from './types/cv';
import { useHashRoute } from './lib/router';
import { LandingPage } from './pages/LandingPage';
import { ActivatePage } from './pages/ActivatePage';

// The internal test checkout exists ONLY in development/test builds.
// import.meta.env values are compile-time constants, so in a production
// build this branch is dead-code-eliminated and the test checkout module
// (including the Premium entitlement toggle) is excluded from the bundle.
const TestCheckout =
  import.meta.env.DEV || import.meta.env.VITE_ENABLE_TEST_MODE === 'true'
    ? lazy(() =>
        import('./pages/TestCheckoutPage').then((m) => ({
          default: m.TestCheckoutPage,
        })),
      )
    : null;

function CheckoutUnavailable() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-100 p-6 text-center dark:bg-slate-900">
      <div className="max-w-md rounded-xl bg-white p-8 shadow dark:bg-slate-800">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          Page not available
        </h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          This build does not include a checkout page. The Premium upgrade
          link is configured by the site owner at build time.
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

type Tab = 'editor' | 'coverLetter' | 'ats';

function EmptyState() {
  const { dispatch } = useApp();
  return (
    <div className="mx-auto mt-16 max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-800">
      <p className="text-4xl" aria-hidden="true">
        📄
      </p>
      <h2 className="mt-3 text-xl font-bold text-slate-900 dark:text-white">
        Create your first CV
      </h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Start from scratch or explore with a filled-in sample. Everything is
        stored locally in your browser.
      </p>
      <div className="mt-5 flex justify-center gap-2">
        <button
          type="button"
          onClick={() => dispatch({ type: 'ADD_CV', cv: createEmptyCv('My CV') })}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Start blank
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: 'ADD_CV', cv: createSampleCv() })}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          Load sample
        </button>
      </div>
    </div>
  );
}

function EditorWorkspace() {
  const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit');

  return (
    <>
      <div className="no-print mb-3 flex gap-1 rounded-lg bg-slate-200 p-1 lg:hidden dark:bg-slate-700">
        {(['edit', 'preview'] as const).map((view) => (
          <button
            key={view}
            type="button"
            onClick={() => setMobileView(view)}
            aria-pressed={mobileView === view}
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium capitalize ${
              mobileView === view
                ? 'bg-white text-slate-900 shadow dark:bg-slate-800 dark:text-white'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            {view === 'edit' ? '✏️ Edit' : '👁 Preview'}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(340px,420px)_1fr]">
        <div
          className={`no-print space-y-4 ${mobileView === 'edit' ? '' : 'hidden lg:block'}`}
        >
          <section className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
            <StylePanel />
          </section>
          <EditorPanel />
        </div>
        <div
          className={`print-area overflow-x-auto pb-8 ${mobileView === 'preview' ? '' : 'hidden lg:block'}`}
        >
          <CvPreview />
        </div>
      </div>
    </>
  );
}

function Shell() {
  const { state } = useApp();
  const [tab, setTab] = useState<Tab>('editor');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'editor', label: 'CV Editor' },
    { id: 'coverLetter', label: 'Cover Letter' },
    { id: 'ats', label: 'ATS Check' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <Header onPrint={() => window.print()} />

      <main className="mx-auto max-w-7xl px-4 py-4">
        <div className="no-print mb-4">
          <CvToolbar />
        </div>

        {state.cvs.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <nav className="no-print mb-4 flex gap-1 border-b border-slate-200 dark:border-slate-700" aria-label="Workspace">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  aria-current={tab === t.id ? 'page' : undefined}
                  className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium ${
                    tab === t.id
                      ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                      : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </nav>

            {tab === 'editor' && <EditorWorkspace />}
            {tab === 'coverLetter' && <CoverLetterEditor />}
            {tab === 'ats' && <AtsPanel />}
          </>
        )}

        <footer className="no-print mt-10 border-t border-slate-200 py-4 text-center text-xs text-slate-400 dark:border-slate-700">
          CVForge — your data never leaves this browser. Print any view to save
          it as PDF.
        </footer>
      </main>
    </div>
  );
}

function Routed() {
  const route = useHashRoute();
  if (route === 'app') return <Shell />;
  if (route === 'activate') return <ActivatePage />;
  if (route === 'checkout') {
    return TestCheckout ? (
      <Suspense fallback={null}>
        <TestCheckout />
      </Suspense>
    ) : (
      <CheckoutUnavailable />
    );
  }
  return <LandingPage />;
}

export default function App() {
  return (
    <AppProvider>
      <UpgradeProvider>
        <Routed />
      </UpgradeProvider>
    </AppProvider>
  );
}
