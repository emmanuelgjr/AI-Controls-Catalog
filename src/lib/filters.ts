import type { Control } from '../content/config';

export interface FilterState {
  categories: string[];
  frameworks: string[];
  lifecycle: string[];
  riskDomains: string[];
  controlTypes: string[];
  aiTypes: string[];
}

export const emptyFilterState = (): FilterState => ({
  categories: [],
  frameworks: [],
  lifecycle: [],
  riskDomains: [],
  controlTypes: [],
  aiTypes: [],
});

const intersects = (a: string[], b: string[] | undefined) =>
  !b || b.length === 0 || b.some((v) => a.includes(v));

export function filterControls(controls: Control[], state: FilterState): Control[] {
  return controls.filter((c) => {
    if (state.categories.length && !state.categories.includes(c.category)) return false;
    if (state.controlTypes.length && !state.controlTypes.includes(c.control_type)) return false;
    if (state.lifecycle.length && !intersects(state.lifecycle, c.lifecycle_stage)) return false;
    if (state.riskDomains.length && !intersects(state.riskDomains, c.risk_domain)) return false;
    if (state.aiTypes.length && !intersects(state.aiTypes, c.applicability.ai_types)) return false;
    if (state.frameworks.length) {
      const present = Object.entries(c.framework_mappings)
        .filter(([, v]) => v && (v as string[]).length > 0)
        .map(([k]) => k);
      if (!state.frameworks.some((f) => present.includes(f))) return false;
    }
    return true;
  });
}
