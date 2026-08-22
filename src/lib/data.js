/* src/lib/data.js — live data layer: Google Calendar + Gallery CMS (Drive/Sheet) */
import { useState, useEffect } from "react";
import config from "../config";

/* ---------------- Google Calendar ---------------- */
export const GCAL_ADD_URL =
    "https://calendar.google.com/calendar/u/0/r?cid=YjYzNzMyZjA1YTk0Y2JiZDliOWI0MjNkZjBjYTRhYjRhY2NkOTU1YTI3MDljYTJhMWZjMTBkNzRkNmRkOGEwMUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t";

export function tagFor(s = "") {
  s = s.toLowerCase();
  if (/k.?expo|hanguk|banquet|showcase/.test(s)) return "Signature";
  if (/chuseok|lunar|new year|culture|cultural|hanbok/.test(s)) return "Cultural";
  if (/mixer|social|game|olympic|fam|hang|night out|bonfire|picnic/.test(s)) return "Social";
  if (/workshop|study|gbm|meeting|info/.test(s)) return "Workshop";
  return "Event";
}

/* ---------------- Homepage Popup (Sheet + Drive banner) ---------------- */
export function usePopupEvent() {
    const [state, setState] = useState({ event: null, loading: true });
    useEffect(() => {
        const csv = config.POPUP_SHEET_CSV;
        if (!csv) { setState({ event: null, loading: false }); return; }
        let alive = true;
        fetch(csv)
            .then((r) => r.text())
            .then((t) => {
                if (!alive) return;
                const rows = parseCSV(t).filter((rw) => rw.some((c) => c && c.trim()));
                if (rows.length < 2) { setState({ event: null, loading: false }); return; }
                const head = rows[0].map((h) => h.trim().toLowerCase());
                const col = (n) => head.findIndex((h) => h.includes(n));
                const r = rows[1];
                const g = (n) => { const i = col(n); return i >= 0 ? (r[i] || "").trim() : ""; };
                const banner = `${config.PUB}/banner.webp`;
                setState({
                    event: {
                        title: g("title"),
                        date: g("date"),
                        time: g("time"),
                        loc: g("location"),
                        rsvp: g("rsvp"),
                        banner,
                    },
                    loading: false,
                });
            })
            .catch(() => { if (alive) setState({ event: null, loading: false }); });
        return () => { alive = false; };
    }, []);
    return state;
}

export function mapGCalEvent(e) {
    const startISO = (e.start && (e.start.dateTime || e.start.date)) || "";
    const allDay = !!(e.start && e.start.date && !e.start.dateTime);
    let d;
    if (allDay) {
        const [y, m, day] = startISO.split("-").map(Number);
        d = new Date(y, m - 1, day);
    } else {
        d = new Date(startISO);
    }

  const title = e.summary || "Untitled Event";
  const tag = tagFor(title + " " + (e.description || ""));
  const text = (e.description || "").replace(/<[^>]*>/g, "").trim();
  return {
    id: e.id || startISO + title,
    dateObj: d,
    month: isNaN(d) ? "" : d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day: isNaN(d) ? "" : String(d.getDate()).padStart(2, "0"),
    time: allDay ? "All day" : isNaN(d) ? "" : d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    title, tag,
    loc: e.location || "",
    text: text || (e.location ? e.location : "Details coming soon."),
    accent: tag === "Cultural" || tag === "Workshop" ? "var(--blue)" : "var(--red)",
    featured: /k.?expo/i.test(title),
    htmlLink: e.htmlLink || "",
  };
}

export function useGCalEvents(max = 12) {
  const [state, setState] = useState({ events: [], loading: true, live: false, error: "" });
  useEffect(() => {
    const key = config.GCAL_API_KEY;
    if (!key) { setState({ events: [], loading: false, live: false, error: "no-key" }); return; }
    let alive = true;
    const url = new URL("https://www.googleapis.com/calendar/v3/calendars/" + encodeURIComponent(config.GCAL_CAL_ID) + "/events");
    url.searchParams.set("key", key);
    url.searchParams.set("singleEvents", "true");
    url.searchParams.set("orderBy", "startTime");
    url.searchParams.set("timeMin", new Date().toISOString());
    url.searchParams.set("maxResults", String(max));
    url.searchParams.set("timeZone", "America/New_York");
    fetch(url.toString())
      .then((r) => r.json())
      .then((data) => {
        if (!alive) return;
        if (data.error) { setState({ events: [], loading: false, live: false, error: "api" }); return; }
        const items = (data.items || [])
          .filter((e) => e.status !== "cancelled" && e.start && (e.start.dateTime || e.start.date))
          .map(mapGCalEvent);
        setState({ events: items, loading: false, live: true, error: "" });
      })
      .catch(() => { if (alive) setState({ events: [], loading: false, live: false, error: "fetch" }); });
    return () => { alive = false; };
  }, [max]);
  return state;
}

/* ---------------- Gallery CMS (Drive folders OR Sheet index) ---------------- */
function driveKey() { return config.DRIVE_API_KEY || config.GCAL_API_KEY; }
export function driveImg(id, w) { return "https://lh3.googleusercontent.com/d/" + id + "=w" + w; }

function seasonLabel(d) {
  if (isNaN(d)) return "";
  const m = d.getMonth(), y = d.getFullYear();
  const s = m <= 4 ? "Spring" : m <= 7 ? "Summer" : "Fall";
  return s + " " + y;
}

function parseCSV(text) {
  const rows = []; let row = [], cur = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c; }
    else if (c === '"') q = true;
    else if (c === ",") { row.push(cur); cur = ""; }
    else if (c === "\n") { row.push(cur); rows.push(row); row = []; cur = ""; }
    else if (c !== "\r") cur += c;
  }
  if (cur !== "" || row.length) { row.push(cur); rows.push(row); }
  return rows;
}

async function fetchSheetAlbums(csvUrl) {
  const r = await fetch(csvUrl);
  const t = await r.text();
  const rows = parseCSV(t).filter((rw) => rw.some((c) => c && c.trim()));
  if (rows.length < 2) return [];
  const head = rows[0].map((h) => h.trim().toLowerCase());
  const idx = (n) => head.findIndex((h) => h.includes(n));
  const iT = idx("title"), iD = idx("date"), iC = idx("categ"), iCov = idx("cover"), iL = idx("link"), iDesc = idx("desc"), iLoc = idx("loc");
  return rows.slice(1).map((rw, k) => {
    const dateStr = iD >= 0 ? (rw[iD] || "").trim() : "";
    const dt = dateStr ? new Date(dateStr) : NaN;
    const cover = iCov >= 0 ? (rw[iCov] || "").trim() : "";
    return {
      id: "sheet" + k,
      title: (iT >= 0 ? rw[iT] : "Album").trim() || "Album",
      sub: iDesc >= 0 ? (rw[iDesc] || "").trim() : "",
      season: dateStr || seasonLabel(dt),
      loc: iLoc >= 0 ? (rw[iLoc] || "").trim() : "",
      cat: (iC >= 0 ? (rw[iC] || "").trim() : "") || "Culture",
      link: iL >= 0 ? (rw[iL] || "#").trim() : "#",
      covers: cover ? [cover] : [],
    };
  }).filter((a) => a.title);
}

async function fetchDriveAlbums(folderId, key) {
  const folderUrl = new URL("https://www.googleapis.com/drive/v3/files");
  folderUrl.searchParams.set("q", "'" + folderId + "' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false");
  folderUrl.searchParams.set("fields", "files(id,name,createdTime)");
  folderUrl.searchParams.set("orderBy", "createdTime desc");
  folderUrl.searchParams.set("key", key);
  folderUrl.searchParams.set("pageSize", "40");
  folderUrl.searchParams.set("supportsAllDrives", "true");
  folderUrl.searchParams.set("includeItemsFromAllDrives", "true");
  const fr = await fetch(folderUrl.toString()).then((r) => r.json());
  if (fr.error) throw new Error("drive-folders");
  const folders = fr.files || [];
  const albums = await Promise.all(folders.map(async (f) => {
    const imgUrl = new URL("https://www.googleapis.com/drive/v3/files");
    imgUrl.searchParams.set("q", "'" + f.id + "' in parents and mimeType contains 'image/' and trashed=false");
    imgUrl.searchParams.set("fields", "files(id,name)");
    imgUrl.searchParams.set("orderBy", "name");
    imgUrl.searchParams.set("key", key);
    imgUrl.searchParams.set("pageSize", "80");
    imgUrl.searchParams.set("supportsAllDrives", "true");
    imgUrl.searchParams.set("includeItemsFromAllDrives", "true");
    const ir = await fetch(imgUrl.toString()).then((r) => r.json());
    const imgs = ir.files || [];
    let cat = "Culture", title = f.name || "Album";
    if (title.includes("|")) { const p = title.split("|"); cat = p[0].trim() || "Culture"; title = p.slice(1).join("|").trim(); }
    const d = new Date(f.createdTime);
    return {
      id: f.id, title, sub: imgs.length + " photo" + (imgs.length === 1 ? "" : "s"),
      season: seasonLabel(d), loc: "", cat,
      link: "https://drive.google.com/drive/folders/" + f.id,
      images: imgs.map((im) => driveImg(im.id, 1600)),
      covers: imgs.slice(0, 4).map((im) => driveImg(im.id, 800)),
      count: imgs.length,
    };
  }));
  return albums.filter((a) => a.count > 0);
}

export function useGallery() {
  const [state, setState] = useState({ albums: [], loading: true, source: "none", error: "" });
  useEffect(() => {
    const source = config.GALLERY_SOURCE;
    let alive = true;
    (async () => {
      if ((source === "sheet" || source === "auto") && config.GALLERY_SHEET_CSV) {
        try {
          const albums = await fetchSheetAlbums(config.GALLERY_SHEET_CSV);
          if (alive && albums.length) { setState({ albums, loading: false, source: "sheet", error: "" }); return; }
        } catch (e) { /* fall through */ }
      }
      const key = driveKey();
      if ((source === "drive" || source === "auto") && config.GALLERY_FOLDER_ID && key) {
        try {
          const albums = await fetchDriveAlbums(config.GALLERY_FOLDER_ID, key);
          if (alive) { setState({ albums, loading: false, source: albums.length ? "drive" : "none", error: albums.length ? "" : "empty" }); return; }
        } catch (e) { if (alive) setState({ albums: [], loading: false, source: "none", error: "drive" }); return; }
      }
      if (alive) setState({ albums: [], loading: false, source: "none", error: "no-config" });
    })();
    return () => { alive = false; };
  }, []);
  return state;
}
