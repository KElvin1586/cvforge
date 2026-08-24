import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { canUse, FEATURES, type Feature } from '../lib/entitlements';
import { useApp } from './AppContext';
import { UpgradeModal } from '../components/UpgradeModal';

interface UpgradeContextValue {
  /**
   * Gate a premium feature. Returns true when the current plan allows it;
   * otherwise opens the upgrade modal and returns false.
   */
  requireFeature: (feature: Feature) => boolean;
  isPremium: boolean;
  openUpgrade: (feature?: Feature) => void;
}

const UpgradeContext = createContext<UpgradeContextValue | null>(null);

export function UpgradeProvider({ children }: { children: ReactNode }) {
  const { state } = useApp();
  const [modalFeature, setModalFeature] = useState<Feature | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const isPremium = state.plan === 'premium';

  const openUpgrade = useCallback((feature?: Feature) => {
    setModalFeature(feature ?? null);
    setModalOpen(true);
  }, []);

  const requireFeature = useCallback(
    (feature: Feature): boolean => {
      if (canUse(state.plan, feature)) return true;
      openUpgrade(feature);
      return false;
    },
    [state.plan, openUpgrade],
  );

  const value = useMemo(
    () => ({ requireFeature, isPremium, openUpgrade }),
    [requireFeature, isPremium, openUpgrade],
  );

  return (
    <UpgradeContext.Provider value={value}>
      {children}
      <UpgradeModal
        open={modalOpen}
        feature={modalFeature ? FEATURES[modalFeature] : null}
        onClose={() => setModalOpen(false)}
      />
    </UpgradeContext.Provider>
  );
}

export function useUpgrade(): UpgradeContextValue {
  const ctx = useContext(UpgradeContext);
  if (!ctx) throw new Error('useUpgrade must be used inside UpgradeProvider');
  return ctx;
}
