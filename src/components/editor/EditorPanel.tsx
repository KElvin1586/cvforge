import { useState } from 'react';
import { useApp } from '../../state/AppContext';
import { SECTION_LABELS, type SectionKey } from '../../types/cv';
import { moveItem } from '../ui/fields';
import { PersonalForm } from './PersonalForm';
import {
  CertificationsForm,
  EducationForm,
  ExperienceForm,
  LanguagesForm,
  ProjectsForm,
  ReferencesForm,
  SkillsForm,
  SummaryForm,
} from './SectionForms';

const SECTION_FORMS: Record<SectionKey, () => React.JSX.Element | null> = {
  summary: SummaryForm,
  experience: ExperienceForm,
  education: EducationForm,
  skills: SkillsForm,
  projects: ProjectsForm,
  certifications: CertificationsForm,
  languages: LanguagesForm,
  references: ReferencesForm,
};

export function EditorPanel() {
  const { activeCv, updateActiveCv } = useApp();
  const [openSection, setOpenSection] = useState<string | null>('personal');
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  if (!activeCv) {
    return (
      <p className="p-4 text-sm text-slate-500">
        No CV selected. Create one to get started.
      </p>
    );
  }

  const toggleOpen = (key: string) =>
    setOpenSection((current) => (current === key ? null : key));

  const toggleHidden = (key: SectionKey) =>
    updateActiveCv((cv) => ({
      ...cv,
      hiddenSections: cv.hiddenSections.includes(key)
        ? cv.hiddenSections.filter((k) => k !== key)
        : [...cv.hiddenSections, key],
    }));

  const reorder = (from: number, to: number) =>
    updateActiveCv((cv) => ({
      ...cv,
      sectionOrder: moveItem(cv.sectionOrder, from, to - from),
    }));

  return (
    <div className="space-y-2">
      <section className="rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <header>
          <button
            type="button"
            onClick={() => toggleOpen('personal')}
            aria-expanded={openSection === 'personal'}
            className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm font-semibold text-slate-800 dark:text-slate-100"
          >
            Personal Information
            <span aria-hidden="true">{openSection === 'personal' ? '▾' : '▸'}</span>
          </button>
        </header>
        {openSection === 'personal' && (
          <div className="border-t border-slate-100 p-3 dark:border-slate-700">
            <PersonalForm />
          </div>
        )}
      </section>

      <p className="px-1 pt-1 text-xs text-slate-400">
        Drag sections (or use ↑ ↓) to change their order on the CV. Use the eye
        to show/hide a section.
      </p>

      <ul className="space-y-2">
        {activeCv.sectionOrder.map((key, index) => {
          const Form = SECTION_FORMS[key];
          const hidden = activeCv.hiddenSections.includes(key);
          const isOpen = openSection === key;
          return (
            <li
              key={key}
              draggable
              onDragStart={(e) => {
                setDragIndex(index);
                e.dataTransfer.effectAllowed = 'move';
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setDropIndex(index);
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (dragIndex !== null && dragIndex !== index) {
                  reorder(dragIndex, index);
                }
                setDragIndex(null);
                setDropIndex(null);
              }}
              onDragEnd={() => {
                setDragIndex(null);
                setDropIndex(null);
              }}
              className={`rounded-lg border bg-white dark:bg-slate-800 ${
                dropIndex === index && dragIndex !== index
                  ? 'border-blue-400 dark:border-blue-500'
                  : 'border-slate-200 dark:border-slate-700'
              } ${dragIndex === index ? 'opacity-50' : ''} ${
                hidden ? 'opacity-70' : ''
              }`}
            >
              <div className="flex items-center gap-1 px-2 py-1.5">
                <span
                  className="cursor-grab px-1 text-slate-400"
                  aria-hidden="true"
                  title="Drag to reorder"
                >
                  ⠿
                </span>
                <button
                  type="button"
                  onClick={() => toggleOpen(key)}
                  aria-expanded={isOpen}
                  className="flex flex-1 items-center justify-between py-1 text-left text-sm font-semibold text-slate-800 dark:text-slate-100"
                >
                  {SECTION_LABELS[key]}
                  <span aria-hidden="true">{isOpen ? '▾' : '▸'}</span>
                </button>
                <button
                  type="button"
                  aria-label={`Move ${SECTION_LABELS[key]} up`}
                  disabled={index === 0}
                  onClick={() => reorder(index, index - 1)}
                  className="rounded px-1 text-xs text-slate-400 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-700"
                >
                  ↑
                </button>
                <button
                  type="button"
                  aria-label={`Move ${SECTION_LABELS[key]} down`}
                  disabled={index === activeCv.sectionOrder.length - 1}
                  onClick={() => reorder(index, index + 1)}
                  className="rounded px-1 text-xs text-slate-400 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-700"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => toggleHidden(key)}
                  aria-label={hidden ? `Show ${SECTION_LABELS[key]}` : `Hide ${SECTION_LABELS[key]}`}
                  aria-pressed={hidden}
                  title={hidden ? 'Show on CV' : 'Hide from CV'}
                  className="rounded px-1 text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  {hidden ? '🚫' : '👁'}
                </button>
              </div>
              {isOpen && (
                <div className="border-t border-slate-100 p-3 dark:border-slate-700">
                  <Form />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
