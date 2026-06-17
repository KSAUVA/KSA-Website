import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useReveal, useParallax, CountUp, SecHead } from "../lib/ui";
import { Ico } from "../lib/icons";
import config from "../config";

const ABOUT_FEATURES = [
  { k: "01", title: "Culture & Community", text: "Lunar New Year, Chuseok, food nights, and socials that bring people together across Grounds." },
  { k: "02", title: "Signature Events", text: "Hanguk Day and K-EXPO showcase student performers and orgs in an action-packed day." },
  { k: "03", title: "Service & Outreach", text: "Volunteer projects and collaborations with other student organizations all year long." },
];
const ABOUT_STATS = [["1000", "+", "Members"], ["30", "+", "Events / year"], ["15", "+", "Campus partners"]];
// NOTE: your public/abtPhotos uses mixed-case extensions — matched exactly here.
const ABOUT_PHOTOS = [
  config.PUB + "/abtPhotos/abt_1.JPG",
  config.PUB + "/abtPhotos/abt_2.JPG",
  config.PUB + "/abtPhotos/abt_3.jpg",
  config.PUB + "/abtPhotos/abt_4.JPG",
  config.PUB + "/abtPhotos/abt_5.jpg",
  config.PUB + "/abtPhotos/abt_6.jpg",
];
const FAQ = [
  ["Do I have to be Korean to join?", "Nope! KSA is open to everyone interested in Korean culture, language, food, and community."],
  ["How do I become a member?", "Hit “Join KSA,” fill out the quick form, and come to a general body meeting. Dues can be paid any time during the semester."],
  ["How can I stay updated?", "Follow our Instagram, join the mailing list, and check the Events page — we post monthly calendars and weekly reminders."],
  ["What are KSA Families?", "A mentorship system pairing new members with upperclassmen “bigs.” Families bond all year through games, food, and friendly competition."],
];

function AboutHero() {
  const bgRef = useRef(null);
  useParallax(bgRef, 0.12);
  return (
    <section className="ahero">
      <div className="ahero__bgwrap"><div className="ahero__bg" ref={bgRef} /></div>
      <div className="ahero__veil" />
      <div className="wrap ahero__inner">
        <span className="eyebrow eyebrow--light"><i className="kicker-dot" />About<span className="han">소개</span></span>
        <h1 className="h-display" style={{ margin: "18px 0 18px", maxWidth: 820 }}>Promoting Korean culture, building community.</h1>
        <p className="lead" style={{ color: "#D6DEF2", maxWidth: 600 }}>
          The Korean Student Association at UVA creates unforgettable experiences on Grounds —
          for students from every background.
        </p>
        <div className="ahero__chips">
          <span className="chip chip--ink">Founded 2013</span>
          <span className="chip chip--ink">Open to all Hoos</span>
          <span className="chip chip--ink">Culture · Community · Service</span>
        </div>
      </div>
      <style>{`
        .ahero { position: relative; color: #fff; padding: 150px 0 96px; overflow: hidden; background: var(--ink); }
        .ahero__bgwrap { position: absolute; inset: 0; overflow: hidden; }
        .ahero__bg { position: absolute; inset: -8% 0; background: url('${config.PUB}/abtPhotos/abt_main.jpg') center/cover; transform: scale(1.12); }
        .ahero__veil { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(11,27,58,0.78), rgba(11,27,58,0.62) 50%, rgba(11,27,58,0.92)); }
        .ahero__inner { position: relative; z-index: 1; }
        .ahero__chips { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 26px; }
      `}</style>
    </section>
  );
}

export default function About() {
  useReveal();
  const [open, setOpen] = useState(0);
  return (
    <div className="page">
      <AboutHero />

      <section className="section">
        <div className="wrap">
          <div className="story reveal">
            <h2 className="h-lg" style={{ maxWidth: 560 }}>We're dedicated to celebrating heritage and connecting students across Grounds.</h2>
            <p className="text-muted" style={{ maxWidth: 440 }}>
              KSA at UVA fosters cross-cultural exchange and a strong community. We host events and
              activities all year to share our culture and welcome anyone curious about it.
            </p>
          </div>
          <div className="feat-grid">
            {ABOUT_FEATURES.map((f, i) => (
              <div className={"card lift feat reveal d" + (i + 1)} key={f.k}>
                <span className="feat-k">{f.k}</span>
                <h3 style={{ fontSize: "1.25rem", margin: "14px 0 8px" }}>{f.title}</h3>
                <p className="text-muted" style={{ margin: 0, fontSize: "0.95rem" }}>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
        <style>{`
          .story { display: flex; justify-content: space-between; gap: 40px; align-items: flex-end; margin-bottom: 44px; flex-wrap: wrap; }
          .feat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
          .feat { padding: 30px 26px; }
          .feat-k { display: inline-grid; place-items: center; width: 46px; height: 46px; border-radius: 13px; background: rgba(10,63,168,0.08); color: var(--blue); font-weight: 900; font-size: 1.05rem; }
          @media (max-width: 860px) { .feat-grid { grid-template-columns: 1fr; } }
        `}</style>
      </section>

      <section className="section dark" style={{ padding: "76px 0" }}>
        <div className="pattern" style={{ opacity: 0.12 }} />
        <div className="wrap" style={{ position: "relative" }}>
          <div className="abs-grid">
            {ABOUT_STATS.map(([n, s, l], i) => (
              <div className={"reveal d" + (i + 1)} key={l} style={{ textAlign: "center" }}>
                <div className="sb-num" style={{ fontSize: "clamp(2.6rem,5vw,3.8rem)", fontWeight: 900, letterSpacing: "-0.04em", background: "linear-gradient(180deg,#fff,#BCD0FF)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}><CountUp end={parseInt(n)} suffix={s} /></div>
                <div style={{ color: "#A9B6D6", fontWeight: 600, marginTop: 6 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <style>{`.abs-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 30px; } @media (max-width:640px){ .abs-grid{ grid-template-columns:1fr; gap:34px; } }`}</style>
      </section>

      <section className="section">
        <div className="wrap">
          <SecHead eyebrow="In the moment" han="순간들" title="Recent moments from KSA" sub="Food nights, showcases, study sessions, and the in-betweens." />
          <div className="apg">
            {ABOUT_PHOTOS.map((src, i) => (
              <Link to="/gallery" className={"apg-item reveal d" + ((i % 6) + 1)} key={src}>
                <img src={src} alt={"KSA moment " + (i + 1)} loading="lazy" />
                <span className="apg-view">{Ico.ext({ width: 18, height: 18 })}</span>
              </Link>
            ))}
          </div>
        </div>
        <style>{`
          .apg { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
          .apg-item { position: relative; aspect-ratio: 1; border-radius: var(--r-md); overflow: hidden; box-shadow: var(--shadow-sm); }
          .apg-item img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s var(--ease), filter .5s var(--ease); }
          .apg-item:hover img { transform: scale(1.06); filter: brightness(0.82); }
          .apg-view { position: absolute; inset: 0; display: grid; place-items: center; color: #fff; opacity: 0; transition: opacity .3s; }
          .apg-item:hover .apg-view { opacity: 1; }
          @media (max-width: 700px) { .apg { grid-template-columns: 1fr 1fr; } }
        `}</style>
      </section>

      <section className="section" style={{ background: "var(--paper-2)" }}>
        <div className="wrap faq-wrap">
          <div className="reveal">
            <span className="eyebrow"><i className="kicker-dot" />Good to know<span className="han">FAQ</span></span>
            <h2 className="h-xl" style={{ margin: "14px 0 18px" }}>Questions, answered.</h2>
            <p className="text-muted" style={{ maxWidth: 320 }}>Still curious? Reach out to our exec board on Instagram and we'll get back to you fast.</p>
            <Link to="/join" className="btn btn--ink" style={{ marginTop: 18 }}>Join KSA {Ico.arrow({ className: "arrow", width: 16, height: 16 })}</Link>
          </div>
          <div className="faq reveal d1">
            {FAQ.map(([q, a], i) => (
              <div className={"faq-item" + (open === i ? " open" : "")} key={i}>
                <button className="faq-q" onClick={() => setOpen(open === i ? -1 : i)}>
                  <span>{q}</span><i className="faq-ic" />
                </button>
                <div className="faq-a"><p>{a}</p></div>
              </div>
            ))}
          </div>
        </div>
        <style>{`
          .faq-wrap { display: grid; grid-template-columns: 0.85fr 1.15fr; gap: 56px; align-items: start; }
          .faq { display: grid; gap: 12px; }
          .faq-item { background: var(--surface); border: 1px solid var(--line); border-radius: var(--r-md); overflow: hidden; transition: border-color .25s, box-shadow .25s; }
          .faq-item.open { border-color: var(--line-2); box-shadow: var(--shadow-sm); }
          .faq-q { width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 20px 22px; background: none; border: none; cursor: pointer; font-weight: 700; font-size: 1.02rem; color: var(--text); text-align: left; }
          .faq-ic { position: relative; width: 16px; height: 16px; flex-shrink: 0; }
          .faq-ic::before, .faq-ic::after { content: ""; position: absolute; background: var(--red); border-radius: 2px; transition: transform .3s var(--ease); }
          .faq-ic::before { left: 0; top: 7px; width: 16px; height: 2px; }
          .faq-ic::after { left: 7px; top: 0; width: 2px; height: 16px; }
          .faq-item.open .faq-ic::after { transform: scaleY(0); }
          .faq-a { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .35s var(--ease); }
          .faq-item.open .faq-a { grid-template-rows: 1fr; }
          .faq-a > p { overflow: hidden; margin: 0; padding: 0 22px; color: var(--muted); transition: padding .35s var(--ease); }
          .faq-item.open .faq-a > p { padding: 0 22px 22px; }
          @media (max-width: 820px) { .faq-wrap { grid-template-columns: 1fr; gap: 32px; } }
        `}</style>
      </section>
    </div>
  );
}
