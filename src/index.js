import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// NOTE: StrictMode intentionally omitted — its dev-only double-mount amplifies
// DOM-reconciliation crashes when browser extensions (translate/Grammarly) are active.
ReactDOM.createRoot(document.getElementById("root")).render(<App />);

