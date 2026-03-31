export const VALID_TEMPLATES = ['modern', 'classic', 'bold'] as const;
export type TemplateName = typeof VALID_TEMPLATES[number];

export const TEMPLATES: { key: TemplateName; label: string }[] = [
  { key: 'modern', label: 'Modern' },
  { key: 'classic', label: 'Classic' },
  { key: 'bold', label: 'Bold' },
];

export const ACCENT_COLORS = ['#0ea5e9', '#22c55e', '#f97316', '#ef4444', '#94a3b8', '#1e293b'];

export const HEX_RE = /^#[0-9a-fA-F]{6}$/;
