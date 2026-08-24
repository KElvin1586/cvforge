import type { CvDocument } from '../types/cv';

const STOP_WORDS = new Set(
  (
    'a an the and or but of to in for on with at by from as is are was were be been being ' +
    'this that these those it its you your we our they their he she his her i me my him ' +
    'will would can could should may might must shall do does did have has had not no ' +
    'if then than so such more most other some any each about into over after before ' +
    'between through during under again further once here there when where why how all both ' +
    'few own same too very just also new years experience work working team including ability ' +
    'strong skills skill knowledge plus etc within across using use used'
  ).split(' '),
);

export function extractKeywords(text: string, limit = 30): string[] {
  const counts = new Map<string, number>();
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\-\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w) && !/^\d+$/.test(w));
  for (const w of words) {
    counts.set(w, (counts.get(w) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
}

export function cvToPlainText(cv: CvDocument): string {
  const d = cv.data;
  const parts: string[] = [
    d.personal.fullName,
    d.personal.jobTitle,
    d.personal.email,
    d.personal.phone,
    d.personal.location,
    d.summary,
  ];
  for (const e of d.experience) {
    parts.push(e.role, e.company, e.description);
  }
  for (const e of d.education) {
    parts.push(e.degree, e.school, e.description);
  }
  parts.push(...d.skills.map((s) => s.name));
  for (const p of d.projects) {
    parts.push(p.name, p.technologies, p.description);
  }
  for (const c of d.certifications) {
    parts.push(c.name, c.issuer);
  }
  parts.push(...d.languages.map((l) => l.name));
  return parts.filter(Boolean).join('\n');
}

export interface AtsCheck {
  id: string;
  label: string;
  passed: boolean;
  hint?: string;
}

export interface AtsReport {
  checks: AtsCheck[];
  matchedKeywords: string[];
  missingKeywords: string[];
  matchPercent: number | null;
  wordCount: number;
}

export function analyzeCv(cv: CvDocument, jobDescription: string): AtsReport {
  const d = cv.data;
  const text = cvToPlainText(cv);
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  const checks: AtsCheck[] = [
    {
      id: 'name',
      label: 'Full name is present',
      passed: d.personal.fullName.trim().length > 1,
      hint: 'Add your full name in Personal Information.',
    },
    {
      id: 'email',
      label: 'Email address is present and looks valid',
      passed: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.personal.email.trim()),
      hint: 'ATS systems need a valid email to contact you.',
    },
    {
      id: 'phone',
      label: 'Phone number is present',
      passed: d.personal.phone.trim().length >= 7,
      hint: 'Add a phone number in Personal Information.',
    },
    {
      id: 'summary',
      label: 'Professional summary exists (40+ characters)',
      passed: d.summary.trim().length >= 40,
      hint: 'Write a 2–3 sentence summary with your target role and strengths.',
    },
    {
      id: 'experience',
      label: 'At least one work experience entry',
      passed: d.experience.length > 0,
      hint: 'Add relevant work experience with achievements.',
    },
    {
      id: 'experience-dates',
      label: 'All experience entries have start dates',
      passed:
        d.experience.length > 0 &&
        d.experience.every((e) => e.startDate.trim().length > 0),
      hint: 'ATS parsers expect dates on every role.',
    },
    {
      id: 'skills',
      label: 'At least 5 skills listed',
      passed: d.skills.length >= 5,
      hint: 'List concrete, job-relevant skills — these are prime keywords.',
    },
    {
      id: 'education',
      label: 'Education section filled in',
      passed: d.education.length > 0,
      hint: 'Add your highest qualification.',
    },
    {
      id: 'length',
      label: 'Length is reasonable (150–1200 words)',
      passed: wordCount >= 150 && wordCount <= 1200,
      hint:
        wordCount < 150
          ? 'Your CV looks thin — add detail to experience and projects.'
          : 'Your CV is long — trim to the most relevant content.',
    },
  ];

  let matchedKeywords: string[] = [];
  let missingKeywords: string[] = [];
  let matchPercent: number | null = null;

  const jd = jobDescription.trim();
  if (jd.length > 0) {
    const keywords = extractKeywords(jd);
    const cvWords = new Set(
      text
        .toLowerCase()
        .replace(/[^a-z0-9+#.\-\s]/g, ' ')
        .split(/\s+/)
        .filter(Boolean),
    );
    matchedKeywords = keywords.filter((k) => cvWords.has(k));
    missingKeywords = keywords.filter((k) => !cvWords.has(k));
    matchPercent =
      keywords.length === 0
        ? null
        : Math.round((matchedKeywords.length / keywords.length) * 100);
  }

  return { checks, matchedKeywords, missingKeywords, matchPercent, wordCount };
}
