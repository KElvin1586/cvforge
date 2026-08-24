/**
 * Central monetization configuration.
 *
 * There are intentionally NO payment flows, license keys, or activation
 * codes in this file. When you are ready to sell Premium, point
 * `upgradeUrl` at your real checkout (Stripe Payment Link, Lemon Squeezy,
 * Paddle, etc.). After a successful purchase, set the user's plan to
 * "premium" in browser storage (key: cvforge:plan).
 */
export const MONETIZATION = {
  /** One-time price shown on the upgrade modal. */
  premiumPrice: 9.99,
  currency: 'USD',
  /** Where the "Upgrade" button sends the user. Replace with your checkout URL. */
  upgradeUrl: 'https://example.com/cvforge/upgrade',
  /**
   * Development/demo switch. When true, the upgrade modal shows an extra
   * "Activate Premium (demo)" button that flips the plan locally so premium
   * features can be evaluated without a checkout. Must stay false in
   * production builds. Can also be enabled with VITE_DEV_UNLOCK_PREMIUM=true.
   */
  devUnlockPremium:
    import.meta.env?.VITE_DEV_UNLOCK_PREMIUM === 'true' || false,
} as const;

export function formatPremiumPrice(): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: MONETIZATION.currency,
  }).format(MONETIZATION.premiumPrice);
}
