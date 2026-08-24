import { beforeEach, describe, expect, it } from 'vitest';
import {
  createEmptyCv,
  createSampleCv,
  DEFAULT_SECTION_ORDER,
} from '../types/cv';
import { exportCvToJson, validateImportedCv } from '../lib/importExport';
import { loadCvs, saveCvs, loadPlan, savePlan } from '../lib/storage';

describe('cv model', () => {
  it('creates a valid empty CV with all sections in default order', () => {
    const cv = createEmptyCv('Test');
    expect(cv.id).toBeTruthy();
    expect(cv.sectionOrder).toEqual(DEFAULT_SECTION_ORDER);
    expect(cv.hiddenSections).toEqual([]);
    expect(cv.style.template).toBe('classic');
    expect(cv.data.experience).toEqual([]);
  });

  it('creates a sample CV with populated content', () => {
    const cv = createSampleCv();
    expect(cv.data.personal.fullName).toBeTruthy();
    expect(cv.data.experience.length).toBeGreaterThan(0);
    expect(cv.data.skills.length).toBeGreaterThan(0);
  });
});

describe('import/export', () => {
  it('round-trips a CV through JSON export and validation', () => {
    const cv = createSampleCv();
    const json = exportCvToJson(cv);
    const restored = validateImportedCv(JSON.parse(json));
    expect(restored).not.toBeNull();
    expect(restored!.data.personal.fullName).toBe(cv.data.personal.fullName);
    expect(restored!.data.experience).toHaveLength(cv.data.experience.length);
    expect(restored!.sectionOrder).toEqual(cv.sectionOrder);
  });

  it('rejects invalid data', () => {
    expect(validateImportedCv(null)).toBeNull();
    expect(validateImportedCv('nope')).toBeNull();
    expect(validateImportedCv({ foo: 'bar' })).toBeNull();
    expect(validateImportedCv({ data: {} })).toBeNull();
  });

  it('sanitizes partial data and preserves missing sections', () => {
    const cv = validateImportedCv({
      name: 'Partial',
      data: { personal: { fullName: 'Sam' }, skills: [{ name: 'Go' }] },
      sectionOrder: ['skills'],
    });
    expect(cv).not.toBeNull();
    expect(cv!.data.personal.fullName).toBe('Sam');
    expect(cv!.data.skills).toHaveLength(1);
    expect(cv!.data.skills[0].id).toBeTruthy();
    expect(cv!.sectionOrder[0]).toBe('skills');
    expect(cv!.sectionOrder).toHaveLength(DEFAULT_SECTION_ORDER.length);
  });
});

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('persists and reloads CVs', () => {
    const cv = createEmptyCv('Stored');
    saveCvs([cv]);
    const loaded = loadCvs();
    expect(loaded).toHaveLength(1);
    expect(loaded[0].name).toBe('Stored');
  });

  it('persists the plan', () => {
    expect(loadPlan()).toBe('free');
    savePlan('premium');
    expect(loadPlan()).toBe('premium');
    savePlan('free');
    expect(loadPlan()).toBe('free');
  });

  it('returns safe defaults for corrupted storage', () => {
    localStorage.setItem('cvforge:cvs', '{not json');
    expect(loadCvs()).toEqual([]);
  });
});
