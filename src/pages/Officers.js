import React from "react";
import { Link } from "react-router-dom";
import { useReveal } from "../lib/ui";
import { Ico } from "../lib/icons";
import config from "../config";

const B = config.PUB + "/boardPhotos/";

const EXEC = [
  { name: "Bonny Koo", role: "President", photo: B + "bonny.webp" },
  { name: "Hannah Lee", role: "Vice President", photo: B + "hannah.webp" },
  { name: "Alicia Yoo", role: "Secretary", photo: B + "alicia.webp" },
];
const COUNCIL = [
  { committee: "Internal", members: [
    { name: "Alana Li", photo: B + "alana.webp" },
    { name: "Sam Leal", photo: B + "sam.webp" },
    { name: "Esther Kong", photo: B + "esther.webp" },
  ]},
  { committee: "Culture", members: [
    { name: "Nuri Han", photo: B + "nuri.webp" },
    { name: "Dahyun Lee", photo: B + "dahyun.webp" },
    { name: "Je Young Yoo", photo: B + "jeyoung.webp" },
  ]},
  { committee: "Social", members: [
    { name: "Elliot Park", photo: B + "elliot.webp" },
    { name: "Hailey Chong", photo: B + "hailey.webp" },
  ]},
  { committee: "Outreach", members: [
    { name: "Vivian Nguyen", photo: B + "vivian.webp" },
    { name: "Isabel Vikesland", photo: B + "isabel.webp" },
  ]},
  { committee: "Fundraising", members: [
    { name: "Grace Noh", photo: B + "grace.webp" },
    { name: "Sujin Gahng", photo: B + "sujin.webp" },
  ]},
  { committee: "PR", members: [
    { name: "Hein Cho", photo: B + "hein.webp" },
    { name: "Donna Park", photo: B + "donna.webp" },
    { name: "Yujin Seo", photo: B + "yujin.webp" },
  ]},
  { committee: "Historian", members: [
    { name: "Annamaria Lund", photo: B + "anna.webp" },
    { name: "Alejandro Rodriguez", photo: B + "alejandro.webp" },
    { name: "Fatima Afilal", photo: B + "fatima.webp" },
  ]},
  { committee: "Sports", members: [
    { name: "Pierce Tan", photo: B + "pierce.webp" },
    { name: "Leo Lee", photo: B + "leo.webp" },
    { name: "Daniel Son", photo: B + "danson.webp" },
  ]},
  { committee: "Webmaster", members: [
    { name: "Danniel Cao", photo: B + "danniel.webp" },
    { name: "Talaal Maxood", photo: B + "talaal.webp" },
  ]},
  { committee: "Advisors", members: [
    { name: "Samantha Chin", photo: B + "samantha.webp" },
    { name: "Rachel Kang", photo: B + "rachel.webp" },
  ]},
];

function OfficerCard({ p, role, big, idx }) {
  return (
    <div className={"oc reveal d" + ((idx % 4) + 1) + (big ? " oc--big" : "")}>
      <div className="oc-photo"><img src={p.photo} alt={p.name} loading="lazy" /><span className="oc-glow" /></div>
      <div className="oc-body">
        <h4 className="oc-name">{p.name}</h4>
        <span className="oc-role">{role || p.role}</span>
      </div>
    </div>
  );
}

export default function Officers() {
  useReveal();
  return (
    <div className="page">
      <section className="ohero">
        <div className="pattern" style={{ opacity: 0.1 }} />
        <div className="wrap" style={{ position: "relative", textAlign: "center" }}>
          <span className="eyebrow eyebrow--light reveal"><i className="kicker-dot" />The team<span className="han">운영진</span></span>
          <h1 className="h-display reveal d1" style={{ margin: "18px auto 16px" }}>Meet the board.</h1>
          <p className="lead reveal d2" style={{ color: "#D6DEF2", maxWidth: 560, margin: "0 auto" }}>
            The students who plan every event, run every committee, and keep KSA running all year.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="ogroup-label reveal"><span className="line" /><h2>Executive Board</h2><span className="line" /></div>
          <div className="exec-grid">
            {EXEC.map((p, i) => <OfficerCard key={p.name} p={p} big idx={i} />)}
          </div>

          <div className="ogroup-label reveal" style={{ marginTop: 72 }}><span className="line" /><h2>Council</h2><span className="line" /></div>
          {COUNCIL.map((g) => (
            <div className="committee" key={g.committee}>
              <h3 className="committee-name reveal">{g.committee}</h3>
              <div className={"council-grid" + (g.members.length === 2 ? " council-grid--2" : "")}>
                {g.members.map((p, i) => <OfficerCard key={p.name} p={p} role={g.committee + (g.committee === "Advisors" ? "" : " Chair")} idx={i} />)}
              </div>
            </div>
          ))}

          <div className="reveal" style={{ textAlign: "center", marginTop: 64 }}>
            <p className="text-muted" style={{ marginBottom: 16 }}>Want to help plan it all next year?</p>
            <Link to="/join" className="btn">Get involved {Ico.arrow({ className: "arrow", width: 17, height: 17 })}</Link>
          </div>
        </div>
      </section>

      <style>{`
        .ohero { background: var(--ink); color: #fff; padding: 140px 0 84px; position: relative; overflow: hidden; }
        .ohero::after { content: ""; position: absolute; inset: 0; background: radial-gradient(900px 400px at 20% 0%, rgba(10,63,168,0.5), transparent 60%), radial-gradient(800px 360px at 90% 100%, rgba(205,46,58,0.4), transparent 60%); }
        .ohero .wrap { z-index: 1; }
        .ogroup-label { display: flex; align-items: center; gap: 22px; margin-bottom: 40px; }
        .ogroup-label h2 { font-size: 0.92rem; font-weight: 800; letter-spacing: 0.22em; text-transform: uppercase; color: var(--ink); white-space: nowrap; }
        .ogroup-label .line { height: 1px; flex: 1; background: var(--line-2); }
        .exec-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .committee { margin-top: 48px; }
        .committee-name { font-size: 1.5rem; font-weight: 800; text-align: center; margin-bottom: 24px; letter-spacing: -0.02em; }
        .council-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
        .council-grid--2 { grid-template-columns: repeat(2, 1fr); max-width: 680px; margin: 0 auto; }
        .oc { background: var(--surface); border: 1px solid var(--line); border-radius: var(--r-lg); overflow: hidden; box-shadow: var(--shadow-sm); transition: transform .35s var(--ease), box-shadow .35s var(--ease); }
        .oc:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); }
        .oc-photo { position: relative; aspect-ratio: 4/3; overflow: hidden; background: var(--paper-2); }
        .oc--big .oc-photo { aspect-ratio: 4/3.4; }
        .oc-photo img { width: 100%; height: 100%; object-fit: cover; transition: transform .55s var(--ease); }
        .oc:hover .oc-photo img { transform: scale(1.07); }
        .oc-glow { position: absolute; inset: 0; background: linear-gradient(to top, rgba(11,27,58,0.42), transparent 45%); opacity: 0; transition: opacity .4s; }
        .oc:hover .oc-glow { opacity: 1; }
        .oc-body { padding: 16px 18px 18px; }
        .oc-name { font-size: 1.08rem; margin: 0 0 6px; letter-spacing: -0.01em; }
        .oc--big .oc-name { font-size: 1.25rem; }
        .oc-role { display: inline-block; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--blue); background: rgba(10,63,168,0.08); padding: 4px 11px; border-radius: var(--r-pill); }
        .oc--big .oc-role { color: var(--red); background: rgba(205,46,58,0.09); }
        @media (max-width: 820px) { .exec-grid, .council-grid, .council-grid--2 { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 480px) { .exec-grid, .council-grid, .council-grid--2 { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
