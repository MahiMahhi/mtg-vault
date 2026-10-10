# MTG Vault
Pure Angular 19 MTG collection manager. Google sign-in (Google Identity Services), per-account collection stored in browser localStorage, card data/prices from Scryfall. Hosted on GitHub Pages.

## 1. Google login setup (one time)
1. console.cloud.google.com → create project → **APIs & Services → OAuth consent screen** (External, add yourself as test user, or publish).
2. **Credentials → Create credentials → OAuth client ID → Web application**.
3. **Authorized JavaScript origins** (origins only, no path):
   - `http://localhost:4200`
   - `https://<your-github-username>.github.io`
4. Copy the Client ID.

## 2. Run locally
Paste the Client ID into `src/app/config.ts`, then:

    npm install
    npm start

## 3. Git + GitHub Pages
    git init -b main
    git add . && git commit -m "Initial commit"
    git remote add origin https://github.com/<user>/<repo>.git
    git push -u origin main

On GitHub: **Settings → Pages → Source: GitHub Actions**, and **Settings → Secrets and variables → Actions → Variables → New: `GOOGLE_CLIENT_ID`** = your Client ID (don't commit it if you prefer; the workflow injects it).
Every push to `main` builds and deploys to `https://<user>.github.io/<repo>/`.

## Notes
Login is client-side only: it separates collections per Google account in each browser, but data is not synced across devices and there is no server-side verification. For cross-device sync add a backend (e.g. NestJS + PostgreSQL) later.
