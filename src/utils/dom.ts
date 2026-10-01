export const $ = <T extends HTMLElement = HTMLElement>(sel: string, root: ParentNode = document): T => {
  const el = root.querySelector<T>(sel);
  if (!el) throw new Error(`Missing element: ${sel}`);
  return el;
};
export const $$ = <T extends HTMLElement = HTMLElement>(sel: string, root: ParentNode = document): T[] =>
  Array.from(root.querySelectorAll<T>(sel));

export const prefersReducedMotion = (): boolean => matchMedia('(prefers-reduced-motion: reduce)').matches;
/** Resolve a path in /public against the configured base. */
export const asset = (path: string): string => import.meta.env.BASE_URL + path.replace(/^\//, '');
export const go = (route: string): void => { location.hash = route; };
export const placeholder = (text: string): string => `<p class="m tag">${text}</p>`;
