import { describe, expect, it } from 'vitest';
import { analyzeCv, extractKeywords, cvToPlainText } from '../lib/ats';
import { createEmptyCv, createSampleCv } from '../types/cv';

describe('ats analysis', () => {
  it('extracts keywords and drops stop words', () => {
    const keywords = extractKeywords(
      'We need a React engineer with React experience and strong TypeScript skills. The the the and and.',
    );
    expect(keywords).toContain('react');
    expect(keywords).toContain('typescript');
    expect(keywords).not.toContain('the');
    expect(keywords).not.toContain('and');
  });

  it('flags missing basics on an empty CV', () => {
    const report = analyzeCv(createEmptyCv(), '');
    const byId = Object.fromEntries(report.checks.map((c) => [c.id, c]));
    expect(byId['name'].passed).toBe(false);
    expect(byId['email'].passed).toBe(false);
    expect(byId['experience'].passed).toBe(false);
    expect(report.matchPercent).toBeNull();
  });

  it('passes core checks on the sample CV', () => {
    const report = analyzeCv(createSampleCv(), '');
    const byId = Object.fromEntries(report.checks.map((c) => [c.id, c]));
    expect(byId['name'].passed).toBe(true);
    expect(byId['email'].passed).toBe(true);
    expect(byId['phone'].passed).toBe(true);
    expect(byId['experience'].passed).toBe(true);
    expect(byId['skills'].passed).toBe(true);
  });

  it('computes keyword match against a job description', () => {
    const cv = createSampleCv();
    const jd = 'Looking for a React TypeScript engineer with Node.js and Kubernetes experience';
    const report = analyzeCv(cv, jd);
    expect(report.matchPercent).not.toBeNull();
    expect(report.matchedKeywords).toContain('react');
    expect(report.matchedKeywords).toContain('typescript');
    expect(report.missingKeywords).toContain('kubernetes');
    expect(report.matchPercent!).toBeGreaterThan(0);
    expect(report.matchPercent!).toBeLessThan(100);
  });

  it('serializes a CV to plain text containing key facts', () => {
    const text = cvToPlainText(createSampleCv());
    expect(text).toContain('Alex Carter');
    expect(text).toContain('React');
    expect(text).toContain('Northwind Labs');
  });
});
