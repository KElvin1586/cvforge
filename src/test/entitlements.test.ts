import { describe, expect, it } from 'vitest';
import {
  FREE_CV_LIMIT,
  FREE_TEMPLATES,
  canCreateCv,
  canUse,
  canUseTemplate,
} from '../lib/entitlements';

describe('entitlements', () => {
  it('free plan can use core editing features only', () => {
    expect(canUse('free', 'multipleCvs')).toBe(false);
    expect(canUse('free', 'premiumTemplates')).toBe(false);
    expect(canUse('free', 'advancedCustomization')).toBe(false);
    expect(canUse('free', 'coverLetter')).toBe(false);
    expect(canUse('free', 'versions')).toBe(false);
    expect(canUse('free', 'importExport')).toBe(false);
    expect(canUse('free', 'atsTools')).toBe(false);
  });

  it('premium plan unlocks every feature', () => {
    expect(canUse('premium', 'multipleCvs')).toBe(true);
    expect(canUse('premium', 'premiumTemplates')).toBe(true);
    expect(canUse('premium', 'advancedCustomization')).toBe(true);
    expect(canUse('premium', 'coverLetter')).toBe(true);
    expect(canUse('premium', 'versions')).toBe(true);
    expect(canUse('premium', 'importExport')).toBe(true);
    expect(canUse('premium', 'atsTools')).toBe(true);
  });

  it('exposes exactly two free templates', () => {
    expect(FREE_TEMPLATES).toEqual(['classic', 'modern']);
    expect(canUseTemplate('free', 'classic')).toBe(true);
    expect(canUseTemplate('free', 'modern')).toBe(true);
    expect(canUseTemplate('free', 'elegant')).toBe(false);
    expect(canUseTemplate('free', 'ats')).toBe(false);
    expect(canUseTemplate('free', 'bold')).toBe(false);
    expect(canUseTemplate('premium', 'elegant')).toBe(true);
    expect(canUseTemplate('premium', 'ats')).toBe(true);
    expect(canUseTemplate('premium', 'bold')).toBe(true);
  });

  it('limits free users to one CV', () => {
    expect(canCreateCv('free', 0)).toBe(true);
    expect(canCreateCv('free', FREE_CV_LIMIT)).toBe(false);
    expect(canCreateCv('premium', 50)).toBe(true);
  });
});
