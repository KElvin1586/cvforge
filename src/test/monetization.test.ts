import { describe, expect, it } from 'vitest';
import {
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

  it('never uses a placeholder documentation domain for checkout', () => {
    expect(MONETIZATION.upgradeUrl).not.toMatch(/example\.(com|org|net)/);
    const href = resolveUpgradeHref();
    if (href) expect(href).not.toMatch(/example\.(com|org|net)/);
  });

  it('formats the premium price', () => {
    expect(formatPremiumPrice()).toContain('9.99');
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
  it('routes the app, checkout, and landing hashes', () => {
    expect(parseRoute('#/app')).toBe('app');
    expect(parseRoute('#/checkout')).toBe('checkout');
    expect(parseRoute('#/')).toBe('landing');
    expect(parseRoute('')).toBe('landing');
    expect(parseRoute('#/pricing')).toBe('landing');
    expect(parseRoute('#/unknown')).toBe('landing');
  });
});
