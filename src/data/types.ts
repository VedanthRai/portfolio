export type ProjectCategory = 'AI' | 'SYS' | 'SW';

export interface ProjectScreenshot {
  src: string;   // path relative to site root (public/)
  alt: string;   // accessible description
  caption?: string; // optional short caption shown to sighted users
  role: 'hero' | 'secondary'; // hero = featured, secondary = supporting detail
}

export interface Project {
  id: string;
  name: string;
  category: ProjectCategory;
  summary: string;
  why: string;
  built: string;
  /** Ordered pipeline stages, rendered as the architecture visual. */
  architecture: string[];
  tech: string[];
  contribution: string;
  results: string[];
  /** Public repository URL, or null when none was supplied. */
  repo: string | null;
  /** Real screenshots from the project. Optional; no fabrication. */
  screenshots?: ProjectScreenshot[];
}

export interface Profile {
  name: string;
  title: string;
  tagline: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  /** Path relative to the site root (public/). */
  resume: string;
  education: { school: string; degree: string; period: string };
  summary: string;
  interests: string[];
  timeline: { when: string; text: string }[];
}

export interface Experience {
  role: string;
  org: string;
  period: string | null;
  bullets: string[];
  note?: string;
}

export interface Achievement { rank: string; title: string }
export interface Skill { name: string; usedIn: string[] }
export interface SkillGroup { name: string; skills: Skill[] }
export interface Failure { problem: string; cause: string; change: string; lesson: string | null; source: string }
export interface LabColumn { title: string; items: string[] }
export interface NavigationNode { key: string; label: string; x: number; y: number }

export type ExperimentId = 'swarm' | 'code' | 'risk' | 'agents' | 'models' | 'failures';

export interface Experiment {
  id: ExperimentId;
  title: string;
  shortTitle: string;
  description: string;
  details: string[];
}
