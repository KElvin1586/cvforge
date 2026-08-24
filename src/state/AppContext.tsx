import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
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
  loadPlan,
  loadTheme,
  loadVersions,
  saveActiveCvId,
  saveCvs,
  savePlan,
  saveTheme,
  saveVersions,
  type Theme,
} from '../lib/storage';

export interface AppState {
  plan: Plan;
  theme: Theme;
  cvs: CvDocument[];
  activeCvId: string | null;
  versions: CvVersion[];
}

export type AppAction =
  | { type: 'SET_PLAN'; plan: Plan }
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
  return {
    plan: loadPlan(),
    theme: loadTheme(),
    cvs,
    activeCvId: cvs.some((c) => c.id === activeCvId)
      ? activeCvId
      : (cvs[0]?.id ?? null),
    versions: loadVersions(),
  };
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  activeCv: CvDocument | null;
  updateActiveCv: (updater: (cv: CvDocument) => CvDocument) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, init);

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
    saveTheme(state.theme);
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
  }, [state.theme]);

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
    () => ({ state, dispatch, activeCv, updateActiveCv }),
    [state, activeCv, updateActiveCv],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
