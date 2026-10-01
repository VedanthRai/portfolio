import type { NavigationNode } from './types';

/** x / y are percentages inside the V/CORE ring. Order = header order. */
export const navigation: NavigationNode[] = [
  { key: 'projects', label: 'PROJECTS', x: 50, y: 8 },
  { key: 'experience', label: 'EXPERIENCE', x: 84, y: 32 },
  { key: 'skills', label: 'SKILLS', x: 16, y: 32 },
  { key: 'about', label: 'ABOUT', x: 16, y: 72 },
  { key: 'lab', label: 'LAB', x: 84, y: 72 },
  { key: 'achievements', label: 'ACHIEVEMENTS', x: 32, y: 92 },
  { key: 'contact', label: 'CONTACT', x: 68, y: 92 },
];
