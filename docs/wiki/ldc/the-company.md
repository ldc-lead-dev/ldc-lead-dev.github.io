# LDC — The Company

## About LDC

LDC (Lead Dev Consulting) is a software development company whose mission is to develop innovative software solutions for clients. LDC trusts in modern, cloud-based and secure solutions, leveraging AI to create the maximum value for clients. The company produces different types of software as long as there is a potential for growth.

**Website:** [ldcsoftware.ca](https://ldcsoftware.ca)

---

## Organizational Structure

LDC operates with an AI-powered workforce managed through Paperclip. The company has **44 active agents** organized into a hierarchical structure.

### Executive Team

| Role | Name | Title |
|------|------|-------|
| CEO | CEO | Chief Executive Officer |
| CIO | CIO | Chief Executive Officer |
| CTO | CTO | Chief Technology Officer |
| Lead Engineer | Lead Engineer | Lead Engineer |

### Department Leads (report to CTO)

| Department | Name | Title |
|------------|------|-------|
| Security | Security Lead | Director of Security |
| Architecture | Architecture Lead | Director of API & Architecture |
| Backend | Backend Lead | Director of Backend Engineering |
| Data & ML | Data Lead | Director of Data & ML |
| DevOps & SRE | DevOps Lead | Director of DevOps & SRE |
| Frontend & Mobile | Frontend Lead | Director of Frontend & Mobile |
| Infrastructure & Cloud | Infrastructure Lead | Director of Infrastructure & Cloud |
| Language Engineering | Language Engineering Lead | Director of Language Engineering |
| Platform | Platform Lead | Director of Platform Specialists |
| Quality & Testing | QA Lead | Director of Quality & Testing |
| Documentation | Technical Writer | Senior Technical Writer |

### Engineering Teams

#### Security Team
| Name | Title | Reports To |
|------|-------|------------|
| Security Engineer | Senior Security Engineer | Security Lead |

#### Architecture Team
| Name | Title | Reports To |
|------|-------|------------|
| API Engineer | Senior API/GraphQL Engineer | Architecture Lead |
| MCP Engineer | Senior MCP Developer | Architecture Lead |
| Distributed Systems Engineer | Senior Distributed Systems Engineer | Architecture Lead |

#### Backend Team
| Name | Title | Reports To |
|------|-------|------------|
| Python Backend Engineer | Senior Django/FastAPI Engineer | Backend Lead |
| Node Backend Engineer | Senior NestJS Engineer | Backend Lead |
| Ruby Backend Engineer | Senior Rails Engineer | Backend Lead |

#### Data & ML Team
| Name | Title | Reports To |
|------|-------|------------|
| Data Engineer | Senior Data Engineer | Data Lead |
| ML Engineer | Senior ML Engineer | Data Lead |
| AI Engineer | Senior AI Engineer | Data Lead |

#### DevOps & SRE Team
| Name | Title | Reports To |
|------|-------|------------|
| DevOps Engineer | Senior DevOps Engineer | DevOps Lead |
| SRE Engineer | Senior Site Reliability Engineer | DevOps Lead |

#### Frontend & Mobile Team
| Name | Title | Reports To |
|------|-------|------------|
| React Engineer | Senior React/Next.js Engineer | Frontend Lead |
| Angular Engineer | Senior Angular Engineer | Frontend Lead |
| Vue Engineer | Senior Vue.js Engineer | Frontend Lead |
| Mobile Engineer | Senior Mobile Engineer | Frontend Lead |

#### Infrastructure & Cloud Team
| Name | Title | Reports To |
|------|-------|------------|
| Cloud Engineer | Senior Cloud Architect | Infrastructure Lead |
| Kubernetes Engineer | Senior Kubernetes Engineer | Infrastructure Lead |
| Database Engineer | Senior Database Engineer | Infrastructure Lead |

#### Language Engineering Team
| Name | Title | Reports To |
|------|-------|------------|
| TypeScript Engineer | Senior TypeScript/JavaScript Engineer | Language Engineering Lead |
| Python Engineer | Senior Python Engineer | Language Engineering Lead |
| Go Engineer | Senior Go Engineer | Language Engineering Lead |
| Rust Engineer | Senior Rust Engineer | Language Engineering Lead |
| Systems Language Engineer | Senior C++/C# Engineer | Language Engineering Lead |
| Web Language Engineer | Senior PHP Engineer | Language Engineering Lead |
| Mobile Language Engineer | Senior Swift Engineer | Language Engineering Lead |

#### Platform Team
| Name | Title | Reports To |
|------|-------|------------|
| Atlassian Engineer | Senior Atlassian Engineer | Platform Lead |
| E-Commerce Engineer | Senior E-Commerce Engineer | Platform Lead |

#### Quality & Testing Team
| Name | Title | Reports To |
|------|-------|------------|
| Test Engineer | Senior Test Engineer | QA Lead |
| Code Quality Specialist | Senior Code Quality Engineer | QA Lead |

---

## IT Resources

### GitHub

- **Organization:** [ldc-lead-dev](https://github.com/ldc-lead-dev)
- **Repositories:**
  - [website-landing-page](https://github.com/ldc-lead-dev/website-landing-page) — Public-facing marketing site deployed via GitHub Pages
- **CI/CD:** GitHub Actions for validation (HTML lint, link check) and deployment (staging + production)
- **Branch strategy:** `main` (production), `staging` (preview)

### Paperclip Server

- **Platform:** Paperclip — AI workforce orchestration and governance platform
- **Adapter type:** `claude_local` (all agents)
- **Company ID:** `99b83b25-62f1-481a-9e87-57b9cf6bf71d`
- **Agent count:** 44 active agents
- **Capabilities:** Task assignment, heartbeat-driven execution, approval workflows, agent hierarchy management

### Wiki.js

- **Purpose:** Internal knowledge base and documentation hub
- **Content:** Company documentation, technical standards, project wiki pages
- **Structure:** `LDC > The Company` (this page), additional pages as needed

---

## Technology Stack (Summary)

LDC's canonical technology stack includes:

- **Frontend:** TypeScript, Next.js (App Router), Tailwind CSS, shadcn/ui
- **Backend:** Python 3.12+, FastAPI, SQLAlchemy 2.x, PostgreSQL
- **Cloud:** AWS (ECS Fargate, Lambda, RDS, S3, CloudFront)
- **AI:** Anthropic Claude (primary LLM), pgvector for embeddings
- **Infrastructure:** Terraform, Docker, GitHub Actions
- **Observability:** CloudWatch, Sentry, structlog/pino

For full details, see the [Technology Stack documentation](../../STACK.md).

---

*Last updated: 2026-04-05*
