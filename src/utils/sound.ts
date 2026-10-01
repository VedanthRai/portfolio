/** Procedural, opt-in sound. Now remembers user preference via localStorage. */
const PREF_KEY = 'vedanth-os:sound-pref';
let ctx: AudioContext | null = null;
let enabled = localStorage.getItem(PREF_KEY) !== '0'; // default true for cinematic intro unless explicitly disabled

export const sound = {
  get enabled(): boolean { return enabled; },
  set enabled(val: boolean) {
    enabled = val;
    localStorage.setItem(PREF_KEY, val ? '1' : '0');
  },
  toggle(): boolean {
    sound.enabled = !enabled;
    if (enabled && !ctx) {
      try { ctx = new AudioContext(); } catch { sound.enabled = false; }
    }
    if (enabled) void ctx?.resume();
    if (enabled) sound.beep(90, 0.4);
    return enabled;
  },
  beep(freq: number, dur: number): void {
    if (!enabled || !ctx) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = freq;
    g.gain.value = 0.03;
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur + 0.1);
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + dur + 0.1);
  },
  initCtx(): void {
    if (!ctx) {
      try { ctx = new AudioContext(); } catch {}
    }
    if (ctx && ctx.state === 'suspended') {
      void ctx.resume();
    }
  }
};
