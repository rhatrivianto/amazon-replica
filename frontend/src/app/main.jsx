import React from "react";
import ReactDOM from "react-dom/client";
import App from "../App";
import "../index.css";

console.log("🔧 Environment Check:", {
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  URL: import.meta.env.VITE_API_BASE_URL,
  VITE_NODE_ENV: import.meta.env.VITE_NODE_ENV,
  currentOrigin: window.location.origin,
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <App />
  </React.StrictMode>
);
