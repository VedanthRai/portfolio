import type { View } from '../sections/view';
import { $, $$ } from '../utils/dom';
import { sound } from '../utils/sound';

const root = $('#ov');
const body = $('#ovb');
const closeBtn = $('#cl');
let cleanup: (() => void) | undefined;
let returnFocus: HTMLElement | null = null;

/** Full-screen HTML panel used by every section and project view. */
export const overlay = {
  open(view: View): void {
    cleanup?.();
    returnFocus ??= document.activeElement as HTMLElement | null;
    body.innerHTML = view.html;
    root.setAttribute('aria-label', view.title);
    root.classList.add('on');
    document.body.classList.add('ov-open');
    root.scrollTop = 0;
    closeBtn.focus();
    const result = view.mount?.(body);
    cleanup = typeof result === 'function' ? result : undefined;
    sound.beep(220, 0.15);
  },
  close(): void {
    cleanup?.();
    cleanup = undefined;
    root.classList.remove('on');
    document.body.classList.remove('ov-open');
    returnFocus?.focus?.();
    returnFocus = null;
  },
  get isOpen(): boolean { return root.classList.contains('on'); },
};

// Keep Tab inside the dialog while it is open.
root.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab') return;
  const items = $$<HTMLElement>('button, a[href]', root).filter((el) => el.offsetParent !== null);
  if (!items.length) return;
  const first = items[0], last = items[items.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});
