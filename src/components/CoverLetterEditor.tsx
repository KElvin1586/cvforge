import { useApp } from '../state/AppContext';
import { useUpgrade } from '../state/UpgradeContext';
import { TextField, TextArea } from './ui/fields';
import { CvPage } from './preview/CvPreview';

export function CoverLetterEditor() {
  const { activeCv, updateActiveCv } = useApp();
  const { requireFeature, isPremium } = useUpgrade();
  if (!activeCv) return null;
  const cl = activeCv.coverLetter;

  const set = (patch: Partial<typeof cl>) =>
    updateActiveCv((cv) => ({
      ...cv,
      coverLetter: { ...cv.coverLetter, ...patch },
    }));

  if (!isPremium) {
    return (
      <div className="mx-auto max-w-lg rounded-xl border border-dashed border-amber-300 bg-amber-50 p-8 text-center dark:border-amber-700 dark:bg-amber-900/20">
        <p className="text-3xl" aria-hidden="true">
          🔒
        </p>
        <h2 className="mt-2 text-lg font-bold text-slate-800 dark:text-slate-100">
          Cover-letter builder is a Premium feature
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Write matching cover letters that reuse your CV's contact details and
          styling, ready to print or save as PDF.
        </p>
        <button
          type="button"
          onClick={() => requireFeature('coverLetter')}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Upgrade to Premium
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
        <TextField
          label="Recipient name / hiring manager"
          value={cl.recipientName}
          onChange={(v) => set({ recipientName: v })}
          placeholder="Hiring Manager"
        />
        <TextField
          label="Company"
          value={cl.company}
          onChange={(v) => set({ company: v })}
          placeholder="Acme Inc."
        />
        <TextField
          label="Position"
          value={cl.position}
          onChange={(v) => set({ position: v })}
          placeholder="Senior Frontend Engineer"
        />
        <TextField
          label="Date"
          value={cl.date}
          onChange={(v) => set({ date: v })}
          placeholder={new Date().toLocaleDateString()}
        />
        <TextArea
          label="Letter body"
          value={cl.body}
          onChange={(v) => set({ body: v })}
          rows={14}
          placeholder="Dear Hiring Manager,&#10;&#10;I am writing to express my interest in…"
          hint="Blank lines create paragraphs."
        />
      </div>
      <div className="print-area overflow-x-auto">
        <CvPage>
          <CoverLetterDocument />
        </CvPage>
      </div>
    </div>
  );
}

export function CoverLetterDocument() {
  const { activeCv } = useApp();
  if (!activeCv) return null;
  const p = activeCv.data.personal;
  const cl = activeCv.coverLetter;
  const contact = [p.email, p.phone, p.location].filter(Boolean).join(' · ');

  return (
    <div style={{ fontFamily: 'Georgia, serif', fontSize: '13.5px', color: '#1f2937' }}>
      <header style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.6em', fontWeight: 700, margin: 0 }}>
          {p.fullName || 'Your Name'}
        </h1>
        {contact && (
          <p style={{ color: '#64748b', fontSize: '0.9em', margin: '2px 0 0' }}>
            {contact}
          </p>
        )}
      </header>
      <p style={{ margin: '0 0 16px', color: '#64748b' }}>
        {cl.date || new Date().toLocaleDateString()}
      </p>
      <address
        style={{ fontStyle: 'normal', marginBottom: '20px', lineHeight: 1.5 }}
      >
        {cl.recipientName && (
          <>
            {cl.recipientName}
            <br />
          </>
        )}
        {cl.company && (
          <>
            {cl.company}
            <br />
          </>
        )}
        {cl.position && <>Re: {cl.position}</>}
      </address>
      {cl.body ? (
        cl.body.split(/\n\s*\n/).map((para, i) => (
          <p key={i} style={{ margin: '0 0 14px', lineHeight: 1.65 }}>
            {para}
          </p>
        ))
      ) : (
        <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>
          Your letter preview appears here as you type…
        </p>
      )}
      <p style={{ marginTop: '28px' }}>
        Sincerely,
        <br />
        <br />
        {p.fullName || 'Your Name'}
      </p>
    </div>
  );
}
