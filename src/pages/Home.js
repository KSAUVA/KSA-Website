import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useReveal, useParallax, useCountdown, CountUp, KEXPO_DATE } from "../lib/ui";
import { useGCalEvents } from "../lib/data";
import { Ico } from "../lib/icons";
import config from "../config";

function HomeHero() {
  const bgRef = useRef(null);
  useParallax(bgRef, 0.14);
  const cd = useCountdown(KEXPO_DATE);
  return (
    <section className="hero">
      <div className="hero__bgwrap"><div className="hero__bg" ref={bgRef} /></div>
      <div className="hero__veil" />
      <div className="wrap hero__inner">
        <div className="hero__content">
          <span className="eyebrow eyebrow--light hero__kick reveal"><i className="kicker-dot" />한인 학생회<span className="han">· KSA at UVA</span></span>
          <h1 className="h-display hero__title">
            <span className="ln reveal d1">Korean culture,</span>
            <span className="ln reveal d2">community &amp;</span>
            <span className="ln reveal d3"><em>connection</em> on Grounds.</span>
          </h1>
          <p className="lead hero__sub reveal d4">
            We celebrate Korean heritage, build cross-cultural friendships, and make UVA
            feel a little more like home — open to every Hoo.
          </p>
          <div className="hero__cta reveal d5">
            <Link to="/join" className="btn">Join KSA {Ico.arrow({ className: "arrow", width: 18, height: 18 })}</Link>
            <Link to="/about" className="btn btn--light">Discover our story</Link>
          </div>
          <div className="hero__stats reveal d6">
            {[["1000", "+", "Members"], ["30", "+", "Events / year"], ["2013", "", "Founded", true]].map(([n, s, l, plain]) => (
              <div className="hero__stat" key={l}>
                <div className="num"><CountUp end={parseInt(n)} suffix={s} plain={!!plain} /></div>
                <div className="lbl">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {!cd.done && (
        <Link to="/events" className="hero__countdown">
          <span className="dot" />
          <span className="hc-label">Counting down to <b>K-EXPO 2027</b></span>
          <span className="hc-time">{cd.d}<i>d</i> {String(cd.h).padStart(2, "0")}<i>h</i> {String(cd.m).padStart(2, "0")}<i>m</i> {String(cd.s).padStart(2, "0")}<i>s</i></span>
          {Ico.arrow({ width: 16, height: 16 })}
        </Link>
      )}
      <style>{`
        .hero { position: relative; min-height: 92vh; display: flex; align-items: center; color: #fff; overflow: hidden; background: var(--ink); padding: 120px 0 160px; }
        .hero__bgwrap { position: absolute; inset: 0; overflow: hidden; }
        .hero__bg { position: absolute; inset: -8% 0; background-image: url('${config.PUB}/boardPhotos/full.webp'); background-size: cover; background-position: center 28%; transform: scale(1.12); will-change: transform; }
        .hero__veil { position: absolute; inset: 0; background:
            linear-gradient(180deg, rgba(11,27,58,0.86) 0%, rgba(11,27,58,0.62) 42%, rgba(11,27,58,0.92) 100%),
            radial-gradient(1200px 540px at 18% 8%, rgba(10,63,168,0.55), transparent 60%),
            radial-gradient(900px 500px at 92% 100%, rgba(205,46,58,0.45), transparent 60%); }
        .hero__inner { position: relative; z-index: 2; }
        .hero__content { max-width: 760px; }
        .hero__kick { margin-bottom: 22px; }
        .hero__title { margin-bottom: 26px; text-shadow: 0 2px 30px rgba(0,0,0,0.25); }
        .hero__title .ln { display: block; }
        .hero__title em { font-style: normal; color: #FF8A93; position: relative; }
        .hero__sub { color: #D6DEF2 !important; max-width: 540px; margin: 0 0 34px; }
        .hero__cta { display: flex; gap: 14px; flex-wrap: wrap; }
        .hero__stats { display: flex; gap: 40px; margin-top: 46px; }
        .hero__stat .num { font-size: 2.2rem; font-weight: 900; letter-spacing: -0.03em; line-height: 1; }
        .hero__stat .lbl { font-size: 0.82rem; color: #A9B6D6; margin-top: 6px; font-weight: 600; letter-spacing: 0.02em; }
        .hero__countdown { position: absolute; left: 50%; transform: translateX(-50%); bottom: 26px; z-index: 3;
          display: inline-flex; align-items: center; gap: 14px; padding: 12px 20px; border-radius: var(--r-pill);
          background: rgba(11,27,58,0.55); border: 1px solid rgba(255,255,255,0.18); backdrop-filter: blur(14px); color: #fff;
          transition: transform .25s var(--ease), background .25s; font-size: 0.92rem; }
        .hero__countdown:hover { transform: translateX(-50%) translateY(-3px); background: rgba(11,27,58,0.72); }
        .hero__countdown .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--red-soft); box-shadow: 0 0 0 0 rgba(226,84,94,0.7); animation: pulse 2s infinite; }
        .hero__countdown .hc-label b { color: #FFD7DB; }
        .hero__countdown .hc-time { font-weight: 800; font-variant-numeric: tabular-nums; letter-spacing: -0.01em; }
        .hero__countdown .hc-time i { font-style: normal; color: #9FB4E0; font-weight: 600; font-size: 0.78em; margin: 0 5px 0 1px; }
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(226,84,94,0.6); } 70% { box-shadow: 0 0 0 9px rgba(226,84,94,0); } 100% { box-shadow: 0 0 0 0 rgba(226,84,94,0); } }
        @media (max-width: 700px) { .hero { padding: 90px 0 140px; min-height: 86vh; } .hero__stats { gap: 26px; } .hero__stat .num { font-size: 1.7rem; } .hero__countdown .hc-label { display: none; } }
      `}</style>
    </section>
  );
}

function Marquee() {
  const items = ["한인 학생회", "K-EXPO 2027", "Chuseok", "KSA Families", "Hanguk Day", "Culture Nights", "Open to all Hoos"];
  const row = [...items, ...items];
  return (
    <div className="mq dark">
      <div className="marquee"><div className="marquee__track">
        {row.map((t, i) => (<span className="marquee__item" key={i}>{t}<span className="marquee__star">✺</span></span>))}
      </div></div>
      <style>{`.mq { padding: 22px 0; border-top: 1px solid rgba(255,255,255,0.08); border-bottom: 1px solid rgba(255,255,255,0.08); }
        .mq .marquee__item { color: #EAEFFB; }`}</style>
    </div>
  );
}

const PILLARS = [
  { tag: "Community", title: "Fams & Bigs", text: "Our family system pairs new members with upperclassmen mentors so Grounds feels like home.", color: "var(--red)" },
  { tag: "Culture", title: "Cultural Nights", text: "Celebrate Chuseok, Lunar New Year, and K-EXPO with performances, games, and Korean food.", color: "var(--blue)" },
  { tag: "Social", title: "Socials & Collabs", text: "Meet friends through mixers, collabs with other orgs, and plenty of chill hangouts.", color: "var(--red)" },
  { tag: "Growth", title: "Leadership & Service", text: "Plan events, give back, and build leadership on our officer teams and committees.", color: "var(--blue)" },
];

function AboutTeaser() {
  return (
    <section className="section">
      <div className="pattern" />
      <div className="wrap" style={{ position: "relative" }}>
        <div className="at-grid">
          <div className="reveal">
            <span className="eyebrow"><i className="kicker-dot" />Who we are<span className="han">우리는</span></span>
            <h2 className="h-xl" style={{ margin: "16px 0 18px" }}>A home for Korean culture &amp; everyone curious about it.</h2>
            <p className="lead" style={{ marginBottom: 18 }}>
              From Chuseok and K-EXPO performances to late-night hangs and KSA Families, we connect
              students through culture, food, music, and shared experience.
            </p>
            <p className="text-muted" style={{ marginBottom: 28 }}>
              You don't have to be Korean to join — KSA is open to anyone interested in the culture,
              language, and community.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link to="/about" className="btn btn--ink">More about KSA {Ico.arrow({ className: "arrow", width: 17, height: 17 })}</Link>
              <Link to="/gallery" className="btn btn--ghost">Browse past events</Link>
            </div>
          </div>
          <div className="at-cards">
            {PILLARS.map((p, i) => (
              <div className={"card lift at-card reveal d" + (i + 1)} key={p.title}>
                <span className="at-pill" style={{ "--c": p.color }}>{p.tag}</span>
                <h4 style={{ fontSize: "1.18rem", margin: "12px 0 8px" }}>{p.title}</h4>
                <p className="text-muted" style={{ fontSize: "0.92rem", margin: 0 }}>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        .at-grid { display: grid; grid-template-columns: 1fr 1.05fr; gap: 64px; align-items: center; }
        .at-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        .at-card { padding: 24px; }
        .at-pill { display: inline-block; font-size: 0.72rem; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase;
          color: var(--c); background: color-mix(in srgb, var(--c) 12%, white); padding: 5px 12px; border-radius: var(--r-pill); }
        @media (max-width: 900px) { .at-grid { grid-template-columns: 1fr; gap: 40px; } }
        @media (max-width: 480px) { .at-cards { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  );
}

function StatsBand() {
  const stats = [["1000", "+", "Active members"], ["30", "+", "Events a year"], ["24", "", "Board officers"], ["12", "+", "Years on Grounds"]];
  return (
    <section className="section dark statsband">
      <div className="pattern" style={{ opacity: 0.12 }} />
      <div className="wrap" style={{ position: "relative" }}>
        <div className="sb-grid">
          {stats.map(([n, s, l], i) => (
            <div className={"sb-item reveal d" + (i + 1)} key={l}>
              <div className="sb-num"><CountUp end={parseInt(n)} suffix={s} /></div>
              <div className="sb-lbl">{l}</div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .statsband { padding: 76px 0; }
        .sb-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; text-align: center; }
        .sb-item { position: relative; }
        .sb-item:not(:last-child)::after { content: ""; position: absolute; right: -12px; top: 18%; height: 64%; width: 1px; background: rgba(255,255,255,0.14); }
        .sb-num { font-size: clamp(2.4rem, 5vw, 3.6rem); font-weight: 900; letter-spacing: -0.04em; background: linear-gradient(180deg, #fff, #BCD0FF); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
        .sb-lbl { color: #A9B6D6; font-weight: 600; margin-top: 6px; font-size: 0.95rem; }
        @media (max-width: 700px) { .sb-grid { grid-template-columns: 1fr 1fr; gap: 36px 16px; } .sb-item:nth-child(2)::after { display: none; } }
      `}</style>
    </section>
  );
}

const HOME_EVENTS = [
  { tag: "Signature", date: "Apr 3", title: "K-EXPO 2027", text: "Our biggest showcase of the year — performances, food, and Korean culture on full display.", accent: "var(--red)" },
  { tag: "Cultural", date: "Oct 4", title: "Chuseok Night", text: "Games, songpyeon, and traditions for Korean Thanksgiving in the Newcomb Ballroom.", accent: "var(--blue)" },
  { tag: "Social", date: "Sep 12", title: "Fall Welcome Mixer", text: "Kick off the semester, meet the board, and find your people over snacks and games.", accent: "var(--red)" },
];

function EventsPreview() {
  const { events: liveEvents, live } = useGCalEvents(6);
  const source = live && liveEvents.length
    ? liveEvents.slice(0, 3).map((e) => ({ ...e, date: (e.month && e.day) ? e.month.charAt(0) + e.month.slice(1).toLowerCase() + " " + parseInt(e.day) : "Soon" }))
    : HOME_EVENTS;
  return (
    <section className="section ev">
      <div className="wrap">
        <div className="ev-head reveal">
          <div>
            <span className="eyebrow"><i className="kicker-dot" />What's coming up<span className="han">행사</span></span>
            <h2 className="h-xl" style={{ marginTop: 14 }}>This semester at KSA</h2>
          </div>
          <Link to="/events" className="btn btn--ghost btn--sm">Full calendar {Ico.arrow({ className: "arrow", width: 15, height: 15 })}</Link>
        </div>
        <div className="ev-grid">
          {source.map((e, i) => (
            <article className={"card lift ev-card reveal d" + (i + 1)} key={e.id || e.title} style={{ "--a": e.accent }}>
              <div className="ev-top">
                <span className="ev-date">{e.date}</span>
                <span className="chip chip--red">{e.tag}</span>
              </div>
              <h3 style={{ fontSize: "1.4rem", margin: "0 0 10px" }}>{e.title}</h3>
              <p className="text-muted" style={{ margin: "0 0 20px", fontSize: "0.95rem" }}>{e.text}</p>
              <Link to="/events" className="ev-link">View details {Ico.arrow({ width: 15, height: 15 })}</Link>
            </article>
          ))}
        </div>
      </div>
      <style>{`
        .ev { background: var(--paper-2); }
        .ev-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 20px; margin-bottom: 40px; flex-wrap: wrap; }
        .ev-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
        .ev-card { padding: 26px; border-top: 3px solid var(--a); display: flex; flex-direction: column; }
        .ev-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .ev-date { font-weight: 900; font-size: 1.05rem; color: var(--ink); letter-spacing: -0.02em; }
        .ev-link { margin-top: auto; display: inline-flex; align-items: center; gap: 7px; font-weight: 700; color: var(--blue); font-size: 0.92rem; }
        .ev-link svg { transition: transform .25s var(--ease); }
        .ev-card:hover .ev-link svg { transform: translateX(4px); }
        @media (max-width: 860px) { .ev-grid { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  );
}

function JoinBand() {
  return (
    <section className="section joinband">
      <div className="wrap">
        <div className="jb reveal">
          <div className="jb__glow" />
          <div className="jb__inner">
            <span className="eyebrow eyebrow--light"><i className="kicker-dot" />Ready when you are<span className="han">함께해요</span></span>
            <h2 className="h-display" style={{ fontSize: "clamp(2rem,4.4vw,3.4rem)", margin: "16px auto 14px", maxWidth: 720 }}>
              Come find your people this year.
            </h2>
            <p className="lead" style={{ color: "#D6DEF2", maxWidth: 520, margin: "0 auto 30px" }}>
              Membership takes two minutes. Show up to a general body meeting and you're already part of it.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/join" className="btn">Become a member {Ico.arrow({ className: "arrow", width: 17, height: 17 })}</Link>
              <Link to="/merch" className="btn btn--light">Shop K-EXPO merch</Link>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .joinband { background: var(--paper); }
        .jb { position: relative; background: var(--ink); border-radius: var(--r-lg); padding: 72px 32px; text-align: center; overflow: hidden; color: #fff; box-shadow: var(--shadow-lg); }
        .jb__glow { position: absolute; inset: 0; background:
            radial-gradient(700px 300px at 16% 0%, rgba(10,63,168,0.7), transparent 60%),
            radial-gradient(700px 320px at 84% 100%, rgba(205,46,58,0.6), transparent 60%); }
        .jb__inner { position: relative; z-index: 1; }
        .jb .btn:has(.arrow) { position: relative; padding-left: 50px; padding-right: 50px; }
        .jb .btn .arrow { position: absolute; right: 22px; top: 50%; transform: translateY(-50%); transition: transform .3s var(--ease); }
        .jb .btn:hover .arrow { transform: translateY(-50%) translateX(4px); }
      `}</style>
    </section>
  );
}

export default function Home() {
  useReveal();
  return (
    <div className="page">
      <HomeHero />
      <Marquee />
      <AboutTeaser />
      <StatsBand />
      <EventsPreview />
      <JoinBand />
    </div>
  );
}
