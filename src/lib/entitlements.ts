import type { TemplateId } from '../types/cv';

export type Plan = 'free' | 'premium';

/**
 * Central feature-entitlement matrix. Every premium-only capability in the
 * UI must be checked through `canUse` / the helpers below so gating stays
 * consistent and auditable.
 */
export type Feature =
  | 'multipleCvs'
  | 'premiumTemplates'
  | 'advancedCustomization'
  | 'advancedLayouts'
  | 'coverLetter'
  | 'versions'
  | 'importExport'
  | 'atsTools';

export interface FeatureInfo {
  label: string;
  description: string;
  plans: Plan[];
}

export const FEATURES: Record<Feature, FeatureInfo> = {
  multipleCvs: {
    label: 'Unlimited CVs',
    description: 'Create and manage as many CVs as you need.',
    plans: ['premium'],
  },
  premiumTemplates: {
    label: 'All premium templates',
    description: 'Unlock Elegant, ATS Pro, and Bold templates.',
    plans: ['premium'],
  },
  advancedCustomization: {
    label: 'Advanced customization',
    description: 'Custom accent colors, typography, and density controls.',
    plans: ['premium'],
  },
  advancedLayouts: {
    label: 'Advanced layouts',
    description: 'Two-column, sidebar, and compact density layouts.',
    plans: ['premium'],
  },
  coverLetter: {
    label: 'Cover-letter builder',
    description: 'Write and print matching cover letters.',
    plans: ['premium'],
  },
  versions: {
    label: 'Saved versions',
    description: 'Keep multiple named snapshots of every CV.',
    plans: ['premium'],
  },
  importExport: {
    label: 'Import / export',
    description: 'Back up and restore CV data as JSON files.',
    plans: ['premium'],
  },
  atsTools: {
    label: 'ATS formatting tools',
    description: 'Keyword matching and ATS-readiness checks.',
    plans: ['premium'],
  },
};

export const FREE_CV_LIMIT = 1;

export const FREE_TEMPLATES: TemplateId[] = ['classic', 'modern'];

export const TEMPLATE_INFO: Record<
  TemplateId,
  { name: string; description: string; premium: boolean }
> = {
  classic: {
    name: 'Classic',
    description: 'Timeless single-column layout with a centered header.',
    premium: false,
  },
  modern: {
    name: 'Modern',
    description: 'Two-column layout with an accent sidebar.',
    premium: false,
  },
  elegant: {
    name: 'Elegant',
    description: 'Refined typography with subtle rules and spacing.',
    premium: true,
  },
  ats: {
    name: 'ATS Pro',
    description: 'Plain, parser-friendly formatting for applicant tracking systems.',
    premium: true,
  },
  bold: {
    name: 'Bold',
    description: 'Statement header band with strong accent color.',
    premium: true,
  },
};

export function canUse(plan: Plan, feature: Feature): boolean {
  return FEATURES[feature].plans.includes(plan);
}

export function canUseTemplate(plan: Plan, template: TemplateId): boolean {
  if (!TEMPLATE_INFO[template].premium) return true;
  return canUse(plan, 'premiumTemplates');
}

export function canCreateCv(plan: Plan, currentCount: number): boolean {
  if (canUse(plan, 'multipleCvs')) return true;
  return currentCount < FREE_CV_LIMIT;
}

export const PREMIUM_BENEFITS: string[] = Object.values(FEATURES).map(
  (f) => f.label,
);
