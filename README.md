# KSA at UVA — Website

The official website for the **Korean Student Association at the University of Virginia**
([ksaatuva.com](https://ksaatuva.com)). A React single-page app with live integrations for
the club's Google Calendar, photo gallery, merch store, dues, and an in-person sales register.

> Source lives in **`react-port/`** — a standard Create React App project. Commands below
> are run from inside that folder.

---

## Tech stack

- **React 18** + **react-router-dom v6** (Create React App / `react-scripts`)
- **MUI**, **React-Bootstrap**, **react-icons** — UI components & icons
- **Framer Motion** — animations
- **Square Web Payments SDK** — card checkout
- Plain CSS design system in `src/assets/css/theme.css`

## Quick start

```bash
cd react-port
npm install
cp .env.example .env     # then fill in your keys (see Configuration)
npm start                # dev server at http://localhost:3000
npm run build            # production build → build/
```

Deploys to `https://ksaatuva.com` (set in `homepage` in `package.json`).

---

## Project structure

```
react-port/
├── public/                 # static assets, served from "/"
│   ├── index.html
│   ├── images/             # logos
│   ├── boardPhotos/        # officer headshots (.webp)
│   ├── abtPhotos/          # About-page photos
│   ├── famPhotos/          # KSA Families photos
│   └── merch/              # product shots
├── src/
│   ├── App.js              # Router shell, Square SDK loader, motion init
│   ├── index.js            # React entry point
│   ├── config.js           # central config, reads REACT_APP_* env vars
│   ├── assets/css/theme.css# design tokens + shared styles
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── Footer.js
│   │   └── SquareCheckout.js   # card tokenization + capture call
│   ├── lib/
│   │   ├── data.js         # sample/fallback content + data fetching
│   │   ├── icons.js        # icon set
│   │   ├── pay.js          # payment helpers
│   │   └── ui.js           # hooks: motion gate, reveal, parallax, etc.
│   └── pages/
│       ├── Home.js  About.js  Events.js  Gallery.js  Officers.js
│       ├── Merch.js  Join.js  Links.js  Families.js
│       └── Pos.js          # hidden staff register (see below)
├── api/create-payment.js   # serverless Square capture (Vercel/Netlify)
├── server/app.js           # Express Square capture (Namecheap cPanel Node app)
└── .env.example
```

## Routes

| Path | Page |
|---|---|
| `/` | Home |
| `/about` | About |
| `/events` | Events (live Google Calendar) |
| `/gallery` | Gallery (Google Drive / Sheet) |
| `/officers` | Officer board |
| `/merch` | Merch store + card checkout |
| `/join` | Join KSA |
| `/links` | Links + pay dues |
| `/families` | KSA Families |
| `/pos` | **Hidden** staff sales register — full-screen, no navbar/footer, password-gated |

Every integration **falls back to curated sample content** when its key is blank, so the
site renders complete with zero configuration.

---

## Configuration (`.env`)

Copy `.env.example` → `.env` and fill in. All client vars are `REACT_APP_*` (CRA requirement).

| Variable | Powers |
|---|---|
| `REACT_APP_GCAL_API_KEY` | Live Google Calendar (Events page + Home preview) |
| `REACT_APP_GCAL_CAL_ID` | KSA calendar ID (a default is baked in) |
| `REACT_APP_SQUARE_APP_ID` / `REACT_APP_SQUARE_LOCATION_ID` | Merch checkout + POS card payments |
| `REACT_APP_SQUARE_ENV` | `sandbox` (default) or `production` — picks the Square SDK |
| `REACT_APP_SQUARE_PAYMENT_LINK` | "Scan to pay" QR target on the POS register |
| `REACT_APP_MERCH_ORDER_URL` | Merch order form link (Google Form) |
| `REACT_APP_GALLERY_SOURCE` | `auto` / `drive` / `sheet` |
| `REACT_APP_GALLERY_FOLDER_ID` / `REACT_APP_DRIVE_API_KEY` | Google **Drive** gallery (Drive key reuses the calendar key if blank) |
| `REACT_APP_GALLERY_SHEET_CSV` | Google **Sheet** gallery index (alternative to Drive) |
| `REACT_APP_POS_PASSWORD` | Staff register unlock password (default `KOREA`) |
| `REACT_APP_PAYMENTS_URL` | URL of the server capture endpoint (default `/api/create-payment`) |

The Events and Gallery pages also accept keys pasted at runtime via on-page **"connect"
panels** — values persist in `localStorage`, so you can test without a rebuild.

### Gallery via Google Drive

1. Make a parent folder (e.g. "KSA Gallery"), shared **anyone with link → Viewer**.
2. Inside it, one **subfolder per album**, named `Category | Title` (e.g. `Culture | Chuseok 2025`)
   or just `Title`. Photos inside become the album; images serve from Google's `lh3` CDN.
3. Enable the Drive API on your Google Cloud key and paste the parent folder ID into
   `REACT_APP_GALLERY_FOLDER_ID`.

---

## Payments

The client **only ever sends a card token + which items** — the server looks up the price
from its own catalog and charges via the Square Payments API. Client totals are never
trusted. The price list in `api/create-payment.js` / `server/app.js` **must stay in sync**
with the client merch catalog.

Two interchangeable capture backends are included — deploy whichever fits your host:

- **`api/create-payment.js`** — serverless function for Vercel (`/api/create-payment.js`)
  or Netlify (`/netlify/functions/create-payment.js`, export `handler`).
- **`server/app.js`** — Express app for Namecheap cPanel "Setup Node.js App"
  (`cd server && npm install`, startup file `app.js`).

**Server-side secrets** (never committed — set them in your host's env var dashboard):

| Var | |
|---|---|
| `SQUARE_ACCESS_TOKEN` | Secret access token (sandbox or production) |
| `SQUARE_LOCATION_ID` | Location ID matching that token |
| `SQUARE_ENV` | `sandbox` or `production` |
| `ALLOWED_ORIGIN` | Your site origin, e.g. `https://ksaatuva.com` |

Custom-amount charges (dues / donations) are **register-only** and capped at $500.

### Testing safely

Square defaults to **sandbox** — test with card `4111 1111 1111 1111`. Going live needs
`REACT_APP_SQUARE_ENV=production` on the client **and** a matching production
`SQUARE_ACCESS_TOKEN` + `SQUARE_ENV=production` on the server. In production, **real cards
are charged.**

---

## Notes

- **Styling** is plain CSS (`theme.css`) plus per-component `<style>` blocks — Korean-flag
  palette (navy / blue / red) on a warm cream paper base, Inter type. MUI/Bootstrap are
  installed but these pages don't rely on them.
- **Animations** are CSS-based, gated by a one-time `html.motion` probe (`initMotion` in
  `lib/ui.js`) so content stays visible under print, reduced-motion, and headless capture.
- **No-translate guard** — `App.js` marks the DOM `translate="no"` to stop browser
  translation extensions from swapping text nodes and crashing React on navigation.
