import type { Profile } from './types';

/** Change links here; every button and Recruiter Mode read from this object. */
export const profile: Profile = {
  name: 'Vedanth Rai',
  title: 'AI / ML / Software Engineering',
  tagline: 'Builder turning complex technical ideas into working systems. AI, ML, multi-agent systems, software.',
  location: 'Bangalore, India',
  email: 'vedanthrai01@gmail.com',
  github: 'https://github.com/VedanthRai',
  linkedin: 'https://www.linkedin.com/in/vedanthrai',
  resume: 'assets/resume.pdf',
  education: { school: 'PES University, Bangalore', degree: 'B.Tech in Computer Science', period: '2023 – 2027' },
  summary:
    'I build intelligent systems and the software underneath them—working across AI/ML, multi-agent architectures, and systems engineering. A final-year Computer Science undergraduate at PES University, Bangalore, exploring how models, agents, and software come together to solve real problems.',
  interests: ['AI', 'ML', 'Generative AI', 'LLM applications', 'Multi-agent systems', 'Software engineering', 'Distributed systems', 'DSA'],
  timeline: [
    { when: '2023 – 2027', text: 'B.Tech in Computer Science, PES University, Bangalore' },
    { when: 'Jun – Aug 2025', text: 'AI Intern, CellStrat' },
  ],
};
