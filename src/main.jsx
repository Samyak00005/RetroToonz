// src/main.jsx

import { inject } from "@vercel/analytics";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App.jsx";
import "./styles/globals.css";

inject();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <div className="font-sans">
      <App />
    </div>
  </React.StrictMode>,
);
