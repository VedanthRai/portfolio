import { navigation } from '../data/navigation';
import { profile } from '../data/profile';
import { $, go } from '../utils/dom';
import { sound } from '../utils/sound';
import { openScanModal } from './SystemScan';
import { openUniverseMap } from './UniverseMap';

/** Builds the V/CORE ring nodes, the header nav, the sound toggle and the recruiter toggle. */
export function initHeader(): void {
  const ring = $('#ring');
  const nav = $('#nav');
  navigation.forEach((n) => {
    const node = document.createElement('button');
    node.type = 'button';
    node.className = 'nd';
    node.innerHTML = `<span>${n.label}</span>`;
    node.style.left = `${n.x}%`;
    node.style.top = `${n.y}%`;
    node.dataset.route = n.key;
    ring.appendChild(node);

    const link = document.createElement('button');
    link.type = 'button';
    link.className = 'm';
    link.textContent = n.label;
    link.dataset.route = n.key;
    nav.appendChild(link);
  });
  $('#vc').dataset.route = 'about';
  $('#who').innerHTML = `<h2>${profile.name.toUpperCase()}</h2><p class="m">${profile.tagline}</p><button id="scan-trigger-btn" class="scan-btn" type="button">[ INITIATE SYSTEM SCAN ]</button>`;
  
  const scanBtn = $('#scan-trigger-btn');
  if (scanBtn) {
    scanBtn.onclick = () => openScanModal();
  }

  const mapBtn = $('#mapbtn');
  if (mapBtn) {
    mapBtn.onclick = () => openUniverseMap();
  }

  const snd = $('#snd');
  snd.textContent = sound.enabled ? 'SOUND ON' : 'SOUND OFF';
  snd.setAttribute('aria-pressed', String(sound.enabled));
  snd.onclick = () => {
    const on = sound.toggle();
    snd.textContent = on ? 'SOUND ON' : 'SOUND OFF';
    snd.setAttribute('aria-pressed', String(on));
  };
  $('#recbtn').onclick = () => go(document.body.classList.contains('rec') ? '' : 'recruiter');
}
