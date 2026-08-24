import type {
  CvDocument,
  CvStyle,
  SectionKey,
} from '../../types/cv';

export interface StyleVars {
  accent: string;
  fontFamily: string;
  fontSize: string;
  sectionGap: string;
  itemGap: string;
}

export function styleVars(style: CvStyle): StyleVars {
  return {
    accent: style.accentColor,
    fontFamily:
      style.fontFamily === 'serif'
        ? 'Georgia, "Times New Roman", serif'
        : 'Inter, "Segoe UI", Arial, sans-serif',
    fontSize:
      style.fontSize === 'sm' ? '12px' : style.fontSize === 'lg' ? '15px' : '13.5px',
    sectionGap:
      style.spacing === 'compact' ? '12px' : style.spacing === 'relaxed' ? '26px' : '18px',
    itemGap:
      style.spacing === 'compact' ? '6px' : style.spacing === 'relaxed' ? '14px' : '10px',
  };
}

export function visibleSections(cv: CvDocument): SectionKey[] {
  return cv.sectionOrder.filter((k) => !cv.hiddenSections.includes(k));
}

export function hasContent(cv: CvDocument, key: SectionKey): boolean {
  const d = cv.data;
  switch (key) {
    case 'summary':
      return d.summary.trim().length > 0;
    case 'experience':
      return d.experience.length > 0;
    case 'education':
      return d.education.length > 0;
    case 'skills':
      return d.skills.length > 0;
    case 'projects':
      return d.projects.length > 0;
    case 'certifications':
      return d.certifications.length > 0;
    case 'languages':
      return d.languages.length > 0;
    case 'references':
      return d.references.length > 0;
  }
}

export function formatMonth(value: string): string {
  const m = /^(\d{4})-(\d{2})$/.exec(value.trim());
  if (!m) return value;
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  const month = months[parseInt(m[2], 10) - 1];
  return month ? `${month} ${m[1]}` : value;
}

export function dateRange(
  start: string,
  end: string,
  current?: boolean,
): string {
  const s = formatMonth(start);
  const e = current ? 'Present' : formatMonth(end);
  if (s && e) return `${s} – ${e}`;
  return s || e;
}

export function descriptionBullets(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.replace(/^[-•*]\s*/, '').trim())
    .filter(Boolean);
}

export function contactItems(cv: CvDocument): string[] {
  const p = cv.data.personal;
  return [p.email, p.phone, p.location, p.website, p.linkedin, p.github].filter(
    (v) => v.trim().length > 0,
  );
}

export function SectionBody({
  cv,
  section,
  vars,
  light = false,
}: {
  cv: CvDocument;
  section: SectionKey;
  vars: StyleVars;
  light?: boolean;
}) {
  const d = cv.data;
  const subColor = light ? 'rgba(255,255,255,0.85)' : '#64748b';
  const textColor = light ? '#ffffff' : '#1f2937';

  switch (section) {
    case 'summary':
      return (
        <p style={{ color: textColor, whiteSpace: 'pre-line' }}>{d.summary}</p>
      );
    case 'experience':
      return (
        <div style={{ display: 'grid', gap: vars.itemGap }}>
          {d.experience.map((e) => (
            <div key={e.id}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '8px',
                  flexWrap: 'wrap',
                }}
              >
                <strong style={{ color: textColor }}>
                  {e.role}
                  {e.company ? `, ${e.company}` : ''}
                </strong>
                <span style={{ color: subColor, whiteSpace: 'nowrap' }}>
                  {dateRange(e.startDate, e.endDate, e.current)}
                </span>
              </div>
              {e.location && (
                <div style={{ color: subColor, fontStyle: 'italic' }}>
                  {e.location}
                </div>
              )}
              {descriptionBullets(e.description).length > 0 && (
                <ul style={{ margin: '4px 0 0 18px', color: textColor }}>
                  {descriptionBullets(e.description).map((b, i) => (
                    <li key={i} style={{ listStyle: 'disc', marginTop: '2px' }}>
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      );
    case 'education':
      return (
        <div style={{ display: 'grid', gap: vars.itemGap }}>
          {d.education.map((e) => (
            <div key={e.id}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '8px',
                  flexWrap: 'wrap',
                }}
              >
                <strong style={{ color: textColor }}>
                  {e.degree}
                  {e.school ? `, ${e.school}` : ''}
                </strong>
                <span style={{ color: subColor, whiteSpace: 'nowrap' }}>
                  {dateRange(e.startDate, e.endDate)}
                </span>
              </div>
              {e.location && (
                <div style={{ color: subColor, fontStyle: 'italic' }}>
                  {e.location}
                </div>
              )}
              {e.description && (
                <p style={{ color: textColor, marginTop: '2px' }}>
                  {e.description}
                </p>
              )}
            </div>
          ))}
        </div>
      );
    case 'skills':
      return (
        <ul
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px 14px',
            color: textColor,
          }}
        >
          {d.skills.map((s) => (
            <li key={s.id} style={{ listStyle: 'none' }}>
              <strong>{s.name}</strong>
              {s.level && (
                <span style={{ color: subColor }}> · {s.level}</span>
              )}
            </li>
          ))}
        </ul>
      );
    case 'projects':
      return (
        <div style={{ display: 'grid', gap: vars.itemGap }}>
          {d.projects.map((p) => (
            <div key={p.id}>
              <strong style={{ color: textColor }}>{p.name}</strong>
              {p.link && (
                <span style={{ color: vars.accent }}> — {p.link}</span>
              )}
              {p.technologies && (
                <div style={{ color: subColor, fontStyle: 'italic' }}>
                  {p.technologies}
                </div>
              )}
              {p.description && (
                <p style={{ color: textColor, marginTop: '2px' }}>
                  {p.description}
                </p>
              )}
            </div>
          ))}
        </div>
      );
    case 'certifications':
      return (
        <ul style={{ display: 'grid', gap: '4px', color: textColor }}>
          {d.certifications.map((c) => (
            <li key={c.id}>
              <strong>{c.name}</strong>
              {c.issuer && <span> — {c.issuer}</span>}
              {c.date && (
                <span style={{ color: subColor }}> ({formatMonth(c.date)})</span>
              )}
            </li>
          ))}
        </ul>
      );
    case 'languages':
      return (
        <ul
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px 14px',
            color: textColor,
          }}
        >
          {d.languages.map((l) => (
            <li key={l.id}>
              <strong>{l.name}</strong>
              {l.proficiency && (
                <span style={{ color: subColor }}> — {l.proficiency}</span>
              )}
            </li>
          ))}
        </ul>
      );
    case 'references':
      return (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: vars.itemGap,
          }}
        >
          {d.references.map((r) => (
            <div key={r.id}>
              <strong style={{ color: textColor }}>{r.name}</strong>
              {(r.title || r.company) && (
                <div style={{ color: subColor }}>
                  {[r.title, r.company].filter(Boolean).join(', ')}
                </div>
              )}
              {r.email && <div style={{ color: textColor }}>{r.email}</div>}
              {r.phone && <div style={{ color: textColor }}>{r.phone}</div>}
            </div>
          ))}
        </div>
      );
  }
}
