import React, { useState } from "react";
import { useReveal, useCountdown, KEXPO_DATE } from "../lib/ui";
import { useGCalEvents, GCAL_ADD_URL } from "../lib/data";
import { Ico } from "../lib/icons";

const EVENTS_LIST = [
  { dateObj: new Date("2026-09-12T19:00:00"), month: "SEP", day: "12", title: "Fall Welcome Mixer", tag: "Social", time: "7:00 PM", loc: "Newcomb Ballroom", text: "Meet the board, play icebreakers, and kick off the semester with snacks and new friends.", accent: "var(--red)" },
  { dateObj: new Date("2026-10-04T18:30:00"), month: "OCT", day: "04", title: "Chuseok Night", tag: "Cultural", time: "6:30 PM", loc: "Newcomb Ballroom", text: "Celebrate Korean Thanksgiving with songpyeon, traditional games, and performances.", accent: "var(--blue)" },
  { dateObj: new Date("2026-11-15T14:00:00"), month: "NOV", day: "15", title: "KSA Fam Olympics", tag: "Social", time: "2:00 PM", loc: "Mad Bowl", text: "Families face off in a friendly afternoon of games, relays, and bragging rights.", accent: "var(--red)" },
  { dateObj: new Date("2027-02-20T18:00:00"), month: "FEB", day: "20", title: "Lunar New Year Banquet", tag: "Cultural", time: "6:00 PM", loc: "Alumni Hall", text: "Ring in the new year with a catered banquet, hanbok, and cultural performances.", accent: "var(--blue)" },
  { dateObj: new Date("2027-04-03T13:30:00"), month: "APR", day: "03", title: "K-EXPO 2027", tag: "Signature", time: "1:30 PM", loc: "Old Cabell Hall", text: "Our flagship showcase — student acts, external performers, food, and an all-day celebration of Korean culture.", accent: "var(--red)", featured: true },
];

export default function Events() {
  const { events: liveEvents, loading, live } = useGCalEvents(12);
  useReveal();
  const [filter, setFilter] = useState("All");
  const [showKey, setShowKey] = useState(false);
  const [keyInput, setKeyInput] = useState("");
  const source = live && liveEvents.length ? liveEvents : EVENTS_LIST;
  const featured = source.find((e) => e.featured) || source[0] || null;
  const cdTarget = featured && featured.dateObj ? featured.dateObj : KEXPO_DATE;
  const cd = useCountdown(cdTarget);
  const cdName = featured ? featured.title : "K-EXPO";
  const cdCaption = featured && featured.dateObj
    ? featured.dateObj.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) +
      (featured.time && featured.time !== "All day" ? " · " + featured.time : "") +
      (featured.loc ? " · " + featured.loc : "")
    : "";
  const cats = ["All", "Cultural", "Social", "Signature"];
  const list = filter === "All" ? source : source.filter((e) => e.tag === filter);
  const saveKey = () => {
    const v = keyInput.trim();
    if (!v) return;
    try { window.localStorage.setItem("ksa_gcal_key", v); } catch (e) {}
    window.location.reload();
  };
  return (
    <div className="page">
      <section className="evhero">
        <div className="pattern" style={{ opacity: 0.1 }} />
        <div className="wrap evhero__inner">
          <div className="reveal">
            <span className="eyebrow eyebrow--light"><i className="kicker-dot" />Events<span className="han">행사 일정</span></span>
            <h1 className="h-display" style={{ margin: "18px 0 16px", maxWidth: 620 }}>Something happening all year.</h1>
            <p className="lead" style={{ color: "#D6DEF2", maxWidth: 520 }}>
              Performances, socials, and cultural nights — pulled together by our committees. Mark your calendar.
            </p>
          </div>
          <div className="evhero__count reveal d1">
            <span className="evc-label">Countdown to {cdName}</span>
            <div className="evc-grid">
              {[["d", cd.d], ["h", cd.h], ["m", cd.m], ["s", cd.s]].map(([u, v]) => (
                <div className="evc-box" key={u}><b>{String(v).padStart(2, "0")}</b><span>{u === "d" ? "Days" : u === "h" ? "Hrs" : u === "m" ? "Min" : "Sec"}</span></div>
              ))}
            </div>
            <span className="evc-date">{cdCaption}</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="ev-filterbar reveal">
            <div className="ev-tabs">
              {cats.map((c) => (
                <button key={c} className={"ev-tab" + (filter === c ? " active" : "")} onClick={() => setFilter(c)}>{c}</button>
              ))}
            </div>
            <div className="ev-barright">
              {live ? (
                <span className="ev-live"><span className="ev-live-dot" />Live from Google Calendar</span>
              ) : (
                <button className="ev-live off ev-live-btn" onClick={() => setShowKey((s) => !s)} title="Connect the live calendar feed">
                  <span className="ev-live-dot" />Sample dates · connect calendar
                </button>
              )}
              <a className="btn btn--ghost btn--sm" href={GCAL_ADD_URL} target="_blank" rel="noreferrer">Add to Google Calendar {Ico.ext({ width: 15, height: 15 })}</a>
            </div>
          </div>

          {showKey && !live && (
            <div className="ev-keyrow reveal">
              <div>
                <b>Pull live dates from Google Calendar</b>
                <p className="text-muted">Paste a Google Calendar API key (the same one your app uses as <code>REACT_APP_GCAL_API_KEY</code>). It's stored locally in this browser only.</p>
              </div>
              <div className="ev-keyinput">
                <input type="text" placeholder="AIza… your Google Calendar API key" value={keyInput} onChange={(e) => setKeyInput(e.target.value)} />
                <button className="btn btn--blue btn--sm" onClick={saveKey}>Go live</button>
              </div>
            </div>
          )}

          <div className="ev-timeline">
            {loading && [0, 1, 2].map((i) => (
              <div className="ev-row ev-skel" key={"s" + i}>
                <div className="ev-datebox"><span className="sk sk-m" /><span className="sk sk-d" /></div>
                <div className="ev-divider" />
                <div className="ev-info" style={{ width: "100%" }}>
                  <span className="sk sk-chip" /><span className="sk sk-line" /><span className="sk sk-line short" />
                </div>
              </div>
            ))}
            {!loading && list.length === 0 && (
              <div className="ev-empty">No upcoming events in this category right now — check the full calendar.</div>
            )}
            {!loading && list.map((e, i) => (
              <article className={"ev-row reveal d" + ((i % 4) + 1) + (e.featured ? " featured" : "")} key={e.id || e.title} style={{ "--a": e.accent }}>
                <div className="ev-datebox">
                  <span className="m">{e.month}</span><span className="d">{e.day}</span>
                </div>
                <div className="ev-divider" />
                <div className="ev-info">
                  <div className="ev-meta">
                    <span className="chip chip--red">{e.tag}</span>
                    <span className="text-muted" style={{ fontSize: "0.86rem" }}>{e.time}{e.loc ? " · " + e.loc : ""}</span>
                  </div>
                  <h3 style={{ fontSize: "1.4rem", margin: "8px 0 6px" }}>{e.title}{e.featured && <span className="ev-flag">Flagship</span>}</h3>
                  <p className="text-muted" style={{ margin: 0, maxWidth: 640 }}>{e.text}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="ev-cal reveal">
            <div>
              <h3 style={{ fontSize: "1.3rem", marginBottom: 6 }}>Never miss a meeting</h3>
              <p className="text-muted" style={{ margin: 0 }}>Subscribe to our public Google Calendar and every event syncs straight to your phone.</p>
            </div>
            <a className="btn btn--blue" href={GCAL_ADD_URL} target="_blank" rel="noreferrer">Subscribe {Ico.arrow({ className: "arrow", width: 16, height: 16 })}</a>
          </div>
        </div>
      </section>

      <style>{`
        .evhero { background: var(--ink); color: #fff; padding: 140px 0 84px; position: relative; overflow: hidden; }
        .evhero::after { content: ""; position: absolute; inset: 0; background: radial-gradient(900px 420px at 15% 0%, rgba(10,63,168,0.55), transparent 60%), radial-gradient(820px 360px at 95% 100%, rgba(205,46,58,0.42), transparent 60%); }
        .evhero__inner { position: relative; z-index: 1; display: grid; grid-template-columns: 1.3fr 0.9fr; gap: 48px; align-items: center; }
        .evhero__count { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.14); border-radius: var(--r-lg); padding: 26px; backdrop-filter: blur(10px); }
        .evc-label { font-size: 0.76rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #9FB4E0; }
        .evc-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 16px 0 14px; }
        .evc-box { background: rgba(11,27,58,0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: var(--r-md); padding: 14px 6px; text-align: center; }
        .evc-box b { display: block; font-size: 1.9rem; font-weight: 900; font-variant-numeric: tabular-nums; letter-spacing: -0.02em; }
        .evc-box span { font-size: 0.68rem; color: #9FB4E0; text-transform: uppercase; letter-spacing: 0.08em; }
        .evc-date { font-size: 0.84rem; color: #C2CCE4; }
        .ev-filterbar { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 36px; flex-wrap: wrap; }
        .ev-tabs { display: inline-flex; gap: 4px; padding: 5px; background: var(--surface); border: 1px solid var(--line); border-radius: var(--r-pill); }
        .ev-tab { border: none; background: none; padding: 9px 18px; border-radius: var(--r-pill); font-weight: 700; font-size: 0.9rem; color: var(--muted); cursor: pointer; transition: all .2s; }
        .ev-tab.active { background: var(--ink); color: #fff; }
        .ev-timeline { display: grid; gap: 14px; margin-bottom: 44px; }
        .ev-row { display: grid; grid-template-columns: auto auto 1fr; gap: 26px; align-items: center; background: var(--surface); border: 1px solid var(--line); border-radius: var(--r-lg); padding: 24px 28px; box-shadow: var(--shadow-sm); transition: transform .3s var(--ease), box-shadow .3s var(--ease); }
        .ev-row:hover { transform: translateX(4px); box-shadow: var(--shadow-md); }
        .ev-row.featured { background: linear-gradient(120deg, #fff 60%, rgba(205,46,58,0.05)); border-color: rgba(205,46,58,0.25); }
        .ev-datebox { text-align: center; min-width: 64px; }
        .ev-datebox .m { display: block; font-size: 0.78rem; font-weight: 800; letter-spacing: 0.1em; color: var(--a); }
        .ev-datebox .d { display: block; font-size: 2.2rem; font-weight: 900; letter-spacing: -0.04em; line-height: 1; color: var(--ink); }
        .ev-divider { width: 3px; align-self: stretch; border-radius: 3px; background: var(--a); opacity: 0.5; }
        .ev-meta { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .ev-flag { font-size: 0.66rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: var(--red); background: rgba(205,46,58,0.1); padding: 3px 9px; border-radius: var(--r-pill); margin-left: 10px; vertical-align: middle; }
        .ev-cal { display: flex; justify-content: space-between; align-items: center; gap: 20px; background: var(--paper-2); border: 1px solid var(--line); border-radius: var(--r-lg); padding: 30px 34px; flex-wrap: wrap; }
        .ev-barright { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
        .ev-live { display: inline-flex; align-items: center; gap: 7px; font-size: 0.78rem; font-weight: 700; color: #1F8A5B; letter-spacing: 0.01em; }
        .ev-live.off { color: var(--muted); }
        .ev-live-dot { width: 8px; height: 8px; border-radius: 50%; background: #22A06B; box-shadow: 0 0 0 0 rgba(34,160,107,0.5); animation: pulse 2s infinite; }
        .ev-live.off .ev-live-dot { background: var(--muted); box-shadow: none; animation: none; }
        .ev-live-btn { border: 1px solid var(--line); background: var(--surface); cursor: pointer; padding: 7px 14px; border-radius: var(--r-pill); transition: border-color .2s, background .2s; }
        .ev-live-btn:hover { border-color: var(--line-2); background: var(--paper-2); }
        .ev-keyrow { display: flex; justify-content: space-between; align-items: center; gap: 24px; flex-wrap: wrap; background: var(--ink); color: #fff; border-radius: var(--r-lg); padding: 22px 26px; margin-bottom: 32px; }
        .ev-keyrow b { font-size: 1.02rem; }
        .ev-keyrow p { margin: 6px 0 0; max-width: 460px; font-size: 0.88rem; color: #A9B6D6 !important; }
        .ev-keyrow code { background: rgba(255,255,255,0.12); padding: 1px 6px; border-radius: 5px; font-size: 0.82em; }
        .ev-keyinput { display: flex; gap: 8px; flex: 1; min-width: 280px; }
        .ev-keyinput input { flex: 1; padding: 11px 14px; border-radius: var(--r-sm); border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.08); color: #fff; font-family: inherit; font-size: 0.9rem; }
        .ev-keyinput input::placeholder { color: #8FA3CF; }
        .ev-keyinput input:focus { outline: none; border-color: var(--blue-soft); }
        .ev-empty { text-align: center; padding: 44px 20px; border: 1px dashed var(--line-2); border-radius: var(--r-lg); color: var(--muted); }
        .ev-skel { pointer-events: none; }
        .ev-skel .ev-info { display: flex; flex-direction: column; gap: 10px; }
        .sk { display: block; border-radius: 7px; background: linear-gradient(90deg, var(--paper-2) 0%, #EDE6D8 50%, var(--paper-2) 100%); background-size: 200% 100%; animation: skel 1.3s ease-in-out infinite; }
        .sk-m { width: 38px; height: 12px; margin: 0 auto 8px; } .sk-d { width: 44px; height: 30px; margin: 0 auto; }
        .sk-chip { width: 90px; height: 22px; border-radius: 999px; } .sk-line { width: 70%; height: 16px; } .sk-line.short { width: 45%; }
        @keyframes skel { from { background-position: 200% 0; } to { background-position: -200% 0; } }
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(34,160,107,0.5); } 70% { box-shadow: 0 0 0 7px rgba(34,160,107,0); } 100% { box-shadow: 0 0 0 0 rgba(34,160,107,0); } }
        @media (max-width: 880px) { .evhero__inner { grid-template-columns: 1fr; } }
        @media (max-width: 620px) { .ev-row { grid-template-columns: auto 1fr; gap: 16px; } .ev-divider { display: none; } }
      `}</style>
    </div>
  );
}
