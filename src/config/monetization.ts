/**
 * Central monetization configuration — the single source of truth for
 * pricing, the real checkout URL, and the license-verification endpoint.
 *
 * CVForge sells a one-time Premium license through Lemon Squeezy. The
 * customer pays at the hosted checkout below, receives a license key by
 * email, and enters it in the app's Premium activation screen. The app
 * then verifies that key against Lemon Squeezy's real license API:
 *
 *   POST /v1/licenses/activate    — bind the key to this device (instance)
 *   POST /v1/licenses/validate    — confirm the key/instance is still valid
 *   POST /v1/licenses/deactivate  — release the device binding
 *
 * These license endpoints require NO secret API key (they are public by
 * design) and Lemon Squeezy serves them with permissive CORS, so the app
 * calls them directly from the browser. No Lemon Squeezy API keys,
 * webhook secrets, or any private credential ever belong in this file or
 * in any VITE_* variable — those would be publicly visible in the bundle.
 *
 * Build-time overrides (optional):
 *   VITE_PREMIUM_PRICE      e.g. "9.99"
 *   VITE_PREMIUM_CURRENCY   e.g. "USD"
 *   VITE_UPGRADE_URL        override the checkout URL (defaults to the
 *                           real Lemon Squeezy checkout below)
 *
 * Development/test mode:
 *   The internal test checkout (#/checkout) flips a local entitlement flag
 *   with no payment and no license. It is enabled in `vite dev`, or in a
 *   built bundle via VITE_ENABLE_TEST_MODE=true. It MUST NOT be enabled in
 *   production builds.
 */

function envNumber(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return value !== undefined && Number.isFinite(parsed) && parsed > 0
    ? parsed
    : fallback;
}

/** The real Lemon Squeezy hosted checkout for CVForge Premium. */
export const LEMONSQUEEZY_CHECKOUT_URL =
  'https://kelvindigitaltools.lemonsqueezy.com/checkout/buy/5a9a0680-dbb4-4c1b-b38c-02c8bbd20fe1';

/** Lemon Squeezy license API (public, CORS-enabled, no secret required). */
export const LICENSE_API_BASE = 'https://api.lemonsqueezy.com/v1/licenses';

export interface MonetizationConfig {
  /** One-time premium price. */
  premiumPrice: number;
  /** ISO 4217 currency code used for price formatting. */
  premiumCurrency: string;
  /**
   * Real external checkout URL. Defaults to the Lemon Squeezy checkout;
   * may be overridden at build time with VITE_UPGRADE_URL.
   */
  upgradeUrl: string;
  /** True when the development/test premium mode is available. */
  testMode: boolean;
}

export const MONETIZATION: MonetizationConfig = {
  premiumPrice: envNumber(import.meta.env?.VITE_PREMIUM_PRICE, 9.99),
  premiumCurrency: import.meta.env?.VITE_PREMIUM_CURRENCY || 'USD',
  upgradeUrl: import.meta.env?.VITE_UPGRADE_URL || LEMONSQUEEZY_CHECKOUT_URL,
  testMode:
    import.meta.env?.DEV === true ||
    import.meta.env?.VITE_ENABLE_TEST_MODE === 'true',
};

/** Internal route used by the development/test checkout page. */
export const TEST_CHECKOUT_ROUTE = '#/checkout';

/** Internal route for the Premium license activation screen. */
export const ACTIVATE_ROUTE = '#/activate';

/**
 * Resolves where the upgrade flow should send the user to BUY:
 * - the configured external checkout URL, or
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

