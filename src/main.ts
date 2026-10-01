import '@fontsource/sora/latin-200.css';
import '@fontsource/sora/latin-300.css';
import '@fontsource/sora/latin-400.css';
import '@fontsource/sora/latin-600.css';
import '@fontsource/ibm-plex-mono/latin-400.css';
import './styles/main.css';
import { runBoot } from './components/Boot';
import { initDraco } from './components/Draco';
import { initHeader } from './components/Header';
import { startRouter } from './router';
import { $ } from './utils/dom';

initHeader();
initDraco();
startRouter();

// Heavy 3D code is a separate chunk, loaded after first paint. If WebGL is
// unavailable the page simply stays 2D: all content is HTML.
requestAnimationFrame(() => {
  import('./scenes/coreScene')
    .then((m) => m.initCore($<HTMLCanvasElement>('#core')))
    .catch((err) => console.info('3D core disabled:', err instanceof Error ? err.message : err));
});

runBoot(() => $('#vc').focus({ preventScroll: true }));

// Easter egg: type "oracle" anywhere.
let typed = '';
addEventListener('keydown', (e) => {
  typed = (typed + e.key).slice(-6);
  if (typed === 'oracle') {
    $('#vc').style.boxShadow = '0 0 80px var(--ac)';
    $('#dans').textContent = 'Signal acknowledged.';
  }
});



const anomalyBtn = document.getElementById('anomaly-btn');
if (anomalyBtn) {
  anomalyBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const anomalyPopup = document.getElementById('anomaly-popup');
    if (anomalyPopup) anomalyPopup.style.display = 'none';
    if ((window as any).triggerProjectJump) (window as any).triggerProjectJump();
    setTimeout(() => {
      location.hash = '#anomaly';
    }, 550);
  });
}
