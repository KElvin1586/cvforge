import type { ReactNode } from 'react';
import type { Feature } from '../lib/entitlements';
import { useUpgrade } from '../state/UpgradeContext';

interface PremiumButtonProps {
  feature: Feature;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
}

/**
 * Button that executes `onClick` only when the plan entitles the feature;
 * otherwise opens the upgrade modal.
 */
export function PremiumButton({
  feature,
  children,
  className = '',
  onClick,
  disabled,
  title,
}: PremiumButtonProps) {
  const { requireFeature, isPremium } = useUpgrade();
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={() => {
        if (requireFeature(feature)) onClick?.();
      }}
      className={className}
    >
      {children}
      {!isPremium && (
        <span aria-hidden="true" className="ml-1">
          🔒
        </span>
      )}
      {!isPremium && <span className="sr-only"> (premium feature)</span>}
    </button>
  );
}

export function PremiumBadge() {
  return (
    <span className="ml-1 rounded bg-amber-100 px-1 py-0.5 text-[10px] font-semibold uppercase text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
      🔒 Premium
    </span>
  );
}
