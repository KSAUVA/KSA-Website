/* api/create-payment.js — Square capture endpoint (Vercel/Netlify-style serverless).
   The CLIENT only ever sends a card token + which items; the SERVER decides the
   price (from the catalog below) and charges via Square. Never trust a client amount.

   Required server env vars (set in your host dashboard, NOT committed):
     SQUARE_ACCESS_TOKEN   secret access token (sandbox or production)
     SQUARE_LOCATION_ID    location id matching that token
     SQUARE_ENV            "sandbox" (default) or "production"
     ALLOWED_ORIGIN        your site origin, e.g. https://ksaatuva.com (default "*")

   Deploy:
     • Vercel  → drop this file at /api/create-payment.js, set env vars, deploy.
     • Netlify → put it in /netlify/functions/create-payment.js and export `handler`.
*/

// Canonical price list in CENTS. MUST stay in sync with the client catalog.
const PRICES = {
  qz: 4500,        // K-EXPO Quarter-Zip
  bundle: 4800,    // Quarter-Zip + Tote bundle
  hat: 1400,       // KSA Hat
  key: 500,        // Acrylic Keychain
  sticker: 200,    // Sticker (each)
  tee: 1400,       // KSA T-Shirt
  tote: 1200,      // KSA Tote Bag
  teetote: 2600,   // Tee + Tote bundle
};
const NAMES = {
  qz: "K-EXPO Quarter-Zip", bundle: "Quarter-Zip + Tote", hat: "KSA Hat",
  key: "Acrylic Keychain", sticker: "Sticker", tee: "KSA T-Shirt",
  tote: "KSA Tote Bag", teetote: "Tee + Tote Bundle",
};
const MAX_CUSTOM_CENTS = 50000; // safety cap for POS custom charges (dues/donations)

function squareBase() {
  return process.env.SQUARE_ENV === "production"
    ? "https://connect.squareup.com"
    : "https://connect.squareupsandbox.com";
}

export default async function handler(req, res) {
  const origin = process.env.ALLOWED_ORIGIN || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

  const TOKEN = process.env.SQUARE_ACCESS_TOKEN;
  const LOCATION = process.env.SQUARE_LOCATION_ID;
  if (!TOKEN || !LOCATION) return res.status(500).json({ ok: false, error: "Server is missing Square credentials." });

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const { token, items, buyer, source, idempotencyKey } = body;
    if (!token) return res.status(400).json({ ok: false, error: "Missing card token." });
    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ ok: false, error: "No items." });

    // Compute the amount on the SERVER from the catalog. Never trust client totals.
    let amount = 0;
    const lines = [];
    for (const it of items) {
      const qty = Math.max(1, Math.min(99, parseInt(it.qty, 10) || 1));
      if (it.custom != null) {
        // POS-only custom charge (dues / donations). Capped; staff-entered in person.
        if (source !== "pos") return res.status(400).json({ ok: false, error: "Custom charges are register-only." });
        const cents = Math.round(Number(it.custom));
        if (!Number.isFinite(cents) || cents <= 0 || cents > MAX_CUSTOM_CENTS) return res.status(400).json({ ok: false, error: "Invalid custom amount." });
        amount += cents * qty;
        lines.push(`${qty}× ${it.label || "Custom charge"}`);
      } else {
        const cents = PRICES[it.id];
        if (!cents) return res.status(400).json({ ok: false, error: "Unknown item: " + it.id });
        amount += cents * qty;
        lines.push(`${qty}× ${NAMES[it.id] || it.id}`);
      }
    }
    if (amount <= 0) return res.status(400).json({ ok: false, error: "Nothing to charge." });

    const who = buyer && buyer.name ? ` — ${buyer.name}` : "";
    const note = `KSA ${source === "pos" ? "register" : "online"}: ${lines.join(", ")}${who} (pickup at event)`.slice(0, 500);

    const resp = await fetch(squareBase() + "/v2/payments", {
      method: "POST",
      headers: {
        "Square-Version": "2024-10-17",
        Authorization: "Bearer " + TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idempotency_key: idempotencyKey || (Date.now() + "-" + Math.random().toString(36).slice(2)),
        source_id: token,
        location_id: LOCATION,
        amount_money: { amount, currency: "USD" },
        note,
        buyer_email_address: (buyer && buyer.email) || undefined,
      }),
    });
    const data = await resp.json();
    if (!resp.ok || data.errors) {
      const msg = (data.errors && data.errors[0] && data.errors[0].detail) || "Payment declined.";
      return res.status(402).json({ ok: false, error: msg });
    }
    const p = data.payment || {};
    return res.status(200).json({ ok: true, amount, paymentId: p.id, receiptUrl: p.receipt_url, status: p.status });
  } catch (e) {
    return res.status(500).json({ ok: false, error: (e && e.message) || "Payment failed." });
  }
}
