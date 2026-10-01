import { skillGroups } from '../data/skills';
import type { View } from './view';

export function skillsView(): View {
  const groups = skillGroups
    .map((g) => `<h3>${g.name}</h3>${g.skills.map((s) => `<button class="chip" type="button" data-skill="${g.name}|${s.name}" aria-pressed="false">${s.name}</button>`).join('')}`)
    .join('');
  return {
    title: 'Skills',
    html: `<h2 class="h">Developer DNA</h2><p class="m">Select a capability to see where it was used. No ratings, by design.</p>${groups}<p id="su" class="m" style="margin-top:1rem" aria-live="polite"></p>`,
    mount(root) {
      const chips = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-skill]'));
      chips.forEach((b) => {
        b.onclick = () => {
          const [g, s] = (b.dataset.skill ?? '').split('|');
          const skill = skillGroups.find((x) => x.name === g)?.skills.find((x) => x.name === s);
          chips.forEach((c) => c.setAttribute('aria-pressed', String(c === b)));
          (root.querySelector('#su') as HTMLElement).textContent = skill ? `${skill.name} — used in: ${skill.usedIn.join(', ')}` : '';
        };
      });
    },
  };
}
