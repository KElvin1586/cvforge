import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  activateLicense,
  deactivateLicense,
  validateLicense,
  LicenseError,
  type LicenseActivation,
} from '../lib/license';

/**
 * These tests exercise the real activate/validate/deactivate logic in
 * license.ts. Only the transport (fetch) is stubbed so we can simulate
 * Lemon Squeezy's documented response shapes without a network or a real
 * key. The classification, error mapping, and data handling under test are
 * the genuine production code paths.
 */

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

const VALID_KEY = 'AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE';
const INSTANCE_ID = 'inst_123';

describe('license verification (Lemon Squeezy)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('activates a valid key and returns a device-bound activation', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse(200, {
        activated: true,
        license_key: { status: 'active', key: VALID_KEY },
        instance: { id: INSTANCE_ID },
        meta: { customer_email: 'buyer@example.org' },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const activation = await activateLicense(VALID_KEY);

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/v1/licenses/activate');
    expect(JSON.parse(String(init?.body))).toMatchObject({
      license_key: VALID_KEY,
    });
    expect(activation.licenseKey).toBe(VALID_KEY);
    expect(activation.instanceId).toBe(INSTANCE_ID);
    expect(activation.customerEmail).toBe('buyer@example.org');
  });

  it('rejects an empty key without a network call', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    await expect(activateLicense('   ')).rejects.toMatchObject({
      code: 'invalid',
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('maps an unknown key to an "invalid" error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse(404, { valid: false, error: 'license_key not found.' }),
      ),
    );
    await expect(activateLicense('nope')).rejects.toMatchObject({
      code: 'invalid',
    });
  });

  it('maps an expired key to an "expired" error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse(400, {
          activated: false,
          error: 'license_key expired',
          license_key: { status: 'expired' },
        }),
      ),
    );
    await expect(activateLicense(VALID_KEY)).rejects.toMatchObject({
      code: 'expired',
    });
  });

  it('maps an over-limit key to an "activation_limit" error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse(400, {
          activated: false,
          error: 'license_key has reached the activation limit.',
        }),
      ),
    );
    await expect(activateLicense(VALID_KEY)).rejects.toMatchObject({
      code: 'activation_limit',
    });
  });

  it('treats a successful activate response without an instance id as an error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse(200, { activated: true, license_key: { status: 'active' } }),
      ),
    );
    await expect(activateLicense(VALID_KEY)).rejects.toBeInstanceOf(
      LicenseError,
    );
  });

  it('validates a stored activation as genuine', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(jsonResponse(200, { valid: true }));
    vi.stubGlobal('fetch', fetchMock);
    const activation: LicenseActivation = {
      licenseKey: VALID_KEY,
      instanceId: INSTANCE_ID,
      activatedAt: new Date().toISOString(),
      customerEmail: null,
    };
    await expect(validateLicense(activation)).resolves.toBe(true);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/v1/licenses/validate');
    expect(JSON.parse(String(init?.body))).toMatchObject({
      license_key: VALID_KEY,
      instance_id: INSTANCE_ID,
    });
  });

  it('reports an invalid/revoked stored activation as not valid', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(jsonResponse(200, { valid: false })),
    );
    const activation: LicenseActivation = {
      licenseKey: VALID_KEY,
      instanceId: INSTANCE_ID,
      activatedAt: new Date().toISOString(),
      customerEmail: null,
    };
    await expect(validateLicense(activation)).resolves.toBe(false);
  });

  it('deactivates a device binding', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(jsonResponse(200, { deactivated: true })),
    );
    const activation: LicenseActivation = {
      licenseKey: VALID_KEY,
      instanceId: INSTANCE_ID,
      activatedAt: new Date().toISOString(),
      customerEmail: null,
    };
    await expect(deactivateLicense(activation)).resolves.toBeUndefined();
  });

  it('throws a network error when the license server is unreachable', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new TypeError('Failed to fetch')),
    );
    await expect(activateLicense(VALID_KEY)).rejects.toMatchObject({
      code: 'network',
    });
  });
});
