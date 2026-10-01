export interface View {
  title: string;
  html: string;
  /** Called after html is inserted; may return a cleanup function. */
  mount?: (root: HTMLElement) => void | (() => void);
}
