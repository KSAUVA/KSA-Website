import React, { useEffect, useState } from "react";
import { useReveal } from "../lib/ui";
import { Ico } from "../lib/icons";

const SHEET_ID = "1ex5lO23kY3fX041FqWXt8WzKHJXfBTSwpw3jN43XerI";

// Tabs in the order they should appear. Only tabs with >=1 link render.
// Add a new tab here (exact tab name) and it shows up automatically.
const TABS = [
    { tab: "General", han: "일반" },
    { tab: "Payment", han: "회비" },
    { tab: "Social", han: "소셜" },
    { tab: "Fundraising", han: "모금" },
    { tab: "Internal", han: "내부" },
    { tab: "PR", han: "홍보" },
    { tab: "Sports", han: "스포츠" },
    { tab: "Culture", han: "문화" },
    { tab: "Culinary", han: "요리" },
    { tab: "Historian", han: "기록" },
];

const csvUrl = (tab) =>
    `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tab)}`;

// Minimal RFC-4180-ish CSV parser: handles quoted fields, commas, and
// escaped double-quotes ("") inside quotes.
function parseCSV(text) {
    const rows = [];
    let row = [];
    let field = "";
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (inQuotes) {
            if (c === '"') {
                if (text[i + 1] === '"') { field += '"'; i++; }
                else inQuotes = false;
            } else field += c;
        } else if (c === '"') {
            inQuotes = true;
        } else if (c === ",") {
            row.push(field); field = "";
        } else if (c === "\n") {
            row.push(field); rows.push(row); row = []; field = "";
        } else if (c === "\r") {
            // ignore, handled by \n
        } else field += c;
    }
    // last field/row
    if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
    return rows;
}

const truthy = (v) => /^(y|yes|x|1|true|primary)$/i.test((v || "").trim());

// Turn a tab's raw rows into link objects. Assumes a header row.
function rowsToLinks(rows) {
    if (!rows.length) return [];
    // Drop header (Link / Link Name / Link Description / Primary)
    const body = rows.slice(1);
    return body
        .map((r) => ({
            u: (r[0] || "").trim(),
            t: (r[1] || "").trim(),
            d: (r[2] || "").trim(),
            primary: truthy(r[3]),
        }))
        .filter((l) => l.u && l.t); // skip empty rows
}

export default function Links() {
    useReveal();
    const [sections, setSections] = useState([]);
    const [status, setStatus] = useState("loading"); // loading | ready | error

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const results = await Promise.all(
                    TABS.map(async (t) => {
                        try {
                            const res = await fetch(csvUrl(t.tab));
                            if (!res.ok) return { ...t, links: [] };
                            const text = await res.text();
                            return { ...t, links: rowsToLinks(parseCSV(text)) };
                        } catch {
                            return { ...t, links: [] };
                        }
                    })
                );
                if (cancelled) return;
                const filled = results.filter((s) => s.links.length > 0);
                setSections(filled);
                setStatus(filled.length ? "ready" : "error");
            } catch {
                if (!cancelled) setStatus("error");
            }
        })();
        return () => { cancelled = true; };
    }, []);

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
                    {status === "loading" && (
                        <p className="text-muted" style={{ textAlign: "center", padding: "40px 0" }}>Loading links…</p>
                    )}

                    {status === "error" && (
                        <p className="text-muted" style={{ textAlign: "center", padding: "40px 0" }}>
                            Couldn’t load the links right now. Please refresh, or check back in a minute.
                        </p>
                    )}

                    {status === "ready" && sections.map((s) => (
                        <div className="l-section" key={s.tab}>
                            <div className="l-cat reveal"><h2>{s.tab}</h2><span className="l-han">{s.han}</span><span className="l-line" /></div>
                            <div className="l-grid">
                                {s.links.map((l, i) => (
                                    <a href={l.u} target="_blank" rel="noreferrer" className={"l-card reveal d" + ((i % 4) + 1) + (l.primary ? " l-card--primary" : "")} key={l.t + i}>
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
