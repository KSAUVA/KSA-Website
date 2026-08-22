import React, { useState, useEffect } from "react";
import { usePopupEvent } from "../lib/data";
import { useCountdown } from "../lib/ui";

const SEEN_KEY = "ksa_popup_seen";

function parseWhen(date, time) {
    // "Fri, April 10" + "18:00" -> Date. Falls back gracefully.
    const now = new Date();
    const d = new Date(`${date} ${now.getFullYear()} ${time || ""}`.trim());
    if (isNaN(d)) return null;
    // if the parsed date is already past, assume next year
    if (d < now) d.setFullYear(d.getFullYear() + 1);
    return d;
}

export default function HomePopup() {
    const { event, loading } = usePopupEvent();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (loading || !event) return;
        let seen = false;
        try { seen = sessionStorage.getItem(SEEN_KEY) === "1"; } catch (e) {}
        if (!seen) setOpen(true);
    }, [loading, event]);

    const close = () => {
        setOpen(false);
        try { sessionStorage.setItem(SEEN_KEY, "1"); } catch (e) {}
    };

    const when = event ? parseWhen(event.date, event.time) : null;
    const cd = useCountdown(when || new Date());

    if (!open || !event) return null;

    const prettyTime = event.time
        ? new Date(`2000-01-01 ${event.time}`).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
        : "";
    const meta = [event.date, prettyTime, event.loc].filter(Boolean).join(" · ");

    return (
        <div className="popup-overlay" onClick={close}>
            <div className="popup-card" onClick={(e) => e.stopPropagation()}>
                <button className="popup-x" onClick={close} aria-label="Close">✕</button>
                <div className="popup-banner" style={event.banner ? { backgroundImage: `url(${event.banner})` } : undefined}>
                    {!event.banner && <span className="popup-banner-tag">event flyer / photo</span>}
                </div>
                <div className="popup-body">
                    <span className="popup-eyebrow"><i />UPCOMING EVENT</span>
                    <h2>{event.title}</h2>
                    <p className="popup-meta">{meta}</p>
                    {when && (
                        <div className="popup-cd">
                            {[["Days", cd.d], ["Hrs", cd.h], ["Min", cd.m], ["Sec", cd.s]].map(([l, v]) => (
                                <div className="popup-cd-box" key={l}><b>{String(v).padStart(2, "0")}</b><span>{l}</span></div>
                            ))}
                        </div>
                    )}
                    <div className="popup-actions">
                        {event.rsvp ? (
                            <a className="btn btn--red" href={event.rsvp} target="_blank" rel="noreferrer" onClick={close}>Join NOW</a>
                        ) : (
                            <button className="btn btn--red" onClick={close}>RSVP now</button>
                        )}
                        <button className="popup-later" onClick={close}>Maybe later</button>
                    </div>
                </div>
            </div>
            <style>{`
        .popup-overlay { position: fixed; inset: 0; z-index: 999; background: rgba(11,27,58,0.55); backdrop-filter: blur(3px); display: flex; align-items: center; justify-content: center; padding: 20px; }
        .popup-card { width: min(460px, 100%); background: var(--surface, #fff); border-radius: var(--r-lg, 20px); overflow: hidden; box-shadow: 0 30px 80px rgba(0,0,0,0.4); }
        .popup-x { position: absolute; top: 18px; right: 18px; width: 40px; height: 40px; border-radius: 50%; border: none; background: rgba(255,255,255,0.9); cursor: pointer; font-size: 1rem; }
        .popup-banner { height: 200px; background: var(--ink, #0b1b3a) center/cover; background-image: repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0 14px, transparent 14px 28px); display: flex; align-items: center; justify-content: center; }
        .popup-banner-tag { font-family: monospace; color: #fff; background: rgba(11,27,58,0.6); padding: 8px 16px; border-radius: 8px; }
        .popup-body { padding: 26px 30px 30px; }
        .popup-eyebrow { display: inline-flex; align-items: center; gap: 7px; font-size: 0.72rem; font-weight: 800; letter-spacing: 0.1em; color: var(--red, #cd2e3a); background: rgba(205,46,58,0.1); padding: 6px 14px; border-radius: 999px; }
        .popup-eyebrow i { width: 7px; height: 7px; border-radius: 50%; background: var(--red, #cd2e3a); }
        .popup-body h2 { font-size: 2rem; margin: 14px 0 6px; letter-spacing: -0.02em; color: var(--ink, #0b1b3a); background: none; }
        .popup-meta { color: var(--muted, #667); margin: 0 0 20px; background: none; }
        .popup-cd { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 22px; }
        .popup-cd-box { background: var(--ink, #0b1b3a); color: #fff; border-radius: 12px; padding: 14px 6px; text-align: center; }
        .popup-cd-box b { display: block; font-size: 1.7rem; font-weight: 900; font-variant-numeric: tabular-nums; }
        .popup-cd-box span { font-size: 0.62rem; text-transform: uppercase; letter-spacing: 0.08em; color: #9FB4E0; }
        .popup-actions { display: flex; align-items: center; gap: 18px; }
        .popup-actions .btn--red { flex: 1; }
        .popup-later { background: none; border: none; font-weight: 700; color: var(--muted, #667); cursor: pointer; font-size: 1rem; }
      `}</style>
        </div>
    );
}