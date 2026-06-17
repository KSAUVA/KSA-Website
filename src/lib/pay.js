/* src/lib/pay.js — client helper that sends the Square card token to your
   capture endpoint. The server computes the real price and charges the card. */
import config from "../config";

export async function capturePayment({ token, items, buyer, source }) {
  const idempotencyKey = (window.crypto && window.crypto.randomUUID)
    ? window.crypto.randomUUID()
    : Date.now() + "-" + Math.random().toString(36).slice(2);
  let resp;
  try {
    resp = await fetch(config.PAYMENTS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, items, buyer, source, idempotencyKey }),
    });
  } catch (e) {
    throw new Error("Couldn't reach the payment server. (Is the API deployed / REACT_APP_PAYMENTS_URL set?)");
  }
  let data = {};
  try { data = await resp.json(); } catch (e) {}
  if (!resp.ok || !data.ok) throw new Error(data.error || "Payment failed. Please try again.");
  return data; // { ok, amount, paymentId, receiptUrl }
}
