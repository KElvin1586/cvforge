import {
  DEFAULT_SECTION_ORDER,
  SECTION_LABELS,
  createEmptyCv,
  uid,
  type CvDocument,
  type SectionKey,
} from '../types/cv';

const SECTION_KEYS = Object.keys(SECTION_LABELS) as SectionKey[];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v) => typeof v === 'string') : [];
}

function sanitizeItems<T>(
  value: unknown,
  shape: Record<string, string>,
  booleans: string[] = [],
): T[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(isRecord)
    .map((raw) => {
      const item: Record<string, unknown> = { id: asString(raw.id) || uid() };
      for (const key of Object.keys(shape)) {
        item[key] = asString(raw[key]);
      }
      for (const key of booleans) {
        item[key] = raw[key] === true;
      }
      return item as unknown as T;
    });
}

/**
 * Validates and normalizes arbitrary JSON into a CvDocument.
 * Unknown/missing fields fall back to safe defaults; extra fields are dropped.
 */
export function validateImportedCv(raw: unknown): CvDocument | null {
  if (!isRecord(raw)) return null;
  const data = isRecord(raw.data) ? raw.data : null;
  if (!data || !isRecord(data.personal)) return null;

  const base = createEmptyCv(asString(raw.name, 'Imported CV') || 'Imported CV');
  const now = Date.now();

  const order = asStringArray(raw.sectionOrder).filter((k): k is SectionKey =>
    SECTION_KEYS.includes(k as SectionKey),
  );
  const mergedOrder = [
    ...order,
    ...DEFAULT_SECTION_ORDER.filter((k) => !order.includes(k)),
  ];

  const hidden = asStringArray(raw.hiddenSections).filter(
    (k): k is SectionKey => SECTION_KEYS.includes(k as SectionKey),
  );

  const style = isRecord(raw.style) ? raw.style : {};
  const template = asString(style.template);
  const fontFamily = asString(style.fontFamily);
  const fontSize = asString(style.fontSize);
  const spacing = asString(style.spacing);

  const cl = isRecord(raw.coverLetter) ? raw.coverLetter : {};

  return {
    ...base,
    id: asString(raw.id) || uid(),
    createdAt: typeof raw.createdAt === 'number' ? raw.createdAt : now,
    updatedAt: now,
    sectionOrder: mergedOrder,
    hiddenSections: hidden,
    style: {
      template: ['classic', 'modern', 'elegant', 'ats', 'bold'].includes(template)
        ? (template as CvDocument['style']['template'])
        : 'classic',
      accentColor:
        asString(style.accentColor) || base.style.accentColor,
      fontFamily: ['sans', 'serif'].includes(fontFamily)
        ? (fontFamily as CvDocument['style']['fontFamily'])
        : 'sans',
      fontSize: ['sm', 'md', 'lg'].includes(fontSize)
        ? (fontSize as CvDocument['style']['fontSize'])
        : 'md',
      spacing: ['compact', 'normal', 'relaxed'].includes(spacing)
        ? (spacing as CvDocument['style']['spacing'])
        : 'normal',
    },
    data: {
      personal: {
        fullName: asString(data.personal.fullName),
        jobTitle: asString(data.personal.jobTitle),
        email: asString(data.personal.email),
        phone: asString(data.personal.phone),
        location: asString(data.personal.location),
        website: asString(data.personal.website),
        linkedin: asString(data.personal.linkedin),
        github: asString(data.personal.github),
      },
      summary: asString(data.summary),
      experience: sanitizeItems(
        data.experience,
        { role: '', company: '', location: '', startDate: '', endDate: '', description: '' },
        ['current'],
      ),
      education: sanitizeItems(data.education, {
        degree: '', school: '', location: '', startDate: '', endDate: '', description: '',
      }),
      skills: sanitizeItems(data.skills, { name: '', level: '' }),
      projects: sanitizeItems(data.projects, {
        name: '', link: '', technologies: '', description: '',
      }),
      certifications: sanitizeItems(data.certifications, {
        name: '', issuer: '', date: '',
      }),
      languages: sanitizeItems(data.languages, { name: '', proficiency: '' }),
      references: sanitizeItems(data.references, {
        name: '', title: '', company: '', email: '', phone: '',
      }),
    },
    coverLetter: {
      recipientName: asString(cl.recipientName),
      company: asString(cl.company),
      position: asString(cl.position),
      date: asString(cl.date),
      body: asString(cl.body),
    },
  };
}

export function exportCvToJson(cv: CvDocument): string {
  return JSON.stringify(cv, null, 2);
}

export function downloadJson(filename: string, json: string): void {
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}
