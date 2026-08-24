import { useApp } from '../../state/AppContext';
import {
  AtsTemplate,
  BoldTemplate,
  ClassicTemplate,
  ElegantTemplate,
  ModernTemplate,
} from './templates/templates';

const TEMPLATES = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  elegant: ElegantTemplate,
  ats: AtsTemplate,
  bold: BoldTemplate,
} as const;

/** A4-style page wrapper shared by the live preview and print output. */
export function CvPage({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mx-auto bg-white text-slate-900 shadow-xl print:shadow-none"
      style={{
        width: '210mm',
        maxWidth: '100%',
        minHeight: '297mm',
        padding: '40px 48px',
      }}
    >
      {children}
    </div>
  );
}

export function CvPreview() {
  const { activeCv } = useApp();
  if (!activeCv) return null;
  const Template = TEMPLATES[activeCv.style.template] ?? ClassicTemplate;
  return (
    <CvPage>
      <Template cv={activeCv} />
    </CvPage>
  );
}
