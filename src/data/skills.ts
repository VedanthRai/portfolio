import type { SkillGroup } from './types';

export const skillGroups: SkillGroup[] = [
  {
    "name": "AI",
    "skills": [
      {
        "name": "ML",
        "usedIn": [
          "AgroShield",
          "Drishti",
          "CSR"
        ]
      },
      {
        "name": "LLM applications",
        "usedIn": [
          "CodeOracle",
          "AgroShield",
          "SkillBarter"
        ]
      },
      {
        "name": "Agents",
        "usedIn": [
          "CodeOracle",
          "AgroShield",
          "Drishti"
        ]
      },
      {
        "name": "RAG",
        "usedIn": [
          "CodeOracle"
        ]
      },
      {
        "name": "Reinforcement learning",
        "usedIn": [
          "CSR"
        ]
      },
      {
        "name": "PyTorch",
        "usedIn": [
          "CSR"
        ]
      },
      {
        "name": "Scikit-learn",
        "usedIn": [
          "Drishti"
        ]
      },
      {
        "name": "Ollama",
        "usedIn": [
          "On resume; no project detail supplied"
        ]
      }
    ]
  },
  {
    "name": "SYSTEMS",
    "skills": [
      {
        "name": "Backend APIs",
        "usedIn": [
          "AgroShield (FastAPI)",
          "SkillBarter (Spring Boot)",
          "CodeOracle (stdlib server)"
        ]
      },
      {
        "name": "Linux internals",
        "usedIn": [
          "Docksmith"
        ]
      },
      {
        "name": "AWS",
        "usedIn": [
          "AgroShield"
        ]
      },
      {
        "name": "Databases (MySQL, SQLite, ChromaDB)",
        "usedIn": [
          "MySQL: SkillBarter",
          "SQLite and ChromaDB: listed on resume; no project detail supplied"
        ]
      }
    ]
  },
  {
    "name": "SOFTWARE",
    "skills": [
      {
        "name": "Python",
        "usedIn": [
          "CodeOracle",
          "AgroShield",
          "Drishti",
          "CSR",
          "Docksmith"
        ]
      },
      {
        "name": "Java",
        "usedIn": [
          "SkillBarter"
        ]
      },
      {
        "name": "C",
        "usedIn": [
          "On resume; no project detail supplied"
        ]
      },
      {
        "name": "C++",
        "usedIn": [
          "Line Following Robot"
        ]
      },
      {
        "name": "JavaScript / React",
        "usedIn": [
          "AgroShield",
          "CodeOracle"
        ]
      },
      {
        "name": "MySQL",
        "usedIn": [
          "SkillBarter"
        ]
      }
    ]
  },
  {
    "name": "FOUNDATIONS",
    "skills": [
      {
        "name": "Graph algorithms (BFS)",
        "usedIn": [
          "CodeOracle"
        ]
      },
      {
        "name": "OOAD / design patterns",
        "usedIn": [
          "SkillBarter"
        ]
      },
      {
        "name": "Embedded control",
        "usedIn": [
          "Line Following Robot"
        ]
      },
      {
        "name": "Data Structures & Algorithms",
        "usedIn": [
          "On resume; graph BFS in CodeOracle"
        ]
      },
      {
        "name": "Operating Systems",
        "usedIn": [
          "Docksmith (namespaces, chroot)"
        ]
      }
    ]
  }
];
