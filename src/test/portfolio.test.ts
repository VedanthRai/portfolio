import { describe, expect, it } from 'vitest';
import { achievements } from '../data/achievements';
import { navigation } from '../data/navigation';
import { profile } from '../data/profile';
import { experience } from '../data/experience';
import { failures, experiments } from '../data/lab';
import { projects } from '../data/projects';
import { skillGroups } from '../data/skills';
import { projectDetail, sectionViews, TABS } from '../sections';
import { projectList } from '../sections/projects';

describe('data integrity', () => {
  it('projects have required fields and https repos', () => {
    for (const p of projects) {
      expect(p.summary.length).toBeGreaterThan(10);
      expect(p.architecture.length).toBeGreaterThan(1);
      expect(p.results.length).toBeGreaterThan(0);
      if (p.repo) expect(p.repo.startsWith('https://github.com/VedanthRai/')).toBe(true);
    }
    expect(new Set(projects.map((p) => p.id)).size).toBe(projects.length);
  });
  it('profile links are real', () => {
    expect(profile.linkedin).toContain('linkedin.com/in/');
    expect(profile.github).toBe('https://github.com/VedanthRai');
    expect(profile.email).toContain('@');
  });
  it('has achievements and skills', () => {
    expect(achievements).toHaveLength(3);
    expect(skillGroups.length).toBeGreaterThan(0);
  });
});

describe('routing views', () => {
  it('every nav node has a view', () => {
    for (const n of navigation) expect(sectionViews[n.key]?.().html.length).toBeGreaterThan(20);
  });
  it('every project renders every tab', () => {
    for (const p of projects) for (const t of TABS) expect(projectDetail(p.id, t).html).toContain(p.name);
  });
  it('filters projects by category', () => {
    const ai = projects.filter((p) => p.category === 'AI').length;
    expect((projectList('AI').html.match(/data-route="project\//g) ?? []).length).toBe(ai);
  });
  it('unknown project falls back to the list', () => {
    expect(projectDetail('nope').title).toBe('Projects');
  });
});

describe('content audit guards', () => {
  const APPROVED_REPOS = new Set([
    'https://github.com/VedanthRai/Codebase',
    'https://github.com/VedanthRai/Agroshield',
    'https://github.com/VedanthRai/Cognitive-Swarm-Resilience',
    'https://github.com/VedanthRai/Drishti',
    'https://github.com/VedanthRai/DockSmith',
    'https://github.com/VedanthRai/SkillBarter',
    'https://github.com/VedanthRai/Robotics',
  ]);
  const everything = JSON.stringify({ profile, projects, experience, achievements, skillGroups, failures, experiments });

  it('every project repo is on the approved list, and every approved repo is used', () => {
    const repos = projects.map((p) => p.repo);
    for (const r of repos) expect(r && APPROVED_REPOS.has(r)).toBe(true);
    expect(new Set(repos).size).toBe(APPROVED_REPOS.size);
  });
  it('does not expose a phone number or local file paths', () => {
    expect(everything).not.toMatch(/\+?\d[\d\s-]{8,}\d/);
    expect(everything).not.toMatch(/c:\\|\/Users\/|OneDrive/i);
  });
  it('contains no audit meta-text or invented lessons', () => {
    expect(everything).not.toMatch(/not stated in the material|source material/i);
    for (const f of failures) expect(f.lesson).toBeNull();
  });
  it('metrics from simulation are labelled as simulation', () => {
    const csr = projects.find((p) => p.id === 'csr')!;
    expect(csr.results.slice(0, 3).every((r) => r.startsWith('In simulation'))).toBe(true);
  });
  it('experience bullets stay within the resume', () => {
    expect(experience[0].org).toBe('CellStrat');
    expect(experience[0].bullets).toHaveLength(3);
  });
  it('uses no unsupported ChromaDB/Ollama project claims', () => {
    for (const p of projects) expect(p.tech.join(' ')).not.toMatch(/chroma|ollama/i);
  });
});
