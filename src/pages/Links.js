import React from "react";
import { useReveal } from "../lib/ui";
import { Ico } from "../lib/icons";
import config from "../config";

const SQUARE_DUES_URL = config.SQUARE_PAYMENT_LINK || "https://square.link/u/ksauva";

const LINK_SECTIONS = [
  { cat: "General", han: "일반", links: [
    { t: "General Body Calendar", d: "Add the KSA calendar to your Google account.", u: "https://calendar.google.com/calendar/embed?src=16d193ff4d2f291421e7cfeeaf0cb1d742244952b05d33278d8feb7c22fb18a7%40group.calendar.google.com&ctz=America%2FNew_York" },
    { t: "New Member Form", d: "First time joining? Start here.", u: "https://forms.gle/mjsADGCEnfg2wFsB7" },
    { t: "Returning Member Form", d: "Back for another year — welcome!", u: "https://forms.gle/84u4dcXTzm3XLP887" },
  ]},
  { cat: "Payments", han: "회비", links: [
    { t: "Pay Dues with Square", d: "Card, Apple Pay & Google Pay · secure checkout", u: SQUARE_DUES_URL, primary: true },
    { t: "Venmo", d: "@ksa_uva", u: "https://venmo.com/u/ksa_uva" },
    { t: "Zelle", d: "bonnykoo@gmail.com", u: "mailto:bonnykoo@gmail.com" },
  ]},
  { cat: "Sports", han: "스포츠", links: [
    { t: "TFT Tournament", d: "Teamfight Tactics tournament signup.", u: "https://forms.gle/KnmJY2aSXs1yqkYz5" },
    { t: "IM Interest Form", d: "Intramural sports interest form.", u: "https://docs.google.com/forms/d/e/1FAIpQLSdTAWOW-AFwkYhuBh5JKW8IefwlwON5iptuSSbS9REWalh0aw/viewform" },
  ]},
  { cat: "Culture", han: "문화", links: [
    { t: "K-EXPO Internal Act Form", d: "Interest form for internal K-EXPO acts.", u: "https://forms.gle/UDNGkbipeafRSNjV7" },
    { t: "K-EXPO External Act Form", d: "Interest form for external K-EXPO acts.", u: "https://forms.gle/pfGojwy8Kbf1HVuV9" },
  ]},
  { cat: "PR", han: "홍보", links: [
    { t: "Merch Order Form", d: "Order KSA merchandise.", u: "https://forms.gle/kWvHG2VgFQd73Mtc6" },
  ]},
];

export default function Links() {
  useReveal();
  return (
    <div className="page">
      <section className="lhero">
        <div className="pattern" style={{ opacity: 0.1 }} />
        <div className="wrap" style={{ position: "relative", textAlign: "center" }}>
          <span className="eyebrow eyebrow--light reveal"><i className="kicker-dot" />Quick links<span className="han">링크</span></span>
          <h1 className="h-display reveal d1" style={{ margin: "18px auto 16px" }}>Everything in one place.</h1>
          <p className="lead reveal d2" style={{ color: "#D6DEF2", maxWidth: 480, margin: "0 auto" }}>All the forms, calendars, and payments you need — no more digging through Instagram bios.</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap" style={{ maxWidth: 960 }}>
          {LINK_SECTIONS.map((s) => (
            <div className="l-section" key={s.cat}>
              <div className="l-cat reveal"><h2>{s.cat}</h2><span className="l-han">{s.han}</span><span className="l-line" /></div>
              <div className="l-grid">
                {s.links.map((l, i) => (
                  <a href={l.u} target="_blank" rel="noreferrer" className={"l-card reveal d" + ((i % 4) + 1) + (l.primary ? " l-card--primary" : "")} key={l.t}>
                    <div className="l-card-top"><span className="l-ico">{l.primary ? Ico.card({ width: 18, height: 18 }) : Ico.ext({ width: 18, height: 18 })}</span></div>
                    <h4 style={{ margin: "14px 0 6px", fontSize: "1.05rem" }}>{l.t}</h4>
                    <p className="text-muted" style={{ margin: 0, fontSize: "0.88rem", whiteSpace: "pre-line" }}>{l.d}</p>
                    <span className="l-go">{l.primary ? "Pay now" : "Open link"} {Ico.arrow({ width: 14, height: 14 })}</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .lhero { background: var(--ink); color: #fff; padding: 140px 0 80px; position: relative; overflow: hidden; }
        .lhero::after { content: ""; position: absolute; inset: 0; background: radial-gradient(800px 360px at 50% 0%, rgba(10,63,168,0.5), transparent 60%), radial-gradient(700px 320px at 50% 130%, rgba(205,46,58,0.42), transparent 60%); }
        .lhero .wrap { z-index: 1; }
        .l-section { margin-bottom: 48px; }
        .l-cat { display: flex; align-items: center; gap: 16px; margin-bottom: 22px; }
        .l-cat h2 { font-size: 1.4rem; letter-spacing: -0.02em; }
        .l-han { color: var(--blue); font-weight: 700; font-size: 0.95rem; }
        .l-line { flex: 1; height: 1px; background: var(--line); }
        .l-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
        .l-card { display: flex; flex-direction: column; background: var(--surface); border: 1px solid var(--line); border-radius: var(--r-lg); padding: 22px; box-shadow: var(--shadow-sm); transition: transform .3s var(--ease), box-shadow .3s var(--ease), border-color .3s; }
        .l-card:hover { transform: translateY(-5px); box-shadow: var(--shadow-md); border-color: var(--line-2); }
        .l-ico { display: inline-grid; place-items: center; width: 42px; height: 42px; border-radius: 12px; background: rgba(10,63,168,0.08); color: var(--blue); transition: background .3s, color .3s; }
        .l-card:hover .l-ico { background: var(--blue); color: #fff; }
        .l-go { margin-top: 16px; display: inline-flex; align-items: center; gap: 6px; font-weight: 700; font-size: 0.84rem; color: var(--red); opacity: 0; transform: translateY(4px); transition: opacity .25s, transform .25s; }
        .l-card:hover .l-go { opacity: 1; transform: none; }
        .l-card--primary { background: var(--ink); border-color: var(--ink); }
        .l-card--primary h4, .l-card--primary .l-go { color: #fff; }
        .l-card--primary .text-muted { color: #A9B6D6 !important; }
        .l-card--primary .l-ico { background: var(--red); color: #fff; }
        .l-card--primary:hover .l-ico { background: #fff; color: var(--red); }
        .l-card--primary .l-go { color: #FF9AA2; }
        @media (max-width: 820px) { .l-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 520px) { .l-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
