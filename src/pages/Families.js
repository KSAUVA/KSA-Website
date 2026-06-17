import React from "react";
import { Link } from "react-router-dom";
import { useReveal, SecHead } from "../lib/ui";
import { Ico } from "../lib/icons";

export default function Families() {
  useReveal();
  return (
    <div className="page">
      <section className="fhero">
        <div className="pattern" style={{ opacity: 0.1 }} />
        <div className="wrap" style={{ position: "relative" }}>
          <div className="fhero__grid">
            <div className="reveal">
              <span className="eyebrow eyebrow--light"><i className="kicker-dot" />KSA Families<span className="han">가족</span></span>
              <h1 className="h-display" style={{ margin: "18px 0 16px" }}>Your home<br />away from home.</h1>
              <p className="lead" style={{ color: "#D6DEF2", maxWidth: 480, marginBottom: 26 }}>
                Every member gets matched into a KSA Family — a crew of bigs and littles who bond all
                year through games, food, and a little friendly competition.
              </p>
              <span className="chip chip--ink"><span className="f-soon-dot" />Reveal coming Fall 2026</span>
            </div>
            <div className="fhero__card reveal d1">
              <div className="f-tree">
                <div className="f-node f-node--big">Big</div>
                <div className="f-line" />
                <div className="f-row"><div className="f-node">Little</div><div className="f-node">Little</div></div>
                <div className="f-row f-row--g"><div className="f-node f-node--sm">You</div><div className="f-node f-node--sm">+ friends</div><div className="f-node f-node--sm">+ friends</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SecHead eyebrow="Why families" han="왜" title="More than a name on a roster" sub="Families are the heart of KSA — how a thousand-member org still feels small and personal." center />
          <div className="f-cards">
            {[
              ["Mentorship", "Upperclassmen bigs help you find classes, dining halls, and your footing on Grounds."],
              ["Built-in friends", "Skip the awkward first weeks — your fam is your instant group chat and study crew."],
              ["Fam competitions", "Earn points all semester at socials and the Fam Olympics. Bragging rights on the line."],
            ].map(([t, d], i) => (
              <div className={"card lift f-card reveal d" + (i + 1)} key={t}>
                <span className="f-card-num">0{i + 1}</span>
                <h3 style={{ fontSize: "1.2rem", margin: "12px 0 8px" }}>{t}</h3>
                <p className="text-muted" style={{ margin: 0, fontSize: "0.94rem" }}>{d}</p>
              </div>
            ))}
          </div>
          <div className="f-cta reveal">
            <h3 style={{ fontSize: "1.5rem", margin: "0 0 8px" }}>Want in on a family this year?</h3>
            <p className="text-muted" style={{ margin: "0 0 22px" }}>Join KSA and you'll be matched at the next Families Reveal.</p>
            <Link to="/join" className="btn">Join KSA {Ico.arrow({ className: "arrow", width: 17, height: 17 })}</Link>
          </div>
        </div>
      </section>

      <style>{`
        .fhero { background: var(--ink); color: #fff; padding: 140px 0 96px; position: relative; overflow: hidden; }
        .fhero::after { content: ""; position: absolute; inset: 0; background: radial-gradient(900px 420px at 12% 0%, rgba(10,63,168,0.55), transparent 60%), radial-gradient(820px 380px at 95% 100%, rgba(205,46,58,0.45), transparent 60%); }
        .fhero .wrap { z-index: 1; }
        .fhero__grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 48px; align-items: center; }
        .f-soon-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--red-soft); box-shadow: 0 0 0 0 rgba(226,84,94,0.6); animation: pulse 2s infinite; }
        .fhero__card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.14); border-radius: var(--r-lg); padding: 36px; backdrop-filter: blur(10px); }
        .f-tree { display: flex; flex-direction: column; align-items: center; gap: 14px; }
        .f-node { padding: 12px 22px; border-radius: var(--r-pill); background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); font-weight: 700; font-size: 0.92rem; }
        .f-node--big { background: var(--red); border-color: var(--red); font-size: 1.05rem; padding: 14px 30px; }
        .f-node--sm { font-size: 0.8rem; padding: 9px 16px; background: rgba(10,63,168,0.4); }
        .f-line { width: 2px; height: 20px; background: rgba(255,255,255,0.3); }
        .f-row { display: flex; gap: 14px; }
        .f-row--g { gap: 10px; flex-wrap: wrap; justify-content: center; }
        .f-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; margin-bottom: 48px; }
        .f-card { padding: 30px 26px; }
        .f-card-num { font-size: 2rem; font-weight: 900; letter-spacing: -0.04em; color: var(--blue); opacity: 0.25; }
        .f-cta { text-align: center; background: var(--paper-2); border: 1px solid var(--line); border-radius: var(--r-lg); padding: 52px 24px; }
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(226,84,94,0.6); } 70% { box-shadow: 0 0 0 9px rgba(226,84,94,0); } 100% { box-shadow: 0 0 0 0 rgba(226,84,94,0); } }
        @media (max-width: 880px) { .fhero__grid { grid-template-columns: 1fr; } .f-cards { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
