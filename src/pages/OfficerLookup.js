import React, { useState, useEffect, useMemo } from "react";

/* ============================================================
   OFFICER LOOKUP — member dues-paid checker
   ============================================================
   SETUP (do this before it'll work):

   1. In Google Sheets: File > Share > Publish to web
      - Select the specific sheet (e.g. "Real Members"), not
        "Entire document"
      - Format: Comma-separated values (.csv)
      - Click Publish, copy the URL it gives you
      - Paste it into CSV_URL below

   2. Set OFFICER_PASSWORD below to whatever you want the
      shared password to be. Reminder: this is a client-side
      check only. Anyone who opens devtools can read the
      password out of the JS bundle, or just view the CSV_URL
      directly and see the data without going through your
      page at all. This keeps casual/curious members out. It
      is NOT real access control. If that ever becomes a
      problem, this needs a real backend + auth, not a bigger
      password.

   3. Add a route for this page in your router, e.g.:
        <Route path="/officers" element={<OfficerLookup />} />
      Don't link to it from your nav — keep it unlisted, and
      share the URL with officers directly.
   ============================================================ */

const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTcZ3z_TTRxjuNrTl0Lgi4nKnrGXF1tpTZlkhvIc09EaftD5KuTR8DzTinOF1KC1jeq036YXhx1Eoem/pub?gid=0&single=true&output=csv";
const OFFICER_PASSWORD = "KOREA!";

// Minimal CSV parser — handles quoted fields and commas inside quotes.
// Good enough for this sheet's shape; swap for papaparse if the data
// gets messier (embedded newlines, etc).
function parseCSV(text) {
    const rows = [];
    let row = [];
    let field = "";
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        const next = text[i + 1];

        if (inQuotes) {
            if (c === '"' && next === '"') { field += '"'; i++; }
            else if (c === '"') { inQuotes = false; }
            else { field += c; }
        } else {
            if (c === '"') inQuotes = true;
            else if (c === ",") { row.push(field); field = ""; }
            else if (c === "\r") { /* skip */ }
            else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
            else { field += c; }
        }
    }
    if (field.length || row.length) { row.push(field); rows.push(row); }
    return rows;
}

function useMemberSheet() {
    const [members, setMembers] = useState([]);
    const [status, setStatus] = useState("loading"); // loading | ok | error
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        fetch(CSV_URL)
            .then((r) => {
                if (!r.ok) throw new Error("Sheet fetch failed (" + r.status + ")");
                return r.text();
            })
            .then((text) => {
                if (cancelled) return;
                const rows = parseCSV(text);
                // rows[0] is the header row: Name | Computing ID | (blank) | Match Found
                const parsed = rows.slice(1)
                    .filter((r) => r[0] && r[0].trim())
                    .map((r) => ({
                        name: (r[0] || "").trim(),
                        computingId: (r[1] || "").trim(),
                        duesPaid: (r[3] || "").trim().toUpperCase() === "TRUE",
                    }));
                setMembers(parsed);
                setStatus("ok");
            })
            .catch((e) => {
                if (cancelled) return;
                setError(e.message);
                setStatus("error");
            });
        return () => { cancelled = true; };
    }, []);

    return { members, status, error };
}

function PasswordGate({ onUnlock }) {
    const [input, setInput] = useState("");
    const [wrong, setWrong] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        if (input === OFFICER_PASSWORD) {
            sessionStorage.setItem("ksa_officer_unlocked", "1");
            onUnlock();
        } else {
            setWrong(true);
        }
    };

    return (
        <div className="page" style={{ minHeight: "70vh", display: "grid", placeItems: "center" }}>
            <form onSubmit={submit} style={{ width: 320, textAlign: "center" }}>
                <h2 style={{ marginBottom: 16 }}>Officers only</h2>
                <input
                    type="password"
                    value={input}
                    onChange={(e) => { setInput(e.target.value); setWrong(false); }}
                    placeholder="Password"
                    autoFocus
                    style={{
                        width: "100%", padding: "10px 14px", borderRadius: 8,
                        border: "1px solid var(--line, #ccc)", marginBottom: 10, fontSize: "1rem",
                    }}
                />
                {wrong && <p style={{ color: "var(--red, #c0392b)", fontSize: "0.9rem", margin: "0 0 10px" }}>Wrong password.</p>}
                <button type="submit" className="btn btn--ink" style={{ width: "100%" }}>Enter</button>
            </form>
        </div>
    );
}

export default function OfficerLookup() {
    const [unlocked, setUnlocked] = useState(
        () => sessionStorage.getItem("ksa_officer_unlocked") === "1"
    );
    const { members, status, error } = useMemberSheet();
    const [query, setQuery] = useState("");

    const results = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return [];
        return members.filter(
            (m) => m.name.toLowerCase().includes(q) || m.computingId.toLowerCase().includes(q)
        );
    }, [members, query]);

    if (!unlocked) {
        return <PasswordGate onUnlock={() => setUnlocked(true)} />;
    }

    return (
        <div className="page" style={{ padding: "60px 24px", maxWidth: 640, margin: "0 auto" }}>
            <h1 style={{ marginBottom: 8 }}>Member Lookup</h1>
            <p style={{ color: "var(--muted, #666)", marginBottom: 24 }}>
                Search by name or computing ID to check dues-paid status.
            </p>

            {status === "loading" && <p>Loading roster…</p>}
            {status === "error" && (
                <p style={{ color: "var(--red, #c0392b)" }}>
                    Couldn't load the sheet ({error}). Check that CSV_URL is set and the
                    sheet is published to the web.
                </p>
            )}

            {status === "ok" && (
                <>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Type a name or computing ID…"
                        style={{
                            width: "100%", padding: "12px 16px", borderRadius: 10,
                            border: "1px solid var(--line, #ccc)", fontSize: "1rem", marginBottom: 20,
                        }}
                    />

                    {query.trim() && results.length === 0 && (
                        <p style={{ color: "var(--muted, #666)" }}>No matches.</p>
                    )}

                    <div style={{ display: "grid", gap: 10 }}>
                        {results.map((m, i) => (
                            <div
                                key={m.computingId + i}
                                style={{
                                    display: "flex", justifyContent: "space-between", alignItems: "center",
                                    padding: "14px 18px", borderRadius: 10,
                                    border: "1px solid var(--line, #e2e2e2)",
                                    background: m.duesPaid ? "rgba(16,140,60,0.06)" : "rgba(192,57,43,0.06)",
                                }}
                            >
                                <div>
                                    <div style={{ fontWeight: 700 }}>{m.name}</div>
                                    <div style={{ fontSize: "0.85rem", color: "var(--muted, #666)" }}>{m.computingId}</div>
                                </div>
                                <span
                                    style={{
                                        fontWeight: 800, fontSize: "0.85rem", padding: "6px 12px", borderRadius: 999,
                                        color: m.duesPaid ? "#0a7d34" : "#c0392b",
                                        background: m.duesPaid ? "rgba(16,140,60,0.12)" : "rgba(192,57,43,0.12)",
                                    }}
                                >
                  {m.duesPaid ? "Dues paid" : "Not paid"}
                </span>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}