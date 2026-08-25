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
 *   VITE_PREMIUM_PRICE      e.g. "1299"
 *   VITE_PREMIUM_CURRENCY   e.g. "KES"
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
   * Approximate USD equivalent shown alongside the local price for
   * international visitors (e.g. "Ksh 1,299 (≈ $10)"). Set to 0 to hide.
   */
  usdEquivalent: number;
  /**
   * Real external checkout URL. Defaults to the Lemon Squeezy checkout;
   * may be overridden at build time with VITE_UPGRADE_URL.
   */
  upgradeUrl: string;
  /** True when the development/test premium mode is available. */
  testMode: boolean;
}

export const MONETIZATION: MonetizationConfig = {
  // Matches the actual Lemon Squeezy product: KSh 1,299 one-time.
  premiumPrice: envNumber(import.meta.env?.VITE_PREMIUM_PRICE, 1299),
  premiumCurrency: import.meta.env?.VITE_PREMIUM_CURRENCY || 'KES',
  // Approximate USD equivalent for international visitors (~$10 at the time
  // of writing). Adjust with VITE_PREMIUM_USD_EQUIVALENT if rates move.
  usdEquivalent: envNumber(import.meta.env?.VITE_PREMIUM_USD_EQUIVALENT, 10),
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
  // Kenyan customers read "Ksh 1,299"; the en-KE locale gives that form.
  const locale = config.premiumCurrency === 'KES' ? 'en-KE' : 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: config.premiumCurrency,
    // Drop trailing ".00" for whole-number prices like KSh 1,299.
    maximumFractionDigits: Number.isInteger(config.premiumPrice) ? 0 : 2,
  }).format(config.premiumPrice);
}

/**
 * Approximate USD equivalent for international visitors, e.g. "≈ $10".
 * Empty string when disabled (usdEquivalent <= 0) or when the product is
 * already priced in USD.
 */
export function formatPremiumPriceUsd(
  config: MonetizationConfig = MONETIZATION,
): string {
  if (config.usdEquivalent <= 0 || config.premiumCurrency === 'USD') {
    return '';
  }
  const usd = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: Number.isInteger(config.usdEquivalent) ? 0 : 2,
  }).format(config.usdEquivalent);
  return `≈ ${usd}`;
}

/**
 * Full display price with the USD equivalent, e.g. "Ksh 1,299 (≈ $10)".
 */
export function formatPremiumPriceFull(
  config: MonetizationConfig = MONETIZATION,
): string {
  const base = formatPremiumPrice(config);
  const usd = formatPremiumPriceUsd(config);
  return usd ? `${base} (${usd})` : base;
}

