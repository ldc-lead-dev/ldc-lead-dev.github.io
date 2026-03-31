# LDC Software — Canonical Technology Stack

This document defines the standard technology choices for LDC client projects. Deviations require explicit justification in the project's `docs/` folder (ADR format preferred).

---

## Languages

| Layer | Language | Rationale |
|---|---|---|
| Frontend / Full-stack | TypeScript | Strong typing, ecosystem breadth, Next.js synergy |
| Backend services | Python | FastAPI performance, AI/ML library ecosystem |
| Scripting / automation | Python or Bash | Lightweight, portable |

**Rule:** Do not mix languages within the same service boundary. One repo = one primary language.

---

## Frontend

| Concern | Choice | Notes |
|---|---|---|
| Framework | Next.js (App Router) | SSR, SSG, file-based routing, Vercel-native |
| Language | TypeScript (strict mode) | Required — no `any` without explicit suppression comment |
| Styling | Tailwind CSS | Utility-first, co-located, no runtime overhead |
| Component library | shadcn/ui | Headless, accessible, Tailwind-compatible |
| State management | React Query (server state) + Zustand (client state) | Minimal boilerplate |
| Forms | React Hook Form + Zod | Type-safe validation at form and API boundary |
| Testing | Vitest + React Testing Library | Fast unit/component tests |
| E2E | Playwright | Cross-browser, CI-friendly |

**When to use a static site instead:** Marketing-only pages with no interactivity — use plain HTML/CSS/JS via `template-static-site`.

---

## Backend

| Concern | Choice | Notes |
|---|---|---|
| Framework | FastAPI | Async, OpenAPI auto-generation, Pydantic models |
| Language | Python 3.12+ | Minimum version; use `pyproject.toml` |
| Package management | uv | Replaces pip/poetry; lockfile-first |
| Data validation | Pydantic v2 | Required for all request/response models |
| ORM | SQLAlchemy 2.x (async) | With Alembic for migrations |
| Database | PostgreSQL | Primary relational store |
| Cache / queues | Redis | Sessions, rate limiting, Celery broker |
| Task queue | Celery | Background jobs; Beat for scheduled tasks |
| Testing | pytest + httpx | `pytest-asyncio` for async routes |

---

## Cloud Platform

**Primary provider: AWS**

| Service category | AWS service | Use case |
|---|---|---|
| Compute | ECS Fargate | Containerized services (no server management) |
| Serverless compute | Lambda | Event-driven functions, lightweight endpoints |
| Container registry | ECR | Docker image storage |
| Database | RDS (PostgreSQL) | Managed relational DB |
| Cache | ElastiCache (Redis) | Managed Redis |
| Object storage | S3 | Files, assets, backups |
| CDN | CloudFront | Static assets, frontend delivery |
| DNS | Route 53 | Domain management |
| Secrets | Secrets Manager | Credentials, API keys |
| Observability | CloudWatch + AWS X-Ray | Logs, metrics, traces |
| IaC | Terraform | Cloud infrastructure as code |

**GCP exception:** Use GCP when a client already has an existing GCP footprint or when a specific GCP-native service (e.g., Vertex AI, BigQuery) provides clear advantage. Document the reason in the project ADR.

---

## AI Integration

| Concern | Choice | Notes |
|---|---|---|
| LLM provider | Anthropic (Claude) | Primary; claude-sonnet-4-6 for production |
| SDK | `anthropic` Python SDK | Official; pin version in lockfile |
| Embeddings | OpenAI `text-embedding-3-small` | Cost-effective; switch to Bedrock if AWS-native required |
| Vector store | pgvector (PostgreSQL extension) | Prefer co-location with primary DB for simplicity |
| Orchestration | Custom thin wrappers | Avoid heavy frameworks (LangChain etc.) unless justified |

See `docs/AI_PATTERNS.md` (LDC-6) for detailed AI integration patterns.

---

## Infrastructure & DevOps

| Concern | Choice | Notes |
|---|---|---|
| IaC | Terraform | Modules in `infra/` directory |
| Containerization | Docker | Required for all backend services |
| CI/CD | GitHub Actions | See `docs/CICD.md` (LDC-5) |
| Environments | `dev`, `staging`, `prod` | Separate AWS accounts preferred |
| Secrets in CI | GitHub Actions Secrets + OIDC | No long-lived IAM keys in repos |

---

## Observability

| Concern | Choice |
|---|---|
| Structured logging | Python: `structlog`; TypeScript: `pino` |
| APM / tracing | AWS X-Ray (backend), Sentry (frontend + backend errors) |
| Metrics | CloudWatch metrics + custom dashboards |
| Alerting | CloudWatch Alarms → SNS → PagerDuty / Slack |

---

## Security Baseline

- All secrets via AWS Secrets Manager or GitHub Actions Secrets — never in source code
- HTTPS everywhere; HTTP redirects enforced at CloudFront / load balancer
- Dependencies scanned via Dependabot + `pip audit` / `npm audit` in CI
- Docker images scanned via ECR image scanning
- IAM: least-privilege roles; no `AdministratorAccess` on service accounts

---

## Decision Log

| Date | Decision | Rationale |
|---|---|---|
| 2026-03-31 | TypeScript + Python as primary languages | TypeScript dominates modern frontend; Python owns AI/ML and has FastAPI for performant async APIs |
| 2026-03-31 | AWS as primary cloud | Broadest service catalog, team familiarity, strong compliance tooling |
| 2026-03-31 | Next.js App Router (not Pages) | App Router is the stable future of Next.js; SSR + RSC reduce client JS |
| 2026-03-31 | uv over pip/poetry | Significantly faster installs; lockfile-native |
| 2026-03-31 | Terraform over CDK/Pulumi | Language-agnostic HCL; industry standard; easier handoff to client DevOps |
| 2026-03-31 | Anthropic Claude as primary LLM | Best reasoning quality; Paperclip alignment; strong Python SDK |
