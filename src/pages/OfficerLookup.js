import React, { useState, useEffect, useMemo } from "react";

/* ============================================================
   OFFICER LOOKUP — member dues-paid + liability/entry checker
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

   COLUMN LAYOUT (0-indexed):
     A (0) Name                              [roster]
     B (1) Computing ID                      [roster]
     C (2) (blank)
     D (3) Dues paid (TRUE/FALSE)            [roster — OFFICIAL, manual]
     H (7) Paid?                             [form] "Paid dues AT PARTY" |
                                                      "Paid Entry Fee" |
                                                      "Due paying member"
     I (8) Form of payment                   [form] Venmo/Zelle/Cash/
                                                      "Due paying member"
     J (9) Name                              [form]
     K (10) Computing ID                     [form]

   ROW OFFSETS ARE DIFFERENT FOR THE TWO TABLES — this matters:
     - The roster (A-D) has a real header in row 1, so it's parsed
       starting from row 2.
     - The form block (H-K) is pulled in via a formula like
       ='Form Responses 1'!B2:E — note the B2. That formula already
       skips the form's own header row before the data ever lands in
       this sheet. So row 1 of THIS sheet is a real form response for
       H-K, not a header. It must be parsed starting from row 1, or
       whoever submitted first silently disappears.
     - If that formula's range ever changes (e.g. someone edits it to
       start at B1, or a row gets inserted above it), this offset
       assumption breaks again the same way. Worth a comment on that
       cell in the sheet itself warning against changing the range
       without checking this code.

   IMPORTANT: someone can fill out the form WITHOUT being a member on
   the roster (they just paid an entry fee). So this does NOT assume
   every form-filler exists in A-D, and does NOT assume every roster
   member filled out the form. The two tables are merged by Computing
   ID, and either side can be missing — see useMemberSheet below.

   ALSO IMPORTANT: "Paid dues AT PARTY" / "Due paying member" / "Paid
   Entry Fee" on the form are self-reported claims, filled out by the
   attendee. They do NOT update column D automatically — an officer
   updates D by hand after checking payment. So `duesPaid` always
   comes only from column D, never inferred from the form. The UI
   flags claims that still need manual verification instead of
   silently trusting them.
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

const norm = (s) => (s || "").trim().toLowerCase();

// "Due paying member" / "Paid dues AT PARTY" are self-reported claims of
// dues-paid status made on the party form. They're distinct from the
// roster's real duesPaid column, which an officer updates by hand.
const SELF_REPORTED_DUES_CLAIMS = new Set(["due paying member", "paid dues at party"]);

// "Paid Entry Fee" has no corresponding roster column to check against at
// all — there's nothing to auto-reconcile it with. So it always needs a
// manual payment check, not just when it conflicts with something.
const ENTRY_FEE_CLAIM = "paid entry fee";

function useMemberSheet() {
    const [members, setMembers] = useState([]);
    const [status, setStatus] = useState("loading"); // loading | ok | error
    const [error, setError] = useState(null);
    const [loadedAt, setLoadedAt] = useState(null);
    // Bumping this triggers a manual refetch — see refresh() below.
    const [refreshTick, setRefreshTick] = useState(0);

    useEffect(() => {
        let cancelled = false;
        setStatus((prev) => (prev === "ok" ? "refreshing" : "loading"));
        // Cache-bust so a manual refresh doesn't just get the browser's
        // cached copy of the CSV from the first load.
        const url = CSV_URL + (CSV_URL.includes("?") ? "&" : "?") + "_ts=" + Date.now();
        fetch(url)
            .then((r) => {
                if (!r.ok) throw new Error("Sheet fetch failed (" + r.status + ")");
                return r.text();
            })
            .then((text) => {
                if (cancelled) return;
                const allRows = parseCSV(text);

                // Roster (A-D) has a real header in row 1 — skip it.
                const rosterRows = allRows.slice(1);

                // Form data (H-K) is pulled in via ='Form Responses 1'!B2:E,
                // which already skips the form's own header row before it
                // lands here. So row 1 of THIS sheet is real data for H-K,
                // not a header — do NOT slice it off.
                const formRows = allRows;

                // Roster table, keyed by Computing ID.
                const rosterById = new Map();
                for (const r of rosterRows) {
                    const computingId = (r[1] || "").trim();
                    const name = (r[0] || "").trim();
                    if (!computingId || !name) continue;
                    rosterById.set(norm(computingId), {
                        name,
                        computingId,
                        duesPaid: (r[3] || "").trim().toUpperCase() === "TRUE",
                    });
                }

                // Liability/entry form table, keyed by Computing ID. NOT
                // assumed to be members — can include entry-fee-only
                // attendees who never appear in the roster at all.
                const formById = new Map();
                for (const r of formRows) {
                    const computingId = (r[10] || "").trim(); // K
                    if (!computingId) continue;
                    formById.set(norm(computingId), {
                        name: (r[9] || "").trim(),      // J
                        paidReason: (r[7] || "").trim(), // H
                        paidVia: (r[8] || "").trim(),    // I
                    });
                }

                // Union of both tables — someone can be in either, or both.
                const allIds = new Set([...rosterById.keys(), ...formById.keys()]);

                const parsed = Array.from(allIds).map((key) => {
                    const roster = rosterById.get(key);
                    const form = formById.get(key);
                    const claimsDuesPaid = !!form && SELF_REPORTED_DUES_CLAIMS.has(norm(form.paidReason));
                    const claimsEntryFeePaid = !!form && norm(form.paidReason) === ENTRY_FEE_CLAIM;
                    const duesPaid = roster?.duesPaid || false;

                    return {
                        name: roster?.name || form?.name || "(no name on file)",
                        computingId: roster?.computingId || form?.computingId || key,
                        isMember: !!roster,          // exists on the official roster
                        duesPaid,                    // ONLY from column D, never inferred
                        formSubmitted: !!form,       // filled out liability/entry form
                        paidReason: form?.paidReason || "",
                        paidVia: form?.paidVia || "",
                        // True when the form claims dues-paid status but the roster
                        // hasn't been updated to reflect it yet — needs an officer
                        // to go check the sheet and reconcile manually.
                        pendingDuesReconciliation: claimsDuesPaid && !duesPaid,
                        // True whenever someone claims they paid the entry fee —
                        // there's no roster column for this at all, so it always
                        // needs a manual check, not just on a conflict.
                        pendingEntryFeeCheck: claimsEntryFeePaid,
                    };
                });

                setMembers(parsed);
                setStatus("ok");
                setLoadedAt(new Date());
            })
            .catch((e) => {
                if (cancelled) return;
                setError(e.message);
                setStatus("error");
            });
        return () => { cancelled = true; };
    }, [refreshTick]);

    const refresh = () => setRefreshTick((n) => n + 1);

    return { members, status, error, loadedAt, refresh };
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
        <div className="page" style={{ minHeight: "70vh", display: "grid", placeItems: "center", padding: "0 16px" }}>
            <form onSubmit={submit} style={{ width: "100%", maxWidth: 320, textAlign: "center" }}>
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
                        boxSizing: "border-box",
                    }}
                />
                {wrong && <p style={{ color: "var(--red, #c0392b)", fontSize: "0.9rem", margin: "0 0 10px" }}>Wrong password.</p>}
                <button type="submit" className="btn btn--ink" style={{ width: "100%" }}>Enter</button>
            </form>
        </div>
    );
}

// `long` badges (the self-reported-claim warnings) get a smaller radius
// instead of a pill, so they don't look broken once the text wraps to
// two lines on a narrow screen. Short badges (Dues paid / Form ✓ / etc)
// stay pill-shaped since they never wrap.
function Badge({ tone, long, children }) {
    const palette = {
        good: { color: "#0a7d34", background: "rgba(16,140,60,0.12)" },
        bad: { color: "#c0392b", background: "rgba(192,57,43,0.12)" },
        warn: { color: "#a15c00", background: "rgba(214,140,0,0.14)" },
        neutral: { color: "#555", background: "rgba(0,0,0,0.06)" },
    }[tone];

    return (
        <span
            style={{
                display: "inline-block",
                fontWeight: 800,
                fontSize: "clamp(0.78rem, 3.2vw, 0.85rem)",
                lineHeight: 1.35,
                padding: long ? "6px 12px" : "6px 12px",
                borderRadius: long ? 10 : 999,
                color: palette.color,
                background: palette.background,
                whiteSpace: long ? "normal" : "nowrap",
            }}
        >
            {children}
        </span>
    );
}

export default function OfficerLookup() {
    const [unlocked, setUnlocked] = useState(
        () => sessionStorage.getItem("ksa_officer_unlocked") === "1"
    );
    const { members, status, error, loadedAt, refresh } = useMemberSheet();
    const [query, setQuery] = useState("");
    const [showAttentionOnly, setShowAttentionOnly] = useState(false);

    // Minimum characters before we show name/ID search results. At events
    // with hundreds of entries, a 1-character query returns too much noise
    // to be useful, so require at least 2 before matching.
    const MIN_QUERY_LENGTH = 2;

    const attentionCount = useMemo(
        () => members.filter((m) => m.pendingDuesReconciliation || m.pendingEntryFeeCheck).length,
        [members]
    );

    const results = useMemo(() => {
        const q = query.trim().toLowerCase();
        const base = showAttentionOnly
            ? members.filter((m) => m.pendingDuesReconciliation || m.pendingEntryFeeCheck)
            : members;

        // Attention mode shows its full filtered list even with an empty
        // query — that's the point, a ready-made list to check. Normal
        // search still needs a real query, and needs it long enough to
        // avoid a flood of matches.
        if (!q) return showAttentionOnly ? base : [];
        if (q.length < MIN_QUERY_LENGTH) return "too_short";
        return base.filter(
            (m) => m.name.toLowerCase().includes(q) || m.computingId.toLowerCase().includes(q)
        );
    }, [members, query, showAttentionOnly]);

    const resultsTooShort = results === "too_short";
    const resultList = resultsTooShort ? [] : results;

    if (!unlocked) {
        return <PasswordGate onUnlock={() => setUnlocked(true)} />;
    }

    return (
        <div
            className="page"
            style={{
                // Was a flat 60px/24px — way too much dead space above the
                // heading on a phone. Scales with viewport width instead,
                // and shrinks the side gutters so cards get more room.
                padding: "clamp(20px, 8vw, 60px) 16px 48px",
                maxWidth: 640,
                margin: "0 auto",
                boxSizing: "border-box",
            }}
        >
            <h1 style={{ marginBottom: 8, fontSize: "clamp(1.5rem, 6vw, 2rem)" }}>Member Lookup</h1>
            <p style={{ color: "var(--muted, #666)", marginBottom: 4, fontSize: "clamp(0.9rem, 3.5vw, 1rem)" }}>
                Search by name or computing ID to check membership, dues, and party form status.
            </p>

            {(status === "ok" || status === "refreshing") && (
                <div style={{
                    display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "space-between", alignItems: "center",
                    marginBottom: 20, fontSize: "0.8rem", color: "var(--muted, #999)",
                }}>
                    <span>
                        {status === "refreshing"
                            ? "Refreshing…"
                            : loadedAt
                                ? `Loaded ${loadedAt.toLocaleTimeString()}`
                                : ""}
                    </span>
                    <button
                        type="button"
                        onClick={refresh}
                        disabled={status === "refreshing"}
                        style={{
                            border: "none", background: "none", padding: "4px 0",
                            color: "inherit", textDecoration: "underline",
                            cursor: status === "refreshing" ? "default" : "pointer",
                            fontSize: "0.8rem",
                        }}
                    >
                        Refresh
                    </button>
                </div>
            )}

            {status === "loading" && <p>Loading roster…</p>}
            {status === "error" && (
                <p style={{ color: "var(--red, #c0392b)" }}>
                    Couldn't load the sheet ({error}). Check that CSV_URL is set and the
                    sheet is published to the web.
                </p>
            )}

            {(status === "ok" || status === "refreshing") && (
                <>
                    <button
                        type="button"
                        onClick={() => setShowAttentionOnly((v) => !v)}
                        disabled={attentionCount === 0 && !showAttentionOnly}
                        style={{
                            display: "block", width: "100%", padding: "12px 14px", borderRadius: 8,
                            marginBottom: 12, textAlign: "left", boxSizing: "border-box",
                            border: showAttentionOnly ? "1px solid #a15c00" : "1px solid var(--line, #ccc)",
                            background: showAttentionOnly ? "rgba(214,140,0,0.14)" : "transparent",
                            color: showAttentionOnly ? "#a15c00" : attentionCount === 0 ? "var(--muted, #999)" : "inherit",
                            fontWeight: 700, fontSize: "0.85rem",
                            cursor: attentionCount === 0 && !showAttentionOnly ? "default" : "pointer",
                        }}
                    >
                        {showAttentionOnly
                            ? `Showing ${attentionCount} needing attention — tap to clear`
                            : attentionCount > 0
                                ? `${attentionCount} need attention — tap to view`
                                : "No payments need checking"}
                    </button>

                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Type a name or computing ID…"
                        style={{
                            width: "100%", padding: "12px 16px", borderRadius: 10,
                            border: "1px solid var(--line, #ccc)", fontSize: "1rem", marginBottom: 20,
                            boxSizing: "border-box",
                        }}
                    />

                    {resultsTooShort && (
                        <p style={{ color: "var(--muted, #666)" }}>
                            Type at least {MIN_QUERY_LENGTH} characters…
                        </p>
                    )}

                    {!resultsTooShort && (query.trim() || showAttentionOnly) && resultList.length === 0 && (
                        <p style={{ color: "var(--muted, #666)" }}>No matches.</p>
                    )}

                    <div style={{ display: "grid", gap: 10 }}>
                        {resultList.map((m, i) => (
                            <div
                                key={m.computingId + i}
                                style={{
                                    display: "flex", flexDirection: "column", gap: 10,
                                    padding: "14px 16px", borderRadius: 10,
                                    border: "1px solid var(--line, #e2e2e2)",
                                    background: m.duesPaid ? "rgba(16,140,60,0.06)" : "rgba(192,57,43,0.03)",
                                }}
                            >
                                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                                    {/* minWidth: 0 lets the name/ID column shrink and wrap
                                        instead of forcing the badge off-card on narrow screens */}
                                    <div style={{ minWidth: 0 }}>
                                        <div style={{ fontWeight: 700, wordBreak: "break-word" }}>{m.name}</div>
                                        <div style={{ fontSize: "0.85rem", color: "var(--muted, #666)" }}>{m.computingId}</div>
                                    </div>
                                    {m.isMember ? (
                                        <Badge tone={m.duesPaid ? "good" : "bad"}>
                                            {m.duesPaid ? "Dues paid" : "Not paid"}
                                        </Badge>
                                    ) : (
                                        <Badge tone="neutral">Not on roster</Badge>
                                    )}
                                </div>

                                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                                    <div style={{ fontSize: "0.85rem", color: "var(--muted, #666)", minWidth: 0, wordBreak: "break-word" }}>
                                        {m.formSubmitted
                                            ? `${m.paidReason}${m.paidVia ? " · " + m.paidVia : ""}`
                                            : "No party form on file"}
                                    </div>
                                    <Badge tone={m.formSubmitted ? "good" : "bad"}>
                                        {m.formSubmitted ? "Form ✓" : "Not submitted"}
                                    </Badge>
                                </div>

                                {m.pendingDuesReconciliation && (
                                    <Badge tone="warn" long>Claims dues paid — CHECK THEIR PAYMENT</Badge>
                                )}
                                {m.pendingEntryFeeCheck && (
                                    <Badge tone="warn" long>Claims Party Fee — CHECK THEIR PAYMENT</Badge>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}