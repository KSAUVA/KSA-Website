/* src/pages/Pos.js — KSA Quick Pay, hidden sales register (route /pos).
   Password gate (config.POS_PASSWORD) → tablet register → pay
   (tap-to-pay / Square card / scan-to-pay QR) → per-day tally. */
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import config from "../config";
import { capturePayment } from "../lib/pay";

/* Catalog mirrors the merch prices. "Custom" charges any amount. */
const POS_CATALOG = [
  { id: "qz",      name: "K-EXPO Quarter-Zip", price: 45, emoji: "🧥", accent: "var(--blue)" },
  { id: "bundle",  name: "Quarter-Zip + Tote", price: 48, emoji: "🎒", accent: "var(--red)" },
  { id: "tee",     name: "KSA 2026 T-Shirt",   price: 14, emoji: "👕", accent: "var(--blue)" },
  { id: "tote",    name: "KSA 2026 Tote Bag",  price: 12, emoji: "👜", accent: "var(--blue)" },
  { id: "teetote", name: "Tee + Tote Bundle",  price: 26, emoji: "🛍️", accent: "var(--red)" },
  { id: "hat",     name: "KSA Hat",            price: 14, emoji: "🧢", accent: "var(--blue)" },
  { id: "key",     name: "Acrylic Keychain",   price: 5,  emoji: "🔑", accent: "var(--blue)" },
  { id: "sticker", name: "Sticker (each)",     price: 2,  emoji: "✦",  accent: "var(--red)" },
];

function todayKey() {
  const d = new Date();
  return "ksa_pos_" + d.getFullYear() + String(d.getMonth() + 1).padStart(2, "0") + String(d.getDate()).padStart(2, "0");
}
function loadTally() {
  try { return JSON.parse(window.localStorage.getItem(todayKey())) || { count: 0, total: 0, items: 0 }; }
  catch (e) { return { count: 0, total: 0, items: 0 }; }
}
function saveTally(t) { try { window.localStorage.setItem(todayKey(), JSON.stringify(t)); } catch (e) {} }
function money(n) { return "$" + (Math.round(n * 100) / 100).toLocaleString(undefined, { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }); }

export default function Pos() {
  const [unlocked, setUnlocked] = useState(() => {
    try { return window.sessionStorage.getItem("ksa_pos_unlocked") === "1"; } catch (e) { return false; }
  });
  if (!unlocked) return <POSGate onUnlock={() => setUnlocked(true)} />;
  return <POSRegister onLock={() => {
    try { window.sessionStorage.removeItem("ksa_pos_unlocked"); } catch (e) {}
    setUnlocked(false);
  }} />;
}

function POSGate({ onUnlock }) {
  const [val, setVal] = useState("");
  const [err, setErr] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => { try { inputRef.current && inputRef.current.focus(); } catch (e) {} }, []);
  const submit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (val.trim().toUpperCase() === config.POS_PASSWORD.toUpperCase()) {
      try { window.sessionStorage.setItem("ksa_pos_unlocked", "1"); } catch (e2) {}
      onUnlock();
    } else { setErr(true); setVal(""); }
  };
  return (
    <div className="pos-gate">
      <form className="pos-gate-card" onSubmit={submit}>
        <span className="pos-gate-logo"><img src={config.PUB + "/images/logo_white.png"} alt="KSA" /></span>
        <span className="pos-gate-kicker">KSA Quick Pay</span>
        <h1>Staff access</h1>
        <p>Enter the team password to open the sales register.</p>
        <input ref={inputRef} type="password" className={"pos-gate-input" + (err ? " err" : "")} placeholder="Password" value={val} autoComplete="off" onChange={(e) => { setVal(e.target.value); setErr(false); }} />
        {err && <span className="pos-gate-err">Incorrect password — try again.</span>}
        <button type="submit" className="pos-gate-btn">Unlock register</button>
        <a className="pos-gate-back" href="/" onClick={(e) => { e.preventDefault(); navigate("/"); }}>← Back to site</a>
      </form>
      <POSStyles />
    </div>
  );
}

function POSRegister({ onLock }) {
  const [lines, setLines] = useState([]);
  const [stage, setStage] = useState("register");
  const [tally, setTally] = useState(loadTally());
  const [keypad, setKeypad] = useState(false);
  const [customAmt, setCustomAmt] = useState("");
  const [lastSale, setLastSale] = useState(0);
  const customSeq = useRef(0);
  const navigate = useNavigate();

  const total = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const itemCount = lines.reduce((s, l) => s + l.qty, 0);

  const addItem = (p) => setLines((cur) => {
    const i = cur.findIndex((l) => l.id === p.id);
    if (i >= 0) { const n = cur.slice(); n[i] = { ...n[i], qty: n[i].qty + 1 }; return n; }
    return [...cur, { key: p.id, id: p.id, name: p.name, price: p.price, qty: 1, emoji: p.emoji }];
  });
  const bump = (key, d) => setLines((cur) => cur.map((l) => l.key === key ? { ...l, qty: l.qty + d } : l).filter((l) => l.qty > 0));
  const removeLine = (key) => setLines((cur) => cur.filter((l) => l.key !== key));
  const clear = () => setLines([]);

  const addCustom = () => {
    const v = Math.round(parseFloat(customAmt) * 100) / 100;
    if (!v || v <= 0) return;
    customSeq.current += 1;
    const key = "custom-" + customSeq.current;
    setLines((cur) => [...cur, { key, id: key, name: "Custom charge", price: v, qty: 1, emoji: "＄" }]);
    setCustomAmt(""); setKeypad(false);
  };

  const recordSale = () => {
    const t = { count: tally.count + 1, total: Math.round((tally.total + total) * 100) / 100, items: tally.items + itemCount };
    setTally(t); saveTally(t); setLastSale(total); setStage("success");
  };
  const newSale = () => { clear(); setStage("register"); };

  return (
    <div className="pos">
      <header className="pos-top">
        <div className="pos-brand">
          <span className="pos-logo"><img src={config.PUB + "/images/logo_white.png"} alt="KSA" /></span>
          <div><b>KSA Quick Pay</b><span>Sales register</span></div>
          <span className="pos-sandbox" title="Test mode — no real money is moved">SANDBOX</span>
        </div>
        <div className="pos-top-right">
          <div className="pos-tally">
            <div className="pt-block"><b>{tally.count}</b><span>sales today</span></div>
            <div className="pt-sep" />
            <div className="pt-block"><b>{money(tally.total)}</b><span>collected</span></div>
          </div>
          <button className="pos-exit" onClick={() => onLock && onLock()} title="Lock the register">Lock 🔒</button>
          <button className="pos-exit" onClick={() => navigate("/")} title="Exit to site">Exit ✕</button>
        </div>
      </header>

      {stage === "register" && (
        <div className="pos-main">
          <section className="pos-catalog">
            <div className="pos-cat-head"><h2>Tap to add</h2><span className="text-muted">{POS_CATALOG.length} items</span></div>
            <div className="pos-grid">
              {POS_CATALOG.map((p) => {
                const inCart = lines.find((l) => l.id === p.id);
                return (
                  <button key={p.id} className={"pos-tile" + (inCart ? " active" : "")} style={{ "--a": p.accent }} onClick={() => addItem(p)}>
                    {inCart && <span className="pos-tile-q">{inCart.qty}</span>}
                    <span className="pos-tile-emoji">{p.emoji}</span>
                    <span className="pos-tile-name">{p.name}</span>
                    <span className="pos-tile-price">{money(p.price)}</span>
                  </button>
                );
              })}
              <button className="pos-tile pos-tile--custom" onClick={() => setKeypad(true)}>
                <span className="pos-tile-emoji">＄</span>
                <span className="pos-tile-name">Custom amount</span>
                <span className="pos-tile-price">Dues · donations</span>
              </button>
            </div>
          </section>

          <aside className="pos-cart">
            <div className="pos-cart-head">
              <h2>Cart</h2>
              {lines.length > 0 && <button className="pos-clear" onClick={clear}>Clear</button>}
            </div>
            <div className="pos-lines">
              {lines.length === 0 ? (
                <div className="pos-empty"><span className="pos-empty-ic">🧾</span><p>Tap items to start a sale</p></div>
              ) : lines.map((l) => (
                <div className="pos-line" key={l.key}>
                  <span className="pos-line-emoji">{l.emoji}</span>
                  <div className="pos-line-info"><b>{l.name}</b><span>{money(l.price)}{l.qty > 1 ? " each" : ""}</span></div>
                  <div className="pos-step">
                    <button onClick={() => bump(l.key, -1)} aria-label="Decrease">−</button>
                    <b>{l.qty}</b>
                    <button onClick={() => bump(l.key, 1)} aria-label="Increase">+</button>
                  </div>
                  <span className="pos-line-total">{money(l.price * l.qty)}</span>
                  <button className="pos-line-x" onClick={() => removeLine(l.key)} aria-label="Remove">✕</button>
                </div>
              ))}
            </div>
            <div className="pos-cart-foot">
              <div className="pos-totalrow"><span>{itemCount} item{itemCount !== 1 ? "s" : ""}</span><span className="pos-grand">{money(total)}</span></div>
              <button className="pos-charge" disabled={total <= 0} onClick={() => setStage("pay")}>Charge {money(total)}</button>
            </div>
          </aside>
        </div>
      )}

      {stage === "pay" && <PayScreen total={total} lines={lines} onCancel={() => setStage("register")} onPaid={recordSale} />}

      {stage === "success" && (
        <div className="pos-success">
          <div className="pos-success-card">
            <div className="pos-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg></div>
            <h2>Paid {money(lastSale)}</h2>
            <p className="text-muted">Payment complete. Hand the customer their items.</p>
            <button className="pos-new" onClick={newSale}>Next customer →</button>
            <div className="pos-success-tally">Today: <b>{tally.count}</b> sales · <b>{money(tally.total)}</b></div>
          </div>
        </div>
      )}

      {keypad && (
        <div className="pos-overlay" onClick={(e) => { if (e.target === e.currentTarget) { setKeypad(false); setCustomAmt(""); } }}>
          <div className="pos-keypad">
            <h3>Custom amount</h3>
            <div className="pos-amt">{customAmt ? money(parseFloat(customAmt) || 0) : "$0"}</div>
            <div className="pos-keys">
              {["1","2","3","4","5","6","7","8","9",".","0","⌫"].map((k) => (
                <button key={k} onClick={() => {
                  if (k === "⌫") return setCustomAmt((s) => s.slice(0, -1));
                  if (k === "." && customAmt.includes(".")) return;
                  if (customAmt.includes(".") && customAmt.split(".")[1] && customAmt.split(".")[1].length >= 2) return;
                  setCustomAmt((s) => (s === "0" && k !== "." ? k : s + k));
                }}>{k}</button>
              ))}
            </div>
            <div className="pos-keypad-foot">
              <button className="pos-kp-cancel" onClick={() => { setKeypad(false); setCustomAmt(""); }}>Cancel</button>
              <button className="pos-kp-add" disabled={!parseFloat(customAmt)} onClick={addCustom}>Add to cart</button>
            </div>
          </div>
        </div>
      )}

      <POSStyles />
    </div>
  );
}

/* Build server-priced line items from the cart. Catalog ids are priced server-side;
   custom charges (dues/donations) pass an explicit amount (register-only). */
function posItems(lines) {
  return lines.map((l) => String(l.id).startsWith("custom-")
    ? { custom: Math.round(l.price * 100), label: l.name, qty: l.qty }
    : { id: l.id, qty: l.qty });
}

function PayScreen({ total, lines, onCancel, onPaid }) {
  const [method, setMethod] = useState("wallet");
  return (
    <div className="pos-pay">
      <div className="pos-pay-left">
        <button className="pos-back" onClick={onCancel}>← Back to cart</button>
        <span className="text-muted" style={{ fontWeight: 600, fontSize: "0.82rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Amount due</span>
        <div className="pos-pay-total">{money(total)}</div>
        <div className="pos-pay-items">
          {lines.map((l) => (<div className="pos-pay-item" key={l.key}><span>{l.qty}× {l.name}</span><b>{money(l.price * l.qty)}</b></div>))}
        </div>
      </div>
      <div className="pos-pay-right">
        <div className="pos-methods">
          {[["wallet", "Tap to pay"], ["card", "Card"], ["qr", "Scan to pay"]].map(([m, label]) => (
            <button key={m} className={"pos-method" + (method === m ? " active" : "")} onClick={() => setMethod(m)}>{label}</button>
          ))}
        </div>
        <div className="pos-method-body">
          {method === "wallet" && <WalletPay total={total} lines={lines} onPaid={onPaid} />}
          {method === "card" && <CardPay total={total} lines={lines} onPaid={onPaid} />}
          {method === "qr" && <QrPay total={total} onPaid={onPaid} />}
        </div>
        <p className="pos-pay-foot">🔒 Square sandbox · no real money is charged in test mode.</p>
      </div>
    </div>
  );
}

function WalletPay({ total, lines, onPaid }) {
  const [state, setState] = useState("init");
  const gbtn = useRef(null);
  const gpayRef = useRef(null);
  const appleRef = useRef(null);
  useEffect(() => {
    let cancelled = false, tries = 0;
    async function go() {
      const app = config.SQUARE_APP_ID, loc = config.SQUARE_LOCATION_ID;
      if (!app || !loc) { setState("none"); return; }
      while (!window.Square && tries < 40 && !cancelled) { await new Promise((r) => setTimeout(r, 100)); tries++; }
      if (cancelled || !window.Square) { setState("none"); return; }
      try {
        const payments = window.Square.payments(app, loc);
        const req = payments.paymentRequest({ countryCode: "US", currencyCode: "USD", total: { amount: total.toFixed(2), label: "KSA at UVA" } });
        let any = false;
        try { const gpay = await payments.googlePay(req); await gpay.attach(gbtn.current, { buttonColor: "black", buttonType: "short" }); gpayRef.current = gpay; any = true; } catch (e) {}
        try { const apple = await payments.applePay(req); appleRef.current = apple; any = true; } catch (e) {}
        if (cancelled) return;
        setState(any ? "ready" : "none");
      } catch (e) { setState("none"); }
    }
    go();
    return () => { cancelled = true; };
  }, [total]);
  const payGoogle = async () => { try { const r = await gpayRef.current.tokenize(); if (r.status === "OK") { await capturePayment({ token: r.token, items: posItems(lines), source: "pos" }); onPaid(); } } catch (e) { console.error("[POS wallet]", e); } };
  const payApple = async () => { try { const r = await appleRef.current.tokenize(); if (r.status === "OK") { await capturePayment({ token: r.token, items: posItems(lines), source: "pos" }); onPaid(); } } catch (e) { console.error("[POS wallet]", e); } };
  return (
    <div className="pos-wallet">
      {state === "init" && <div className="pos-wait">Starting tap-to-pay…</div>}
      <div ref={gbtn} className="pos-gpay" style={{ display: state === "ready" && gpayRef.current ? "block" : "none" }} onClick={payGoogle} />
      {state === "ready" && appleRef.current && <button className="pos-applepay" onClick={payApple}> Pay</button>}
      {(state === "none" || state === "error") && (
        <div className="pos-wallet-none">
          <span className="pos-wallet-ic">📱</span>
          <p><b>Tap-to-pay isn't available here.</b></p>
          <p className="text-muted">Apple&nbsp;Pay &amp; Google&nbsp;Pay need a verified domain and a supported device/browser. On your event tablet they'll appear automatically — use <b>Card</b> or <b>Scan to pay</b> meanwhile.</p>
        </div>
      )}
    </div>
  );
}

function CardPay({ total, lines, onPaid }) {
  const [status, setStatus] = useState("loading");
  const [msg, setMsg] = useState("");
  const box = useRef(null);
  const cardRef = useRef(null);
  useEffect(() => {
    let cancelled = false, tries = 0;
    async function init() {
      const app = config.SQUARE_APP_ID, loc = config.SQUARE_LOCATION_ID;
      if (!app || !loc) { setStatus("none"); return; }
      while (!window.Square && tries < 40 && !cancelled) { await new Promise((r) => setTimeout(r, 100)); tries++; }
      if (cancelled || !window.Square) { setStatus(cancelled ? "loading" : "none"); return; }
      try {
        const payments = window.Square.payments(app, loc);
        const card = await payments.card();
        await card.attach(box.current);
        if (cancelled) { try { card.destroy(); } catch (e) {} return; }
        cardRef.current = card; setStatus("ready");
      } catch (e) { console.error("[Square POS card]", e); setStatus("error"); setMsg(e && e.message ? e.message : "Could not start card entry."); }
    }
    init();
    return () => { cancelled = true; try { cardRef.current && cardRef.current.destroy(); } catch (e) {} };
  }, []);
  const pay = async () => {
    if (!cardRef.current) return;
    setStatus("paying");
    try {
      const r = await cardRef.current.tokenize();
      if (r.status !== "OK") { setStatus("error"); setMsg((r.errors && r.errors[0] && r.errors[0].message) || "Card could not be processed."); return; }
      await capturePayment({ token: r.token, items: posItems(lines), source: "pos" });
      onPaid();
    } catch (e) { setStatus("error"); setMsg(e && e.message ? e.message : "Card could not be processed."); }
  };
  if (status === "none") return (
    <div className="pos-wallet-none"><span className="pos-wallet-ic">▭</span><p><b>Card entry needs Square keys.</b></p><p className="text-muted">Set <code>REACT_APP_SQUARE_APP_ID</code> and <code>REACT_APP_SQUARE_LOCATION_ID</code> to enable the card field.</p></div>
  );
  return (
    <div className="pos-card">
      {status === "loading" && <span className="text-muted" style={{ fontSize: "0.86rem", display: "block", marginBottom: 12 }}>Loading secure card field…</span>}
      <div className="pos-cardbox" ref={box}></div>
      {status === "error" && <p className="pos-card-err">{msg}</p>}
      <button className="pos-paybtn" disabled={status !== "ready" && status !== "error"} onClick={pay}>
        {status === "paying" ? "Processing…" : "Charge " + money(total)}
      </button>
      <p className="pos-testcard">Test card <b>4111 1111 1111 1111</b> · any future date · any CVV · ZIP 12345</p>
    </div>
  );
}

function QrPay({ total, onPaid }) {
  const link = config.SQUARE_PAYMENT_LINK || "";
  const data = link || config.MERCH_ORDER_URL || "https://square.link/u/ksauva";
  const qr = "https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=8&qzone=1&data=" + encodeURIComponent(data);
  return (
    <div className="pos-qr">
      <div className="pos-qr-img"><img src={qr} alt="Scan to pay" /></div>
      <div className="pos-qr-side">
        <p className="pos-qr-amt">Customer pays <b>{money(total)}</b></p>
        <p className="text-muted">Have the customer scan with their phone camera to open the KSA Square checkout and pay from their own device.</p>
        {!link && <p className="pos-qr-warn">⚠ Set <code>REACT_APP_SQUARE_PAYMENT_LINK</code> to your Square checkout link for a real scan-to-pay. Showing the order form as a placeholder.</p>}
        <button className="pos-paybtn" onClick={onPaid}>✓ Mark as paid</button>
      </div>
    </div>
  );
}

function POSStyles() {
  return <style>{`
  .pos { position: fixed; inset: 0; z-index: 500; background: var(--paper); color: var(--text); display: flex; flex-direction: column; font-family: var(--ff); overflow: hidden; }
  .pos-gate { position: fixed; inset: 0; z-index: 500; background: var(--ink); color: #fff; display: grid; place-items: center; padding: 24px; font-family: var(--ff); background-image: radial-gradient(900px 480px at 18% 0%, rgba(10,63,168,0.5), transparent 60%), radial-gradient(820px 420px at 90% 100%, rgba(205,46,58,0.42), transparent 60%); }
  .pos-gate-card { width: 100%; max-width: 380px; text-align: center; display: flex; flex-direction: column; align-items: center; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); border-radius: 24px; padding: 40px 34px; backdrop-filter: blur(12px); box-shadow: var(--shadow-lg); }
  .pos-gate-logo { width: 60px; height: 60px; border-radius: 16px; background: rgba(255,255,255,0.08); display: grid; place-items: center; margin-bottom: 18px; }
  .pos-gate-logo img { width: 42px; height: 42px; object-fit: contain; }
  .pos-gate-kicker { font-size: 0.72rem; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase; color: #9FB4E0; }
  .pos-gate-card h1 { font-size: 1.7rem; font-weight: 900; letter-spacing: -0.02em; margin: 8px 0 6px; }
  .pos-gate-card p { color: #A9B6D6; font-size: 0.94rem; margin: 0 0 24px; }
  .pos-gate-input { width: 100%; padding: 15px 18px; border-radius: 13px; border: 1.5px solid rgba(255,255,255,0.18); background: rgba(11,27,58,0.5); color: #fff; font-family: inherit; font-size: 1.1rem; text-align: center; letter-spacing: 0.1em; transition: border-color .2s; }
  .pos-gate-input::placeholder { color: #6F84B5; letter-spacing: normal; }
  .pos-gate-input:focus { outline: none; border-color: var(--blue-soft); }
  .pos-gate-input.err { border-color: var(--red-soft); animation: posShake .35s; }
  @keyframes posShake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-7px)} 75%{transform:translateX(7px)} }
  .pos-gate-err { color: #FF9AA2; font-size: 0.84rem; font-weight: 600; margin-top: 12px; }
  .pos-gate-btn { width: 100%; margin-top: 18px; padding: 16px; border-radius: 13px; border: none; background: var(--red); color: #fff; font-size: 1.05rem; font-weight: 800; cursor: pointer; box-shadow: 0 12px 26px rgba(205,46,58,0.3); transition: transform .15s var(--ease), box-shadow .2s; }
  .pos-gate-btn:hover { transform: translateY(-2px); box-shadow: 0 18px 34px rgba(205,46,58,0.42); }
  .pos-gate-back { margin-top: 18px; color: #9FB4E0; font-size: 0.88rem; font-weight: 600; cursor: pointer; }
  .pos-gate-back:hover { color: #fff; }
  .pos-top { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 14px 22px; background: var(--ink); color: #fff; flex-shrink: 0; }
  .pos-brand { display: flex; align-items: center; gap: 12px; }
  .pos-logo { width: 42px; height: 42px; border-radius: 11px; background: rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .pos-logo img { width: 30px; height: 30px; object-fit: contain; }
  .pos-brand b { font-size: 1.06rem; line-height: 1.1; display: block; }
  .pos-brand span { font-size: 0.72rem; color: #9FB4E0; letter-spacing: 0.04em; }
  .pos-sandbox { margin-left: 6px; font-size: 0.64rem; font-weight: 800; letter-spacing: 0.14em; color: #FFD7A8; background: rgba(224,169,46,0.18); border: 1px solid rgba(224,169,46,0.4); padding: 4px 9px; border-radius: 999px; align-self: center; }
  .pos-top-right { display: flex; align-items: center; gap: 16px; }
  .pos-tally { display: flex; align-items: center; gap: 16px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 14px; padding: 8px 18px; }
  .pt-block { text-align: center; }
  .pt-block b { display: block; font-size: 1.2rem; font-weight: 900; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }
  .pt-block span { font-size: 0.66rem; color: #9FB4E0; text-transform: uppercase; letter-spacing: 0.06em; }
  .pt-sep { width: 1px; height: 30px; background: rgba(255,255,255,0.14); }
  .pos-exit { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.16); color: #fff; font-weight: 700; font-size: 0.86rem; padding: 10px 16px; border-radius: 11px; cursor: pointer; transition: background .2s; }
  .pos-exit:hover { background: rgba(205,46,58,0.4); }
  .pos-main { flex: 1; display: grid; grid-template-columns: 1fr 384px; min-height: 0; }
  .pos-catalog { padding: 22px; overflow-y: auto; }
  .pos-cat-head { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 16px; }
  .pos-cat-head h2 { font-size: 1.1rem; }
  .pos-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(168px, 1fr)); gap: 14px; }
  .pos-tile { position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 6px; background: var(--surface); border: 1.5px solid var(--line); border-radius: 18px; padding: 18px; cursor: pointer; text-align: left; transition: transform .12s var(--ease), box-shadow .2s, border-color .2s; box-shadow: var(--shadow-sm); min-height: 132px; justify-content: space-between; }
  .pos-tile:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
  .pos-tile:active { transform: scale(.97); }
  .pos-tile.active { border-color: var(--a); box-shadow: 0 0 0 3px color-mix(in srgb, var(--a) 18%, transparent); }
  .pos-tile-emoji { font-size: 1.9rem; line-height: 1; }
  .pos-tile-name { font-weight: 700; font-size: 0.98rem; line-height: 1.2; }
  .pos-tile-price { font-weight: 900; font-size: 1.15rem; color: var(--blue); letter-spacing: -0.02em; }
  .pos-tile-q { position: absolute; top: 12px; right: 12px; min-width: 26px; height: 26px; padding: 0 7px; border-radius: 999px; background: var(--a, var(--red)); color: #fff; font-weight: 800; font-size: 0.86rem; display: grid; place-items: center; box-shadow: var(--shadow-sm); }
  .pos-tile--custom { border-style: dashed; background: transparent; }
  .pos-tile--custom .pos-tile-price { color: var(--muted); font-weight: 600; font-size: 0.82rem; }
  .pos-cart { background: var(--surface); border-left: 1px solid var(--line); display: flex; flex-direction: column; min-height: 0; }
  .pos-cart-head { display: flex; align-items: center; justify-content: space-between; padding: 18px 20px 12px; }
  .pos-cart-head h2 { font-size: 1.1rem; }
  .pos-clear { background: none; border: none; color: var(--red); font-weight: 700; font-size: 0.84rem; cursor: pointer; }
  .pos-lines { flex: 1; overflow-y: auto; padding: 0 14px; }
  .pos-empty { text-align: center; color: var(--muted); padding: 60px 20px; }
  .pos-empty-ic { font-size: 2.4rem; display: block; margin-bottom: 10px; opacity: 0.6; }
  .pos-empty p { margin: 0; font-size: 0.92rem; }
  .pos-line { display: grid; grid-template-columns: auto 1fr auto auto auto; align-items: center; gap: 10px; padding: 12px 8px; border-bottom: 1px solid var(--line); }
  .pos-line-emoji { font-size: 1.4rem; width: 34px; text-align: center; }
  .pos-line-info b { display: block; font-size: 0.92rem; line-height: 1.2; }
  .pos-line-info span { font-size: 0.76rem; color: var(--muted); }
  .pos-step { display: flex; align-items: center; gap: 8px; }
  .pos-step button { width: 30px; height: 30px; border-radius: 9px; border: 1px solid var(--line-2); background: var(--paper); font-size: 1.1rem; font-weight: 700; cursor: pointer; color: var(--ink); line-height: 1; display: grid; place-items: center; transition: background .15s; }
  .pos-step button:hover { background: var(--paper-2); }
  .pos-step b { min-width: 16px; text-align: center; font-variant-numeric: tabular-nums; }
  .pos-line-total { font-weight: 800; font-size: 0.95rem; min-width: 52px; text-align: right; font-variant-numeric: tabular-nums; }
  .pos-line-x { background: none; border: none; color: var(--muted); cursor: pointer; font-size: 0.8rem; padding: 4px; }
  .pos-line-x:hover { color: var(--red); }
  .pos-cart-foot { padding: 16px 20px 20px; border-top: 1px solid var(--line); background: var(--paper); }
  .pos-totalrow { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 14px; }
  .pos-totalrow span:first-child { color: var(--muted); font-size: 0.9rem; }
  .pos-grand { font-size: 2rem; font-weight: 900; letter-spacing: -0.03em; color: var(--ink); font-variant-numeric: tabular-nums; }
  .pos-charge { width: 100%; padding: 18px; border-radius: 15px; border: none; background: var(--red); color: #fff; font-size: 1.2rem; font-weight: 800; cursor: pointer; box-shadow: 0 12px 26px rgba(205,46,58,0.3); transition: transform .15s var(--ease), box-shadow .2s, background .2s; }
  .pos-charge:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 18px 34px rgba(205,46,58,0.4); }
  .pos-charge:active:not(:disabled) { transform: translateY(0); }
  .pos-charge:disabled { background: var(--line-2); color: var(--muted); cursor: not-allowed; box-shadow: none; }
  .pos-pay { flex: 1; display: grid; grid-template-columns: 1fr 1fr; min-height: 0; }
  .pos-pay-left { background: var(--ink); color: #fff; padding: 40px; display: flex; flex-direction: column; overflow-y: auto; }
  .pos-back { align-self: flex-start; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.16); color: #fff; font-weight: 700; font-size: 0.88rem; padding: 10px 16px; border-radius: 11px; cursor: pointer; margin-bottom: 32px; transition: background .2s; }
  .pos-back:hover { background: rgba(255,255,255,0.16); }
  .pos-pay-left .text-muted { color: #9FB4E0 !important; }
  .pos-pay-total { font-size: clamp(3rem, 7vw, 5rem); font-weight: 900; letter-spacing: -0.04em; margin: 8px 0 28px; background: linear-gradient(180deg, #fff, #BCD0FF); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
  .pos-pay-items { display: flex; flex-direction: column; gap: 2px; border-top: 1px solid rgba(255,255,255,0.12); padding-top: 18px; }
  .pos-pay-item { display: flex; justify-content: space-between; padding: 7px 0; font-size: 0.96rem; color: #DCE3F2; }
  .pos-pay-item b { color: #fff; }
  .pos-pay-right { padding: 32px; display: flex; flex-direction: column; overflow-y: auto; }
  .pos-methods { display: flex; gap: 6px; padding: 5px; background: var(--paper-2); border-radius: 14px; margin-bottom: 22px; }
  .pos-method { flex: 1; padding: 13px; border: none; background: none; border-radius: 10px; font-weight: 700; font-size: 0.94rem; color: var(--muted); cursor: pointer; transition: all .2s; }
  .pos-method.active { background: var(--surface); color: var(--ink); box-shadow: var(--shadow-sm); }
  .pos-method-body { flex: 1; }
  .pos-pay-foot { text-align: center; font-size: 0.78rem; color: var(--muted); margin: 20px 0 0; }
  .pos-wallet { display: flex; flex-direction: column; gap: 14px; }
  .pos-wait { color: var(--muted); padding: 30px; text-align: center; }
  .pos-gpay { min-height: 52px; }
  .pos-applepay { width: 100%; padding: 16px; border-radius: 13px; border: none; background: #000; color: #fff; font-size: 1.1rem; font-weight: 600; cursor: pointer; }
  .pos-wallet-none { text-align: center; padding: 26px 18px; background: var(--paper-2); border-radius: 16px; }
  .pos-wallet-ic { font-size: 2rem; display: block; margin-bottom: 8px; }
  .pos-wallet-none p { margin: 4px 0; font-size: 0.92rem; }
  .pos-card { display: flex; flex-direction: column; }
  .pos-cardbox { min-height: 56px; border-radius: 13px; margin-bottom: 16px; }
  .pos-cardbox.loading { border: 1px dashed var(--line-2); display: grid; place-items: center; }
  .pos-card-err { color: var(--red); font-size: 0.86rem; margin: 0 0 12px; }
  .pos-paybtn { width: 100%; padding: 17px; border-radius: 14px; border: none; background: var(--blue); color: #fff; font-size: 1.12rem; font-weight: 800; cursor: pointer; box-shadow: 0 12px 26px rgba(10,63,168,0.3); transition: transform .15s var(--ease), box-shadow .2s; }
  .pos-paybtn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 18px 34px rgba(10,63,168,0.4); }
  .pos-paybtn:disabled { background: var(--line-2); color: var(--muted); cursor: not-allowed; box-shadow: none; }
  .pos-testcard { text-align: center; font-size: 0.78rem; color: var(--muted); margin: 14px 0 0; }
  .pos-testcard b { color: var(--text); }
  .pos-qr { display: grid; grid-template-columns: auto 1fr; gap: 22px; align-items: center; }
  .pos-qr-img { background: #fff; border: 1px solid var(--line); border-radius: 18px; padding: 12px; box-shadow: var(--shadow-sm); }
  .pos-qr-img img { width: 180px; height: 180px; display: block; }
  .pos-qr-amt { font-size: 1.1rem; margin: 0 0 8px; }
  .pos-qr-warn { font-size: 0.76rem; color: #9A6A00; background: rgba(224,169,46,0.14); border: 1px solid rgba(224,169,46,0.34); padding: 8px 11px; border-radius: 10px; margin: 12px 0; }
  .pos-qr-warn code { background: rgba(0,0,0,0.06); padding: 1px 5px; border-radius: 5px; }
  .pos-qr .pos-paybtn { margin-top: 14px; background: var(--ink); box-shadow: none; }
  .pos-success { flex: 1; display: grid; place-items: center; padding: 24px; background: radial-gradient(900px 500px at 50% 0%, rgba(31,138,91,0.10), transparent 60%); }
  .pos-success-card { text-align: center; max-width: 420px; animation: posPop .4s var(--ease); }
  @keyframes posPop { from { opacity: 0; transform: scale(.92) translateY(12px); } to { opacity: 1; transform: none; } }
  .pos-check { width: 92px; height: 92px; border-radius: 50%; background: rgba(31,138,91,0.14); color: #1F8A5B; display: grid; place-items: center; margin: 0 auto 22px; }
  .pos-check svg { width: 46px; height: 46px; }
  .pos-success-card h2 { font-size: 2.6rem; font-weight: 900; letter-spacing: -0.03em; margin: 0 0 8px; }
  .pos-new { margin-top: 26px; padding: 18px 44px; border-radius: 15px; border: none; background: var(--ink); color: #fff; font-size: 1.15rem; font-weight: 800; cursor: pointer; box-shadow: var(--shadow-md); transition: transform .15s var(--ease); }
  .pos-new:hover { transform: translateY(-2px); }
  .pos-success-tally { margin-top: 22px; color: var(--muted); font-size: 0.92rem; }
  .pos-overlay { position: fixed; inset: 0; z-index: 600; background: rgba(11,27,58,0.55); backdrop-filter: blur(6px); display: grid; place-items: center; padding: 20px; animation: posFade .2s ease; }
  @keyframes posFade { from { opacity: 0; } to { opacity: 1; } }
  .pos-keypad { width: 100%; max-width: 360px; background: var(--surface); border-radius: 22px; padding: 24px; box-shadow: var(--shadow-lg); }
  .pos-keypad h3 { font-size: 1.1rem; margin: 0 0 14px; text-align: center; }
  .pos-amt { text-align: center; font-size: 2.6rem; font-weight: 900; letter-spacing: -0.03em; color: var(--ink); padding: 10px; background: var(--paper-2); border-radius: 14px; margin-bottom: 16px; font-variant-numeric: tabular-nums; }
  .pos-keys { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
  .pos-keys button { padding: 18px; border-radius: 13px; border: 1px solid var(--line); background: var(--paper); font-size: 1.3rem; font-weight: 700; cursor: pointer; transition: background .12s; }
  .pos-keys button:hover { background: var(--paper-2); }
  .pos-keys button:active { background: var(--line); }
  .pos-keypad-foot { display: flex; gap: 10px; margin-top: 16px; }
  .pos-kp-cancel { flex: 1; padding: 15px; border-radius: 13px; border: 1px solid var(--line-2); background: var(--surface); font-weight: 700; cursor: pointer; color: var(--muted); }
  .pos-kp-add { flex: 2; padding: 15px; border-radius: 13px; border: none; background: var(--red); color: #fff; font-weight: 800; font-size: 1rem; cursor: pointer; }
  .pos-kp-add:disabled { background: var(--line-2); color: var(--muted); cursor: not-allowed; }
  @media (max-width: 900px) {
    .pos-main { grid-template-columns: 1fr; }
    .pos-cart { border-left: none; border-top: 1px solid var(--line); max-height: 46vh; }
    .pos-pay { grid-template-columns: 1fr; }
    .pos-pay-left { padding: 26px; }
    .pos-pay-total { margin-bottom: 18px; }
    .pos-qr { grid-template-columns: 1fr; text-align: center; }
    .pos-qr-img { justify-self: center; }
    .pos-tally .pt-block span { display: none; }
  }
  `}</style>;
}
