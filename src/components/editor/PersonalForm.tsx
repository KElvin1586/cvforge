import { useApp } from '../../state/AppContext';
import type { PersonalInfo } from '../../types/cv';
import { TextField } from '../ui/fields';

export function PersonalForm() {
  const { activeCv, updateActiveCv } = useApp();
  if (!activeCv) return null;
  const p = activeCv.data.personal;

  const set = (patch: Partial<PersonalInfo>) =>
    updateActiveCv((cv) => ({
      ...cv,
      data: { ...cv.data, personal: { ...cv.data.personal, ...patch } },
    }));

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      <TextField
        label="Full name"
        value={p.fullName}
        onChange={(v) => set({ fullName: v })}
        placeholder="Alex Carter"
      />
      <TextField
        label="Job title"
        value={p.jobTitle}
        onChange={(v) => set({ jobTitle: v })}
        placeholder="Senior Frontend Engineer"
      />
      <TextField
        label="Email"
        type="email"
        value={p.email}
        onChange={(v) => set({ email: v })}
        placeholder="you@yourmail.com"
      />
      <TextField
        label="Phone"
        type="tel"
        value={p.phone}
        onChange={(v) => set({ phone: v })}
        placeholder="+1 (555) 123-4567"
      />
      <TextField
        label="Location"
        value={p.location}
        onChange={(v) => set({ location: v })}
        placeholder="Austin, TX"
      />
      <TextField
        label="Website"
        value={p.website}
        onChange={(v) => set({ website: v })}
        placeholder="https://yoursite.dev"
      />
      <TextField
        label="LinkedIn"
        value={p.linkedin}
        onChange={(v) => set({ linkedin: v })}
        placeholder="linkedin.com/in/you"
      />
      <TextField
        label="GitHub"
        value={p.github}
        onChange={(v) => set({ github: v })}
        placeholder="github.com/you"
      />
    </div>
  );
}
