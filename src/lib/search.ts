import Fuse from 'fuse.js';
import type { Control } from '../content/config';

export function buildSearchIndex(controls: Control[]) {
  return new Fuse(controls, {
    keys: [
      { name: 'id', weight: 0.4 },
      { name: 'title', weight: 0.4 },
      { name: 'objective', weight: 0.2 },
      { name: 'category', weight: 0.15 },
      { name: 'control_narrative', weight: 0.1 },
    ],
    threshold: 0.35,
    ignoreLocation: true,
    includeScore: true,
    minMatchCharLength: 2,
  });
}

export function searchControls(controls: Control[], query: string): Control[] {
  if (!query.trim()) return controls;
  const fuse = buildSearchIndex(controls);
  return fuse.search(query).map((r) => r.item);
}
