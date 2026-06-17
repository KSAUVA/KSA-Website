/* src/components/SquareCheckout.js — Square Web Payments card modal (Merch page).
   The Square SDK is loaded once in App.js. App ID + Location ID come from config. */
import React, { useState, useEffect, useRef } from "react";
import config from "../config";
import { capturePayment } from "../lib/pay";

export default function SquareCheckout({ item, onClose }) {
  const [status, setStatus] = useState("loading"); // loading | ready | paying | success | error | unavailable
  const [msg, setMsg] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [receipt, setReceipt] = useState("");
  const cardBox = useRef(null);
  const cardRef = useRef(null);
  const emailOk = /\S+@\S+\.\S+/.test(email);
  const canPay = name.trim() && emailOk && (status === "ready" || status === "error");

  useEffect(() => {
    let cancelled = false;
    let tries = 0;
    async function init() {
      const APP = config.SQUARE_APP_ID;
      const LOC = config.SQUARE_LOCATION_ID;
      if (!APP || !LOC) { setStatus("unavailable"); return; }
      while (!window.Square && tries < 50 && !cancelled) { await new Promise((r) => setTimeout(r, 100)); tries++; }
      if (cancelled) return;
      if (!window.Square) { setStatus("error"); setMsg("Square SDK failed to load."); return; }
      try {
        const payments = window.Square.payments(APP, LOC);
        const card = await payments.card();
        await card.attach(cardBox.current);
        if (cancelled) { try { card.destroy(); } catch (e) {} return; }
        cardRef.current = card;
        setStatus("ready");
      } catch (e) {
        console.error("[Square checkout]", e);
        setStatus("error");
        setMsg(e && e.message ? e.message : "Could not start Square checkout.");
      }
    }
    init();
    return () => { cancelled = true; try { cardRef.current && cardRef.current.destroy(); } catch (e) {} };
  }, []);

  const pay = async () => {
    if (!cardRef.current || !name.trim() || !emailOk) return;
    setStatus("paying");
    setMsg("");
    try {
      const r = await cardRef.current.tokenize();
      if (r.status !== "OK") {
        setStatus("error");
        setMsg((r.errors && r.errors[0] && r.errors[0].message) || "Card could not be processed.");
        return;
      }
      // Server computes the real price from item.id and charges the card.
      const result = await capturePayment({
        token: r.token,
        items: [{ id: item.id, qty: 1 }],
        buyer: { name: name.trim(), email: email.trim() },
        source: "online",
      });
      setReceipt(result.receiptUrl || "");
      setStatus("success");
    } catch (e) {
      setStatus("error");
      setMsg(e && e.message ? e.message : "Payment failed. Please try again.");
    }
  };

  return (
    <div className="sqc-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="sqc" role="dialog" aria-modal="true">
        <button className="sqc-x" onClick={onClose} aria-label="Close">✕</button>
        <div className="sqc-head">
          <span className="chip chip--red">Secure checkout</span>
          <h3>{item.name}</h3>
          <div className="sqc-price">${item.price}{item.unit ? <i> / {item.unit}</i> : null}</div>
        </div>

        {status === "success" ? (
          <div className="sqc-success">
            <div className="sqc-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg></div>
            <h4>Order confirmed — ${item.price} paid</h4>
            <p className="text-muted">Thanks, {name.trim().split(" ")[0]}! A receipt is on its way to {email.trim()}. <b>Pick up your {item.name} at our next KSA event.</b></p>
            {receipt && <a className="sqc-token" href={receipt} target="_blank" rel="noreferrer">View Square receipt ↗</a>}
            <button className="btn" style={{ width: "100%", marginTop: 6 }} onClick={onClose}>Done</button>
          </div>
        ) : status === "unavailable" ? (
          <div className="sqc-note">
            <p className="text-muted" style={{ marginTop: 0 }}>
              Card checkout needs your Square <b>Application ID</b> and <b>Location ID</b>. Set
              <code> REACT_APP_SQUARE_APP_ID</code> and <code>REACT_APP_SQUARE_LOCATION_ID</code> in your .env.
            </p>
            <a className="btn btn--ghost" style={{ width: "100%", marginTop: 6 }} href={config.MERCH_ORDER_URL} target="_blank" rel="noreferrer">Use the order form instead</a>
          </div>
        ) : (
          <div className="sqc-body">
            <label className="sqc-label">Your name</label>
            <input className="sqc-input" type="text" placeholder="First and last name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
            <label className="sqc-label">Email (for your receipt)</label>
            <input className="sqc-input" type="email" placeholder="you@virginia.edu" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            <label className="sqc-label">Card details</label>
            {status === "loading" && <div className="sqc-loading">Loading secure card field…</div>}
            <div className="sqc-cardwrap" ref={cardBox}></div>
            {status === "error" && <p className="sqc-err">{msg}</p>}
            <button className="btn" style={{ width: "100%" }} disabled={status === "paying" || !canPay} onClick={pay}>
              {status === "paying" ? "Processing…" : "Pay $" + item.price}
            </button>
            <p className="sqc-foot">📦 Pick up at our next event · 🔒 secure payment by Square</p>
          </div>
        )}
      </div>

      <style>{`
        .sqc-overlay { position: fixed; inset: 0; z-index: 1000; background: rgba(11,27,58,0.55); backdrop-filter: blur(6px); display: grid; place-items: center; padding: 20px; animation: sqcFade .25s ease; }
        @keyframes sqcFade { from { opacity: 0; } to { opacity: 1; } }
        .sqc { position: relative; width: 100%; max-width: 420px; background: var(--surface); border-radius: var(--r-lg); box-shadow: var(--shadow-lg); padding: 28px; animation: sqcUp .3s var(--ease); }
        @keyframes sqcUp { from { opacity: 0; transform: translateY(16px) scale(.98); } to { opacity: 1; transform: none; } }
        .sqc-x { position: absolute; top: 16px; right: 16px; width: 34px; height: 34px; border-radius: 50%; border: 1px solid var(--line); background: var(--surface); cursor: pointer; font-size: 14px; color: var(--muted); line-height: 1; transition: background .2s; }
        .sqc-x:hover { background: var(--paper-2); }
        .sqc-head { margin-bottom: 20px; }
        .sqc .chip { white-space: nowrap; }
        .sqc-head h3 { font-size: 1.3rem; margin: 12px 0 6px; }
        .sqc-price { font-size: 1.6rem; font-weight: 900; color: var(--blue); letter-spacing: -0.02em; }
        .sqc-price i { font-style: normal; font-size: 0.8rem; font-weight: 500; color: var(--muted); }
        .sqc-label { display: block; font-size: 0.82rem; font-weight: 700; color: var(--muted); margin-bottom: 8px; margin-top: 14px; }
        .sqc-label:first-of-type { margin-top: 0; }
        .sqc-input { width: 100%; padding: 12px 14px; border-radius: var(--r-sm); border: 1px solid var(--line-2); font-family: inherit; font-size: 0.95rem; background: var(--paper); color: var(--text); }
        .sqc-input:focus { outline: none; border-color: var(--blue); background: var(--surface); }
        .sqc-cardwrap { min-height: 48px; border-radius: var(--r-sm); margin-bottom: 16px; }
        .sqc-loading { font-size: 0.86rem; color: var(--muted); padding: 14px 0; }
        .sqc-err { color: var(--red); font-size: 0.86rem; margin: 0 0 14px; }
        .sqc-foot { font-size: 0.76rem; color: var(--muted); text-align: center; margin: 14px 0 0; }
        .sqc-foot b { color: var(--text); }
        .sqc-success { text-align: center; }
        .sqc-check { width: 56px; height: 56px; border-radius: 50%; background: rgba(31,138,91,0.12); color: #1F8A5B; display: grid; place-items: center; margin: 0 auto 14px; }
        .sqc-check svg { width: 28px; height: 28px; }
        .sqc-success h4 { font-size: 1.2rem; margin: 0 0 8px; }
        .sqc-token { display: inline-block; font-size: 0.76rem; background: var(--paper-2); padding: 6px 12px; border-radius: 8px; color: var(--muted); margin: 14px 0; word-break: break-all; }
        .sqc-note code { background: var(--paper-2); padding: 1px 6px; border-radius: 5px; font-size: 0.85em; }
      `}</style>
    </div>
  );
}
