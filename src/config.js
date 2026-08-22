/* ============================================================
   src/config.js — central config, read from CRA env vars.
   Create a .env file at the project root (see .env.example) with:
     REACT_APP_GCAL_API_KEY=...
     REACT_APP_SQUARE_APP_ID=...
     REACT_APP_SQUARE_LOCATION_ID=...
     REACT_APP_GALLERY_FOLDER_ID=...
   Anything left blank falls back to a sample/curated experience.
   ============================================================ */
const env = process.env;
const ls = (k) => { try { return window.localStorage.getItem(k) || ""; } catch (e) { return ""; } };

const config = {
  // Google Calendar (Events page + Home preview). localStorage override lets the
  // on-page "connect calendar" panel work without a rebuild.
  GCAL_API_KEY: env.REACT_APP_GCAL_API_KEY || ls("ksa_gcal_key") || "",
  GCAL_CAL_ID:
    env.REACT_APP_GCAL_CAL_ID ||
    "16d193ff4d2f291421e7cfeeaf0cb1d742244952b05d33278d8feb7c22fb18a7@group.calendar.google.com",
  // Square Web Payments (Merch checkout + hidden POS register)
  SQUARE_APP_ID: env.REACT_APP_SQUARE_APP_ID || "",
  SQUARE_LOCATION_ID: env.REACT_APP_SQUARE_LOCATION_ID || "",
  // sandbox SDK by default; set REACT_APP_SQUARE_ENV=production to go live
  SQUARE_SDK:
    (env.REACT_APP_SQUARE_ENV === "production"
      ? "https://web.squarecdn.com/v1/square.js"
      : "https://sandbox.web.squarecdn.com/v1/square.js"),
  SQUARE_PAYMENT_LINK: env.REACT_APP_SQUARE_PAYMENT_LINK || "",
  MERCH_ORDER_URL:
    env.REACT_APP_MERCH_ORDER_URL ||
    "https://docs.google.com/forms/d/e/1FAIpQLSemIcVNZXwn2HyMPEvCAikb-VEyxLQEDhn8s-Irys9y_9SGEg/viewform",

  // Gallery CMS (Google Drive folders OR a published Google Sheet).
  // localStorage overrides let the on-page "connect" panel work without a rebuild.
  GALLERY_SOURCE: env.REACT_APP_GALLERY_SOURCE || ls("ksa_gallery_source") || "auto", // auto | drive | sheet
  GALLERY_FOLDER_ID: env.REACT_APP_GALLERY_FOLDER_ID || ls("ksa_gallery_folder") || "",
  DRIVE_API_KEY: env.REACT_APP_DRIVE_API_KEY || ls("ksa_drive_key") || "", // blank → reuse GCAL key
  GALLERY_SHEET_CSV: env.REACT_APP_GALLERY_SHEET_CSV || ls("ksa_gallery_sheet") || "",

  // Hidden sales register password
  POS_PASSWORD: env.REACT_APP_POS_PASSWORD || "KOREA",

  // Payment capture endpoint (the serverless function that actually charges the card).
  PAYMENTS_URL: env.REACT_APP_PAYMENTS_URL || "/api/create-payment",

  // Public asset base (CRA serves /public at PUBLIC_URL)
  PUB: process.env.PUBLIC_URL || "",

    POPUP_SHEET_CSV: env.REACT_APP_POPUP_SHEET_CSV || ls("ksa_popup_sheet") || "",
    POPUP_BANNER_ID: env.REACT_APP_POPUP_BANNER_ID || ls("ksa_popup_banner") || "",
};

export default config;
