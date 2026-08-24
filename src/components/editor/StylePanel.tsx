import { useApp } from '../../state/AppContext';
import { useUpgrade } from '../../state/UpgradeContext';
import {
  TEMPLATE_INFO,
  canUseTemplate,
} from '../../lib/entitlements';
import type {
  FontFamilyOption,
  FontSizeOption,
  SpacingOption,
  TemplateId,
} from '../../types/cv';
import { PremiumBadge } from '../PremiumGate';

const ACCENT_PRESETS = [
  '#1d4ed8',
  '#0f766e',
  '#b91c1c',
  '#7c3aed',
  '#c2410c',
  '#0f172a',
];

const TEMPLATE_IDS = Object.keys(TEMPLATE_INFO) as TemplateId[];

export function StylePanel() {
  const { state, activeCv, updateActiveCv } = useApp();
  const { requireFeature, isPremium } = useUpgrade();
  if (!activeCv) return null;
  const { style } = activeCv;

  const setStyle = (patch: Partial<typeof style>) =>
    updateActiveCv((cv) => ({ ...cv, style: { ...cv.style, ...patch } }));

  const selectClass =
    'w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100';

  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Template
        </h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {TEMPLATE_IDS.map((id) => {
            const info = TEMPLATE_INFO[id];
            const allowed = canUseTemplate(state.plan, id);
            const selected = style.template === id;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  if (allowed) setStyle({ template: id });
                  else requireFeature('premiumTemplates');
                }}
                className={`rounded-lg border p-2 text-left transition ${
                  selected
                    ? 'border-blue-500 ring-1 ring-blue-500'
                    : 'border-slate-200 hover:border-slate-300 dark:border-slate-600 dark:hover:border-slate-500'
                }`}
              >
                <span
                  aria-hidden="true"
                  className="mb-1 block h-8 rounded"
                  style={{
                    background:
                      id === 'modern'
                        ? `linear-gradient(90deg, ${style.accentColor} 35%, #e2e8f0 35%)`
                        : id === 'bold'
                          ? `linear-gradient(180deg, ${style.accentColor} 55%, #e2e8f0 55%)`
                          : '#e2e8f0',
                  }}
                />
                <span className="block text-xs font-semibold text-slate-800 dark:text-slate-100">
                  {info.name}
                  {info.premium && !isPremium && <PremiumBadge />}
                </span>
              </button>
            );
          })}
        </div>
        <p className="mt-1 text-xs text-slate-400">
          {TEMPLATE_INFO[style.template].description}
        </p>
      </div>

      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Accent color
          {!isPremium && <PremiumBadge />}
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          {ACCENT_PRESETS.map((color) => (
            <button
              key={color}
              type="button"
              aria-label={`Accent color ${color}`}
              onClick={() => {
                if (requireFeature('advancedCustomization'))
                  setStyle({ accentColor: color });
              }}
              className={`h-7 w-7 rounded-full border-2 ${
                style.accentColor === color
                  ? 'border-slate-800 dark:border-white'
                  : 'border-transparent'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
          <label className="flex items-center gap-1 text-xs text-slate-500">
            Custom
            <input
              type="color"
              value={style.accentColor}
              onChange={(e) => {
                if (requireFeature('advancedCustomization'))
                  setStyle({ accentColor: e.target.value });
              }}
              className="h-7 w-9 cursor-pointer rounded border border-slate-300 dark:border-slate-600"
            />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
            Font
          </span>
          <select
            value={style.fontFamily}
            onChange={(e) => {
              if (requireFeature('advancedCustomization'))
                setStyle({ fontFamily: e.target.value as FontFamilyOption });
            }}
            className={selectClass}
          >
            <option value="sans">Sans-serif</option>
            <option value="serif">Serif</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
            Size
          </span>
          <select
            value={style.fontSize}
            onChange={(e) => {
              if (requireFeature('advancedCustomization'))
                setStyle({ fontSize: e.target.value as FontSizeOption });
            }}
            className={selectClass}
          >
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
            Density
            {!isPremium && <PremiumBadge />}
          </span>
          <select
            value={style.spacing}
            onChange={(e) => {
              if (requireFeature('advancedLayouts'))
                setStyle({ spacing: e.target.value as SpacingOption });
            }}
            className={selectClass}
          >
            <option value="compact">Compact</option>
            <option value="normal">Normal</option>
            <option value="relaxed">Relaxed</option>
          </select>
        </label>
      </div>
      {!isPremium && (
        <p className="text-xs text-slate-400">
          Free plan includes the Classic and Modern templates with default
          styling. Upgrade to unlock all templates and styling controls.
        </p>
      )}
    </div>
  );
}
