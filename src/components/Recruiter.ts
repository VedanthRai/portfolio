import { achievements } from '../data/achievements';
import { experience } from '../data/experience';
import { profile } from '../data/profile';
import { projects } from '../data/projects';
import { skillGroups } from '../data/skills';
import { externalLink, resumeLink } from '../sections/shared';
import { $ } from '../utils/dom';

const panel = $('#rec');
const button = $('#recbtn');
const shell = ['#stage', '#core', 'header', '#who', '#draco'].map((s) => $(s));

function markup(): string {
  const projectHtml = projects
    .map((p) => `<article><h3 style="margin:0;color:var(--fg)">${p.name} <span class="m">${p.tech.slice(0, 4).join(', ')}</span></h3><p>${p.summary}</p><p class="m">${p.results[0] ?? ''}${p.repo ? ` · ${externalLink(p.repo, 'repo')}` : ''}</p></article>`)
    .join('');
  const exp = experience.map((e) => `<p><b>${e.role}, ${e.org}</b>${e.period ? ` (${e.period})` : ''}${e.bullets.length ? `: ${e.bullets.join(' ')}` : ''}${e.note ? ` <span class="m">${e.note}</span>` : ''}</p>`).join('');
  const skills = skillGroups.map((g) => `<p><b>${g.name}:</b> ${g.skills.map((s) => s.name).join(' · ')}</p>`).join('');
  return `<div class="wrap">
    <button class="m" type="button" data-route="" style="border:1px solid var(--line);padding:.3rem .8rem;float:right">EXIT RECRUITER MODE</button>
    <h1 id="rec-h" tabindex="-1">${profile.name.toUpperCase()}</h1>
    <p class="m">${profile.title} · ${profile.location} · <a href="mailto:${profile.email}">${profile.email}</a> · ${externalLink(profile.linkedin, 'LinkedIn')} · ${externalLink(profile.github, 'GitHub')} · ${resumeLink('Resume (PDF)')}</p>
    <p>${profile.education.degree}, ${profile.education.school} (${profile.education.period}). ${profile.tagline}</p>
    <article><h3 style="margin:0">Achievements</h3><p>${achievements.map((a) => `${a.rank}, ${a.title}`).join(' · ')}</p></article>
    <article><h3 style="margin:0">Experience</h3>${exp}</article>
    ${projectHtml}
    <article><h3 style="margin:0">Skills</h3>${skills}</article>
  </div>`;
}

panel.innerHTML = markup();

/** Toggle the fast, text-first view. The 3D scene is skipped while it is on. */
export function setRecruiterMode(on: boolean): void {
  document.body.classList.toggle('rec', on);
  shell.forEach((el) => (on ? el.setAttribute('aria-hidden', 'true') : el.removeAttribute('aria-hidden')));
  button.textContent = on ? 'EXIT RECRUITER MODE' : 'RECRUITER MODE';
  if (on) $('#rec-h').focus({ preventScroll: true });
}
