import React, { useState } from "react";
import { useReveal, SecHead } from "../lib/ui";
import { Ico } from "../lib/icons";
import config from "../config";
import SquareCheckout from "../components/SquareCheckout";

const M = config.PUB + "/merch/";
const KEXPO_MERCH = [
  { id: "bundle", name: "Quarter-Zip & Tote Bundle", price: 48, tag: "Best value", img: M + "quarterzip_totebag_bundle.jpg", desc: "K-EXPO quarter-zip paired with the stamp-art tote bag — save $9 when you bundle." },
  { id: "qz", name: "K-EXPO Quarter-Zip", price: 45, tag: "Limited", img: M + "quarterzip.jpg", desc: "Royal blue quarter-zip with the KSA@UVA logo. Soft, warm, and very Charlottesville-winter approved." },
  { id: "hat", name: "KSA Hat", price: 14, img: M + "hat.jpg", desc: "Navy cap with embroidered KSA@UVA wordmark and fan pin." },
  { id: "key", name: "Acrylic Keychain", price: 5, img: M + "keychain.jpg", desc: "Chibi tiger scholar keychain — clip it to anything." },
  { id: "sticker", name: "Sticker Pack", price: 2, unit: "each", img: M + "sticker.jpg", desc: "Four designs: KSA 2025 crest, N Seoul Tower, mugunghwa flower, and traditional window." },
];
const GENERAL_MERCH = [
  { id: "tee", name: "KSA 2026 T-Shirt", price: 14, desc: "Rep KSA with this year's tee." },
  { id: "tote", name: "KSA 2026 Tote Bag", price: 12, desc: "Carry your essentials in style." },
  { id: "teetote", name: "Tee & Tote Bundle", price: 26, desc: "Get both and save when you bundle." },
];
const ORDER_URL = config.MERCH_ORDER_URL;

export default function Merch() {
  useReveal();
  const [checkout, setCheckout] = useState(null);
  return (
    <div className="page">
      <section className="mhero">
        <div className="pattern" style={{ opacity: 0.1 }} />
        <div className="wrap" style={{ position: "relative", textAlign: "center" }}>
          <span className="chip chip--ink reveal" style={{ marginBottom: 18 }}>✺ K-EXPO 2027 · Limited time</span>
          <h1 className="h-display reveal d1" style={{ margin: "0 auto 16px" }}>KSA merch.</h1>
          <p className="lead reveal d2" style={{ color: "#D6DEF2", maxWidth: 480, margin: "0 auto 28px" }}>
            Grab exclusive K-EXPO gear before it's gone. Pay securely by card with Square — tap any item to check out.
          </p>
          <a href={ORDER_URL} target="_blank" rel="noreferrer" className="btn reveal d3">Order now {Ico.ext({ width: 17, height: 17 })}</a>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SecHead eyebrow="Limited edition" han="한정판" title="K-EXPO Collection" sub="Drops only once a year. When it's gone, it's gone." />
          <div className="m-grid">
            {KEXPO_MERCH.map((m, i) => (
              <div role="button" tabIndex={0} onClick={() => setCheckout(m)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setCheckout(m); } }} className={"m-card reveal d" + ((i % 4) + 1)} key={m.id}>
                <div className="m-img">
                  {m.tag && <span className={"m-tag" + (m.tag === "Best value" ? " gold" : "")}>{m.tag}</span>}
                  <img src={m.img} alt={m.name} loading="lazy" />
                </div>
                <div className="m-body">
                  <h3 style={{ fontSize: "1.1rem", margin: "0 0 6px" }}>{m.name}</h3>
                  <p className="text-muted" style={{ margin: "0 0 14px", fontSize: "0.9rem", flex: 1 }}>{m.desc}</p>
                  <div className="m-foot">
                    <span className="m-price">${m.price}{m.unit && <i> / {m.unit}</i>}</span>
                    <span className="m-order">Buy now {Ico.arrow({ width: 14, height: 14 })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--paper-2)", paddingTop: 0, marginTop: -40 }}>
        <div className="wrap" style={{ paddingTop: 72 }}>
          <SecHead eyebrow="Always available" han="기본" title="KSA Basics" sub="Year-round essentials for everyday reppin'." />
          <div className="mg-grid">
            {GENERAL_MERCH.map((m, i) => (
              <div role="button" tabIndex={0} onClick={() => setCheckout(m)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setCheckout(m); } }} className={"mg-card reveal d" + (i + 1)} key={m.name}>
                <div className="mg-ph"><span>{m.name.includes("Bundle") ? "Bundle" : m.name.includes("Tote") ? "Tote" : "Tee"}</span></div>
                <div className="mg-info"><h4 style={{ margin: "0 0 4px", fontSize: "1.02rem" }}>{m.name}</h4><p className="text-muted" style={{ margin: 0, fontSize: "0.86rem" }}>{m.desc}</p></div>
                <span className="m-price" style={{ fontSize: "1.2rem" }}>${m.price}</span>
              </div>
            ))}
          </div>
          <div className="m-cta reveal">
            <h3 style={{ fontSize: "1.4rem", margin: "0 0 8px" }}>Ready to order?</h3>
            <p className="text-muted" style={{ margin: "0 0 22px" }}>Everything ships through one Google Form. Limited time only — get yours today.</p>
            <a href={ORDER_URL} target="_blank" rel="noreferrer" className="btn">Open order form {Ico.ext({ width: 17, height: 17 })}</a>
          </div>
        </div>
      </section>

      <style>{`
        .mhero { background: var(--ink); color: #fff; padding: 140px 0 80px; position: relative; overflow: hidden; }
        .mhero::after { content: ""; position: absolute; inset: 0; background: radial-gradient(800px 360px at 50% 0%, rgba(10,63,168,0.5), transparent 60%), radial-gradient(700px 320px at 50% 130%, rgba(205,46,58,0.45), transparent 60%); }
        .mhero .wrap { z-index: 1; }
        .m-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
        .m-card { display: flex; flex-direction: column; background: var(--surface); border: 1px solid var(--line); border-radius: var(--r-lg); overflow: hidden; box-shadow: var(--shadow-sm); transition: transform .3s var(--ease), box-shadow .3s var(--ease); }
        .m-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); }
        .m-img { position: relative; aspect-ratio: 1; background: var(--paper-2); overflow: hidden; }
        .m-img img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s var(--ease); }
        .m-card:hover .m-img img { transform: scale(1.05); }
        .m-tag { position: absolute; top: 12px; left: 12px; z-index: 1; font-size: 0.68rem; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: #fff; background: var(--red); padding: 5px 11px; border-radius: var(--r-pill); }
        .m-tag.gold { background: #E0A92E; color: var(--ink); }
        .m-body { padding: 20px 22px; display: flex; flex-direction: column; flex: 1; }
        .m-foot { display: flex; justify-content: space-between; align-items: center; }
        .m-price { font-weight: 900; font-size: 1.35rem; color: var(--blue); letter-spacing: -0.02em; }
        .m-price i { font-style: normal; font-size: 0.8rem; font-weight: 500; color: var(--muted); }
        .m-order { display: inline-flex; align-items: center; gap: 6px; font-weight: 700; font-size: 0.86rem; color: var(--red); opacity: 0; transition: opacity .25s; }
        .m-card:hover .m-order { opacity: 1; }
        .mg-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-bottom: 44px; }
        .mg-card { display: flex; align-items: center; gap: 16px; background: var(--surface); border: 1px solid var(--line); border-radius: var(--r-lg); padding: 16px; box-shadow: var(--shadow-sm); transition: transform .3s var(--ease), box-shadow .3s var(--ease); }
        .mg-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); }
        .mg-ph { width: 64px; height: 64px; flex-shrink: 0; border-radius: var(--r-md); background: repeating-linear-gradient(135deg, var(--paper-2), var(--paper-2) 7px, #E9E1D2 7px, #E9E1D2 14px); display: grid; place-items: center; }
        .mg-ph span { font-size: 0.64rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted); }
        .mg-info { flex: 1; }
        .m-cta { text-align: center; background: var(--surface); border: 1px solid var(--line); border-radius: var(--r-lg); padding: 48px 24px; box-shadow: var(--shadow-sm); }
        .m-card, .mg-card { cursor: pointer; }
        .m-card:focus-visible, .mg-card:focus-visible { outline: 2px solid var(--blue); outline-offset: 3px; }
        @media (max-width: 860px) { .m-grid { grid-template-columns: 1fr 1fr; } .mg-grid { grid-template-columns: 1fr; } }
        @media (max-width: 540px) { .m-grid { grid-template-columns: 1fr; } }
      `}</style>
      {checkout && <SquareCheckout item={checkout} onClose={() => setCheckout(null)} />}
    </div>
  );
}
