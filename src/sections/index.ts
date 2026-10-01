import { achievementsView, aboutView, contactView, experienceView, labView } from './pages';
import { projectDetail, projectList, TABS } from './projects';
import { skillsView } from './skills';
import type { View } from './view';

import { anomalyView } from './anomaly';

/** Route key -> view factory. Keys must match data/navigation.ts. */
export const sectionViews: Record<string, (arg?: string) => View> = {
  projects: projectList,
  experience: experienceView,
  skills: skillsView,
  about: aboutView,
  lab: labView,
  achievements: achievementsView,
  contact: contactView,
  anomaly: anomalyView,
};
export { projectDetail, TABS };
export type { View };
