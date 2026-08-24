import type { CvDocument } from '../../../types/cv';
import {
  SectionBody,
  contactItems,
  hasContent,
  styleVars,
  visibleSections,
} from '../shared';

interface TemplateProps {
  cv: CvDocument;
}

function useSections(cv: CvDocument) {
  return visibleSections(cv).filter((k) => hasContent(cv, k));
}

function headingStyle(accent: string): React.CSSProperties {
  return {
    color: accent,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontWeight: 700,
    fontSize: '0.95em',
    borderBottom: `1px solid ${accent}`,
    paddingBottom: '3px',
    marginBottom: '6px',
  };
}

export function ClassicTemplate({ cv }: TemplateProps) {
  const vars = styleVars(cv.style);
  const sections = useSections(cv);
  const p = cv.data.personal;
  return (
    <div style={{ fontFamily: vars.fontFamily, fontSize: vars.fontSize }}>
      <header style={{ textAlign: 'center', marginBottom: vars.sectionGap }}>
        <h1
          style={{
            fontSize: '1.9em',
            fontWeight: 700,
            color: '#111827',
            margin: 0,
          }}
        >
          {p.fullName || 'Your Name'}
        </h1>
        {p.jobTitle && (
          <p style={{ color: vars.accent, fontWeight: 600, margin: '2px 0' }}>
            {p.jobTitle}
          </p>
        )}
        <p style={{ color: '#64748b', fontSize: '0.9em', margin: 0 }}>
          {contactItems(cv).join(' · ')}
        </p>
      </header>
      <div style={{ display: 'grid', gap: vars.sectionGap }}>
        {sections.map((key) => (
          <section key={key}>
            <h2 style={headingStyle(vars.accent)}>{sectionTitle(key)}</h2>
            <SectionBody cv={cv} section={key} vars={vars} />
          </section>
        ))}
      </div>
    </div>
  );
}

const MODERN_SIDEBAR = ['skills', 'languages', 'certifications'] as const;

export function ModernTemplate({ cv }: TemplateProps) {
  const vars = styleVars(cv.style);
  const sections = useSections(cv);
  const p = cv.data.personal;
  const sidebarSections = sections.filter((k) =>
    (MODERN_SIDEBAR as readonly string[]).includes(k),
  );
  const mainSections = sections.filter(
    (k) => !(MODERN_SIDEBAR as readonly string[]).includes(k),
  );
  return (
    <div
      style={{
        fontFamily: vars.fontFamily,
        fontSize: vars.fontSize,
        display: 'grid',
        gridTemplateColumns: '32% 1fr',
        minHeight: '100%',
      }}
    >
      <aside
        style={{
          background: vars.accent,
          color: '#fff',
          padding: '24px 18px',
          display: 'grid',
          gap: vars.sectionGap,
          alignContent: 'start',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.5em', fontWeight: 700, margin: 0 }}>
            {p.fullName || 'Your Name'}
          </h1>
          {p.jobTitle && (
            <p style={{ opacity: 0.9, margin: '4px 0 0' }}>{p.jobTitle}</p>
          )}
        </div>
        {contactItems(cv).length > 0 && (
          <section>
            <h2
              style={{
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontSize: '0.85em',
                fontWeight: 700,
                borderBottom: '1px solid rgba(255,255,255,0.4)',
                paddingBottom: '3px',
                marginBottom: '6px',
              }}
            >
              Contact
            </h2>
            <ul style={{ display: 'grid', gap: '3px', fontSize: '0.9em' }}>
              {contactItems(cv).map((c) => (
                <li key={c} style={{ wordBreak: 'break-word' }}>
                  {c}
                </li>
              ))}
            </ul>
          </section>
        )}
        {sidebarSections.map((key) => (
          <section key={key}>
            <h2
              style={{
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontSize: '0.85em',
                fontWeight: 700,
                borderBottom: '1px solid rgba(255,255,255,0.4)',
                paddingBottom: '3px',
                marginBottom: '6px',
              }}
            >
              {sectionTitle(key)}
            </h2>
            <SectionBody cv={cv} section={key} vars={vars} light />
          </section>
        ))}
      </aside>
      <main
        style={{
          padding: '24px 22px',
          display: 'grid',
          gap: vars.sectionGap,
          alignContent: 'start',
        }}
      >
        {mainSections.map((key) => (
          <section key={key}>
            <h2 style={headingStyle(vars.accent)}>{sectionTitle(key)}</h2>
            <SectionBody cv={cv} section={key} vars={vars} />
          </section>
        ))}
      </main>
    </div>
  );
}

export function ElegantTemplate({ cv }: TemplateProps) {
  const vars = styleVars({ ...cv.style, fontFamily: 'serif' });
  const sections = useSections(cv);
  const p = cv.data.personal;
  return (
    <div style={{ fontFamily: vars.fontFamily, fontSize: vars.fontSize }}>
      <header
        style={{
          marginBottom: vars.sectionGap,
          borderBottom: `2px solid ${vars.accent}`,
          paddingBottom: '10px',
        }}
      >
        <h1
          style={{
            fontSize: '2em',
            fontWeight: 400,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#111827',
            margin: 0,
          }}
        >
          {p.fullName || 'Your Name'}
        </h1>
        {p.jobTitle && (
          <p
            style={{
              color: vars.accent,
              fontStyle: 'italic',
              margin: '2px 0',
              fontSize: '1.05em',
            }}
          >
            {p.jobTitle}
          </p>
        )}
        <p style={{ color: '#64748b', fontSize: '0.88em', margin: 0 }}>
          {contactItems(cv).join('  |  ')}
        </p>
      </header>
      <div style={{ display: 'grid', gap: vars.sectionGap }}>
        {sections.map((key) => (
          <section key={key}>
            <h2
              style={{
                color: '#111827',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                fontWeight: 600,
                fontSize: '0.9em',
                marginBottom: '6px',
              }}
            >
              {sectionTitle(key)}
            </h2>
            <SectionBody cv={cv} section={key} vars={vars} />
          </section>
        ))}
      </div>
    </div>
  );
}

export function AtsTemplate({ cv }: TemplateProps) {
  const vars = styleVars({ ...cv.style, accentColor: '#000000' });
  const sections = useSections(cv);
  const p = cv.data.personal;
  const black = '#000';
  return (
    <div
      style={{
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: vars.fontSize,
        color: black,
      }}
    >
      <header style={{ marginBottom: vars.sectionGap }}>
        <h1 style={{ fontSize: '1.7em', fontWeight: 700, margin: 0 }}>
          {p.fullName || 'Your Name'}
        </h1>
        {p.jobTitle && <p style={{ margin: '2px 0' }}>{p.jobTitle}</p>}
        <p style={{ margin: 0 }}>{contactItems(cv).join(' | ')}</p>
      </header>
      <div style={{ display: 'grid', gap: vars.sectionGap }}>
        {sections.map((key) => (
          <section key={key}>
            <h2
              style={{
                textTransform: 'uppercase',
                fontWeight: 700,
                fontSize: '1em',
                borderBottom: '1px solid #000',
                paddingBottom: '2px',
                marginBottom: '6px',
              }}
            >
              {sectionTitle(key)}
            </h2>
            <SectionBody cv={cv} section={key} vars={vars} />
          </section>
        ))}
      </div>
    </div>
  );
}

export function BoldTemplate({ cv }: TemplateProps) {
  const vars = styleVars(cv.style);
  const sections = useSections(cv);
  const p = cv.data.personal;
  return (
    <div style={{ fontFamily: vars.fontFamily, fontSize: vars.fontSize }}>
      <header
        style={{
          background: vars.accent,
          color: '#fff',
          padding: '22px 24px',
          margin: '-40px -48px 0',
          marginBottom: vars.sectionGap,
        }}
      >
        <h1
          style={{
            fontSize: '2.1em',
            fontWeight: 800,
            margin: 0,
            letterSpacing: '0.02em',
          }}
        >
          {p.fullName || 'Your Name'}
        </h1>
        {p.jobTitle && (
          <p style={{ fontSize: '1.1em', opacity: 0.92, margin: '2px 0' }}>
            {p.jobTitle}
          </p>
        )}
        <p style={{ fontSize: '0.88em', opacity: 0.85, margin: 0 }}>
          {contactItems(cv).join(' · ')}
        </p>
      </header>
      <div style={{ display: 'grid', gap: vars.sectionGap }}>
        {sections.map((key) => (
          <section key={key}>
            <h2
              style={{
                color: vars.accent,
                fontWeight: 800,
                fontSize: '1.05em',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '6px',
              }}
            >
              {sectionTitle(key)}
            </h2>
            <SectionBody cv={cv} section={key} vars={vars} />
          </section>
        ))}
      </div>
    </div>
  );
}

function sectionTitle(key: string): string {
  const titles: Record<string, string> = {
    summary: 'Professional Summary',
    experience: 'Work Experience',
    education: 'Education',
    skills: 'Skills',
    projects: 'Projects',
    certifications: 'Certifications',
    languages: 'Languages',
    references: 'References',
  };
  return titles[key] ?? key;
}
