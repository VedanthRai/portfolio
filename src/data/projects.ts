import type { Project, ProjectScreenshot } from './types';

/** Resolve a path in public/assets relative to site root — used only in data layer. */
const ss = (id: string, file: string, alt: string, caption: string | undefined, role: 'hero' | 'secondary'): ProjectScreenshot => ({
  src: `assets/projects/${id}/${file}`,
  alt,
  caption,
  role,
});

/** Source of truth: the project dossiers. The UI reads only from here. */
export const projects: Project[] = [
  {
    "id": "codeoracle",
    "name": "CodeOracle",
    "category": "AI",
    "summary": "A multi-agent RAG system that explains a Git repository: architecture, design rationale and change impact.",
    "why": "Snippet-level code assistants fragment syntax trees, cannot explain why a design exists, ignore dependencies, and leave hallucinated claims unchecked.",
    "built": "AST-aware chunking (Python’s ast module; regular expressions for other languages), hybrid retrieval (semantic + TF-IDF fused by Reciprocal Rank Fusion, plus dependency-graph expansion), a 7-agent orchestration layer, Mermaid diagram generation and a single-file web UI. The Python backend needs no third-party packages.",
    "architecture": [
      "Repository",
      "AST + dependency graph",
      "Hybrid retrieval",
      "7 agents",
      "Verifier",
      "Answer"
    ],
    "tech": [
      "Python (stdlib)",
      "Gemini 1.5 Flash",
      "RRF",
      "TF-IDF",
      "Mermaid.js",
      "JavaScript",
      "Docker config"
    ],
    "contribution": "Code-aware chunker, hybrid retrieval and graph expansion; shared-memory agent orchestration with intent routing; VerifierAgent groundedness check; BFS change-impact analysis; static-analysis graph builder.",
    "results": [
      "69 automated tests, all passing locally",
      "Verifier rewrites answers scoring below 0.4 groundedness",
      "Runs locally; Docker and Render configs exist but no live deployment is claimed",
      "The vector store is a custom pickle-backed linear scan, not a vector database"
    ],
    "repo": "https://github.com/VedanthRai/Codebase",
    screenshots: [
      ss('codeoracle', 'hero.png', 'CodeOracle chat interface showing an architecture overview for the FastAPI repository, with groundedness and confidence scores visible', 'Chat interface: architecture overview with groundedness scoring', 'hero'),
      ss('codeoracle', 'health.png', 'CodeOracle Health Report view showing maintainability score 9.3/10, average cyclomatic complexity 1.8, and module complexity charts', 'Health report: maintainability 9.3/10, avg complexity 1.8', 'secondary'),
    ],
  },
  {
    "id": "agroshield",
    "name": "AgroShield",
    "category": "AI",
    "summary": "Geopolitical news in, risk forecasts and stakeholder advisories out, for India’s agricultural trade.",
    "why": "Farm and policy advisory workflows are reactive, fragmented and disconnected from macro-geopolitical intelligence.",
    "built": "A 5-agent async FastAPI pipeline reading GDELT news, a 31-feature XGBoost risk model with rule-based fallback, economic impact calculations, Amazon Bedrock advisories for four stakeholder groups, a grounded farmer chat, and a 9-view React dashboard with a custom SVG threat map.",
    "architecture": [
      "GDELT news",
      "EventCollector",
      "EventProcessor",
      "RiskPredictor",
      "ImpactReasoner",
      "AdvisoryGenerator"
    ],
    "tech": [
      "Python",
      "FastAPI",
      "React 18",
      "Vite",
      "Tailwind",
      "XGBoost",
      "Amazon Bedrock",
      "AWS EC2 / S3 / DynamoDB",
      "Nginx"
    ],
    "contribution": "Pipeline architecture; 31-feature space and 45% ML / 55% signal-score blend; Bedrock prompt design with structured JSON output; React dashboard; chat guardrails. EC2 + Nginx deploy script, trade-proxy mapping and the training-dataset schema are shared work.",
    "results": [
      "Built for the AI 4 Bharat Hackathon, AWS Track",
      "Documented rule-based fallbacks exist for the risk model and for advisory generation",
      "No test suite and no authentication: the API is public"
    ],
    "repo": "https://github.com/VedanthRai/Agroshield",
    screenshots: [
      ss('agroshield', 'hero.png', 'AgroShield Farmer Intelligence Portal showing a Kharif 2025 crop calendar with per-crop risk tiers, price forecasts, and AI action advisories', 'Farmer portal: crop-level risk tiers and AI advisories', 'hero'),
      ss('agroshield', 'chat.png', 'AgroShield Farmer AI Assistant chat panel open alongside the crop calendar', 'Grounded farmer chat: ask about mandi prices and geopolitical risk', 'secondary'),
    ],
  },
  {
    "id": "csr",
    "name": "Cognitive Swarm Resilience",
    "category": "AI",
    "summary": "A 20-drone swarm that learns to resist electronic-warfare attacks under GPS denial, trained with adversarial multi-agent RL.",
    "why": "Centralised control and classic Byzantine protocols break under jamming and captured nodes that send plausible but false telemetry.",
    "built": "A vectorised MARL training environment and a multi-process UDP gossip testbed; a recurrent PyTorch defender policy (decoupled actor and critic GRUs) trained by self-play against an RL adversary; kinematic and trust filters; a SLAM/drift simulator.",
    "architecture": [
      "Observer UI",
      "20 drone clients",
      "Signed gossip mesh",
      "Kinematic filters",
      "GRU defender policy",
      "RL adversary (3 captured nodes)"
    ],
    "tech": [
      "Python",
      "PyTorch",
      "CleanRL-style PPO",
      "NumPy",
      "Linux UDP sockets",
      "Ed25519 (via prebuilt Rust daemon)",
      "uv"
    ],
    "contribution": "Defender policy, self-play pipeline, physics and SLAM simulators, client-side trust filters, and the 45-run benchmark harness. The Rust gossip daemon is included only as a binary and is not claimed as mine.",
    "results": [
      "In simulation: landing rate 73.3% → 96.6% (+23.3 points) across 45 multi-seed runs",
      "In simulation: formation error 19.41 m → 6.52 m",
      "In simulation: CSR Index 0.706 → 0.915",
      "Software-in-the-loop only: no hardware flight tests, 2D point-mass physics"
    ],
    "repo": "https://github.com/VedanthRai/Cognitive-Swarm-Resilience",
    screenshots: [
      ss('csr', 'simulation.png', 'Swarm ISR Mission Observer plot: 20 drones tracked, 17 landed safely, 3 under GPS spoofing attack (red triangles), with green flight path traces navigating around obstacles', 'Simulation: 20-drone swarm — 17 landed, 3 under GPS attack — CSR Index 0.706 → 0.915', 'hero'),
    ],
  },
  {
    "id": "drishti",
    "name": "Drishti",
    "category": "AI",
    "summary": "A multi-agent system that turns live trade and geopolitical data into playbooks for farmers and policymakers.",
    "why": "Trade analytics lag reality and do not combine live geopolitical risk, commodity prices and forward-looking action plans.",
    "built": "Five agents coordinated by a local MCP-style orchestrator with a shared in-memory context, async World Bank and GDELT ingestion, Z-score and Isolation Forest anomaly detection, a composite risk index, and a 6-tab Streamlit dashboard.",
    "architecture": [
      "Data Ingestion",
      "GPR & News",
      "Trend Detection",
      "Risk Reasoning",
      "Advisory"
    ],
    "tech": [
      "Python",
      "Streamlit",
      "scikit-learn",
      "SciPy",
      "Pandas",
      "Plotly",
      "aiohttp",
      "Pytest",
      "Docker"
    ],
    "contribution": "Pipeline and orchestrator design, live-data layer, anomaly engine, risk formulation, and the Streamlit visualisations.",
    "results": [
      "30 automated tests, all passing",
      "Bundled trade dataset: 139,628 historical records",
      "Advisories come from a rule-based engine; no LLM is invoked",
      "Price ingestion falls back to synthetic data when live feeds are unavailable",
      "No cloud deployment"
    ],
    "repo": "https://github.com/VedanthRai/Drishti",
    screenshots: [
      ss('drishti', 'overview.png', 'Drishti Real-Time dashboard overview tab showing live World Bank trade indicators, a global trade volume map, commodity bar chart, and a country risk matrix', 'Overview: live trade indicators, world map, risk matrix', 'hero'),
      ss('drishti', 'farmer.png', 'Drishti Farmer Playbook tab showing crop switch alerts and risk mitigation advisories side-by-side', 'Farmer playbook: crop switch alerts and risk mitigation', 'secondary'),
      ss('drishti', 'trends.png', "Drishti Trends & Data tab showing market volatility trend, detected anomalies scatter plot, seasonal trade patterns, and a trade intensity heatmap", 'Trend analysis: anomaly detection and seasonal heatmap', 'secondary'),
    ],
  },
  {
    "id": "docksmith",
    "name": "Docksmith",
    "category": "SYS",
    "summary": "A daemonless container engine and image builder written from scratch in Python.",
    "why": "Docker-style tools hide how containers actually work: namespaces, chroot, layers and build caching.",
    "built": "A Docksmithfile parser, reproducible content-addressed tar layers, a cascading SHA-256 build cache, delta layers with OCI whiteouts, and isolated runs via user, mount and UTS namespaces plus chroot. A small browser dashboard is included.",
    "architecture": [
      "Docksmithfile",
      "Parser",
      "Cache manager",
      "Layer builder",
      "Image store",
      "Namespaced run"
    ],
    "tech": [
      "Python 3",
      "Linux namespaces",
      "chroot",
      "POSIX shell",
      "pytest"
    ],
    "contribution": "CLI and entrypoints, the parser, setup automation, and regression tests plus bug fixes in layer building and image removal. Build-engine integration was shared work.",
    "results": [
      "46 automated tests, all passing",
      "Not a Docker replacement: no cgroups, no network isolation, local storage only"
    ],
    "repo": "https://github.com/VedanthRai/DockSmith",
    screenshots: [
      ss('docksmith', 'hero.png', 'Docksmith local image store view listing three container images (alpine, python, myapp) with their layer counts, sizes, and layer details in a sidebar', 'Local image store: content-addressed layers and full digest', 'hero'),
      ss('docksmith', 'cache.png', 'Docksmith Cache & State view showing 3 images, 10 layer files, 90.3 MB total layer size, 12 cache entries, and the on-disk store location structure', 'Cache & state: SHA-256 build cache statistics', 'secondary'),
    ],
  },
  {
    "id": "skillbarter",
    "name": "SkillBarter",
    "category": "SW",
    "summary": "A peer-to-peer skill exchange where hours, not money, are the currency.",
    "why": "Learning is gated by cost, while people who could teach lack a fair, accountable way to trade time.",
    "built": "A Spring Boot platform with an escrow state machine for time credits, dispute adjudication, Strategy-pattern teacher matching, event-driven notifications, PDF session receipts and a Gemini-powered study assistant.",
    "architecture": [
      "Booking",
      "Escrow",
      "Session",
      "Confirmation",
      "Release / Refund / Dispute",
      "Ledger"
    ],
    "tech": [
      "Java 17",
      "Spring Boot 3",
      "Spring Security",
      "JPA / Hibernate",
      "MySQL",
      "Thymeleaf",
      "Gemini API",
      "iText 7"
    ],
    "contribution": "Escrow state machine with an immutable ledger; Strategy, Observer, Builder and Decorator patterns; Gemini REST integration; PDF receipts; security roles.",
    "results": [
      "Built for an Object Oriented Analysis & Design course",
      "Runs locally; no automated tests and no deployment claimed"
    ],
    "repo": "https://github.com/VedanthRai/SkillBarter",
    screenshots: [
      ss('skillbarter', 'hero.png', 'SkillBarter Browse Skills page showing skill cards (Python Programming, Java Spring Boot, Classical Guitar) with credit-per-hour pricing and a search interface', 'Browse skills: credit-per-hour marketplace with verified listings', 'hero'),
    ],
  },
  {
    "id": "robot",
    "name": "Line Following Robot",
    "category": "SYS",
    "summary": "An Arduino robot that tracks a line using two infrared sensors and bare-metal C++.",
    "why": "A course challenge (Mobile and Autonomous Robots) in closed-loop control without GPS, LiDAR or cameras.",
    "built": "79 lines of firmware for an ATmega328P, dual TCRT5000 sensors, an L298N motor driver with PWM, and a four-state bang-bang controller with zero-radius pivot turns.",
    "architecture": [
      "2 IR sensors",
      "4-state logic",
      "PWM",
      "L298N driver",
      "Differential drive"
    ],
    "tech": [
      "Embedded C++",
      "Arduino Uno",
      "L298N",
      "TCRT5000",
      "PWM",
      "UART"
    ],
    "contribution": "All firmware, PWM tuning (forward 200, turn 180), hardware debugging, and a 9-page engineering report.",
    "results": [
      "Bang-bang control only: no PID, vision or ML",
      "Faults diagnosed: a failed motor-driver channel and ambient IR noise"
    ],
    "repo": "https://github.com/VedanthRai/Robotics",
    screenshots: [
      ss('robot', 'hardware.png', 'The assembled line-following robot: Arduino Uno, L298N motor driver, four yellow-wheeled motors on a transparent chassis, wiring visible', 'Hardware: Arduino Uno + L298N on acrylic chassis', 'hero'),
      ss('robot', 'circuit.png', 'Circuit diagram showing Arduino Uno connected to L298N motor driver, two TCRT5000 IR sensors, and four motors with annotated wiring color legend', 'Circuit diagram: dual IR sensors, PWM motor control', 'secondary'),
    ],
  }
];
