# subswap-scripts

This repository hosts the extracted JavaScript for SubletBuff (form, home, admin). The files are intended to be served via jsDelivr or GitHub Pages and referenced from your Webflow site's Custom Code to keep each page under Webflow's 50k HTML limit.

Files:

- `form-logic.js`
- `home-logic.js`
- `admin-logic.js`

Quick Git commands (one-time setup)

1. Create a new repo on GitHub (you already have `subswap-scripts`). Locally, inside your project folder run:

```bash
git init
git add form-logic.js home-logic.js admin-logic.js README.md
git commit -m "Add extracted page scripts"
git branch -M main
git remote add origin git@github.com:ethanivler-dev/subswap-scripts.git
git push -u origin main
```

2. Recommended: create a release tag when you want a stable CDN URL:

```bash
git tag v1.0.0
git push origin v1.0.0
```

Using jsDelivr CDN URLs

Use the following pattern (replace with your tag or `main`):

- `https://cdn.jsdelivr.net/gh/ethanivler-dev/subswap-scripts@main/form-logic.js`
- `https://cdn.jsdelivr.net/gh/ethanivler-dev/subswap-scripts@main/home-logic.js`
- `https://cdn.jsdelivr.net/gh/ethanivler-dev/subswap-scripts@main/admin-logic.js`

Notes

- Prefer using a tagged release (e.g., `@v1.0.0`) rather than `@main` for predictable caching and rollbacks.
- Ensure external dependencies (Supabase, Sortable) are loaded before these scripts in Webflow.
- If you prefer GitHub Pages, enable Pages in repository settings and reference the raw file URL under `https://USERNAME.github.io/REPO/`.

If you'd like, I can automatically update your Webflow-exported HTML files to include these CDN script tags (I already updated the local HTML files). Tell me if you want me to push a release tag for you or prepare commit commands to run locally.
