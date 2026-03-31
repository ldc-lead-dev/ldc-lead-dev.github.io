# LDC Software — Website Landing Page

Public-facing marketing site for [LDC Software](https://ldcsoftware.ca), deployed via GitHub Pages.

## Tech stack

- Plain HTML + CSS (no build step)
- GitHub Actions → GitHub Pages deployment

## Local development

Open `index.html` in a browser, or use any static file server:

```bash
npx serve .
# or
python3 -m http.server 8080
```

## CI/CD Pipeline

### Validation (all PRs)

Every pull request targeting `main` or `staging` runs `.github/workflows/ci.yml`:

- **HTML lint** — `htmlhint` validates all HTML files
- **Link check** — `lychee` verifies all links in HTML files are reachable

### Deployment

| Branch    | Environment | Trigger            |
|-----------|-------------|--------------------|
| `main`    | Production  | Push → auto-deploy |
| `staging` | Staging     | Push → auto-deploy |

Both environments run the full validation suite before deploying. A failed validation blocks deployment.

`.github/workflows/deploy.yml` handles both environments. The `staging` GitHub Pages environment must be configured in repo settings with its own Pages source if you want a separate staging URL (or use a separate repo/branch).

## Repository structure

```
website-landing-page/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml            # PR validation (HTML lint + link check)
│   │   └── deploy.yml        # Staging + production deployment
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   └── PULL_REQUEST_TEMPLATE.md
├── docs/
│   └── repo-structure.md     # LDC repo standards & conventions
├── index.html                # Main page
├── styles.css                # Stylesheet
├── .gitignore
└── README.md
```

## Contributing

See [docs/repo-structure.md](docs/repo-structure.md) for LDC project conventions.
