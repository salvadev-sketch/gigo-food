# GIGO Food — Project Stages & Phases

Food delivery web app (customer site + admin panel). React + Vite frontend, Node/Express + MongoDB backend on the shared Atlas cluster, JWT + bcrypt auth, MTN MoMo (Collections API) payments, FRw currency.

Repo: https://github.com/salvadev-sketch/gigo-food

---

## Stage 1 — Prototype ✅ DONE
- [x] Static, interactive `index.html` front-end prototype (no backend)
- [x] Home, menu categories, food grid
- [x] Cart with live totals (FRw)
- [x] Checkout with mocked MTN MoMo payment flow
- [x] My Orders page (mocked)
- [x] Admin panel UI (Add Items / List Items / Orders) — toggle button

---

## Stage 2 — Backend Foundation
- [ ] Init `backend/` (Express + Mongoose), connect to shared Atlas cluster with a dedicated `gigo-food` database
- [ ] Models: User, Food/MenuItem, Order, Cart (or cart embedded on User)
- [ ] Auth: JWT + bcrypt (register/login, password hashing, token middleware)
- [ ] Admin role flag on User model (reuse pattern from other GIGO apps)
- [ ] Core routes: `/api/food` (CRUD), `/api/cart`, `/api/order`, `/api/user`
- [ ] Env vars: MONGO_URI, JWT_SECRET, EMAIL_* (if forgot-password is in scope), FRONTEND_URL

## Stage 3 — Real Frontend (Customer Site)
- [ ] Scaffold `frontend/` with React + Vite (replace static `index.html` prototype)
- [ ] Port prototype UI into real components (Home, category filter, food grid, cart, checkout, orders)
- [ ] Wire to backend API (VITE_API_URL)
- [ ] Auth pages: login/register, forgot/reset password (match gigo-pharmacy/gigo-delivery pattern if in scope)
- [ ] Cart state (context or lightweight store), persisted totals in FRw

## Stage 4 — Admin Panel (Real)
- [ ] Scaffold `admin/` React app (or fold into main frontend behind role check — decide which)
- [ ] Add Item / List Items (with image upload)
- [ ] Orders list + status updates (Placed/Preparing/Out for delivery/Delivered/Cancelled — define exact set)
- [ ] Basic dashboard stats (revenue, order count) — optional for v1

## Stage 5 — Payments (MTN MoMo)
- [ ] Get MTN MoMo sandbox credentials (Collections API)
- [ ] Backend integration: request-to-pay, payment status polling/callback
- [ ] Replace mocked checkout flow with real sandbox calls
- [ ] Handle payment failure/timeout states in UI
- [ ] (Later) move from sandbox to production MoMo credentials

## Stage 6 — Deployment
- [ ] Backend → Render (env vars, Atlas 0.0.0.0/0 network access, verify mongoose.connect() awaited before app.listen())
- [ ] Frontend → Vercel (root directory, framework preset = Vite, VITE_API_URL set, Deployment Protection off)
- [ ] Admin → same Vercel project or separate, TBD
- [ ] Smoke test full flow end to end (browse → cart → checkout → MoMo payment → order appears in admin)

## Stage 7 — Polish / Post-launch
- [ ] Forgot/reset password (if not done in Stage 3)
- [ ] Order status notifications (email or in-app)
- [ ] Seed sample menu items (pattern used in other GIGO/ezer apps)
- [ ] Currency/pricing review, mobile responsiveness pass
- [ ] Decide on real MoMo production rollout timing

---

## Open decisions
- Admin panel: separate deployed app or route-gated within the main frontend?
- Order status set: exact stages (Placed → ? → Delivered) and whether "Cancelled" needs a reason field
- Whether forgot-password is in scope for v1 or deferred to Stage 7
- Delivery logistics: is there a rider/driver role, or is this pickup-style with just Placed/Delivered?
