# BJJ Notebook

A private, local-first training notebook for deliberate Brazilian Jiu-Jitsu practice. Record sessions, technical details, sparring problems, and game plans without accounts, social features, or gamification.

## Features

- Weekly session and training-time analytics
- Session logs with technical and physical context
- Searchable, filterable technique library
- Sparring observations and recurring problem analysis
- Editable A-game, B-game, emergency, and competition plans
- JSON export, import, and guarded reset
- Browser `localStorage` persistence with no backend
- Responsive mobile and desktop layouts

## Run locally

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

Open the local address Vite prints, usually `http://localhost:5173`.

For a production check, run `npm run build` and then `npm run preview`.

## Deploy to GitHub Pages

The Vite base is relative, so the build works from a GitHub project subpath.

1. Push the repository to GitHub.
2. In **Settings → Pages**, choose **GitHub Actions** as the source.
3. Add `.github/workflows/deploy.yml` containing the workflow below.
4. Push to `main`; the workflow publishes `dist`.

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - id: deployment
        uses: actions/deploy-pages@v4
```

Notebook data is scoped to the exact browser origin. A local development notebook will not automatically appear on the deployed site; export and import JSON to move it.
