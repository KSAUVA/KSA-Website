/* app.js — KSA payment server for Namecheap cPanel "Setup Node.js App".
   Square card-capture endpoint. The CLIENT sends only a card token + which items;
   the SERVER decides the price and charges via Square.

   Works on Node 10+ (uses the built-in https module, no global fetch).
   If the cPanel Node version dropdown offers 18+, prefer that — but 10 is fine.

   cPanel env vars (Setup Node.js App → Environment variables):
     SQUARE_ACCESS_TOKEN   secret access token (production or sandbox)
     SQUARE_LOCATION_ID    location id matching that token
     SQUARE_ENV            "production" or "sandbox"
     ALLOWED_ORIGIN        https://ksaatuva.com
   Application startup file: app.js   |   then "Run NPM Install".
*/
const express = require("express");
const https = require("https");

const PRICES = {
  qz: 4500, bundle: 4800, hat: 1400, key: 500, sticker: 200,
  tee: 1400, tote: 1200, teetote: 2600,
};
const NAMES = {
  qz: "K-EXPO Quarter-Zip", bundle: "Quarter-Zip + Tote", hat: "KSA Hat",
  key: "Acrylic Keychain", sticker: "Sticker", tee: "KSA T-Shirt",
  tote: "KSA Tote Bag", teetote: "Tee + Tote Bundle",
};
const MAX_CUSTOM_CENTS = 50000;

function squareHost() {
  return process.env.SQUARE_ENV === "production"
    ? "connect.squareup.com"
    : "connect.squareupsandbox.com";
}

/* POST JSON via built-in https (Node 10 compatible). */
function postJSON(hostname, path, headers, bodyObj) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(bodyObj);
    const req = https.request(
      {
        method: "POST",
        hostname: hostname,
        path: path,
        headers: Object.assign(
          { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(data) },
          headers
        ),
      },
      (resp) => {
        let body = "";
        resp.on("data", (c) => (body += c));
        resp.on("end", () => {
          let json = {};
          try { json = JSON.parse(body); } catch (e) {}
          resolve({ status: resp.statusCode, json: json });
        });
      }
    );
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

const app = express();
app.use(express.json());

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  next();
});

app.get("/", function (req, res) {
  res.json({ ok: true, service: "ksa-payments", env: process.env.SQUARE_ENV || "sandbox" });
});

async function handleCreatePayment(req, res) {
  const TOKEN = process.env.SQUARE_ACCESS_TOKEN;
  const LOCATION = process.env.SQUARE_LOCATION_ID;
  if (!TOKEN || !LOCATION) return res.status(500).json({ ok: false, error: "Server is missing Square credentials." });

  try {
    const body = req.body || {};
    const token = body.token;
    const items = body.items;
    const buyer = body.buyer || {};
    const source = body.source;
    if (!token) return res.status(400).json({ ok: false, error: "Missing card token." });
    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ ok: false, error: "No items." });

    let amount = 0;
    const lines = [];
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      const qty = Math.max(1, Math.min(99, parseInt(it.qty, 10) || 1));
      if (it.custom != null) {
        if (source !== "pos") return res.status(400).json({ ok: false, error: "Custom charges are register-only." });
        const cents = Math.round(Number(it.custom));
        if (!Number.isFinite(cents) || cents <= 0 || cents > MAX_CUSTOM_CENTS) return res.status(400).json({ ok: false, error: "Invalid custom amount." });
        amount += cents * qty;
        lines.push(qty + "\u00d7 " + (it.label || "Custom charge"));
      } else {
        const cents = PRICES[it.id];
        if (!cents) return res.status(400).json({ ok: false, error: "Unknown item: " + it.id });
        amount += cents * qty;
        lines.push(qty + "\u00d7 " + (NAMES[it.id] || it.id));
      }
    }
    if (amount <= 0) return res.status(400).json({ ok: false, error: "Nothing to charge." });

    const who = buyer.name ? " \u2014 " + buyer.name : "";
    const note = ("KSA " + (source === "pos" ? "register" : "online") + ": " + lines.join(", ") + who + " (pickup at event)").slice(0, 500);

    const result = await postJSON(
      squareHost(),
      "/v2/payments",
      { "Square-Version": "2024-10-17", Authorization: "Bearer " + TOKEN },
      {
        idempotency_key: body.idempotencyKey || (Date.now() + "-" + Math.random().toString(36).slice(2)),
        source_id: token,
        location_id: LOCATION,
        amount_money: { amount: amount, currency: "USD" },
        note: note,
        buyer_email_address: buyer.email || undefined,
      }
    );

    if (result.status >= 300 || (result.json && result.json.errors)) {
      const msg = (result.json && result.json.errors && result.json.errors[0] && result.json.errors[0].detail) || "Payment declined.";
      return res.status(402).json({ ok: false, error: msg });
    }
    const p = (result.json && result.json.payment) || {};
    return res.json({ ok: true, amount: amount, paymentId: p.id, receiptUrl: p.receipt_url, status: p.status });
  } catch (e) {
    return res.status(500).json({ ok: false, error: (e && e.message) || "Payment failed." });
  }
}

app.post("/", handleCreatePayment);
app.post("/create-payment", handleCreatePayment);

const PORT = process.env.PORT || 3001;
app.listen(PORT, function () { console.log("KSA payment server on " + PORT); });
