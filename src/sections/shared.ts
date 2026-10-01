import { profile } from '../data/profile';
import { asset } from '../utils/dom';

export const resumeLink = (label = 'Download resume (PDF)'): string =>
  `<a class="chip" href="${asset(profile.resume)}" download="VedanthRai_Resume.pdf">${label}</a>`;

export const externalLink = (href: string, label: string): string =>
  `<a href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`;
