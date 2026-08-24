import { useApp } from '../../state/AppContext';
import {
  uid,
  type CvData,
  type SkillLevel,
} from '../../types/cv';
import {
  AddItemButton,
  CheckboxField,
  ItemCard,
  SelectField,
  TextArea,
  TextField,
  moveItem,
} from '../ui/fields';

type ListKey = {
  [K in keyof CvData]: CvData[K] extends { id: string }[] ? K : never;
}[keyof CvData];

interface FieldDef {
  key: string;
  label: string;
  type?: 'text' | 'textarea' | 'month' | 'select';
  placeholder?: string;
  options?: { value: string; label: string }[];
  hint?: string;
}

interface ListSectionProps {
  listKey: ListKey;
  fields: FieldDef[];
  addLabel: string;
  makeItem: () => Record<string, unknown> & { id: string };
  titleOf: (item: Record<string, unknown>) => string;
  extra?: (
    item: Record<string, unknown>,
    update: (patch: Record<string, unknown>) => void,
  ) => React.ReactNode;
}

function ListSection({
  listKey,
  fields,
  addLabel,
  makeItem,
  titleOf,
  extra,
}: ListSectionProps) {
  const { activeCv, updateActiveCv } = useApp();
  if (!activeCv) return null;
  const items = activeCv.data[listKey] as unknown as (Record<
    string,
    unknown
  > & { id: string })[];

  const commit = (next: typeof items) =>
    updateActiveCv((cv) => ({
      ...cv,
      data: { ...cv.data, [listKey]: next },
    }));

  const updateItem = (index: number, patch: Record<string, unknown>) =>
    commit(
      items.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <ItemCard
          key={item.id}
          title={titleOf(item) || `Entry ${index + 1}`}
          onDelete={() => commit(items.filter((_, i) => i !== index))}
          onMoveUp={index > 0 ? () => commit(moveItem(items, index, -1)) : undefined}
          onMoveDown={
            index < items.length - 1
              ? () => commit(moveItem(items, index, 1))
              : undefined
          }
        >
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {fields.map((f) => {
              const value = String(item[f.key] ?? '');
              const onChange = (v: string) => updateItem(index, { [f.key]: v });
              const wrapperClass =
                f.type === 'textarea' ? 'sm:col-span-2' : undefined;
              return (
                <div key={f.key} className={wrapperClass}>
                  {f.type === 'textarea' ? (
                    <TextArea
                      label={f.label}
                      value={value}
                      onChange={onChange}
                      placeholder={f.placeholder}
                      hint={f.hint}
                      rows={3}
                    />
                  ) : f.type === 'select' ? (
                    <SelectField
                      label={f.label}
                      value={value}
                      onChange={onChange}
                      options={f.options ?? []}
                    />
                  ) : (
                    <TextField
                      label={f.label}
                      type={f.type === 'month' ? 'month' : 'text'}
                      value={value}
                      onChange={onChange}
                      placeholder={f.placeholder}
                    />
                  )}
                </div>
              );
            })}
          </div>
          {extra?.(item, (patch) => updateItem(index, patch))}
        </ItemCard>
      ))}
      <AddItemButton label={addLabel} onClick={() => commit([...items, makeItem()])} />
    </div>
  );
}

export function SummaryForm() {
  const { activeCv, updateActiveCv } = useApp();
  if (!activeCv) return null;
  return (
    <TextArea
      label="Summary"
      value={activeCv.data.summary}
      onChange={(v) =>
        updateActiveCv((cv) => ({ ...cv, data: { ...cv.data, summary: v } }))
      }
      placeholder="2–3 sentences highlighting your role, experience, and key strengths."
      rows={5}
    />
  );
}

export function ExperienceForm() {
  return (
    <ListSection
      listKey="experience"
      addLabel="Add work experience"
      makeItem={() => ({
        id: uid(),
        role: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
      })}
      titleOf={(i) =>
        [i.role, i.company].filter(Boolean).join(' · ') as string
      }
      fields={[
        { key: 'role', label: 'Role / title', placeholder: 'Frontend Engineer' },
        { key: 'company', label: 'Company', placeholder: 'Acme Inc.' },
        { key: 'location', label: 'Location', placeholder: 'Remote' },
        { key: 'startDate', label: 'Start date', type: 'month' },
        {
          key: 'description',
          label: 'Description / achievements',
          type: 'textarea',
          placeholder: 'One achievement per line — they render as bullet points.',
        },
      ]}
      extra={(item, update) => (
        <div className="mt-2 flex flex-wrap items-end gap-3">
          <CheckboxField
            label="I currently work here"
            checked={item.current === true}
            onChange={(v) => update({ current: v, ...(v ? { endDate: '' } : {}) })}
          />
          {item.current !== true && (
            <div className="w-40">
              <TextField
                label="End date"
                type="month"
                value={String(item.endDate ?? '')}
                onChange={(v) => update({ endDate: v })}
              />
            </div>
          )}
        </div>
      )}
    />
  );
}

export function EducationForm() {
  return (
    <ListSection
      listKey="education"
      addLabel="Add education"
      makeItem={() => ({
        id: uid(),
        degree: '',
        school: '',
        location: '',
        startDate: '',
        endDate: '',
        description: '',
      })}
      titleOf={(i) => [i.degree, i.school].filter(Boolean).join(' · ') as string}
      fields={[
        { key: 'degree', label: 'Degree / program', placeholder: 'B.S. Computer Science' },
        { key: 'school', label: 'School', placeholder: 'University of Example' },
        { key: 'location', label: 'Location' },
        { key: 'startDate', label: 'Start date', type: 'month' },
        { key: 'endDate', label: 'End date', type: 'month' },
        { key: 'description', label: 'Details', type: 'textarea' },
      ]}
    />
  );
}

const SKILL_LEVELS: { value: SkillLevel; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' },
];

export function SkillsForm() {
  return (
    <ListSection
      listKey="skills"
      addLabel="Add skill"
      makeItem={() => ({ id: uid(), name: '', level: 'intermediate' })}
      titleOf={(i) => String(i.name ?? '')}
      fields={[
        { key: 'name', label: 'Skill', placeholder: 'React' },
        { key: 'level', label: 'Level', type: 'select', options: SKILL_LEVELS },
      ]}
    />
  );
}

export function ProjectsForm() {
  return (
    <ListSection
      listKey="projects"
      addLabel="Add project"
      makeItem={() => ({
        id: uid(),
        name: '',
        link: '',
        technologies: '',
        description: '',
      })}
      titleOf={(i) => String(i.name ?? '')}
      fields={[
        { key: 'name', label: 'Project name' },
        { key: 'link', label: 'Link', placeholder: 'https://…' },
        { key: 'technologies', label: 'Technologies', placeholder: 'React, TypeScript' },
        { key: 'description', label: 'Description', type: 'textarea' },
      ]}
    />
  );
}

export function CertificationsForm() {
  return (
    <ListSection
      listKey="certifications"
      addLabel="Add certification"
      makeItem={() => ({ id: uid(), name: '', issuer: '', date: '' })}
      titleOf={(i) => String(i.name ?? '')}
      fields={[
        { key: 'name', label: 'Certification' },
        { key: 'issuer', label: 'Issuing organization' },
        { key: 'date', label: 'Date', type: 'month' },
      ]}
    />
  );
}

export function LanguagesForm() {
  return (
    <ListSection
      listKey="languages"
      addLabel="Add language"
      makeItem={() => ({ id: uid(), name: '', proficiency: '' })}
      titleOf={(i) => String(i.name ?? '')}
      fields={[
        { key: 'name', label: 'Language' },
        {
          key: 'proficiency',
          label: 'Proficiency',
          type: 'select',
          options: [
            { value: '', label: 'Select…' },
            { value: 'Native', label: 'Native' },
            { value: 'Fluent', label: 'Fluent' },
            { value: 'Professional working', label: 'Professional working' },
            { value: 'Intermediate', label: 'Intermediate' },
            { value: 'Basic', label: 'Basic' },
          ],
        },
      ]}
    />
  );
}

export function ReferencesForm() {
  return (
    <ListSection
      listKey="references"
      addLabel="Add reference"
      makeItem={() => ({
        id: uid(),
        name: '',
        title: '',
        company: '',
        email: '',
        phone: '',
      })}
      titleOf={(i) => String(i.name ?? '')}
      fields={[
        { key: 'name', label: 'Full name' },
        { key: 'title', label: 'Job title' },
        { key: 'company', label: 'Company' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
      ]}
    />
  );
}
