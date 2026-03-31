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

## Deployment

Every push to `main` triggers the GitHub Actions workflow (`.github/workflows/deploy.yml`) which deploys to GitHub Pages automatically.

## Repository structure

```
website-landing-page/
├── .github/
│   ├── workflows/
│   │   └── deploy.yml        # GitHub Pages deployment
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
