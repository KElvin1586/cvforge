export type SectionKey =
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'languages'
  | 'references';

export const SECTION_LABELS: Record<SectionKey, string> = {
  summary: 'Professional Summary',
  experience: 'Work Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  certifications: 'Certifications',
  languages: 'Languages',
  references: 'References',
};

export const DEFAULT_SECTION_ORDER: SectionKey[] = [
  'summary',
  'experience',
  'education',
  'skills',
  'projects',
  'certifications',
  'languages',
  'references',
];

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  school: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface SkillItem {
  id: string;
  name: string;
  level: SkillLevel;
}

export interface ProjectItem {
  id: string;
  name: string;
  link: string;
  technologies: string;
  description: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface LanguageItem {
  id: string;
  name: string;
  proficiency: string;
}

export interface ReferenceItem {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
}

export interface CvData {
  personal: PersonalInfo;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  languages: LanguageItem[];
  references: ReferenceItem[];
}

export type TemplateId = 'classic' | 'modern' | 'elegant' | 'ats' | 'bold';

export type FontSizeOption = 'sm' | 'md' | 'lg';
export type SpacingOption = 'compact' | 'normal' | 'relaxed';
export type FontFamilyOption = 'sans' | 'serif';

export interface CvStyle {
  template: TemplateId;
  accentColor: string;
  fontFamily: FontFamilyOption;
  fontSize: FontSizeOption;
  spacing: SpacingOption;
}

export interface CoverLetter {
  recipientName: string;
  company: string;
  position: string;
  date: string;
  body: string;
}

export interface CvDocument {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  sectionOrder: SectionKey[];
  hiddenSections: SectionKey[];
  style: CvStyle;
  data: CvData;
  coverLetter: CoverLetter;
}

export interface CvVersion {
  id: string;
  cvId: string;
  label: string;
  createdAt: number;
  snapshot: CvDocument;
}

export function uid(): string {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 9)
  ).toLowerCase();
}

export const DEFAULT_ACCENT = '#1d4ed8';

export function emptyPersonal(): PersonalInfo {
  return {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
  };
}

export function emptyCoverLetter(): CoverLetter {
  return {
    recipientName: '',
    company: '',
    position: '',
    date: '',
    body: '',
  };
}

export function createEmptyCv(name = 'Untitled CV'): CvDocument {
  const now = Date.now();
  return {
    id: uid(),
    name,
    createdAt: now,
    updatedAt: now,
    sectionOrder: [...DEFAULT_SECTION_ORDER],
    hiddenSections: [],
    style: {
      template: 'classic',
      accentColor: DEFAULT_ACCENT,
      fontFamily: 'sans',
      fontSize: 'md',
      spacing: 'normal',
    },
    data: {
      personal: emptyPersonal(),
      summary: '',
      experience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
      languages: [],
      references: [],
    },
    coverLetter: emptyCoverLetter(),
  };
}

export function createSampleCv(): CvDocument {
  const cv = createEmptyCv('Sample — Alex Carter');
  cv.data.personal = {
    fullName: 'Alex Carter',
    jobTitle: 'Senior Frontend Engineer',
    email: 'alex@alexcarter.dev',
    phone: '+1 (555) 123-4567',
    location: 'Austin, TX',
    website: 'https://alexcarter.dev',
    linkedin: 'linkedin.com/in/alexcarter',
    github: 'github.com/alexcarter',
  };
  cv.data.summary =
    'Senior frontend engineer with 8+ years of experience building accessible, high-performance web applications. Specialized in React, TypeScript, and design systems, with a track record of leading teams and shipping products used by millions.';
  cv.data.experience = [
    {
      id: uid(),
      role: 'Senior Frontend Engineer',
      company: 'Northwind Labs',
      location: 'Austin, TX',
      startDate: '2021-03',
      endDate: '',
      current: true,
      description:
        'Led migration of the core dashboard to React 18 and TypeScript, cutting bundle size by 38%.\nBuilt a design system adopted by 5 product teams, reducing UI inconsistencies.\nMentored 4 engineers and introduced accessibility reviews to the release process.',
    },
    {
      id: uid(),
      role: 'Frontend Engineer',
      company: 'Brightline Software',
      location: 'Remote',
      startDate: '2017-06',
      endDate: '2021-02',
      current: false,
      description:
        'Shipped a real-time analytics viewer used by 2M+ monthly users.\nImproved Core Web Vitals, raising average Lighthouse performance from 61 to 92.',
    },
  ];
  cv.data.education = [
    {
      id: uid(),
      degree: 'B.S. Computer Science',
      school: 'University of Texas at Austin',
      location: 'Austin, TX',
      startDate: '2013-08',
      endDate: '2017-05',
      description: 'Graduated with honors. Focus on human-computer interaction.',
    },
  ];
  cv.data.skills = [
    { id: uid(), name: 'React', level: 'expert' },
    { id: uid(), name: 'TypeScript', level: 'expert' },
    { id: uid(), name: 'Node.js', level: 'advanced' },
    { id: uid(), name: 'CSS / Tailwind', level: 'expert' },
    { id: uid(), name: 'Testing (Vitest, Playwright)', level: 'advanced' },
    { id: uid(), name: 'Accessibility (WCAG)', level: 'advanced' },
  ];
  cv.data.projects = [
    {
      id: uid(),
      name: 'CVForge',
      link: 'https://github.com/alexcarter/cvforge',
      technologies: 'React, TypeScript, Tailwind',
      description:
        'Open-source CV builder with live preview, templates, and local-first storage.',
    },
  ];
  cv.data.certifications = [
    {
      id: uid(),
      name: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services',
      date: '2023-04',
    },
  ];
  cv.data.languages = [
    { id: uid(), name: 'English', proficiency: 'Native' },
    { id: uid(), name: 'Spanish', proficiency: 'Professional working' },
  ];
  cv.data.references = [
    {
      id: uid(),
      name: 'Jordan Lee',
      title: 'Engineering Manager',
      company: 'Northwind Labs',
      email: 'jordan.lee@northwindlabs.dev',
      phone: '+1 (555) 987-6543',
    },
  ];
  return cv;
}
