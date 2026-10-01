import { prefersReducedMotion } from '../utils/dom';

const ACCENT = '#8ccbff';
const RED = '#ffb27a';

export function mountLab(canvas: HTMLCanvasElement, expId: string): () => void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => undefined;
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth;
  const h = 320;
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

  if (expId === 'swarm') renderSwarm(ctx, w, h, animate, run);
  else if (expId === 'code') renderFlow(ctx, w, h, animate, run, ['Repository', 'Parsing / AST', 'Symbols / structure', 'Retrieval', 'Analysis', 'Answer']);
  else if (expId === 'risk') renderFlow(ctx, w, h, animate, run, ['EVENT', 'COUNTRY', 'COMMODITY', 'EXPOSURE', 'RISK', 'IMPACT / ADVISORY']);
  else if (expId === 'agents') renderNetwork(ctx, w, h, animate, run, ['News Agent', 'Trade Exposure Agent', 'Agri Risk Agent', 'Advisory Agent']);
  else if (expId === 'models') renderModels(ctx, w, h, animate, run);
  else stop();

  return stop;
}

function renderSwarm(ctx: CanvasRenderingContext2D, w: number, h: number, _animate: boolean, run: (d: () => void) => void) {
  interface Node { x: number; y: number; vx: number; vy: number; bad: boolean; offset: number }
  const nodes: Node[] = Array.from({ length: 20 }, (_, i) => ({ 
    x: Math.random() * w, 
    y: Math.random() * h, 
    vx: 0, vy: 0, 
    bad: i > 16, // 3 malicious
    offset: Math.random() * 100
  }));
  
  run(() => {
    ctx.clearRect(0, 0, w, h);
    
    // Target moving in a circle
    const t = performance.now() / 2000;
    const tx = w/2 + Math.cos(t) * 100;
    const ty = h/2 + Math.sin(t) * 40;
    
    // Draw target objective
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.beginPath(); ctx.arc(tx, ty, 30, 0, Math.PI*2); ctx.stroke();

    nodes.forEach((n, i) => {
      // Swarm mechanics
      const targetX = n.bad ? w/2 + Math.sin(t*2)*150 : tx;
      const targetY = n.bad ? 50 : ty;
      
      n.vx += (targetX - n.x) * 0.001;
      n.vy += (targetY - n.y) * 0.001;
      
      // Avoidance & cohesion
      nodes.forEach((o, j) => {
        if (i===j) return;
        const dx = n.x - o.x, dy = n.y - o.y, q = dx*dx + dy*dy;
        if (q > 0 && q < 4000) {
           if (q < 800) { n.vx += dx/q * 2; n.vy += dy/q * 2; }
           else if (!n.bad && !o.bad) { n.vx -= dx/q * 0.5; n.vy -= dy/q * 0.5; }
        }
      });
      
      n.vx *= 0.95; n.vy *= 0.95;
      n.x += n.vx; n.y += n.vy;
      
      // Draw links
      nodes.forEach((o, j) => {
        if (j > i && Math.hypot(n.x - o.x, n.y - o.y) < 60) {
          ctx.strokeStyle = (n.bad || o.bad) ? 'rgba(255, 178, 122, 0.15)' : 'rgba(140, 203, 255, 0.15)';
          ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(o.x, o.y); ctx.stroke();
        }
      });
      
      // Draw node
      ctx.fillStyle = n.bad ? RED : ACCENT;
      ctx.fillRect(n.x - 2, n.y - 2, 4, 4);
      
      // Trust radius
      if (!n.bad && Math.sin(t*5 + n.offset) > 0.95) {
         ctx.strokeStyle = 'rgba(140, 203, 255, 0.4)';
         ctx.beginPath(); ctx.arc(n.x, n.y, 10, 0, Math.PI*2); ctx.stroke();
      }
    });
  });
}

function renderFlow(ctx: CanvasRenderingContext2D, w: number, h: number, animate: boolean, run: (d: () => void) => void, stages: string[]) {
  const n = stages.length;
  const px = (i: number) => 40 + (i * (w - 80)) / (n - 1);
  const py = h / 2;
  
  run(() => {
    ctx.clearRect(0, 0, w, h);
    const t = performance.now() / 1500;
    
    ctx.strokeStyle = '#1c232c';
    ctx.beginPath(); ctx.moveTo(px(0), py); ctx.lineTo(px(n - 1), py); ctx.stroke();
    
    const at = (t % 1) * (n - 1);
    
    stages.forEach((label, i) => {
      const active = !animate || Math.abs(i - at) < 0.8;
      ctx.fillStyle = active ? ACCENT : '#3a4652';
      ctx.beginPath(); ctx.arc(px(i), py, active ? 6 : 4, 0, Math.PI * 2); ctx.fill();
      
      ctx.fillStyle = active ? '#e8ecf2' : '#7d8794';
      ctx.font = '11px "IBM Plex Mono", monospace';
      ctx.textAlign = 'center';
      
      const words = label.split(' ');
      const y0 = i % 2 ? py - 20 - (words.length - 1) * 14 : py + 28;
      words.forEach((wd, k) => ctx.fillText(wd, px(i), y0 + k * 14));
    });
    
    if (animate) { 
      ctx.fillStyle = '#fff'; 
      ctx.fillRect(px(0) + at * (w - 80) / (n - 1) - 2, py - 2, 4, 4); 
    }
  });
}

function renderNetwork(ctx: CanvasRenderingContext2D, w: number, h: number, animate: boolean, run: (d: () => void) => void, agents: string[]) {
  const failState = agents.map(() => ({ failed: false, timer: 0 }));
  
  run(() => {
    ctx.clearRect(0, 0, w, h);
    const t = performance.now() / 2000;
    const cx = w/2, cy = h/2;
    
    if (animate && Math.random() < 0.006) {
      const idx = Math.floor(Math.random() * agents.length);
      if (!failState[idx].failed) {
        failState[idx].failed = true;
        failState[idx].timer = 180;
      }
    }
    
    ctx.fillStyle = '#e8ecf2';
    ctx.font = '11px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    
    ctx.fillText('INPUT', cx - 120, cy);
    ctx.fillText('SYNTHESIS', cx + 120, cy);
    
    ctx.fillStyle = '#3a4652';
    ctx.beginPath(); ctx.arc(cx - 80, cy, 4, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + 80, cy, 4, 0, Math.PI*2); ctx.fill();
    
    agents.forEach((agent, i) => {
       if (failState[i].failed) {
         failState[i].timer--;
         if (failState[i].timer <= 0) failState[i].failed = false;
       }
       
       const ang = -Math.PI/2 + (i / (agents.length-1)) * Math.PI;
       const ax = cx + Math.cos(ang) * 30;
       const ay = cy + Math.sin(ang) * 90;
       const failed = failState[i].failed;
       
       ctx.strokeStyle = failed ? 'rgba(255, 178, 122, 0.4)' : '#1c232c';
       if (failed) ctx.setLineDash([4, 6]);
       ctx.beginPath(); ctx.moveTo(cx - 80, cy); ctx.lineTo(ax, ay); ctx.lineTo(cx + 80, cy); ctx.stroke();
       ctx.setLineDash([]);
       
       const active = !animate || Math.sin(t*3 + i) > 0;
       ctx.fillStyle = failed ? RED : (active ? ACCENT : '#3a4652');
       ctx.beginPath(); ctx.arc(ax, ay, 5, 0, Math.PI*2); ctx.fill();
       
       ctx.fillStyle = failed ? RED : (active ? '#e8ecf2' : '#7d8794');
       ctx.fillText(failed ? 'ERR_TIMEOUT' : agent, ax, ay - 12);
       
       if (animate && active && !failed) {
         const p = (t*2 + i*0.5) % 1;
         ctx.fillStyle = '#fff';
         const nx = (cx-80) + (ax - (cx-80)) * p;
         const ny = cy + (ay - cy) * p;
         ctx.fillRect(nx-1.5, ny-1.5, 3, 3);
       }
    });
  });
}

function renderModels(ctx: CanvasRenderingContext2D, w: number, h: number, _animate: boolean, run: (d: () => void) => void) {
  const points = Array.from({length: 40}, () => ({
    x: Math.random() * w, y: Math.random() * h,
    vx: (Math.random()-0.5)*0.5, vy: (Math.random()-0.5)*0.5,
    outlier: Math.random() > 0.85
  }));
  
  run(() => {
    ctx.clearRect(0, 0, w, h);
    const t = performance.now() / 1000;
    
    ctx.fillStyle = 'rgba(140, 203, 255, 0.05)';
    ctx.fillRect(w/2 - 80, h/2 - 80, 160, 160);
    
    ctx.fillStyle = '#e8ecf2';
    ctx.font = '10px "IBM Plex Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('XGBOOST / ISOLATION FOREST', w/2, h/2 - 90);
    
    points.forEach(p => {
       p.x += p.vx; p.y += p.vy;
       if (p.x < 0 || p.x > w) p.vx *= -1;
       if (p.y < 0 || p.y > h) p.vy *= -1;
       
       const dist = Math.hypot(p.x - w/2, p.y - h/2);
       const detected = p.outlier && dist > 100;
       
       ctx.fillStyle = detected ? RED : (dist < 80 ? ACCENT : '#444');
       ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI*2); ctx.fill();
       
       if (detected) {
         ctx.strokeStyle = 'rgba(255, 178, 122, 0.3)';
         ctx.beginPath(); ctx.arc(p.x, p.y, 6 + Math.sin(t*5)*2, 0, Math.PI*2); ctx.stroke();
       }
    });
  });
}
