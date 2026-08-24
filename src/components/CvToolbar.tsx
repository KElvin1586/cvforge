import { useRef, useState } from 'react';
import { useApp } from '../state/AppContext';
import { useUpgrade } from '../state/UpgradeContext';
import {
  FREE_CV_LIMIT,
  canCreateCv,
} from '../lib/entitlements';
import {
  downloadJson,
  exportCvToJson,
  readFileAsText,
  validateImportedCv,
} from '../lib/importExport';
import { createEmptyCv, createSampleCv, uid, type CvDocument } from '../types/cv';

const btn =
  'rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600';

export function CvToolbar() {
  const { state, dispatch, activeCv, updateActiveCv } = useApp();
  const { requireFeature, isPremium } = useUpgrade();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [showVersions, setShowVersions] = useState(false);
  const [versionLabel, setVersionLabel] = useState('');

  const addCv = (cv: CvDocument) => dispatch({ type: 'ADD_CV', cv });

  const handleNew = (withSample: boolean) => {
    if (!canCreateCv(state.plan, state.cvs.length)) {
      requireFeature('multipleCvs');
      return;
    }
    addCv(withSample ? createSampleCv() : createEmptyCv());
  };

  const handleDuplicate = () => {
    if (!activeCv) return;
    if (!canCreateCv(state.plan, state.cvs.length)) {
      requireFeature('multipleCvs');
      return;
    }
    const copy: CvDocument = {
      ...structuredClone(activeCv),
      id: uid(),
      name: `${activeCv.name} (copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    addCv(copy);
  };

  const handleDelete = () => {
    if (!activeCv) return;
    if (window.confirm(`Delete "${activeCv.name}"? This cannot be undone.`)) {
      dispatch({ type: 'DELETE_CV', id: activeCv.id });
    }
  };

  const handleExport = () => {
    if (!activeCv) return;
    if (!requireFeature('importExport')) return;
    const safe = activeCv.name.replace(/[^a-z0-9-_]+/gi, '-').toLowerCase();
    downloadJson(`cvforge-${safe || 'cv'}.json`, exportCvToJson(activeCv));
  };

  const handleImportClick = () => {
    if (!requireFeature('importExport')) return;
    fileInputRef.current?.click();
  };

  const handleImportFile = async (file: File) => {
    setImportError(null);
    try {
      const text = await readFileAsText(file);
      const parsed: unknown = JSON.parse(text);
      const cv = validateImportedCv(parsed);
      if (!cv) {
        setImportError('That file is not a valid CVForge CV export.');
        return;
      }
      if (!canCreateCv(state.plan, state.cvs.length)) {
        requireFeature('multipleCvs');
        return;
      }
      cv.id = uid();
      addCv(cv);
    } catch {
      setImportError('Could not read that file. Please choose a JSON export.');
    }
  };

  const cvVersions = state.versions.filter((v) => v.cvId === activeCv?.id);

  const saveVersion = () => {
    if (!activeCv) return;
    if (!requireFeature('versions')) return;
    const label = versionLabel.trim() || `Version ${cvVersions.length + 1}`;
    dispatch({
      type: 'ADD_VERSION',
      version: {
        id: uid(),
        cvId: activeCv.id,
        label,
        createdAt: Date.now(),
        snapshot: structuredClone(activeCv),
      },
    });
    setVersionLabel('');
  };

  const restoreVersion = (versionId: string) => {
    const version = state.versions.find((v) => v.id === versionId);
    if (!version || !activeCv) return;
    if (
      window.confirm(
        `Restore "${version.label}"? Current content of "${activeCv.name}" will be replaced.`,
      )
    ) {
      updateActiveCv(() => ({
        ...structuredClone(version.snapshot),
        id: activeCv.id,
      }));
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <select
          aria-label="Select CV"
          value={state.activeCvId ?? ''}
          onChange={(e) => dispatch({ type: 'SELECT_CV', id: e.target.value })}
          className="max-w-48 rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
        >
          {state.cvs.map((cv) => (
            <option key={cv.id} value={cv.id}>
              {cv.name}
            </option>
          ))}
        </select>

        {activeCv && (
          <input
            aria-label="CV name"
            value={activeCv.name}
            onChange={(e) =>
              updateActiveCv((cv) => ({ ...cv, name: e.target.value }))
            }
            className="w-40 rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
          />
        )}

        <button type="button" className={btn} onClick={() => handleNew(false)}>
          + New CV
        </button>
        <button type="button" className={btn} onClick={() => handleNew(true)}>
          Sample CV
        </button>
        <button
          type="button"
          className={btn}
          onClick={handleDuplicate}
          disabled={!activeCv}
        >
          Duplicate
        </button>
        <button
          type="button"
          className={`${btn} text-red-600 dark:text-red-400`}
          onClick={handleDelete}
          disabled={!activeCv}
        >
          Delete
        </button>

        <span className="mx-1 hidden h-5 w-px bg-slate-300 sm:block dark:bg-slate-600" />

        <button
          type="button"
          className={btn}
          onClick={handleImportClick}
        >
          Import {!isPremium && '🔒'}
        </button>
        <button
          type="button"
          className={btn}
          onClick={handleExport}
          disabled={!activeCv}
        >
          Export {!isPremium && '🔒'}
        </button>
        <button
          type="button"
          className={btn}
          onClick={() => setShowVersions((v) => !v)}
          disabled={!activeCv}
          aria-expanded={showVersions}
        >
          Versions {!isPremium && '🔒'}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          aria-hidden="true"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleImportFile(file);
            e.target.value = '';
          }}
        />
      </div>

      {importError && (
        <p role="alert" className="text-xs text-red-600 dark:text-red-400">
          {importError}
        </p>
      )}

      {!isPremium && (
        <p className="text-xs text-slate-400">
          Free plan: {state.cvs.length}/{FREE_CV_LIMIT} CV saved.
        </p>
      )}

      {showVersions && activeCv && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-800/60">
          {isPremium ? (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  aria-label="Version label"
                  value={versionLabel}
                  onChange={(e) => setVersionLabel(e.target.value)}
                  placeholder="Version label (e.g. “For Google”)"
                  className="w-56 rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
                />
                <button type="button" className={btn} onClick={saveVersion}>
                  Save version
                </button>
              </div>
              {cvVersions.length === 0 ? (
                <p className="mt-2 text-xs text-slate-400">
                  No saved versions yet.
                </p>
              ) : (
                <ul className="mt-2 space-y-1">
                  {cvVersions.map((v) => (
                    <li
                      key={v.id}
                      className="flex items-center justify-between rounded bg-white px-2 py-1 text-xs dark:bg-slate-700"
                    >
                      <span className="text-slate-700 dark:text-slate-200">
                        {v.label} — {new Date(v.createdAt).toLocaleString()}
                      </span>
                      <span className="flex gap-1">
                        <button
                          type="button"
                          className={btn}
                          onClick={() => restoreVersion(v.id)}
                        >
                          Restore
                        </button>
                        <button
                          type="button"
                          className={`${btn} text-red-600 dark:text-red-400`}
                          onClick={() =>
                            dispatch({ type: 'DELETE_VERSION', id: v.id })
                          }
                        >
                          Delete
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              🔒 Saved versions are a Premium feature. Upgrade to snapshot and
              restore multiple versions of each CV.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
