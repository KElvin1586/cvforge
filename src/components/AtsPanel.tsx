import { useMemo, useState } from 'react';
import { useApp } from '../state/AppContext';
import { useUpgrade } from '../state/UpgradeContext';
import { analyzeCv } from '../lib/ats';

export function AtsPanel() {
  const { activeCv } = useApp();
  const { requireFeature, isPremium } = useUpgrade();
  const [jobDescription, setJobDescription] = useState('');

  const report = useMemo(
    () => (activeCv && isPremium ? analyzeCv(activeCv, jobDescription) : null),
    [activeCv, jobDescription, isPremium],
  );

  if (!activeCv) return null;

  if (!isPremium) {
    return (
      <div className="mx-auto max-w-lg rounded-xl border border-dashed border-amber-300 bg-amber-50 p-8 text-center dark:border-amber-700 dark:bg-amber-900/20">
        <p className="text-3xl" aria-hidden="true">
          🔒
        </p>
        <h2 className="mt-2 text-lg font-bold text-slate-800 dark:text-slate-100">
          ATS tools are a Premium feature
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Check your CV against applicant tracking systems: structural checks,
          and keyword matching against a job description.
        </p>
        <button
          type="button"
          onClick={() => requireFeature('atsTools')}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Upgrade to Premium
        </button>
      </div>
    );
  }

  const passedCount = report?.checks.filter((c) => c.passed).length ?? 0;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          ATS readiness for “{activeCv.name}”
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {passedCount}/{report?.checks.length ?? 0} structural checks passed ·{' '}
          {report?.wordCount ?? 0} words
        </p>
      </div>

      <ul className="space-y-2">
        {report?.checks.map((check) => (
          <li
            key={check.id}
            className={`flex items-start gap-3 rounded-lg border p-3 ${
              check.passed
                ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20'
                : 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20'
            }`}
          >
            <span aria-hidden="true">{check.passed ? '✅' : '⚠️'}</span>
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                {check.label}
              </p>
              {!check.passed && check.hint && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {check.hint}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>

      <div>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Paste a job description to check keyword coverage
          </span>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={6}
            placeholder="Paste the full job posting here…"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
          />
        </label>
      </div>

      {report && report.matchPercent !== null && (
        <div className="space-y-3 rounded-lg border border-slate-200 p-4 dark:border-slate-600">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            Keyword match: {report.matchPercent}%
          </p>
          <div
            className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700"
            role="progressbar"
            aria-valuenow={report.matchPercent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-2 rounded-full bg-blue-600"
              style={{ width: `${report.matchPercent}%` }}
            />
          </div>
          {report.missingKeywords.length > 0 && (
            <div>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                Missing keywords — consider weaving these in where truthful:
              </p>
              <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                {report.missingKeywords.join(', ')}
              </p>
            </div>
          )}
          {report.matchedKeywords.length > 0 && (
            <div>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                Matched keywords:
              </p>
              <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-300">
                {report.matchedKeywords.join(', ')}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
