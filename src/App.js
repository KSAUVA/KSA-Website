import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { initMotion } from "./lib/ui";
import config from "./config";
import "./assets/css/theme.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Events from "./pages/Events";
import Gallery from "./pages/Gallery";
import Officers from "./pages/Officers";
import Merch from "./pages/Merch";
import Join from "./pages/Join";
import Links from "./pages/Links";
import Families from "./pages/Families";
import Pos from "./pages/Pos";

/* Loads the Square Web Payments SDK once. */
function useSquareSdk() {
  useEffect(() => {
    if (document.getElementById("sq-sdk")) return;
    const s = document.createElement("script");
    s.id = "sq-sdk";
    s.src = config.SQUARE_SDK;
    s.async = true;
    document.head.appendChild(s);
  }, []);
}

function Shell() {
  const loc = useLocation();
  const isPos = loc.pathname === "/pos";
  useEffect(() => { window.scrollTo(0, 0); }, [loc.pathname]);
  return (
    <div className="notranslate" translate="no" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {!isPos && <Navbar />}
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/officers" element={<Officers />} />
          <Route path="/merch" element={<Merch />} />
          <Route path="/join" element={<Join />} />
          <Route path="/links" element={<Links />} />
          <Route path="/families" element={<Families />} />
          <Route path="/pos" element={<Pos />} />
        </Routes>
      </div>
      {!isPos && <Footer />}
    </div>
  );
}

/* Discourage browser translation/grammar extensions from rewriting the React
   DOM — they swap text nodes out from under React and cause
   "removeChild: node is not a child" crashes on navigation. */
function useNoTranslate() {
  useEffect(() => {
    try {
      const html = document.documentElement;
      html.setAttribute("translate", "no");
      html.classList.add("notranslate");
      if (!document.querySelector('meta[name="google"][content="notranslate"]')) {
        const m = document.createElement("meta");
        m.name = "google";
        m.content = "notranslate";
        document.head.appendChild(m);
      }
    } catch (e) {}
  }, []);
}

export default function App() {
  useEffect(() => { initMotion(); }, []);
  useSquareSdk();
  useNoTranslate();
  return (
    <Router>
      <Shell />
    </Router>
  );
}
