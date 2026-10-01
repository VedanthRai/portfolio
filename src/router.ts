import { overlay } from './components/Overlay';
import { setRecruiterMode } from './components/Recruiter';
import { projectDetail, sectionViews } from './sections';

/**
 * Hash routes (shareable, back-button friendly):
 *   #projects  #projects/AI  #project/<id>/<Tab>  #skills ...  #recruiter  (empty = home)
 */
function apply(): void {
  const [route, a, b] = decodeURIComponent(location.hash.slice(1)).split('/');
  const recruiter = route === 'recruiter';
  setRecruiterMode(recruiter);
  if ((window as any).triggerWormhole) (window as any).triggerWormhole();
  if ((window as any).resetZoom) (window as any).resetZoom();
  
  // Update Navigation Radar HUD
  document.querySelectorAll('.radar-dot').forEach(d => d.classList.remove('active'));
  if (route && route !== 'project' && route !== 'recruiter') {
    const dot = document.getElementById(`radar-${route}`);
    if (dot) dot.classList.add('active');
  } else if (!route) {
    // If on homepage (core)
  }
  
  if (recruiter || !route) { overlay.close(); return; }
  if (route === 'project') { 
    if ((window as any).triggerProjectJump) {
      (window as any).triggerProjectJump();
      setTimeout(() => {
        if (location.hash.slice(1).startsWith('project')) {
          overlay.open(projectDetail(a, b));
        }
      }, 550);
    } else {
      overlay.open(projectDetail(a, b)); 
    }
    return; 
  }
  const factory = sectionViews[route];
  if (factory) overlay.open(factory(a)); else overlay.close();
}

export function startRouter(): void {
  addEventListener('hashchange', apply);
  document.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest<HTMLElement>('[data-route]');
    if (!target) return;
    e.preventDefault();
    const next = target.dataset.route ?? '';
    if (location.hash.slice(1) === next) apply(); else location.hash = next;
  });
  document.getElementById('cl')!.addEventListener('click', () => { location.hash = ''; });
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.isOpen) location.hash = '';
    if (e.altKey && e.key.toLowerCase() === 'r') location.hash = document.body.classList.contains('rec') ? '' : 'recruiter';
  });
  apply();
}
