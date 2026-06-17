import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { useCountdown, KEXPO_DATE } from "../lib/ui";
import config from "../config";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/events", label: "Events" },
  { to: "/gallery", label: "Gallery" },
  { to: "/officers", label: "Officers" },
  { to: "/merch", label: "Merch" },
  { to: "/links", label: "Links" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const cd = useCountdown(KEXPO_DATE);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header>
      <nav className={"nav" + (scrolled ? " scrolled" : "")}>
        <div className="wrap nav__inner">
          <Link to="/" className="nav__brand" onClick={() => setOpen(false)}>
            <span className="nav__logo"><img src={config.PUB + "/images/logo_white.png"} alt="KSA" /></span>
            <span style={{ lineHeight: 1.05 }}>
              <b>KSA</b>
              <span>at UVA</span>
            </span>
          </Link>

          <div className="nav__links">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.to === "/"} className={({ isActive }) => "nav__link" + (isActive ? " active" : "")}>
                {n.label}<i className="ink" />
              </NavLink>
            ))}
          </div>

          {!cd.done && (
            <div className="nav__count" title="Countdown to K-EXPO">
              <span className="lbl">K-EXPO</span>
              <b>{cd.d}d {String(cd.h).padStart(2, "0")}h {String(cd.m).padStart(2, "0")}m</b>
            </div>
          )}

          <Link to="/join" className="btn btn--sm nav__cta">Join KSA</Link>

          <button className="nav__burger" aria-label="Menu" onClick={() => setOpen((o) => !o)}><span /></button>
        </div>
        {open && (
          <div className="nav__mobile wrap" style={{ maxWidth: "100%" }}>
            {[...NAV, { to: "/families", label: "Families" }, { to: "/join", label: "Join" }].map((n) => (
              <NavLink key={n.to} to={n.to} end={n.to === "/"} onClick={() => setOpen(false)} className={({ isActive }) => (isActive ? "active" : "")}>{n.label}</NavLink>
            ))}
          </div>
        )}
      </nav>
      <div className="flag-bar" />
    </header>
  );
}
