import { projects } from '../data/projects';
import { experience } from '../data/experience';
import { experiments } from '../data/lab';
import { sound } from '../utils/sound';

export function calculateScanMetrics() {
  const projectsCount = projects.length;
  const expCount = experience.length;
  const labCount = experiments.length;

  // Derive scores from actual portfolio dataset
  const aiProjects = projects.filter(p => p.category === 'AI' || p.tech.some(t => /AI|ML|PyTorch|XGBoost|LLM/i.test(t))).length;
  const aiBlocks = Math.min(10, Math.max(1, Math.round((aiProjects / projectsCount) * 10 + 4)));

  const agentProjects = projects.filter(p => /agent|swarm/i.test(p.summary + p.built + p.name)).length;
  const agentBlocks = Math.min(10, Math.max(1, Math.round((agentProjects / projectsCount) * 10 + 3)));

  const swProjects = projects.filter(p => p.tech.length > 0).length;
  const swBlocks = Math.min(10, Math.max(1, Math.round((swProjects / projectsCount) * 10)));

  const sysProjects = projects.filter(p => p.category === 'SYS' || p.tech.some(t => /Linux|Docker|UDP|Embedded|C\+\+|Spring|AWS/i.test(t))).length;
  const sysBlocks = Math.min(10, Math.max(1, Math.round((sysProjects / projectsCount) * 10 + 2)));

  const dataProjects = projects.filter(p => p.tech.some(t => /Pandas|TF-IDF|RRF|SQL|XGBoost|scikit/i.test(t)) || p.built.includes('data')).length;
  const dataBlocks = Math.min(10, Math.max(1, Math.round((dataProjects / projectsCount) * 10 + 1)));

  const rlProjects = projects.filter(p => /RL|PPO|Reinforcement|self-play/i.test(p.built + p.summary + p.tech.join(' '))).length;
  const rlBlocks = Math.min(10, Math.max(1, Math.round((rlProjects / projectsCount) * 10 + 5)));

  const padNum = (n: number) => String(n).padStart(2, '0');

  return {
    projectsFound: padNum(projectsCount),
    experiencesFound: padNum(expCount),
    experimentsFound: padNum(labCount),
    skills: [
      { label: 'AI / ML', blocks: aiBlocks },
      { label: 'MULTI-AGENTS', blocks: agentBlocks },
      { label: 'SOFTWARE', blocks: swBlocks },
      { label: 'SYSTEMS', blocks: sysBlocks },
      { label: 'DATA', blocks: dataBlocks },
      { label: 'REINFORCEMENT', blocks: rlBlocks }
    ]
  };
}

function playScanBeep(freq = 880, duration = 0.04) {
  if (!sound.enabled) return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Audio context fallback
  }
}

let scanTimeout: number | undefined;

export function initSystemScan() {
  let modal = document.getElementById('scan-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'scan-modal';
    modal.innerHTML = `
      <div class="scan-container">
        <div class="scan-topbar">
          <span>V/CORE DIAGNOSTIC SYSTEM</span>
          <button class="scan-close-btn" id="scan-close">[ CLOSE (ESC) ]</button>
        </div>
        <div class="scan-body">
          <div class="scan-progress-bar">
            <div class="scan-progress-fill" id="scan-fill"></div>
          </div>
          <pre class="scan-output" id="scan-output"></pre>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('#scan-close');
    closeBtn?.addEventListener('click', closeScanModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeScanModal();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal?.classList.contains('show')) {
        closeScanModal();
      }
    });
  }
}

export function openScanModal() {
  initSystemScan();
  const modal = document.getElementById('scan-modal');
  const output = document.getElementById('scan-output');
  const fill = document.getElementById('scan-fill') as HTMLElement;

  if (!modal || !output || !fill) return;

  modal.classList.add('show');
  output.textContent = '';
  fill.style.width = '0%';

  if ((window as any).triggerSystemScan) {
    (window as any).triggerSystemScan();
  }

  const metrics = calculateScanMetrics();

  const lines = [
    'SCANNING SYSTEM...',
    '',
    ...metrics.skills.map(s => `${s.label.padEnd(20, ' ')}${'█'.repeat(s.blocks)}`),
    '',
    `PROJECTS FOUND: ${metrics.projectsFound}`,
    `EXPERIENCES FOUND: ${metrics.experiencesFound}`,
    `EXPERIMENTS FOUND: ${metrics.experimentsFound}`,
    '',
    '[ SCAN COMPLETE — V/CORE NOMINAL ]'
  ];

  let currentLineIndex = 0;
  let progress = 0;

  if (scanTimeout) clearInterval(scanTimeout);

  const totalLines = lines.length;
  const intervalTime = 120; // ms per line

  scanTimeout = window.setInterval(() => {
    if (currentLineIndex < totalLines) {
      const lineText = lines[currentLineIndex];
      output.textContent += (currentLineIndex > 0 ? '\n' : '') + lineText;
      
      if (lineText.trim().length > 0) {
        playScanBeep(700 + currentLineIndex * 40);
      }

      progress = Math.min(100, Math.round(((currentLineIndex + 1) / totalLines) * 100));
      fill.style.width = `${progress}%`;

      currentLineIndex++;
    } else {
      clearInterval(scanTimeout);
      playScanBeep(1200, 0.1);
    }
  }, intervalTime);
}

export function closeScanModal() {
  const modal = document.getElementById('scan-modal');
  if (modal) {
    modal.classList.remove('show');
  }
  if (scanTimeout) {
    clearInterval(scanTimeout);
  }
}
