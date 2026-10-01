import type { Failure, Experiment } from './types';

export const failures: Failure[] = [
  { problem: 'Cornering overshoot', cause: 'At 90-degree corners, forward speed 200 caused rotational overshoot from chassis inertia.', change: 'Introduced a separate turn speed of 180 for pivot actions.', lesson: null, source: 'Line Following Robot' },
  { problem: 'Failed motor-driver channel', cause: 'A failed half-bridge channel on the L298N board starved one wheel of drive current.', change: 'The component was diagnosed and replaced.', lesson: null, source: 'Line Following Robot' },
  { problem: 'Mechanical drift', cause: 'Uneven wheel alignment.', change: 'Mechanically calibrated.', lesson: null, source: 'Line Following Robot' },
];

export const experiments: Experiment[] = [
  {
    id: 'swarm',
    title: 'SWARM SYSTEMS',
    shortTitle: 'SWARM',
    description: 'PPO-GRU self-play MARL and Boids potential-field coordination.',
    details: ['Decentralized UDP gossip', 'Trust checks', 'GPS-denial / SLAM concepts']
  },
  {
    id: 'code',
    title: 'CODE INTELLIGENCE',
    shortTitle: 'CODE',
    description: 'Repository structure parsing and AST-based retrieval analysis.',
    details: ['Parsing / AST', 'Symbols / structure', 'Analysis']
  },
  {
    id: 'risk',
    title: 'RISK PROPAGATION',
    shortTitle: 'RISK',
    description: 'Geopolitical event and trade exposure propagation into risk impact.',
    details: ['EVENT -> COUNTRY -> COMMODITY', 'EXPOSURE -> RISK', 'IMPACT / ADVISORY']
  },
  {
    id: 'agents',
    title: 'AGENT SYSTEMS',
    shortTitle: 'AGENTS',
    description: 'Multi-agent analysis and synthesis pipelines for trade risk.',
    details: ['News Agent', 'Trade Exposure Agent', 'Agri Risk Agent', 'Advisory Agent']
  },
  {
    id: 'models',
    title: 'MODEL / DATA EXPERIMENTS',
    shortTitle: 'MODELS',
    description: 'XGBoost risk prediction, Isolation Forest, and deterministic fallbacks.',
    details: ['Feature processing', 'Historical trade data', 'Rule-based fallbacks']
  },
  {
    id: 'failures',
    title: 'SYSTEM FAILURES',
    shortTitle: 'FAILURES',
    description: 'Failure analysis of past systems.',
    details: []
  }
];
