/**
 * Lemon Squeezy license verification — the REAL mechanism, no simulation.
 *
 * The app calls Lemon Squeezy's public license API directly from the
 * browser (it is CORS-enabled and requires no secret key):
 *
 *   activate    POST /v1/licenses/activate    { license_key, instance_name }
 *   validate    POST /v1/licenses/validate    { license_key, instance_id? }
 *   deactivate  POST /v1/licenses/deactivate  { license_key, instance_id }
 *
 * Flow:
 *   1. Customer buys Premium at the Lemon Squeezy checkout and receives a
 *      license key by email.
 *   2. The app calls `activate`, which creates a device "instance" and
 *      returns its id. We persist { key, instanceId } locally.
 *   3. On load we `validate` the stored key+instance; only a live,
 *      non-expired, non-disabled key yields Premium.
 *   4. The customer can `deactivate` to release the device binding.
 *
 * Honesty note: verification of the license is real, but enforcement of
 * the resulting plan runs in the browser, so a determined user could patch
 * local state. That is inherent to any fully client-side app and is not
 * claimed otherwise.
 */

import { LICENSE_API_BASE } from '../config/monetization';

/** A locally persisted, device-bound license activation. */
export interface LicenseActivation {
  /** The customer's Lemon Squeezy license key. */
  licenseKey: string;
  /** The device instance id returned by /activate. */
  instanceId: string;
  /** ISO timestamp of when it was activated. */
  activatedAt: string;
  /** Customer email as returned by Lemon Squeezy (for display only). */
  customerEmail: string | null;
}

/** Machine-readable reason a license is not usable. */
export type LicenseErrorCode =
  | 'invalid' // key not found / malformed
  | 'expired'
  | 'revoked' // refunded / chargeback / cancelled
  | 'disabled'
  | 'activation_limit' // no device seats left
  | 'network' // could not reach Lemon Squeezy
  | 'unknown';

export class LicenseError extends Error {
  readonly code: LicenseErrorCode;
  constructor(code: LicenseErrorCode, message: string) {
    super(message);
    this.name = 'LicenseError';
    this.code = code;
  }
}

/** A stable, human-friendly name for this device instance. */
function instanceName(): string {
  const nav = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const os = /Windows/.test(nav)
    ? 'Windows'
    : /Mac/.test(nav)
      ? 'macOS'
      : /Android/.test(nav)
        ? 'Android'
        : /iPhone|iPad/.test(nav)
          ? 'iOS'
          : /Linux/.test(nav)
            ? 'Linux'
            : 'device';
  return `CVForge (${os})`;
}

interface RawApiResponse {
  activated?: boolean;
  deactivated?: boolean;
  valid?: boolean;
  error?: string | null;
  license_key?: { status?: string; key?: string } | null;
  instance?: { id?: string } | null;
  meta?: { customer_email?: string } | null;
}

async function post(
  path: 'activate' | 'validate' | 'deactivate',
  body: Record<string, string>,
): Promise<RawApiResponse> {
  let res: Response;
  try {
    res = await fetch(`${LICENSE_API_BASE}/${path}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new LicenseError(
      'network',
      'Could not reach the license server. Check your connection and try again.',
    );
  }

  let data: RawApiResponse = {};
  try {
    data = (await res.json()) as RawApiResponse;
  } catch {
    // Non-JSON body — fall through to status-based handling.
  }

  if (!res.ok) {
    throw classifyError(res.status, data);
  }
  return data;
}

function classifyError(status: number, data: RawApiResponse): LicenseError {
  const msg = (data.error ?? '').toLowerCase();
  const lsStatus = data.license_key?.status?.toLowerCase();

  if (lsStatus === 'expired' || msg.includes('expired')) {
    return new LicenseError('expired', 'This license key has expired.');
  }
  if (lsStatus === 'disabled' || msg.includes('disabled')) {
    return new LicenseError('disabled', 'This license key has been disabled.');
  }
  if (
    msg.includes('limit') ||
    msg.includes('activation') ||
    msg.includes('seat')
  ) {
    return new LicenseError(
      'activation_limit',
      'This license key has reached its device activation limit.',
    );
  }
  // Lemon Squeezy returns 404 "license_key not found." for unknown keys and
  // 400 for invalid input; both mean the key is not usable.
  if (
    status === 400 ||
    status === 404 ||
    msg.includes('not found') ||
    msg.includes('invalid')
  ) {
    return new LicenseError(
      'invalid',
      'That license key was not recognized. Check for typos and try again.',
    );
  }
  if (status === 403 || msg.includes('refund') || msg.includes('revok')) {
    return new LicenseError(
      'revoked',
      'This license is no longer active (refunded or revoked).',
    );
  }
  return new LicenseError(
    'unknown',
    data.error ?? `License check failed (HTTP ${status}).`,
  );
}

/**
 * Activate a license key on this device. Returns the persisted activation
 * record on success; throws a LicenseError otherwise.
 */
export async function activateLicense(
  licenseKey: string,
): Promise<LicenseActivation> {
  const key = licenseKey.trim();
  if (!key) {
    throw new LicenseError('invalid', 'Please enter your license key.');
  }
  const data = await post('activate', {
    license_key: key,
    instance_name: instanceName(),
  });
  const instanceId = data.instance?.id;
  if (data.activated !== true || !instanceId) {
    throw classifyError(200, data);
  }
  return {
    licenseKey: key,
    instanceId,
    activatedAt: new Date().toISOString(),
    customerEmail: data.meta?.customer_email ?? null,
  };
}

/**
 * Validate a stored activation. Returns true only when Lemon Squeezy
 * confirms the key+instance is currently valid. Throws on hard errors so
 * callers can distinguish "invalid" from "couldn't check".
 */
export async function validateLicense(
  activation: LicenseActivation,
): Promise<boolean> {
  const data = await post('validate', {
    license_key: activation.licenseKey,
    instance_id: activation.instanceId,
  });
  return data.valid === true;
}

/** Release this device's activation so the key can be used elsewhere. */
export async function deactivateLicense(
  activation: LicenseActivation,
): Promise<void> {
  const data = await post('deactivate', {
    license_key: activation.licenseKey,
    instance_id: activation.instanceId,
  });
  if (data.deactivated !== true) {
    throw classifyError(200, data);
  }
}
