import { achievements } from '../data/achievements';
import { experience } from '../data/experience';
import { failures, experiments } from '../data/lab';
import { profile } from '../data/profile';
import { externalLink, resumeLink } from './shared';
import { mountLab } from '../scenes/labScene';
import type { View } from './view';

export const experienceView = (): View => ({
  title: 'Experience',
  html: `<h2 class="h">Experience</h2><div class="grid" style="grid-template-columns:1fr">${experience
    .map((e) => `<div>${e.period ? `<span class="m">${e.period}</span>` : ''}<h3 style="color:var(--fg);margin:.2em 0">${e.role}, ${e.org}</h3>${e.bullets.length ? `<ul>${e.bullets.map((b) => `<li>${b}</li>`).join('')}</ul>` : ''}${e.note ? `<p class="m">${e.note}</p>` : ''}</div>`)
    .join('')}</div>`,
});

export const aboutView = (): View => ({
  title: 'About',
  html: `<h2 class="h">Who is Vedanth?</h2><p>${profile.summary}</p><h3>Timeline</h3><div class="grid" style="grid-template-columns:1fr">${profile.timeline.map((t) => `<div><span class="m">${t.when}</span> ${t.text}</div>`).join('')}</div><h3>Interests</h3>${profile.interests.map((x) => `<span class="chip">${x}</span>`).join('')}`,
});

export const labView = (id?: string): View => {
  const exp = experiments.find(e => e.id === id) || experiments[0];
  
  const failuresHtml = failures.map(f => 
    `<div style="margin-bottom:1.5rem;border-left:2px solid var(--warn);padding-left:1rem">
      <h4 style="margin:0 0 .3em;color:var(--warn)">FAILURE</h4><p class="m" style="margin:0 0 .8em">${f.problem}</p>
      <h4 style="margin:0 0 .3em;color:var(--ac)">CAUSE</h4><p class="m" style="margin:0 0 .8em">${f.cause}</p>
      <h4 style="margin:0 0 .3em;color:var(--fg)">CHANGE</h4><p class="m" style="margin:0 0 .8em">${f.change}</p>
      <span class="m" style="opacity:0.6">SOURCE: ${f.source} audit</span>
    </div>`
  ).join('');

  return {
    title: 'The Lab',
    html: `
      <h2 class="h">V/CORE LAB</h2>
      <p class="m" style="margin-bottom:2rem">EXPERIMENTAL SYSTEMS<br>Experiments, simulations, technical explorations and failure analysis.</p>
      
      <div class="lab-main">
        <div class="lab-visual">
          <div class="lab-status"><span class="m" style="font-size:10px">STATUS: ACTIVE &nbsp;|&nbsp; EXPERIMENTS: 06 &nbsp;|&nbsp; SYSTEMS: SWARM / CODE / RISK / AGENTS</span></div>
          ${exp.id === 'failures' 
            ? `<div class="lab-failures" style="padding:1.5rem;height:320px;overflow-y:auto">${failuresHtml}</div>` 
            : `<canvas id="lab-cv" class="w" style="height:320px;border:0;border-bottom:1px solid var(--line);background:#000"></canvas>
               <p class="m" style="padding:0.5rem 1rem;text-align:center;font-size:10px">Portfolio visualization of the system architecture.</p>`
          }
        </div>
        <div class="lab-info">
          <h3 style="margin-top:0;color:var(--fg)">${exp.id.toUpperCase()} &mdash; ${exp.title}</h3>
          <p>${exp.description}</p>
          <ul class="m" style="margin-top:1rem;padding-left:1rem">${exp.details.map(d => `<li style="margin-bottom:0.5rem">${d}</li>`).join('')}</ul>
        </div>
      </div>
      
      <div class="lab-nav">
        ${experiments.map((e, i) => `
          <button type="button" class="lab-nav-btn" data-route="lab/${e.id}" aria-selected="${e.id === exp.id}">
            <span class="m" style="font-size:10px;color:inherit">EXP_00${i+1}</span><br>
            <span style="font-size:0.9rem">${e.shortTitle}</span>
          </button>
        `).join('')}
      </div>
    `,
    mount: exp.id !== 'failures' ? (root) => mountLab(root.querySelector('#lab-cv') as HTMLCanvasElement, exp.id) : undefined
  };
};

export const achievementsView = (): View => ({
  title: 'Achievements',
  html: `<h2 class="h">Achievements</h2><div class="grid">${achievements.map((a) => `<div><span class="m">${a.rank}</span><h3 style="color:var(--fg);margin:.2em 0">${a.title}</h3></div>`).join('')}</div>`,
});

export const contactView = (): View => ({
  title: 'Contact',
  html: `<h2 class="h" style="font-size:clamp(2rem,7vw,4.5rem)">Let’s build something.</h2><p style="font-size:1.4rem;font-weight:200">${profile.name}</p><p><a href="mailto:${profile.email}">${profile.email}</a></p><p>${externalLink(profile.linkedin, 'LinkedIn')} · ${externalLink(profile.github, 'GitHub')}</p><p>${resumeLink()}</p>`,
});
