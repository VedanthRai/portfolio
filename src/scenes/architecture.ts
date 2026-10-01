import type { Project } from '../data/types';
import { prefersReducedMotion } from '../utils/dom';

interface Drone { x: number; y: number; vx: number; vy: number; bad: boolean; dead: boolean }
const ACCENT = '#8ccbff';

/**
 * 2D visualisation of a project's documented pipeline. CSR gets a small swarm
 * illustration of concepts from its dossier (it does not replay real results).
 * Returns a cleanup function.
 */
export function mountArchitecture(canvas: HTMLCanvasElement, p: Project, controls: HTMLElement | null): () => void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => undefined;
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth;
  const h = 260;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.scale(dpr, dpr);
  const animate = !prefersReducedMotion();
  let raf = 0;
  let stopped = false;
  const run = (draw: () => void) => {
    const loop = () => { if (stopped) return; draw(); if (animate) raf = requestAnimationFrame(loop); };
    loop();
  };
  const stop = () => { stopped = true; cancelAnimationFrame(raf); };
  if (p.id === 'csr' && controls) { swarm(ctx, w, h, controls, animate, run); return stop; }
  pipeline(ctx, p.architecture, w, h, animate, run);
  return stop;
}

function pipeline(ctx: CanvasRenderingContext2D, stages: string[], w: number, h: number, animate: boolean, run: (d: () => void) => void): void {
  const n = stages.length;
  const px = (i: number) => 30 + (i * (w - 60)) / (n - 1);
  const py = h / 2;
  let t = 0;
  run(() => {
    ctx.clearRect(0, 0, w, h);
    t += 0.012;
    ctx.strokeStyle = '#1c232c';
    ctx.beginPath(); ctx.moveTo(px(0), py); ctx.lineTo(px(n - 1), py); ctx.stroke();
    const at = (t % 1) * (n - 1);
    stages.forEach((label, i) => {
      const on = !animate || Math.abs(i - at) < 0.6;
      ctx.fillStyle = on ? ACCENT : '#3a4652';
      ctx.beginPath(); ctx.arc(px(i), py, on ? 6 : 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = on ? '#e8ecf2' : '#7d8794';
      ctx.font = '11px "IBM Plex Mono", monospace';
      ctx.textAlign = 'center';
      const words = label.split(' ');
      const y0 = i % 2 ? py - 22 - (words.length - 1) * 13 : py + 28;
      words.forEach((wd, k) => ctx.fillText(wd, px(i), y0 + k * 13));
    });
    if (animate) { ctx.fillStyle = '#fff'; ctx.fillRect(px(0) + at * (w - 60) / (n - 1) - 2, py - 2, 4, 4); }
  });
}

function swarm(ctx: CanvasRenderingContext2D, w: number, h: number, controls: HTMLElement, animate: boolean, run: (d: () => void) => void): void {
  const drones: Drone[] = Array.from({ length: 20 }, (_, i) => ({ x: Math.random() * w, y: Math.random() * h, vx: 0, vy: 0, bad: i > 16, dead: false }));
  const st = { gps: false, fail: false, mal: false };
  const toggles: [keyof typeof st, string][] = [['gps', 'GPS denial'], ['fail', 'Drone failure'], ['mal', 'Malicious nodes']];
  controls.innerHTML = '<span class="m">Illustration of documented concepts. Toggle:</span> ' + toggles.map(([k, l]) => `<button class="chip" type="button" data-k="${k}" aria-pressed="false">${l}</button>`).join('');

  let mx = w / 2, my = h / 2, hovering = false;
  const canvas = controls.parentElement?.querySelector('canvas');
  if (canvas) {
    canvas.addEventListener('pointermove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
      hovering = true;
    });
    canvas.addEventListener('pointerleave', () => { hovering = false; });
  }

  let targetX = w / 2, targetY = h / 2;

  const step = () => {
    const time = Date.now() * 0.001;
    targetX = hovering ? mx : w / 2 + Math.cos(time) * 120;
    targetY = hovering ? my : h / 2 + Math.sin(time * 0.8) * 50;

    drones.forEach((d, i) => {
      if (d.dead) return;
      // offset to create a loose swarm around the target
      let tx = targetX + (i % 5) * -12;
      let ty = targetY + (Math.floor(i / 5) - 1.5) * 16;
      if (d.bad && st.mal) { tx = w * 0.5; ty = 20; }
      const jitter = st.gps ? 0.6 : 0;
      d.vx += (tx - d.x) * 0.001 + (Math.random() - 0.5) * jitter;
      d.vy += (ty - d.y) * 0.001 + (Math.random() - 0.5) * jitter;
      drones.forEach((o, j) => {
        if (j === i) return;
        const dx = d.x - o.x, dy = d.y - o.y, q = dx * dx + dy * dy;
        if (q < 400 && q > 0) { d.vx += (dx / q) * 0.8; d.vy += (dy / q) * 0.8; }
      });
      d.vx *= 0.96; d.vy *= 0.96; d.x += d.vx; d.y += d.vy;
    });
  };
  const render = () => {
    ctx.clearRect(0, 0, w, h);
    
    // Draw target crosshair
    ctx.strokeStyle = 'rgba(255, 178, 122, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(targetX, targetY, 10, 0, Math.PI * 2);
    ctx.moveTo(targetX - 15, targetY); ctx.lineTo(targetX + 15, targetY);
    ctx.moveTo(targetX, targetY - 15); ctx.lineTo(targetX, targetY + 15);
    ctx.stroke();
    const isolated = (d: Drone) => d.dead || (d.bad && st.mal);
    drones.forEach((d, i) => {
      if (d.dead) { ctx.fillStyle = '#444'; ctx.fillRect(d.x, d.y, 3, 3); return; }
      if (!isolated(d)) {
        drones.forEach((o, j) => {
          if (j > i && !isolated(o) && Math.hypot(d.x - o.x, d.y - o.y) < 70) {
            ctx.strokeStyle = 'rgba(140,203,255,.12)'; ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(o.x, o.y); ctx.stroke();
          }
        });
      }
      ctx.fillStyle = d.bad && st.mal ? '#ffb27a' : ACCENT;
      const angle = Math.atan2(d.vy, d.vx);
      
      // Draw drone as oriented triangle
      ctx.save();
      ctx.translate(d.x, d.y);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(5, 0);
      ctx.lineTo(-4, 4);
      ctx.lineTo(-4, -4);
      ctx.fill();
      ctx.restore();
    });
  };
  const settle = () => { for (let i = 0; i < 160; i++) step(); render(); };
  controls.querySelectorAll<HTMLButtonElement>('button').forEach((b) => {
    b.onclick = () => {
      const k = b.dataset.k as keyof typeof st;
      st[k] = !st[k];
      b.setAttribute('aria-pressed', String(st[k]));
      drones[3].dead = st.fail;
      if (!animate) settle();
    };
  });
  if (!animate) { settle(); return; }
  run(() => { step(); render(); });
}
