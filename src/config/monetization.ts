/**
 * Central monetization configuration — the single source of truth for
 * pricing and the upgrade/checkout URL.
 *
 * There are intentionally NO payment flows, license keys, or activation
 * codes in this codebase. To connect a real payment provider, set the
 * environment variables below at build time — no code changes required:
 *
 *   VITE_PREMIUM_PRICE      e.g. "9.99"
 *   VITE_PREMIUM_CURRENCY   e.g. "USD"
 *   VITE_UPGRADE_URL        e.g. "https://checkout.stripe.com/c/pay_..."
 *
 * Development/test mode:
 *   When test mode is enabled, the upgrade flow routes to the app's internal
 *   test checkout page (#/checkout), which flips the local entitlement flag
 *   without any payment. Test mode is enabled in `vite dev` automatically,
 *   or in a built bundle via VITE_ENABLE_TEST_MODE=true. It MUST NOT be
 *   enabled in production builds.
 */

function envNumber(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return value !== undefined && Number.isFinite(parsed) && parsed > 0
    ? parsed
    : fallback;
}

export interface MonetizationConfig {
  /** One-time premium price. */
  premiumPrice: number;
  /** ISO 4217 currency code used for price formatting. */
  premiumCurrency: string;
  /**
   * External checkout URL (Stripe Payment Link, Lemon Squeezy, Paddle, …).
   * Empty when not configured — in that case the upgrade flow can only use
   * the internal test checkout (test mode) or reports itself as unconfigured.
   */
  upgradeUrl: string;
  /** True when the development/test premium mode is available. */
  testMode: boolean;
}

export const MONETIZATION: MonetizationConfig = {
  premiumPrice: envNumber(import.meta.env?.VITE_PREMIUM_PRICE, 9.99),
  premiumCurrency: import.meta.env?.VITE_PREMIUM_CURRENCY || 'USD',
  upgradeUrl: import.meta.env?.VITE_UPGRADE_URL || '',
  testMode:
    import.meta.env?.DEV === true ||
    import.meta.env?.VITE_ENABLE_TEST_MODE === 'true',
};

/** Internal route used by the development/test checkout page. */
export const TEST_CHECKOUT_ROUTE = '#/checkout';

/**
 * Resolves where the upgrade flow should send the user:
 * - a configured external checkout URL, or
 * - the internal test checkout page in test mode, or
 * - null when checkout is not available (misconfigured production build).
 */
export function resolveUpgradeHref(
  config: MonetizationConfig = MONETIZATION,
): string | null {
  if (config.upgradeUrl) return config.upgradeUrl;
  if (config.testMode) return TEST_CHECKOUT_ROUTE;
  return null;
}

export function formatPremiumPrice(
  config: MonetizationConfig = MONETIZATION,
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: config.premiumCurrency,
  }).format(config.premiumPrice);
}
