import React from "react";
import { Link } from "react-router-dom";
import { Ico } from "../lib/icons";
import config from "../config";

export default function Footer() {
  const cols = [
    { h: "Explore", links: [["About", "/about"], ["Events", "/events"], ["Gallery", "/gallery"], ["Officers", "/officers"]] },
    { h: "Get Involved", links: [["Join KSA", "/join"], ["Merch", "/merch"], ["Families", "/families"], ["Links", "/links"]] },
  ];
  return (
    <footer className="footer">
      <img className="footer__seal" src={config.PUB + "/images/logo_white.png"} alt="" aria-hidden="true" />
      <div className="wrap">
        <div className="footer__grid">
          <div>
            <div className="footer__brand">
              <span className="nav__logo"><img src={config.PUB + "/images/logo_white.png"} alt="KSA" /></span>
              <b>KSA at UVA</b>
            </div>
            <p style={{ color: "#A9B6D6", fontSize: "0.92rem", maxWidth: 280, margin: "0 0 18px" }}>
              한인 학생회 · The Korean Student Association at the University of Virginia. Culture, community, and connection on Grounds.
            </p>
            <div className="footer__social">
              <a href="https://www.instagram.com/ksa.uva/" target="_blank" rel="noreferrer" aria-label="Instagram">{Ico.ig()}</a>
              <a href="https://www.youtube.com/channel/UCCrULtpfBAm2Mdq6qPHyGFQ" target="_blank" rel="noreferrer" aria-label="YouTube">{Ico.yt()}</a>
              <a href="https://www.facebook.com/ksaatuva" target="_blank" rel="noreferrer" aria-label="Facebook">{Ico.fb()}</a>
            </div>
          </div>
          {cols.map((c) => (
            <div className="footer__col" key={c.h}>
              <h5>{c.h}</h5>
              {c.links.map(([label, to]) => (<Link key={to} to={to}>{label}</Link>))}
            </div>
          ))}
          <div className="footer__col">
            <h5>Visit</h5>
            <p style={{ color: "#C2CCE4", fontSize: "0.92rem", margin: "0 0 14px" }}>
              University of Virginia<br />Charlottesville, VA
            </p>
            <Link to="/join" className="btn btn--sm" style={{ marginTop: 4 }}>Become a member</Link>
          </div>
        </div>
        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} Korean Student Association at UVA. Built by KSA Webmasters.</span>
          <span className="footer__staff">
            <Link to="/pos" title="Sales team register">Staff register</Link>
            <i>·</i> Made with 정 in Charlottesville
          </span>
        </div>
      </div>
    </footer>
  );
}
