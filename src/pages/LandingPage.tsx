import {
  MONETIZATION,
  formatPremiumPriceFull,
  resolveUpgradeHref,
} from '../config/monetization';
import {
  FEATURES,
  FREE_CV_LIMIT,
  FREE_TEMPLATES,
  TEMPLATE_INFO,
  PLAN_LABELS,
} from '../lib/entitlements';

const FREE_FEATURES = [
  'Full CV editor: all 9 content sections',
  `Templates: ${FREE_TEMPLATES.map((t) => TEMPLATE_INFO[t].name).join(' + ')}`,
  `${FREE_CV_LIMIT} CV saved locally in your browser`,
  'Print & PDF export',
  'Drag-and-drop section reordering',
  'Dark / light mode',
];

const price = () => formatPremiumPriceFull();

export function LandingPage() {
  const upgradeHref = resolveUpgradeHref();
  const isExternal = upgradeHref !== null && !upgradeHref.startsWith('#');

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <header className="border-b border-slate-200 dark:border-slate-700">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <a href="#/" className="text-lg font-bold tracking-tight">
            <span aria-hidden="true">🛠️</span> CVForge
          </a>
          <nav aria-label="Main" className="flex items-center gap-4 text-sm">
            <a
              href="#features"
              className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              Pricing
            </a>
            <a
              href="#/app"
              className="rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              Open the app
            </a>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:py-24">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
            Forge a CV that gets you{' '}
            <span className="text-blue-600 dark:text-blue-400">hired</span>.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-slate-600 dark:text-slate-300 sm:text-lg">
            A professional, privacy-first CV and resume builder. Live preview,
            polished templates, ATS checks — and your data never leaves your
            browser.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#/app"
              className="w-full rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto"
            >
              Start building — free
            </a>
            <a
              href="#pricing"
              className="w-full rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold hover:bg-slate-50 sm:w-auto dark:border-slate-600 dark:hover:bg-slate-800"
            >
              See Premium — {price()}
            </a>
          </div>
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
            No account. No sign-up. No tracking. Works offline.
          </p>
        </section>

        {/* Features */}
        <section
          id="features"
          className="border-t border-slate-200 bg-slate-50 py-14 dark:border-slate-700 dark:bg-slate-800/50"
        >
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Everything you need for a standout CV
            </h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: 'Live preview',
                  text: 'Every keystroke updates a full-size A4 preview of your CV in real time.',
                },
                {
                  title: 'Five templates',
                  text: 'From timeless single-column layouts to an ATS-optimized format that parsers love.',
                },
                {
                  title: 'All sections covered',
                  text: 'Experience, education, skills, projects, certifications, languages, references — reorderable and hideable.',
                },
                {
                  title: 'ATS checks',
                  text: 'Structural readiness checks plus keyword matching against the job description.',
                },
                {
                  title: 'Cover letters',
                  text: 'Write matching cover letters that reuse your CV’s contact details and styling.',
                },
                {
                  title: 'Local-first privacy',
                  text: 'Your CV lives in your browser. No servers, no uploads, no accounts, no tracking.',
                },
              ].map((f) => (
                <li
                  key={f.title}
                  className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800"
                >
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
                    {f.text}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-14">
          <div className="mx-auto max-w-4xl px-4">
            <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
              Simple, honest pricing
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-center text-sm text-slate-600 dark:text-slate-300">
              Start free with everything you need. Upgrade once if you want
              more — no subscriptions.
            </p>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {/* Free */}
              <div className="rounded-xl border border-slate-200 p-6 dark:border-slate-700">
                <h3 className="text-lg font-bold">{PLAN_LABELS.free}</h3>
                <p className="mt-1 text-3xl font-extrabold">$0</p>
                <p className="text-xs text-slate-500">free forever</p>
                <ul className="mt-5 space-y-2 text-sm">
                  {FREE_FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span aria-hidden="true" className="text-emerald-500">
                        ✓
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#/app"
                  className="mt-6 block rounded-lg border border-slate-300 px-4 py-2.5 text-center text-sm font-semibold hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800"
                >
                  Start for free
                </a>
              </div>

              {/* Premium */}
              <div className="relative rounded-xl border-2 border-blue-600 p-6 dark:border-blue-500">
                <span className="absolute -top-3 left-4 rounded-full bg-blue-600 px-3 py-0.5 text-xs font-semibold text-white">
                  Most popular
                </span>
                <h3 className="text-lg font-bold">{PLAN_LABELS.premium}</h3>
                <p className="mt-1 text-3xl font-extrabold">{price()}</p>
                <p className="text-xs text-slate-500">one-time payment</p>
                <ul className="mt-5 space-y-2 text-sm">
                  <li className="flex items-start gap-2 font-medium">
                    <span aria-hidden="true" className="text-emerald-500">
                      ✓
                    </span>
                    Everything in Free, plus:
                  </li>
                  {Object.values(FEATURES).map((f) => (
                    <li key={f.label} className="flex items-start gap-2">
                      <span aria-hidden="true" className="text-emerald-500">
                        ✓
                      </span>
                      <span>
                        <strong>{f.label}</strong>
                        <span className="text-slate-500 dark:text-slate-400">
                          {' '}
                          — {f.description}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
                {upgradeHref ? (
                  <a
                    href={upgradeHref}
                    {...(isExternal
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                    className="mt-6 block rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    Upgrade to Premium
                  </a>
                ) : (
                  <p
                    role="status"
                    className="mt-6 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-center text-sm text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  >
                    Checkout not yet configured on this deployment.
                  </p>
                )}
                {MONETIZATION.testMode && !isExternal && (
                  <p className="mt-2 text-center text-xs font-medium text-amber-600 dark:text-amber-400">
                    Development test mode — the checkout link opens the internal
                    test page; no payment is processed.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Privacy */}
        <section className="border-t border-slate-200 bg-slate-50 py-12 dark:border-slate-700 dark:bg-slate-800/50">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h2 className="text-xl font-bold">Your data stays yours</h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              CVForge runs entirely in your browser. Your CVs are saved to this
              device’s local storage and are never uploaded, shared, or synced
              anywhere. Clearing your browser’s site data deletes them — export
              a JSON backup (Premium) if you want to keep copies.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-700">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-6 text-xs text-slate-500 dark:text-slate-400">
          <p>© 2026 CVForge. All rights reserved.</p>
          <p>
            Free plan · {PLAN_LABELS.premium} {price()} one-time
          </p>
        </div>
      </footer>
    </div>
  );
}
