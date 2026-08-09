# GIGO Food — Project Status & Phases

_Last updated: 2026-08-09_

This file is the handoff doc for continuing this project in a new chat/session.
Paste this whole file (or link the repo) into a fresh conversation to resume exactly where things left off.

---

## GITHUB
- Account: `salvadev-sketch`
- Repo: `gigo-food` (public) — https://github.com/salvadev-sketch/gigo-food
- No standing push access. To commit: user pastes a GitHub PAT in chat, says "push" / "do it yourself".
  Clone with token embedded in URL → commit → push → **verify push landed** (re-fetch raw file URL, don't trust exit code alone) → delete local clone → remind user to revoke the token.
- Fine-grained PATs sometimes lack permission to **create** new repos (403 "Resource not accessible") even with repo scoped correctly — if that happens, either have the user create the empty repo manually in the GitHub UI first, or use a classic token with `repo` scope instead.
- Before pushing any TypeScript/bundler-based code: run a real build/type-check locally first (`npx tsc --noEmit`, `npx vite build`) — don't assume code compiles.

## SHARED INFRASTRUCTURE (same as other GIGO/salvadev-sketch projects)
- MongoDB Atlas cluster: `cluster0.aerbtfv.mongodb.net`, db user: `tuyisengeemmanuel526_db_user`
- This project's database name: `gigo-food` (own db on the shared cluster)
- Atlas Network Access allows `0.0.0.0/0` for Render
- No Firebase for this project — using JWT + bcrypt auth (matches `gigo-delivery` / `gigo-pharmacy` pattern), not the Firebase-shared-auth pattern used by `amakuru` / `ezer-supermarket` / `gigo-business-company`

---

## DECISIONS LOCKED IN
| Decision | Value |
|---|---|
| App/repo name | `gigo-food` |
| Payment method | **MTN MoMo only** (Collections API) |
| Currency | **FRw** |
| Auth pattern | JWT + bcrypt (no Firebase) |
| Reference tutorial | GreatStack "Tomato" MERN food delivery tutorial (React + Node/Express + MongoDB + Stripe → swapped to MTN MoMo) |

---

## PHASE STATUS

### ✅ Phase 0 — Scoping & Reference Gathering (DONE)
- Collected 17 screenshots of the reference "Tomato" tutorial site: home page, category rows, dish grid, sign up/login modals, cart page, delivery info page, payment page, my orders page, and the full admin panel (Add Items / List Items / Orders).
- Collected the tutorial's full asset zip (`food-del-assets.zip`), unpacked at time of build — contains:
  - `frontend_assets/` — 32 food photos, 8 category icons, logo, header image, UI icons, `assets.js` mapping (32 seed foods across 8 categories: Salad, Rolls, Deserts, Sandwich, Cake, Pure Veg, Pasta, Noodles)
  - `admin_assets/` — admin logo, profile image, upload placeholder, order/parcel/add icons, `assets.js`
- **⚠️ TODO: the assets zip has NOT been pushed to the repo yet.** Still needs to be added as `frontend/assets/` and `admin/assets/` folders.

### ✅ Phase 1 — Clickable Prototype (DONE)
- Built `index.html` — single-file interactive prototype, own GIGO Food visual identity (forest green + amber, Fraunces/Manrope fonts, not a literal Tomato clone).
- Working in-browser (all mock data/JS, no backend):
  - Home: hero, category filter row, food grid (14 sample items)
  - Cart: qty controls, live totals in FRw, delivery fee
  - Checkout: delivery form + **mocked MTN MoMo payment flow** (phone number input → simulated push-payment → order created)
  - My Orders: order list with status
  - Admin panel (toggle button bottom-right): Add Items form, List Items table, Orders list with status-update dropdown (live-syncs to customer My Orders in the mock)
- **Pushed to GitHub**: `index.html` + `README.md` on `main` branch. Push verified via raw.githubusercontent.com fetch.

### ✅ Phase 2 — Backend Scaffold (DONE, PUSHED)
All files under 300 lines each (project convention — split into a new file rather than growing past that).
- `backend/models/`: `Food.js`, `User.js` (with resetPasswordToken/Expires + cartData), `Order.js` (items, address, MoMo payment sub-doc)
- `backend/middleware/`: `auth.js` (`requireAuth` JWT verify + `requireAdmin` role check), `upload.js` (multer disk storage)
- `backend/config/`: `db.js` (awaited mongoose connect, per gotcha #7), `email.js` (nodemailer, matches gigo-pharmacy/gigo-delivery pattern — logs instead of sending if EMAIL_* unset), `momo.js` (MTN MoMo Collections API client: `getAccessToken`, `requestToPay`, `checkPaymentStatus`)
- `backend/routes/`: `foodRoute.js` (list/add/remove), `userRoute.js` (register/login, bcrypt+JWT), `passwordRoute.js` (forgot/reset), `cartRoute.js` (add/remove/get, cart stored on User doc), `orderRoute.js` (place order → triggers MoMo push, status polling, user's orders, admin list + update-status)
- `backend/server.js` — Express entry, CORS scoped to FRONTEND_URL/ADMIN_URL, static `/uploads`, DB connect awaited before `app.listen`
- `backend/seed/seedFoods.js` — real 32-item dataset extracted from the tutorial's `assets.js` (names/categories/images preserved, prices converted $ → FRw at a placeholder 1:1000 rate — **adjust the `RATE` constant to a real exchange rate before using**)
- Verified: every route/model/middleware file syntax-checked (`node --check`) AND actually imported (`import()`) successfully before pushing — catches missing-dependency errors that `--check` alone would miss
- `multer` pinned to `^2.0.0` (1.x has known vulnerabilities)

**⚠️ MTN MoMo needs real credentials before payments will actually work**: Subscription Key, API User, API Key from the [MTN MoMo Developer Portal](https://momodeveloper.mtn.com). Start in `sandbox` (note: sandbox only accepts `EUR` as currency, already handled in `momo.js`), switch to `production`/`RWF` once approved. Env vars stubbed in `backend/.env.example`.

**⚠️ Not yet run**: `npm install` + `seedFoods.js` against the real Atlas cluster — needs the real `MONGO_URI` password. `backend/uploads/` in the repo only has a `.gitkeep`; the 32 seed images live in `frontend/src/assets/` — copy them into `backend/uploads/` locally before running the seed script (or point the seed script at the frontend assets path instead).

### 🔲 Phase 3 — Customer Frontend (React/Vite) — NOT STARTED
Convert the prototype's HTML/CSS/JS into real React components hitting the live backend:
- `pages/`: Home, Cart, PlaceOrder (delivery info + MoMo payment), MyOrders
- `components/`: Navbar, Header/Hero, ExploreMenu (category row), FoodDisplay/FoodItem, AppDownload, Footer, LoginPopup
- `context/`: StoreContext (cart state, food list, auth token) — matches the tutorial's context pattern
- Wire real food images from `frontend_assets/` once pushed

### 🔲 Phase 4 — Admin Panel (React/Vite, separate app) — NOT STARTED
- `pages/`: Add, List, Orders
- `components/`: Sidebar, Navbar
- Same backend, admin-role-gated routes

### 🔲 Phase 5 — Deployment — NOT STARTED
- Backend → Render (env vars: `MONGO_URI`, `JWT_SECRET`, `MOMO_*`, `FRONTEND_URL`, `ADMIN_URL`)
- Customer frontend → Vercel (`VITE_API_URL`)
- Admin panel → Vercel, separate project (`VITE_API_URL`)
- Apply all "Recurring Gotchas" below during setup

---

## RECURRING GOTCHAS (check first, every deploy)
1. Vercel "Root Directory" must match the actual frontend subfolder for monorepos
2. Vercel "Framework Preset" must match reality (Vite, not "Other")
3. Vercel → Deployment Protection → "Vercel Authentication" must be OFF for public access
4. `VITE_API_URL` must match whether backend routes are mounted under `/api` or not
5. MongoDB Atlas Network Access needs `0.0.0.0/0` for Render
6. Env var changes need a redeploy (baked at build time) + hard browser refresh after
7. Backend health-check responding ≠ MongoDB actually connected — await `mongoose.connect()` before `app.listen()`, check Render logs for the real connection line
8. Render free-tier URLs can trigger Chrome's "Dangerous site" warning (shared-subdomain reputation, not a real issue)
9. Manually inserted Atlas documents bypass Mongoose schema validation

---

## IMMEDIATE NEXT STEPS (pick up here)
1. ~~Push the unzipped asset folders~~ ✅ done
2. ~~Push the backend scaffold~~ ✅ done — full backend code is live (Phase 2 complete)
3. Get MTN MoMo sandbox credentials from the user, and a real exchange rate for the seed script's `RATE` constant
4. Run `npm install` + `seedFoods.js` against the real Atlas cluster (needs real `MONGO_URI` password)
5. Start converting the prototype into real React components (Phase 3 — customer frontend)
