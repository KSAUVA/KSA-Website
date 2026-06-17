/* src/lib/ui.js — shared hooks & small components (no globals) */
import React, { useState, useEffect, useRef } from "react";

/* Motion gate: add html.motion, then probe whether CSS animations actually run.
   Call once from App. Keeps content visible if animations can't run. */
export function initMotion() {
  const H = document.documentElement;
  H.classList.add("motion");
  try {
    const s = document.createElement("style");
    s.textContent =
      "@keyframes __pb{from{opacity:.2}to{opacity:.9}}#__probe{position:fixed;left:-9px;top:-9px;width:1px;height:1px;pointer-events:none;opacity:.2;animation:__pb .08s linear forwards}";
    document.head.appendChild(s);
    const d = document.createElement("div");
    d.id = "__probe";
    document.body.appendChild(d);
    setTimeout(() => {
      const ok = parseFloat(getComputedStyle(d).opacity) > 0.5;
      if (!ok) H.classList.remove("motion");
      d.remove();
      s.remove();
    }, 160);
  } catch (e) {}
}

/* Scroll reveal — adds .in to .reveal elements as they enter the viewport. */
export function useReveal() {
  useEffect(() => {
    const reveal = () => {
      const h = window.innerHeight || 800;
      document.querySelectorAll(".reveal:not(.in)").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < h * 0.94 && r.bottom > -40) el.classList.add("in");
      });
    };
    reveal();
    const timers = [setTimeout(reveal, 120), setTimeout(reveal, 500), setTimeout(reveal, 1100)];
    window.addEventListener("scroll", reveal, { passive: true });
    window.addEventListener("resize", reveal);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("scroll", reveal);
      window.removeEventListener("resize", reveal);
    };
  });
}

/* Count-up number, triggers when scrolled into view. */
export function CountUp({ end, suffix = "", prefix = "", dur = 1600, className, plain = false }) {
  const ref = useRef(null);
  const [val, setVal] = useState(0);
  const done = useRef(false);
  useEffect(() => {
    const el = ref.current;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const run = () => {
      if (done.current || !el) return;
      const r = el.getBoundingClientRect();
      const h = window.innerHeight || 800;
      if (r.top > h * 0.95 || r.bottom < 0) return;
      done.current = true;
      if (reduce) { setVal(end); return; }
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        setVal(Math.round(end * eased));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      setTimeout(() => setVal(end), dur + 200);
    };
    run();
    const t = [setTimeout(run, 150), setTimeout(run, 600)];
    window.addEventListener("scroll", run, { passive: true });
    return () => { t.forEach(clearTimeout); window.removeEventListener("scroll", run); };
  }, [end, dur]);
  return <span ref={ref} className={className}>{prefix}{plain ? String(val) : val.toLocaleString()}{suffix}</span>;
}

/* Parallax translateY on scroll. */
export function useParallax(ref, factor = 0.18) {
  useEffect(() => {
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const offset = rect.top + rect.height / 2 - window.innerHeight / 2;
        el.style.transform = `translate3d(0, ${(-offset * factor).toFixed(1)}px, 0) scale(1.12)`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ref, factor]);
}

/* Countdown to a target Date. */
export function useCountdown(target) {
  const ts = target instanceof Date ? target.getTime() : +new Date(target);
  const calc = () => {
    const diff = ts - Date.now();
    if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0, done: true };
    return {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff / 3600000) % 24),
      m: Math.floor((diff / 60000) % 60),
      s: Math.floor((diff / 1000) % 60),
      done: false,
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => {
    setT(calc());
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, [ts]);
  return t;
}

export const KEXPO_DATE = new Date("2027-04-03T13:30:00");

/* Section header. */
export function SecHead({ eyebrow, han, title, sub, light, center }) {
  return (
    <div className={"sec-head reveal" + (center ? " center" : "")} style={center ? { marginLeft: "auto", marginRight: "auto", textAlign: "center" } : null}>
      <span className={"eyebrow" + (light ? " eyebrow--light" : "")}>
        <i className="kicker-dot" />{eyebrow}{han && <span className="han">{han}</span>}
      </span>
      <h2 className="h-xl" style={{ marginTop: 14 }}>{title}</h2>
      {sub && <p className="lead">{sub}</p>}
    </div>
  );
}
