import { $, prefersReducedMotion, asset } from '../utils/dom';
import { sound } from '../utils/sound';

const SEEN_KEY = 'vedanth-os:boot-seen';

function alreadySeen(): boolean {
  try {
    const seen = sessionStorage.getItem(SEEN_KEY) === '1';
    sessionStorage.setItem(SEEN_KEY, '1');
    return seen;
  } catch {
    return false;
  }
}

/** Cinematic intro. Skipped for reduced motion, repeat visits, and direct #recruiter links. */
export function runBoot(onDone: () => void): void {
  const boot = $('#boot');
  const timers: number[] = [];
  let finished = false;
  let audio: HTMLAudioElement | null = null;
  
  const finish = () => {
    if (finished) return;
    finished = true;
    timers.forEach(clearTimeout);
    boot.style.opacity = '0';
    if (audio) {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch (e) {}
    }
    setTimeout(() => boot.remove(), 1200);
    onDone();
  };
  $('#skip').onclick = finish;

  if (prefersReducedMotion() || alreadySeen() || location.hash === '#recruiter') {
    boot.remove();
    finished = true;
    onDone();
    return;
  }

  const sys = $('#cine-sys');
  const name = $('#cine-name');
  const bg = $('#cine-bg');
  const enter = $('#cine-enter');
  const line = $('#cine-line');
  const at = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));

  const playCinematic = () => {
    sys.style.opacity = '0';
    enter.style.display = 'none';
    
    // BLACK / DARK VOID (0.0s)
    at(() => {
      sys.textContent = 'SIGNAL DETECTED';
      sys.style.opacity = '1';
    }, 10);
    
    // V/CORE AWAKENING (0.40s - Peak 1)
    at(() => { 
      sys.textContent = 'V/CORE AWAKENING';
      line.className = 'draw'; 
    }, 400); 
    
    // IDENTITY VERIFIED (1.10s - Peak 2)
    at(() => { 
      sys.textContent = 'IDENTITY VERIFIED';
      line.className = 'draw fade'; 
    }, 1100);
    
    // VEDANTH.OS COMES ONLINE (2.10s - Peak 3)
    at(() => { 
      sys.style.opacity = '0';
      name.textContent = 'VEDANTH.OS ONLINE';
      name.className = 'final';
      bg.className = 'on';
      if (sound.enabled) sound.initCtx();
    }, 2100);
    
    // ENTER VEDANTH.OS (3.5s)
    at(() => {
      name.style.transform = 'translate(-50%, -120%) scale(1)'; // Move title up slightly
      name.style.color = 'var(--dim)';
      name.style.fontSize = 'clamp(1rem,3vw,1.4rem)';
      name.style.letterSpacing = '.8em';
      enter.style.display = 'block'; // Show the primary CTA
      $('#enter-btn').onclick = finish; // Now requires explicit click to enter
    }, 3800);
  };

  if (!sound.enabled) {
     at(playCinematic, 100);
  } else {
     audio = new Audio(asset('assets/intro.mp3'));
     const playPromise = audio.play();
     if (playPromise !== undefined) {
        playPromise.then(() => {
           playCinematic();
        }).catch(() => {
           // Autoplay blocked - fall back immediately to the entry button
           enter.style.display = 'block';
           $('#enter-btn').onclick = () => {
              enter.style.display = 'none';
              if (audio) audio.play();
              playCinematic();
           };
        });
     } else {
        playCinematic();
     }
  }
}
