# LDC Software — Repository Structure Standards

## Repository strategy: Multi-repo

LDC uses a **multi-repo** approach: one repository per project or product. This keeps concerns isolated, makes access control straightforward, and scales cleanly as client work grows independently.

**When to use a monorepo instead:** if two or more deliverables share >50% of code (e.g., a shared component library), group them in a single repo with clear internal package boundaries.

---

## Repository naming conventions

| Type | Pattern | Example |
|---|---|---|
| Client project | `{client}-{product}` | `acme-dashboard` |
| Internal tool | `ldc-{tool}` | `ldc-deploy-scripts` |
| Marketing / web | `website-{name}` | `website-landing-page` |
| Template / scaffold | `template-{kind}` | `template-nextjs-app` |
| Documentation | `docs-{scope}` | `docs-engineering` |

Rules:
- All lowercase, hyphen-separated
- No underscores in repo names
- Keep names short but descriptive (≤ 4 words)

---

## Standard folder layout

Every LDC repository should include the following at the root level:

```
{repo-name}/
├── .github/
│   ├── workflows/            # CI/CD pipelines
│   ├── ISSUE_TEMPLATE/       # Bug and feature templates
│   └── PULL_REQUEST_TEMPLATE.md
├── docs/                     # Architecture, decisions, standards
│   └── repo-structure.md     # (copy or link to this doc)
├── src/                      # Source code (if applicable)
├── tests/                    # Test suites (mirrors src/ structure)
├── .gitignore
├── README.md
└── <build-manifest>          # package.json, pyproject.toml, etc.
```

For static sites (no build step), `src/` is omitted and files live at root.

---

## Branch strategy

| Branch | Purpose |
|---|---|
| `main` | Production-ready, always deployable |
| `feat/{short-description}` | Feature work |
| `fix/{short-description}` | Bug fixes |
| `chore/{short-description}` | Tooling, dependencies, config |

- All work lands on `main` via pull request
- No direct pushes to `main`
- Branch names are lowercase, hyphen-separated

---

## Commit message format

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<optional scope>): <short description>

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `test`, `ci`

Examples:
```
feat(auth): add JWT refresh token flow
fix(api): handle null user in profile endpoint
chore(deps): upgrade Next.js to 15.2
docs: update deployment instructions
```

---

## Pull request checklist

- [ ] Branch is up to date with `main`
- [ ] Description explains the *why*, not just the *what*
- [ ] Self-reviewed the diff
- [ ] Tests added or updated (where applicable)
- [ ] No secrets or credentials committed
- [ ] CI passes

---

## Environment files

- Never commit `.env` files
- Provide `.env.example` with all required keys (values redacted)
- Document each env var in `README.md` or `docs/`

---

## Scaffold templates

For new projects, start from one of the LDC template repos:

| Template | Use case |
|---|---|
| `template-nextjs-app` | Full-stack React apps (Next.js + TypeScript) |
| `template-fastapi-service` | Python microservices (FastAPI + Pydantic) |
| `template-static-site` | Plain HTML/CSS/JS marketing sites |

These templates include the folder structure above, GitHub Actions workflows, .gitignore, and README boilerplate. Clone the template and rename as needed.
