import type { CvDocument, CvVersion } from '../types/cv';
import type { Plan } from './entitlements';
import type { LicenseActivation } from './license';

const KEYS = {
  cvs: 'cvforge:cvs',
  activeCvId: 'cvforge:activeCvId',
  plan: 'cvforge:plan',
  theme: 'cvforge:theme',
  versions: 'cvforge:versions',
  license: 'cvforge:license',
} as const;

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable (private mode) — the app keeps working
    // in memory; persistence is best-effort by design.
  }
}

export function loadCvs(): CvDocument[] {
  const cvs = readJson<CvDocument[]>(KEYS.cvs, []);
  return Array.isArray(cvs) ? cvs : [];
}

export function saveCvs(cvs: CvDocument[]): void {
  writeJson(KEYS.cvs, cvs);
}

export function loadActiveCvId(): string | null {
  return readJson<string | null>(KEYS.activeCvId, null);
}

export function saveActiveCvId(id: string | null): void {
  writeJson(KEYS.activeCvId, id);
}

export function loadPlan(): Plan {
  const plan = readJson<string>(KEYS.plan, 'free');
  return plan === 'premium' ? 'premium' : 'free';
}

export function savePlan(plan: Plan): void {
  writeJson(KEYS.plan, plan);
}

export type Theme = 'light' | 'dark';

export function loadTheme(): Theme {
  const stored = readJson<string | null>(KEYS.theme, null);
  if (stored === 'light' || stored === 'dark') return stored;
  if (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-color-scheme: dark)').matches
  ) {
    return 'dark';
  }
  return 'light';
}

export function saveTheme(theme: Theme): void {
  writeJson(KEYS.theme, theme);
}

export function loadVersions(): CvVersion[] {
  const versions = readJson<CvVersion[]>(KEYS.versions, []);
  return Array.isArray(versions) ? versions : [];
}

export function saveVersions(versions: CvVersion[]): void {
  writeJson(KEYS.versions, versions);
}

/** Persisted device-bound license activation (null when not activated). */
export function loadLicense(): LicenseActivation | null {
  const lic = readJson<LicenseActivation | null>(KEYS.license, null);
  if (
    lic &&
    typeof lic.licenseKey === 'string' &&
    typeof lic.instanceId === 'string'
  ) {
    return lic;
  }
  return null;
}

export function saveLicense(license: LicenseActivation | null): void {
  writeJson(KEYS.license, license);
}

export function clearAll(): void {
  Object.values(KEYS).forEach((key) => {
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  });
}
