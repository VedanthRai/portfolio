import { go } from '../utils/dom';
import { sound } from '../utils/sound';

export function initUniverseMap(): void {
  let modal = document.getElementById('map-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'map-modal';
    modal.innerHTML = `
      <div class="map-container">
        <div class="map-topbar">
          <span class="m">⌘ UNIVERSE MAP &mdash; VEDANTH.OS ORBITAL NAVIGATION</span>
          <button class="map-close-btn" id="map-close">[ CLOSE (ESC) ]</button>
        </div>
        
        <div class="map-body">
          <div class="map-grid-bg"></div>
          
          <div class="map-diagram">
            <!-- Top Sector -->
            <div class="map-row row-top">
              <button class="map-node node-sector" data-dest="lab" data-info="EXPERIMENTAL SYSTEMS & AUDITS">
                <span class="node-dot">●</span>
                <span class="node-label">LAB</span>
              </button>
            </div>
            
            <div class="map-line vertical-line"></div>

            <!-- Core Equatorial Orbit -->
            <div class="map-row row-equator">
              <button class="map-node node-project" data-dest="project/csr/Overview" data-info="COGNITIVE SWARM RESILIENCE · 20-DRONE SWARM MARL">
                <span class="node-label">CSR</span>
                <span class="node-dot">●</span>
              </button>
              
              <div class="map-line horizontal-line"></div>
              
              <button class="map-node node-core" data-dest="" data-info="V/CORE · CENTRAL HUB & SYSTEM DIAGNOSTICS">
                <span class="node-dot core-dot">◆</span>
                <span class="node-label core-label">V/CORE</span>
              </button>
              
              <div class="map-line horizontal-line"></div>
              
              <button class="map-node node-project" data-dest="project/codeoracle/Overview" data-info="CODEORACLE · MULTI-AGENT GIT REPOSITORY ASSISTANT">
                <span class="node-dot">●</span>
                <span class="node-label">CODEORACLE</span>
              </button>
            </div>

            <div class="map-line vertical-line"></div>

            <!-- Inner Orbits -->
            <div class="map-row row-inner">
              <button class="map-node node-project" data-dest="project/docksmith/Overview" data-info="DOCKSMITH · DAEMONLESS CONTAINER ENGINE IN PYTHON">
                <span class="node-label">DOCKSMITH</span>
                <span class="node-dot">●</span>
              </button>
              
              <button class="map-node node-project" data-dest="project/agroshield/Overview" data-info="AGROSHIELD · GEOPOLITICAL RISK & AGRI ADVISORY">
                <span class="node-dot">●</span>
                <span class="node-label">AGROSHIELD</span>
              </button>

              <button class="map-node node-project" data-dest="project/skillbarter/Overview" data-info="SKILLBARTER · P2P SKILL EXCHANGE WITH ESCROW">
                <span class="node-dot">●</span>
                <span class="node-label">SKILLBARTER</span>
              </button>
            </div>

            <div class="map-line vertical-line"></div>

            <!-- Outer Orbits -->
            <div class="map-row row-outer">
              <button class="map-node node-project" data-dest="project/drishti/Overview" data-info="DRISHTI · LIVE TRADE & ANOMALY PLAYBOOKS">
                <span class="node-dot">●</span>
                <span class="node-label">DRISHTI</span>
              </button>

              <button class="map-node node-project" data-dest="project/robot/Overview" data-info="LINE FOLLOWING ROBOT · BARE-METAL C++ EMBEDDED">
                <span class="node-dot">●</span>
                <span class="node-label">ROBOT</span>
              </button>
            </div>

            <div class="map-divider"></div>

            <!-- Lower Sectors -->
            <div class="map-row row-sectors">
              <button class="map-node node-sector" data-dest="experience" data-info="EXPERIENCE · CELLSTRAT AI INTERNSHIP & DASHBOARDS">
                <span class="node-label">EXPERIENCE</span>
              </button>
              <span class="sector-sep">───</span>
              <button class="map-node node-sector" data-dest="skills" data-info="SKILLS · AI/ML, SYSTEMS, SOFTWARE & FOUNDATIONS">
                <span class="node-label">SKILLS</span>
              </button>
              <span class="sector-sep">───</span>
              <button class="map-node node-sector" data-dest="about" data-info="ABOUT · PROFILE, TIMELINE & INTERESTS">
                <span class="node-label">ABOUT</span>
              </button>
              <span class="sector-sep">───</span>
              <button class="map-node node-sector" data-dest="contact" data-info="CONTACT · DIRECT COMMUNICATIONS & RESUME">
                <span class="node-label">CONTACT</span>
              </button>
            </div>
          </div>
        </div>

        <div class="map-footer">
          <span class="m map-info-text" id="map-info">HOVER OVER A NODE TO INSPECT ORBITAL PATH</span>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('#map-close');
    closeBtn?.addEventListener('click', closeUniverseMap);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeUniverseMap();
    });

    // Node interactions
    const infoText = modal.querySelector('#map-info');
    const nodes = modal.querySelectorAll<HTMLElement>('.map-node');

    nodes.forEach(node => {
      node.addEventListener('mouseenter', () => {
        const info = node.dataset.info || '';
        if (infoText) infoText.textContent = info;
        if (sound.enabled) sound.beep(1200, 0.02);
      });

      node.addEventListener('mouseleave', () => {
        if (infoText) infoText.textContent = 'HOVER OVER A NODE TO INSPECT ORBITAL PATH';
      });

      node.addEventListener('click', () => {
        const dest = node.dataset.dest ?? '';
        
        // Trigger Rocket Launch Animation
        if ((window as any).triggerProjectJump) {
          (window as any).triggerProjectJump();
        } else if ((window as any).triggerWormhole) {
          (window as any).triggerWormhole();
        }

        if (sound.enabled) sound.beep(600, 0.1);
        
        closeUniverseMap();
        setTimeout(() => go(dest), 150);
      });
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal?.classList.contains('show')) {
        closeUniverseMap();
      }
    });
  }
}

export function openUniverseMap(): void {
  initUniverseMap();
  const modal = document.getElementById('map-modal');
  if (modal) {
    modal.classList.add('show');
    if (sound.enabled) sound.beep(900, 0.08);
  }
}

export function closeUniverseMap(): void {
  const modal = document.getElementById('map-modal');
  if (modal) {
    modal.classList.remove('show');
  }
}
