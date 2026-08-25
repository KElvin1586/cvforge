import { describe, expect, it } from 'vitest';
import {
  LEMONSQUEEZY_CHECKOUT_URL,
  MONETIZATION,
  TEST_CHECKOUT_ROUTE,
  formatPremiumPrice,
  resolveUpgradeHref,
} from '../config/monetization';
import { parseRoute } from '../lib/router';

describe('monetization configuration', () => {
  it('has a positive price and ISO currency', () => {
    expect(MONETIZATION.premiumPrice).toBeGreaterThan(0);
    expect(MONETIZATION.premiumCurrency).toMatch(/^[A-Z]{3}$/);
  });

  it('points at the real Lemon Squeezy checkout by default', () => {
    // Production must ship with a real checkout URL, not a placeholder.
    expect(MONETIZATION.upgradeUrl).toBe(LEMONSQUEEZY_CHECKOUT_URL);
    expect(MONETIZATION.upgradeUrl).toMatch(
      /^https:\/\/[a-z0-9-]+\.lemonsqueezy\.com\/checkout\/buy\//,
    );
  });

  it('never uses a placeholder documentation domain for checkout', () => {
    expect(MONETIZATION.upgradeUrl).not.toMatch(/example\.(com|org|net)/);
    const href = resolveUpgradeHref();
    if (href) expect(href).not.toMatch(/example\.(com|org|net)/);
  });

  it('formats the premium price', () => {
    // Default product price is KSh 1,299 (matches the Lemon Squeezy product).
    expect(formatPremiumPrice()).toContain('1,299');
    expect(formatPremiumPrice()).toMatch(/ksh/i);
  });

  it('prefers the configured checkout URL over the test page', () => {
    expect(
      resolveUpgradeHref({
        premiumPrice: 9.99,
        premiumCurrency: 'USD',
        upgradeUrl: 'https://checkout.provider.com/abc',
        testMode: true,
      }),
    ).toBe('https://checkout.provider.com/abc');
  });

  it('falls back to the internal test checkout in test mode', () => {
    expect(
      resolveUpgradeHref({
        premiumPrice: 9.99,
        premiumCurrency: 'USD',
        upgradeUrl: '',
        testMode: true,
      }),
    ).toBe(TEST_CHECKOUT_ROUTE);
  });

  it('returns null in production without a configured checkout URL', () => {
    expect(
      resolveUpgradeHref({
        premiumPrice: 9.99,
        premiumCurrency: 'USD',
        upgradeUrl: '',
        testMode: false,
      }),
    ).toBeNull();
  });
});

describe('hash router', () => {
  it('routes the app, checkout, activate, and landing hashes', () => {
    expect(parseRoute('#/app')).toBe('app');
    expect(parseRoute('#/checkout')).toBe('checkout');
    expect(parseRoute('#/activate')).toBe('activate');
    expect(parseRoute('#/')).toBe('landing');
    expect(parseRoute('')).toBe('landing');
    expect(parseRoute('#/pricing')).toBe('landing');
    expect(parseRoute('#/unknown')).toBe('landing');
  });
});
