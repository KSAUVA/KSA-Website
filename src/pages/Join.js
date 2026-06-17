import React, { useState } from "react";
import { useReveal } from "../lib/ui";
import { Ico } from "../lib/icons";
import config from "../config";

const JOIN_FORMS = {
  new: { label: "New Member", blurb: "First time joining KSA? Start here.", url: "https://forms.gle/mjsADGCEnfg2wFsB7" },
  returning: { label: "Returning Member", blurb: "Back for another year — welcome back!", url: "https://forms.gle/84u4dcXTzm3XLP887" },
};
const JOIN_STEPS = [
  ["01", "Fill out the form", "Takes about two minutes — name, year, and how to reach you."],
  ["02", "Come to a GBM", "Show up to a general body meeting and say hi. That's it, you're in."],
  ["03", "Pay dues (any time)", "Dues fund events and merch. Pay by card with Square, or send Venmo @ksa_uva — whenever works for you."],
  ["04", "Find your fam", "Get matched into a KSA Family and meet your bigs and littles."],
];
const JOIN_PERKS = ["Weekly socials & hangs", "KSA Families + mentorship", "Priority for K-EXPO acts", "Member-only merch drops", "Cultural nights & food", "Intramural sports teams"];

export default function Join() {
  useReveal();
  const [tab, setTab] = useState("new");
  const f = JOIN_FORMS[tab];
  return (
    <div className="page">
      <section className="jhero">
        <div className="pattern" style={{ opacity: 0.1 }} />
        <div className="wrap" style={{ position: "relative", textAlign: "center" }}>
          <span className="chip chip--ink reveal" style={{ marginBottom: 18 }}>KSA 2025–2026</span>
          <h1 className="h-display reveal d1" style={{ margin: "0 auto 16px" }}>Join the family.</h1>
          <p className="lead reveal d2" style={{ color: "#D6DEF2", maxWidth: 520, margin: "0 auto" }}>
            Pick the form that fits you and you'll be done in under two minutes.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap jcols">
          <div className="reveal">
            <span className="eyebrow"><i className="kicker-dot" />How it works<span className="han">참여 방법</span></span>
            <h2 className="h-lg" style={{ margin: "14px 0 28px" }}>Four steps to becoming a Hoo in KSA.</h2>
            <div className="jsteps">
              {JOIN_STEPS.map(([k, t, d], i) => (
                <div className={"jstep reveal d" + (i + 1)} key={k}>
                  <span className="jstep-k">{k}</span>
                  <div><h4 style={{ margin: "0 0 4px", fontSize: "1.08rem" }}>{t}</h4><p className="text-muted" style={{ margin: 0, fontSize: "0.92rem" }}>{d}</p></div>
                </div>
              ))}
            </div>
            <div className="jperks reveal">
              <h4 style={{ fontSize: "0.82rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", margin: "0 0 14px" }}>What you get</h4>
              <div className="jperk-grid">
                {JOIN_PERKS.map((p) => (<span className="jperk" key={p}><i className="jperk-dot" />{p}</span>))}
              </div>
            </div>
          </div>

          <div className="jform reveal d1">
            <div className="jform-tabs">
              {Object.entries(JOIN_FORMS).map(([k, v]) => (
                <button key={k} className={"jform-tab" + (tab === k ? " active" : "")} onClick={() => setTab(k)}>{v.label}</button>
              ))}
            </div>
            <p className="text-muted" style={{ fontSize: "0.92rem", margin: "16px 0 20px" }}>{f.blurb}</p>
            <div className="jform-mock">
              <div className="jf-head"><span className="jf-logo"><img src={config.PUB + "/images/logo_white.png"} alt="" /></span><div><b>{f.label} Form</b><span>Google Forms · ~2 min</span></div></div>
              {["Full name", "UVA email", "Year / Major", "How did you hear about KSA?"].map((l) => (
                <div className="jf-field" key={l}><label>{l}</label><div className="jf-input" /></div>
              ))}
              <a href={f.url} target="_blank" rel="noreferrer" className="btn" style={{ width: "100%", marginTop: 6 }}>Open the {f.label.toLowerCase()} form {Ico.ext({ width: 16, height: 16 })}</a>
            </div>
            <p className="text-muted" style={{ fontSize: "0.82rem", textAlign: "center", margin: "16px 0 0" }}>Having trouble? <a href={f.url} target="_blank" rel="noreferrer" style={{ color: "var(--blue)", fontWeight: 600 }}>Open in a new tab</a>.</p>
          </div>
        </div>
      </section>

      <style>{`
        .jhero { background: var(--ink); color: #fff; padding: 140px 0 80px; position: relative; overflow: hidden; }
        .jhero::after { content: ""; position: absolute; inset: 0; background: radial-gradient(800px 380px at 50% 0%, rgba(10,63,168,0.5), transparent 60%), radial-gradient(700px 320px at 80% 120%, rgba(205,46,58,0.4), transparent 60%); }
        .jhero .wrap { z-index: 1; }
        .jcols { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: start; }
        .jsteps { display: grid; gap: 16px; margin-bottom: 36px; }
        .jstep { display: flex; gap: 18px; align-items: flex-start; }
        .jstep-k { flex-shrink: 0; width: 44px; height: 44px; border-radius: 13px; display: grid; place-items: center; background: var(--ink); color: #fff; font-weight: 900; font-size: 0.95rem; }
        .jperk-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .jperk { display: flex; align-items: center; gap: 10px; font-size: 0.92rem; font-weight: 600; }
        .jperk-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--red); flex-shrink: 0; }
        .jform { background: var(--surface); border: 1px solid var(--line); border-radius: var(--r-lg); padding: 28px; box-shadow: var(--shadow-md); position: sticky; top: 96px; }
        .jform-tabs { display: flex; gap: 6px; padding: 5px; background: var(--paper-2); border-radius: var(--r-pill); }
        .jform-tab { flex: 1; border: none; background: none; padding: 11px; border-radius: var(--r-pill); font-weight: 700; font-size: 0.92rem; color: var(--muted); cursor: pointer; transition: all .2s; }
        .jform-tab.active { background: var(--ink); color: #fff; box-shadow: var(--shadow-sm); }
        .jform-mock { background: var(--paper); border: 1px solid var(--line); border-radius: var(--r-md); padding: 22px; }
        .jf-head { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
        .jf-logo { width: 40px; height: 40px; border-radius: 11px; background: var(--ink); display: grid; place-items: center; }
        .jf-logo img { width: 28px; height: 28px; }
        .jf-head b { display: block; font-size: 0.98rem; } .jf-head span { font-size: 0.78rem; color: var(--muted); }
        .jf-field { margin-bottom: 14px; }
        .jf-field label { display: block; font-size: 0.84rem; font-weight: 600; color: var(--muted); margin-bottom: 6px; }
        .jf-input { height: 38px; border-radius: 9px; background: var(--surface); border: 1px solid var(--line); }
        @media (max-width: 860px) { .jcols { grid-template-columns: 1fr; gap: 40px; } .jform { position: static; } }
        @media (max-width: 460px) { .jperk-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
