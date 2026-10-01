import { achievements } from '../data/achievements';
import { experience } from '../data/experience';
import { projects } from '../data/projects';
import { profile } from '../data/profile';
import type { ProjectCategory } from '../data/types';
import { $, go, asset } from '../utils/dom';

/**
 * DRACO is a deterministic navigator. Every answer is assembled from the
 * structured data files; there is no model and nothing is generated.
 */
interface Question { label: string; run: () => string }

const byCategory = (c: ProjectCategory) => projects.filter((p) => p.category === c);
const names = (list: { name: string }[]) => list.map((p) => p.name).join(', ');

const questions: Question[] = [
  { label: 'Show me AI projects', run: () => { go('projects/AI'); return `AI projects: ${names(byCategory('AI'))}.`; } },
  { label: 'Show me systems projects', run: () => { go('projects/SYS'); return `Systems projects: ${names(byCategory('SYS'))}.`; } },
  { label: 'Show me software projects', run: () => { go('projects/SW'); return `Software projects: ${names(byCategory('SW'))}.`; } },
  { label: 'Show me CodeOracle', run: () => { go('project/codeoracle/Overview'); return 'CodeOracle: a multi-agent RAG system that explains Git repositories.'; } },
  { label: 'Show me AgroShield', run: () => { go('project/agroshield/Overview'); return 'AgroShield: geopolitical news → risk forecasts and advisories for Indian agricultural trade.'; } },
  { label: 'Show me CSR', run: () => { go('project/csr/Overview'); return 'Cognitive Swarm Resilience: 20-drone swarm trained with adversarial MARL to resist GPS denial.'; } },
  { label: 'Show me Drishti', run: () => { go('project/drishti/Overview'); return 'Drishti: multi-agent trade risk intelligence with anomaly detection and a Streamlit dashboard.'; } },
  { label: 'Show me Docksmith', run: () => { go('project/docksmith/Overview'); return 'Docksmith: a daemonless container engine written from scratch in Python.'; } },
  { label: 'Show me experience', run: () => { go('experience'); return experience.map((e) => `${e.role}, ${e.org}${e.period ? ` (${e.period})` : ''}`).join('. ') + '.'; } },
  { label: 'Show me achievements', run: () => { go('achievements'); return achievements.map((a) => `${a.rank}, ${a.title}`).join('. ') + '.'; } },
  { label: 'Open recruiter mode', run: () => { go('recruiter'); return 'Recruiter mode is open.'; } },
  { label: 'Contact Vedanth', run: () => { go('contact'); return `Email: ${profile.email} · LinkedIn: ${profile.linkedin}`; } },
  { label: 'Open resume', run: () => { window.open(asset(profile.resume), '_blank', 'noopener'); return 'Resume opened in a new tab.'; } },
];

export function initDraco(): void {
  const box = $('#dbox');
  const button = $('#dbtn');
  const answer = $('#dans');
  const list = $('#dq');

  questions.forEach((q) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    b.textContent = q.label;
    b.onclick = () => { answer.textContent = q.run(); };
    list.appendChild(b);
  });

  const select = document.createElement('select');
  select.className = 'chip';
  select.setAttribute('aria-label', 'How does a project work?');
  select.style.background = '#000';
  select.style.color = 'inherit';
  select.innerHTML = '<option value="">How does … work?</option>' + projects.map((p) => `<option value="${p.id}">${p.name}</option>`).join('');
  select.onchange = () => {
    const p = projects.find((x) => x.id === select.value);
    if (!p) return;
    answer.textContent = `${p.summary} Flow: ${p.architecture.join(' → ')}.`;
    go(`project/${p.id}/Architecture`);
    select.value = '';
  };
  list.appendChild(select);

  button.onclick = () => {
    const open = box.classList.toggle('on');
    button.setAttribute('aria-expanded', String(open));
  };
}
