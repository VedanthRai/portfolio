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
    
    // Quick blue line sweep (0 to 0.35s)
    at(() => { line.className = 'draw'; }, 10);
    at(() => { line.className = 'draw fade'; }, 360);
    
    // Sync to analyzed peaks:
    // 0.40s: VEDANTH (Major impact)
    // 1.10s: RAI (Secondary buildup)
    // 2.10s: VEDANTH.OS (Final lock)
    // 4.00s: Sequence ends
    
    at(() => { 
      name.textContent = 'VEDANTH'; 
      name.className = 'show';
    }, 400); 
    
    at(() => { 
      name.textContent = 'RAI';
      name.className = 'show tracking';
    }, 1100);
    
    at(() => { 
      name.textContent = 'VEDANTH.OS';
      name.className = 'final';
      bg.className = 'on';
      if (sound.enabled) sound.initCtx();
    }, 2100);
    
    at(finish, 3800);
  };

  sys.textContent = 'SYSTEM INITIALIZING...';
  sys.style.opacity = '1';

  if (!sound.enabled) {
     at(playCinematic, 600);
  } else {
     audio = new Audio(asset('assets/intro.mp3'));
     const playPromise = audio.play();
     if (playPromise !== undefined) {
        playPromise.then(() => {
           playCinematic();
        }).catch(() => {
           // Autoplay blocked
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
