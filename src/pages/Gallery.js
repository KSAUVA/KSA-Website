import React, { useState, useEffect } from "react";
import { useReveal } from "../lib/ui";
import { useGallery } from "../lib/data";
import { Ico } from "../lib/icons";

const ALBUMS = [
  { id: "kexpo", title: "K-EXPO + Hanguk Day", sub: "Performances, food, and community in one day.", season: "Fall 2024", loc: "Newcomb & South Lawn", cat: "Culture",
    link: "https://photos.app.goo.gl/R2gjSDt44zdHLg3DA",
    covers: [
      "https://lh3.googleusercontent.com/pw/AP1GczOjbMFfvjuj0C7Ycr9OghhoZA-XZgNygHd2wHXZ9NSNHGQuvcC9LvwbmPZisX0HqPkZuy8OHDtsa0KOHHrGnxYtI4Adh7edrwmLUfHCiWJOBS25aULH=w1920-h1080",
      "https://lh3.googleusercontent.com/pw/AP1GczPbdTa1jbe5GKCF9P8fJ97Y2G15OZQKuNZ0yNaqKRQuoeDpHBm7tVcj6iMQyMRS3C3fCGFVImACZq16ohFu2H92YCT9P2JDyULi6rh_APaQmX_rmCRo=w1920-h1080",
      "https://lh3.googleusercontent.com/pw/AP1GczNJO7rzuXiZFfUghIaTESdzyIkPcmIZqVyeA1WIMK11iVZ2tzhC9Au4W_ov7j1tpsb_nLBVzy4HWgCRRDE1WtIewwWZCjMOYdxkvwrjJT4oyqVBJNp0=w1920-h1080",
      "https://lh3.googleusercontent.com/pw/AP1GczPJ8dlabrvLJ8xtDzZKOAb7EnplLNrHU90c_yFFggvavEE5ntjYYLXy9PAeuQZzKEbe_bPSI0103Nn56azr1krLN0JNymtZ5vBO96mlb6KJDZhmcgPD=w1920-h1080",
    ]},
  { id: "chuseok", title: "Chuseok Night", sub: "Games, food, and traditions for Korean Thanksgiving.", season: "Fall 2024", loc: "Newcomb Ballroom", cat: "Culture",
    link: "https://photos.app.goo.gl/R2gjSDt44zdHLg3DA",
    covers: ["https://lh3.googleusercontent.com/pw/AP1GczPWP1ghXAaFK9rvSfV1K57YhZhZ_cEu5jOa69R8T0AYgxuh68OjmMMl-fp3vv6jXAdo2PavnrxSG6lcrL08ntV9QITmDXXyufWR3eQemUDKo5J7oF9S=w1920-h1080"]},
  { id: "families", title: "KSA Families Reveal", sub: "Meeting bigs, littles, and new friends.", season: "Fall 2024", loc: "South Lawn", cat: "Families",
    link: "https://photos.app.goo.gl/R2gjSDt44zdHLg3DA",
    covers: ["https://lh3.googleusercontent.com/pw/AP1GczPbdTa1jbe5GKCF9P8fJ97Y2G15OZQKuNZ0yNaqKRQuoeDpHBm7tVcj6iMQyMRS3C3fCGFVImACZq16ohFu2H92YCT9P2JDyULi6rh_APaQmX_rmCRo=w1920-h1080"]},
];

function GalleryConnect() {
  const [drive, setDrive] = useState("");
  const [sheet, setSheet] = useState("");
  const saveDrive = () => {
    const v = drive.trim(); if (!v) return;
    try { window.localStorage.setItem("ksa_gallery_folder", v); window.localStorage.setItem("ksa_gallery_source", "drive"); } catch (e) {}
    window.location.reload();
  };
  const saveSheet = () => {
    const v = sheet.trim(); if (!v) return;
    try { window.localStorage.setItem("ksa_gallery_sheet", v); window.localStorage.setItem("ksa_gallery_source", "sheet"); } catch (e) {}
    window.location.reload();
  };
  return (
    <div className="g-connect reveal">
      <div>
        <h4>📁 Google Drive folder</h4>
        <p>Paste the parent folder's ID (the part after <code>/folders/</code> in its URL). Drive API must be enabled on your key.</p>
        <div className="g-conn-row">
          <input placeholder="Drive folder ID" value={drive} onChange={(e) => setDrive(e.target.value)} />
          <button className="btn btn--blue btn--sm" onClick={saveDrive}>Use Drive</button>
        </div>
      </div>
      <div>
        <h4>📊 Google Sheet index</h4>
        <p>Paste your sheet's <b>Publish&nbsp;to&nbsp;web → CSV</b> link. Columns: Title, Date, Category, Cover, Link.</p>
        <div className="g-conn-row">
          <input placeholder="Published CSV URL" value={sheet} onChange={(e) => setSheet(e.target.value)} />
          <button className="btn btn--blue btn--sm" onClick={saveSheet}>Use Sheet</button>
        </div>
      </div>
    </div>
  );
}

function GalleryLightbox({ album, onClose }) {
  const [i, setI] = useState(0);
  const imgs = album.images || [];
  const go = (d) => setI((p) => (p + d + imgs.length) % imgs.length);
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });
  return (
    <div className="glb" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="glb-top">
        <h3>{album.title}</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span>{i + 1} / {imgs.length}</span>
          <button className="glb-x" onClick={onClose} aria-label="Close">✕</button>
        </div>
      </div>
      <div className="glb-stage">
        {imgs.length > 1 && <button className="glb-nav prev" onClick={() => go(-1)} aria-label="Previous">‹</button>}
        <img src={imgs[i]} alt={album.title + " " + (i + 1)} />
        {imgs.length > 1 && <button className="glb-nav next" onClick={() => go(1)} aria-label="Next">›</button>}
      </div>
      <div className="glb-strip">
        {imgs.map((u, j) => (
          <div className={"glb-thumb" + (j === i ? " active" : "")} key={j} onClick={() => setI(j)}><img src={album.covers[j] || u} alt="" loading="lazy" /></div>
        ))}
      </div>
      <div className="glb-foot"><a href={album.link} target="_blank" rel="noreferrer">Open this album in Google Drive ↗</a></div>
    </div>
  );
}

export default function Gallery() {
  useReveal();
  const { albums: liveData, loading, source } = useGallery();
  const [cat, setCat] = useState("All");
  const [lightbox, setLightbox] = useState(null);
  const [connect, setConnect] = useState(false);
  const live = source !== "none" && liveData.length > 0;
  const albums = live ? liveData : ALBUMS;
  const cats = ["All", ...Array.from(new Set(albums.map((a) => a.cat).filter(Boolean)))];
  const list = cat === "All" ? albums : albums.filter((a) => a.cat === cat);
  return (
    <div className="page">
      <section className="ghero">
        <div className="pattern" style={{ opacity: 0.1 }} />
        <div className="wrap" style={{ position: "relative" }}>
          <span className="eyebrow eyebrow--light reveal"><i className="kicker-dot" />Gallery<span className="han">갤러리</span></span>
          <h1 className="h-display reveal d1" style={{ margin: "18px 0 16px", maxWidth: 620 }}>KSA moments.</h1>
          <p className="lead reveal d2" style={{ color: "#D6DEF2", maxWidth: 540, marginBottom: 28 }}>
            A look back at performances, food nights, fam week, and the memories in between.
          </p>
          <div className="g-tabs reveal d3">
            {cats.map((c) => (<button key={c} className={"g-tab" + (cat === c ? " active" : "")} onClick={() => setCat(c)}>{c}</button>))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="g-head reveal">
            <div>
              <h2 className="h-lg">Albums</h2>
              <p className="text-muted" style={{ margin: "4px 0 0" }}>{source === "drive" ? "Tap an album to flip through the photos." : "Tap any album to open the full set in Google Photos."}</p>
            </div>
            <div className="g-headright">
              {!live && <button className="ev-live off ev-live-btn" onClick={() => setConnect((s) => !s)} title="Connect a live gallery source"><span className="ev-live-dot" />Sample albums · connect</button>}
              <span className="text-muted" style={{ fontSize: "0.9rem" }}>{list.length} album{list.length !== 1 ? "s" : ""}{cat !== "All" ? " · " + cat : ""}</span>
            </div>
          </div>

          {connect && !live && <GalleryConnect />}

          {loading ? (
            <div className="g-grid">
              {[0, 1].map((i) => (
                <div className="g-card g-skel" key={i}>
                  <div className="g-covers c1"><div className="g-cover"><span className="sk" style={{ width: "100%", height: "100%", display: "block" }} /></div></div>
                  <div className="g-body"><span className="sk sk-line" style={{ marginBottom: 10 }} /><span className="sk sk-line short" /></div>
                </div>
              ))}
            </div>
          ) : list.length === 0 ? (
            <div className="g-empty reveal">No albums in this category yet — check back soon!</div>
          ) : (
            <div className="g-grid">
              {list.map((a, i) => {
                const isDrive = Array.isArray(a.images) && a.images.length > 0;
                const inner = (
                  <React.Fragment>
                    <div className={"g-covers c" + Math.min(a.covers.length || 1, 4)}>
                      {(a.covers.length ? a.covers : [""]).slice(0, 4).map((u, j) => (
                        <div className="g-cover" key={j}>{u ? <img src={u} alt={a.title + " " + (j + 1)} loading="lazy" /> : <span className="g-cover-ph">{Ico.cal({ width: 22, height: 22 })}</span>}</div>
                      ))}
                      <div className="g-cover-overlay">
                        <span className="chip chip--ink">{isDrive ? a.count + " photos" : "Album preview"}</span>
                        <span className="g-open">{isDrive ? "View" : "Open"} {Ico.ext({ width: 14, height: 14 })}</span>
                      </div>
                    </div>
                    <div className="g-body">
                      <h3 style={{ fontSize: "1.22rem", margin: "0 0 6px" }}>{a.title}</h3>
                      {a.sub && <p className="text-muted" style={{ margin: "0 0 14px", fontSize: "0.92rem" }}>{a.sub}</p>}
                      <div className="g-chips">{[a.season, a.loc, a.cat].filter(Boolean).map((c, k) => <span className="chip" key={k}>{c}</span>)}</div>
                    </div>
                  </React.Fragment>
                );
                return isDrive ? (
                  <button type="button" className={"g-card g-card--btn reveal d" + ((i % 4) + 1)} key={a.id} onClick={() => setLightbox(a)}>{inner}</button>
                ) : (
                  <a href={a.link} target="_blank" rel="noreferrer" className={"g-card reveal d" + ((i % 4) + 1)} key={a.id}>{inner}</a>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {lightbox && <GalleryLightbox album={lightbox} onClose={() => setLightbox(null)} />}

      <style>{`
        .ghero { background: var(--ink); color: #fff; padding: 140px 0 80px; position: relative; overflow: hidden; }
        .ghero::after { content: ""; position: absolute; inset: 0; background: radial-gradient(900px 400px at 18% 0%, rgba(10,63,168,0.5), transparent 60%), radial-gradient(820px 360px at 92% 100%, rgba(205,46,58,0.42), transparent 60%); }
        .ghero .wrap { z-index: 1; }
        .g-tabs { display: inline-flex; gap: 4px; padding: 5px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.16); border-radius: var(--r-pill); }
        .g-tab { border: none; background: none; padding: 9px 18px; border-radius: var(--r-pill); font-weight: 700; font-size: 0.88rem; color: #C2CCE4; cursor: pointer; transition: all .2s; }
        .g-tab.active { background: #fff; color: var(--ink); }
        .g-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; margin-bottom: 32px; flex-wrap: wrap; }
        .g-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 26px; }
        .g-card { display: block; background: var(--surface); border: 1px solid var(--line); border-radius: var(--r-lg); overflow: hidden; box-shadow: var(--shadow-sm); transition: transform .3s var(--ease), box-shadow .3s var(--ease); }
        .g-card:hover { transform: translateY(-5px); box-shadow: var(--shadow-lg); }
        .g-covers { position: relative; display: grid; gap: 3px; aspect-ratio: 16/9; background: var(--ink); }
        .g-covers.c1 { grid-template-columns: 1fr; }
        .g-covers.c2 { grid-template-columns: 1fr 1fr; }
        .g-covers.c3, .g-covers.c4 { grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; }
        .g-covers.c3 .g-cover:first-child { grid-row: span 2; }
        .g-cover { overflow: hidden; }
        .g-cover img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s var(--ease); }
        .g-card:hover .g-cover img { transform: scale(1.05); }
        .g-cover-overlay { position: absolute; inset: 0; display: flex; justify-content: space-between; align-items: flex-end; padding: 14px; background: linear-gradient(to top, rgba(11,27,58,0.55), transparent 45%); pointer-events: none; }
        .g-open { color: #fff; font-size: 0.82rem; font-weight: 700; display: inline-flex; align-items: center; gap: 5px; }
        .g-body { padding: 22px 24px 24px; }
        .g-chips { display: flex; gap: 8px; flex-wrap: wrap; }
        .g-empty { text-align: center; padding: 60px 20px; border: 1px dashed var(--line-2); border-radius: var(--r-lg); color: var(--muted); }
        .g-card--btn { font-family: inherit; text-align: left; cursor: pointer; padding: 0; width: 100%; }
        .g-headright { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
        .g-cover-ph { width: 100%; height: 100%; display: grid; place-items: center; color: rgba(255,255,255,0.4); background: var(--ink-2); }
        .g-skel { pointer-events: none; }
        .g-connect { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; background: var(--ink); color: #fff; border-radius: var(--r-lg); padding: 24px; margin-bottom: 28px; }
        .g-connect h4 { font-size: 1rem; margin: 0 0 6px; }
        .g-connect p { margin: 0 0 12px; font-size: 0.86rem; color: #A9B6D6 !important; }
        .g-connect code { background: rgba(255,255,255,0.12); padding: 1px 6px; border-radius: 5px; font-size: 0.82em; }
        .g-connect .g-conn-row { display: flex; gap: 8px; }
        .g-connect input { flex: 1; padding: 10px 13px; border-radius: var(--r-sm); border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.08); color: #fff; font-family: inherit; font-size: 0.86rem; }
        .g-connect input::placeholder { color: #8FA3CF; }
        .g-connect input:focus { outline: none; border-color: var(--blue-soft); }
        @media (max-width: 680px) { .g-connect { grid-template-columns: 1fr; } }
        .glb { position: fixed; inset: 0; z-index: 1000; background: rgba(7,16,36,0.95); display: flex; flex-direction: column; animation: glbFade .25s ease; }
        @keyframes glbFade { from { opacity: 0; } to { opacity: 1; } }
        .glb-top { display: flex; align-items: center; justify-content: space-between; padding: 16px 22px; color: #fff; flex-shrink: 0; }
        .glb-top h3 { font-size: 1.1rem; margin: 0; }
        .glb-top span { color: #9FB4E0; font-size: 0.86rem; font-variant-numeric: tabular-nums; }
        .glb-x { width: 40px; height: 40px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.06); color: #fff; cursor: pointer; font-size: 16px; }
        .glb-x:hover { background: rgba(255,255,255,0.16); }
        .glb-stage { flex: 1; display: flex; align-items: center; justify-content: center; position: relative; min-height: 0; padding: 0 16px; }
        .glb-stage img { max-width: min(1100px, 92vw); max-height: 72vh; border-radius: 10px; box-shadow: 0 30px 70px rgba(0,0,0,0.5); object-fit: contain; }
        .glb-nav { position: absolute; top: 50%; transform: translateY(-50%); width: 52px; height: 52px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.22); background: rgba(11,27,58,0.6); color: #fff; font-size: 22px; cursor: pointer; display: grid; place-items: center; transition: background .2s; }
        .glb-nav:hover { background: rgba(11,27,58,0.9); }
        .glb-nav.prev { left: 18px; } .glb-nav.next { right: 18px; }
        .glb-strip { display: flex; gap: 8px; overflow-x: auto; padding: 16px 22px; flex-shrink: 0; }
        .glb-thumb { width: 72px; height: 54px; border-radius: 8px; overflow: hidden; flex-shrink: 0; cursor: pointer; opacity: 0.5; border: 2px solid transparent; transition: opacity .2s, border-color .2s; }
        .glb-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .glb-thumb.active { opacity: 1; border-color: #fff; }
        .glb-foot { text-align: center; padding: 0 22px 16px; }
        .glb-foot a { color: #9FB4E0; font-size: 0.84rem; font-weight: 600; }
        .glb-foot a:hover { color: #fff; }
        @media (max-width: 760px) { .g-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
