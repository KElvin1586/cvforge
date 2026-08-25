import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from 'react';
import {
  createSampleCv,
  type CvDocument,
  type CvVersion,
} from '../types/cv';
import type { Plan } from '../lib/entitlements';
import {
  loadActiveCvId,
  loadCvs,
  loadLicense,
  loadPlan,
  loadTheme,
  loadVersions,
  saveActiveCvId,
  saveCvs,
  saveLicense,
  savePlan,
  saveTheme,
  saveVersions,
  type Theme,
} from '../lib/storage';
import {
  activateLicense,
  deactivateLicense,
  validateLicense,
  LicenseError,
  type LicenseActivation,
} from '../lib/license';

export interface AppState {
  plan: Plan;
  theme: Theme;
  cvs: CvDocument[];
  activeCvId: string | null;
  versions: CvVersion[];
  license: LicenseActivation | null;
}

export type AppAction =
  | { type: 'SET_PLAN'; plan: Plan }
  | { type: 'SET_LICENSE'; license: LicenseActivation | null }
  | { type: 'SET_THEME'; theme: Theme }
  | { type: 'ADD_CV'; cv: CvDocument; select?: boolean }
  | { type: 'UPDATE_CV'; cv: CvDocument }
  | { type: 'DELETE_CV'; id: string }
  | { type: 'SELECT_CV'; id: string }
  | { type: 'ADD_VERSION'; version: CvVersion }
  | { type: 'DELETE_VERSION'; id: string };

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_PLAN':
      return { ...state, plan: action.plan };
    case 'SET_LICENSE':
      // The plan is derived from the license: a stored activation means
      // premium, no activation means free.
      return {
        ...state,
        license: action.license,
        plan: action.license ? 'premium' : 'free',
      };
    case 'SET_THEME':
      return { ...state, theme: action.theme };
    case 'ADD_CV':
      return {
        ...state,
        cvs: [...state.cvs, action.cv],
        activeCvId: action.select === false ? state.activeCvId : action.cv.id,
      };
    case 'UPDATE_CV':
      return {
        ...state,
        cvs: state.cvs.map((c) => (c.id === action.cv.id ? action.cv : c)),
      };
    case 'DELETE_CV': {
      const cvs = state.cvs.filter((c) => c.id !== action.id);
      return {
        ...state,
        cvs,
        activeCvId:
          state.activeCvId === action.id
            ? (cvs[0]?.id ?? null)
            : state.activeCvId,
        versions: state.versions.filter((v) => v.cvId !== action.id),
      };
    }
    case 'SELECT_CV':
      return { ...state, activeCvId: action.id };
    case 'ADD_VERSION':
      return { ...state, versions: [...state.versions, action.version] };
    case 'DELETE_VERSION':
      return {
        ...state,
        versions: state.versions.filter((v) => v.id !== action.id),
      };
    default:
      return state;
  }
}

function init(): AppState {
  let cvs = loadCvs();
  let seeded = false;
  try {
    seeded = localStorage.getItem('cvforge:seeded') === '1';
  } catch {
    seeded = true;
  }
  if (cvs.length === 0 && !seeded) {
    cvs = [createSampleCv()];
    try {
      localStorage.setItem('cvforge:seeded', '1');
    } catch {
      /* ignore */
    }
  }
  const activeCvId = loadActiveCvId();
  const license = loadLicense();
  return {
    // The plan is derived from the persisted license activation. A stored
    // activation is treated as premium on load and re-validated against
    // Lemon Squeezy in the background (see AppProvider).
    plan: license ? 'premium' : loadPlan(),
    theme: loadTheme(),
    cvs,
    activeCvId: cvs.some((c) => c.id === activeCvId)
      ? activeCvId
      : (cvs[0]?.id ?? null),
    versions: loadVersions(),
    license,
  };
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  activeCv: CvDocument | null;
  updateActiveCv: (updater: (cv: CvDocument) => CvDocument) => void;
  /** True while a stored license is being re-validated on load. */
  licenseChecking: boolean;
  /**
   * Activate a Lemon Squeezy license key on this device. Throws a
   * LicenseError with a user-facing message on failure; on success Premium
   * is unlocked and persisted.
   */
  activatePremium: (licenseKey: string) => Promise<void>;
  /** Deactivate the current license, releasing this device and reverting to Free. */
  deactivatePremium: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, init);
  const [licenseChecking, setLicenseChecking] = useState(false);

  useEffect(() => {
    saveCvs(state.cvs);
  }, [state.cvs]);
  useEffect(() => {
    saveActiveCvId(state.activeCvId);
  }, [state.activeCvId]);
  useEffect(() => {
    savePlan(state.plan);
  }, [state.plan]);
  useEffect(() => {
    saveVersions(state.versions);
  }, [state.versions]);
  useEffect(() => {
    saveLicense(state.license);
  }, [state.license]);

  useEffect(() => {
    saveTheme(state.theme);
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
  }, [state.theme]);

  // On load, re-validate any stored license against Lemon Squeezy. A key
  // that has been refunded/revoked/disabled since activation will no longer
  // validate, and the plan reverts to Free.
  useEffect(() => {
    const lic = loadLicense();
    if (!lic) return;
    let cancelled = false;
    setLicenseChecking(true);
    validateLicense(lic)
      .then((valid) => {
        if (cancelled) return;
        if (!valid) {
          // Stored activation is no longer valid — drop it.
          dispatch({ type: 'SET_LICENSE', license: null });
        }
      })
      .catch((err) => {
        if (cancelled) return;
        // Network errors keep the existing plan (offline use stays premium);
        // a definitive "invalid/revoked" clears it.
        if (err instanceof LicenseError && err.code !== 'network') {
          dispatch({ type: 'SET_LICENSE', license: null });
        }
      })
      .finally(() => {
        if (!cancelled) setLicenseChecking(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const activatePremium = useCallback(async (licenseKey: string) => {
    const activation = await activateLicense(licenseKey);
    dispatch({ type: 'SET_LICENSE', license: activation });
  }, []);

  const deactivatePremium = useCallback(async () => {
    const lic = loadLicense();
    if (lic) {
      try {
        await deactivateLicense(lic);
      } catch {
        // Best effort — always clear locally even if the server call fails.
      }
    }
    dispatch({ type: 'SET_LICENSE', license: null });
  }, []);

  const activeCv = useMemo(
    () => state.cvs.find((c) => c.id === state.activeCvId) ?? null,
    [state.cvs, state.activeCvId],
  );

  const updateActiveCv = useCallback(
    (updater: (cv: CvDocument) => CvDocument) => {
      if (!activeCv) return;
      dispatch({
        type: 'UPDATE_CV',
        cv: { ...updater(activeCv), updatedAt: Date.now() },
      });
    },
    [activeCv],
  );

  const value = useMemo(
    () => ({
      state,
      dispatch,
      activeCv,
      updateActiveCv,
      licenseChecking,
      activatePremium,
      deactivatePremium,
    }),
    [
      state,
      activeCv,
      updateActiveCv,
      licenseChecking,
      activatePremium,
      deactivatePremium,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
