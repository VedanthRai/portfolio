import { projects } from '../data/projects';
import type { Project, ProjectCategory } from '../data/types';
import { mountArchitecture } from '../scenes/architecture';
import { asset } from '../utils/dom';
import { externalLink } from './shared';
import type { View } from './view';

const CATEGORY_LABEL: Record<ProjectCategory, string> = { AI: 'AI', SYS: 'Systems', SW: 'Software' };
export const TABS = ['Overview', 'Architecture', 'Evidence', 'Technical', 'Results'] as const;
export type Tab = (typeof TABS)[number];

export const findProject = (id: string | undefined): Project | undefined => projects.find((p) => p.id === id);

export function projectList(filter?: string): View {
  const cat = (['AI', 'SYS', 'SW'] as const).find((c) => c === filter);
  const shown = cat ? projects.filter((p) => p.category === cat) : projects;
  const chips = [['', 'All'], ...(['AI', 'SYS', 'SW'] as const).map((c) => [c, CATEGORY_LABEL[c]])]
    .map(([c, l]) => `<button class="chip" type="button" data-route="projects${c ? '/' + c : ''}" aria-pressed="${(cat ?? '') === c}">${l}</button>`)
    .join('');
  const items = shown
    .map((p) => {
      const hero = p.screenshots?.find((s) => s.role === 'hero');
      const thumb = hero ? `<div class="proj-thumb" aria-hidden="true"><img src="${asset(hero.src)}" alt="" loading="lazy" /></div>` : '';
      return `<button type="button" data-route="project/${p.id}/Overview">${thumb}<span class="m">${CATEGORY_LABEL[p.category]}</span><h3 style="color:var(--fg)">${p.name}</h3><span>${p.summary}</span></button>`;
    })
    .join('');
  return { title: 'Projects', html: `<h2 class="h">Projects</h2><p class="m">${projects.length} systems, taken from repository audits.</p><div>${chips}</div><div class="grid">${items}</div>` };
}

export function projectDetail(id: string | undefined, tabArg?: string): View {
  const p = findProject(id);
  if (!p) return projectList();

  // Filter out Evidence tab when no screenshots exist
  const availTabs = p.screenshots?.length ? TABS : TABS.filter((t) => t !== 'Evidence') as readonly string[];
  const tab: Tab = (availTabs.includes(tabArg as Tab) ? tabArg : 'Overview') as Tab;

  const screenshotsHtml = (): string => {
    if (!p.screenshots?.length) return '<p class="m tag">No screenshots available for this project.</p>';
    const hero = p.screenshots.filter((s) => s.role === 'hero');
    const secondary = p.screenshots.filter((s) => s.role === 'secondary');
    const renderShot = (s: typeof p.screenshots[0], large = false) =>
      `<figure class="${large ? 'shot-hero' : 'shot-sec'}"><img src="${asset(s.src)}" alt="${s.alt}" loading="lazy" />${s.caption ? `<figcaption class="m">${s.caption}</figcaption>` : ''}</figure>`;
    return `<div class="shots-wrap">
      ${hero.map((s) => renderShot(s, true)).join('')}
      ${secondary.length ? `<div class="shots-grid">${secondary.map((s) => renderShot(s, false)).join('')}</div>` : ''}
    </div><p class="m" style="margin-top:.8rem">Genuine screenshots from the real project. Not simulated. Not AI-generated.</p>`;
  };

  const body: Record<Tab, string> = {
    Overview: `<div class="proj-overview">${
      p.screenshots?.find((s) => s.role === 'hero')
        ? `<div class="proj-hero-frame"><img src="${asset(p.screenshots.find((s) => s.role === 'hero')!.src)}" alt="${p.screenshots.find((s) => s.role === 'hero')!.alt}" loading="eager" /></div>`
        : ''
    }<div class="proj-text"><h3>Why it exists</h3><p>${p.why}</p><h3>What the project is</h3><p>${p.built}</p></div></div>`,
    Architecture: `<canvas class="w" id="cv" role="img" aria-label="Diagram of ${p.name} pipeline: ${p.architecture.join(', ')}"></canvas>${p.id === 'csr' ? '<div id="ctl" style="margin:.8rem 0"></div>' : ''}<p class="m">Portfolio visualisation of the documented architecture, not project output.</p><p>${p.architecture.join(' → ')}</p>`,
    Evidence: screenshotsHtml(),
    Technical: `<h3>Technology</h3>${p.tech.map((t) => `<span class="chip">${t}</span>`).join('')}<h3>My contribution</h3><p>${p.contribution}</p>`,
    Results: `<h3>Result and honest limits</h3><ul>${p.results.map((r) => `<li>${r}</li>`).join('')}</ul>${p.repo ? `<p>${externalLink(p.repo, 'GitHub repository')}</p>` : '<p class="m">No repository link supplied for this project.</p>'}`,
  };

  const tabs = availTabs.map((t) => `<button type="button" role="tab" data-route="project/${p.id}/${t}" aria-selected="${t === tab}">${t}</button>`).join('');
  return {
    title: p.name,
    html: `<button class="m" type="button" data-route="projects">← ALL PROJECTS</button><h2 class="h">${p.name}</h2><p style="font-size:1.15rem">${p.summary}</p><div class="tabs" role="tablist">${tabs}</div>${body[tab as Tab]}`,
    mount: tab === 'Architecture' ? (root) => mountArchitecture(root.querySelector('#cv') as HTMLCanvasElement, p, root.querySelector('#ctl')) : undefined,
  };
}
