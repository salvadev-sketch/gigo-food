# GIGO Food

Food delivery web app — customer site + admin panel.

## Status: Prototype
`index.html` is a static, interactive front-end prototype (no backend yet) showing the full planned UX:
- Home, menu categories, food grid
- Cart with live totals (FRw)
- Checkout with an MTN MoMo payment flow (mocked)
- My Orders page
- Admin panel (Add Items / List Items / Orders) — toggle via the button bottom-right

## Planned stack
- Frontend: React + Vite
- Backend: Node/Express + MongoDB (shared Atlas cluster)
- Auth: JWT + bcrypt
- Payments: MTN MoMo (Collections API)
- Currency: FRw

## Next steps
- Build real React frontend + Express backend
- Wire MTN MoMo sandbox credentials
- Deploy backend to Render, frontend to Vercel
