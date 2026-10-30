# MTG Vault
Pure Angular 19 MTG collection manager. Google sign-in only for login (Google Identity Services); per-account collection in browser localStorage; real card images and current prices from Scryfall (prices refresh on every dashboard visit or via "Refresh prices"). Hosted on GitHub Pages.

## 1. Google login setup (one time)
1. console.cloud.google.com → create project → APIs & Services → OAuth consent screen (External; add yourself as test user).
2. Credentials → Create credentials → OAuth client ID → Web application.
3. Authorized JavaScript origins (origin only, no path): `http://localhost:4200` and `https://<your-github-username>.github.io`
4. Copy the Client ID.

## 2. Run locally
Paste the Client ID into `src/app/config.ts`, then: `npm install` and `npm start`.

## 3. Git + GitHub Pages
    git init -b main
    git add . && git commit -m "Initial commit"
    git remote add origin https://github.com/<user>/<repo>.git
    git push -u origin main
GitHub: Settings → Pages → Source: GitHub Actions. Settings → Secrets and variables → Actions → Variables → `GOOGLE_CLIENT_ID` = your Client ID.
Every push to `main` deploys to `https://<user>.github.io/<repo>/` (open it on your phone).

## Notes
Login is client-side only (separates collections per Google account in each browser; no cross-device sync).
