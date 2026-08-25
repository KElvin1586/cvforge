import { beforeEach, describe, expect, it } from 'vitest';
import { loadLicense, saveLicense } from '../lib/storage';

/**
 * Reload/persistence behavior: a stored device-bound activation survives a
 * reload (read back by AppContext init → Premium persists), a fresh visitor
 * has none (Free), and a malformed/tampered record is rejected.
 */
describe('license persistence across reload', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('round-trips a stored activation', () => {
    const lic = {
      licenseKey: 'K',
      instanceId: 'inst_1',
      activatedAt: new Date().toISOString(),
      customerEmail: 'buyer@x.dev',
    };
    saveLicense(lic);
    expect(loadLicense()).toEqual(lic);
  });

  it('returns null when nothing is stored (fresh visitor = Free)', () => {
    expect(loadLicense()).toBeNull();
  });

  it('rejects a malformed/tampered record missing the instance id', () => {
    localStorage.setItem('cvforge:license', JSON.stringify({ licenseKey: 'K' }));
    expect(loadLicense()).toBeNull();
  });

  it('clears to Free when the stored activation is removed', () => {
    saveLicense({
      licenseKey: 'K',
      instanceId: 'inst_1',
      activatedAt: new Date().toISOString(),
      customerEmail: null,
    });
    expect(loadLicense()).not.toBeNull();
    saveLicense(null);
    expect(loadLicense()).toBeNull();
  });
});
